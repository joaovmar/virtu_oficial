# -*- coding: utf-8 -*-
from django.templatetags.static import static
from django.utils.html import format_html
from django.urls import reverse, path
from django.utils.safestring import mark_safe
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View

from wagtail import hooks
from wagtail.admin.menu import MenuItem


# ============================================================
# CSS / JS globais do admin
# ============================================================

@hooks.register('insert_global_admin_css')
def global_admin_css():
    return format_html('<link rel="stylesheet" href="{}">', static('css/wagtail-custom.css'))


@hooks.register('insert_global_admin_css')
def image_upload_fixes_css():
    return format_html("""
    <style>
        .w-field__errors .error-message:has(a[href*="accessibility"]),
        .w-field__errors li:has(a[href*="accessibility"]) {{
            color: #b8860b !important; background: #fff8dc !important;
            border-left-color: #daa520 !important;
        }}
        .messages .error {{ font-size: 14px; padding: 12px 16px; }}
        .w-field--image_description .w-field__input input,
        .w-field--image_title .w-field__input input {{
            border: 1px solid #c1a784 !important;
        }}
        /* RD Station Log — cores de status */
        .rdlog-sucesso {{ color:#1a7a4a; font-weight:600; }}
        .rdlog-falha   {{ color:#c0392b; font-weight:600; }}
        .rdlog-inativo {{ color:#b8860b; font-weight:600; }}
        .rdlog-table {{ width:100%; border-collapse:collapse; font-size:13px; }}
        .rdlog-table th {{ background:#1e3d34; color:white; padding:8px 12px; text-align:left; }}
        .rdlog-table td {{ padding:7px 12px; border-bottom:1px solid #eee; vertical-align:top; }}
        .rdlog-table tr:hover td {{ background:#f8f9fa; }}
        .rdlog-causa {{ font-size:12px; color:#555; max-width:340px; }}
        .rdlog-badge {{ display:inline-block; padding:2px 10px; border-radius:12px; font-size:11px; font-weight:700; }}
        .rdlog-badge.sucesso {{ background:#d4edda; color:#1a7a4a; }}
        .rdlog-badge.falha   {{ background:#fde8e8; color:#c0392b; }}
        .rdlog-badge.inativo {{ background:#fff3cd; color:#856404; }}
        .rdlog-filters {{ display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; align-items:center; }}
        .rdlog-filters select, .rdlog-filters input {{ padding:5px 10px; border:1px solid #ccc; border-radius:6px; font-size:13px; }}
        .rdlog-filters button {{ padding:5px 14px; background:#348981; color:white; border:none; border-radius:6px; cursor:pointer; font-size:13px; }}
        .rdlog-summary {{ display:flex; gap:16px; margin-bottom:20px; }}
        .rdlog-summary-card {{ background:white; border:1px solid #eee; border-radius:10px; padding:12px 20px;
            min-width:120px; text-align:center; box-shadow:0 1px 4px rgba(0,0,0,.06); }}
        .rdlog-summary-card .num {{ font-size:28px; font-weight:700; }}
        .rdlog-summary-card .lbl {{ font-size:11px; color:#888; margin-top:2px; }}
        .rdlog-info-box {{ background:#e8f4f8; border:1px solid #bee3f8; border-radius:8px;
            padding:12px 16px; margin-bottom:20px; font-size:13px; color:#2c5282; line-height:1.6; }}
    </style>
    """)


@hooks.register('insert_global_admin_js')
def global_admin_js():
    return format_html("""
    <script>
        document.title = document.title.replace("Wagtail", "Virtú");
        document.addEventListener('DOMContentLoaded', function() {{
            const origFetch = window.fetch;
            window.fetch = function() {{
                return origFetch.apply(this, arguments).then(function(response) {{
                    if (response.status === 413) {{
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'messages';
                        alertDiv.innerHTML = '<ul><li class="error"><strong>Imagem muito grande!</strong> ' +
                            'Reduza o arquivo (máx. 50MB) ou use resolução menor.</li></ul>';
                        const content = document.querySelector('.content-wrapper, #main, main');
                        if (content) content.prepend(alertDiv);
                    }}
                    return response;
                }});
            }};
        }});
    </script>
    """)


# ============================================================
# Painel de Logs RD Station no Wagtail
# ============================================================

class RDStationLogView(View):
    """View do painel de logs RD Station acessível pelo Wagtail."""

    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        from .models import RDStationLog
        from django.db.models import Count, Q
        from django.utils import timezone
        from datetime import timedelta

        # Filtros da query string
        status_filter = request.GET.get('status', '')
        dias_filter = int(request.GET.get('dias', '7'))
        email_filter = request.GET.get('email', '').strip()

        since = timezone.now() - timedelta(days=dias_filter)
        qs = RDStationLog.objects.filter(criado_em__gte=since).order_by('-criado_em')

        if status_filter:
            qs = qs.filter(status=status_filter)
        if email_filter:
            qs = qs.filter(email_lead__icontains=email_filter)

        # Totais para o resumo
        totals = RDStationLog.objects.filter(criado_em__gte=since).aggregate(
            total=Count('id'),
            sucessos=Count('id', filter=Q(status='sucesso')),
            falhas=Count('id', filter=Q(status='falha')),
            inativos=Count('id', filter=Q(status='inativo')),
        )

        logs = qs[:200]  # limita para não sobrecarregar a página

        context = {
            'logs': logs,
            'totals': totals,
            'status_filter': status_filter,
            'dias_filter': dias_filter,
            'email_filter': email_filter,
        }
        return render(request, 'wagtailadmin/rdstation_logs.html', context)


@hooks.register('register_admin_urls')
def register_rdstation_urls():
    return [
        path('rdstation-logs/', RDStationLogView.as_view(), name='rdstation_logs'),
    ]


@hooks.register('register_admin_menu_item')
def register_rdstation_menu_item():
    return MenuItem(
        label='📊 Logs RD Station',
        url='/admin/rdstation-logs/',
        icon_name='list-ul',
        order=900,
    )
