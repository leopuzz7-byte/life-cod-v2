import { useTranslation } from "react-i18next";
import { StabilizerResult, InteractionAnalysis, PairEntryAnalysis, RelationType } from "@/lib/lifecod/types";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface CompatibilityMetricsProps {
  stabilizer: StabilizerResult;
  interaction: InteractionAnalysis;
  yearEntry: PairEntryAnalysis;
  relationType: RelationType;
  person1Name: string;
  person2Name: string;
}

export function CompatibilityMetrics({
  stabilizer,
  interaction,
  yearEntry,
  relationType,
  person1Name,
  person2Name,
}: CompatibilityMetricsProps) {
  const { t } = useTranslation();
  
  const stabilizerColors = {
    'STRONG': 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400 dark:border-green-800',
    'OK': 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800',
    'WEAK': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800',
    'NO': 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800',
  };
  
  const interactionColors = {
    'STABLE': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    'UNSTABLE': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    'CRISIS': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
    'BREAKDOWN': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  const entryColors = {
    'BEST': 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
    'OK': 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    'TEMP': 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    'NO': 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Стабилизатор */}
      <div className={cn(
        "rounded-xl border-2 p-4 space-y-3",
        stabilizerColors[stabilizer.status]
      )}>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h4 className="font-medium">{t('lifecod.stabilizer.title')}</h4>
        </div>
        
        <div className="flex items-center gap-2">
          {stabilizer.status === 'STRONG' && <CheckCircle className="w-5 h-5" />}
          {stabilizer.status === 'OK' && <TrendingUp className="w-5 h-5" />}
          {stabilizer.status === 'WEAK' && <TrendingDown className="w-5 h-5" />}
          {stabilizer.status === 'NO' && <XCircle className="w-5 h-5" />}
          <span className="font-semibold">{t(`lifecod.stabilizer.status.${stabilizer.status}`)}</span>
        </div>
        
        <p className="text-sm">
          {stabilizer.hasStabilizer ? (
            <>
              {t('lifecod.stabilizer.holder')}: {' '}
              {stabilizer.stabilizerHolder === 'both' && t('lifecod.stabilizer.both')}
              {stabilizer.stabilizerHolder === 'person1' && person1Name}
              {stabilizer.stabilizerHolder === 'person2' && person2Name}
              {stabilizer.stabilizerHolder === 'none' && t('lifecod.stabilizer.none')}
            </>
          ) : (
            t('lifecod.stabilizer.noStabilizer')
          )}
        </p>
        
        {stabilizer.destabilizers.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{t('lifecod.stabilizer.risks')}: {stabilizer.destabilizers.join(', ')}</span>
          </div>
        )}
      </div>
      
      {/* Текущее взаимодействие */}
      <div className={cn(
        "rounded-xl border p-4 space-y-3",
        interactionColors[interaction.category]
      )}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h4 className="font-medium">{t('lifecod.interaction.title')}</h4>
        </div>
        
        <div className="text-sm space-y-2">
          <p className="font-medium">{t(`lifecod.interaction.category.${interaction.category}`)}</p>
          <p>{relationType === 'love' ? interaction.loveMeaning : interaction.businessMeaning}</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span>{t('lifecod.interaction.risk')}: {interaction.riskLevel}%</span>
          <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                interaction.riskLevel < 30 ? "bg-green-500" :
                interaction.riskLevel < 60 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${interaction.riskLevel}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Год входа */}
      <div className={cn(
        "rounded-xl border p-4 space-y-3",
        entryColors[yearEntry.pairStatus]
      )}>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h4 className="font-medium">{t('lifecod.yearEntry.title')}</h4>
        </div>
        
        <div className="text-sm space-y-2">
          <p className="font-medium">{t(`lifecod.yearEntry.status.${yearEntry.pairStatus}`)}</p>
          <p>{yearEntry.pairComment}</p>
        </div>
        
        {yearEntry.stabilizerNeeded && (
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{t('lifecod.yearEntry.stabilizerNeeded')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
