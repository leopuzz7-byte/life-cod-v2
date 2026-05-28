import { cn } from "@/lib/utils";
import { Check, Crown, Zap } from "lucide-react";
import type { TierType, AnalysisTypeConfig } from "@/lib/analysisConfig";

interface TierSelectorProps {
  config: AnalysisTypeConfig;
  selectedTier: TierType;
  onSelectTier: (tier: TierType) => void;
  priceBasic?: number | null;   // цена из БД, 0 = бесплатно, null = загружается
  pricePro?: number | null;     // цена из БД
}

function formatPrice(price: number | null | undefined): string {
  if (price == null) return "...";
  if (price === 0) return "Бесплатно";
  return price.toLocaleString("ru-RU") + " ₽";
}

export function TierSelector({
  config,
  selectedTier,
  onSelectTier,
  priceBasic,
  pricePro,
}: TierSelectorProps) {
  if (!config.professional) return null;

  // Показываем базовый только если он доступен в конфиге
  const showBasic = config.basic?.available !== false;

  // Если базового нет — переключаем на проф автоматически
  if (!showBasic && selectedTier === "basic") {
    onSelectTier("professional");
  }

  return (
    <div className={cn("grid gap-3 mb-6", showBasic ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
      {/* Базовый тариф — только если available */}
      {showBasic && (
        <button
          type="button"
          onClick={() => onSelectTier("basic")}
          className={cn(
            "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
            selectedTier === "basic"
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border bg-card hover:border-primary/40"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              selectedTier === "basic" ? "border-primary bg-primary" : "border-muted-foreground/30"
            )}>
              {selectedTier === "basic" && <Check className="w-3 h-3 text-primary-foreground" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="font-display font-semibold text-foreground text-sm">
                  {config.basic.label}
                </span>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium",
                  priceBasic === 0 || config.basic.isFree
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-primary/10 text-primary"
                )}>
                  {priceBasic != null
                    ? formatPrice(priceBasic)
                    : config.basic.isFree ? "Бесплатно" : "..."}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {config.basic.description}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Профессиональный тариф */}
      <button
        type="button"
        onClick={() => onSelectTier("professional")}
        className={cn(
          "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
          selectedTier === "professional"
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border bg-card hover:border-primary/40"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
            selectedTier === "professional" ? "border-primary bg-primary" : "border-muted-foreground/30"
          )}>
            {selectedTier === "professional" && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Crown className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-display font-semibold text-foreground text-sm">
                {config.professional.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                {pricePro != null ? formatPrice(pricePro) : "..."}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {config.professional.description}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
