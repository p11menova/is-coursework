-- Создание таблиц для агрегатора новостей
-- Упрощенная схема: у источника только одна категория

CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'
    ),
    password_hash VARCHAR(60) NOT NULL,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_codes (
    code_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    expires_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS sources (
    source_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    rss_url VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS templates (
    template_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS template_sources (
    template_id BIGINT NOT NULL REFERENCES templates(template_id) ON DELETE CASCADE,
    source_id BIGINT NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, source_id)
);

CREATE TABLE IF NOT EXISTS user_templates (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    template_id BIGINT NOT NULL REFERENCES templates(template_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, template_id)
);

CREATE TABLE IF NOT EXISTS user_sources (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source_id BIGINT NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, source_id)
);

CREATE TABLE IF NOT EXISTS news (
    news_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(500) UNIQUE NOT NULL,
    image_url VARCHAR(500),
    published_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    source_id BIGINT NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    category_id BIGINT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS user_news (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    news_id BIGINT NOT NULL REFERENCES news(news_id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, news_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_source_categories ON sources(category_id);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_news_user ON user_news(user_id);
CREATE INDEX IF NOT EXISTS idx_user_news_read ON user_news(user_id, is_read);

-- Триггер для удаления старых кодов верификации
CREATE OR REPLACE FUNCTION cleanup_old_verification_codes()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM verification_codes
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_verification_code
BEFORE INSERT ON verification_codes
FOR EACH ROW
EXECUTE FUNCTION cleanup_old_verification_codes();

-- Триггер для каскадного удаления связанных записей
CREATE OR REPLACE FUNCTION delete_user_related_data()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM user_news WHERE user_id = OLD.user_id;
    DELETE FROM user_sources WHERE user_id = OLD.user_id;
    DELETE FROM user_templates WHERE user_id = OLD.user_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_delete_user_relations
AFTER DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION delete_user_related_data();

