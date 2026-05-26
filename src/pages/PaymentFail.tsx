import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="font-display text-2xl text-foreground">
            Оплата не прошла
          </h1>
          <p className="text-muted-foreground">
            Платёж был отменён или произошла ошибка. Деньги не были списаны.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 rounded-full">
              ← Назад
            </Button>
            <Button onClick={() => navigate("/")} className="flex-1 rounded-full">
              Попробовать снова
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
