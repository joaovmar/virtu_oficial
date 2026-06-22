from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_contato_formulario_privacidade'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='empreendimentosindexpage',
            name='banner_label',
            field=models.CharField(blank=True, default='Breve lançamento', max_length=100, verbose_name='Label do Banner (ex: Breve lançamento)'),
        ),
        migrations.AddField(
            model_name='empreendimentosindexpage',
            name='banner_texto',
            field=models.TextField(blank=True, verbose_name='Texto/Título do Banner'),
        ),
        migrations.AddField(
            model_name='empreendimentosindexpage',
            name='banner_logo_parceiro',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.image', verbose_name='Logo do Parceiro (ex: Perplan)'),
        ),
        migrations.AddField(
            model_name='empreendimentosindexpage',
            name='banner_logo_virtu',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to='wagtailimages.image', verbose_name="Logo da virtú no Banner"),
        ),
    ]
