#!/bin/bash

if [[ ! -e .env ]]; then
    cp .devcontainer/.env.devcontainer .env
fi

# Install PHP and JS dependencies for development
if command -v composer >/dev/null 2>&1; then
    echo "[post-create] running composer install"
    composer install || true
fi

if command -v yarn >/dev/null 2>&1 && [ -f package.json ]; then
    echo "[post-create] running yarn install"
    # avoid optional native deps causing GUI/wayland issues
    yarn install --frozen-lockfile || yarn install || true
fi
