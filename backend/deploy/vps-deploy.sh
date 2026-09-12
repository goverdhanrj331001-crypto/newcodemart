#!/usr/bin/env bash
# =========================================================================
# CodeMart Backend — VPS One-Shot Deploy Script (Ubuntu 22.04 / 24.04)
# =========================================================================
# Usage (as root or sudo-capable user):
#   chmod +x deploy/vps-deploy.sh
#   ./deploy/vps-deploy.sh
# =========================================================================
set -euo pipefail

# Colors
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log(){ echo -e "${GREEN}[deploy]${NC} $1"; }
warn(){ echo -e "${YELLOW}[warn]${NC} $1"; }
err(){ echo -e "${RED}[error]${NC} $1"; }

PROJECT_DIR="${PROJECT_DIR:-/opt/codemart}"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.yml"

# 1. Install Docker if missing
if ! command -v docker >/dev/null 2>&1; then
  log "Docker not found — installing Docker CE..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
fi

# 2. Ensure docker-compose plugin
if ! docker compose version >/dev/null 2>&1; then
  err "Docker Compose v2 not available. Install manually: https://docs.docker.com/compose/install/"
  exit 1
fi

# 3. Project dir setup
if [ ! -d "${PROJECT_DIR}" ]; then
  err "Project directory not found: ${PROJECT_DIR}. Please upload the backend code there first."
  exit 1
fi

cd "${PROJECT_DIR}"

# 4. Ensure .env file
if [ ! -f .env ]; then
  warn ".env not found — copying from .env.example. EDIT SECRETS BEFORE GOING LIVE!"
  cp .env.example .env
fi

# 5. Pull & build
log "Pulling/building images..."
docker compose --env-file .env -f docker-compose.yml build

# 6. Boot
log "Starting services (postgres, redis, api)..."
docker compose --env-file .env -f docker-compose.yml up -d

# 7. Wait for postgres
log "Waiting for postgres to be healthy..."
for i in {1..30}; do
  if docker compose -f docker-compose.yml ps postgres | grep -q "healthy"; then
    break
  fi
  sleep 2
done

# 8. Run migrations + seed
log "Running database migrations..."
docker compose -f docker-compose.yml exec -T api node dist/database/run-migration.js || true

log "Seeding initial data (super admin, sample products, courses)..."
docker compose -f docker-compose.yml exec -T api node dist/database/seed.js || true

log "Done. Services:"
docker compose -f docker-compose.yml ps

echo
log "API:        http://$(hostname -I | awk '{print $1}'):4000/api/health"
log "Swagger:    http://$(hostname -I | awk '{print $1}'):4000/docs"
log "Super Admin: email=\$SUPER_ADMIN_EMAIL  password=\$SUPER_ADMIN_PASSWORD (see .env)"
