#!/usr/bin/env bash
set -euo pipefail

# Entrypoint that supports MODE=dev|prod
MODE=${MODE:-prod}

# Fix permissions for Laravel/Twig storage and cache, attempt safe chown/chmod
# This ensures www-data (Apache) and vscode can write logs and cache files.
if [ -d /workspace/storage ] || [ -d /workspace/bootstrap/cache ]; then
  echo "[entrypoint] fixing permissions on storage and bootstrap/cache"
  chown -R www-data:www-data /workspace/storage /workspace/bootstrap/cache 2>/dev/null || true
  chmod -R ug+rwX /workspace/storage /workspace/bootstrap/cache 2>/dev/null || true
  # If setfacl is available, give vscode user (1000) write access as well
  if command -v setfacl >/dev/null 2>&1; then
    setfacl -R -m u:vscode:rwX /workspace/storage /workspace/bootstrap/cache 2>/dev/null || true
    setfacl -dR -m u:vscode:rwX /workspace/storage /workspace/bootstrap/cache 2>/dev/null || true
  fi
fi

# Ensure Apache uses the project vhost and ports when present
if [ -f /workspace/.devcontainer/blessing-skin.apache.conf ]; then
  echo "[entrypoint] linking blessing-skin apache config"
  rm -f /etc/apache2/sites-enabled/000-default.conf || true
  ln -sf /workspace/.devcontainer/blessing-skin.apache.conf /etc/apache2/sites-enabled/000-default.conf || true
  # clear ports.conf so the vhost's Listen directive takes effect
  truncate -s 0 /etc/apache2/ports.conf || true
fi

if [ "${MODE}" = "dev" ]; then
  echo "[entrypoint] MODE=dev: keeping container running for development"
  exec sleep infinity
fi

echo "[entrypoint] MODE=prod: preparing application"
cd /workspace || exit 1

# Install composer dependencies if vendor missing
if [ ! -d vendor ] && command -v composer >/dev/null 2>&1; then
  echo "[entrypoint] running composer install --no-dev --optimize-autoloader"
  composer install --no-interaction --no-dev --optimize-autoloader || true
fi

# Install node deps and build frontend if package.json exists
if [ -f package.json ] && command -v yarn >/dev/null 2>&1; then
  echo "[entrypoint] running yarn install && yarn build"
  yarn install --frozen-lockfile || yarn install || true
  yarn build || true
fi

echo "[entrypoint] starting apache in foreground"
exec apache2ctl -D FOREGROUND
