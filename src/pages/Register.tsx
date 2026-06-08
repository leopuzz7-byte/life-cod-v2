import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError(t("auth.enterName"));
    if (!email.includes("@")) return setError(t("auth.invalidEmail"));
    if (!day || !month || !year) return setError(t("auth.fullBirthDate"));
    if (password.length < 6) return setError(t("auth.passwordMin"));
    if (password !== confirmPassword) return setError(t("auth.passwordMismatch"));

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

    toast.success(t("auth.accountCreated"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-3 leading-tight">
              {t("auth.registerTitle1")}<br />{t("auth.registerTitle2")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t("auth.registerSubtitle")}
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
              <Label htmlFor="name">{t("auth.name")}</Label>
              <Input
                id="name"
                placeholder={t("auth.namePlaceholder")}
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
              <Label>{t("auth.birthDate")}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select value={day} onValueChange={setDay} disabled={submitting}>
                  <SelectTrigger className="border-[#0F2044]/40 focus:border-[#0F2044] h-11"><SelectValue placeholder={t("calculator.day")} /></SelectTrigger>
                  <SelectContent className="max-h-60 border-[#0F2044]/30 bg-white/90 backdrop-blur-md">
                    {days.map((d) => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={month} onValueChange={setMonth} disabled={submitting}>
                  <SelectTrigger className="border-[#0F2044]/40 focus:border-[#0F2044] h-11"><SelectValue placeholder={t("calculator.month")} /></SelectTrigger>
                  <SelectContent className="max-h-60 border-[#0F2044]/30 bg-white/90 backdrop-blur-md">
                    {months.map((_, i) => <SelectItem key={i} value={String(i + 1)}>{t(`forecast.months.${i + 1}`)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={year} onValueChange={setYear} disabled={submitting}>
                  <SelectTrigger className="border-[#0F2044]/40 focus:border-[#0F2044] h-11"><SelectValue placeholder={t("calculator.year")} /></SelectTrigger>
                  <SelectContent className="max-h-60 border-[#0F2044]/30 bg-white/90 backdrop-blur-md">
                    {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="agree-policy"
                checked={agreed}
                onCheckedChange={(v) => setAgreed(v === true)}
                disabled={submitting}
                className="mt-0.5"
              />
              <Label htmlFor="agree-policy" className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer">
                {t("auth.agreePrefix")}
                <a
                  href="/privacy-policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("auth.privacyPolicy")}
                </a>
              </Label>
            </div>

            <Button type="submit" disabled={submitting || !agreed} className="w-full h-12 rounded-full text-base">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("auth.createAccount")}
            </Button>

            <p className="text-sm text-center text-muted-foreground pt-2">
              {t("auth.haveProfile")}{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                {t("nav.login")}
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
