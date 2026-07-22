from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_rdstation_tokens_textfield'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuracaosite',
            name='rdstation_api_key_conversao',
            field=models.CharField(
                blank=True, max_length=255,
                verbose_name='RD Station API Key (Conversões) — usada no envio de leads',
            ),
        ),
    ]
