import { cn } from "@/lib/utils";
import { Check, Crown, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TierType, AnalysisTypeConfig } from "@/lib/analysisConfig";

interface TierSelectorProps {
  config: AnalysisTypeConfig;
  selectedTier: TierType;
  onSelectTier: (tier: TierType) => void;
  priceBasic?: number | null;
  pricePro?: number | null;
}

export function TierSelector({
  config,
  selectedTier,
  onSelectTier,
  priceBasic,
  pricePro,
}: TierSelectorProps) {
  const { t } = useTranslation();

  const formatPrice = (price: number | null | undefined): string => {
    if (price == null) return "...";
    if (price === 0) return t("cfg.free");
    return price.toLocaleString("ru-RU") + " ₽";
  };

  if (!config.professional) return null;

  const showBasic = config.basic?.available !== false;

  if (!showBasic && selectedTier === "basic") {
    onSelectTier("professional");
  }

  return (
    <div className={cn("grid gap-3 mb-6", showBasic ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1")}>
      {showBasic && (
        <button
          type="button"
          onClick={() => onSelectTier("basic")}
          className={cn(
            "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
            selectedTier === "basic"
              ? "bg-[#f5f1ec] shadow-[0_4px_16px_rgba(30,8,0,0.12)]"
              : "bg-white hover:border-[#8B5E1A]"
          )}
          style={{borderColor: selectedTier === "basic" ? '#0F2044' : '#1a3060'}}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              selectedTier === "basic" ? "border-[#0F2044] bg-[#0F2044]" : "border-[#1a3060]/50"
            )}>
              {selectedTier === "basic" && <Check className="w-3 h-3 text-[#FFF8E7]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Zap className="w-4 h-4 flex-shrink-0" style={{color:'#C9973A'}} />
                <span className="font-display font-semibold text-sm" style={{color:'#2D1A00'}}>
                  {config.basic.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    priceBasic === 0 || config.basic.isFree
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : ""
                  )}
                  style={!(priceBasic === 0 || config.basic.isFree) ? {background:'rgba(196,152,90,0.15)',color:'#8B5E1A'} : {}}
                >
                  {priceBasic != null
                    ? formatPrice(priceBasic)
                    : config.basic.isFree ? t("cfg.free") : "..."}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{color:'#4A2800'}}>
                {config.basic.description}
              </p>
            </div>
          </div>
        </button>
      )}

      <button
        type="button"
        onClick={() => onSelectTier("professional")}
        className={cn(
          "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
          selectedTier === "professional"
            ? "bg-[#f5f1ec] shadow-[0_4px_16px_rgba(30,8,0,0.12)]"
            : "bg-white hover:border-[#8B5E1A]"
        )}
        style={{borderColor: selectedTier === "professional" ? '#0F2044' : '#1a3060'}}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
            selectedTier === "professional" ? "border-[#0F2044] bg-[#0F2044]" : "border-[#1a3060]/50"
          )}>
            {selectedTier === "professional" && <Check className="w-3 h-3 text-[#FFF8E7]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Crown className="w-4 h-4 flex-shrink-0" style={{color:'#C9973A'}} />
              <span className="font-display font-semibold text-sm" style={{color:'#2D1A00'}}>
                {config.professional.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{background:'rgba(196,152,90,0.15)',color:'#8B5E1A'}}>
                {pricePro != null ? formatPrice(pricePro) : "..."}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{color:'#4A2800'}}>
              {config.professional.description}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
