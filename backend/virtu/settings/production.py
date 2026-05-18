# -*- coding: utf-8 -*-
"""
Configurações de Produção (Docker)
"""
from .base import *

DEBUG = config('DEBUG', default=False, cast=bool)

# =============================================================================
# Segurança - atrás de Nginx com HTTPS
# =============================================================================
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'SAMEORIGIN'  # Permite iframes do próprio domínio (Wagtail preview)

# Cookies seguros — ativar quando tiver SSL configurado
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)
CSRF_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)

# CSRF trusted origins — necessário quando Nginx faz proxy
CSRF_TRUSTED_ORIGINS = config(
    'CSRF_TRUSTED_ORIGINS',
    default='https://brio-staging-web.com.br,https://virtu.com.br,https://www.virtu.com.br,http://localhost:8088',
    cast=Csv()
)

# =============================================================================
# Database - PostgreSQL em produção
# =============================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='virtu_db'),
        'USER': config('DB_USER', default='virtu_user'),
        'PASSWORD': config('DB_PASSWORD', default='virtu_pass'),
        'HOST': config('DB_HOST', default='db'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# =============================================================================
# Static files - servidos via whitenoise
# =============================================================================
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# =============================================================================
# DRF - sem browsable API em produção
# =============================================================================
REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer',
]

# =============================================================================
# Logging
# =============================================================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'core.integrations': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}

# --- SEGURANCA: DOMINIOS PERMITIDOS ---
ALLOWED_HOSTS = ['brio-staging-web.com.br', 'localhost', '127.0.0.1', '*']

# --- LIMITES DE UPLOAD ---
# 100MB em bytes
DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600
FILE_UPLOAD_MAX_MEMORY_SIZE = 104857600

# --- LIMITES DO WAGTAIL CMS ---
WAGTAILIMAGES_MAX_UPLOAD_SIZE = 104857600
WAGTAILDOCS_MAX_UPLOAD_SIZE = 104857600
