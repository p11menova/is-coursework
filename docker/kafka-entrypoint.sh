#!/bin/bash
# Кастомный entrypoint для Kafka чтобы отключить автоматический PLAINTEXT_HOST listener

export KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092
export KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
export KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT
export KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT

# Запускаем оригинальный entrypoint
exec /etc/confluent/docker/run

