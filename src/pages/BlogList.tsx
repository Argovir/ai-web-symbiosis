import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const scrollToBlogSection = () => {
    // Используем React Router для навигации
    navigate('/', { state: { scrollTo: 'blog' } });

    // Добавляем задержку для прокрутки после загрузки страницы
    setTimeout(() => {
      const element = document.getElementById('blog');
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/blog-posts');
        if (response.ok) {
          const data = await response.json();
          setBlogPosts(data.data || []);
        } else {
          console.error('Failed to fetch blog posts');
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={scrollToBlogSection}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Назад к главной
          </Button>
        </div>
      </header>

      {/* Blog Content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="fade-in-up">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-geist mb-6">
              Блог
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Делюсь опытом, трендами и практическими решениями в веб-разработке и AI
            </p>
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {blogPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`blog-card hover-lift fade-in-up stagger-${index + 1} flex flex-col h-full`}
                >
                  {/* Post Image */}
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Post Meta */}
                    <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.published_at || post.created_at).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Веб-мастер</span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 tech-tag bg-accent/10 text-accent border-accent/20">
                        <Tag className="w-3 h-3" />
                        {post.tags.length > 0 ? post.tags[0] : 'Блог'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold font-geist mb-3 leading-tight">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-accent transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <Link to={`/blog/${post.slug}`} className="mt-auto">
                      <Button variant="outline" size="sm" className="gap-2 w-full">
                        Читать далее
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Статей пока нет</h2>
              <p className="text-muted-foreground mb-8">Скоро здесь появятся интересные материалы</p>
              <Button onClick={scrollToBlogSection}>
                Вернуться к главной
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogList;
