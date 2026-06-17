# -*- coding: utf-8 -*-
"""
Views da API REST do site Virtú
Conforme documentação: APIs públicas e internas
"""

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import (
    Cidade, StatusEmpreendimento, Diferencial, Depoimento, ConfiguracaoSite,
    HomePage, EmpreendimentoPage, EmpreendimentosIndexPage, SobreNosPage, ContatoPage,
    PoliticaPrivacidadePage, CategoriaContato, ContatoFormulario,
    Planta, GaleriaImagem, AndamentoObra, FotoObra,
    Lead, Newsletter
)
from .serializers import (
    CidadeSerializer, StatusSerializer, DiferencialSerializer,
    DepoimentoSerializer, ConfiguracaoSerializer, TrackingSerializer,
    EmpreendimentoCardSerializer, EmpreendimentoDetalheSerializer,
    EmpreendimentosIndexPageSerializer,
    PlantaSerializer, GaleriaImagemSerializer, AndamentoObraSerializer,
    HomePageSerializer, SobreNosSerializer,
    LeadSerializer, LeadListSerializer, NewsletterSerializer
)


# =============================================================================
# APIs PÚBLICAS (para o front-end) - Conforme documentação seção 5.1
# =============================================================================

class CidadeViewSet(viewsets.ReadOnlyModelViewSet):
    """API pública: Lista de cidades"""
    queryset = Cidade.objects.filter(ativo=True)
    serializer_class = CidadeSerializer
    permission_classes = [AllowAny]


class StatusViewSet(viewsets.ReadOnlyModelViewSet):
    """API pública: Status de empreendimentos"""
    queryset = StatusEmpreendimento.objects.all()
    serializer_class = StatusSerializer
    permission_classes = [AllowAny]


class DiferencialViewSet(viewsets.ReadOnlyModelViewSet):
    """API pública: Diferenciais dos empreendimentos"""
    serializer_class = DiferencialSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Diferencial.objects.filter(ativo=True)
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        return queryset


class DepoimentoViewSet(viewsets.ReadOnlyModelViewSet):
    """API pública: Depoimentos de clientes"""
    serializer_class = DepoimentoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Depoimento.objects.filter(ativo=True)
        destaque = self.request.query_params.get('destaque')
        if destaque and destaque.lower() == 'true':
            queryset = queryset.filter(destaque=True)
        return queryset


class EmpreendimentoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API pública: Empreendimentos
    Conforme documentação:
    - Listagem de empreendimentos
    - Detalhamento completo
    - Plantas por empreendimento
    - Diferenciais associados
    - Galeria de imagens
    - Andamento da obra + fotos
    """
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmpreendimentoDetalheSerializer
        return EmpreendimentoCardSerializer

    def get_queryset(self):
        queryset = EmpreendimentoPage.objects.live().public().order_by('ordem', '-first_published_at')

        # Filtro por cidade
        cidade = self.request.query_params.get('cidade')
        if cidade:
            queryset = queryset.filter(cidade_id=cidade)

        # Filtro por status
        status_slug = self.request.query_params.get('status')
        if status_slug:
            queryset = queryset.filter(status__slug=status_slug)

        # Filtro por destaque
        destaque = self.request.query_params.get('destaque')
        if destaque and destaque.lower() == 'true':
            queryset = queryset.filter(destaque=True)

        return queryset

    def retrieve(self, request, pk=None):
        """Detalhamento completo do empreendimento"""
        try:
            if pk.isdigit():
                emp = EmpreendimentoPage.objects.live().public().get(id=pk)
            else:
                emp = EmpreendimentoPage.objects.live().public().get(slug=pk)
        except EmpreendimentoPage.DoesNotExist:
            return Response({'error': 'Empreendimento não encontrado'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmpreendimentoDetalheSerializer(emp)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def destaques(self, request):
        """Lista empreendimentos em destaque"""
        queryset = self.get_queryset().filter(destaque=True)
        serializer = EmpreendimentoCardSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='por-cidade')
    def por_cidade(self, request):
        """Empreendimentos agrupados por cidade"""
        result = []
        cidades = Cidade.objects.filter(ativo=True)
        for cidade in cidades:
            emps = EmpreendimentoPage.objects.live().public().filter(cidade=cidade)
            if emps.exists():
                result.append({
                    'cidade': CidadeSerializer(cidade).data,
                    'empreendimentos': EmpreendimentoCardSerializer(emps, many=True).data
                })
        return Response(result)

    @action(detail=True, methods=['get'])
    def plantas(self, request, pk=None):
        """Plantas do empreendimento"""
        try:
            emp = EmpreendimentoPage.objects.live().public().get(pk=pk)
            serializer = PlantaSerializer(emp.plantas.all(), many=True)
            return Response(serializer.data)
        except EmpreendimentoPage.DoesNotExist:
            return Response({'error': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def diferenciais(self, request, pk=None):
        """Diferenciais associados ao empreendimento"""
        try:
            emp = EmpreendimentoPage.objects.live().public().get(pk=pk)
            serializer = DiferencialSerializer(emp.diferenciais.filter(ativo=True), many=True)
            return Response(serializer.data)
        except EmpreendimentoPage.DoesNotExist:
            return Response({'error': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def galeria(self, request, pk=None):
        """Galeria de imagens do empreendimento"""
        try:
            emp = EmpreendimentoPage.objects.live().public().get(pk=pk)
            serializer = GaleriaImagemSerializer(emp.galeria_imagens.all(), many=True)
            return Response(serializer.data)
        except EmpreendimentoPage.DoesNotExist:
            return Response({'error': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'], url_path='andamento-obra')
    def andamento_obra(self, request, pk=None):
        """Andamento da obra + fotos"""
        try:
            emp = EmpreendimentoPage.objects.live().public().get(pk=pk)
            serializer = AndamentoObraSerializer(emp.andamentos_obra.all(), many=True)
            return Response(serializer.data)
        except EmpreendimentoPage.DoesNotExist:
            return Response({'error': 'Não encontrado'}, status=status.HTTP_404_NOT_FOUND)


class EmpreendimentosIndexPageView(APIView):
    """API pública: Dados da página de empreendimentos (hero_imagem editável no backoffice)"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            page = EmpreendimentosIndexPage.objects.live().first()
            if not page:
                return Response({}, status=status.HTTP_404_NOT_FOUND)
            return Response(EmpreendimentosIndexPageSerializer(page).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class HomePageView(APIView):
    """API pública: Dados da página inicial"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            home = HomePage.objects.live().first()
            if not home:
                return Response({'error': 'Página não encontrada'}, status=status.HTTP_404_NOT_FOUND)

            data = HomePageSerializer(home).data
            data['depoimentos'] = DepoimentoSerializer(
                Depoimento.objects.filter(ativo=True, destaque=True)[:4],
                many=True
            ).data

            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ContatoPageView(APIView):
    """API pública: Dados da página de contato"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            page = ContatoPage.objects.live().first()
            if not page:
                return Response({}, status=status.HTTP_404_NOT_FOUND)
            hero_imagem = None
            if page.hero_imagem:
                try:
                    hero_imagem = {'url': page.hero_imagem.file.url, 'alt': page.hero_imagem.title}
                except Exception:
                    pass
            return Response({
                'hero_titulo': page.hero_titulo,
                'hero_subtitulo': page.hero_subtitulo,
                'hero_imagem': hero_imagem,
                'form_titulo': page.form_titulo,
                'secao_titulo': page.secao_titulo,
                'horario_semana': page.horario_semana,
                'horario_fim_semana': page.horario_fim_semana,
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SobreNosView(APIView):
    """API pública: Dados da página sobre nós"""
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            page = SobreNosPage.objects.live().first()
            if not page:
                return Response({'error': 'Página não encontrada'}, status=status.HTTP_404_NOT_FOUND)
            return Response(SobreNosSerializer(page).data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConfiguracaoView(APIView):
    """API pública: Configurações do site (EXCLUI tokens privados)"""
    permission_classes = [AllowAny]

    def get(self, request):
        config = ConfiguracaoSite.objects.first()
        if config:
            return Response(ConfiguracaoSerializer(config).data)
        return Response({
            'email': 'contato@virtu.com.br',
            'telefone': '(11) 99999-9999',
            'whatsapp': '', 'endereco': '',
            'facebook': '', 'instagram': '', 'linkedin': '', 'youtube': '',
            'copyright_texto': '© 2025 Todos os direitos reservados - virtú'
        })


class TrackingView(APIView):
    """
    API pública: Retorna APENAS os IDs públicos de tracking.
    SEGURANÇA: Nenhum token privado é retornado.
    O rdstation_api_token NUNCA sai do backend.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        config = ConfiguracaoSite.objects.first()
        if not config:
            return Response({
                'gtm_ativo': False, 'gtm_container_id': '',
                'rdstation_ativo': False, 'rdstation_public_token': '',
                'meta_pixel_ativo': False, 'meta_pixel_id': '',
                'ga4_ativo': False, 'ga4_measurement_id': '',
            })
        return Response(TrackingSerializer(config).data)


class LeadCreateView(generics.CreateAPIView):
    """
    API pública: Envio de formulário (lead)
    Após salvar no banco, envia ao RD Station via thread (server-side, sem expor token).
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()

        # Envia ao RD Station em background APENAS para origens que não são o formulário de contato
        # Regra: todo formulário exceto pagina_origem='/contato' ou origem='contato' envia ao RD
        pagina = lead.pagina_origem or ''
        origem = lead.origem or ''
        is_contato = pagina.rstrip('/') == '/contato' or origem in ('contato', 'fale_conosco', 'fale-conosco')

        if not is_contato:
            # Define identificador de conversão por origem para segmentação no RD Station
            _id_map = {
                'banner_cta':          'virtu-banner-cta',
                'empreendimento':      'virtu-empreendimento',
                'sobre_nos':           'virtu-sobre-nos',
                'encontre_imovel':     'virtu-encontre-imovel',
            }
            identificador = _id_map.get(origem)
            if not identificador:
                if lead.empreendimento:
                    identificador = f'virtu-emp-{lead.empreendimento.slug}'
                else:
                    identificador = 'virtu-site'

            from .integrations import enviar_lead_rdstation_async
            rd_data = {
                'nome': lead.nome,
                'email': lead.email,
                'telefone': lead.telefone,
                'mensagem': lead.mensagem,
                'empreendimento_nome': lead.empreendimento.title if lead.empreendimento else '',
                'pagina_origem': lead.pagina_origem,
                'origem': lead.origem,
                'utm_source': lead.utm_source,
                'utm_medium': lead.utm_medium,
                'utm_campaign': lead.utm_campaign,
            }
            enviar_lead_rdstation_async(rd_data, identificador=identificador, lead_obj=lead)

        return Response(
            {'message': 'Lead criado com sucesso', 'id': lead.id},
            status=status.HTTP_201_CREATED
        )


class NewsletterCreateView(generics.CreateAPIView):
    """API pública: Inscrição na newsletter"""
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        newsletter, created = Newsletter.objects.get_or_create(
            email=email,
            defaults={'ativo': True}
        )
        if not created and not newsletter.ativo:
            newsletter.ativo = True
            newsletter.save()
        return Response({'message': 'Inscrição realizada com sucesso'}, status=status.HTTP_201_CREATED)


# =============================================================================
# APIs INTERNAS (administrativas) - Conforme documentação seção 5.2
# Requer autenticação
# =============================================================================

class LeadAdminViewSet(viewsets.ModelViewSet):
    """
    API interna: CRUD de Leads
    Conforme documentação: geralmente somente leitura, mas com opções de atualização
    """
    queryset = Lead.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return LeadSerializer
        return LeadListSerializer

    @action(detail=False, methods=['get'])
    def exportar(self, request):
        """Exportar leads para CSV (retorna dados estruturados)"""
        leads = self.get_queryset()
        data = LeadListSerializer(leads, many=True).data
        return Response(data)

    @action(detail=True, methods=['post'])
    def marcar_lido(self, request, pk=None):
        """Marcar lead como lido"""
        lead = self.get_object()
        lead.lido = True
        lead.save()
        return Response({'message': 'Lead marcado como lido'})

    @action(detail=True, methods=['post'])
    def atualizar_status(self, request, pk=None):
        """Atualizar status do lead"""
        lead = self.get_object()
        novo_status = request.data.get('status')
        if novo_status in dict(Lead._meta.get_field('status').choices):
            lead.status = novo_status
            lead.save()
            return Response({'message': f'Status atualizado para {novo_status}'})
        return Response({'error': 'Status inválido'}, status=status.HTTP_400_BAD_REQUEST)


class DiferencialAdminViewSet(viewsets.ModelViewSet):
    """API interna: CRUD de Diferenciais"""
    queryset = Diferencial.objects.all()
    serializer_class = DiferencialSerializer
    permission_classes = [IsAdminUser]


class DepoimentoAdminViewSet(viewsets.ModelViewSet):
    """API interna: CRUD de Depoimentos"""
    queryset = Depoimento.objects.all()
    serializer_class = DepoimentoSerializer
    permission_classes = [IsAdminUser]


# =============================================================================
# FALE CONOSCO — Categorias dinâmicas
# =============================================================================

class CategoriasContatoView(APIView):
    """API pública: Lista categorias ativas com seus campos"""
    permission_classes = [AllowAny]

    def get(self, request):
        categorias = CategoriaContato.objects.filter(ativo=True)
        data = []
        for cat in categorias:
            campos = []
            for campo in cat.campos.all().order_by('sort_order'):
                campos.append({
                    'label': campo.label,
                    'tipo': campo.tipo,
                    'placeholder': campo.placeholder,
                    'obrigatorio': campo.obrigatorio,
                    'opcoes': [o.strip() for o in campo.opcoes.split('\n') if o.strip()] if campo.opcoes else [],
                })
            data.append({
                'id': cat.id,
                'nome': cat.nome,
                'slug': cat.slug,
                'campos': campos,
            })
        return Response(data)


class ContatoFormularioCreateView(APIView):
    """API pública: Recebe formulário do Fale Conosco e envia e-mail para a categoria"""
    permission_classes = [AllowAny]

    def post(self, request):
        import threading
        from django.core.mail import send_mail
        from django.conf import settings

        categoria_id = request.data.get('categoria_id')
        nome = request.data.get('nome', '')
        email = request.data.get('email', '')
        telefone = request.data.get('telefone', '')
        dados = request.data.get('dados', {})

        if not nome or not email:
            return Response({'error': 'Nome e e-mail são obrigatórios.'}, status=400)

        categoria = None
        email_destino = None
        if categoria_id:
            try:
                categoria = CategoriaContato.objects.get(id=categoria_id, ativo=True)
                email_destino = categoria.email_destino
            except CategoriaContato.DoesNotExist:
                pass

        # Salva no banco
        formulario = ContatoFormulario.objects.create(
            categoria=categoria,
            nome=nome,
            email=email,
            telefone=telefone,
            dados=dados,
            email_enviado_para=email_destino or '',
        )

        # Envia e-mail em background
        if email_destino:
            def enviar():
                try:
                    linhas = [f"Nome: {nome}", f"E-mail: {email}"]
                    if telefone:
                        linhas.append(f"Telefone: {telefone}")
                    if categoria:
                        linhas.append(f"Categoria: {categoria.nome}")
                    for campo, valor in (dados or {}).items():
                        linhas.append(f"{campo}: {valor}")
                    corpo = "\n".join(linhas)
                    send_mail(
                        subject=f"[Fale Conosco] {categoria.nome if categoria else 'Contato'} — {nome}",
                        message=corpo,
                        from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@virtu.com.br'),
                        recipient_list=[email_destino],
                        fail_silently=True,
                    )
                except Exception:
                    pass
            threading.Thread(target=enviar, daemon=True).start()

        return Response({'message': 'Formulário enviado com sucesso.', 'id': formulario.id}, status=201)


class PoliticaPrivacidadeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            from wagtail.rich_text import expand_db_html
            page = PoliticaPrivacidadePage.objects.live().first()
            if not page:
                return Response({'error': 'Página não encontrada'}, status=404)
            return Response({
                'titulo': page.hero_titulo,
                'ultima_atualizacao': page.ultima_atualizacao,
                'conteudo': expand_db_html(page.conteudo),
            })
        except Exception as e:
            return Response({'error': str(e)}, status=500)
