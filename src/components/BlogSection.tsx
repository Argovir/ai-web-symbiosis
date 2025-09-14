import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
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

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
      <section id="blog" className="relative z-20 py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  const categories = ["Все", "Веб-разработка", "Нейросети", "Кейсы"];

  return (
    <section id="blog" className="relative z-20 py-24 bg-background" data-animate>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
              Блог
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Делюсь опытом, трендами и практическими решениями в веб-разработке и AI
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="filter-btn"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {blogPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
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
              <h3 className="text-2xl font-bold mb-4">Статей пока нет</h3>
              <p className="text-muted-foreground mb-8">Скоро здесь появятся интересные материалы</p>
              <Link to="/blog">
                <Button variant="default">Перейти в блог</Button>
              </Link>
            </div>
          )}

          {/* View All Posts */}
          {blogPosts.length > 0 && (
            <div className="text-center">
              <Link to="/blog">
                <Button variant="default" size="lg" className="px-8">
                  Все статьи блога
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
