# -*- coding: utf-8 -*-
"""
URLs da API REST do site Virtú
Versionamento: /api/v1/ conforme documentação
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para ViewSets
router = DefaultRouter()

# APIs Públicas
router.register(r'empreendimentos', views.EmpreendimentoViewSet, basename='empreendimento')
router.register(r'cidades', views.CidadeViewSet, basename='cidade')
router.register(r'status', views.StatusViewSet, basename='status')
router.register(r'diferenciais', views.DiferencialViewSet, basename='diferencial')
router.register(r'depoimentos', views.DepoimentoViewSet, basename='depoimento')

# APIs Internas (Admin)
router.register(r'admin/leads', views.LeadAdminViewSet, basename='admin-lead')
router.register(r'admin/diferenciais', views.DiferencialAdminViewSet, basename='admin-diferencial')
router.register(r'admin/depoimentos', views.DepoimentoAdminViewSet, basename='admin-depoimento')

# URLs versionadas conforme documentação (/api/v1/)
urlpatterns = [
    # APIs Públicas - Páginas
    path('home/', views.HomePageView.as_view(), name='api-home'),
    path('sobre-nos/', views.SobreNosView.as_view(), name='api-sobre-nos'),
    path('configuracoes/', views.ConfiguracaoView.as_view(), name='api-config'),

    # APIs Públicas - Formulários
    path('leads/', views.LeadCreateView.as_view(), name='api-lead'),
    path('newsletter/', views.NewsletterCreateView.as_view(), name='api-newsletter'),

    # Router URLs
    path('', include(router.urls)),
]

"""
=============================================================================
DOCUMENTAÇÃO DOS ENDPOINTS - Conforme especificação técnica
=============================================================================

5.1 APIs Públicas (para o front-end)
------------------------------------
GET  /api/v1/empreendimentos/              - Listagem de empreendimentos
GET  /api/v1/empreendimentos/{id}/         - Detalhamento completo
GET  /api/v1/empreendimentos/{id}/plantas/ - Plantas por empreendimento
GET  /api/v1/empreendimentos/{id}/diferenciais/ - Diferenciais associados
GET  /api/v1/empreendimentos/{id}/galeria/ - Galeria de imagens
GET  /api/v1/empreendimentos/{id}/andamento-obra/ - Andamento da obra + fotos
GET  /api/v1/empreendimentos/destaques/    - Empreendimentos em destaque
GET  /api/v1/empreendimentos/por-cidade/   - Empreendimentos por cidade
GET  /api/v1/empreendimentos/?cidade={id}  - Filtrar por cidade
GET  /api/v1/empreendimentos/?status={slug} - Filtrar por status

GET  /api/v1/cidades/                      - Lista de cidades
GET  /api/v1/status/                       - Status de empreendimentos
GET  /api/v1/diferenciais/                 - Lista de diferenciais
GET  /api/v1/diferenciais/?categoria={cat} - Filtrar por categoria
GET  /api/v1/depoimentos/                  - Lista de depoimentos
GET  /api/v1/depoimentos/?destaque=true    - Depoimentos em destaque

GET  /api/v1/home/                         - Dados da página inicial
GET  /api/v1/sobre-nos/                    - Dados da página sobre nós
GET  /api/v1/configuracoes/                - Configurações do site

POST /api/v1/leads/                        - Envio de formulário (lead)
POST /api/v1/newsletter/                   - Inscrição na newsletter

5.2 APIs Internas (administrativas) - Requer autenticação
---------------------------------------------------------
GET/POST/PUT/DELETE /api/v1/admin/leads/   - CRUD de Leads
GET  /api/v1/admin/leads/exportar/         - Exportar leads
POST /api/v1/admin/leads/{id}/marcar_lido/ - Marcar como lido
POST /api/v1/admin/leads/{id}/atualizar_status/ - Atualizar status

GET/POST/PUT/DELETE /api/v1/admin/diferenciais/ - CRUD de Diferenciais
GET/POST/PUT/DELETE /api/v1/admin/depoimentos/  - CRUD de Depoimentos

=============================================================================
"""
