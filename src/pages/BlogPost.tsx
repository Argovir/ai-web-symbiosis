import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  // Временные данные для демонстрации
  const post = {
    title: "Интеграция AI в веб-разработку: практические решения",
    content: `
      <p>В современном мире веб-разработки интеграция искусственного интеллекта становится не просто трендом, а необходимостью. За 15 лет работы в сфере веб-технологий я прошел путь от простой верстки до создания интеллектуальных веб-приложений.</p>
      
      <h2>Основные направления AI в веб-разработке</h2>
      
      <h3>1. Персонализация контента</h3>
      <p>Современные алгоритмы машинного обучения позволяют создавать персонализированный пользовательский опыт. Это касается как контента, так и интерфейса.</p>
      
      <h3>2. Чат-боты и виртуальные ассистенты</h3>
      <p>Интеграция GPT-моделей в веб-приложения открывает новые возможности для взаимодействия с пользователями.</p>
      
      <h3>3. Автоматизация контента</h3>
      <p>Генерация текстов, изображений и даже кода с помощью AI становится все более качественной и доступной.</p>
      
      <p>В следующих статьях я поделюсь конкретными кейсами и код-примерами интеграции AI в веб-проекты.</p>
    `,
    date: "2024-01-15",
    author: "Веб-мастер",
    category: "Нейросети",
    image: "/placeholder.svg"
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/#blog">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Назад к блогу
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="fade-in-up">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="tech-tag">{post.category}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-geist mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-8">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-foreground leading-relaxed"
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  Понравилась статья? Поделитесь с коллегами!
                </p>
              </div>
              <Link to="/#contact">
                <Button variant="default" className="gap-2">
                  Обсудить проект
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;