from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_contatopage_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='empreendimentopage',
            name='futuro_lancamento',
            field=models.BooleanField(
                default=False,
                verbose_name='Exibir em Futuros Lançamentos',
                help_text="Marque para exibir este empreendimento na seção 'Futuros Lançamentos' da Home e da página de Empreendimentos",
            ),
        ),
    ]
