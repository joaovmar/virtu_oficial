# Virtú - Site Institucional Completo

Site institucional da Virtú Incorporações e Urbanismo com **Backend Django/Wagtail** e **Frontend Next.js**.

## 🏗️ Estrutura do Projeto

```
virtu-project/
├── backend/          # Django + Wagtail + DRF
│   ├── core/         # App principal (models, views, serializers)
│   ├── virtu/        # Configurações Django
│   ├── media/        # Uploads
│   └── manage.py
│
├── frontend/         # Next.js 14 + TypeScript + Tailwind
│   ├── src/
│   │   ├── app/      # Pages (App Router)
│   │   ├── components/
│   │   ├── lib/      # API client
│   │   └── styles/
│   └── package.json
│
└── README.md
```

---

## 🚀 Início Rápido

### Pré-requisitos

- **Python 3.11 ou 3.12** (NÃO use 3.14)
- **Node.js 18+**
- **npm ou yarn**

### 1. Backend (Django/Wagtail)

```bash
cd backend

# Criar ambiente virtual
python -m venv .venv

# Ativar (Windows)
.venv\Scripts\activate

# Ativar (Linux/Mac)
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env
cp .env.example .env

# Criar migrações e banco de dados
python manage.py makemigrations core
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar servidor
python manage.py runserver
```

O backend estará em: **http://localhost:8000**

### 2. Frontend (Next.js)

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.local.example .env.local

# Rodar servidor de desenvolvimento
npm run dev
```

O frontend estará em: **http://localhost:3000**

---

## 📝 Painel Administrativo (Marketing)

### Acesso ao Wagtail Admin

**URL:** http://localhost:8000/admin/

O Wagtail oferece uma interface intuitiva para a equipe de marketing editar:

#### Conteúdo Editável:

| Seção | O que pode editar |
|-------|-------------------|
| **Páginas** | Home, Sobre Nós, Contato, Blog |
| **Empreendimentos** | Criar, editar, excluir empreendimentos completos |
| **Snippets** | Cidades, Status, Parceiros, Depoimentos |
| **Imagens** | Biblioteca de imagens com redimensionamento automático |
| **Configurações** | E-mail, telefone, redes sociais |

#### Como a equipe de MKT pode editar:

1. **Editar textos da Home:**
   - Acesse Páginas > Home
   - Edite título do hero, seção "Pensamos no futuro", etc.
   - Clique em "Publicar"

2. **Adicionar novo empreendimento:**
   - Acesse Páginas > Empreendimentos
   - Clique em "Adicionar subpágina"
   - Preencha todas as informações
   - Faça upload de imagens, plantas, vídeo
   - Publique

3. **Gerenciar depoimentos:**
   - Acesse Snippets > Depoimentos
   - Adicione/edite depoimentos
   - Marque "Destaque" para aparecer na home

4. **Atualizar configurações:**
   - Acesse Snippets > Configurações do Site
   - Edite e-mail, telefone, redes sociais

---

## 🔌 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/home/` | Dados da página inicial |
| GET | `/api/empreendimentos/` | Lista de empreendimentos |
| GET | `/api/empreendimentos/{slug}/` | Detalhe do empreendimento |
| GET | `/api/empreendimentos/?cidade={id}` | Filtrar por cidade |
| GET | `/api/cidades/` | Lista de cidades |
| GET | `/api/depoimentos/` | Lista de depoimentos |
| GET | `/api/sobre-nos/` | Página sobre nós |
| GET | `/api/configuracoes/` | Configurações do site |
| POST | `/api/leads/` | Criar lead |
| POST | `/api/newsletter/` | Inscrição newsletter |

---

## 🎨 Estrutura de Páginas

### Frontend (Next.js)

| Rota | Página |
|------|--------|
| `/` | Home |
| `/empreendimentos` | Listagem de empreendimentos |
| `/empreendimentos/[slug]` | Detalhe do empreendimento |
| `/a-virtu` | Sobre nós |
| `/contato` | Fale conosco |
| `/blog` | Blog (a implementar) |

---

## 🛠️ Tecnologias

### Backend
- Django 5.x
- Wagtail 6.x (CMS)
- Django REST Framework
- SQLite (dev) / PostgreSQL (prod)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (animações)
- React Hook Form
- Axios

---

## 📦 Deploy

### Backend (Exemplo: Railway, Render, Heroku)

```bash
# Configurar variáveis de ambiente
SECRET_KEY=sua-chave-secreta
DEBUG=False
ALLOWED_HOSTS=seu-dominio.com
DATABASE_URL=postgres://...
```

### Frontend (Vercel)

```bash
# Deploy automático com Vercel
vercel deploy
```

Configure a variável `NEXT_PUBLIC_API_URL` para apontar para o backend em produção.

---

## 📄 Licença

Projeto desenvolvido para Virtú Incorporações e Urbanismo.
