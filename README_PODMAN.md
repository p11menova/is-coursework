# Инструкция по запуску через Podman

## Вариант 1: Использование podman-compose (рекомендуется)

### Установка podman-compose (если не установлен):

```bash
# Через pip
pip3 install podman-compose

# Или через pipx
pipx install podman-compose
```

### Запуск проекта:

```bash
cd docker
podman-compose up -d
```

### Остановка проекта:

```bash
cd docker
podman-compose down
```

### Просмотр логов:

```bash
cd docker
podman-compose logs -f [service_name]  # например: main-service, frontend
```

## Вариант 2: Использование docker-compose с Podman

Если у вас установлен docker-compose и настроен Podman как Docker backend:

```bash
cd docker
DOCKER_HOST=unix://$XDG_RUNTIME_DIR/podman/podman.sock docker-compose up -d
```

## Вариант 3: Ручной запуск через podman (если compose недоступен)

### 1. Создать сеть:

```bash
podman network create news_aggregator_network
```

### 2. Запустить PostgreSQL:

```bash
podman run -d \
  --name news_aggregator_postgres \
  --network news_aggregator_network \
  -e POSTGRES_DB=news_aggregator \
  -e POSTGRES_USER=news_user \
  -e POSTGRES_PASSWORD=news_password \
  -p 5432:5432 \
  -v $(pwd)/database/init:/docker-entrypoint-initdb.d \
  postgres:15-alpine
```

### 3. Запустить Zookeeper:

```bash
podman run -d \
  --name news_aggregator_zookeeper \
  --network news_aggregator_network \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000 \
  -p 2181:2181 \
  confluentinc/cp-zookeeper:7.6.0
```

### 4. Запустить Kafka:

```bash
podman run -d \
  --name news_aggregator_kafka \
  --network news_aggregator_network \
  --depends-on news_aggregator_zookeeper \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=news_aggregator_zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://news_aggregator_kafka:9092,PLAINTEXT_HOST://localhost:9092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_AUTO_CREATE_TOPICS_ENABLE=true \
  -p 9092:9092 \
  confluentinc/cp-kafka:7.6.0
```

### 5. Собрать и запустить сервисы:

```bash
# Main Service
cd backend/main-service
podman build -t news_aggregator_main_service .
podman run -d \
  --name news_aggregator_main_service \
  --network news_aggregator_network \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://news_aggregator_postgres:5432/news_aggregator \
  -e SPRING_DATASOURCE_USERNAME=news_user \
  -e SPRING_DATASOURCE_PASSWORD=news_password \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=news_aggregator_kafka:9092 \
  -e JWT_SECRET=your-256-bit-secret-key-change-in-production-minimum-32-characters \
  -p 8080:8080 \
  news_aggregator_main_service

# Email Service
cd ../email-service
podman build -t news_aggregator_email_service .
podman run -d \
  --name news_aggregator_email_service \
  --network news_aggregator_network \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=news_aggregator_kafka:9092 \
  -e MAIL_USERNAME=${MAIL_USERNAME:-} \
  -e MAIL_PASSWORD=${MAIL_PASSWORD:-} \
  -p 8081:8081 \
  news_aggregator_email_service

# RSS Parser Service
cd ../rss-parser-service
podman build -t news_aggregator_rss_parser_service .
podman run -d \
  --name news_aggregator_rss_parser_service \
  --network news_aggregator_network \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://news_aggregator_postgres:5432/news_aggregator \
  -e SPRING_DATASOURCE_USERNAME=news_user \
  -e SPRING_DATASOURCE_PASSWORD=news_password \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=news_aggregator_kafka:9092 \
  -p 8082:8082 \
  news_aggregator_rss_parser_service

# Frontend
cd ../../frontend
podman build -t news_aggregator_frontend .
podman run -d \
  --name news_aggregator_frontend \
  --network news_aggregator_network \
  -p 3000:80 \
  news_aggregator_frontend
```

## Проверка работы

После запуска проверьте:

1. **PostgreSQL**: `podman exec news_aggregator_postgres pg_isready -U news_user`
2. **Kafka**: `podman exec news_aggregator_kafka kafka-broker-api-versions --bootstrap-server localhost:9092`
3. **Main Service**: `curl http://localhost:8080/api/auth/register` (должен вернуть ошибку валидации, но не 404)
4. **Frontend**: Откройте в браузере `http://localhost:3000`

## Полезные команды

```bash
# Просмотр всех контейнеров
podman ps -a

# Просмотр логов конкретного контейнера
podman logs -f news_aggregator_main_service

# Остановка всех контейнеров
podman stop news_aggregator_postgres news_aggregator_zookeeper news_aggregator_kafka \
  news_aggregator_main_service news_aggregator_email_service \
  news_aggregator_rss_parser_service news_aggregator_frontend

# Удаление всех контейнеров
podman rm news_aggregator_postgres news_aggregator_zookeeper news_aggregator_kafka \
  news_aggregator_main_service news_aggregator_email_service \
  news_aggregator_rss_parser_service news_aggregator_frontend
```

