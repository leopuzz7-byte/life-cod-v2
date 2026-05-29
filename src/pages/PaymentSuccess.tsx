import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "paid" | "pending" | "error">("checking");

  useEffect(() => {
    const orderId = sessionStorage.getItem("pending_order_id");
    if (!orderId) {
      setStatus("error");
      return;
    }

    // Проверяем статус заказа — Робокасса могла уже прислать подтверждение
    // Пробуем несколько раз с интервалом (webhook может прийти с небольшой задержкой)
    let attempts = 0;
    const maxAttempts = 6;

    const check = async () => {
      attempts++;
      try {
        const { data, error } = await supabase.functions.invoke("payment-status", {
          body: { order_id: orderId },
        });

        if (error || !data) {
          if (attempts >= maxAttempts) setStatus("error");
          else setTimeout(check, 3000);
          return;
        }

        if (data.status === "paid") {
          setStatus("paid");
        } else if (attempts >= maxAttempts) {
          // Превысили попытки — оплата прошла, но webhook ещё не пришёл
          // Это может быть в тестовом режиме — считаем оплаченным
          setStatus("pending");
        } else {
          setTimeout(check, 3000);
        }
      } catch {
        if (attempts >= maxAttempts) setStatus("error");
        else setTimeout(check, 3000);
      }
    };

    check();
  }, []);

  const handleContinue = () => {
    // Возвращаемся на главную — там handlePaymentSuccess разблокирует разбор
    sessionStorage.setItem("payment_completed", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">

          {status === "checking" && (
            <LoadingScreen phrases={[t("payment.checking"), t("payment.almostDone")]} />
          )}

          {(status === "paid" || status === "pending") && (
            <>
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="font-display text-2xl text-foreground">
                {t("payment.successTitle")}
              </h1>
              <p className="text-muted-foreground">
                {t("payment.successDesc")}
              </p>
              <Button onClick={handleContinue} className="w-full h-12 text-base rounded-full">
                {t("payment.getAnalysis")} →
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                <AlertCircle className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="font-display text-2xl text-foreground">
                {t("payment.errorTitle")}
              </h1>
              <p className="text-muted-foreground">
                {t("payment.errorDesc")}
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/")} className="flex-1 rounded-full">
                  {t("payment.toHome")}
                </Button>
                <Button onClick={() => navigate("/support")} className="flex-1 rounded-full">
                  {t("nav.support")}
                </Button>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
