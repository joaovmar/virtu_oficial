# -*- coding: utf-8 -*-
from django.templatetags.static import static
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.contrib.admin.views.decorators import staff_member_required
from django.views import View

from wagtail import hooks
from wagtail.admin.menu import MenuItem


# =============================================================================
# CSS global — compatível com dark mode e light mode do Wagtail
# =============================================================================

@hooks.register('insert_global_admin_css')
def global_admin_css():
    return format_html('<link rel="stylesheet" href="{}">', static('css/wagtail-custom.css'))


@hooks.register('insert_global_admin_css')
def virtu_admin_css():
    return format_html("""
    <style>
      /* ── Tokens que funcionam em light E dark mode ─────────────────────────
         Wagtail expõe variáveis CSS nativas como --w-color-surface-page,
         --w-color-text-label, --w-color-border, etc.
         Usamos apenas essas para garantir compatibilidade total.
      ────────────────────────────────────────────────────────────────────── */

      /* Alt text: aviso em vez de erro */
      .w-field__errors .error-message:has(a[href*="accessibility"]),
      .w-field__errors li:has(a[href*="accessibility"]) {{
        color: var(--w-color-warning-100) !important;
        background: color-mix(in srgb, var(--w-color-warning-100) 12%, transparent) !important;
        border-left-color: var(--w-color-warning-100) !important;
      }}

      /* ── Painel de Logs — variáveis semânticas ──────────────────────────── */
      .vlog-page {{ padding: 0 0 48px; }}
      .vlog-page h1 {{ font-size: 1.5rem; font-weight: 700;
        color: var(--w-color-text-label); margin-bottom: 4px; }}
      .vlog-page .vlog-sub {{
        font-size: 13px; color: var(--w-color-text-meta);
        margin-bottom: 24px; margin-top: 0; }}

      /* Info box */
      .vlog-info {{
        border: 1px solid var(--w-color-info-100);
        border-radius: 8px; padding: 12px 18px; margin-bottom: 24px;
        font-size: 13px; line-height: 1.7;
        color: var(--w-color-text-label);
        background: color-mix(in srgb, var(--w-color-info-100) 10%, var(--w-color-surface-page));
      }}
      .vlog-info strong {{ color: var(--w-color-text-label); }}

      /* Resumo cards */
      .vlog-summary {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }}
      .vlog-card {{
        background: var(--w-color-surface-field);
        border: 1px solid var(--w-color-border);
        border-radius: 10px; padding: 14px 22px;
        min-width: 110px; text-align: center;
        box-shadow: 0 1px 3px color-mix(in srgb, var(--w-color-text-label) 6%, transparent);
      }}
      .vlog-card .num {{ font-size: 28px; font-weight: 800; line-height: 1; }}
      .vlog-card .lbl {{
        font-size: 11px; color: var(--w-color-text-meta);
        margin-top: 4px; text-transform: uppercase; letter-spacing: .4px;
      }}
      .vlog-num-total   {{ color: var(--w-color-text-label); }}
      .vlog-num-ok      {{ color: #1a7a4a; }}
      .vlog-num-err     {{ color: #c0392b; }}
      .vlog-num-warn    {{ color: #8a6200; }}

      /* Filtros */
      .vlog-filters {{
        display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
        background: var(--w-color-surface-field);
        border: 1px solid var(--w-color-border);
        border-radius: 8px; padding: 10px 14px; margin-bottom: 20px;
      }}
      .vlog-filters label {{
        font-size: 12px; font-weight: 600;
        color: var(--w-color-text-meta);
      }}
      .vlog-filters select,
      .vlog-filters input[type=text] {{
        padding: 5px 10px;
        border: 1px solid var(--w-color-border);
        border-radius: 6px; font-size: 13px;
        background: var(--w-color-surface-page);
        color: var(--w-color-text-label);
      }}
      .vlog-filters .btn-filter {{
        padding: 5px 16px; background: #348981; color: #fff;
        border: none; border-radius: 6px; cursor: pointer;
        font-size: 13px; font-weight: 600;
      }}
      .vlog-filters .btn-filter:hover {{ background: #1e3d34; }}
      .vlog-clear {{
        font-size: 12px; color: #c0392b;
        text-decoration: none; margin-left: 6px;
      }}

      /* Tabela */
      .vlog-table {{ width: 100%; border-collapse: collapse; font-size: 13px; }}
      .vlog-table th {{
        background: var(--w-color-surface-field-inactive);
        color: var(--w-color-text-label);
        padding: 9px 12px; text-align: left;
        font-weight: 600; white-space: nowrap;
        border-bottom: 2px solid var(--w-color-border);
      }}
      .vlog-table td {{
        padding: 8px 12px;
        border-bottom: 1px solid var(--w-color-border);
        vertical-align: top;
        color: var(--w-color-text-label);
      }}
      .vlog-table tr:hover td {{
        background: color-mix(in srgb, var(--w-color-surface-field) 60%, transparent);
      }}

      /* Badges */
      .vbadge {{
        display: inline-block; padding: 2px 9px; border-radius: 10px;
        font-size: 11px; font-weight: 700; white-space: nowrap;
      }}
      .vbadge-ok   {{ background: color-mix(in srgb,#1a7a4a 15%,transparent); color:#1a7a4a; }}
      .vbadge-err  {{ background: color-mix(in srgb,#c0392b 15%,transparent); color:#c0392b; }}
      .vbadge-warn {{ background: color-mix(in srgb,#8a6200 15%,transparent); color:#8a6200; }}

      /* Causa provável */
      .vcausa {{
        font-size: 12px; max-width: 360px;
        background: color-mix(in srgb,#8a6200 10%,var(--w-color-surface-page));
        border-left: 3px solid #c9a96e;
        padding: 3px 8px; border-radius: 0 4px 4px 0;
        margin-top: 3px; line-height: 1.5;
        color: var(--w-color-text-label);
      }}
      .vcausa-ok {{
        background: color-mix(in srgb,#1a7a4a 10%,var(--w-color-surface-page));
        border-color: #1a7a4a;
      }}

      /* HTTP code */
      .vhttp {{ font-family: monospace; font-size: 13px; font-weight: 700; }}
      .vhttp-ok  {{ color: #1a7a4a; }}
      .vhttp-err {{ color: #c0392b; }}

      /* Details/summary técnico */
      details summary {{
        cursor: pointer; font-size: 11px; margin-top: 4px;
        color: var(--w-color-interactive);
      }}
      details pre {{
        font-size: 11px;
        background: var(--w-color-surface-field);
        border: 1px solid var(--w-color-border);
        border-radius: 4px; padding: 7px; overflow-x: auto;
        max-width: 440px; white-space: pre-wrap;
        word-break: break-all; margin-top: 3px;
        color: var(--w-color-text-label);
      }}

      .vlog-empty {{
        text-align: center; padding: 48px;
        color: var(--w-color-text-meta); font-size: 15px;
      }}

      /* Tabs de integração */
      .vtabs {{ display: flex; gap: 0; margin-bottom: 20px;
        border-bottom: 2px solid var(--w-color-border); }}
      .vtab {{
        padding: 8px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
        color: var(--w-color-text-meta);
        border-bottom: 3px solid transparent; margin-bottom: -2px;
        background: none; border-top: none; border-left: none; border-right: none;
        text-decoration: none;
      }}
      .vtab.active {{
        color: #348981; border-bottom-color: #348981;
      }}
      .vtab:hover {{ color: var(--w-color-text-label); }}
    </style>
    """)


@hooks.register('insert_global_admin_js')
def virtu_admin_js():
    return format_html("""
    <script>
      document.title = document.title.replace("Wagtail", "Virtú");
      document.addEventListener('DOMContentLoaded', function() {{
        var origFetch = window.fetch;
        window.fetch = function() {{
          return origFetch.apply(this, arguments).then(function(response) {{
            if (response.status === 413) {{
              var d = document.createElement('div');
              d.className = 'messages';
              d.innerHTML = '<ul><li class="error"><strong>Imagem muito grande.</strong> ' +
                'Reduza o arquivo (máx. 50 MB) ou use resolução menor.</li></ul>';
              var c = document.querySelector('.content-wrapper, #main, main');
              if (c) c.prepend(d);
            }}
            return response;
          }});
        }};
      }});
    </script>
    """)


# =============================================================================
# Preview das páginas — aponta para o front Next.js real
# =============================================================================

@hooks.register('construct_page_chooser_queryset')
def set_preview_url(pages, request):
    """Garante que a preview use a URL pública do front-end."""
    return pages


# O Wagtail usa page.get_preview_url() ou WAGTAILADMIN_BASE_URL + page.url
# Sobrescrevemos serve_page_preview para redirecionar ao frontend real.

@hooks.register('before_serve_page')
def redirect_preview_to_frontend(page, request, serve_args, serve_kwargs):
    """
    Quando o Wagtail abre a preview de uma página,
    redireciona para o frontend Next.js em vez de tentar renderizar um template Django.
    """
    import os
    from django.http import HttpResponseRedirect

    # Só age em modo preview (parâmetro ?mode=... ou header X-Wagtail-Preview)
    is_preview = (
        request.GET.get('mode') is not None
        or 'wagtail_preview' in request.GET
        or request.headers.get('X-Wagtail-Preview')
    )
    if not is_preview:
        return None

    frontend_url = os.environ.get(
        'WAGTAIL_PREVIEW_FRONTEND_URL',
        os.environ.get('WAGTAILADMIN_BASE_URL', 'https://brio-staging-web.com.br')
    )
    page_url = page.url or '/'
    return HttpResponseRedirect(f"{frontend_url.rstrip('/')}{page_url}")


# Adiciona o método get_preview_template nas pages para apontar ao front
def _add_preview_url_to_pages():
    """
    Monkey-patch: sobrescreve get_preview_url em todas as pages do core
    para devolver a URL do front-end Next.js, que renderiza com os dados reais.
    Isso faz o botão "Pré-visualizar" no Wagtail abrir o site de verdade.
    """
    import os
    from wagtail.models import Page

    _frontend = os.environ.get(
        'WAGTAIL_PREVIEW_FRONTEND_URL',
        os.environ.get('WAGTAILADMIN_BASE_URL', 'https://brio-staging-web.com.br')
    ).rstrip('/')

    def _get_full_url(self, request=None):
        page_url = self.url or '/'
        return f"{_frontend}{page_url}"

    # Aplicamos apenas nas subclasses do core, não globalmente
    from core.models import (
        HomePage, EmpreendimentosIndexPage, EmpreendimentoPage,
        SobreNosPage, ContatoPage, BlogIndexPage, BlogPage
    )
    for cls in (HomePage, EmpreendimentosIndexPage, EmpreendimentoPage,
                SobreNosPage, ContatoPage, BlogIndexPage, BlogPage):
        cls.get_full_url = _get_full_url
        cls.full_url = property(lambda self, f=_frontend: f"{f}{self.url or '/'}")


try:
    _add_preview_url_to_pages()
except Exception:
    pass


# =============================================================================
# Views de Logs de Integrações
# =============================================================================

class IntegrationLogsView(View):
    """
    Painel unificado de logs de todas as integrações:
    RD Station, GTM, Meta Pixel, GA4.
    """

    @method_decorator(staff_member_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get(self, request):
        from .models import RDStationLog
        from django.db.models import Count, Q
        from django.utils import timezone
        from datetime import timedelta

        tab         = request.GET.get('tab', 'rdstation')
        status_f    = request.GET.get('status', '')
        dias_f      = int(request.GET.get('dias', '7'))
        email_f     = request.GET.get('email', '').strip()

        since = timezone.now() - timedelta(days=dias_f)

        # ── RD Station ───────────────────────────────────────────────────
        rd_qs = RDStationLog.objects.filter(criado_em__gte=since).order_by('-criado_em')
        if status_f:
            rd_qs = rd_qs.filter(status=status_f)
        if email_f:
            rd_qs = rd_qs.filter(email_lead__icontains=email_f)

        rd_totals = RDStationLog.objects.filter(criado_em__gte=since).aggregate(
            total   = Count('id'),
            sucessos= Count('id', filter=Q(status='sucesso')),
            falhas  = Count('id', filter=Q(status='falha')),
            inativos= Count('id', filter=Q(status='inativo')),
        )

        # ── GTM / Meta Pixel / GA4: lemos config para exibir estado ─────
        from .models import ConfiguracaoSite
        config = ConfiguracaoSite.objects.first()

        context = {
            'tab'         : tab,
            'status_f'    : status_f,
            'dias_f'      : dias_f,
            'email_f'     : email_f,
            'rd_logs'     : rd_qs[:200],
            'rd_totals'   : rd_totals,
            'config'      : config,
        }
        return render(request, 'wagtailadmin/integration_logs.html', context)


@hooks.register('register_admin_urls')
def register_integration_urls():
    return [
        path('integration-logs/', IntegrationLogsView.as_view(), name='integration_logs'),
        # mantemos o alias antigo para não quebrar bookmarks
        path('rdstation-logs/', IntegrationLogsView.as_view(), name='rdstation_logs'),
    ]


@hooks.register('register_admin_menu_item')
def register_integration_menu_item():
    return MenuItem(
        label='Logs de Integrações',
        url='/admin/integration-logs/',
        icon_name='snippet',
        order=900,
    )
