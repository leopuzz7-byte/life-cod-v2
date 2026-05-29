import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  // На странице сброса должна быть recovery-сессия из email-ссылки
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError(t("auth.passwordMin"));
    if (password !== confirmPassword) return setError(t("auth.passwordMismatch"));

    setSubmitting(true);
    const { error: updateError } = await updatePassword(password);
    setSubmitting(false);

    if (updateError) {
      setError(updateError);
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
              {t("reset.newTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("reset.newSubtitle")}
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            {done ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h2 className="font-display text-xl text-foreground">{t("reset.changed")}</h2>
                <p className="text-sm text-muted-foreground">{t("reset.redirecting")}</p>
              </div>
            ) : hasRecoverySession === false ? (
              <div className="text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
                <h2 className="font-display text-lg text-foreground">{t("reset.invalidLink")}</h2>
                <p className="text-sm text-muted-foreground">
                  {t("reset.invalidLinkDesc")}
                </p>
                <Link to="/forgot-password" className="inline-block text-sm text-primary font-medium hover:underline pt-2">
                  {t("reset.requestNew")}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">{t("reset.newPasswordLabel")}</Label>
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={submitting}
                    autoComplete="new-password"
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full h-12 rounded-full text-base">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("reset.saveNewPassword")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
