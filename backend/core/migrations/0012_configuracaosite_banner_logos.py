from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_empreendimentopage_imagem_futuros_lancamentos'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuracaosite',
            name='banner_logo_parceiro',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='+',
                to='wagtailimages.image',
                verbose_name='Logo do Parceiro (ex: Perplan)',
                help_text="Logo que aparece à esquerda no banner 'Breve Lançamento'",
            ),
        ),
        migrations.AddField(
            model_name='configuracaosite',
            name='banner_logo_virtu',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='+',
                to='wagtailimages.image',
                verbose_name='Logo da virtú no Banner',
                help_text="Logo da virtú que aparece no banner 'Breve Lançamento'",
            ),
        ),
    ]
