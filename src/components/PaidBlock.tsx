import { Lock, Crown, Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccess, type AccessState } from "@/lib/accessControl";

interface PaidBlockProps {
  children: React.ReactNode;
  isLocked: boolean;
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
}

export function PaidBlock({ children, isLocked, title, description, features, className }: PaidBlockProps) {
  const { accessState, unlock, startPayment, isDevMode } = useAccess();

  // If not locked OR access is unlocked → show content
  if (!isLocked || accessState === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {/* Blurred content preview */}
      <div className="select-none pointer-events-none" aria-hidden="true">
        <div className="filter blur-[6px] opacity-50">
          {children}
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-background/80 to-background/95 rounded-xl">
        <div className="text-center p-6 max-w-md">
          <PaywallContent
            state={accessState}
            title={title}
            description={description}
            features={features}
            onPurchase={startPayment}
            onTestUnlock={unlock}
            isDevMode={isDevMode}
          />
        </div>
      </div>
    </div>
  );
}

/** Блок paywall, встроенный в результат (не overlay, а inline) */
export function InlinePaywall({ 
  title, 
  description, 
  features,
}: { 
  title?: string; 
  description?: string; 
  features?: string[];
}) {
  const { accessState, unlock, startPayment, isDevMode } = useAccess();

  if (accessState === 'unlocked') return null;

  return (
    <div className="gradient-card rounded-2xl p-6 border-2 border-primary/20 text-center">
      <PaywallContent
        state={accessState}
        title={title}
        description={description}
        features={features}
        onPurchase={startPayment}
        onTestUnlock={unlock}
        isDevMode={isDevMode}
      />
    </div>
  );
}

function PaywallContent({
  state,
  title,
  description,
  features,
  onPurchase,
  onTestUnlock,
  isDevMode,
}: {
  state: AccessState;
  title?: string;
  description?: string;
  features?: string[];
  onPurchase: () => void;
  onTestUnlock: () => void;
  isDevMode: boolean;
}) {
  if (state === 'payment_pending') {
    return (
      <>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
        <h3 className="font-display font-semibold text-foreground text-lg mb-2">
          Обработка оплаты...
        </h3>
        <p className="text-sm text-muted-foreground">
          Пожалуйста, подождите. После подтверждения оплаты разбор откроется автоматически.
        </p>
      </>
    );
  }

  return (
    <>
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Lock className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display font-semibold text-foreground text-lg mb-2">
        {title || "Профессиональный разбор"}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {description || "Полный детальный анализ с расширенными описаниями и рекомендациями"}
      </p>

      {features && features.length > 0 && (
        <div className="text-left mb-4 space-y-1.5">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={onPurchase}
        className="w-full btn-fill bg-primary text-primary-foreground mb-2"
        size="lg"
      >
        <Crown className="w-4 h-4 mr-2" />
        Купить профессиональный разбор
      </Button>

      <p className="text-xs text-muted-foreground">
        Доступ откроется мгновенно после оплаты
      </p>

      {/* Dev mode test button */}
      {isDevMode && (
        <Button
          onClick={onTestUnlock}
          variant="outline"
          size="sm"
          className="mt-3 border-dashed border-primary/50 text-primary"
        >
          <ShieldCheck className="w-3 h-3 mr-1" />
          DEV: Открыть для теста
        </Button>
      )}
    </>
  );
}

/** Маркетинговый CTA-блок */
export function ActivationBanner({ score = 37 }: { score?: number }) {
  const { unlock, startPayment, isDevMode } = useAccess();

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Crown className="w-6 h-6 text-primary" />
        <h3 className="font-display font-semibold text-xl text-primary">Профессиональный разбор</h3>
      </div>
      <p className="text-foreground font-medium">
        Ваш результат активирован на <span className="text-primary font-bold text-lg">{score}%</span>
      </p>
      <p className="text-muted-foreground text-sm max-w-lg mx-auto">
        Полная активация доступна после покупки профессионального разбора — все блоки откроются прямо на этой странице.
      </p>
      <Button size="lg" className="bg-primary text-primary-foreground" onClick={startPayment}>
        <Crown className="w-4 h-4 mr-2" /> Купить полный разбор
      </Button>
      {isDevMode && (
        <Button variant="outline" size="sm" onClick={unlock} className="border-dashed border-primary/50 text-primary">
          <ShieldCheck className="w-3 h-3 mr-1" /> DEV: Открыть для теста
        </Button>
      )}
    </div>
  );
}
