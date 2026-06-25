import { useTranslation } from "react-i18next";
import { YearForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Heart, Briefcase, Activity, AlertTriangle, Sparkles, CheckCircle, Target, ShieldAlert, BookOpen, MessageCircle } from "lucide-react";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
import { useYearForecastAI } from "@/hooks/useYearForecastAI";

interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
  tier?: string;
}

export function YearForecastResult({ forecast, name, onReset }: YearForecastResultProps) {
  const { t } = useTranslation();
  const arcana = getArcana(forecast.arcana);
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const { reading, loading } = useYearForecastAI(forecast, name);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.yearForecast")} {forecast.targetYear}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground text-sm">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Главный аркан */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30 text-center">
        <Calendar className="w-6 h-6 text-primary mx-auto mb-3" />
        <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-5xl font-display font-bold text-primary">{forecast.arcana}</span>
        </div>
        <h2 className="text-xl font-display text-foreground mb-1">{arcana?.name}</h2>
        <p className="text-sm text-muted-foreground">{arcana?.planet} · {arcana?.element}</p>
      </div>

      {/* Скелетон */}
      {loading && !reading && (
        <div className="space-y-4 animate-pulse">
          {[1,2,3,4,5].map(i => (
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
          <ProSectionBlock icon={BookOpen} title="Главная энергия года" variant="highlight">
            <ProTextBlock text={reading.arcanaOverview} className="mb-4" />
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-emerald-600 mb-2">Сильные стороны</h4>
                <ProTextBlock text={reading.arcanaStrengths} />
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-destructive mb-2">Слабые стороны</h4>
                <ProTextBlock text={reading.arcanaWeaknesses} />
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Введение в ваш год">
            <ProTextBlock text={reading.intro} />
          </ProSectionBlock>

          <ProSectionBlock icon={TrendingUp} title="Атмосфера года">
            <ProTextBlock text={reading.atmosphere} />
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
            <ProSectionBlock icon={Sparkles} title="Возможности года" variant="success">
              <ProTextBlock text={reading.opportunities} />
            </ProSectionBlock>
            <ProSectionBlock icon={ShieldAlert} title="Риски года" variant="warning">
              <ProTextBlock text={reading.risks} />
            </ProSectionBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={CheckCircle} title="Как проявляется в плюсе" variant="success">
              <ProTextBlock text={reading.plusManifest} />
            </ProSectionBlock>
            <ProSectionBlock icon={AlertTriangle} title="Как проявляется в минусе" variant="warning">
              <ProTextBlock text={reading.minusManifest} />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={CheckCircle} title="Практические рекомендации" variant="highlight">
            <ProTextBlock text={reading.recommendations} />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог года" variant="highlight">
            <ProTextBlock text={reading.conclusion} />
          </ProSectionBlock>

          {/* По месяцам */}
          <ProSectionBlock icon={Calendar} title={`Прогноз на каждый месяц ${forecast.targetYear}`} variant="highlight">
            <div className="space-y-3">
              {reading.months.map(m => (
                <div key={m.monthNum} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-primary/10 px-4 py-2 flex items-center gap-3 flex-wrap">
                    <span className="font-display text-sm font-semibold text-foreground">{m.monthName}</span>
                    <span className="text-xs text-muted-foreground">{m.pos1} {m.pos1Name} - {m.pos2} мес. - <span className="text-primary font-medium">{m.pos3} {m.pos3Name}</span></span>
                  </div>
                  <div className="p-4 space-y-2">
                    <ProTextBlock text={m.forecast} />
                    <div className="bg-primary/5 rounded-lg px-3 py-2">
                      <p className="text-xs text-primary font-medium">{m.keyTip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProSectionBlock>
        </>
      )}
    </div>
  );
}
