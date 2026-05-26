from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_andamentoobra_options_alter_fotoobra_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='contatopage',
            name='secao_titulo',
            field=models.CharField(
                blank=True,
                default='Vamos conversar sobre o seu futuro!',
                max_length=200,
                verbose_name='Título da Seção de Contato',
            ),
        ),
        migrations.AddField(
            model_name='contatopage',
            name='horario_semana',
            field=models.CharField(
                blank=True,
                default='Segunda a Sexta: 9h às 18h',
                max_length=100,
                verbose_name='Horário Semana',
            ),
        ),
        migrations.AddField(
            model_name='contatopage',
            name='horario_fim_semana',
            field=models.CharField(
                blank=True,
                default='Sábado: 9h às 13h',
                max_length=100,
                verbose_name='Horário Fim de Semana',
            ),
        ),
    ]
