# Инструкция по запуску проекта через Podman

## Вариант 1: Использование podman-compose (рекомендуется)

### Установка podman-compose (если не установлен)

```bash
# Через pip
pip install podman-compose

# Или через pipx (рекомендуется)
pipx install podman-compose
```

### Запуск проекта

```bash
cd docker
podman-compose up -d --build
```

### Просмотр логов

```bash
# Все сервисы
podman-compose logs -f

# Конкретный сервис
podman-compose logs -f main-service
```

### Остановка проекта

```bash
cd docker
podman-compose down
```

## Вариант 2: Использование docker-compose с Podman

Если у вас установлен docker-compose и Podman настроен как Docker runtime:

```bash
cd docker
DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock docker-compose up -d --build
```

## Вариант 3: Использование скрипта запуска

```bash
chmod +x start.sh
./start.sh
```

## Вариант 4: Ручной запуск через podman

Если podman-compose недоступен, можно запустить контейнеры вручную:

### 1. Запуск PostgreSQL

```bash
podman run -d \
  --name news_aggregator_postgres \
  -e POSTGRES_DB=news_aggregator \
  -e POSTGRES_USER=news_user \
  -e POSTGRES_PASSWORD=news_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -v $(pwd)/database/init:/docker-entrypoint-initdb.d \
  postgres:15-alpine
```

### 2. Запуск Zookeeper

```bash
podman run -d \
  --name news_aggregator_zookeeper \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000 \
  -p 2181:2181 \
  confluentinc/cp-zookeeper:7.6.0
```

### 3. Запуск Kafka

```bash
podman run -d \
  --name news_aggregator_kafka \
  --link news_aggregator_zookeeper:zookeeper \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
  -p 9092:9092 \
  confluentinc/cp-kafka:7.6.0
```

### 4. Сборка и запуск сервисов

```bash
# Main Service
cd backend/main-service
podman build -t news-aggregator-main-service .
podman run -d \
  --name news_aggregator_main_service \
  --link news_aggregator_postgres:postgres \
  --link news_aggregator_kafka:kafka \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/news_aggregator \
  -e SPRING_DATASOURCE_USERNAME=news_user \
  -e SPRING_DATASOURCE_PASSWORD=news_password \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092 \
  -p 8080:8080 \
  news-aggregator-main-service

# Email Service
cd ../email-service
podman build -t news-aggregator-email-service .
podman run -d \
  --name news_aggregator_email_service \
  --link news_aggregator_kafka:kafka \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092 \
  -p 8081:8081 \
  news-aggregator-email-service

# RSS Parser Service
cd ../rss-parser-service
podman build -t news-aggregator-rss-parser-service .
podman run -d \
  --name news_aggregator_rss_parser_service \
  --link news_aggregator_postgres:postgres \
  --link news_aggregator_kafka:kafka \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/news_aggregator \
  -e SPRING_DATASOURCE_USERNAME=news_user \
  -e SPRING_DATASOURCE_PASSWORD=news_password \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092 \
  -p 8082:8082 \
  news-aggregator-rss-parser-service

# Frontend
cd ../../frontend
podman build -t news-aggregator-frontend .
podman run -d \
  --name news_aggregator_frontend \
  --link news_aggregator_main_service:main-service \
  -p 3000:80 \
  news-aggregator-frontend
```

## Проверка работы

После запуска проверьте статус контейнеров:

```bash
podman ps
```

Должны быть запущены все 7 контейнеров:
- news_aggregator_postgres
- news_aggregator_zookeeper
- news_aggregator_kafka
- news_aggregator_main_service
- news_aggregator_email_service
- news_aggregator_rss_parser_service
- news_aggregator_frontend

## Доступ к сервисам

- **Frontend**: http://localhost:3000
- **Main Service API**: http://localhost:8080
- **Email Service**: http://localhost:8081
- **RSS Parser Service**: http://localhost:8082
- **PostgreSQL**: localhost:5432
- **Kafka**: localhost:9092

## Просмотр логов

```bash
# Все контейнеры
podman ps -q | xargs -I {} podman logs -f {}

# Конкретный сервис
podman logs -f news_aggregator_main_service
```

## Остановка

```bash
# Через podman-compose
cd docker
podman-compose down

# Или вручную
podman stop news_aggregator_postgres news_aggregator_zookeeper news_aggregator_kafka \
  news_aggregator_main_service news_aggregator_email_service \
  news_aggregator_rss_parser_service news_aggregator_frontend

podman rm news_aggregator_postgres news_aggregator_zookeeper news_aggregator_kafka \
  news_aggregator_main_service news_aggregator_email_service \
  news_aggregator_rss_parser_service news_aggregator_frontend
```

## Переменные окружения

Для работы email-сервиса нужно установить переменные окружения:

```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

Затем перезапустите email-service:

```bash
podman restart news_aggregator_email_service
```

## Устранение проблем

### Проблема: порты заняты

Если порты заняты, измените их в `docker/podman-compose.yml` или остановите конфликтующие сервисы.

### Проблема: контейнеры не могут подключиться друг к другу

Убедитесь, что используется одна сеть Podman. При использовании podman-compose сеть создается автоматически.

### Проблема: база данных не инициализируется

Проверьте, что путь к `database/init` правильный относительно `docker/podman-compose.yml`.

