import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogManagerProps {
  onUpdate?: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  status: "draft" | "published" | "archived";
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const statusLabels = {
  draft: "Черновик",
  published: "Опубликован",
  archived: "Архив"
};

const statusColors = {
  draft: "secondary",
  published: "default",
  archived: "outline"
} as const;

export const BlogManager = ({ onUpdate }: BlogManagerProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image_url: "",
    status: "draft" as "draft" | "published" | "archived",
    tags: "",
    meta_title: "",
    meta_description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token found:', !!token); // Для диагностики

      const response = await fetch('http://localhost:3001/api/admin/blog-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status); // Для диагностики

      if (response.ok) {
        const data = await response.json();
        setPosts(data.data || []);
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
      console.error("Error loading posts:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статьи",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[а-яё]/g, (char) => {
        const cyrillicMap: { [key: string]: string } = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
          'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return cyrillicMap[char] || char;
      })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSave = async () => {
    try {
      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title);

      const postData = {
        ...formData,
        slug,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        published_at: formData.status === "published" && !editingPost?.published_at
          ? new Date().toISOString()
          : editingPost?.published_at
      };

      const method = editingPost ? 'PATCH' : 'POST';
      const url = editingPost
        ? `http://localhost:3001/api/admin/blog-posts/${editingPost.id}`
        : 'http://localhost:3001/api/admin/blog-posts';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Успешно сохранено",
          description: editingPost ? "Статья обновлена" : "Статья создана",
        });

        setDialogOpen(false);
        resetForm();
        loadPosts();
        onUpdate?.();
      } else {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить статью",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту статью?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/admin/blog-posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Статья удалена",
          description: "Статья успешно удалена",
        });

        loadPosts();
        onUpdate?.();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      image_url: post.image_url || "",
      status: post.status,
      tags: post.tags.join(", "),
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || ""
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image_url: "",
      status: "draft",
      tags: "",
      meta_title: "",
      meta_description: ""
    });
  };

  const handleNewPost = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
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
          <h2 className="text-2xl font-bold font-geist">Управление блогом</h2>
          <p className="text-muted-foreground">Создавайте и редактируйте статьи</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewPost}>
              <Plus className="w-4 h-4 mr-2" />
              Новая статья
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Редактировать статью" : "Новая статья"}
              </DialogTitle>
              <DialogDescription>
                Заполните информацию о статье
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Заголовок статьи"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL (slug)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-slug"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Краткое описание статьи"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="content">Содержание</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Полный текст статьи (поддерживается Markdown)"
                  rows={10}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Черновик</SelectItem>
                      <SelectItem value="published">Опубликован</SelectItem>
                      <SelectItem value="archived">Архив</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Теги (через запятую)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="веб-разработка, AI, технологии"
                  />
                </div>
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
                  <Label htmlFor="meta_title">SEO заголовок</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO заголовок (оставьте пустым для автоматического)"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">SEO описание</Label>
                  <Input
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO описание"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingPost ? "Обновить" : "Создать"}
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
          <CardTitle>Статьи ({posts.length})</CardTitle>
          <CardDescription>
            Список всех статей в блоге
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Теги</TableHead>
                <TableHead>Создано</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-sm text-muted-foreground">/{post.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[post.status]}>
                      {statusLabels[post.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.status === "published" && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
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
