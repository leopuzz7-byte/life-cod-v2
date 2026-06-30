import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Briefcase, Activity, AlertTriangle, CheckCircle, Sparkles, BookOpen, MessageCircle } from "lucide-react";
import { ForecastCard, ForecastMiniCard } from "./ForecastCard";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
import { NadezhdaSignature } from "./NadezhdaSignature";
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
  const a2 = getArcana(forecast.position2);
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

      {/* Треугольник — расчёт */}
      <div className="gradient-card rounded-2xl p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Расчёт треугольника</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ForecastMiniCard value={forecast.position1} label="Энергия мес." />
          <span className="text-sm text-muted-foreground">+</span>
          <ForecastMiniCard value={forecast.position2} label="Аркан года" />
          <span className="text-sm text-muted-foreground">=</span>
          <ForecastMiniCard value={forecast.position3} label="Итог" />
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {forecast.position1} {a1?.name} + {forecast.position2} {a2?.name} = {forecast.position3} {a3?.name}
        </p>
      </div>

      {/* 3 аркана треугольника */}
      <ForecastCard
        value={forecast.position1}
        positionTitle="Энергия месяца"
        contextText={reading?.arcana1influence}
        loading={loading}
      />
      <ForecastCard
        value={forecast.position2}
        positionTitle="Аркан года"
        contextText={reading?.arcana2influence}
        loading={loading}
      />
      <ForecastCard
        value={forecast.position3}
        positionTitle="Итоговый аркан месяца"
        contextText={reading?.mainEnergy}
        loading={loading}
        highlight={true}
      />

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
          <ProSectionBlock icon={BookOpen} title="Прогноз месяца" variant="highlight">
            <ProTextBlock text={reading.generalForecast} />
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

      <NadezhdaSignature />
    </div>
  );
}
