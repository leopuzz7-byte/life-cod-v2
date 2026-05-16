import { useTranslation } from "react-i18next";
import { PersonLifeCodAnalysis } from "@/lib/lifecod/types";
import { consciousnessDescriptions, actionDescriptions, personalYearDescriptions } from "@/lib/lifecod/data";
import { cn } from "@/lib/utils";
import { Brain, Zap, Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface PersonAnalysisCardProps {
  person: PersonLifeCodAnalysis;
  showFull?: boolean;
}

export function PersonAnalysisCard({ person, showFull = true }: PersonAnalysisCardProps) {
  const { t } = useTranslation();
  
  const consData = consciousnessDescriptions[person.consciousness.result];
  const actData = actionDescriptions[person.action.result];
  const yearData = personalYearDescriptions[person.currentPersonalYear];
  
  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-bold">{person.name[0]}</span>
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">{person.name}</h3>
          <p className="text-sm text-muted-foreground">
            {person.birthDate.day}.{String(person.birthDate.month).padStart(2, '0')}.{person.birthDate.year}
          </p>
        </div>
      </div>
      
      {/* Сознание */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-sm">{t('lifecod.consciousness.title')}</h4>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {person.consciousness.result} — {consData?.name}
          </span>
        </div>
        
        {showFull && (
          <div className="pl-6 space-y-2 text-sm">
            <p className="text-muted-foreground">{consData?.core}</p>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-400">{consData?.inPlus}</p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{consData?.inMinus}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              {t('lifecod.consciousness.chain')}: {person.consciousness.chain.join(' → ')}
            </p>
          </div>
        )}
      </div>
      
      {/* Действия */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-sm">{t('lifecod.action.title')}</h4>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {person.action.result} — {actData?.name}
          </span>
        </div>
        
        {showFull && (
          <div className="pl-6 space-y-2 text-sm">
            <p className="text-muted-foreground">{actData?.core}</p>
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-green-700 dark:text-green-400">{actData?.inPlus}</p>
            </div>
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{actData?.inMinus}</p>
            </div>
            {actData?.riskScenarios && actData.riskScenarios.length > 0 && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-amber-700 dark:text-amber-400">
                  {t('lifecod.action.risks')}: {actData.riskScenarios.join(', ')}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {t('lifecod.action.chain')}: {person.action.chain.join(' → ')}
            </p>
          </div>
        )}
      </div>
      
      {/* Личный год */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h4 className="font-medium text-sm">{t('lifecod.personalYear.title')}</h4>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            yearData?.entryAllowed 
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
          )}>
            {person.currentPersonalYear} — {yearData?.name}
          </span>
        </div>
        
        {showFull && (
          <div className="pl-6 space-y-2 text-sm">
            <p className="text-muted-foreground">{yearData?.theme}</p>
            <p>{yearData?.forRelationships}</p>
          </div>
        )}
      </div>
    </div>
  );
}
