from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_empreendimentopage_futuro_lancamento'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='empreendimentopage',
            name='imagem_futuros_lancamentos',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='+',
                to='wagtailimages.image',
                verbose_name='Imagem do Banner Futuros Lançamentos',
                help_text='Imagem usada como fundo no slider Futuros Lançamentos. Se não informada, usa a Imagem Principal.',
            ),
        ),
    ]
