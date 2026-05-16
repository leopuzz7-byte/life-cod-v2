import { useTranslation } from "react-i18next";
import { YearForecast, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Heart, Briefcase, Activity, AlertTriangle, Sparkles, CheckCircle, Target, Brain, Zap, ShieldAlert, Lightbulb, BookOpen, MessageCircle, Battery, BatteryWarning, Star, Clock } from "lucide-react";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { cn } from "@/lib/utils";
import { getYearProInterpretation } from "@/lib/proInterpretations";
import { generateDetailedMonthlyForecasts, generateYearPeriods, generateYearResources } from "@/lib/yearForecastDetailed";
import { getYearExtraSections } from "@/lib/yearForecastExtra";
import { ProSectionBlock, ProTextBlock, ProListBlock, ProNumberedList } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function YearForecastResult({ forecast, name, onReset, tier = 'basic' }: YearForecastResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const arcana = getArcana(forecast.arcana);
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const proData = isPro ? getYearProInterpretation(forecast.arcana) : null;
  const detailedMonths = isPro ? generateDetailedMonthlyForecasts(forecast.arcana, forecast.targetYear) : [];
  const yearPeriods = isPro ? generateYearPeriods(forecast.arcana, forecast.targetYear) : [];
  const yearResources = isPro ? generateYearResources(forecast.arcana) : null;
  const yearExtra = isPro ? getYearExtraSections(forecast.arcana) : null;

  const handleDownloadPDF = async () => {
    await generatePDF({
      title: t("forecast.yearForecast"),
      subtitle: `${forecast.targetYear} ${t("forecast.year")}`,
      birthDate: formatBirthDateForPDF(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year),
      name: name || undefined,
      sections: [
        { title: `${t("forecast.yourYearArcana")}: ${arcana?.name || forecast.arcana}`, content: arcana?.yearForecast || "", highlight: true },
        { title: t("forecast.arcanaDetails"), content: [`${t("forecast.planet")}: ${arcana?.planet || "-"}`, `${t("forecast.element")}: ${arcana?.element || "-"}`] },
        { title: t("forecast.recommendations"), content: arcana?.personalDescription || "" },
      ],
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
          {t("forecast.yearForecast")} {t("forecast.forYear", { year: forecast.targetYear })}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{t("forecast.for")} {name}</p>}
        <p className="text-muted-foreground">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Main arcana card */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">{t("forecast.yourYearArcana")}: {arcana?.name}</h2>
        </div>
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-5xl font-display font-bold text-primary">{forecast.arcana}</span>
          </div>
        </div>
        <div className="p-4 bg-muted/30 rounded-xl mb-4">
          <p className="text-sm text-muted-foreground">
            <strong>Планета:</strong> {arcana?.planet || "—"} · <strong>Стихия:</strong> {arcana?.element || "—"}
          </p>
        </div>
        <ArcanaCard number={forecast.arcana} showYearForecast={true} compact={false} />
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <>
          {/* 1. ВВОДНЫЙ БЛОК */}
          <ProSectionBlock icon={BookOpen} title="Введение в ваш год" variant="highlight">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-sm font-medium text-foreground mb-2">Основная энергия года</h4>
              <ProTextBlock text={proData.mainEnergy} />
            </div>
          </ProSectionBlock>

          {/* 2. ОСНОВНОЙ РАЗБОР */}
          <ProSectionBlock icon={Target} title="Глубокий разбор аркана года">
            <ProTextBlock text={proData.overview} className="mb-4" />
            <ProTextBlock text={proData.deepMeaning} className="mb-4" />
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Сильные стороны года
                </h4>
                <ProListBlock items={proData.strengths} icon="✦" />
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-destructive" /> Слабые стороны года
                </h4>
                <ProListBlock items={proData.weaknesses} icon="⚠" />
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Искажения энергии</h4>
              <ProTextBlock text={proData.distortions} />
            </div>
            
            <div className="bg-accent/20 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Как проявляется в жизни</h4>
              <ProTextBlock text={proData.lifeExamples} />
            </div>
          </ProSectionBlock>

          {/* 3. РАЗБОР ПО СФЕРАМ ЖИЗНИ */}
          <ProSectionBlock icon={Briefcase} title="💰 Деньги и финансы">
            <ProTextBlock text={proData.money} className="mb-4" />
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                <h5 className="text-xs font-medium text-destructive mb-1">Риски</h5>
                <p className="text-xs text-muted-foreground">{proData.moneyRisks}</p>
              </div>
              <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                <h5 className="text-xs font-medium text-emerald-600 mb-1">Возможности</h5>
                <p className="text-xs text-muted-foreground">{proData.moneyOpportunities}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.moneyRecommendations}</p>
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Briefcase} title="💼 Работа и реализация">
            <ProTextBlock text={proData.career} className="mb-4" />
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                <h5 className="text-xs font-medium text-destructive mb-1">Риски</h5>
                <p className="text-xs text-muted-foreground">{proData.careerRisks}</p>
              </div>
              <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                <h5 className="text-xs font-medium text-emerald-600 mb-1">Возможности</h5>
                <p className="text-xs text-muted-foreground">{proData.careerOpportunities}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.careerRecommendations}</p>
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Heart} title="❤️ Отношения">
            <ProTextBlock text={proData.relationships} className="mb-4" />
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                <h5 className="text-xs font-medium text-destructive mb-1">Риски</h5>
                <p className="text-xs text-muted-foreground">{proData.relationshipsRisks}</p>
              </div>
              <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                <h5 className="text-xs font-medium text-emerald-600 mb-1">Возможности</h5>
                <p className="text-xs text-muted-foreground">{proData.relationshipsOpportunities}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.relationshipsRecommendations}</p>
              </div>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Activity} title="🏥 Здоровье">
              <ProTextBlock text={proData.health} className="mb-3" />
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10 mb-2">
                <h5 className="text-xs font-medium text-destructive mb-1">Риски</h5>
                <p className="text-xs text-muted-foreground">{proData.healthRisks}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.healthRecommendations}</p>
              </div>
            </ProSectionBlock>

            <ProSectionBlock icon={Brain} title="🧠 Внутреннее состояние">
              <ProTextBlock text={proData.innerState} className="mb-3" />
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.innerStateRecommendations}</p>
              </div>
            </ProSectionBlock>
          </div>

          {/* 4. СВЯЗКИ И ВЗАИМОДЕЙСТВИЕ */}
          <ProSectionBlock icon={Zap} title="Энергетические взаимодействия">
            <ProTextBlock text={proData.energyInteractions} />
          </ProSectionBlock>

          {/* 5. ДОПОЛНИТЕЛЬНАЯ МЕТОДИКА */}
          <ProSectionBlock icon={BookOpen} title="Дополнительная методика (система Капустина)" variant="highlight">
            <ProTextBlock text={proData.additionalInsight} />
          </ProSectionBlock>

          {/* ===== ПОДРОБНЫЙ ПОМЕСЯЧНЫЙ ПРОГНОЗ ===== */}
          <ProSectionBlock icon={Calendar} title="📅 Подробный прогноз по месяцам" variant="highlight">
            <p className="text-sm text-muted-foreground mb-6">
              Ниже — детальный разбор каждого месяца {forecast.targetYear} года. Каждый месяц имеет свою энергию, тему и рекомендации.
            </p>
            <div className="space-y-6">
              {detailedMonths.map((m) => (
                <div key={m.month} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-display font-semibold text-foreground">
                        {m.name} {forecast.targetYear}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Аркан месяца: {m.arcanaInfluence} · Планета: {m.planet}
                      </p>
                    </div>
                    <div className="bg-primary/20 text-primary text-xs font-medium px-2 py-1 rounded-md">
                      «{m.theme}»
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <ProTextBlock text={m.description} />
                    
                    <div className="bg-muted/30 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-foreground mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> На что обратить внимание
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.attention}</p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-3">
                      <h5 className="text-xs font-medium text-primary mb-1 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" /> Рекомендации
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed">{m.recommendations}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProSectionBlock>

          {/* ===== ПЕРИОДЫ ВНУТРИ ГОДА ===== */}
          <ProSectionBlock icon={Clock} title="📊 Периоды внутри года">
            <p className="text-sm text-muted-foreground mb-4">
              Год разделён на четыре ключевых периода, каждый со своей энергией и задачами.
            </p>
            <div className="space-y-4">
              {yearPeriods.map((period, i) => (
                <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-sm font-semibold text-foreground">{period.title}</h4>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{period.dateRange}</span>
                  </div>
                  <ProTextBlock text={period.description} />
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                      <h5 className="text-xs font-medium text-destructive mb-1">Риски периода</h5>
                      <p className="text-xs text-muted-foreground">{period.risks}</p>
                    </div>
                    <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                      <h5 className="text-xs font-medium text-emerald-600 mb-1">Возможности</h5>
                      <p className="text-xs text-muted-foreground">{period.opportunities}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProSectionBlock>

          {/* ===== РЕСУРСЫ ГОДА ===== */}
          {yearResources && (
            <>
              <ProSectionBlock icon={Battery} title="⚡ Что даёт энергию в этом году" variant="success">
                <ProListBlock items={yearResources.givesEnergy} icon="✦" />
              </ProSectionBlock>

              <ProSectionBlock icon={BatteryWarning} title="🔻 Что забирает энергию" variant="warning">
                <ProListBlock items={yearResources.takesEnergy} icon="⚠" />
              </ProSectionBlock>

              <ProSectionBlock icon={Star} title="🌟 Таланты и возможности года" variant="success">
                <ProListBlock items={yearResources.talents} icon="★" />
              </ProSectionBlock>
            </>
          )}

          {/* ===== EXTRA: HEALING THEMES, BIRTHDAY RITUAL, MAIN EXAM, YEAR TASKS ===== */}
          {yearExtra && (
            <>
              <ProSectionBlock icon={Lightbulb} title="🩹 Исцеляющие темы года" variant="highlight">
                <p className="text-sm text-muted-foreground mb-4">
                  Темы, которые год приглашает вас проработать для глубинного исцеления.
                </p>
                <ProListBlock items={yearExtra.healingThemes} icon="💚" />
              </ProSectionBlock>

              <ProSectionBlock icon={Sparkles} title="🎂 Ритуал дня рождения">
                <p className="text-sm text-muted-foreground mb-4">
                  Практики для входа в новый годовой цикл с максимальной осознанностью.
                </p>
                <ProNumberedList items={yearExtra.birthdayRitual} />
              </ProSectionBlock>

              <ProSectionBlock icon={Target} title="📋 Главный экзамен года" variant="warning">
                <div className="bg-muted/30 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Ключевой вопрос:</h4>
                  <p className="text-sm text-primary font-medium italic">«{yearExtra.mainExam.question}»</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-emerald-600 mb-3 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Положительные проявления
                    </h4>
                    <ProListBlock items={yearExtra.mainExam.plusAnswers} icon="✦" />
                  </div>
                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-destructive mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Отрицательные проявления
                    </h4>
                    <ProListBlock items={yearExtra.mainExam.minusAnswers} icon="⚠" />
                  </div>
                </div>
              </ProSectionBlock>

              <ProSectionBlock icon={BookOpen} title="📝 Задачи года" variant="success">
                <ProNumberedList items={yearExtra.yearTasks} />
              </ProSectionBlock>

              {yearExtra.lifeSphereThemes.length > 0 && (
                <ProSectionBlock icon={Heart} title="💡 Тематики сфер жизни">
                  <ProListBlock items={yearExtra.lifeSphereThemes} icon="→" />
                </ProSectionBlock>
              )}
            </>
          )}

          {/* 6. РИСКИ */}
          <ProSectionBlock icon={ShieldAlert} title="Риски года" variant="warning">
            <ProListBlock items={proData.risks} icon="⚠" className="mb-4" />
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Повторяющиеся паттерны</h4>
              <ProTextBlock text={proData.repeatingPatterns} />
            </div>
          </ProSectionBlock>

          {/* 7. ВОЗМОЖНОСТИ */}
          <ProSectionBlock icon={Sparkles} title="Возможности года" variant="success">
            <ProListBlock items={proData.opportunities} icon="★" />
          </ProSectionBlock>

          {/* 8. РЕКОМЕНДАЦИИ */}
          <ProSectionBlock icon={CheckCircle} title="Рекомендации" variant="highlight">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProNumberedList items={proData.recommendations} className="mb-6" />
            
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.whatToAvoid} icon="✗" />
          </ProSectionBlock>

          {/* 9. ИТОГ */}
          <ProSectionBlock icon={MessageCircle} title="Итог" variant="highlight">
            <ProTextBlock text={proData.conclusion} className="mb-4" />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <h4 className="text-xs font-medium text-primary mb-1">Ключевая мысль</h4>
                <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <h4 className="text-xs font-medium text-primary mb-1">Главный вектор</h4>
                <p className="text-sm text-foreground font-medium">{proData.mainVector}</p>
              </div>
            </div>
          </ProSectionBlock>
        </>
      )}

      {/* Basic tier upsell */}
      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: глубокий анализ аркана года, подробный разбор по всем сферам жизни 
            (деньги, карьера, отношения, здоровье, внутреннее состояние), детальный помесячный прогноз на 12 месяцев,
            периоды внутри года, ресурсы и энергия, риски и возможности, 
            связки энергий, дополнительная методика и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}
