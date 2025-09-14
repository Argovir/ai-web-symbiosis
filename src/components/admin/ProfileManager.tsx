import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, User, Mail, Shield, Key } from "lucide-react";
import { supabase } from "@/integrations/api/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileManagerProps {
  profile: any;
  onUpdate?: () => void;
}

export const ProfileManager = ({ profile, onUpdate }: ProfileManagerProps) => {
  const [formData, setFormData] = useState({
    email: profile?.email || "",
    full_name: profile?.full_name || "",
    role: profile?.role || "admin",
    avatar_url: profile?.avatar_url || "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          avatar_url: formData.avatar_url,
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      // Update session if email changed
      if (profile?.email !== formData.email) {
        const sessionStr = localStorage.getItem('local_auth_session');
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          session.user.email = formData.email;
          localStorage.setItem('local_auth_session', JSON.stringify(session));
        }
      }

      toast({
        title: "Профиль обновлен",
        description: "Информация профиля успешно сохранена",
      });

      onUpdate?.();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (formData.new_password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.new_password
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        current_password: "",
        new_password: "",
        confirm_password: ""
      }));

      toast({
        title: "Пароль изменен",
        description: "Пароль успешно обновлен",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить пароль",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-geist">Профиль</h2>
        <p className="text-muted-foreground">Управление настройками аккаунта</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Информация профиля
            </CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="full_name">Полное имя</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Введите ваше полное имя"
              />
            </div>
            <div>
              <Label htmlFor="avatar_url">URL аватара</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <Label htmlFor="role">Роль</Label>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Администратор</option>
                  <option value="editor">Редактор</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить профиль
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Изменение пароля
            </CardTitle>
            <CardDescription>
              Обновите ваш пароль для входа в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="new_password">Новый пароль</Label>
              <Input
                id="new_password"
                type="password"
                value={formData.new_password}
                onChange={(e) => setFormData(prev => ({ ...prev, new_password: e.target.value }))}
                placeholder="Введите новый пароль"
              />
            </div>
            <div>
              <Label htmlFor="confirm_password">Подтвердите пароль</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                placeholder="Повторите новый пароль"
              />
            </div>
            <Button 
              onClick={handleChangePassword} 
              disabled={changingPassword || !formData.new_password || !formData.confirm_password}
              variant="outline"
            >
              {changingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Изменение...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Изменить пароль
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Информация об аккаунте</CardTitle>
            <CardDescription>
              Детали вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Дата создания:</span>
                <span>{new Date(profile?.created_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Последнее обновление:</span>
                <span>{new Date(profile?.updated_at).toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ID пользователя:</span>
                <span className="font-mono text-xs">{profile?.user_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
