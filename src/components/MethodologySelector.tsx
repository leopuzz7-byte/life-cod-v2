import { cn } from "@/lib/utils";
import { Sparkles, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MethodologySelectorProps {
  selectedMethodology: "1" | "2";
  onMethodologyChange: (methodology: "1" | "2") => void;
}

export function MethodologySelector({ selectedMethodology, onMethodologyChange }: MethodologySelectorProps) {
  const { t } = useTranslation();

  const methodologies = [
    {
      id: "2" as const,
      name: t("methodology.methodology1"),
      subtitle: t("methodology.arcana22"),
      description: t("methodology.arcanaDescription"),
      features: [
        t("methodology.features.purpose"),
        t("methodology.features.compatibility"),
        t("methodology.features.forecasts"),
        t("methodology.features.lifePeriods"),
      ],
      isRecommended: true,
    },
    {
      id: "1" as const,
      name: t("methodology.methodology2"),
      subtitle: t("methodology.classic"),
      description: t("methodology.classicDescription"),
      features: [
        t("methodology.features.mindNumber"),
        t("methodology.features.actionNumber"),
        t("methodology.features.realizationNumber"),
        t("methodology.features.outcomeNumber"),
      ],
      isRecommended: false,
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <p className="text-sm text-muted-foreground text-center mb-4">
        {t("calculator.selectMethodology")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methodologies.map((m) => (
          <button
            key={m.id}
            onClick={() => onMethodologyChange(m.id)}
            className={cn(
              "relative p-5 rounded-xl border-2 transition-all duration-300 text-left",
              selectedMethodology === m.id
                ? "bg-primary/5 border-primary shadow-warm"
                : "bg-card border-border hover:border-primary/50"
            )}
          >
            {m.isRecommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t("methodology.moreAccurate")}
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                selectedMethodology === m.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}>
                {selectedMethodology === m.id && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground text-lg">
                    {m.name}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {m.subtitle}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {m.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {m.features.map((feature, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 bg-secondary/50 rounded-full text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
