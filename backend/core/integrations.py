# -*- coding: utf-8 -*-
"""
Serviço de integração server-side com RD Station.

Regras de uso:
- Todo formulário do site (EXCETO /contato) dispara envio ao RD Station.
- Cada tentativa gera um registro em RDStationLog visível no Wagtail.
- Falhas são registradas com causa provável legível pelo time de MKT, indicando
  se o problema é do nosso lado ou do lado do RD Station (aguardar/checar lá).
- O envio de conversões usa a "API Key" dedicada do RD Station (campo
  rdstation_api_key_conversao), enviada como parâmetro `api_key` na query
  string — mecanismo próprio da API de Conversões, independente do OAuth
  (Client ID/Secret) usado em /admin/rdstation-connect/ para outras integrações.
  Essa API Key não expira, então não há renovação automática a fazer aqui.
"""

import logging
import threading

import requests

logger = logging.getLogger('core.rdstation')

_CONVERSIONS_URL = 'https://api.rd.services/platform/conversions'

# Mapeamento de código HTTP → causa humana para o MKT.
# Cada mensagem já indica de qual lado é o problema: nosso painel (corrigir a API Key)
# ou lado do RD Station (não é bug nosso, checar direto na conta RD).
_HTTP_CAUSAS = {
    400: '[Lado virtú] Dados inválidos enviados à API do RD Station. Verifique o payload — algum campo pode estar mal formatado. Se persistir, acione a TPI.',
    401: '[Lado virtú] API Key de conversão inválida ou revogada. Gere uma nova em RD Station → App Store → App Publisher → "Gerar chave de API" e cole em Configurações do Site → 🔧 RD Station → API Key (Conversões).',
    403: '[Lado RD Station] Sem permissão para usar este endpoint. Verifique as permissões da API Key na conta RD Station (não é um problema do nosso site).',
    404: '[Lado virtú] Endpoint da API do RD Station não encontrado. A URL da API pode ter mudado — acione a TPI.',
    409: '[Lado RD Station] Conflito: o identificador de conversão já existe com configurações diferentes. Verifique em RD Station → Automação → Conversões.',
    422: '[Lado RD Station] Dados não processados pelo RD Station — normalmente e-mail do lead inválido. Não é um problema do nosso site.',
    429: '[Lado RD Station] Limite de requisições atingido (rate limit) na conta RD Station. Aguarde alguns minutos — não é um problema do nosso site.',
    500: '[Lado RD Station] Erro interno do servidor do RD Station. Não é um problema nosso — aguarde e tente novamente.',
    503: '[Lado RD Station] Serviço do RD Station indisponível temporariamente. Verifique status.rdstation.com.br — não é um problema do nosso site.',
}

_EXCEPTION_CAUSAS = {
    'ConnectionError': '[Lado virtú] Sem conexão com a API do RD Station. Verifique se o servidor tem acesso à internet — acione a TPI.',
    'Timeout': '[Lado RD Station] A requisição ao RD Station demorou mais de 10 segundos. Provável instabilidade na API deles.',
    'SSLError': '[Lado virtú] Erro de certificado SSL ao conectar ao RD Station. Acione a TPI.',
    'default': '[Lado virtú] Erro desconhecido ao conectar ao RD Station. Verifique os logs técnicos do servidor.',
}

_API_KEY_NAO_CONFIGURADA = ('[Lado virtú] API Key de conversão do RD Station não configurada. Gere uma em '
                            'RD Station → App Store → App Publisher → "Gerar chave de API" e cole em '
                            'Configurações do Site → 🔧 RD Station → API Key (Conversões).')


def _get_config():
    from .models import ConfiguracaoSite
    return ConfiguracaoSite.objects.first()


def _salvar_log(lead_data: dict, identificador: str, status: str, http_code=None,
                resposta='', erro='', causa='', payload=None, lead_obj=None):
    """Persiste um RDStationLog de forma segura (não falha se o DB der erro)."""
    try:
        from .models import RDStationLog
        RDStationLog.objects.create(
            lead=lead_obj,
            email_lead=lead_data.get('email', ''),
            nome_lead=lead_data.get('nome', ''),
            pagina_origem=lead_data.get('pagina_origem', ''),
            identificador_conversao=identificador or '',
            status=status,
            http_status_code=http_code,
            resposta_api=resposta[:2000] if resposta else '',
            mensagem_erro=erro[:1000] if erro else '',
            causa_provavel=causa,
            payload_enviado=payload,
        )
    except Exception as e:
        logger.error(f'Falha ao salvar RDStationLog: {e}')


def enviar_lead_rdstation(lead_data: dict, identificador: str = None, lead_obj=None):
    """
    Envia conversão de lead para o RD Station via API server-side.
    Registra sucesso ou falha em RDStationLog.

    Args:
        lead_data: dict com nome, email, telefone, etc.
        identificador: identificador da conversão (ex: 'form-empreendimento')
        lead_obj: instância de Lead (opcional, para vincular no log)

    Returns:
        True se sucesso, False se falha
    """
    config = _get_config()

    if not config or not config.rdstation_ativo:
        motivo = 'RD Station inativo nas configurações'
        logger.info(f'RD Station: lead não enviado — {motivo}')
        _salvar_log(
            lead_data, identificador or '', 'inativo',
            causa=motivo, lead_obj=lead_obj
        )
        return False

    api_key = config.rdstation_api_key_conversao
    if not api_key:
        logger.info(f'RD Station: lead não enviado — {_API_KEY_NAO_CONFIGURADA}')
        _salvar_log(
            lead_data, identificador or '', 'inativo',
            causa=_API_KEY_NAO_CONFIGURADA, lead_obj=lead_obj
        )
        return False

    conversion_id = identificador or config.rdstation_conversao_identificador or 'site-virtu'

    url = _CONVERSIONS_URL
    # A API de Conversões do RD Station usa uma "API Key" própria (não expira),
    # enviada como parâmetro `api_key` na query string — não é o mesmo mecanismo
    # do OAuth (Client ID/Secret) usado em outras integrações.
    params = {'api_key': api_key}
    headers = {
        'Content-Type': 'application/json',
    }
    payload = {
        'event_type': 'CONVERSION',
        'event_family': 'CDP',
        'payload': {
            k: v for k, v in {
                'conversion_identifier': conversion_id,
                'name': lead_data.get('nome', ''),
                'email': lead_data.get('email', ''),
                'personal_phone': lead_data.get('telefone', ''),
                'cf_mensagem': lead_data.get('mensagem', ''),
                'cf_empreendimento': lead_data.get('empreendimento_nome', ''),
                'cf_pagina_origem': lead_data.get('pagina_origem', ''),
                'cf_origem': lead_data.get('origem', ''),
                'traffic_source': lead_data.get('utm_source', ''),
                'traffic_medium': lead_data.get('utm_medium', ''),
                'traffic_campaign': lead_data.get('utm_campaign', ''),
            }.items() if v
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, params=params, timeout=10)
        resp_text = response.text[:2000]

        if response.status_code in (200, 201):
            logger.info(f'RD Station OK: {lead_data.get("email")} [{conversion_id}]')
            _salvar_log(
                lead_data, conversion_id, 'sucesso',
                http_code=response.status_code,
                resposta=resp_text,
                payload=payload,
                lead_obj=lead_obj,
            )
            return True
        else:
            causa = _HTTP_CAUSAS.get(
                response.status_code,
                f'Erro HTTP {response.status_code} desconhecido. Repasse o código à TPI.'
            )
            logger.warning(
                f'RD Station FALHOU [{response.status_code}] para {lead_data.get("email")}: {resp_text[:300]}'
            )
            _salvar_log(
                lead_data, conversion_id, 'falha',
                http_code=response.status_code,
                resposta=resp_text,
                causa=causa,
                payload=payload,
                lead_obj=lead_obj,
            )
            return False

    except requests.exceptions.ConnectionError as e:
        msg = str(e)[:500]
        logger.error(f'RD Station ConnectionError: {msg}')
        _salvar_log(lead_data, conversion_id, 'falha', erro=msg,
                    causa=_EXCEPTION_CAUSAS['ConnectionError'],
                    payload=payload, lead_obj=lead_obj)
        return False

    except requests.exceptions.Timeout as e:
        msg = str(e)[:500]
        logger.error(f'RD Station Timeout: {msg}')
        _salvar_log(lead_data, conversion_id, 'falha', erro=msg,
                    causa=_EXCEPTION_CAUSAS['Timeout'],
                    payload=payload, lead_obj=lead_obj)
        return False

    except requests.exceptions.SSLError as e:
        msg = str(e)[:500]
        logger.error(f'RD Station SSLError: {msg}')
        _salvar_log(lead_data, conversion_id, 'falha', erro=msg,
                    causa=_EXCEPTION_CAUSAS['SSLError'],
                    payload=payload, lead_obj=lead_obj)
        return False

    except requests.RequestException as e:
        msg = str(e)[:500]
        logger.error(f'RD Station erro inesperado: {msg}')
        _salvar_log(lead_data, conversion_id, 'falha', erro=msg,
                    causa=_EXCEPTION_CAUSAS['default'],
                    payload=payload, lead_obj=lead_obj)
        return False


def enviar_lead_rdstation_async(lead_data: dict, identificador: str = None, lead_obj=None):
    """Versão assíncrona — dispara em thread separada para não bloquear o response."""
    thread = threading.Thread(
        target=enviar_lead_rdstation,
        kwargs={'lead_data': lead_data, 'identificador': identificador, 'lead_obj': lead_obj},
        daemon=True,
    )
    thread.start()
