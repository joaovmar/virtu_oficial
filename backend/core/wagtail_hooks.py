# -*- coding: utf-8 -*-
"""
Wagtail hooks para personalização do admin com a identidade visual Virtú.
Cores do Figma: #348981 (verde), #c1a784 (dourado), #282828 (dark), #1e3d34 (verde escuro)
"""

from django.templatetags.static import static
from django.utils.html import format_html

from wagtail import hooks


@hooks.register('insert_global_admin_css')
def global_admin_css():
    """Injeta CSS customizado com as cores da marca Virtú no painel Wagtail."""
    return format_html(
        '<link rel="stylesheet" href="{}">',
        static('css/wagtail-custom.css')
    )


@hooks.register('insert_global_admin_js')
def global_admin_js():
    """Script para ajustar o título da aba do navegador."""
    return format_html(
        '<script>document.title = document.title.replace("Wagtail", "Virtú");</script>'
    )
