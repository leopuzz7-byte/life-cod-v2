import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, ArrowLeft, Loader2, AlertCircle, CreditCard, Bitcoin } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAnalysisConfig } from "@/lib/analysisConfig";
import { useMethodPrice } from "@/hooks/useMethodPrice";
import { supabase } from "@/integrations/supabase/client";

interface PaymentScreenProps {
  methodId: string;
  tier: "basic" | "professional";
  onPaid: () => void;
  onBack: () => void;
}

type PayMethod = "card" | "crypto";

export function PaymentScreen({ methodId, tier, onBack }: PaymentScreenProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState<PayMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const config = getAnalysisConfig(methodId);
  const { prices } = useMethodPrice(methodId);
  const price = tier === "professional" ? prices?.price_pro : prices?.price_basic;
  const priceText = price == null ? null : price === 0 ? t("cfg.free") : price.toLocaleString("ru-RU") + " ₽";

  const startPayment = async (method: PayMethod) => {
    setProcessing(method);
    setError(null);

    const fnName = method === "card" ? "create-payment" : "create-payment-crypto";

    try {
      const { data, error: fnError } = await supabase.functions.invoke(fnName, {
        body: { method_id: methodId, tier },
      });

      if (fnError || !data) throw new Error(fnError?.message || t("paymentScreen.createError"));

      // Базовый бесплатный — сервер вернул free: true
      if (data.free) {
        sessionStorage.setItem("payment_completed", "true");
        sessionStorage.setItem("pending_method_id", methodId);
        window.location.href = "/payment/success";
        return;
      }

      if (!data.payment_url) throw new Error(t("paymentScreen.noUrl"));

      sessionStorage.setItem("pending_order_id", data.order_id);
      sessionStorage.setItem("pending_method_id", methodId);
      window.location.href = data.payment_url;

    } catch (e) {
      setError(e instanceof Error ? e.message : t("paymentScreen.genericError"));
      setProcessing(null);
    }
  };

  const tierLabel = tier === "professional" ? t("cfg.tierPro") : t("cfg.tierBasic");

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t("paymentScreen.backToChoice")}
        </Button>

        <div className="gradient-card rounded-2xl p-8 border-2 border-primary/30 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h2 className="text-2xl font-display font-semibold text-foreground mb-1">
              {t("paymentScreen.tierAnalysis", { tier: tierLabel })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {config?.title || t("paymentScreen.detailedAnalysis")}
            </p>
            {priceText && (
              <p className="text-3xl font-display font-bold text-primary mt-3">{priceText}</p>
            )}
          </div>

          <div className="text-left space-y-2">
            {[
              t("paymentScreen.feature1"),
              t("paymentScreen.feature2"),
              t("paymentScreen.feature3"),
              t("paymentScreen.feature4"),
              t("paymentScreen.feature5"),
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
              <p className="text-sm text-center" style={{color:"#0F2044CC"}}>{t("paymentScreen.redirecting")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">{t("paymentScreen.choosePayMethod")}</p>

              <Button
                onClick={() => startPayment("card")}
                className="w-full h-14 text-base bg-primary text-primary-foreground"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {t("paymentScreen.payCard")}
              </Button>

              <Button
                onClick={() => startPayment("crypto")}
                variant="outline"
                className="w-full h-14 text-base border-primary/40"
                size="lg"
              >
                <Bitcoin className="w-5 h-5 mr-2" />
                {t("paymentScreen.payCrypto")}
              </Button>

              <p className="text-xs text-muted-foreground pt-1">
                🔒 {t("paymentScreen.payNote")}{" "}
                <a
                  href="/oferta-life-cod.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-primary"
                >
                  {t("paymentScreen.acceptOffer")}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
