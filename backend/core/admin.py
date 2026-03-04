# -*- coding: utf-8 -*-
"""
Django Admin para o site Virtú
Conforme documentação: CMS e Autonomia para Marketing
"""

from django.contrib import admin
from django.utils.html import format_html
from django.http import HttpResponse
import csv

from .models import Lead, Newsletter, Diferencial


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    """
    Admin de Leads conforme documentação:
    - Acessar contatos
    - Exportar para CSV
    - Integrar com CRM
    """
    list_display = ['nome', 'email', 'telefone', 'empreendimento_nome', 'status_badge', 'origem', 'created_at', 'lido']
    list_filter = ['status', 'lido', 'created_at', 'empreendimento', 'origem']
    search_fields = ['nome', 'email', 'telefone']
    list_editable = ['lido']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    actions = ['marcar_como_lido', 'marcar_como_em_contato', 'exportar_csv']

    fieldsets = (
        ('Informações do Lead', {
            'fields': ('nome', 'email', 'telefone', 'mensagem')
        }),
        ('Origem', {
            'fields': ('empreendimento', 'origem', 'pagina_origem')
        }),
        ('UTM', {
            'fields': ('utm_source', 'utm_medium', 'utm_campaign'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('status', 'lido', 'observacoes')
        }),
        ('Datas', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def empreendimento_nome(self, obj):
        if obj.empreendimento:
            return obj.empreendimento.title
        return '-'
    empreendimento_nome.short_description = 'Empreendimento'

    def status_badge(self, obj):
        colors = {
            'novo': '#3498db',
            'em_contato': '#f39c12',
            'qualificado': '#9b59b6',
            'convertido': '#27ae60',
            'perdido': '#e74c3c',
        }
        color = colors.get(obj.status, '#95a5a6')
        return format_html(
            '<span style="background:{}; color:white; padding:3px 10px; border-radius:3px; font-size:11px;">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    @admin.action(description='Marcar como lido')
    def marcar_como_lido(self, request, queryset):
        queryset.update(lido=True)

    @admin.action(description='Marcar como "Em Contato"')
    def marcar_como_em_contato(self, request, queryset):
        queryset.update(status='em_contato', lido=True)

    @admin.action(description='Exportar para CSV')
    def exportar_csv(self, request, queryset):
        """Exportar leads selecionados para CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="leads_virtu.csv"'
        response.write('\ufeff')  # BOM para Excel

        writer = csv.writer(response, delimiter=';')
        writer.writerow([
            'Nome', 'E-mail', 'Telefone', 'Empreendimento', 'Origem',
            'Status', 'Data', 'Mensagem', 'Observações'
        ])

        for lead in queryset:
            writer.writerow([
                lead.nome,
                lead.email,
                lead.telefone,
                lead.empreendimento.title if lead.empreendimento else '',
                lead.origem,
                lead.get_status_display(),
                lead.created_at.strftime('%d/%m/%Y %H:%M'),
                lead.mensagem,
                lead.observacoes,
            ])

        return response


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    """Admin de Newsletter"""
    list_display = ['email', 'ativo', 'data_inscricao']
    list_filter = ['ativo', 'data_inscricao']
    search_fields = ['email']
    list_editable = ['ativo']
    ordering = ['-data_inscricao']
    actions = ['ativar', 'desativar', 'exportar_emails']

    @admin.action(description='Ativar selecionados')
    def ativar(self, request, queryset):
        queryset.update(ativo=True)

    @admin.action(description='Desativar selecionados')
    def desativar(self, request, queryset):
        queryset.update(ativo=False)

    @admin.action(description='Exportar e-mails')
    def exportar_emails(self, request, queryset):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="newsletter_virtu.csv"'
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow(['E-mail', 'Ativo', 'Data Inscrição'])

        for item in queryset:
            writer.writerow([
                item.email,
                'Sim' if item.ativo else 'Não',
                item.data_inscricao.strftime('%d/%m/%Y %H:%M'),
            ])

        return response


@admin.register(Diferencial)
class DiferencialAdmin(admin.ModelAdmin):
    """
    Admin de Diferenciais conforme documentação:
    - Ativar, desativar e reordenar
    - Alterar descrições e ícones
    """
    list_display = ['nome', 'categoria', 'ativo', 'ordem']
    list_filter = ['categoria', 'ativo']
    search_fields = ['nome', 'descricao']
    list_editable = ['ativo', 'ordem']
    ordering = ['ordem', 'nome']


# Customização do Admin Site
admin.site.site_header = 'Virtú - Administração'
admin.site.site_title = 'Virtú Admin'
admin.site.index_title = 'Painel de Administração'
