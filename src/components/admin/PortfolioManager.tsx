import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ExternalLink, Github, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioManagerProps {
  onUpdate?: () => void;
}

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

export const PortfolioManager = ({ onUpdate }: PortfolioManagerProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "classic" as "classic" | "ai" | "ecommerce",
    tags: "",
    live_url: "",
    github_url: "",
    featured: false,
    is_published: true,
    sort_order: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token); // Для диагностики

      const response = await fetch('http://localhost:3001/api/admin/portfolio-projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status); // Для диагностики

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || []);
      } else if (response.status === 401 || response.status === 403) {
        toast({
          title: "Ошибка авторизации",
          description: "Необходимо войти в систему заново",
          variant: "destructive",
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить проекты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const result = (() => {
      switch (statusFilter) {
        case "published":
          return project.is_published;
        case "hidden":
          return !project.is_published;
        default:
          return true;
      }
    })();
    console.log(`Filtering project ${project.id} (${project.title}): filter=${statusFilter}, is_published=${project.is_published}, result=${result}`);
    return result;
  });

  const handleSave = async () => {
    try {
      const projectData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      const method = editingProject ? 'PATCH' : 'POST';
      const url = editingProject
        ? `http://localhost:3001/api/admin/portfolio-projects/${editingProject.id}`
        : 'http://localhost:3001/api/admin/portfolio-projects';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Успешно сохранено",
          description: editingProject ? "Проект обновлен" : "Проект создан",
        });

        setDialogOpen(false);
        resetForm();
        loadProjects();
        onUpdate?.();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить проект",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот проект?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/admin/portfolio-projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Проект удален",
          description: "Проект успешно удален",
        });

        loadProjects();
        onUpdate?.();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить проект",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/portfolio-projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_published: isPublished })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Статус обновлен",
          description: `Проект ${isPublished ? "опубликован" : "скрыт"}`,
        });

        loadProjects();
        onUpdate?.();
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить статус проекта",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || "",
      category: project.category,
      tags: project.tags.join(", "),
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured,
      is_published: project.is_published,
      sort_order: project.sort_order
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "classic",
      tags: "",
      live_url: "",
      github_url: "",
      featured: false,
      is_published: true,
      sort_order: 0
    });
  };

  const handleNewProject = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-geist">Управление портфолио</h2>
          <p className="text-muted-foreground">
            Добавляйте и редактируйте проекты. Все проекты отображаются независимо от статуса публикации.
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все проекты</SelectItem>
              <SelectItem value="published">Только опубликованные</SelectItem>
              <SelectItem value="hidden">Только скрытые</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProject}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить проект
              </Button>
            </DialogTrigger>
            </Dialog>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Редактировать проект" : "Новый проект"}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о проекте
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Название проекта"
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Описание проекта"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Классические сайты</SelectItem>
                    <SelectItem value="ai">AI-проекты</SelectItem>
                    <SelectItem value="ecommerce">Интернет-магазины</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Теги (через запятую)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              <div>
                <Label htmlFor="image_url">URL изображения</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="live_url">Ссылка на демо</Label>
                  <Input
                    id="live_url"
                    value={formData.live_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, live_url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="github_url">Ссылка на GitHub</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sort_order">Порядок сортировки</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Рекомендуемый</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                  />
                  <Label htmlFor="is_published">Опубликован</Label>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingProject ? "Обновить" : "Создать"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Проекты ({filteredProjects.length}{statusFilter !== "all" ? ` из ${projects.length}` : ""})
          </CardTitle>
          <CardDescription>
            {statusFilter === "all" ? "Список всех проектов в портфолио" :
             statusFilter === "published" ? "Показаны только опубликованные проекты" :
             "Показаны только скрытые проекты"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Теги</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {project.featured && <Star className="w-4 h-4 text-yellow-500" />}
                      <span className="font-medium">{project.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {categoryLabels[project.category]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.is_published ? "default" : "secondary"}>
                      {project.is_published ? "Опубликован" : "Скрыт"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {project.live_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Switch
                        checked={project.is_published}
                        onCheckedChange={(checked) => handleTogglePublish(project.id, checked)}
                      />
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
