import { useTranslation } from "react-i18next";
import { MonthForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, Briefcase, Activity, Brain, AlertTriangle, CheckCircle, Target, Sparkles, Clock, BookOpen, MessageCircle } from "lucide-react";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { cn } from "@/lib/utils";
import { generateMonthProInterpretation } from "@/lib/proMonthForecast";
import { ProSectionBlock, ProTextBlock, ProListBlock, ProNumberedList } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface MonthForecastResultProps {
  forecast: MonthForecast;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function MonthForecastResult({ forecast, name, onReset, tier = 'basic' }: MonthForecastResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const monthName = t(`forecast.months.${forecast.targetMonth}`);
  const arcana1 = getArcana(forecast.position1);
  const arcana2 = getArcana(forecast.position2);
  const arcana3 = getArcana(forecast.position3);
  const proData = isPro ? generateMonthProInterpretation(forecast.position1, forecast.position2, forecast.position3, monthName, forecast.targetYear) : null;

  const handleDownloadPDF = async () => {
    await generatePDF({
      title: t("forecast.monthForecast"),
      subtitle: `${monthName} ${forecast.targetYear}`,
      birthDate: formatBirthDateForPDF(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year),
      name: name || undefined,
      sections: [
        {
          title: t("forecast.monthTriangle"),
          content: [
            `${arcana1?.name || forecast.position1} (${forecast.position1}) — ${t("forecast.yearEnergyBackground")}`,
            `${arcana2?.name || forecast.position2} (${forecast.position2}) — ${t("forecast.monthEnergy")}`,
            `${arcana3?.name || forecast.position3} (${forecast.position3}) — ${t("forecast.monthResultEnergy")}`,
          ],
          highlight: true,
        },
        {
          title: `${t("forecast.mainMonthArcana")}: ${forecast.position3} — ${arcana3?.name}`,
          content: [arcana3 ? `${arcana3.planet} • ${arcana3.element}` : "", "", arcana3?.monthForecast || arcana3?.yearForecast || ""],
        },
      ],
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onReset}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "✦ Профессиональный разбор" : "Базовый разбор"}
        </span>
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          {t("forecast.monthForecast")} — {monthName} {forecast.targetYear}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{t("forecast.for")} {name}</p>}
        <p className="text-muted-foreground">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Triangle visualization */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">{t("forecast.monthTriangle")}</h2>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary">
              <span className="text-3xl font-display font-bold text-primary">{forecast.position3}</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{t("forecast.monthResult")}</span>
          </div>
          <div className="w-32 h-8 relative">
            <div className="absolute left-1/2 top-0 w-px h-full bg-border transform -translate-x-1/2" />
            <div className="absolute left-0 bottom-0 w-1/2 h-px bg-border transform rotate-45 origin-left" />
            <div className="absolute right-0 bottom-0 w-1/2 h-px bg-border transform -rotate-45 origin-right" />
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <span className="text-2xl font-display font-bold text-foreground">{forecast.position1}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{t("forecast.yearArcana")}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center border border-border">
                <span className="text-2xl font-display font-bold text-foreground">{forecast.position2}</span>
              </div>
              <span className="text-xs text-muted-foreground mt-1">{t("forecast.monthNum")} ({forecast.targetMonth})</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-2">{t("forecast.howToRead")}:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>{arcana1?.name}</strong> ({forecast.position1}) — {t("forecast.yearEnergyBackground")}</li>
              <li>• <strong>{arcana2?.name}</strong> ({forecast.position2}) — {t("forecast.monthEnergy")}</li>
              <li>• <strong>{arcana3?.name}</strong> ({forecast.position3}) — {t("forecast.monthResultEnergy")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full detailed arcana cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-display text-foreground">{t("forecast.mainMonthArcana")}</h2>
        <ArcanaCard number={forecast.position3} showMonthForecast={true} compact={false} />
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-display text-foreground">{t("forecast.influencingEnergies")}</h2>
        <div className="grid gap-4">
          <ArcanaCard number={forecast.position1} positionTitle={t("forecast.yearEnergyTitle")} showMonthForecast={true} compact={true} />
          <ArcanaCard number={forecast.position2} positionTitle={`${t("forecast.energyOf")} ${monthName}`} showMonthForecast={true} compact={true} />
        </div>
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <>
          <ProSectionBlock icon={BookOpen} title="Глубокий анализ энергий месяца" variant="highlight">
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Фоновая энергия года</h4>
                <ProTextBlock text={proData.yearEnergyAnalysis} />
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">Энергия месяца</h4>
                <ProTextBlock text={proData.monthEnergyAnalysis} />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-sm font-medium text-foreground mb-2">Результирующая энергия</h4>
                <ProTextBlock text={proData.resultEnergyAnalysis} />
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Синергия и конфликты энергий">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                <h4 className="text-sm font-medium text-emerald-600 mb-2">Синергия</h4>
                <ProTextBlock text={proData.synergy} />
              </div>
              <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
                <h4 className="text-sm font-medium text-destructive mb-2">Конфликт</h4>
                <ProTextBlock text={proData.conflicts} />
              </div>
            </div>
          </ProSectionBlock>

          {/* Life spheres */}
          <ProSectionBlock icon={Briefcase} title="💰 Деньги и финансы">
            <ProTextBlock text={proData.money} />
          </ProSectionBlock>

          <ProSectionBlock icon={Briefcase} title="💼 Карьера и работа">
            <ProTextBlock text={proData.career} />
          </ProSectionBlock>

          <ProSectionBlock icon={Heart} title="❤️ Отношения">
            <ProTextBlock text={proData.relationships} />
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Activity} title="🏥 Здоровье">
              <ProTextBlock text={proData.health} />
            </ProSectionBlock>
            <ProSectionBlock icon={Brain} title="🧠 Внутреннее состояние">
              <ProTextBlock text={proData.innerState} />
            </ProSectionBlock>
          </div>

          {/* Weekly breakdown */}
          <ProSectionBlock icon={Clock} title="📅 Понедельный прогноз" variant="highlight">
            <div className="space-y-4">
              {[
                { title: "1-я неделя", text: proData.firstWeek },
                { title: "2-я неделя", text: proData.secondWeek },
                { title: "3-я неделя", text: proData.thirdWeek },
                { title: "4-я неделя", text: proData.fourthWeek },
              ].map((week, i) => (
                <div key={i} className="border border-border rounded-xl p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">{week.title}</h4>
                  <ProTextBlock text={week.text} />
                </div>
              ))}
            </div>
          </ProSectionBlock>

          {/* Recommendations */}
          <ProSectionBlock icon={CheckCircle} title="Рекомендации" variant="success">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProNumberedList items={proData.toDo} className="mb-6" />
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.toAvoid} icon="✗" />
          </ProSectionBlock>

          <ProSectionBlock icon={Sparkles} title="Ежедневная практика">
            <ProTextBlock text={proData.dailyPractice} className="mb-4" />
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Ключевые дни</h4>
              <ProTextBlock text={proData.keyDays} />
            </div>
          </ProSectionBlock>

          {/* Summary */}
          <ProSectionBlock icon={MessageCircle} title="Итог месяца" variant="highlight">
            <ProTextBlock text={proData.mainMessage} />
          </ProSectionBlock>
        </>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: глубокий анализ всех трёх энергий треугольника, разбор по сферам жизни,
            понедельный прогноз, синергия и конфликты энергий, ежедневные практики и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}
