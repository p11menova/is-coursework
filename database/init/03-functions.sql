-- PL/PSQL процедуры для выполнения критически важных запросов

-- Процедура для подписки пользователя на источник
CREATE OR REPLACE FUNCTION subscribe_user_to_source(
    p_user_id INTEGER,
    p_source_id INTEGER
)
RETURNS VOID AS $$
BEGIN
    -- Проверка существования пользователя и источника
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'Пользователь с ID % не найден.', p_user_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM sources WHERE source_id = p_source_id) THEN
        RAISE EXCEPTION 'Источник с ID % не найден.', p_source_id;
    END IF;

    -- Добавление подписки
    INSERT INTO user_sources (user_id, source_id)
    VALUES (p_user_id, p_source_id)
    ON CONFLICT (user_id, source_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Функция для проверки кода восстановления и возврата ID пользователя
CREATE OR REPLACE FUNCTION verify_reset_code(
    p_email VARCHAR,
    p_code_hash VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    v_user_id INTEGER;
BEGIN
    -- Поиск пользователя по email
    SELECT u.user_id INTO v_user_id
    FROM users u
    JOIN verification_codes vc ON u.user_id = vc.user_id
    WHERE u.email = p_email AND vc.code_hash = p_code_hash;

    -- Если пользователь/код не найден
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Неверный email или код восстановления.';
    END IF;

    -- Проверка времени жизни кода
    IF EXISTS (SELECT 1 FROM verification_codes WHERE user_id = v_user_id AND expires_time < CURRENT_TIMESTAMP) THEN
        DELETE FROM verification_codes WHERE user_id = v_user_id;
        RAISE EXCEPTION 'Код восстановления просрочен.';
    END IF;

    -- Удаление кода после успешной проверки
    DELETE FROM verification_codes WHERE user_id = v_user_id;

    RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;

