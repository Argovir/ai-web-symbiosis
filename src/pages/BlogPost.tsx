import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  status: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Сначала получаем все опубликованные статьи, затем находим нужную по slug
        const response = await fetch('http://localhost:3001/api/blog-posts');
        if (response.ok) {
          const data = await response.json();
          const posts = data.data || [];
          const foundPost = posts.find((p: BlogPost) => p.slug === slug);
          setPost(foundPost || null);
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
          <Link to="/#blog">
            <Button>Вернуться к блогу</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Веб-мастер</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="tech-tag">{post.tags.length > 0 ? post.tags[0] : 'Блог'}</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold font-geist mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-8">
              <img
                src={post.image_url || "/placeholder.svg"}
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
