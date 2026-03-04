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
    HomePage, EmpreendimentoPage, SobreNosPage,
    Planta, GaleriaImagem, AndamentoObra, FotoObra,
    Lead, Newsletter
)
from .serializers import (
    CidadeSerializer, StatusSerializer, DiferencialSerializer,
    DepoimentoSerializer, ConfiguracaoSerializer,
    EmpreendimentoCardSerializer, EmpreendimentoDetalheSerializer,
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
    """API pública: Configurações do site"""
    permission_classes = [AllowAny]

    def get(self, request):
        config = ConfiguracaoSite.objects.first()
        if config:
            return Response(ConfiguracaoSerializer(config).data)
        return Response({
            'email': 'contato@virtu.com.br',
            'telefone': '(11) 99999-9999',
            'whatsapp': '',
            'endereco': '',
            'facebook': '',
            'instagram': '',
            'linkedin': '',
            'youtube': '',
            'copyright_texto': '© 2025 Todos os direitos reservados - virtú'
        })


class LeadCreateView(generics.CreateAPIView):
    """
    API pública: Envio de formulário (lead)
    Conforme documentação
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        lead = serializer.save()
        return Response(
            {'message': 'Lead criado com sucesso', 'id': lead.id},
            status=status.HTTP_201_CREATED
        )


class NewsletterCreateView(generics.CreateAPIView):
    """API pública: Inscrição na newsletter"""
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [AllowAny]

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
