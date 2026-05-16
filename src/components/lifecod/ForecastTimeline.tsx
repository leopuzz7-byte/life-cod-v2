import { useTranslation } from "react-i18next";
import { YearForecastPoint, RelationType } from "@/lib/lifecod/types";
import { cn } from "@/lib/utils";
import { Calendar, CheckCircle, AlertTriangle, XCircle, RefreshCw, Heart } from "lucide-react";

interface ForecastTimelineProps {
  forecast: YearForecastPoint[];
  relationType: RelationType;
}

export function ForecastTimeline({ forecast, relationType }: ForecastTimelineProps) {
  const { t } = useTranslation();
  
  const getYearIcon = (type: YearForecastPoint['type']) => {
    switch (type) {
      case 'STABLE': return CheckCircle;
      case 'CRISIS': return AlertTriangle;
      case 'BREAKDOWN': return XCircle;
      case 'RECOVERY': return RefreshCw;
      case 'NEW_UNION': return Heart;
      default: return Calendar;
    }
  };
  
  const getYearStyle = (type: YearForecastPoint['type']) => {
    switch (type) {
      case 'STABLE': 
        return 'border-green-400 bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400';
      case 'CRISIS': 
        return 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400';
      case 'BREAKDOWN': 
        return 'border-red-400 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400';
      case 'RECOVERY': 
        return 'border-blue-400 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400';
      case 'NEW_UNION': 
        return 'border-pink-400 bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400';
      default: 
        return 'border-border bg-card text-foreground';
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-display font-semibold text-lg flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        {t('lifecod.forecast.title')}
      </h3>
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {forecast.map((point, index) => {
            const Icon = getYearIcon(point.type);
            
            return (
              <div key={point.year} className="flex gap-4">
                {/* Year marker */}
                <div className={cn(
                  "relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  index === 0 ? "bg-primary border-primary" : getYearStyle(point.type)
                )}>
                  <Icon className={cn("w-4 h-4", index === 0 ? "text-primary-foreground" : "")} />
                </div>
                
                {/* Year content */}
                <div className={cn(
                  "flex-1 rounded-lg border-2 p-3 space-y-2",
                  getYearStyle(point.type)
                )}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-semibold">
                      {point.year}
                      {index === 0 && ` (${t('lifecod.forecast.current')})`}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20">
                      {t(`lifecod.forecast.type.${point.type}`)}
                    </span>
                  </div>
                  
                  <p className="text-sm">{point.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <span>
                      {t('lifecod.forecast.years')}: {point.person1Year} ↔ {point.person2Year}
                    </span>
                    {point.hasStabilizer && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {t('lifecod.forecast.hasStabilizer')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
