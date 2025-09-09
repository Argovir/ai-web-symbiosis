import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Filter } from "lucide-react";

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("Все");

  const filters = ["Все", "Классические сайты", "AI-проекты", "Интернет-магазины"];

  const projects = [
    {
      id: 1,
      title: "AI-Помощник для E-commerce",
      description: "Интеллектуальный чат-бот с интеграцией GPT-4 для консультации покупателей и персонализации рекомендаций",
      image: "/placeholder.svg",
      tags: ["React", "OpenAI API", "Node.js", "MongoDB"],
      category: "AI-проекты",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 2,
      title: "Корпоративный сайт с CMS",
      description: "Современный корпоративный сайт с кастомной CMS, адаптивным дизайном и высокой производительностью",
      image: "/placeholder.svg",
      tags: ["WordPress", "PHP", "MySQL", "SCSS"],
      category: "Классические сайты",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 3,
      title: "Автоматизация контента с AI",
      description: "Система автоматической генерации и публикации контента с использованием Midjourney API и ChatGPT",
      image: "/placeholder.svg",
      tags: ["Python", "Midjourney API", "WordPress", "Automation"],
      category: "AI-проекты",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 4,
      title: "Интернет-магазин премиум класса",
      description: "Высоконагруженный интернет-магазин с персонализацией, аналитикой и интеграцией платежных систем",
      image: "/placeholder.svg",
      tags: ["React", "WooCommerce", "Stripe", "Analytics"],
      category: "Интернет-магазины",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 5,
      title: "SaaS приложение с ML",
      description: "Веб-приложение для анализа данных с машинным обучением и интерактивными дашбордами",
      image: "/placeholder.svg",
      tags: ["Vue.js", "Python", "TensorFlow", "D3.js"],
      category: "AI-проекты",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      id: 6,
      title: "Многоязычный портал",
      description: "Корпоративный портал с поддержкой 8 языков, сложной архитектурой и высокими требованиями к производительности",
      image: "/placeholder.svg",
      tags: ["React", "Next.js", "i18n", "Performance"],
      category: "Классические сайты",
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  const filteredProjects = activeFilter === "Все" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 bg-background" data-animate>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
              Портфолио
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Избранные проекты: от классических сайтов до AI-интеграций
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Filter className="w-5 h-5 text-muted-foreground mt-2 mr-2" />
            {filters.map((filter) => (
              <Button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                variant="outline"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="portfolio-grid">
            {filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className={`project-card fade-in-up stagger-${(index % 6) + 1}`}
              >
                {/* Project Image */}
                <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold font-geist mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      size="sm" 
                      variant="default" 
                      className="flex-1 gap-2"
                      asChild
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        Демо
                      </a>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-2"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Код
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              Загрузить ещё проекты
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;