-- Создание таблиц
CREATE TABLE IF NOT EXISTS categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE CHECK (
        email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'
    ),
    password_hash CHAR(60) NOT NULL,
    created_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification_codes (
    code_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    expires_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS sources (
    source_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL UNIQUE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS source_categories (
    source_id INTEGER NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (source_id, category_id)
);

CREATE TABLE IF NOT EXISTS templates (
    template_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS template_sources (
    template_id INTEGER NOT NULL REFERENCES templates(template_id) ON DELETE CASCADE,
    source_id INTEGER NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    PRIMARY KEY (template_id, source_id)
);

CREATE TABLE IF NOT EXISTS user_templates (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL REFERENCES templates(template_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, template_id)
);

CREATE TABLE IF NOT EXISTS user_sources (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    source_id INTEGER NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, source_id)
);

CREATE TABLE IF NOT EXISTS news (
    news_id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    url VARCHAR(500) UNIQUE NOT NULL,
    image_url VARCHAR(500),
    published_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    source_id INTEGER NOT NULL REFERENCES sources(source_id) ON DELETE RESTRICT,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS user_news (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    news_id INTEGER NOT NULL REFERENCES news(news_id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, news_id)
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_source_categories_category ON source_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_user_sources_user ON user_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_news_user ON user_news(user_id);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_news_source ON news(source_id);
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published_date DESC);

-- Триггеры
CREATE OR REPLACE FUNCTION cleanup_old_verification_codes()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM verification_codes
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_insert_verification_code ON verification_codes;
CREATE TRIGGER before_insert_verification_code
BEFORE INSERT ON verification_codes
FOR EACH ROW
EXECUTE FUNCTION cleanup_old_verification_codes();

CREATE OR REPLACE FUNCTION delete_user_related_data()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM user_news WHERE user_id = OLD.user_id;
    DELETE FROM user_sources WHERE user_id = OLD.user_id;
    DELETE FROM user_templates WHERE user_id = OLD.user_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_delete_user_relations ON users;
CREATE TRIGGER tr_delete_user_relations
AFTER DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION delete_user_related_data();

-- PL/PSQL процедуры
CREATE OR REPLACE FUNCTION subscribe_user_to_source(
    p_user_id INTEGER,
    p_source_id INTEGER
)
RETURNS VOID AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Пользователь с ID % не найден.', p_user_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM sources WHERE source_id = p_source_id) THEN
        RAISE EXCEPTION 'Источник с ID % не найден.', p_source_id;
    END IF;

    INSERT INTO user_sources (user_id, source_id)
    VALUES (p_user_id, p_source_id)
    ON CONFLICT (user_id, source_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION verify_reset_code(
    p_email VARCHAR,
    p_code_hash VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    SELECT u.user_id INTO v_user_id
    FROM users u
    JOIN verification_codes vc ON u.user_id = vc.user_id
    WHERE u.email = p_email AND vc.code_hash = p_code_hash;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Неверный email или код восстановления.';
    END IF;

    IF EXISTS (SELECT 1 FROM verification_codes WHERE user_id = v_user_id AND expires_time < CURRENT_TIMESTAMP) THEN
        DELETE FROM verification_codes WHERE user_id = v_user_id;
        RAISE EXCEPTION 'Код восстановления просрочен.';
    END IF;

    DELETE FROM verification_codes WHERE user_id = v_user_id;
    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

-- Наполнение категориями
INSERT INTO categories (name, description) VALUES
('IT', 'Новости технологий, гаджетов и др.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Политика', 'Государственные, международные новости и др.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Спорт', 'Футбол, хоккей, баскетбол и др.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Авто', 'Новости автомобильной индустрии')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Культура', 'Кино, театр, музыка, искусство')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Финансы', 'Фондовый рынок, валюты, экономика и др.')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
('Наука', 'Научные новости и исследования')
ON CONFLICT (name) DO NOTHING;

