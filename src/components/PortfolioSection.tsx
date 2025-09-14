import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Filter } from "lucide-react";
import { supabase } from "@/integrations/api/client";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  category: "classic" | "ai" | "ecommerce";
  tags: string[];
  live_url?: string;
  github_url?: string;
  featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
}

const categoryLabels = {
  classic: "Классические сайты",
  ai: "AI-проекты",
  ecommerce: "Интернет-магазины"
};

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("Все");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>({});

  const filters = ["Все", "Классические сайты", "AI-проекты", "Интернет-магазины"];

  useEffect(() => {
    loadSettings();
    loadProjects();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select()
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading settings:", error);
      }

      if (data) {
        // Map existing fields or use defaults
        setSettings({
          portfolio_title: data.hero_title || "Портфолио",
          portfolio_description: data.hero_description || "Избранные проекты: от классических сайтов до AI-интеграций",
          portfolio_columns: 3 // Default, since not in schema
        });
      } else {
        // Default settings
        setSettings({
          portfolio_title: "Портфолио",
          portfolio_description: "Избранные проекты: от классических сайтов до AI-интеграций",
          portfolio_columns: 3
        });
      }
    } catch (err) {
      console.error("Error loading settings:", err);
      // Use defaults on error
      setSettings({
        portfolio_title: "Портфолио",
        portfolio_description: "Избранные проекты: от классических сайтов до AI-интеграций",
        portfolio_columns: 3
      });
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (await supabase
        .from("portfolio_projects")
        .select()
        .eq("is_published", true)
        .order("sort_order"))();

      if (error) throw error;

      // Fallback data for testing styles if no projects in database
      const fallbackProjects = data && data.length > 0 ? data : [
        {
          id: "1",
          title: "AI-Помощник для E-commerce",
          description: "Интеллектуальный чат-бот с интеграцией GPT-4 для консультации покупателей",
          image_url: "/placeholder.svg",
          category: "ai" as const,
          tags: ["React", "OpenAI API", "Node.js"],
          live_url: "#",
          github_url: "#",
          featured: true,
          sort_order: 10,
          is_published: true,
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          title: "Корпоративный сайт с CMS",
          description: "Современный корпоративный сайт с кастомной CMS и высокой производительностью",
          image_url: "/placeholder.svg",
          category: "classic" as const,
          tags: ["WordPress", "PHP", "MySQL"],
          live_url: "#",
          github_url: "#",
          featured: true,
          sort_order: 20,
          is_published: true,
          created_at: new Date().toISOString()
        }
      ];

      setProjects(fallbackProjects);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Не удалось загрузить проекты");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProjects = () => {
    if (activeFilter === "Все") return projects;

    const categoryKey = Object.keys(categoryLabels).find(
      key => categoryLabels[key as keyof typeof categoryLabels] === activeFilter
    );

    return projects.filter(project => project.category === categoryKey);
  };

  const filteredProjects = getFilteredProjects();

  if (loading) {
    return (
      <section id="portfolio" className="py-24 bg-background" data-animate>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
                Портфолио
              </h2>
            </div>
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="portfolio" className="py-24 bg-background" data-animate>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
                Портфолио
              </h2>
            </div>
            <div className="text-center text-muted-foreground">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-24 bg-background" data-animate>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-geist mb-6">
              {settings.portfolio_title || "Портфолио"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {settings.portfolio_description || "Избранные проекты: от классических сайтов до AI-интеграций"}
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
          <div
            className="portfolio-grid"
            style={{
              gridTemplateColumns: `repeat(${settings.portfolio_columns || 3}, 1fr)`
            }}
          >
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className={`project-card fade-in-up stagger-${(index % 6) + 1} flex flex-col h-full`}
              >
                {/* Project Image */}
                <div className="aspect-video bg-muted rounded-t-2xl overflow-hidden">
                  <img
                    src={project.image_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Project Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold font-geist mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
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
                  <div className="flex gap-3 mt-auto">
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 gap-2"
                      asChild
                    >
                      <a href={project.live_url || "#"} target="_blank" rel="noopener noreferrer">
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
                      <a href={project.github_url || "#"} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Код
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center mt-12">
              <p className="text-muted-foreground">Проекты не найдены</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
