# -*- coding: utf-8 -*-
"""
Modelos Django/Wagtail para o site da Virtú
Atualizado conforme documentação técnica do back-end
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from wagtail.models import Page, Orderable
from wagtail.fields import RichTextField, StreamField
from wagtail.admin.panels import FieldPanel, MultiFieldPanel, InlinePanel, FieldRowPanel
from wagtail.snippets.models import register_snippet
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

from modelcluster.fields import ParentalKey, ParentalManyToManyField


# =============================================================================
# SNIPPETS - Componentes Reutilizáveis
# =============================================================================

@register_snippet
class Cidade(models.Model):
    """Cidades onde a Virtú atua"""
    nome = models.CharField(max_length=100, verbose_name="Nome")
    estado = models.CharField(max_length=2, verbose_name="UF")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    ordem = models.PositiveIntegerField(default=0, verbose_name="Ordem")

    class Meta:
        verbose_name = "Cidade"
        verbose_name_plural = "Cidades"
        ordering = ['ordem', 'nome']

    def __str__(self):
        return f"{self.nome} | {self.estado}"

    panels = [
        FieldPanel('nome'),
        FieldPanel('estado'),
        FieldPanel('ativo'),
        FieldPanel('ordem'),
    ]


@register_snippet
class StatusEmpreendimento(models.Model):
    """Status de vendas do empreendimento"""
    nome = models.CharField(max_length=50, verbose_name="Nome")
    slug = models.SlugField(unique=True)
    cor_badge = models.CharField(max_length=7, default="#C9A96E", verbose_name="Cor do Badge")
    ordem = models.PositiveIntegerField(default=0, verbose_name="Ordem")

    class Meta:
        verbose_name = "Status de Empreendimento"
        verbose_name_plural = "Status de Empreendimentos"
        ordering = ['ordem']

    def __str__(self):
        return self.nome

    panels = [
        FieldPanel('nome'),
        FieldPanel('slug'),
        FieldPanel('cor_badge'),
        FieldPanel('ordem'),
    ]


@register_snippet
class Parceiro(models.Model):
    """Parceiros da Virtú (construtoras, urbanizadoras, etc)"""
    nome = models.CharField(max_length=200, verbose_name="Nome")
    logo = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Logo"
    )
    site = models.URLField(blank=True, verbose_name="Site")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        verbose_name = "Parceiro"
        verbose_name_plural = "Parceiros"

    def __str__(self):
        return self.nome

    panels = [
        FieldPanel('nome'),
        FieldPanel('logo'),
        FieldPanel('site'),
        FieldPanel('ativo'),
    ]


@register_snippet
class Diferencial(models.Model):
    """
    Diferenciais/benefícios dos empreendimentos (lazer, segurança, etc)
    Conforme documentação: Relação N:N com Empreendimento
    """
    nome = models.CharField(max_length=100, verbose_name="Nome")
    descricao = models.TextField(blank=True, verbose_name="Descrição")
    icone = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Ícone"
    )
    categoria = models.CharField(
        max_length=50,
        blank=True,
        choices=[
            ('lazer', 'Lazer'),
            ('seguranca', 'Segurança'),
            ('sustentabilidade', 'Sustentabilidade'),
            ('conforto', 'Conforto'),
            ('localizacao', 'Localização'),
            ('infraestrutura', 'Infraestrutura'),
            ('outro', 'Outro'),
        ],
        verbose_name="Categoria"
    )
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    ordem = models.PositiveIntegerField(default=0, verbose_name="Ordem")

    class Meta:
        verbose_name = "Diferencial"
        verbose_name_plural = "Diferenciais"
        ordering = ['ordem', 'nome']

    def __str__(self):
        return self.nome

    panels = [
        FieldPanel('nome'),
        FieldPanel('descricao'),
        FieldPanel('icone'),
        FieldPanel('categoria'),
        FieldPanel('ativo'),
        FieldPanel('ordem'),
    ]


@register_snippet
class Depoimento(models.Model):
    """
    Depoimentos de clientes/moradores
    Conforme documentação: autor, texto, foto_url, created_at
    """
    nome = models.CharField(max_length=200, verbose_name="Nome (autor)")
    cargo = models.CharField(max_length=100, default="morador(a)", verbose_name="Cargo/Função")
    foto = models.ForeignKey(
        'wagtailimages.Image',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name="Foto"
    )
    texto = models.TextField(verbose_name="Texto do Depoimento")
    avaliacao = models.PositiveIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Avaliação (1-5)"
    )
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    destaque = models.BooleanField(default=False, verbose_name="Destaque na Home")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")

    class Meta:
        verbose_name = "Depoimento"
        verbose_name_plural = "Depoimentos"
        ordering = ['-destaque', '-created_at']

    def __str__(self):
        return f"{self.nome} - {self.cargo}"

    panels = [
        FieldPanel('nome'),
        FieldPanel('cargo'),
        FieldPanel('foto'),
        FieldPanel('texto'),
        FieldPanel('avaliacao'),
        FieldPanel('ativo'),
        FieldPanel('destaque'),
    ]


@register_snippet
class ConfiguracaoSite(models.Model):
    """Configurações gerais do site"""
    email = models.EmailField(default="contato@virtu.com.br", verbose_name="E-mail")
    telefone = models.CharField(max_length=20, default="(11) 99999-9999", verbose_name="Telefone")
    whatsapp = models.CharField(max_length=20, blank=True, verbose_name="WhatsApp")
    endereco = models.TextField(blank=True, verbose_name="Endereço")
    facebook = models.URLField(blank=True, verbose_name="Facebook")
    instagram = models.URLField(blank=True, verbose_name="Instagram")
    linkedin = models.URLField(blank=True, verbose_name="LinkedIn")
    youtube = models.URLField(blank=True, verbose_name="YouTube")
    copyright_texto = models.CharField(
        max_length=200,
        default="© 2025 Todos os direitos reservados - virtú",
        verbose_name="Texto do Copyright"
    )

    class Meta:
        verbose_name = "Configuração do Site"
        verbose_name_plural = "Configurações do Site"

    def __str__(self):
        return "Configurações do Site"

    panels = [
        MultiFieldPanel([
            FieldPanel('email'),
            FieldPanel('telefone'),
            FieldPanel('whatsapp'),
            FieldPanel('endereco'),
        ], heading="Contato"),
        MultiFieldPanel([
            FieldPanel('facebook'),
            FieldPanel('instagram'),
            FieldPanel('linkedin'),
            FieldPanel('youtube'),
        ], heading="Redes Sociais"),
        FieldPanel('copyright_texto'),
    ]


# =============================================================================
# BLOCKS para StreamFields
# =============================================================================

class EtapaJornadaBlock(blocks.StructBlock):
    """Bloco para etapas da jornada do cliente na home"""
    numero = blocks.CharBlock(max_length=2, label="Número")
    titulo = blocks.CharBlock(max_length=100, label="Título")
    descricao = blocks.TextBlock(label="Descrição")
    icone = ImageChooserBlock(required=False, label="Ícone")

    class Meta:
        icon = 'order'
        label = 'Etapa da Jornada'


# =============================================================================
# WAGTAIL PAGES
# =============================================================================

class HomePage(Page):
    """Página Inicial do Site"""
    # Hero
    hero_titulo = models.CharField(
        max_length=200,
        default="O seu futuro é o nosso propósito",
        verbose_name="Título do Hero"
    )
    hero_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Hero"
    )

    # Seção Futuro
    secao_futuro_titulo = models.CharField(
        max_length=100, default="Pensamos no futuro",
        verbose_name="Título da Seção"
    )
    secao_futuro_texto = RichTextField(blank=True, verbose_name="Texto")
    secao_futuro_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem"
    )

    # Banner institucional
    banner_institucional_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Banner Institucional"
    )
    banner_institucional_texto = models.CharField(
        max_length=500, blank=True,
        default="Na virtú acreditamos que não há um único destino.",
        verbose_name="Texto do Banner"
    )

    # Jornada
    secao_jornada_titulo = models.CharField(
        max_length=100, default="Da visão à realidade",
        verbose_name="Título da Jornada"
    )
    etapas_jornada = StreamField([
        ('etapa', EtapaJornadaBlock()),
    ], blank=True, use_json_field=True, verbose_name="Etapas")

    # Destaque
    empreendimento_destaque = models.ForeignKey(
        'EmpreendimentoPage', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Empreendimento em Destaque"
    )
    banner_destaque_texto = models.CharField(
        max_length=300, blank=True,
        verbose_name="Texto do Banner"
    )

    # Depoimentos
    secao_depoimentos_titulo = models.CharField(
        max_length=100, default="depoimentos reais",
        verbose_name="Título da Seção de Depoimentos"
    )

    # CTA
    cta_titulo = models.CharField(
        max_length=200, default="Vamos conversar sobre o seu futuro!",
        verbose_name="Título do CTA"
    )
    cta_botao_texto = models.CharField(
        max_length=50, default="Conheça mais",
        verbose_name="Texto do Botão"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_titulo'),
            FieldPanel('hero_imagem'),
        ], heading="Hero Banner"),
        MultiFieldPanel([
            FieldPanel('secao_futuro_titulo'),
            FieldPanel('secao_futuro_texto'),
            FieldPanel('secao_futuro_imagem'),
        ], heading="Seção Pensamos no Futuro"),
        MultiFieldPanel([
            FieldPanel('banner_institucional_imagem'),
            FieldPanel('banner_institucional_texto'),
        ], heading="Banner Institucional"),
        MultiFieldPanel([
            FieldPanel('secao_jornada_titulo'),
            FieldPanel('etapas_jornada'),
        ], heading="Jornada do Cliente"),
        MultiFieldPanel([
            FieldPanel('empreendimento_destaque'),
            FieldPanel('banner_destaque_texto'),
        ], heading="Empreendimento em Destaque"),
        FieldPanel('secao_depoimentos_titulo'),
        MultiFieldPanel([
            FieldPanel('cta_titulo'),
            FieldPanel('cta_botao_texto'),
        ], heading="CTA Final"),
    ]

    subpage_types = ['EmpreendimentosIndexPage', 'SobreNosPage', 'ContatoPage', 'BlogIndexPage']

    class Meta:
        verbose_name = "Página Inicial"


class EmpreendimentosIndexPage(Page):
    """Página de Listagem de Empreendimentos"""
    hero_titulo = models.CharField(max_length=200, blank=True, verbose_name="Título")
    hero_subtitulo = models.CharField(max_length=300, blank=True, verbose_name="Subtítulo")
    hero_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Hero"
    )
    form_titulo = models.CharField(
        max_length=100, default="Cadastre-se e saiba mais!",
        verbose_name="Título do Formulário"
    )
    secao_projetos_titulo = models.CharField(
        max_length=100, default="Conheça nossos projetos",
        verbose_name="Título da Seção de Projetos"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_titulo'),
            FieldPanel('hero_subtitulo'),
            FieldPanel('hero_imagem'),
        ], heading="Hero"),
        FieldPanel('form_titulo'),
        FieldPanel('secao_projetos_titulo'),
    ]

    subpage_types = ['EmpreendimentoPage']

    class Meta:
        verbose_name = "Página de Empreendimentos"


class EmpreendimentoPage(Page):
    """
    Empreendimento - Entidade central conforme documentação
    """
    # Classificação
    status = models.ForeignKey(
        StatusEmpreendimento, null=True, blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Status de Vendas"
    )
    cidade = models.ForeignKey(
        Cidade, null=True, blank=True,
        on_delete=models.SET_NULL,
        verbose_name="Cidade"
    )
    parceiros = ParentalManyToManyField(
        Parceiro, blank=True,
        verbose_name="Parceiros"
    )
    diferenciais = ParentalManyToManyField(
        Diferencial, blank=True,
        verbose_name="Diferenciais"
    )

    # Descrição
    subtitulo = models.CharField(max_length=300, blank=True, verbose_name="Subtítulo")
    descricao_curta = models.TextField(blank=True, verbose_name="Descrição Curta")
    descricao = RichTextField(blank=True, verbose_name="Descrição Completa")

    # Localização
    localizacao = models.CharField(max_length=300, blank=True, verbose_name="Localização")
    endereco = models.CharField(max_length=300, blank=True, verbose_name="Endereço")
    bairro = models.CharField(max_length=100, blank=True, verbose_name="Bairro")
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        verbose_name="Latitude"
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True,
        verbose_name="Longitude"
    )

    # Datas
    data_entrega = models.DateField(
        null=True, blank=True,
        verbose_name="Previsão de Entrega"
    )

    # Valores e Características
    preco_a_partir = models.DecimalField(
        max_digits=12, decimal_places=2, null=True, blank=True,
        verbose_name="Preço a partir de"
    )
    metragem_a_partir = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
        verbose_name="Metragem a partir de"
    )
    dormitorios = models.CharField(max_length=50, blank=True, verbose_name="Dormitórios")
    caracteristicas_resumo = models.CharField(
        max_length=200, blank=True,
        verbose_name="Características Resumo"
    )

    # Imagens
    imagem_principal = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem Principal (Card)"
    )
    imagem_hero = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Hero"
    )
    logo = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Logo do Empreendimento"
    )

    # Vídeo
    video_url = models.URLField(blank=True, verbose_name="URL do Vídeo")
    video_thumbnail = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Thumbnail do Vídeo"
    )

    # Controle
    destaque = models.BooleanField(default=False, verbose_name="Em Destaque")
    ordem = models.PositiveIntegerField(default=0, verbose_name="Ordem")

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldRowPanel([FieldPanel('status'), FieldPanel('cidade')]),
            FieldPanel('parceiros'),
            FieldPanel('diferenciais'),
        ], heading="Classificação"),
        MultiFieldPanel([
            FieldPanel('subtitulo'),
            FieldPanel('descricao_curta'),
            FieldPanel('descricao'),
        ], heading="Descrição"),
        MultiFieldPanel([
            FieldPanel('localizacao'),
            FieldPanel('endereco'),
            FieldPanel('bairro'),
            FieldRowPanel([FieldPanel('latitude'), FieldPanel('longitude')]),
        ], heading="Localização"),
        MultiFieldPanel([
            FieldPanel('data_entrega'),
            FieldRowPanel([FieldPanel('preco_a_partir'), FieldPanel('metragem_a_partir')]),
            FieldRowPanel([FieldPanel('dormitorios'), FieldPanel('caracteristicas_resumo')]),
        ], heading="Informações"),
        MultiFieldPanel([
            FieldPanel('imagem_principal'),
            FieldPanel('imagem_hero'),
            FieldPanel('logo'),
            InlinePanel('galeria_imagens', label="Galeria de Imagens"),
        ], heading="Imagens"),
        MultiFieldPanel([
            FieldPanel('video_url'),
            FieldPanel('video_thumbnail'),
        ], heading="Vídeo"),
        InlinePanel('plantas', label="Plantas"),
        InlinePanel('andamentos_obra', label="Cronograma de Obra"),
        InlinePanel('fotos_obra', label="Fotos da Obra"),
        MultiFieldPanel([
            FieldPanel('destaque'),
            FieldPanel('ordem'),
        ], heading="Controle"),
    ]

    parent_page_types = ['EmpreendimentosIndexPage']
    subpage_types = []

    class Meta:
        verbose_name = "Empreendimento"
        ordering = ['ordem', '-first_published_at']


class Planta(Orderable):
    """Planta do Empreendimento"""
    page = ParentalKey(
        EmpreendimentoPage,
        on_delete=models.CASCADE,
        related_name='plantas'
    )
    nome = models.CharField(max_length=100, verbose_name="Nome da Planta")
    dormitorios = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name="Nº de Dormitórios"
    )
    metragem = models.DecimalField(
        max_digits=8, decimal_places=2, null=True, blank=True,
        verbose_name="Metragem (m²)"
    )
    imagem = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.CASCADE,
        related_name='+',
        verbose_name="Imagem da Planta"
    )
    descricao = models.TextField(blank=True, verbose_name="Descrição")
    caracteristicas = models.TextField(
        blank=True,
        help_text="Uma característica por linha",
        verbose_name="Características"
    )

    panels = [
        FieldPanel('nome'),
        FieldRowPanel([FieldPanel('dormitorios'), FieldPanel('metragem')]),
        FieldPanel('imagem'),
        FieldPanel('descricao'),
        FieldPanel('caracteristicas'),
    ]

    class Meta:
        verbose_name = "Planta"
        verbose_name_plural = "Plantas"

    def __str__(self):
        return self.nome

    def get_caracteristicas_list(self):
        """Retorna características como lista"""
        if self.caracteristicas:
            return [c.strip() for c in self.caracteristicas.split('\n') if c.strip()]
        return []


class GaleriaImagem(Orderable):
    """Galeria de Imagens do Empreendimento"""
    page = ParentalKey(
        EmpreendimentoPage,
        on_delete=models.CASCADE,
        related_name='galeria_imagens'
    )
    imagem = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.CASCADE,
        related_name='+',
        verbose_name="Imagem"
    )
    descricao = models.CharField(max_length=250, blank=True, verbose_name="Descrição/Legenda")

    panels = [FieldPanel('imagem'), FieldPanel('descricao')]

    class Meta:
        verbose_name = "Imagem da Galeria"
        verbose_name_plural = "Imagens da Galeria"


class AndamentoObra(Orderable):
    """Andamento/Cronograma da Obra"""
    page = ParentalKey(
        EmpreendimentoPage,
        on_delete=models.CASCADE,
        related_name='andamentos_obra'
    )
    titulo = models.CharField(max_length=200, verbose_name="Título/Etapa")
    percentual = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Percentual Concluído"
    )

    panels = [
        FieldPanel('titulo'),
        FieldPanel('percentual'),
    ]

    class Meta:
        verbose_name = "Etapa do Cronograma"
        verbose_name_plural = "Etapas do Cronograma"

    def __str__(self):
        return f"{self.titulo} - {self.percentual}%"


class FotoObra(Orderable):
    """Fotos da Obra"""
    page = ParentalKey(
        EmpreendimentoPage,
        on_delete=models.CASCADE,
        related_name='fotos_obra'
    )
    imagem = models.ForeignKey(
        'wagtailimages.Image',
        on_delete=models.CASCADE,
        related_name='+',
        verbose_name="Foto"
    )
    data_captura = models.DateField(
        null=True, blank=True,
        verbose_name="Data da Captura"
    )
    descricao = models.CharField(max_length=250, blank=True, verbose_name="Descrição")

    panels = [
        FieldPanel('imagem'),
        FieldPanel('data_captura'),
        FieldPanel('descricao'),
    ]

    class Meta:
        verbose_name = "Foto da Obra"
        verbose_name_plural = "Fotos da Obra"


# =============================================================================
# PÁGINAS INSTITUCIONAIS
# =============================================================================

class SobreNosPage(Page):
    """Página Sobre Nós / A Virtú"""
    hero_titulo = models.CharField(max_length=100, default="a virtú", verbose_name="Título")
    hero_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Hero"
    )

    historia_titulo = models.CharField(max_length=100, default="nossa história", verbose_name="Título")
    historia_texto = RichTextField(blank=True, verbose_name="Texto")

    video_titulo = models.CharField(max_length=200, default="vídeo institucional virtú", verbose_name="Título")
    video_url = models.URLField(blank=True, verbose_name="URL do Vídeo")
    video_thumbnail = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Thumbnail"
    )

    missao_titulo = models.CharField(max_length=50, default="missão", verbose_name="Título")
    missao_texto = RichTextField(blank=True, verbose_name="Texto")

    visao_titulo = models.CharField(max_length=50, default="visão", verbose_name="Título")
    visao_texto = RichTextField(blank=True, verbose_name="Texto")

    valores_titulo = models.CharField(max_length=50, default="valores", verbose_name="Título")
    valores_texto = RichTextField(blank=True, verbose_name="Texto")

    politica_titulo = models.CharField(max_length=100, default="política de qualidade", verbose_name="Título")
    politica_texto = RichTextField(blank=True, verbose_name="Texto")

    cta_titulo = models.CharField(
        max_length=200, default="Pronto para fazer parte de nossa história?",
        verbose_name="Título do CTA"
    )
    cta_subtitulo = models.TextField(blank=True, verbose_name="Subtítulo")
    cta_botao_texto = models.CharField(max_length=50, default="Entrar em contato", verbose_name="Texto do Botão")
    cta_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do CTA"
    )

    content_panels = Page.content_panels + [
        MultiFieldPanel([FieldPanel('hero_titulo'), FieldPanel('hero_imagem')], heading="Hero"),
        MultiFieldPanel([FieldPanel('historia_titulo'), FieldPanel('historia_texto')], heading="Nossa História"),
        MultiFieldPanel([
            FieldPanel('video_titulo'), FieldPanel('video_url'), FieldPanel('video_thumbnail')
        ], heading="Vídeo Institucional"),
        MultiFieldPanel([FieldPanel('missao_titulo'), FieldPanel('missao_texto')], heading="Missão"),
        MultiFieldPanel([FieldPanel('visao_titulo'), FieldPanel('visao_texto')], heading="Visão"),
        MultiFieldPanel([FieldPanel('valores_titulo'), FieldPanel('valores_texto')], heading="Valores"),
        MultiFieldPanel([FieldPanel('politica_titulo'), FieldPanel('politica_texto')], heading="Política de Qualidade"),
        MultiFieldPanel([
            FieldPanel('cta_titulo'), FieldPanel('cta_subtitulo'),
            FieldPanel('cta_botao_texto'), FieldPanel('cta_imagem')
        ], heading="CTA Final"),
    ]

    parent_page_types = ['HomePage']
    subpage_types = []

    class Meta:
        verbose_name = "Página Sobre Nós"


class ContatoPage(Page):
    """Página de Contato"""
    hero_titulo = models.CharField(max_length=200, default="Fale Conosco", verbose_name="Título")
    hero_subtitulo = models.TextField(blank=True, verbose_name="Subtítulo")
    hero_imagem = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem do Hero"
    )
    form_titulo = models.CharField(max_length=100, default="Envie sua mensagem", verbose_name="Título do Formulário")

    content_panels = Page.content_panels + [
        MultiFieldPanel([
            FieldPanel('hero_titulo'),
            FieldPanel('hero_subtitulo'),
            FieldPanel('hero_imagem'),
        ], heading="Hero"),
        FieldPanel('form_titulo'),
    ]

    parent_page_types = ['HomePage']
    subpage_types = []

    class Meta:
        verbose_name = "Página de Contato"


class BlogIndexPage(Page):
    """Página de Listagem do Blog"""
    introducao = RichTextField(blank=True, verbose_name="Introdução")

    content_panels = Page.content_panels + [FieldPanel('introducao')]
    subpage_types = ['BlogPage']

    class Meta:
        verbose_name = "Página do Blog"


class BlogPage(Page):
    """Post do Blog"""
    data = models.DateField(verbose_name="Data de Publicação")
    imagem_destaque = models.ForeignKey(
        'wagtailimages.Image', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='+',
        verbose_name="Imagem de Destaque"
    )
    resumo = models.TextField(blank=True, verbose_name="Resumo")
    conteudo = RichTextField(verbose_name="Conteúdo")
    autor = models.CharField(max_length=200, blank=True, verbose_name="Autor")
    categoria = models.CharField(max_length=100, blank=True, verbose_name="Categoria")

    content_panels = Page.content_panels + [
        FieldPanel('data'),
        FieldPanel('imagem_destaque'),
        FieldPanel('resumo'),
        FieldPanel('conteudo'),
        FieldPanel('autor'),
        FieldPanel('categoria'),
    ]

    parent_page_types = ['BlogIndexPage']
    subpage_types = []

    class Meta:
        verbose_name = "Post do Blog"
        ordering = ['-data']


# =============================================================================
# LEAD - Conforme documentação
# =============================================================================

class Lead(models.Model):
    """Lead - Contato interessado"""
    nome = models.CharField(max_length=200, verbose_name="Nome")
    email = models.EmailField(verbose_name="E-mail")
    telefone = models.CharField(max_length=20, verbose_name="Telefone")
    mensagem = models.TextField(blank=True, verbose_name="Mensagem")
    origem = models.CharField(max_length=100, blank=True, verbose_name="Origem")
    empreendimento = models.ForeignKey(
        EmpreendimentoPage, null=True, blank=True,
        on_delete=models.SET_NULL, related_name='leads',
        verbose_name="Empreendimento de Interesse"
    )
    pagina_origem = models.CharField(max_length=500, blank=True, verbose_name="Página de Origem")
    utm_source = models.CharField(max_length=100, blank=True, verbose_name="UTM Source")
    utm_medium = models.CharField(max_length=100, blank=True, verbose_name="UTM Medium")
    utm_campaign = models.CharField(max_length=100, blank=True, verbose_name="UTM Campaign")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    lido = models.BooleanField(default=False, verbose_name="Lido")
    status = models.CharField(
        max_length=50, default='novo',
        choices=[
            ('novo', 'Novo'),
            ('em_contato', 'Em Contato'),
            ('qualificado', 'Qualificado'),
            ('convertido', 'Convertido'),
            ('perdido', 'Perdido'),
        ],
        verbose_name="Status"
    )
    observacoes = models.TextField(blank=True, verbose_name="Observações")

    class Meta:
        verbose_name = "Lead"
        verbose_name_plural = "Leads"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.nome} - {self.email}"


class Newsletter(models.Model):
    """Inscrições na Newsletter"""
    email = models.EmailField(unique=True, verbose_name="E-mail")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    data_inscricao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Inscrição")

    class Meta:
        verbose_name = "Newsletter"
        verbose_name_plural = "Newsletters"
        ordering = ['-data_inscricao']

    def __str__(self):
        return self.email
