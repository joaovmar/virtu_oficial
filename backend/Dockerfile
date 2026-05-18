FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dependências do sistema:
# - gcc, libpq-dev: PostgreSQL
# - libjpeg, zlib, libwebp: Pillow (imagens)
# - libcairo2, libpango, libgdk-pixbuf: CairoSVG (suporte a SVG)
# - libffi: cffi (dependência do cairocffi)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev \
    libjpeg62-turbo-dev zlib1g-dev libwebp-dev \
    libcairo2-dev libpango1.0-dev libgdk-pixbuf-xlib-2.0-dev libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Coleta static files (ignora erros na build pois DB não existe ainda)
RUN DJANGO_SETTINGS_MODULE=virtu.settings.production \
    SECRET_KEY=build-placeholder \
    DB_HOST=localhost \
    python manage.py collectstatic --noinput 2>/dev/null || true

EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
