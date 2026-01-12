#!/bin/bash

# Скрипт для остановки проекта

set -e

cd "$(dirname "$0")/docker"

if command -v podman-compose &> /dev/null; then
    podman-compose down
elif command -v docker-compose &> /dev/null; then
    if [ -n "$DOCKER_HOST" ] || podman info &> /dev/null; then
        DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock docker-compose down
    else
        docker-compose down
    fi
else
    echo "❌ Не найден podman-compose или docker-compose"
    exit 1
fi

echo "✅ Сервисы остановлены"

