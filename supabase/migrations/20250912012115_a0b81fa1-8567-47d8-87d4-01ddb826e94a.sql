-- Create enum for project categories
CREATE TYPE public.project_category AS ENUM ('classic', 'ai', 'ecommerce');

-- Create enum for blog post status
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'archived');

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create site_settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
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
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update site settings" 
ON public.site_settings 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert site settings" 
ON public.site_settings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Create portfolio_projects table
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  category project_category NOT NULL DEFAULT 'classic',
  tags TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for portfolio_projects
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio_projects
CREATE POLICY "Anyone can view published projects" 
ON public.portfolio_projects 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Authenticated users can manage projects" 
ON public.portfolio_projects 
FOR ALL 
TO authenticated
USING (true);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  author_id UUID REFERENCES auth.users(id)
);

-- Enable RLS for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Anyone can view published posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can manage posts" 
ON public.blog_posts 
FOR ALL 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default site settings
INSERT INTO public.site_settings (
  hero_title,
  hero_subtitle,
  hero_description,
  about_description,
  contact_email
) VALUES (
  'Веб-мастер & AI-интегратор',
  'Создаю сайты, которые работают',
  '15 лет опыта + современные AI-технологии = быстрые, умные и адаптивные веб-решения для вашего бизнеса',
  'От верстки в Notepad++ до AI-интеграций: путь длиною в 15 лет',
  'contact@example.com'
);

-- Insert sample portfolio projects
INSERT INTO public.portfolio_projects (title, description, category, tags, featured, sort_order) VALUES
('AI-Помощник для E-commerce', 'Интеллектуальный чат-бот с интеграцией GPT-4 для консультации покупателей', 'ai', ARRAY['React', 'OpenAI API', 'Node.js'], true, 10),
('Корпоративный сайт с CMS', 'Современный корпоративный сайт с кастомной CMS и высокой производительностью', 'classic', ARRAY['WordPress', 'PHP', 'MySQL'], true, 20),
('Интернет-магазин премиум класса', 'Высоконагруженный интернет-магазин с персонализацией и аналитикой', 'ecommerce', ARRAY['React', 'WooCommerce', 'Stripe'], true, 30);