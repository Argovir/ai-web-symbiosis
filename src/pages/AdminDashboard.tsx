import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  LogOut,
  Settings,
  FileText,
  Folder,
  BarChart3,
  User,
  Home,
  Plus,
  Sun,
  Moon,
  Monitor
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { SiteSettingsManager } from "@/components/admin/SiteSettingsManager";
import { PortfolioManager } from "@/components/admin/PortfolioManager";
import { BlogManager } from "@/components/admin/BlogManager";
import { ProfileManager } from "@/components/admin/ProfileManager";

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    publishedPosts: 0,
    draftPosts: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  useEffect(() => {
    checkUser();
    loadStats();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      setUser(session.user);

      // Get user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      setProfile(profileData);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [projectsRes, postsRes] = await Promise.all([
        supabase.from("portfolio_projects").select("id", { count: "exact" }),
        supabase.from("blog_posts").select("id, status", { count: "exact" })
      ]);

      const publishedPosts = postsRes.data?.filter(p => p.status === "published").length || 0;
      const draftPosts = postsRes.data?.filter(p => p.status === "draft").length || 0;

      setStats({
        projects: projectsRes.count || 0,
        posts: postsRes.count || 0,
        publishedPosts,
        draftPosts
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Выход выполнен",
        description: "До свидания!",
      });
      navigate("/admin/login");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold font-geist">Админ панель</h1>
                <p className="text-sm text-muted-foreground">
                  Добро пожаловать, {profile?.full_name || user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="outline" size="sm">
                     {getThemeIcon()}
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                   <DropdownMenuItem onClick={() => setTheme('light')}>
                     <Sun className="w-4 h-4 mr-2" />
                     Светлая
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setTheme('dark')}>
                     <Moon className="w-4 h-4 mr-2" />
                     Тёмная
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setTheme('system')}>
                     <Monitor className="w-4 h-4 mr-2" />
                     Системная
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
               <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                 <Home className="w-4 h-4 mr-2" />
                 На сайт
               </Button>
               <Button variant="outline" size="sm" onClick={handleLogout}>
                 <LogOut className="w-4 h-4 mr-2" />
                 Выйти
               </Button>
             </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Проекты</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projects}</div>
              <p className="text-xs text-muted-foreground">всего проектов</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Статьи</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.posts}</div>
              <p className="text-xs text-muted-foreground">всего статей</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Опубликовано</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.publishedPosts}</div>
              <p className="text-xs text-muted-foreground">опубликованных статей</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Черновики</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draftPosts}</div>
              <p className="text-xs text-muted-foreground">черновиков</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Портфолио
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Блог
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SiteSettingsManager onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManager onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager onUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileManager profile={profile} onUpdate={checkUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
