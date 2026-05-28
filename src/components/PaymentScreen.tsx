import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, ArrowLeft, Loader2, AlertCircle, CreditCard, Bitcoin } from "lucide-react";
import { useState } from "react";
import { getAnalysisConfig } from "@/lib/analysisConfig";
import { supabase } from "@/integrations/supabase/client";

interface PaymentScreenProps {
  methodId: string;
  tier: "basic" | "professional";
  onPaid: () => void;
  onBack: () => void;
}

type PayMethod = "card" | "crypto";

export function PaymentScreen({ methodId, tier, onBack }: PaymentScreenProps) {
  const [processing, setProcessing] = useState<PayMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const config = getAnalysisConfig(methodId);

  const startPayment = async (method: PayMethod) => {
    setProcessing(method);
    setError(null);

    const fnName = method === "card" ? "create-payment" : "create-payment-crypto";

    try {
      const { data, error: fnError } = await supabase.functions.invoke(fnName, {
        body: { method_id: methodId, tier },
      });

      if (fnError || !data) throw new Error(fnError?.message || "Не удалось создать платёж");

      // Базовый бесплатный — сервер вернул free: true
      if (data.free) {
        sessionStorage.setItem("payment_completed", "true");
        sessionStorage.setItem("pending_method_id", methodId);
        window.location.href = "/payment/success";
        return;
      }

      if (!data.payment_url) throw new Error("Не получена ссылка на оплату");

      sessionStorage.setItem("pending_order_id", data.order_id);
      sessionStorage.setItem("pending_method_id", methodId);
      window.location.href = data.payment_url;

    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при создании платежа");
      setProcessing(null);
    }
  };

  const tierLabel = tier === "professional" ? "Профессиональный" : "Базовый";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад к выбору
        </Button>

        <div className="gradient-card rounded-2xl p-8 border-2 border-primary/30 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-display font-semibold text-foreground mb-1">
              {tierLabel} разбор
            </h2>
            <p className="text-sm text-muted-foreground">
              {config?.title || "Детальный анализ"}
            </p>
          </div>

          <div className="text-left space-y-2">
            {[
              "Все позиции и блоки анализа",
              "Расширенные расшифровки",
              "Детальные рекомендации",
              "Скрытые влияния и нюансы",
              "Полная глубина анализа",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-left">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {processing ? (
            <div className="space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Переход к оплате...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Выберите способ оплаты:</p>

              <Button
                onClick={() => startPayment("card")}
                className="w-full h-14 text-base bg-primary text-primary-foreground"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Оплатить картой
              </Button>

              <Button
                onClick={() => startPayment("crypto")}
                variant="outline"
                className="w-full h-14 text-base border-primary/40"
                size="lg"
              >
                <Bitcoin className="w-5 h-5 mr-2" />
                Оплатить криптовалютой
              </Button>

              <p className="text-xs text-muted-foreground pt-1">
                🔒 Карты — Робокасса. Криптовалюта — Plisio (USDT).{" "}
                <a
                  href="/oferta-life-cod.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-primary"
                >
                  Оплачивая, вы принимаете оферту
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
