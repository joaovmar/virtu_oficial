from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_banner_cta_wrapper_imagem'),
        ('wagtailimages', '0026_delete_uploadedimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='homepage',
            name='video_url',
            field=models.URLField(
                blank=True,
                verbose_name='URL do Vídeo Institucional',
                help_text='Cole o link do YouTube. Ex: https://www.youtube.com/watch?v=XXXXXXXXXXX',
            ),
        ),
        migrations.AddField(
            model_name='homepage',
            name='video_thumbnail',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='+',
                to='wagtailimages.image',
                verbose_name='Thumbnail do Vídeo',
                help_text='Imagem que aparece antes de reproduzir o vídeo (16:9, mín. 1280×720 px)',
            ),
        ),
    ]
