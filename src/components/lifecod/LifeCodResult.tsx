import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LifeCodCompatibilityResult } from "@/lib/lifecod/types";
import { PersonAnalysisCard } from "./PersonAnalysisCard";
import { CompatibilityMetrics } from "./CompatibilityMetrics";
import { ForecastTimeline } from "./ForecastTimeline";
import { OverallVerdict } from "./OverallVerdict";
import { consciousnessCompatibility } from "@/lib/lifecod/data";
import { getPairYearLink, getPairYearRatingLabel, PairYearRating } from "@/lib/lifecod/pairYearLinks";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { generateLifeCodCompatibilityPDF } from "@/lib/lifecod/pdfExport";
import { ArrowLeft, Brain, Heart, Briefcase, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LifeCodResultProps {
  result: LifeCodCompatibilityResult;
  onReset: () => void;
}

export function LifeCodResult({ result, onReset }: LifeCodResultProps) {
  const { t } = useTranslation();
  
  const consCompatStatus = result.consciousnessCompatibility.status;
  const consStatusColors = {
    'COMPATIBLE': 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400',
    'TENSE': 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400',
    'CONFLICT': 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400',
  };
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {result.relationType === 'love' ? (
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          ) : (
            <Briefcase className="w-8 h-8 text-blue-500" />
          )}
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-primary">
              {t('lifecod.result.title')}
            </h1>
            <p className="text-muted-foreground">
              {result.person1.name} & {result.person2.name}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <PDFDownloadButton
            onDownload={() => generateLifeCodCompatibilityPDF(result)}
          />
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('lifecod.result.back')}
          </Button>
        </div>
      </div>
      
      {/* Общий вердикт */}
      <OverallVerdict
        verdict={result.overallVerdict}
        person1Name={result.person1.name}
        person2Name={result.person2.name}
        relationType={result.relationType}
      />
      
      {/* Метрики совместимости */}
      <CompatibilityMetrics
        stabilizer={result.stabilizer}
        interaction={result.currentInteraction}
        yearEntry={result.yearEntry}
        relationType={result.relationType}
        person1Name={result.person1.name}
        person2Name={result.person2.name}
      />
      
      {/* Совместимость сознаний */}
      <div className={cn(
        "rounded-xl border-2 p-4 md:p-6 space-y-3",
        consStatusColors[consCompatStatus]
      )}>
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          <h3 className="font-display font-semibold text-lg">
            {t('lifecod.consciousness.compatibility')}
          </h3>
        </div>
        
        <p className="font-medium">
          {result.person1.consciousness.result} ({result.person1.name}) ↔ {result.person2.consciousness.result} ({result.person2.name})
        </p>
        
        <p className="text-sm">{result.consciousnessCompatibility.description}</p>
        
        <p className="text-sm">
          {result.relationType === 'love' 
            ? result.consciousnessCompatibility.loveInterpretation 
            : result.consciousnessCompatibility.businessInterpretation
          }
        </p>
      </div>
      
      {/* Анализ каждого человека */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonAnalysisCard person={result.person1} />
        <PersonAnalysisCard person={result.person2} />
      </div>
      
      {/* 81 связка личных годов */}
      <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">Связка личных годов (81 матрица)</h3>
        </div>
        
        <div className="space-y-3">
          {result.forecast.map((point) => {
            const pairLink = getPairYearLink(point.person1Year, point.person2Year);
            const ratingColors: Record<PairYearRating, string> = {
              resource: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400',
              possible: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400',
              risk: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400',
            };
            
            return (
              <div key={point.year} className={cn("rounded-lg border-2 p-3 space-y-1", ratingColors[pairLink.rating])}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold">{point.year}: {result.person1.name} ({point.person1Year}) ↔ {result.person2.name} ({point.person2Year})</span>
                  <span className="text-xs font-medium">{getPairYearRatingLabel(pairLink.rating)}</span>
                </div>
                <p className="text-sm font-medium">{pairLink.dynamics}</p>
                <p className="text-sm">
                  {result.relationType === 'love' ? pairLink.loveContext : pairLink.businessContext}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Прогноз на 5 лет */}
      <ForecastTimeline forecast={result.forecast} relationType={result.relationType} />
      
      {/* CTA */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
        <h3 className="font-display font-semibold text-xl text-primary">
          {t('lifecod.result.cta.title')}
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('lifecod.result.cta.description')}
        </p>
        <Button 
          size="lg" 
          className="bg-primary text-primary-foreground"
          onClick={() => {/* будет подключена оплата */}}
        >
          {t('lifecod.result.cta.button')}
        </Button>
      </div>
    </div>
  );
}
