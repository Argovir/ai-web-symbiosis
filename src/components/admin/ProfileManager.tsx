import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, Loader2, User, Mail, Shield, Key } from "lucide-react";
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
    if (!profile?.user_id) {
      toast({
        title: "Ошибка",
        description: "ID пользователя не найден",
        variant: "destructive",
      });
      return;
    }

    if (profile?.role === 'admin' && (!formData.email || !formData.email.trim())) {
      toast({
        title: "Ошибка",
        description: "Email обязателен для заполнения",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("No token found");

      const response = await fetch(`http://localhost:3001/api/profiles/${profile.user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: profile?.role === 'admin' ? formData.email.trim() : undefined,
          full_name: formData.full_name?.trim() || null,
          role: profile?.role === 'admin' ? formData.role : undefined,
          avatar_url: formData.avatar_url?.trim() || null,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Email уже используется другим пользователем");
        } else if (response.status === 403) {
          throw new Error("Недостаточно прав для обновления профиля");
        } else if (response.status === 404) {
          throw new Error("Профиль не найден");
        } else {
          throw new Error(data.error || 'Failed to update profile');
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
        description: error instanceof Error ? error.message : "Не удалось обновить профиль",
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
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3001/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: formData.new_password
        })
      });

      if (!response.ok) throw new Error('Failed to update password');

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
                  disabled={profile?.role !== 'admin'}
                />
              </div>
              {profile?.role !== 'admin' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Только администраторы могут изменять email
                </p>
              )}
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
                  disabled={profile?.role !== 'admin'}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="admin">Администратор</option>
                  <option value="editor">Редактор</option>
                  <option value="user">Пользователь</option>
                </select>
              </div>
              {profile?.role !== 'admin' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Только администраторы могут изменять роли
                </p>
              )}
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
