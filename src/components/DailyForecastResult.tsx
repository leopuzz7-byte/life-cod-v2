import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { ArrowLeft, BookOpen, Target, Briefcase, Heart, Activity, AlertTriangle, CheckCircle, Sparkles, MessageCircle } from "lucide-react";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
import { ForecastCard } from "./ForecastCard";
import { DayMatrixGrid } from "./DayMatrixGrid";
import { NadezhdaSignature } from "./NadezhdaSignature";
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
  const { reading, loading } = useDayForecastAI(result, name);

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

      {/* Матрица дня — сетка карт */}
      <DayMatrixGrid positions={positions} />

      {/* 12 позиций — фото карт с AI разбором */}
      <div className="space-y-3">
        <h2 className="text-base font-display text-foreground px-1">Разбор позиций</h2>
        {positions.map((pos) => (
          <ForecastCard
            key={pos.position}
            value={pos.arcana}
            position={pos.position}
            positionTitle={POS_TITLES[pos.position]}
            contextText={reading?.positions[String(pos.position)]}
            loading={loading}
            highlight={pos.position === 6 || pos.position === 12}
          />
        ))}
      </div>

      {/* Скелетон */}
      {loading && !reading && (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(i => (
            <div key={i} className="rounded-2xl border border-border p-6 space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          ))}
        </div>
      )}

      {/* AI контент */}
      {reading && (
        <>
          <ProSectionBlock icon={BookOpen} title="Глубокий разбор дня" variant="highlight">
            <ProTextBlock text={reading.deepAnalysis} />
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Стратегия дня">
            <div className="space-y-3">
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌅 Утро</h4>
                <ProTextBlock text={reading.morning} />
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">☀️ День</h4>
                <ProTextBlock text={reading.afternoon} />
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌙 Вечер</h4>
                <ProTextBlock text={reading.evening} />
              </div>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Briefcase} title="Деньги">
              <ProTextBlock text={reading.money} />
            </ProSectionBlock>
            <ProSectionBlock icon={Briefcase} title="Карьера">
              <ProTextBlock text={reading.career} />
            </ProSectionBlock>
            <ProSectionBlock icon={Heart} title="Отношения">
              <ProTextBlock text={reading.relationships} />
            </ProSectionBlock>
            <ProSectionBlock icon={Activity} title="Здоровье">
              <ProTextBlock text={reading.health} />
            </ProSectionBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={AlertTriangle} title="Риски дня" variant="warning">
              <ProTextBlock text={reading.risks} />
            </ProSectionBlock>
            <ProSectionBlock icon={CheckCircle} title="Возможности дня" variant="success">
              <ProTextBlock text={reading.opportunities} />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={Sparkles} title="Практика дня">
            <ProTextBlock text={reading.practice} />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог дня" variant="highlight">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium italic">«{reading.conclusion}»</p>
            </div>
          </ProSectionBlock>
        </>
      )}

      <NadezhdaSignature />
    </div>
  );
}
