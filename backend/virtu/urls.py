# -*- coding: utf-8 -*-
"""
URL Configuration do projeto Virtú
Versionamento de API: /api/v1/ conforme documentação
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls

urlpatterns = [
    # Django Admin (para superusuários)
    path('django-admin/', admin.site.urls),

    # Wagtail Admin (CMS para equipe de Marketing)
    path('admin/', include(wagtailadmin_urls)),

    # Documentos do Wagtail
    path('documents/', include(wagtaildocs_urls)),

    # API REST versionada conforme documentação
    path('api/v1/', include('core.urls')),

    # Manter compatibilidade com /api/ (redireciona para v1)
    path('api/', include('core.urls')),

    # Wagtail pages (catch-all - deve ficar por último)
    re_path(r'^', include(wagtail_urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
