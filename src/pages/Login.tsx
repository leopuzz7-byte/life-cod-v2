import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const fromPath = (location.state as { from?: string } | null)?.from || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) return setError(t("auth.invalidEmail"));
    if (!password) return setError(t("auth.enterPassword"));

    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
      return;
    }

    toast.success(t("auth.welcome"));
    navigate(fromPath);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
              {t("auth.loginTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.loginSubtitle")}
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("auth.forgot")}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-12 rounded-full text-base">
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {t("nav.login")}
            </Button>

            <p className="text-sm text-center text-muted-foreground pt-2">
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                {t("auth.register")}
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
