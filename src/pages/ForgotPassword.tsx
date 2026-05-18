import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) return setError("Введите корректный email");

    setSubmitting(true);
    const { error: resetError } = await resetPassword(email);
    setSubmitting(false);

    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">
              Сброс пароля
            </h1>
            <p className="text-sm text-muted-foreground">
              Введите email, и мы пришлём ссылку для смены пароля
            </p>
          </div>

          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            {sent ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                <h2 className="font-display text-xl text-foreground">Ссылка отправлена</h2>
                <p className="text-sm text-muted-foreground">
                  Проверьте почту <span className="font-medium text-foreground">{email}</span>.
                  Если письма нет — посмотрите в папке «Спам».
                </p>
                <Link to="/login" className="inline-block text-sm text-primary font-medium hover:underline pt-2">
                  Вернуться к входу
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

                <Button type="submit" disabled={submitting} className="w-full h-12 rounded-full text-base">
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Отправить ссылку
                </Button>

                <p className="text-sm text-center text-muted-foreground pt-2">
                  Вспомнили пароль?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Войти
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
