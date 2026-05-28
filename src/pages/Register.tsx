import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const months = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError("Введите имя");
    if (!email.includes("@")) return setError("Введите корректный email");
    if (!day || !month || !year) return setError("Укажите полную дату рождения");
    if (password.length < 6) return setError("Пароль должен быть не короче 6 символов");
    if (password !== confirmPassword) return setError("Пароли не совпадают");
    if (!agreed) return setError("Необходимо принять политику конфиденциальности");

    setSubmitting(true);
    const { error: signUpError } = await signUp(email, password, name.trim(), {
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError);
      return;
    }

    toast.success("Аккаунт создан!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
              Создать аккаунт
            </h1>
            <p className="text-sm text-muted-foreground">
              Сохраняйте свои разборы и возвращайтесь к ним
            </p>
          </div>

          <form onSubmit={handleSubmit} className="gradient-card rounded-2xl p-6 md:p-8 border border-border space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                placeholder="Как к вам обращаться"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                autoComplete="name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label>Дата рождения</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={day} onValueChange={setDay} disabled={submitting}>
                  <SelectTrigger><SelectValue placeholder="День" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {days.map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={month} onValueChange={setMonth} disabled={submitting}>
                  <SelectTrigger><SelectValue placeholder="Месяц" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {months.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear} disabled={submitting}>
                  <SelectTrigger><SelectValue placeholder="Год" /></SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Повторите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ещё раз тот же пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="agreed"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={submitting}
                className="mt-1 h-4 w-4 rounded border-border accent-primary cursor-pointer flex-shrink-0"
              />
              <label htmlFor="agreed" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                Регистрируясь, вы соглашаетесь с{" "}
                <a
                  href="/privacy-policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                >
                  Политикой конфиденциальности
                </a>
              </label>
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-full text-base">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Создать аккаунт
            </Button>

            <p className="text-sm text-center text-muted-foreground pt-2">
              У меня уже есть профиль.{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Войти
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
