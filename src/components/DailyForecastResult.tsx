import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { ArrowLeft } from "lucide-react";
import { ForecastCard } from "./ForecastCard";
import { DayMatrixGrid } from "./DayMatrixGrid";
import { NadezhdaSignature } from "./NadezhdaSignature";
import { DayForecastAIBlocks } from "./DayForecastAIBlocks";
import { LoadingScreen } from "./LoadingScreen";
import { useDayForecastAI } from "@/hooks/useDayForecastAI";

interface Props {
  result: DailyForecastType;
  name: string;
  onReset: () => void;
  tier?: string;
}

const POS_TITLES: Record<number, string> = {
  1:'Утро / Старт дня', 2:'Потенциал дня', 3:'Самооценка', 4:'Цель дня',
  5:'Главный ресурс', 6:'Основа дня', 7:'Главная задача', 8:'Способ решения',
  9:'Итог дня', 10:'Подсознательные процессы', 11:'Внешнее влияние', 12:'Кармическая задача дня',
};

export function DailyForecastResultComponent({ result, name, onReset }: Props) {
  const { t } = useTranslation();
  const { targetDate, positions } = result;
  const dateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;
  const { reading } = useDayForecastAI(result, name);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("methods.dayForecast")}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground text-sm">Дата: {dateStr}</p>
      </div>

      {/* Матрица дня — сетка карт (без ИИ, показывается сразу) */}
      <DayMatrixGrid positions={positions} />

      {reading ? (
        <>
          {/* 12 позиций — фото карт с AI разбором */}
          <div className="space-y-3">
            <h2 className="text-base font-display text-foreground px-1">Разбор позиций</h2>
            {positions.map((pos) => (
              <ForecastCard
                key={pos.position}
                value={pos.arcana}
                position={pos.position}
                positionTitle={POS_TITLES[pos.position]}
                contextText={reading.positions[String(pos.position)]}
                highlight={pos.position === 6 || pos.position === 12}
              />
            ))}
          </div>

          <DayForecastAIBlocks reading={reading} loading={false} />
        </>
      ) : (
        <LoadingScreen methodId="day" />
      )}

      <NadezhdaSignature />
    </div>
  );
}
