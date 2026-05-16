import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, TrendingUp, TrendingDown, Lightbulb, Target } from "lucide-react";
import { useState } from "react";
import { PositionInterpretation } from "@/lib/matrixInterpretation";

interface ProArcanaCardProps {
  interpretation: PositionInterpretation;
  isMirror?: boolean;
  isReversed?: boolean;
}

export function ProArcanaCard({ interpretation, isMirror = false, isReversed = false }: ProArcanaCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const arcana = getArcana(interpretation.arcanaNumber);
  if (!arcana) return null;

  return (
    <div className={cn(
      "rounded-xl border transition-all duration-300",
      isMirror && "border-primary/50 bg-primary/5",
      isReversed && !isMirror && "border-destructive/50 bg-destructive/5",
      !isMirror && !isReversed && "border-border bg-card"
    )}>
      {/* Header */}
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-14 h-14 rounded-xl flex flex-col items-center justify-center text-xl font-display font-bold",
              isMirror && "bg-primary/20 text-primary",
              isReversed && !isMirror && "bg-destructive/20 text-destructive",
              !isMirror && !isReversed && "bg-primary/10 text-primary"
            )}>
              {interpretation.arcanaNumber}
              <span className="text-[10px] font-normal text-muted-foreground">{interpretation.position}</span>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">
                Позиция {interpretation.position}: {interpretation.positionTitle}
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-foreground">{arcana.name}</h3>
                {isMirror && (
                  <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Зеркальный
                  </span>
                )}
                {isReversed && !isMirror && (
                  <span className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3" /> Перевёрнутый
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{arcana.planet} • {arcana.element}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors mt-1">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-5 space-y-4">
          {/* Основное описание */}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isReversed ? arcana.personalReversed : arcana.personalDescription}
            </p>
          </div>

          {/* Как проявляется в жизни */}
          {interpretation.lifeManifestations && (
            <div className="bg-accent/30 rounded-lg p-3">
              <h4 className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" /> Как проявляется в жизни
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{interpretation.lifeManifestations}</p>
            </div>
          )}

          {/* Сильные и слабые стороны */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretation.strengths.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Сильные стороны
                </h4>
                <ul className="space-y-1">
                  {interpretation.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {interpretation.weaknesses.length > 0 && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-destructive mb-2 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" /> Слабые стороны
                </h4>
                <ul className="space-y-1">
                  {interpretation.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-destructive mt-0.5">•</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Где зарабатывает / теряет */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {interpretation.whereEarns && (
              <div className="rounded-lg p-3 bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">💰 Где зарабатывает</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{interpretation.whereEarns}</p>
              </div>
            )}
            {interpretation.whereLoses && (
              <div className="rounded-lg p-3 bg-muted/50 border border-border">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">⚠️ Где теряет</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{interpretation.whereLoses}</p>
              </div>
            )}
          </div>

          {/* Рекомендации */}
          {interpretation.recommendations.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <h4 className="text-sm font-medium text-primary mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" /> Рекомендации
              </h4>
              <ul className="space-y-1.5">
                {interpretation.recommendations.map((r, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">→</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Подходящие профессии */}
          {arcana.professions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Подходящие профессии</h4>
              <div className="flex flex-wrap gap-2">
                {arcana.professions.map((p, i) => (
                  <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full text-secondary-foreground">{p}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
