#!/usr/bin/env bash
set -Eeuo pipefail

REPO="https://github.com/rtmarcomt-tech/Aurea.git"
APP_DIR="/opt/aurea"
AUREA_PORT="3001"
PUBLIC_URL="http://185.217.125.200:${AUREA_PORT}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Execute este instalador como root (SSH root)."
  exit 1
fi

if [[ ! -f /etc/os-release ]]; then
  echo "Não foi possível identificar a distribuição Linux."
  exit 1
fi
. /etc/os-release
if [[ "${ID:-}" != "ubuntu" && "${ID:-}" != "debian" ]]; then
  echo "Sistema não validado para este instalador: ${PRETTY_NAME:-desconhecido}"
  echo "Não foram feitas alterações."
  exit 1
fi

if command -v ss >/dev/null 2>&1 && ss -ltnH "sport = :${AUREA_PORT}" | grep -q .; then
  echo "A porta TCP ${AUREA_PORT} também já está ocupada. Não vou parar nem alterar esse serviço."
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git openssl

if ! command -v docker >/dev/null 2>&1; then
  echo "A instalar Docker Engine..."
  curl -fsSL https://get.docker.com | sh
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "A instalar o plugin Docker Compose..."
  if ! apt-get install -y docker-compose-v2; then
    apt-get install -y docker-compose-plugin
  fi
fi

systemctl enable --now docker

if [[ -d "${APP_DIR}/.git" ]]; then
  git -C "${APP_DIR}" pull --ff-only origin main
elif [[ -d "${APP_DIR}" ]] && [[ -n "$(find "${APP_DIR}" -mindepth 1 -maxdepth 1 -print -quit)" ]]; then
  echo "${APP_DIR} já existe e não é um clone AureA. Não vou alterar o seu conteúdo."
  exit 1
else
  git clone --branch main --depth 1 "${REPO}" "${APP_DIR}"
fi

cd "${APP_DIR}"

if [[ ! -f .env.production ]]; then
  umask 077
  cat > .env.production <<EOF
POSTGRES_PASSWORD=$(openssl rand -hex 32)
APP_SECRET=$(openssl rand -hex 48)
AUREA_PORT=${AUREA_PORT}
APP_URL=${PUBLIC_URL}
EOF
  chmod 600 .env.production
fi

if ! grep -q '^POSTGRES_PASSWORD=.' .env.production || ! grep -q '^APP_SECRET=.' .env.production; then
  echo "O ficheiro .env.production não contém os segredos necessários."
  exit 1
fi

if command -v ufw >/dev/null 2>&1 && ufw status 2>/dev/null | grep -q "Status: active"; then
  ufw allow "${AUREA_PORT}/tcp"
fi

docker compose --env-file .env.production -f docker-compose.production.yml up -d --build

echo "A aguardar pela aplicação..."
for attempt in $(seq 1 60); do
  if curl -fsS "http://127.0.0.1:${AUREA_PORT}/" >/dev/null; then
    echo
    echo "AureA instalada e a responder."
    echo "Endereço temporário: ${PUBLIC_URL}"
    echo "Diretório: ${APP_DIR}"
    echo "PostgreSQL isolado num volume Docker próprio."
    echo "O acesso administrativo permanece bloqueado até configurar HTTPS."
    exit 0
  fi
  sleep 5
done

echo "A aplicação não respondeu dentro do tempo esperado. Estado dos containers:"
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 web
exit 1
