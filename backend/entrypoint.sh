#!/bin/bash
set -e

echo "Aguardando PostgreSQL..."
while ! python -c "
import sys, socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.connect(('${DB_HOST:-db}', ${DB_PORT:-5432}))
    s.close()
    sys.exit(0)
except Exception:
    sys.exit(1)
" 2>/dev/null; do
    sleep 1
done
echo "PostgreSQL pronto!"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    User.objects.create_superuser('admin', 'admin@virtu.com.br', 'admin123')
"

exec gunicorn virtu.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
