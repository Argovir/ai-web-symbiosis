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
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@example.com', 'Администратор', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'); -- password: admin

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
