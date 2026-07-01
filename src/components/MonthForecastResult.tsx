import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flag } from "lucide-react";
import { ForecastCard, ForecastMiniCard } from "./ForecastCard";
import { ChapterBlock } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { MonthForecastAIBlocks } from "./MonthForecastAIBlocks";
import { MonthWeeksDates } from "./MonthWeeksDates";
import { MonthKeyDates } from "./MonthKeyDates";
import { LoadingScreen } from "./LoadingScreen";
import { NadezhdaSignature } from "./NadezhdaSignature";
import { useMonthForecastAI } from "@/hooks/useMonthForecastAI";
import { getMonthKeyDates, getConsciousnessArcana } from "@/lib/aiMonthForecastService";

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
  const monthName = MONTH_NAMES_RU[forecast.targetMonth] ?? String(forecast.targetMonth);
  const { reading } = useMonthForecastAI(forecast, name);
  const keyDates = getMonthKeyDates(forecast);
  const consciousness = getConsciousnessArcana(forecast.birthDate.day);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          Прогноз на месяц — {monthName} {forecast.targetYear}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground text-sm">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Матрица месяца — треугольник как везде */}
      <div className="gradient-card rounded-2xl p-5 border border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4 text-center">
          Матрица месяца · нажмите на карту
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-4 md:gap-6">
            <ForecastMiniCard value={forecast.position1} label="Энергия мес." />
            <ForecastMiniCard value={forecast.position2} label="Аркан года" />
          </div>
          <span className="text-muted-foreground text-xl leading-none">↓</span>
          <ForecastMiniCard value={forecast.position3} label="Итог месяца" highlight />
        </div>
      </div>

      {reading ? (
        <>
          {/* Треугольник месяца — три аркана карточками */}
          <ChapterBlock title="Треугольник месяца" subtitle="Три энергии, через которые разворачивается месяц">
            <div className="space-y-3">
              <ForecastCard value={forecast.position1} positionTitle="Энергия месяца" contextText={reading.arcana1influence} />
              <ForecastCard value={forecast.position2} positionTitle="Аркан года" contextText={reading.arcana2influence} />
              <ForecastCard value={forecast.position3} positionTitle="Итоговый аркан месяца" highlight />
            </div>
          </ChapterBlock>

          {/* Главная энергия, общий прогноз, глубокие разборы, синергия, сферы */}
          <MonthForecastAIBlocks reading={reading} a1={forecast.position1} a2={forecast.position2} a3={forecast.position3} />

          {/* 14-17 — недели, рекомендации, чего избегать, практика */}
          <MonthWeeksDates reading={reading} loading={false} />

          {/* 18 — ключевые даты */}
          <MonthKeyDates reading={reading} keyDates={keyDates} monthName={monthName} consciousnessArcana={consciousness} />

          {/* Итог месяца */}
          <ChapterBlock icon={Flag} title="Итог месяца" variant="highlight">
            <ProTextBlock text={reading.conclusion} />
          </ChapterBlock>
        </>
      ) : (
        <LoadingScreen methodId="month" />
      )}

      <NadezhdaSignature />
    </div>
  );
}
