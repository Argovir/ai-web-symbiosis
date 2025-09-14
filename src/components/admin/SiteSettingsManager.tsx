import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, Home, Mail, Phone, Github, Linkedin, Send } from "lucide-react";
import { supabase } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

interface SiteSettingsManagerProps {
  onUpdate?: () => void;
}

export const SiteSettingsManager = ({ onUpdate }: SiteSettingsManagerProps) => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить настройки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData = {
        ...settings,
        updated_by: user?.id,
      };

      let result;
      if (settings.id) {
        // Update existing
        result = await supabase
          .from("site_settings")
          .update(updateData)
          .eq("id", settings.id)
          .select()
          .single();
      } else {
        // Insert new
        result = await supabase
          .from("site_settings")
          .insert([updateData])
          .select()
          .single();

        if (result.data) {
          setSettings(result.data);
        }
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Успешно сохранено",
        description: "Настройки сайта обновлены",
      });

      onUpdate?.();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: value,
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
          <h2 className="text-2xl font-bold font-geist">Настройки сайта</h2>
          <p className="text-muted-foreground">Управление основным контентом сайта</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Главная секция
            </CardTitle>
            <CardDescription>
              Настройки героя сайта и основной информации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="hero_title">Заголовок</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ""}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  placeholder="Веб-мастер & AI-интегратор"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">Подзаголовок</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ""}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  placeholder="Создаю сайты, которые работают"
                />
              </div>
              <div>
                <Label htmlFor="hero_description">Описание</Label>
                <Textarea
                  id="hero_description"
                  value={settings.hero_description || ""}
                  onChange={(e) => handleChange("hero_description", e.target.value)}
                  placeholder="Краткое описание услуг..."
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card>
          <CardHeader>
            <CardTitle>Секция портфолио</CardTitle>
            <CardDescription>
              Настройки отображения секции портфолио
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="portfolio_title">Заголовок секции</Label>
              <Input
                id="portfolio_title"
                value={settings.portfolio_title || ""}
                onChange={(e) => handleChange("portfolio_title", e.target.value)}
                placeholder="Портфолио"
              />
            </div>
            <div>
              <Label htmlFor="portfolio_description">Описание секции</Label>
              <Textarea
                id="portfolio_description"
                value={settings.portfolio_description || ""}
                onChange={(e) => handleChange("portfolio_description", e.target.value)}
                placeholder="Избранные проекты: от классических сайтов до AI-интеграций"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="portfolio_columns">Количество столбцов</Label>
              <Input
                id="portfolio_columns"
                type="number"
                min="1"
                max="4"
                value={settings.portfolio_columns || 3}
                onChange={(e) => handleChange("portfolio_columns", parseInt(e.target.value) || 3)}
                placeholder="3"
              />
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>Секция "О себе"</CardTitle>
            <CardDescription>
              Информация в секции "О себе"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="about_title">Заголовок</Label>
              <Input
                id="about_title"
                value={settings.about_title || ""}
                onChange={(e) => handleChange("about_title", e.target.value)}
                placeholder="Обо мне"
              />
            </div>
            <div>
              <Label htmlFor="about_description">Описание</Label>
              <Textarea
                id="about_description"
                value={settings.about_description || ""}
                onChange={(e) => handleChange("about_description", e.target.value)}
                placeholder="Рассказ о вашем пути..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Статистика</CardTitle>
            <CardDescription>
              Числовые показатели для отображения на сайте
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="years_experience">Лет опыта</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={settings.years_experience || ""}
                  onChange={(e) => handleChange("years_experience", parseInt(e.target.value) || 0)}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="projects_count">Проектов</Label>
                <Input
                  id="projects_count"
                  type="number"
                  value={settings.projects_count || ""}
                  onChange={(e) => handleChange("projects_count", parseInt(e.target.value) || 0)}
                  placeholder="200"
                />
              </div>
              <div>
                <Label htmlFor="ai_integrations">AI интеграций</Label>
                <Input
                  id="ai_integrations"
                  type="number"
                  value={settings.ai_integrations || ""}
                  onChange={(e) => handleChange("ai_integrations", parseInt(e.target.value) || 0)}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="satisfaction_rate">% довольных клиентов</Label>
                <Input
                  id="satisfaction_rate"
                  type="number"
                  value={settings.satisfaction_rate || ""}
                  onChange={(e) => handleChange("satisfaction_rate", parseInt(e.target.value) || 0)}
                  placeholder="99"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
            <CardDescription>
              Контакты и социальные сети
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="contact_email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email || ""}
                  onChange={(e) => handleChange("contact_email", e.target.value)}
                  placeholder="contact@example.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Телефон
                </Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone || ""}
                  onChange={(e) => handleChange("contact_phone", e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="social_github" className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </Label>
                <Input
                  id="social_github"
                  value={settings.social_github || ""}
                  onChange={(e) => handleChange("social_github", e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              <div>
                <Label htmlFor="social_linkedin" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  id="social_linkedin"
                  value={settings.social_linkedin || ""}
                  onChange={(e) => handleChange("social_linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <Label htmlFor="social_telegram" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Telegram
                </Label>
                <Input
                  id="social_telegram"
                  value={settings.social_telegram || ""}
                  onChange={(e) => handleChange("social_telegram", e.target.value)}
                  placeholder="https://t.me/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
