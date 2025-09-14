-- Drop existing tables if they exist
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS portfolio_projects CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create tables (run this after connecting to ai_web_symbiosis database)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title TEXT NOT NULL DEFAULT 'Веб-мастер & AI-интегратор',
  hero_subtitle TEXT NOT NULL DEFAULT 'Создаю сайты, которые работают',
  hero_description TEXT,
  about_title TEXT NOT NULL DEFAULT 'Обо мне',
  about_description TEXT,
  years_experience INTEGER DEFAULT 15,
  projects_count INTEGER DEFAULT 200,
  ai_integrations INTEGER DEFAULT 50,
  satisfaction_rate INTEGER DEFAULT 99,
  contact_email TEXT,
  contact_phone TEXT,
  social_github TEXT,
  social_linkedin TEXT,
  social_telegram TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(user_id)
);

CREATE TABLE portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'classic' CHECK (category IN ('classic', 'ai', 'ecommerce')),
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(user_id)
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES profiles(user_id)
);

-- Insert initial data
INSERT INTO profiles (user_id, email, full_name, role, password_hash) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@example.com', 'Администратор', 'admin', '$2b$10$JUwOViQzQMXww1sxyQhDwOiC3zJt2TalozQc5DlYWbRAXrmc8bdWW'); -- password: admin

INSERT INTO site_settings (
  hero_title, hero_subtitle, hero_description, about_title, about_description,
  years_experience, projects_count, ai_integrations, satisfaction_rate, contact_email
) VALUES (
  'Веб-мастер & AI-интегратор',
  'Создаю сайты, которые работают',
  '15 лет опыта + современные AI-технологии = быстрые, умные и адаптивные веб-решения для вашего бизнеса',
  'Обо мне',
  'От верстки в Notepad++ до AI-интеграций: путь длиною в 15 лет',
  15, 200, 50, 99, 'contact@example.com'
);

INSERT INTO portfolio_projects (title, description, category, tags, featured, sort_order) VALUES
('AI-Помощник для E-commerce', 'Интеллектуальный чат-бот с интеграцией GPT-4 для консультации покупателей', 'ai', ARRAY['React', 'OpenAI API', 'Node.js'], true, 10),
('Корпоративный сайт с CMS', 'Современный корпоративный сайт с кастомной CMS и высокой производительностью', 'classic', ARRAY['WordPress', 'PHP', 'MySQL'], true, 20),
('Интернет-магазин премиум класса', 'Высоконагруженный интернет-магазин с персонализацией и аналитикой', 'ecommerce', ARRAY['React', 'WooCommerce', 'Stripe'], true, 30);

INSERT INTO blog_posts (title, slug, excerpt, content, status, tags, meta_title, meta_description, published_at, author_id) VALUES
('Интеграция AI в веб-разработку: практические решения', 'ai-web-development-integration', 'Как современные нейросетевые технологии меняют подходы к созданию веб-приложений и какие возможности это открывает для бизнеса', '<p>В современном мире веб-разработки интеграция искусственного интеллекта становится не просто трендом, а необходимостью. За 15 лет работы в сфере веб-технологий я прошел путь от простой верстки до создания интеллектуальных веб-приложений.</p>

<h2>Основные направления AI в веб-разработке</h2>

<h3>1. Персонализация контента</h3>
<p>Современные алгоритмы машинного обучения позволяют создавать персонализированный пользовательский опыт. Это касается как контента, так и интерфейса.</p>

<h3>2. Чат-боты и виртуальные ассистенты</h3>
<p>Интеграция GPT-моделей в веб-приложения открывает новые возможности для взаимодействия с пользователями.</p>

<h3>3. Автоматизация контента</h3>
<p>Генерация текстов, изображений и даже кода с помощью AI становится все более качественной и доступной.</p>

<p>В следующих статьях я поделюсь конкретными кейсами и код-примерами интеграции AI в веб-проекты.</p>', 'published', ARRAY['AI', 'веб-разработка', 'нейросети'], 'Интеграция AI в веб-разработку', 'Как современные нейросетевые технологии меняют подходы к созданию веб-приложений', '2024-01-15T00:00:00Z', (SELECT user_id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)),

('Производительность сайта в 2024: Core Web Vitals и новые метрики', 'web-performance-2024', 'Разбираем актуальные требования Google к скорости загрузки и пользовательскому опыту. Практические советы по оптимизации', '<p>В 2024 году Google продолжает совершенствовать свои алгоритмы ранжирования, уделяя особое внимание пользовательскому опыту. Core Web Vitals стали ключевым фактором ранжирования сайтов.</p>

<h2>Что такое Core Web Vitals?</h2>

<h3>Largest Contentful Paint (LCP)</h3>
<p>Измеряет время загрузки самого большого элемента контента на странице. Идеальное значение - менее 2.5 секунд.</p>

<h3>First Input Delay (FID)</h3>
<p>Оценивает скорость отклика интерфейса на действия пользователя. Должен быть менее 100 миллисекунд.</p>

<h3>Cumulative Layout Shift (CLS)</h3>
<p>Измеряет стабильность макета страницы. Значение должно быть менее 0.1.</p>

<h2>Практические рекомендации по оптимизации</h2>
<ul>
<li>Оптимизация изображений и lazy loading</li>
<li>Минификация CSS и JavaScript</li>
<li>Использование CDN</li>
<li>Кэширование ресурсов</li>
</ul>', 'published', ARRAY['веб-производительность', 'SEO', 'оптимизация'], 'Производительность сайта в 2024 году', 'Разбираем актуальные требования Google к скорости загрузки и пользовательскому опыту', '2024-01-10T00:00:00Z', (SELECT user_id FROM profiles WHERE email = 'admin@example.com' LIMIT 1)),

('Кейс: автоматизация контента для интернет-магазина с помощью ChatGPT', 'chatgpt-content-automation-case', 'Как мы внедрили систему автоматической генерации описаний товаров и увеличили конверсию на 35%', '<p>В этом кейсе я расскажу о том, как мы автоматизировали процесс создания контента для крупного интернет-магазина электроники с помощью ChatGPT и увеличили конверсию на 35%.</p>

<h2>Проблематика</h2>
<p>Магазин имел более 10 000 товаров, но только 40% из них имели качественные описания. Это приводило к низкой конверсии и высокому проценту отказов.</p>

<h2>Решение</h2>
<p>Мы разработали систему на Python, которая:</p>
<ul>
<li>Анализирует характеристики товара</li>
<li>Генерирует уникальные описания с помощью ChatGPT</li>
<li>Автоматически оптимизирует тексты для SEO</li>
<li>Интегрируется с CMS магазина</li>
</ul>

<h2>Результаты</h2>
<ul>
<li>Увеличение конверсии на 35%</li>
<li>Снижение процента отказов на 25%</li>
<li>Автоматизация 70% контента</li>
<li>Экономия 200 часов работы в месяц</li>
</ul>

<p>Подробная техническая документация и код решения доступны по запросу.</p>', 'published', ARRAY['ChatGPT', 'автоматизация', 'кейс-стади'], 'Кейс автоматизации контента с ChatGPT', 'Как мы внедрили систему автоматической генерации описаний товаров', '2024-01-05T00:00:00Z', (SELECT user_id FROM profiles WHERE email = 'admin@example.com' LIMIT 1));
