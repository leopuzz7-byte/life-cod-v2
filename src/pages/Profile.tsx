import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, LogOut, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Экран ошибки загрузки профиля — когда сеть подвела и мы не знаем, есть ли профиль на сервере
function ProfileLoadError({ error, onRetry, onSignOut }: { error: string; onRetry: () => void; onSignOut: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-destructive/40 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="font-display text-xl text-foreground">Не удалось загрузить профиль</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground">
              Это похоже на проблему с подключением к интернету. Проверьте сеть и попробуйте ещё раз.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Button onClick={onRetry} className="w-full h-11 rounded-full">Попробовать снова</Button>
              <Button variant="outline" onClick={onSignOut} className="w-full h-11 rounded-full">
                <LogOut className="w-4 h-4 mr-2" /> Выйти
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Запасной экран — если профиль не найден в БД, даём пользователю заполнить его заново
function ProfileNotFoundRecovery() {
  const { user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    setError(null);
    if (!user) return setError("Сессия потеряна — войдите заново");
    if (!name.trim()) return setError("Введите имя");
    if (!day || !month || !year) return setError("Укажите полную дату рождения");

    setSaving(true);
    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email || "",
      name: name.trim(),
      birth_day: parseInt(day),
      birth_month: parseInt(month),
      birth_year: parseInt(year),
    });
    setSaving(false);

    if (upsertError) {
      console.error("[Profile] upsert failed:", upsertError);
      setError("Не удалось сохранить: " + upsertError.message);
      return;
    }

    await refreshProfile();
    toast.success("Профиль создан");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-2xl md:text-3xl text-primary mb-2">
              Завершите создание профиля
            </h1>
            <p className="text-sm text-muted-foreground">
              Ваш аккаунт создан, но профиль не заполнен. Пожалуйста, укажите данные.
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="r-name">Имя</Label>
              <Input id="r-name" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={day} onValueChange={setDay} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="День" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {days.map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={month} onValueChange={setMonth} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="Месяц" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="Год" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreate} disabled={saving} className="w-full h-11 rounded-full">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Создать профиль
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="w-full h-11 rounded-full">
              <LogOut className="w-4 h-4 mr-2" /> Выйти
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, profileFetched, profileError, signOut, resetPassword, updateProfile, refreshProfile, loading } = useAuth();

  const [name, setName] = useState(profile?.name || "");
  const [day, setDay] = useState(profile ? String(profile.birth_day) : "");
  const [month, setMonth] = useState(profile ? String(profile.birth_month) : "");
  const [year, setYear] = useState(profile ? String(profile.birth_year) : "");
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || !profileFetched) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingScreen />
      </div>
    );
  }

  // Профиль загружен (хотя бы из кеша или в реальности) → если он есть, показываем нормально
  // Если профиля нет И при загрузке была сетевая ошибка → не показываем форму создания (это может быть ложная "пустота" из-за сети)
  if (!profile) {
    if (profileError) {
      return <ProfileLoadError error={profileError} onRetry={refreshProfile} onSignOut={async () => { await signOut(); navigate("/"); }} />;
    }
    return <ProfileNotFoundRecovery />;
  }

  const handleSave = async () => {
    setError(null);
    if (!name.trim()) return setError("Имя не может быть пустым");
    if (!day || !month || !year) return setError("Укажите полную дату рождения");

    setSaving(true);
    const { error: updateError } = await updateProfile({
      name: name.trim(),
      birth_day: parseInt(day),
      birth_month: parseInt(month),
      birth_year: parseInt(year),
    });
    setSaving(false);

    if (updateError) {
      setError(updateError);
      return;
    }
    toast.success("Профиль обновлён");
  };

  const handleSendResetLink = async () => {
    setSendingReset(true);
    const { error: resetError } = await resetPassword(profile.email);
    setSendingReset(false);

    if (resetError) {
      toast.error(resetError);
      return;
    }
    toast.success("Ссылка для смены пароля отправлена на вашу почту");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isDirty =
    name !== profile.name ||
    day !== String(profile.birth_day) ||
    month !== String(profile.birth_month) ||
    year !== String(profile.birth_year);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">Мой профиль</h1>
            <p className="text-sm text-muted-foreground">Личные данные и настройки аккаунта</p>
          </div>

          {/* Personal info */}
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border mb-4 space-y-4">
            <h2 className="font-display text-xl text-foreground mb-1">Личные данные</h2>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled />
              <p className="text-xs text-muted-foreground">Email сейчас изменить нельзя</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={day} onValueChange={setDay} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="День" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {days.map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={month} onValueChange={setMonth} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="Месяц" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear} disabled={saving}>
                  <SelectTrigger><SelectValue placeholder="Год" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="w-full h-11 rounded-full"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Сохранить изменения
            </Button>
          </div>

          {/* Security */}
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border mb-4 space-y-4">
            <h2 className="font-display text-xl text-foreground mb-1">Безопасность</h2>
            <p className="text-sm text-muted-foreground">
              Мы отправим ссылку на email <span className="font-medium text-foreground">{profile.email}</span> — по ней вы сможете задать новый пароль.
            </p>
            <Button
              variant="outline"
              onClick={handleSendResetLink}
              disabled={sendingReset}
              className="w-full h-11 rounded-full"
            >
              {sendingReset ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <KeyRound className="w-4 h-4 mr-2" />}
              Сменить пароль
            </Button>
          </div>

          {/* Sign out */}
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border space-y-4">
            <h2 className="font-display text-xl text-foreground mb-1">Аккаунт</h2>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full h-11 rounded-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
