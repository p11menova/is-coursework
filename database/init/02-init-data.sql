-- Инициализация категорий
INSERT INTO categories (name, description) VALUES
('IT', 'Новости технологий, гаджетов и др.'),
('Политика', 'Государственные, международные новости и др.'),
('Спорт', 'Футбол, хоккей, баскетбол и др.'),
('Авто', 'Новости автомобильной индустрии'),
('Культура', 'Кино, театр, музыка, искусство'),
('Финансы', 'Фондовый рынок, валюты, экономика и др.'),
('Наука', 'Научные новости и исследования')
ON CONFLICT (name) DO NOTHING;

-- Инициализация источников из rss_sources.xml
-- Habr (IT)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Хабр', 'https://habr.com', (SELECT category_id FROM categories WHERE name = 'IT'), 'https://habr.com/ru/rss/articles/')
ON CONFLICT (name) DO NOTHING;

-- Lenta.ru (Политика)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Lenta.ru', 'https://lenta.ru', (SELECT category_id FROM categories WHERE name = 'Политика'), 'https://lenta.ru/rss/google-newsstand/main/')
ON CONFLICT (name) DO NOTHING;

-- Drom.ru (Авто)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Drom.ru', 'https://www.drom.ru', (SELECT category_id FROM categories WHERE name = 'Авто'), 'https://www.drom.ru/cached_files/xml/news.rss')
ON CONFLICT (name) DO NOTHING;

-- BBC News (Политика)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('BBC News', 'https://www.bbc.co.uk/news', (SELECT category_id FROM categories WHERE name = 'Политика'), 'https://feeds.bbci.co.uk/news/rss.xml')
ON CONFLICT (name) DO NOTHING;

-- RIA.ru (Политика)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('РИА Новости', 'https://ria.ru', (SELECT category_id FROM categories WHERE name = 'Политика'), 'https://ria.ru/export/rss2/archive/index.xml')
ON CONFLICT (name) DO NOTHING;

-- Kolesa.ru (Авто)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('КОЛЕСА.ру', 'https://www.kolesa.ru', (SELECT category_id FROM categories WHERE name = 'Авто'), 'https://www.kolesa.ru/export/rss.xml')
ON CONFLICT (name) DO NOTHING;

-- Чемпионат.com (Спорт)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Чемпионат.com', 'https://www.championat.com', (SELECT category_id FROM categories WHERE name = 'Спорт'), 'https://www.championat.com/rss/news/')
ON CONFLICT (name) DO NOTHING;

-- РБК (Финансы)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('РБК', 'https://www.rbc.ru', (SELECT category_id FROM categories WHERE name = 'Финансы'), 'https://rssexport.rbc.ru/rbcnews/news/30/full.rss')
ON CONFLICT (name) DO NOTHING;

-- N+1 (Наука)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('N+1', 'https://nplus1.ru', (SELECT category_id FROM categories WHERE name = 'Наука'), 'https://nplus1.ru/rss')
ON CONFLICT (name) DO NOTHING;

-- Кинопоиск (Культура)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Кинопоиск', 'https://www.kinopoisk.ru', (SELECT category_id FROM categories WHERE name = 'Культура'), 'https://www.kinopoisk.ru/news.rss')
ON CONFLICT (name) DO NOTHING;

-- Tproger (IT)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Tproger', 'https://tproger.ru', (SELECT category_id FROM categories WHERE name = 'IT'), 'https://tproger.ru/feed/')
ON CONFLICT (name) DO NOTHING;

-- Спорт-Экспресс (Спорт)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Спорт-Экспресс', 'https://www.sport-express.ru', (SELECT category_id FROM categories WHERE name = 'Спорт'), 'https://www.sport-express.ru/services/materials/news/se/')
ON CONFLICT (name) DO NOTHING;

-- Ведомости (Финансы)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Ведомости', 'https://www.vedomosti.ru', (SELECT category_id FROM categories WHERE name = 'Финансы'), 'https://www.vedomosti.ru/rss/news')
ON CONFLICT (name) DO NOTHING;

-- Элементы (Наука)
INSERT INTO sources (name, url, category_id, rss_url) VALUES
('Элементы', 'https://elementy.ru', (SELECT category_id FROM categories WHERE name = 'Наука'), 'https://elementy.ru/rss/news')
ON CONFLICT (name) DO NOTHING;

