import { Button } from "@/components/ui/button";
import { Crown, ShieldCheck, CheckCircle, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { getAnalysisConfig } from "@/lib/analysisConfig";
import { supabase } from "@/integrations/supabase/client";

interface PaymentScreenProps {
  methodId: string;
  onPaid: () => void;
  onBack: () => void;
}

export function PaymentScreen({ methodId, onPaid, onBack }: PaymentScreenProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const config = getAnalysisConfig(methodId);

  const handlePayment = async () => {
    setProcessing(true);
    setError(null);

    try {
      // Вызываем Edge Function create-payment
      const { data, error: fnError } = await supabase.functions.invoke("create-payment", {
        body: { method_id: methodId },
      });

      if (fnError || !data?.payment_url) {
        throw new Error(fnError?.message || "Не удалось создать платёж");
      }

      // Сохраняем order_id — он понадобится на странице /payment/success
      // чтобы проверить статус оплаты и вернуться к разбору
      sessionStorage.setItem("pending_order_id", data.order_id);
      sessionStorage.setItem("pending_method_id", methodId);

      // Редиректим на страницу оплаты Робокассы
      window.location.href = data.payment_url;

    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при создании платежа");
      setProcessing(false);
    }
  };

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
            <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
              Профессиональный разбор
            </h2>
            <p className="text-sm text-muted-foreground">
              {config?.title || "Полный детальный анализ"}
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
            <div className="space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Переход к оплате...</p>
            </div>
          ) : (
            <>
              <Button
                onClick={handlePayment}
                className="w-full h-14 text-lg bg-primary text-primary-foreground"
                size="lg"
              >
                <ShieldCheck className="w-5 h-5 mr-2" />
                Оплатить и получить разбор
              </Button>
              <p className="text-xs text-muted-foreground">
                🔒 Безопасная оплата через Робокассу
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
