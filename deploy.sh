#!/bin/bash
# =============================================================================
# deploy.sh — Script de deploy seguro para o projeto Virtú
# Uso: ./deploy.sh [--backend-only | --frontend-only | --full]
# Padrão: --full (rebuilda tudo)
# =============================================================================

set -e  # Para na primeira falha

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log()  { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC}  $1"; }
err()  { echo -e "${RED}[erro]${NC}  $1"; exit 1; }

MODE="${1:---full}"
cd /var/www/virtu_oficial

# =============================================================================
# 1. GIT PULL
# =============================================================================
log "Atualizando código..."
git pull || err "Falha no git pull"

# =============================================================================
# 2. BUILD
# =============================================================================
case "$MODE" in
  --backend-only)
    log "Build do backend..."
    docker compose build backend
    ;;
  --frontend-only)
    log "Build do frontend..."
    docker compose build frontend
    ;;
  *)
    log "Build completo (backend + frontend)..."
    docker compose build backend frontend
    ;;
esac

# =============================================================================
# 3. SUBIR CONTAINERS
# =============================================================================
log "Subindo containers..."
docker compose up -d

# Aguarda backend estar saudável (máx 30s)
log "Aguardando backend iniciar..."
for i in $(seq 1 15); do
  sleep 2
  STATUS=$(docker compose ps backend --format json 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('State',''))" 2>/dev/null || echo "")
  if [ "$STATUS" = "running" ]; then
    break
  fi
done

# =============================================================================
# 4. MIGRATIONS — com tratamento automático de divergências
# =============================================================================
log "Verificando migrations pendentes..."

# Obtém a última migration aplicada no banco
LAST_APPLIED=$(docker compose exec -T backend python manage.py showmigrations core 2>/dev/null | grep '\[X\]' | tail -1 | awk '{print $2}' || echo "")
log "Última migration no banco: ${LAST_APPLIED:-nenhuma}"

# Verifica se há migrations pendentes
PENDING=$(docker compose exec -T backend python manage.py showmigrations core 2>/dev/null | grep '\[ \]' | wc -l || echo "99")

if [ "$PENDING" -gt "0" ]; then
  log "Aplicando $PENDING migration(s) pendente(s)..."
  
  # Tenta aplicar normalmente
  if docker compose exec -T backend python manage.py migrate 2>/tmp/migrate_err; then
    log "Migrations aplicadas com sucesso!"
  else
    ERRMSG=$(cat /tmp/migrate_err)
    
    # Detecta erro de coluna duplicada (DuplicateColumn)
    if echo "$ERRMSG" | grep -q "DuplicateColumn\|already exists"; then
      warn "Coluna já existe no banco — aplicando fake na migration problemática..."
      
      # Extrai o nome da migration que falhou
      FAIL_MIG=$(echo "$ERRMSG" | grep "Applying core\." | grep -o 'core\.[^ ]*' | head -1 | sed 's/core\.//')
      
      if [ -n "$FAIL_MIG" ]; then
        warn "Fazendo fake em: $FAIL_MIG"
        docker compose exec -T backend python manage.py migrate core "$FAIL_MIG" --fake
        docker compose exec -T backend python manage.py migrate
        log "Migrations corrigidas com sucesso!"
      else
        warn "Não foi possível detectar a migration — tentando fake na última..."
        LAST_FILE=$(ls backend/core/migrations/0*.py 2>/dev/null | sort | tail -1 | xargs basename | sed 's/\.py//')
        docker compose exec -T backend python manage.py migrate core "$LAST_FILE" --fake
        docker compose exec -T backend python manage.py migrate
      fi
      
    # Detecta NodeNotFoundError (dependência inexistente)
    elif echo "$ERRMSG" | grep -q "NodeNotFoundError\|nonexistent parent node"; then
      warn "Dependência de migration inexistente detectada!"
      
      # Extrai qual migration tem dependência quebrada
      BAD_DEP=$(echo "$ERRMSG" | grep "nonexistent parent node" | grep -o "'core', '[^']*'" | tail -1 | grep -o "0[0-9_a-z]*")
      warn "Dependência inexistente: $BAD_DEP"
      warn "Fazendo fake na última migration conhecida do banco..."
      
      # Faz fake em todas as migrations que o banco não conhece
      for mig in $(docker compose exec -T backend python manage.py showmigrations core 2>/dev/null | grep '\[ \]' | awk '{print $2}'); do
        warn "Fake em: $mig"
        docker compose exec -T backend python manage.py migrate core "$mig" --fake 2>/dev/null || true
      done
      docker compose exec -T backend python manage.py migrate
      
    else
      err "Falha nas migrations:\n$ERRMSG"
    fi
  fi
else
  log "Nenhuma migration pendente."
fi

# =============================================================================
# 5. COLLECTSTATIC (opcional, já feito no build)
# =============================================================================
# docker compose exec -T backend python manage.py collectstatic --noinput

# =============================================================================
# 6. STATUS FINAL
# =============================================================================
log "=== DEPLOY CONCLUÍDO ==="
docker compose ps
echo ""
log "Migrations core:"
docker compose exec -T backend python manage.py showmigrations core | tail -8
