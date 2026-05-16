import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, User, Target } from "lucide-react";

interface OverallVerdictProps {
  verdict: {
    canBeTogetherNow: boolean;
    whoHoldsUnion: 'person1' | 'person2' | 'both' | 'none';
    mainRisk: string;
    longTermProspect: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
  };
  person1Name: string;
  person2Name: string;
  relationType: 'love' | 'business';
}

export function OverallVerdict({ verdict, person1Name, person2Name, relationType }: OverallVerdictProps) {
  const { t } = useTranslation();
  
  const prospectColors = {
    'HIGH': 'text-green-600 dark:text-green-400',
    'MEDIUM': 'text-amber-600 dark:text-amber-400',
    'LOW': 'text-red-600 dark:text-red-400',
  };
  
  const prospectBg = {
    'HIGH': 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800',
    'MEDIUM': 'bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800',
    'LOW': 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800',
  };
  
  return (
    <div className={cn(
      "rounded-xl border-2 p-6 space-y-4",
      prospectBg[verdict.longTermProspect]
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          verdict.canBeTogetherNow ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
        )}>
          {verdict.canBeTogetherNow ? (
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          )}
        </div>
        <div>
          <h3 className="font-display font-semibold text-xl">
            {t('lifecod.verdict.title')}
          </h3>
          <p className={cn("font-medium", prospectColors[verdict.longTermProspect])}>
            {t(`lifecod.verdict.prospect.${verdict.longTermProspect}`)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Можно ли быть вместе */}
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t('lifecod.verdict.canBeTogether')}
            </p>
            <p className="font-semibold">
              {verdict.canBeTogetherNow ? t('lifecod.verdict.yes') : t('lifecod.verdict.no')}
            </p>
          </div>
        </div>
        
        {/* Кто держит союз */}
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t('lifecod.verdict.whoHolds')}
            </p>
            <p className="font-semibold">
              {verdict.whoHoldsUnion === 'both' && t('lifecod.verdict.both')}
              {verdict.whoHoldsUnion === 'person1' && person1Name}
              {verdict.whoHoldsUnion === 'person2' && person2Name}
              {verdict.whoHoldsUnion === 'none' && t('lifecod.verdict.noOne')}
            </p>
          </div>
        </div>
        
        {/* Главный риск */}
        {verdict.mainRisk && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {t('lifecod.verdict.mainRisk')}
              </p>
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                {verdict.mainRisk}
              </p>
            </div>
          </div>
        )}
        
        {/* Перспективы */}
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {t('lifecod.verdict.longTerm')}
            </p>
            <p className={cn("font-semibold", prospectColors[verdict.longTermProspect])}>
              {t(`lifecod.verdict.prospect.${verdict.longTermProspect}`)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Рекомендация */}
      <div className="pt-4 border-t border-border/50">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {t('lifecod.verdict.recommendation')}
        </p>
        <p className="text-base">{verdict.recommendation}</p>
      </div>
    </div>
  );
}
