import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { 
  calculatePinnacles, 
  calculateMonthlyForecast,
  calculatePersonalYear,
  getIntegratedYearAnalysis,
  pinnacleDescriptions,
  challengeDescriptions,
  PinnaclesAnalysis,
  MonthlyForecastResult,
  IntegratedYearAnalysis,
} from "@/lib/lifecod";
import { analyzePersonLifeCod, calculateLifeCodSingle } from "@/lib/lifecod/calculations";
import { PersonAnalysisCard } from "./PersonAnalysisCard";
import { ArrowLeft, Mountain, AlertTriangle, Shield, Calendar, TrendingUp, TrendingDown, Flame, Snowflake, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import { generateLifeCodPersonalPDF } from "@/lib/lifecod/pdfExport";

interface LifeCodPersonalResultProps {
  name: string;
  day: number;
  month: number;
  year: number;
  onReset: () => void;
}

export function LifeCodPersonalResult({ name, day, month, year, onReset }: LifeCodPersonalResultProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'pinnacles' | 'challenges' | 'monthly' | 'years'>('overview');
  
  const person = analyzePersonLifeCod(name, day, month, year);
  const single = calculateLifeCodSingle(name, day, month, year);
  const pinnaclesData = calculatePinnacles(day, month, year);
  const monthlyData = calculateMonthlyForecast(day);
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - year;
  
  // Интегрированный анализ на 4 года
  const integratedYears: IntegratedYearAnalysis[] = [];
  for (let i = 0; i < 4; i++) {
    const ty = currentYear + i;
    const py = calculatePersonalYear(day, month, ty);
    integratedYears.push(getIntegratedYearAnalysis(
      pinnaclesData.pinnacles, pinnaclesData.challenges, year, ty, py
    ));
  }

  const tabs = [
    { id: 'overview' as const, label: 'Обзор', icon: Activity },
    { id: 'pinnacles' as const, label: 'Пиннакли', icon: Mountain },
    { id: 'challenges' as const, label: 'Уроки', icon: Shield },
    { id: 'monthly' as const, label: 'Месяцы', icon: Calendar },
    { id: 'years' as const, label: 'Прогноз', icon: TrendingUp },
  ];

  const crisisColors = {
    0: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400',
    1: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400',
    2: 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-950 dark:text-orange-400',
    3: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400',
  };

  const riskLevelColors = {
    resource: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-400',
    neutral: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400',
    risk: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-400',
  };

  const riskLevelLabels = { resource: 'Ресурсный', neutral: 'Нейтральный', risk: 'Повышенный риск' };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Персональный разбор</h1>
          <p className="text-muted-foreground">{name} • {day}.{String(month).padStart(2, '0')}.{year}</p>
        </div>
        <div className="flex items-center gap-2">
          <PDFDownloadButton
            onDownload={() => generateLifeCodPersonalPDF(name, day, month, year, 'basic')}
            label="PDF Basic"
          />
          <PDFDownloadButton
            onDownload={() => generateLifeCodPersonalPDF(name, day, month, year, 'full')}
            label="PDF Full"
          />
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Назад
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <PersonAnalysisCard person={person} showFull />
          
          {/* Current state */}
          {integratedYears[0] && (
            <div className={cn("rounded-xl border-2 p-4 md:p-6 space-y-3", crisisColors[integratedYears[0].crisisLevel.level])}>
              <h3 className="font-display font-semibold text-lg">Текущее состояние ({currentYear})</h3>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-xs opacity-70">Пиннакль</p>
                  <p className="font-bold text-lg">{integratedYears[0].activePinnacle.value}</p>
                  <p className="text-xs">{pinnacleDescriptions[integratedYears[0].activePinnacle.value]?.name}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Challenge</p>
                  <p className="font-bold text-lg">{integratedYears[0].activeChallenge.value}</p>
                  <p className="text-xs">{challengeDescriptions[integratedYears[0].activeChallenge.value]?.name}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Личный год</p>
                  <p className="font-bold text-lg">{integratedYears[0].personalYear}</p>
                </div>
              </div>
              <p className="text-sm font-medium">{integratedYears[0].crisisLevel.label}: {integratedYears[0].crisisLevel.description}</p>
              <p className="text-sm">{integratedYears[0].recommendation}</p>
            </div>
          )}

          {/* Monthly summary */}
          <div className="bg-card rounded-xl border p-4 md:p-6">
            <h3 className="font-display font-semibold text-lg mb-3">Карта года по месяцам</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {monthlyData.months.map(m => (
                <div key={m.month} className={cn("rounded-lg border p-2 text-center text-xs", riskLevelColors[m.riskLevel])}>
                  <p className="font-medium">{m.monthName.slice(0, 3)}</p>
                  <p className="text-[10px] opacity-70">{riskLevelLabels[m.riskLevel]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pinnacles */}
      {activeTab === 'pinnacles' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4">
            <h3 className="font-display font-semibold mb-2">Шаги расчёта</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>День: {pinnaclesData.steps.dayCore}</p>
              <p>Месяц: {pinnaclesData.steps.monthCore}</p>
              <p>Год: {pinnaclesData.steps.yearCore}</p>
              <p>Life Path: {pinnaclesData.steps.lifePath}</p>
              <p>Граница P1: {pinnaclesData.steps.timing}</p>
            </div>
          </div>

          {pinnaclesData.pinnacles.map((p, i) => {
            const desc = pinnacleDescriptions[p.value];
            const isActive = i === integratedYears[0]?.activePinnacleIndex;
            return (
              <div key={i} className={cn(
                "rounded-xl border-2 p-4 md:p-6 space-y-3",
                isActive ? "border-primary bg-primary/5" : "border-border bg-card",
                desc?.isCrisis && "ring-1 ring-red-300"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-primary">P{i + 1} = {p.value}</span>
                    {isActive && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Сейчас</span>}
                    {desc?.isCrisis && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {p.startAge}–{p.endAge ?? '∞'} лет ({p.startYear}–{p.endYear ?? '...'})
                  </span>
                </div>
                {desc && (
                  <>
                    <p className="font-medium">{desc.name}</p>
                    <p className="text-sm text-muted-foreground">{desc.essence}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <p className="font-medium flex items-center gap-1"><Flame className="w-3 h-3 text-pink-500" /> Любовь</p>
                        <div className="space-y-1">
                          {desc.lovePlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400 flex items-start gap-1"><TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                          {desc.loveMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400 flex items-start gap-1"><TrendingDown className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3 text-blue-500" /> Бизнес</p>
                        <div className="space-y-1">
                          {desc.businessPlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400 flex items-start gap-1"><TrendingUp className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                          {desc.businessMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400 flex items-start gap-1"><TrendingDown className="w-3 h-3 mt-0.5 flex-shrink-0" />{s}</p>)}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {/* Соответствующий Challenge */}
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Challenge этого периода: C{i + 1} = {pinnaclesData.challenges[i].value}</p>
                  {challengeDescriptions[pinnaclesData.challenges[i].value] && (
                    <p className="text-sm">{challengeDescriptions[pinnaclesData.challenges[i].value].essence}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {pinnaclesData.challenges.map((c, i) => {
            const desc = challengeDescriptions[c.value];
            const labels = ['Первичный конфликт (детство)', 'Конфликт реализации', 'Главный жизненный урок', 'Финальный урок'];
            return (
              <div key={i} className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-display font-bold text-primary">C{i + 1} = {c.value}</span>
                  <span className="text-sm text-muted-foreground">{labels[i]}</span>
                </div>
                {desc && (
                  <>
                    <p className="font-medium">{desc.name}</p>
                    <p className="text-sm text-muted-foreground">{desc.essence}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400 mb-1">В плюсе:</p>
                        {desc.inPlus.map((s, j) => <p key={j} className="text-muted-foreground">• {s}</p>)}
                      </div>
                      <div>
                        <p className="font-medium text-red-700 dark:text-red-400 mb-1">В минусе:</p>
                        {desc.inMinus.map((s, j) => <p key={j} className="text-muted-foreground">• {s}</p>)}
                      </div>
                    </div>
                    {desc.crisisAdvice.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                        <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">Что делать в кризис:</p>
                        {desc.crisisAdvice.map((s, j) => <p key={j} className="text-sm text-amber-600 dark:text-amber-500">• {s}</p>)}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}

          {/* Crisis warning */}
          {pinnaclesData.challenges.some(c => [7, 8, 9].includes(c.value)) && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="font-display font-semibold text-red-700 dark:text-red-400">Внимание: период трансформации</h3>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400">
                Сейчас важно не принимать резких решений, не рушить жизнь и не действовать из эмоций.
                Этот период нужен для осознания, а не для разрушения.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Monthly forecast */}
      {activeTab === 'monthly' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4">
            <h3 className="font-display font-semibold mb-2">База личности</h3>
            <p className="text-sm text-muted-foreground">
              День рождения {day} → активные цифры: {monthlyData.dayDigits.join(', ')}
              {monthlyData.isMasterDay && ' (мастер-число)'}
            </p>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <h3 className="font-display font-semibold mb-3">Итоговая карта</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-red-600 font-medium">🔴 Рискованные:</span> {monthlyData.riskMonths.map(m => MONTH_NAMES_SHORT[m - 1]).join(', ') || '—'}</p>
              <p><span className="text-green-600 font-medium">🟢 Ресурсные:</span> {monthlyData.resourceMonths.map(m => MONTH_NAMES_SHORT[m - 1]).join(', ') || '—'}</p>
              <p><span className="text-amber-600 font-medium">🟡 Нейтральные:</span> {monthlyData.neutralMonths.map(m => MONTH_NAMES_SHORT[m - 1]).join(', ') || '—'}</p>
            </div>
          </div>

          {monthlyData.months.map(m => (
            <div key={m.month} className={cn("rounded-xl border-2 p-4 md:p-6 space-y-3", riskLevelColors[m.riskLevel])}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-lg">{m.monthName}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/50">{riskLevelLabels[m.riskLevel]}</span>
              </div>
              <p className="text-xs">Энергии: {m.activeDigits.join(' + ')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="font-medium flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3 text-green-500" /> В плюсе:</p>
                  {m.plus.map((s, j) => <p key={j}>• {s}</p>)}
                </div>
                <div>
                  <p className="font-medium flex items-center gap-1 mb-1"><TrendingDown className="w-3 h-3 text-red-500" /> В минусе:</p>
                  {m.minus.map((s, j) => <p key={j}>• {s}</p>)}
                </div>
              </div>
              <p className="text-sm font-medium">💡 {m.recommendation}</p>
              {m.redFlags && m.redFlags.length > 0 && (
                <div className="text-xs space-y-0.5">
                  {m.redFlags.map((f, j) => <p key={j} className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {f}</p>)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Integrated year forecast */}
      {activeTab === 'years' && (
        <div className="space-y-4">
          {integratedYears.map(iy => (
            <div key={iy.year} className={cn("rounded-xl border-2 p-4 md:p-6 space-y-3", crisisColors[iy.crisisLevel.level])}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-display font-semibold text-lg">{iy.year}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-background/50">{iy.crisisLevel.label}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div>
                  <p className="text-xs opacity-70">Пиннакль</p>
                  <p className="font-bold">{iy.activePinnacle.value}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Challenge</p>
                  <p className="font-bold">{iy.activeChallenge.value}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Личный год</p>
                  <p className="font-bold">{iy.personalYear}</p>
                </div>
              </div>
              <p className="text-sm">{iy.crisisLevel.description}</p>
              <p className="text-sm font-medium">💡 {iy.recommendation}</p>
            </div>
          ))}

          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-sm text-muted-foreground italic">
              «Когда сходятся пиннакль, challenge и личный год — это не случайность, а точка выбора.»
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
        <h3 className="font-display font-semibold text-xl text-primary">Хотите глубокий разбор?</h3>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Получите полный персональный отчёт с рекомендациями от эксперта
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground"
          onClick={() => {/* будет подключена оплата */}}
        >
          Получить профессиональный разбор
        </Button>
      </div>
    </div>
  );
}

const MONTH_NAMES_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
