#!/bin/bash

# Скрипт для запуска проекта через Podman

set -e

echo "🚀 Запуск агрегатора новостей через Podman..."

cd "$(dirname "$0")/docker"

# Проверяем наличие podman-compose
if command -v podman-compose &> /dev/null; then
    echo "✅ Используем podman-compose"
    podman-compose up -d --build
elif command -v docker-compose &> /dev/null; then
    echo "✅ Используем docker-compose с Podman"
    # Проверяем, настроен ли podman как docker backend
    if [ -n "$DOCKER_HOST" ] || podman info &> /dev/null; then
        DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock docker-compose up -d --build
    else
        docker-compose up -d --build
    fi
else
    echo "❌ Не найден podman-compose или docker-compose"
    echo "Установите один из них:"
    echo "  pip3 install podman-compose"
    echo "  или"
    echo "  brew install docker-compose"
    exit 1
fi

echo ""
echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo ""
echo "✅ Сервисы запущены!"
echo ""
echo "📋 Доступные сервисы:"
echo "  - Frontend: http://localhost:3000"
echo "  - Main Service API: http://localhost:8080"
echo "  - Email Service: http://localhost:8081"
echo "  - RSS Parser Service: http://localhost:8082"
echo "  - PostgreSQL: localhost:5432"
echo "  - Kafka: localhost:9092"
echo ""
echo "📝 Полезные команды:"
echo "  Просмотр логов: cd docker && podman-compose logs -f [service_name]"
echo "  Остановка: cd docker && podman-compose down"
echo "  Перезапуск: cd docker && podman-compose restart"
