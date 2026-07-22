# -*- coding: utf-8 -*-
"""
Serviço de integração server-side com RD Station (API V2 — OAuth 2.0).

Regras de uso:
- Todo formulário do site (EXCETO /contato) dispara envio ao RD Station.
- Cada tentativa gera um registro em RDStationLog visível no Wagtail.
- Falhas são registradas com causa provável legível pelo time de MKT, indicando
  se o problema é do nosso lado (reconectar) ou do lado do RD Station (aguardar/checar lá).
- Client Secret e tokens NUNCA são expostos ao frontend.
- A conexão é feita via OAuth em /admin/rdstation-connect/ (ver wagtail_hooks.py).
  O access_token é renovado automaticamente usando o refresh_token — o time de MKT
  só precisa reconectar manualmente se o refresh_token for revogado/expirar.
"""

import logging
import threading
from datetime import timedelta

import requests
from django.utils import timezone

logger = logging.getLogger('core.rdstation')

_OAUTH_TOKEN_URL = 'https://api.rd.services/auth/token'
_CONVERSIONS_URL = 'https://api.rd.services/platform/conversions'

# Mapeamento de código HTTP → causa humana para o MKT.
# Cada mensagem já indica de qual lado é o problema: nosso painel (reconectar)
# ou lado do RD Station (não é bug nosso, checar direto na conta RD).
_HTTP_CAUSAS = {
    400: '[Lado virtú] Dados inválidos enviados à API do RD Station. Verifique o payload — algum campo pode estar mal formatado. Se persistir, acione a TPI.',
    401: '[Lado virtú] Token OAuth expirado ou revogado e a renovação automática falhou. Acesse Logs de Integrações → RD Station e clique em "Reconectar com RD Station".',
    403: '[Lado RD Station] Sem permissão para usar este endpoint. Verifique as permissões do Aplicativo em appstore.rdstation.com.br (não é um problema do nosso site).',
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

_NAO_CONECTADO = ('[Lado virtú] RD Station não conectado via OAuth. Acesse Logs de Integrações → '
                   'RD Station e clique em "Conectar com RD Station".')
_REFRESH_FALHOU = ('[Lado virtú] Não foi possível renovar automaticamente o token do RD Station '
                    '(refresh_token revogado ou expirado). Acesse Logs de Integrações → RD Station '
                    'e clique em "Reconectar com RD Station".')


def _get_config():
    from .models import ConfiguracaoSite
    return ConfiguracaoSite.objects.first()


def _refresh_access_token(config) -> bool:
    """
    Troca o refresh_token por um novo access_token e salva no ConfiguracaoSite.
    Retorna True em caso de sucesso.
    """
    if not (config.rdstation_client_id and config.rdstation_client_secret and config.rdstation_refresh_token):
        return False

    try:
        response = requests.post(
            _OAUTH_TOKEN_URL,
            json={
                'client_id': config.rdstation_client_id,
                'client_secret': config.rdstation_client_secret,
                'refresh_token': config.rdstation_refresh_token,
            },
            timeout=10,
        )
    except requests.RequestException as e:
        logger.error(f'RD Station: falha de rede ao renovar token OAuth: {e}')
        return False

    if response.status_code not in (200, 201):
        logger.warning(f'RD Station: falha ao renovar token OAuth [{response.status_code}]: {response.text[:300]}')
        return False

    data = response.json()
    config.rdstation_access_token = data.get('access_token', '')
    config.rdstation_refresh_token = data.get('refresh_token') or config.rdstation_refresh_token
    expires_in = data.get('expires_in', 3600)
    config.rdstation_token_expira_em = timezone.now() + timedelta(seconds=expires_in)
    config.save(update_fields=['rdstation_access_token', 'rdstation_refresh_token', 'rdstation_token_expira_em'])
    logger.info('RD Station: token OAuth renovado com sucesso.')
    return True


def _get_valid_access_token(config):
    """
    Retorna um access_token válido, renovando via refresh_token se necessário.
    Retorna None se não houver conexão OAuth configurada ou a renovação falhar.
    """
    tem_cache_valido = (
        config.rdstation_access_token
        and config.rdstation_token_expira_em
        and config.rdstation_token_expira_em > timezone.now() + timedelta(seconds=60)
    )
    if tem_cache_valido:
        return config.rdstation_access_token

    if _refresh_access_token(config):
        return config.rdstation_access_token

    return None


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

    access_token = _get_valid_access_token(config)
    if not access_token:
        causa = _REFRESH_FALHOU if config.rdstation_refresh_token else _NAO_CONECTADO
        logger.info(f'RD Station: lead não enviado — {causa}')
        _salvar_log(
            lead_data, identificador or '', 'inativo',
            causa=causa, lead_obj=lead_obj
        )
        return False

    conversion_id = identificador or config.rdstation_conversao_identificador or 'site-virtu'

    url = _CONVERSIONS_URL
    # A API de Conversões do RD Station (diferente de outros endpoints V2) não aceita
    # o access_token via header Authorization — ela exige o token como parâmetro
    # `api_key` na query string. Confirmado em produção: enviar só via Bearer resulta
    # em 401 "Unauthorized api_key provided" com path "query_string.api_key".
    params = {'api_key': access_token}
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
