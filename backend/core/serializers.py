# -*- coding: utf-8 -*-
"""
Serializers para a API REST do site Virtú
"""

from rest_framework import serializers
from .models import (
    Cidade, StatusEmpreendimento, Parceiro, Diferencial, Depoimento, ConfiguracaoSite,
    HomePage, EmpreendimentosIndexPage, EmpreendimentoPage, SobreNosPage,
    Planta, GaleriaImagem, AndamentoObra, FotoObra,
    Lead, Newsletter
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
    class Meta:
        model = ConfiguracaoSite
        fields = '__all__'


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
    url = serializers.SerializerMethodField()

    class Meta:
        model = EmpreendimentoPage
        fields = [
            'id', 'title', 'slug', 'url', 'status', 'cidade',
            'descricao_curta', 'preco_a_partir', 'metragem_a_partir',
            'dormitorios', 'caracteristicas_resumo', 'imagem_principal',
            'data_entrega', 'destaque'
        ]

    def get_imagem_principal(self, obj):
        return get_image_url(obj.imagem_principal, 'fill-600x400')

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
    secao_futuro_imagem = serializers.SerializerMethodField()
    banner_institucional_imagem = serializers.SerializerMethodField()
    etapas_jornada = serializers.SerializerMethodField()
    empreendimento_destaque = EmpreendimentoCardSerializer()

    class Meta:
        model = HomePage
        fields = [
            'hero_titulo', 'hero_imagem',
            'secao_futuro_titulo', 'secao_futuro_texto', 'secao_futuro_imagem',
            'banner_institucional_imagem', 'banner_institucional_texto',
            'secao_jornada_titulo', 'etapas_jornada',
            'empreendimento_destaque', 'banner_destaque_texto',
            'secao_depoimentos_titulo',
            'cta_titulo', 'cta_botao_texto'
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


class SobreNosSerializer(serializers.ModelSerializer):
    hero_imagem = serializers.SerializerMethodField()
    video_thumbnail = serializers.SerializerMethodField()
    cta_imagem = serializers.SerializerMethodField()

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
            'cta_titulo', 'cta_subtitulo', 'cta_botao_texto', 'cta_imagem'
        ]

    def get_hero_imagem(self, obj):
        return get_image_url(obj.hero_imagem)

    def get_video_thumbnail(self, obj):
        return get_image_url(obj.video_thumbnail, 'fill-800x450')

    def get_cta_imagem(self, obj):
        return get_image_url(obj.cta_imagem)


# =============================================================================
# SERIALIZERS DE LEAD/NEWSLETTER
# =============================================================================

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
