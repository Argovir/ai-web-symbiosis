import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Интеграция AI в веб-разработку: практические решения",
      excerpt: "Как современные нейросетевые технологии меняют подходы к созданию веб-приложений и какие возможности это открывает для бизнеса",
      date: "2024-01-15",
      author: "Веб-мастер",
      category: "Нейросети",
      image: "/placeholder.svg",
      slug: "ai-web-development-integration"
    },
    {
      id: 2,
      title: "Производительность сайта в 2024: Core Web Vitals и новые метрики",
      excerpt: "Разбираем актуальные требования Google к скорости загрузки и пользовательскому опыту. Практические советы по оптимизации",
      date: "2024-01-10", 
      author: "Веб-мастер",
      category: "Веб-разработка",
      image: "/placeholder.svg",
      slug: "web-performance-2024"
    },
    {
      id: 3,
      title: "Кейс: автоматизация контента для интернет-магазина с помощью ChatGPT",
      excerpt: "Как мы внедрили систему автоматической генерации описаний товаров и увеличили конверсию на 35%",
      date: "2024-01-05",
      author: "Веб-мастер", 
      category: "Кейсы",
      image: "/placeholder.svg",
      slug: "chatgpt-content-automation-case"
    }
  ];

  const categories = ["Все", "Веб-разработка", "Нейросети", "Кейсы"];

  return (
    <section id="blog" className="py-24 bg-background" data-animate>
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
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className={`blog-card hover-lift fade-in-up stagger-${index + 1} flex flex-col h-full`}
              >
                {/* Post Image */}
                <div className="aspect-video bg-muted overflow-hidden">
                  <img 
                    src={post.image} 
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
                      <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 tech-tag bg-accent/10 text-accent border-accent/20">
                      <Tag className="w-3 h-3" />
                      {post.category}
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

          {/* View All Posts */}
          <div className="text-center">
            <Button variant="default" size="lg" className="px-8">
              Все статьи блога
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
