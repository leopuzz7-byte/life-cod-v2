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
              ? "bg-[#f5f1ec] border-[#0F2044] shadow-[0_4px_16px_rgba(30,8,0,0.12)] dark:bg-[#0B1A33]/88 dark:border-[#D5A95B] dark:shadow-[0_5px_20px_rgba(0,0,0,0.32)]"
              : "bg-white border-[#1a3060] hover:border-[#8B5E1A] dark:bg-[#071326]/72 dark:border-[#D5A95B]/35 dark:hover:border-[#D5A95B]/70"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
              selectedTier === "basic" ? "border-[#0F2044] bg-[#0F2044] dark:border-[#D5A95B] dark:bg-[#D5A95B]" : "border-[#1a3060]/50 dark:border-[#D5A95B]/45"
            )}>
              {selectedTier === "basic" && <Check className="w-3 h-3 text-[#FFF8E7] dark:text-[#071326]" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Zap className="w-4 h-4 flex-shrink-0 text-[#0F2044] dark:text-[#E7C779]" />
                <span className="font-display font-semibold text-sm text-[#2D1A00] dark:text-[#F3DFC0]">
                  {config.basic.label}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    priceBasic === 0 || config.basic.isFree
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-blue-100 text-blue-800 dark:bg-[#D5A95B]/18 dark:text-[#E7C779]"
                  )}
                >
                  {priceBasic != null
                    ? formatPrice(priceBasic)
                    : config.basic.isFree ? t("cfg.free") : "..."}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#4A2800] dark:text-[#D8C7AE]">
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
            ? "bg-[#f5f1ec] border-[#0F2044] shadow-[0_4px_16px_rgba(30,8,0,0.12)] dark:bg-[#0B1A33]/88 dark:border-[#D5A95B] dark:shadow-[0_5px_20px_rgba(0,0,0,0.32)]"
            : "bg-white border-[#1a3060] hover:border-[#8B5E1A] dark:bg-[#071326]/72 dark:border-[#D5A95B]/35 dark:hover:border-[#D5A95B]/70"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
            selectedTier === "professional" ? "border-[#0F2044] bg-[#0F2044] dark:border-[#D5A95B] dark:bg-[#D5A95B]" : "border-[#1a3060]/50 dark:border-[#D5A95B]/45"
          )}>
            {selectedTier === "professional" && <Check className="w-3 h-3 text-[#FFF8E7] dark:text-[#071326]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Crown className="w-4 h-4 flex-shrink-0 text-[#0F2044] dark:text-[#E7C779]" />
              <span className="font-display font-semibold text-sm text-[#2D1A00] dark:text-[#F3DFC0]">
                {config.professional.label}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[#0F2044] text-white dark:bg-[#D5A95B] dark:text-[#071326]">
                {pricePro != null ? formatPrice(pricePro) : "..."}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#4A2800] dark:text-[#D8C7AE]">
              {config.professional.description}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
