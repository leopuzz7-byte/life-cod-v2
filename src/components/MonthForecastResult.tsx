import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Briefcase, Activity, AlertTriangle, CheckCircle, Target, Sparkles, BookOpen, MessageCircle } from "lucide-react";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
import { useMonthForecastAI } from "@/hooks/useMonthForecastAI";

const MONTH_NAMES_RU: Record<number, string> = {
  1:'Январь',2:'Февраль',3:'Март',4:'Апрель',5:'Май',6:'Июнь',
  7:'Июль',8:'Август',9:'Сентябрь',10:'Октябрь',11:'Ноябрь',12:'Декабрь',
};

interface MonthForecastResultProps {
  forecast: MonthForecast;
  name: string;
  onReset: () => void;
  tier?: string;
}

export function MonthForecastResult({ forecast, name, onReset }: MonthForecastResultProps) {
  const { t } = useTranslation();
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const monthName = MONTH_NAMES_RU[forecast.targetMonth] ?? t(`forecast.months.${forecast.targetMonth}`);
  const a1 = getArcana(forecast.position1);
  const a3 = getArcana(forecast.position3);
  const { reading, loading } = useMonthForecastAI(forecast, name);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.monthForecast")} — {monthName} {forecast.targetYear}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground text-sm">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Треугольник месяца */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-base font-display text-foreground">Треугольник месяца</h2>
        </div>
        <div className="flex flex-col items-center mb-4">
          <div className="flex flex-col items-center mb-3">
            <div className="w-20 h-20 rounded-xl bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="text-3xl font-display font-bold text-primary">{forecast.position3}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{a3?.name} — главный аркан</span>
          </div>
          <div className="w-28 h-6 relative mb-3">
            <div className="absolute left-1/2 top-0 w-px h-full bg-border -translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-1/2 h-px bg-border rotate-45 origin-left" />
            <div className="absolute right-0 bottom-0 w-1/2 h-px bg-border -rotate-45 origin-right" />
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
                <span className="text-xl font-display font-bold">{forecast.position1}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{a1?.name}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
                <span className="text-xl font-display font-bold">{forecast.position2}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{monthName}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          {forecast.position1} {a1?.name} + {forecast.position2} ({monthName}) = {forecast.position3} {a3?.name}
        </p>
      </div>

      {/* Скелетон */}
      {loading && !reading && (
        <div className="space-y-4 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="rounded-2xl border border-border p-6 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          ))}
        </div>
      )}

      {/* AI контент */}
      {reading && (
        <>
          <ProSectionBlock icon={BookOpen} title="Главная энергия месяца" variant="highlight">
            <ProTextBlock text={reading.mainEnergy} className="mb-4" />
            <ProTextBlock text={reading.generalForecast} />
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Влияние арканов">
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Аркан {forecast.position1} — фоновая энергия</h4>
                <ProTextBlock text={reading.arcana1influence} />
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Аркан {forecast.position2} — энергия месяца</h4>
                <ProTextBlock text={reading.arcana2influence} />
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Sparkles} title="Как проявится в жизни">
            <ProTextBlock text={reading.lifeManifest} />
          </ProSectionBlock>

          <ProSectionBlock icon={Briefcase} title="Деньги и работа">
            <ProTextBlock text={reading.money} />
          </ProSectionBlock>

          <ProSectionBlock icon={Heart} title="Отношения">
            <ProTextBlock text={reading.relationships} />
          </ProSectionBlock>

          <ProSectionBlock icon={Activity} title="Здоровье">
            <ProTextBlock text={reading.health} />
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={CheckCircle} title="Возможности месяца" variant="success">
              <ProTextBlock text={reading.opportunities} />
            </ProSectionBlock>
            <ProSectionBlock icon={AlertTriangle} title="Главный риск" variant="warning">
              <ProTextBlock text={reading.mainRisk} />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={MessageCircle} title="Рекомендации" variant="highlight">
            <ProTextBlock text={reading.recommendations} />
          </ProSectionBlock>
        </>
      )}
    </div>
  );
}
