from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_rdstationlog'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='configuracaosite',
            name='banner_cta_wrapper_imagem',
            field=models.ForeignKey(
                blank=True,
                help_text="Imagem que aparece no espaço ao REDOR do card 'Breve lançamento' (nas margens laterais e verticais)",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='+',
                to='wagtailimages.image',
                verbose_name='Imagem de Fundo ao Redor do Card',
            ),
        ),
    ]
