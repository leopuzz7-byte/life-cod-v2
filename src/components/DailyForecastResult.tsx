import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, BookOpen, Target, Briefcase, Heart, Activity, AlertTriangle, CheckCircle, Sparkles, MessageCircle, Sun } from "lucide-react";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
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
  9:'Результат', 10:'Подсознательные процессы', 11:'Внешнее влияние', 12:'Кармическая задача дня',
};

export function DailyForecastResultComponent({ result, name, onReset }: Props) {
  const { t } = useTranslation();
  const { targetDate, positions } = result;
  const dateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;
  const { reading, loading } = useDayForecastAI(result, name);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onReset} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-display text-primary mb-1">{t("forecast.dayForecast")}</h2>
        <p className="text-muted-foreground text-sm">
          {name ? `${name}, ` : ''}Дата: {dateStr}
        </p>
      </div>

      {/* Матрица дня — 12 позиций */}
      <div className="gradient-card rounded-2xl p-6 border border-border mb-6">
        <h3 className="text-base font-display text-foreground mb-4">Матрица дня</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {positions.map((pos) => {
            const arcanaData = getArcana(pos.arcana);
            return (
              <div key={pos.position} className="bg-muted/30 rounded-xl p-3 border border-border">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{pos.arcana}</span>
                  <span className="text-xs text-muted-foreground">{POS_TITLES[pos.position]}</span>
                </div>
                <p className="text-xs font-medium text-foreground">{arcanaData?.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Скелетон */}
      {loading && !reading && (
        <div className="space-y-4 animate-pulse">
          {[1,2,3,4,5].map(i => (
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
        <div className="space-y-6">
          <ProSectionBlock icon={BookOpen} title="Глубокий разбор дня" variant="highlight">
            <ProTextBlock text={reading.deepAnalysis} />
          </ProSectionBlock>

          {/* Стратегия дня */}
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

          {/* Разбор по позициям */}
          <ProSectionBlock icon={Sun} title="Разбор каждой позиции">
            <div className="space-y-3">
              {positions.map((pos) => {
                const posText = reading.positions[String(pos.position)];
                if (!posText) return null;
                return (
                  <div key={pos.position} className="border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{pos.arcana}</span>
                      <span className="text-sm font-medium text-foreground">{POS_TITLES[pos.position]}</span>
                    </div>
                    <ProTextBlock text={posText} />
                  </div>
                );
              })}
            </div>
          </ProSectionBlock>

          {/* Сферы */}
          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Briefcase} title="💰 Деньги">
              <ProTextBlock text={reading.money} />
            </ProSectionBlock>
            <ProSectionBlock icon={Briefcase} title="💼 Карьера">
              <ProTextBlock text={reading.career} />
            </ProSectionBlock>
            <ProSectionBlock icon={Heart} title="❤️ Отношения">
              <ProTextBlock text={reading.relationships} />
            </ProSectionBlock>
            <ProSectionBlock icon={Activity} title="🏥 Здоровье">
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
        </div>
      )}
    </div>
  );
}
