import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Flag } from "lucide-react";
import { ForecastCard, ForecastMiniCard } from "./ForecastCard";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { MonthForecastAIBlocks } from "./MonthForecastAIBlocks";
import { MonthWeeksDates } from "./MonthWeeksDates";
import { MonthKeyDates } from "./MonthKeyDates";
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
  const a1 = getArcana(forecast.position1);
  const a2 = getArcana(forecast.position2);
  const a3 = getArcana(forecast.position3);
  const { reading, loading } = useMonthForecastAI(forecast, name);
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

      {/* 1. Расчёт месяца — матрица-треугольник в начале */}
      <ChapterBlock num={1} icon={Calendar} title="Расчёт месяца" subtitle="Треугольник трёх энергий">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <ForecastMiniCard value={forecast.position1} label="Энергия мес." />
          <span className="text-lg text-muted-foreground">+</span>
          <ForecastMiniCard value={forecast.position2} label="Аркан года" />
          <span className="text-lg text-muted-foreground">=</span>
          <ForecastMiniCard value={forecast.position3} label="Итог" highlight />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {forecast.position1} {a1?.name} + {forecast.position2} {a2?.name} = <span className="text-primary font-medium">{forecast.position3} {a3?.name}</span>
        </p>
      </ChapterBlock>

      {/* 2. Треугольник месяца — три аркана карточками */}
      <ChapterBlock num={2} title="Треугольник месяца" subtitle="Три энергии, через которые разворачивается месяц">
        <div className="space-y-3">
          <ForecastCard value={forecast.position1} positionTitle="Энергия месяца" contextText={reading?.arcana1influence} loading={loading || !reading} />
          <ForecastCard value={forecast.position2} positionTitle="Аркан года" contextText={reading?.arcana2influence} loading={loading || !reading} />
          <ForecastCard value={forecast.position3} positionTitle="Итоговый аркан месяца" highlight />
        </div>
      </ChapterBlock>

      {/* 3-13 — главная энергия, общий прогноз, глубокие разборы, синергия, сферы */}
      <MonthForecastAIBlocks reading={reading} loading={loading} />

      {/* 14-17 — недели, рекомендации, чего избегать, практика */}
      <MonthWeeksDates reading={reading} loading={loading} />

      {/* 18 — ключевые даты */}
      <MonthKeyDates reading={reading} keyDates={keyDates} monthName={monthName} consciousnessArcana={consciousness} />

      {/* 19 — итог месяца */}
      <ChapterBlock num={19} icon={Flag} title="Итог месяца" variant="highlight">
        {reading ? <ProTextBlock text={reading.conclusion} /> : <ChapterSkeleton lines={5} />}
      </ChapterBlock>

      <NadezhdaSignature />
    </div>
  );
}
