from django.db import migrations, models
import django.db.models.deletion
import wagtail.fields
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_configuracaosite_banner_logos'),
        ('wagtailcore', '0094_alter_page_locale'),
    ]

    operations = [
        # CategoriaContato
        migrations.CreateModel(
            name='CategoriaContato',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100, verbose_name='Nome da Categoria')),
                ('slug', models.SlugField(unique=True, verbose_name='Slug')),
                ('email_destino', models.EmailField(help_text='Para qual e-mail os formulários desta categoria serão enviados', verbose_name='E-mail de Destino')),
                ('ativo', models.BooleanField(default=True, verbose_name='Ativo')),
                ('ordem', models.PositiveIntegerField(default=0, verbose_name='Ordem')),
            ],
            options={'verbose_name': 'Categoria de Contato', 'verbose_name_plural': 'Categorias de Contato', 'ordering': ['ordem', 'nome']},
        ),
        # CampoCategoriaContato
        migrations.CreateModel(
            name='CampoCategoriaContato',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('sort_order', models.IntegerField(blank=True, editable=False, null=True)),
                ('label', models.CharField(max_length=100, verbose_name='Label do Campo')),
                ('tipo', models.CharField(
                    choices=[('texto', 'Texto curto'), ('textarea', 'Texto longo'), ('email', 'E-mail'), ('telefone', 'Telefone'), ('select', 'Seleção (dropdown)'), ('checkbox', 'Checkbox (sim/não)')],
                    default='texto', max_length=20, verbose_name='Tipo'
                )),
                ('placeholder', models.CharField(blank=True, max_length=200, verbose_name='Placeholder')),
                ('obrigatorio', models.BooleanField(default=True, verbose_name='Obrigatório')),
                ('opcoes', models.TextField(blank=True, help_text="Uma opção por linha. Apenas para tipo 'Seleção'", verbose_name='Opções (para Seleção)')),
                ('categoria', modelcluster.fields.ParentalKey(on_delete=django.db.models.deletion.CASCADE, related_name='campos', to='core.categoriacontato')),
            ],
            options={'verbose_name': 'Campo do Formulário', 'verbose_name_plural': 'Campos do Formulário', 'ordering': ['sort_order']},
        ),
        # ContatoFormulario
        migrations.CreateModel(
            name='ContatoFormulario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=200, verbose_name='Nome')),
                ('email', models.EmailField(verbose_name='E-mail')),
                ('telefone', models.CharField(blank=True, max_length=20, verbose_name='Telefone')),
                ('dados', models.JSONField(default=dict, verbose_name='Dados do Formulário')),
                ('email_enviado_para', models.EmailField(blank=True, verbose_name='E-mail Enviado Para')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Data')),
                ('lido', models.BooleanField(default=False, verbose_name='Lido')),
                ('categoria', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='core.categoriacontato', verbose_name='Categoria')),
            ],
            options={'verbose_name': 'Formulário Recebido', 'verbose_name_plural': 'Formulários Recebidos', 'ordering': ['-created_at']},
        ),
        # PoliticaPrivacidadePage
        migrations.CreateModel(
            name='PoliticaPrivacidadePage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.page')),
                ('hero_titulo', models.CharField(default='Política de Privacidade', max_length=200, verbose_name='Título')),
                ('ultima_atualizacao', models.DateField(blank=True, null=True, verbose_name='Data da Última Atualização')),
                ('conteudo', wagtail.fields.RichTextField(help_text='Texto completo da política de privacidade.', verbose_name='Conteúdo')),
            ],
            options={'verbose_name': 'Política de Privacidade'},
            bases=('wagtailcore.page',),
        ),
    ]
