from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_rdstation_oauth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configuracaosite',
            name='rdstation_access_token',
            field=models.TextField(blank=True, verbose_name='RD Station Access Token (gerenciado automaticamente)'),
        ),
        migrations.AlterField(
            model_name='configuracaosite',
            name='rdstation_refresh_token',
            field=models.TextField(blank=True, verbose_name='RD Station Refresh Token (gerenciado automaticamente)'),
        ),
    ]
