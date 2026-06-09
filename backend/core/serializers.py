# -*- coding: utf-8 -*-
"""
Serializers para a API REST do site Virtú
"""

from rest_framework import serializers
from .models import (
    Cidade, StatusEmpreendimento, Parceiro, Diferencial, Depoimento, ConfiguracaoSite,
    HomePage, EmpreendimentosIndexPage, EmpreendimentoPage, SobreNosPage,
    Planta, GaleriaImagem, AndamentoObra, FotoObra,
    Lead, Newsletter,
    HeroBannerImagem, SeloQualidade,
)


def get_image_url(image, rendition_spec=None):
    """Helper para obter URL de imagem com rendition opcional"""
    if not image:
        return None
    try:
        if rendition_spec:
            rendition = image.get_rendition(rendition_spec)
            return {
                'url': rendition.url,
                'alt': image.title,
                'width': rendition.width,
                'height': rendition.height,
            }
        return {
            'url': image.file.url,
            'alt': image.title,
            'width': image.width,
            'height': image.height,
        }
    except Exception:
        return None


# =============================================================================
# SERIALIZERS DE SNIPPETS
# =============================================================================

class CidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cidade
        fields = ['id', 'nome', 'estado']


class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusEmpreendimento
        fields = ['id', 'nome', 'slug', 'cor_badge']


class ParceiroSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Parceiro
        fields = ['id', 'nome', 'logo', 'site']

    def get_logo(self, obj):
        return get_image_url(obj.logo, 'max-200x100')


class DiferencialSerializer(serializers.ModelSerializer):
    icone = serializers.SerializerMethodField()

    class Meta:
        model = Diferencial
        fields = ['id', 'nome', 'descricao', 'icone', 'categoria']

    def get_icone(self, obj):
        return get_image_url(obj.icone, 'max-100x100')


class DepoimentoSerializer(serializers.ModelSerializer):
    foto = serializers.SerializerMethodField()

    class Meta:
        model = Depoimento
        fields = ['id', 'nome', 'cargo', 'foto', 'texto', 'avaliacao']

    def get_foto(self, obj):
        return get_image_url(obj.foto, 'fill-100x100')


class ConfiguracaoSerializer(serializers.ModelSerializer):
    """
    Serializer PÚBLICO para configurações do site.
    SEGURANÇA: Exclui rdstation_api_token que NUNCA deve ser exposto no frontend.
    """
    banner_cta_imagem = serializers.SerializerMethodField()
    banner_cta_wrapper_imagem = serializers.SerializerMethodField()

    class Meta:
        model = ConfiguracaoSite
        exclude = ['rdstation_api_token']  # ⚠️ Token privado NUNCA exposto

    def get_banner_cta_imagem(self, obj):
        return get_image_url(obj.banner_cta_imagem)

    def get_banner_cta_wrapper_imagem(self, obj):
        return get_image_url(obj.banner_cta_wrapper_imagem)

    def get_banner_logo_parceiro(self, obj):
        return get_image_url(obj.banner_logo_parceiro)

    def get_banner_logo_virtu(self, obj):
        return get_image_url(obj.banner_logo_virtu)


class TrackingSerializer(serializers.Serializer):
    """
    Serializer que retorna APENAS IDs públicos de tracking.
    Usado pelo frontend para injetar scripts GTM, RD Station JS, Meta Pixel, GA4.
    Nenhuma credencial privada (api_token, secret) é incluída.
    """
    gtm_ativo = serializers.BooleanField()
    gtm_container_id = serializers.CharField(allow_blank=True)
    rdstation_ativo = serializers.BooleanField()
    rdstation_public_token = serializers.CharField(allow_blank=True)
    meta_pixel_ativo = serializers.BooleanField()
    meta_pixel_id = serializers.CharField(allow_blank=True)
    ga4_ativo = serializers.BooleanField()
    ga4_measurement_id = serializers.CharField(allow_blank=True)


# =============================================================================
# SERIALIZERS DE EMPREENDIMENTO
# =============================================================================

class PlantaSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()
    caracteristicas = serializers.SerializerMethodField()

    class Meta:
        model = Planta
        fields = ['id', 'nome', 'dormitorios', 'metragem', 'imagem', 'descricao', 'caracteristicas']

    def get_imagem(self, obj):
        return get_image_url(obj.imagem)

    def get_caracteristicas(self, obj):
        return obj.get_caracteristicas_list()


class GaleriaImagemSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()
    thumb = serializers.SerializerMethodField()

    class Meta:
        model = GaleriaImagem
        fields = ['id', 'imagem', 'thumb', 'descricao']

    def get_imagem(self, obj):
        return get_image_url(obj.imagem)

    def get_thumb(self, obj):
        return get_image_url(obj.imagem, 'fill-400x300')


class AndamentoObraSerializer(serializers.ModelSerializer):
    class Meta:
        model = AndamentoObra
        fields = ['id', 'titulo', 'percentual']


class FotoObraSerializer(serializers.ModelSerializer):
    imagem = serializers.SerializerMethodField()

    class Meta:
        model = FotoObra
        fields = ['id', 'imagem', 'data_captura', 'descricao']

    def get_imagem(self, obj):
        return get_image_url(obj.imagem, 'fill-600x400')


class EmpreendimentoCardSerializer(serializers.ModelSerializer):
    """Serializer resumido para listagens"""
    status = StatusSerializer()
    cidade = CidadeSerializer()
    imagem_principal = serializers.SerializerMethodField()
    imagem_futuros_lancamentos = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = EmpreendimentoPage
        fields = [
            'id', 'title', 'slug', 'url', 'status', 'cidade',
            'descricao_curta', 'preco_a_partir', 'metragem_a_partir',
            'dormitorios', 'caracteristicas_resumo', 'imagem_principal',
            'imagem_futuros_lancamentos',
            'data_entrega', 'destaque', 'futuro_lancamento', 'ordem',
        ]

    def get_imagem_principal(self, obj):
        return get_image_url(obj.imagem_principal, 'fill-600x400')

    def get_imagem_futuros_lancamentos(self, obj):
        # Usa imagem específica se cadastrada, senão fallback para imagem principal
        if obj.imagem_futuros_lancamentos:
            return get_image_url(obj.imagem_futuros_lancamentos)
        return get_image_url(obj.imagem_principal)

    def get_url(self, obj):
        return obj.url


class EmpreendimentoDetalheSerializer(serializers.ModelSerializer):
    """Serializer completo para detalhe"""
    status = StatusSerializer()
    cidade = CidadeSerializer()
    parceiros = ParceiroSerializer(many=True)
    diferenciais = DiferencialSerializer(many=True)
    imagem_principal = serializers.SerializerMethodField()
    imagem_hero = serializers.SerializerMethodField()
    logo = serializers.SerializerMethodField()
    video_thumbnail = serializers.SerializerMethodField()
    galeria_imagens = GaleriaImagemSerializer(many=True, read_only=True)
    plantas = PlantaSerializer(many=True, read_only=True)
    andamentos_obra = AndamentoObraSerializer(many=True, read_only=True)
    fotos_obra = FotoObraSerializer(many=True, read_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = EmpreendimentoPage
        fields = [
            'id', 'title', 'slug', 'url',
            'status', 'cidade', 'parceiros', 'diferenciais',
            'subtitulo', 'descricao_curta', 'descricao',
            'localizacao', 'endereco', 'bairro', 'latitude', 'longitude',
            'data_entrega',
            'preco_a_partir', 'metragem_a_partir', 'dormitorios', 'caracteristicas_resumo',
            'imagem_principal', 'imagem_hero', 'logo',
            'video_url', 'video_thumbnail',
            'galeria_imagens', 'plantas', 'andamentos_obra', 'fotos_obra',
        ]

    def get_imagem_principal(self, obj):
        return get_image_url(obj.imagem_principal)

    def get_imagem_hero(self, obj):
        return get_image_url(obj.imagem_hero)

    def get_logo(self, obj):
        return get_image_url(obj.logo)

    def get_video_thumbnail(self, obj):
        return get_image_url(obj.video_thumbnail, 'fill-800x450')

    def get_url(self, obj):
        return obj.url


# =============================================================================
# SERIALIZERS DE PÁGINAS
# =============================================================================

class HomePageSerializer(serializers.ModelSerializer):
    hero_imagem = serializers.SerializerMethodField()
    hero_banners = serializers.SerializerMethodField()
    secao_futuro_imagem = serializers.SerializerMethodField()
    banner_institucional_imagem = serializers.SerializerMethodField()
    etapas_jornada = serializers.SerializerMethodField()
    empreendimento_destaque = EmpreendimentoCardSerializer()
    video_thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = HomePage
        fields = [
            'hero_titulo', 'hero_imagem',
            'secao_futuro_titulo', 'secao_futuro_texto', 'secao_futuro_imagem',
            'banner_institucional_imagem', 'banner_institucional_texto',
            'secao_jornada_titulo', 'etapas_jornada',
            'empreendimento_destaque', 'banner_destaque_texto',
            'secao_depoimentos_titulo',
            'cta_titulo', 'cta_botao_texto',
            'video_url', 'video_thumbnail',
            'hero_banners',
        ]

    def get_hero_imagem(self, obj):
        return get_image_url(obj.hero_imagem)

    def get_secao_futuro_imagem(self, obj):
        return get_image_url(obj.secao_futuro_imagem)

    def get_banner_institucional_imagem(self, obj):
        return get_image_url(obj.banner_institucional_imagem)

    def get_etapas_jornada(self, obj):
        result = []
        for block in obj.etapas_jornada:
            if block.block_type == 'etapa':
                icone_img = block.value.get('icone')
                result.append({
                    'numero': block.value.get('numero', ''),
                    'titulo': block.value.get('titulo', ''),
                    'descricao': block.value.get('descricao', ''),
                    'icone': get_image_url(icone_img) if icone_img else None,
                })
        return result

    def get_hero_banners(self, obj):
        banners = []
        for b in obj.hero_banners.all():
            banners.append({
                'imagem': get_image_url(b.imagem),
                'titulo': b.titulo,
                'subtitulo': b.subtitulo,
            })
        return banners

    def get_video_thumbnail(self, obj):
        return get_image_url(obj.video_thumbnail, 'fill-1280x720')


class SobreNosSerializer(serializers.ModelSerializer):
    hero_imagem = serializers.SerializerMethodField()
    video_thumbnail = serializers.SerializerMethodField()
    cta_imagem = serializers.SerializerMethodField()
    missao_icone = serializers.SerializerMethodField()
    visao_icone = serializers.SerializerMethodField()
    valores_icone = serializers.SerializerMethodField()
    mvv_background = serializers.SerializerMethodField()
    selos_qualidade = serializers.SerializerMethodField()

    class Meta:
        model = SobreNosPage
        fields = [
            'hero_titulo', 'hero_imagem',
            'historia_titulo', 'historia_texto',
            'video_titulo', 'video_url', 'video_thumbnail',
            'missao_titulo', 'missao_texto',
            'visao_titulo', 'visao_texto',
            'valores_titulo', 'valores_texto',
            'politica_titulo', 'politica_texto',
            'cta_titulo', 'cta_subtitulo', 'cta_botao_texto', 'cta_imagem',
            'missao_icone', 'visao_icone', 'valores_icone', 'mvv_background',
            'selos_qualidade',
        ]

    def get_hero_imagem(self, obj):
        return get_image_url(obj.hero_imagem)

    def get_video_thumbnail(self, obj):
        return get_image_url(obj.video_thumbnail, 'fill-800x450')

    def get_cta_imagem(self, obj):
        return get_image_url(obj.cta_imagem)

    def get_missao_icone(self, obj):
        return get_image_url(obj.missao_icone)

    def get_visao_icone(self, obj):
        return get_image_url(obj.visao_icone)

    def get_valores_icone(self, obj):
        return get_image_url(obj.valores_icone)

    def get_mvv_background(self, obj):
        return get_image_url(obj.mvv_background)

    def get_selos_qualidade(self, obj):
        selos = []
        for s in obj.selos_qualidade.all():
            selos.append({
                'nome': s.nome,
                'imagem': get_image_url(s.imagem),
            })
        return selos


# =============================================================================
# SERIALIZERS DE LEAD/NEWSLETTER
# =============================================================================

class EmpreendimentosIndexPageSerializer(serializers.ModelSerializer):
    hero_imagem = serializers.SerializerMethodField()

    class Meta:
        from .models import EmpreendimentosIndexPage
        model = EmpreendimentosIndexPage
        fields = ['hero_titulo', 'hero_subtitulo', 'hero_imagem', 'form_titulo', 'secao_projetos_titulo']

    def get_hero_imagem(self, obj):
        return get_image_url(obj.hero_imagem)


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'nome', 'email', 'telefone', 'mensagem', 'origem',
            'empreendimento', 'pagina_origem',
            'utm_source', 'utm_medium', 'utm_campaign'
        ]


class LeadListSerializer(serializers.ModelSerializer):
    empreendimento_nome = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            'id', 'nome', 'email', 'telefone', 'mensagem', 'origem',
            'empreendimento', 'empreendimento_nome', 'pagina_origem',
            'utm_source', 'utm_medium', 'utm_campaign',
            'created_at', 'lido', 'status', 'observacoes'
        ]

    def get_empreendimento_nome(self, obj):
        return obj.empreendimento.title if obj.empreendimento else None


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ['email']
