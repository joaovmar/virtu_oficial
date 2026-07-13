from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0014_empreendimentosindexpage_banner_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_client_id',
            field=models.CharField(blank=True, max_length=200, verbose_name='RD Station Client ID (OAuth)'),
        ),
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_client_secret',
            field=models.CharField(blank=True, max_length=200, verbose_name='RD Station Client Secret (OAuth)'),
        ),
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_access_token',
            field=models.CharField(blank=True, max_length=500, verbose_name='RD Station Access Token (gerenciado automaticamente)'),
        ),
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_refresh_token',
            field=models.CharField(blank=True, max_length=500, verbose_name='RD Station Refresh Token (gerenciado automaticamente)'),
        ),
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_token_expira_em',
            field=models.DateTimeField(blank=True, null=True, verbose_name='RD Station Token expira em (gerenciado automaticamente)'),
        ),
    ]
