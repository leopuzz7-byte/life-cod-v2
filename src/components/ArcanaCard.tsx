import { useTranslation } from "react-i18next";
import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ArcanaCardProps {
  number: number;
  position?: number;
  positionTitle?: string;
  positionDescription?: string;
  showYearForecast?: boolean;
  showMonthForecast?: boolean;
  isReversed?: boolean;
  isMirror?: boolean;
  compact?: boolean;
}

export function ArcanaCard({
  number,
  position,
  positionTitle,
  positionDescription,
  showYearForecast = false,
  showMonthForecast = false,
  isReversed = false,
  isMirror = false,
  compact = false,
}: ArcanaCardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const arcana = getArcana(number);

  if (!arcana) return null;

  const description = showYearForecast 
    ? arcana.yearForecast 
    : showMonthForecast
      ? arcana.monthForecast
      : isReversed 
        ? arcana.personalReversed 
        : arcana.personalDescription;

  return (
    <div
      className={cn(
        "gradient-card rounded-xl border transition-all duration-300",
        isMirror && "border-primary/50 bg-primary/5",
        isReversed && !isMirror && "border-destructive/50 bg-destructive/5",
        !isMirror && !isReversed && "border-border"
      )}
    >
      <div
        className={cn(
          "p-4 cursor-pointer",
          compact && "p-3"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-display font-bold",
                isMirror && "bg-primary/20 text-primary",
                isReversed && !isMirror && "bg-destructive/20 text-destructive",
                !isMirror && !isReversed && "bg-primary/10 text-primary"
              )}
            >
              {number}
            </div>

            <div className="flex-1">
              {position && positionTitle && (
                <div className="text-xs text-muted-foreground mb-0.5">
                  {t("matrix.position")} {position}: {positionTitle}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground">
                  {arcana.name}
                </h3>
                {isMirror && (
                  <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    {t("matrix.mirror")}
                  </span>
                )}
                {isReversed && !isMirror && (
                  <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    {t("matrix.reversed")}
                  </span>
                )}
              </div>

              <div className="text-xs text-muted-foreground mt-0.5">
                {arcana.planet} • {arcana.element}
              </div>
            </div>
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>

        {positionDescription && !isExpanded && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {positionDescription}
          </p>
        )}
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {positionDescription && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t("matrix.positionMeaning")}:</span>{" "}
                {positionDescription}
              </p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              {showYearForecast ? t("matrix.yearForecast") : showMonthForecast ? t("matrix.monthForecast") : isReversed ? t("matrix.reversedMeaning") : t("matrix.description")}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {arcana.professions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">
                {t("matrix.suitableProfessions")}
              </h4>
              <div className="flex flex-wrap gap-2">
                {arcana.professions.map((profession, index) => (
                  <span
                    key={index}
                    className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground"
                  >
                    {profession}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}