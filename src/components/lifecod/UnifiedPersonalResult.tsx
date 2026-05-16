import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  UnifiedPersonalAnalysis, 
  CalcTrace,
  RiskScoreLevel,
} from "@/lib/lifecod/personalAnalysis";
import { 
  ArrowLeft, Activity, Mountain, Calculator, Brain, Zap, Shield, 
  TrendingUp, TrendingDown, AlertTriangle, Lock, ChevronDown, ChevronUp, 
  Flame, BarChart3, Star, Wallet, Heart, Target, Eye, Calendar,
  Lightbulb, Skull, Sparkles, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedPersonalResultProps {
  analysis: UnifiedPersonalAnalysis;
  onReset: () => void;
  isPaid?: boolean;
}

// Компонент calc_trace
function CalcTraceBlock({ trace, isPaid }: { trace: CalcTrace; isPaid?: boolean }) {
  const [open, setOpen] = useState(false);
  
  if (!isPaid) {
    return (
      <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Lock className="w-3 h-3" />
        <span>Расчёт доступен в полном отчёте</span>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg border border-border/50">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3 h-3" />
          Показать расчёт
        </span>
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1 text-xs font-mono border-t border-border/50 pt-2">
          <p className="text-muted-foreground">Вход: {trace.input}</p>
          {trace.steps.map((step, i) => (
            <p key={i} className="text-foreground">{step}</p>
          ))}
          <p className="font-semibold text-primary">{trace.result}</p>
        </div>
      )}
    </div>
  );
}

// Заблюренный блок — если isPaid, показываем контент без замков
function PaidBlock({ children, isPaid }: { children: React.ReactNode; isPaid: boolean; label?: string; level?: string }) {
  if (isPaid) return <>{children}</>;
  
  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
        <div className="text-center space-y-2 p-4">
          <Lock className="w-6 h-6 text-primary mx-auto" />
          <p className="text-sm font-medium">Доступно в профессиональном разборе</p>
        </div>
      </div>
    </div>
  );
}

type TabId = 'overview' | 'destiny' | 'ly' | 'forecast' | 'finance' | 'psych' | 'energy' | 'pinnacles' | 'risk' | 'plan';

export function UnifiedPersonalResult({ analysis, onReset, isPaid = false }: UnifiedPersonalResultProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Простая логика: isPaid = true → все блоки открыты
  const showPaid = isPaid;

  const tabs: { id: TabId; label: string; icon: typeof Activity; tier: 'free' | 'standard' | 'premium' }[] = [
    { id: 'overview', label: 'Обзор', icon: Activity, tier: 'free' },
    { id: 'destiny', label: 'Матрица', icon: Star, tier: 'free' },
    { id: 'pinnacles', label: 'Пиннаклы', icon: Mountain, tier: 'standard' },
    { id: 'ly', label: 'Годы', icon: TrendingUp, tier: 'free' },
    { id: 'forecast', label: 'Прогноз', icon: Calendar, tier: 'standard' },
    { id: 'finance', label: 'Финкод', icon: Wallet, tier: 'standard' },
    { id: 'psych', label: 'Психопрофиль', icon: Brain, tier: 'premium' },
    { id: 'energy', label: 'Энергокарта', icon: Zap, tier: 'premium' },
    { id: 'risk', label: 'Risk Score', icon: BarChart3, tier: 'free' },
    { id: 'plan', label: 'План', icon: Target, tier: 'standard' },
  ];

  const riskColors: Record<RiskScoreLevel, string> = {
    LOW: 'text-green-600 dark:text-green-400',
    MEDIUM: 'text-amber-600 dark:text-amber-400',
    HIGH: 'text-red-600 dark:text-red-400',
  };

  const riskBgColors: Record<RiskScoreLevel, string> = {
    LOW: 'bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800',
    MEDIUM: 'bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800',
    HIGH: 'bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800',
  };

  const an = analysis;

  const tierBadge = (tier: 'free' | 'standard' | 'premium') => {
    if (tier === 'free' || isPaid) return null;
    return (
      <span className={cn("text-[9px] px-1 py-0.5 rounded-sm font-medium",
        tier === 'standard' ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" 
        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
      )}>
        {tier === 'standard' ? 'STD' : 'PRO'}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-primary">Персональный анализ</h1>
          <p className="text-muted-foreground">{an.name} • {an.birthDay}.{String(an.birthMonth).padStart(2, '0')}.{an.birthYear}</p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад
        </Button>
      </div>

      {/* Risk Score Badge */}
      <div className={cn("rounded-xl border-2 p-4 flex items-center justify-between flex-wrap gap-3", riskBgColors[an.riskScore.level])}>
        <div className="flex items-center gap-3">
          <div className={cn("text-3xl font-display font-bold", riskColors[an.riskScore.level])}>
            {an.riskScore.score}
          </div>
          <div>
            <p className={cn("font-semibold", riskColors[an.riskScore.level])}>{an.riskScore.label}</p>
            <p className="text-xs text-muted-foreground">Risk Score на {an.targetYear} год</p>
          </div>
        </div>
        <div className="text-sm">
          <span className="font-medium">Личный год: </span>
          <span className={cn(an.currentPersonalYear.isCrisis ? "text-red-600 font-bold" : "text-foreground")}>
            {an.currentPersonalYear.personalYear} — {an.currentPersonalYear.name}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tierBadge(tab.tier)}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <SummaryCard label="Душа" value={an.destinyMatrix.soulNumber} sub={an.destinyMatrix.soulName} />
            <SummaryCard label="Миссия" value={an.destinyMatrix.missionNumber} sub={an.destinyMatrix.missionName} />
            <SummaryCard label="Личный год" value={an.currentPersonalYear.personalYear} sub={an.currentPersonalYear.name} crisis={an.currentPersonalYear.isCrisis} />
            <SummaryCard label="Финканал" value={an.financialCode.channelNumber} sub={an.financialCode.channelName} />
            <SummaryCard label="Сегодня" value={an.today.personalDay} sub={an.today.name} />
          </div>

          {/* Current state */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
            <h3 className="font-display font-semibold text-lg">Базовый вывод</h3>
            <div className="space-y-2 text-sm">
              <p>🔮 Ваша душа — <strong>{an.destinyMatrix.soulNumber}</strong> ({an.destinyMatrix.soulName}): {an.destinyMatrix.soulDesc}</p>
              <p>🎯 Миссия — <strong>{an.destinyMatrix.missionNumber}</strong>: {an.destinyMatrix.missionDesc}</p>
              <p>📅 Личный год — <strong>{an.currentPersonalYear.personalYear}</strong>: {an.currentPersonalYear.theme}</p>
              <p>📆 Сегодня — <strong>{an.today.personalDay}</strong>: {an.today.energy}</p>
              {an.currentPersonalYear.isCrisis && (
                <p className="text-red-600 dark:text-red-400 font-medium">
                  ⚠️ Высокая вероятность кризисных событий при неосознанном проживании
                </p>
              )}
            </div>
          </div>

          {/* Базовые риски */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
            <h3 className="font-display font-semibold text-lg">Базовые риски</h3>
            <div className="space-y-1 text-sm">
              {an.riskScore.factors.slice(0, 2).map((f, i) => (
                <p key={i} className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />{f}
                </p>
              ))}
            </div>
          </div>

          {/* Show upsell only if NOT paid */}
          {!isPaid && <ActivationCTA />}
        </div>
      )}

      {/* ===== МАТРИЦА СУДЬБЫ ===== */}
      {activeTab === 'destiny' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Матрица судьбы</h3>
            <CalcTraceBlock trace={an.destinyMatrix.calcTrace} isPaid={showPaid} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <DestinyCard label="Число души" value={an.destinyMatrix.soulNumber} name={an.destinyMatrix.soulName} desc={an.destinyMatrix.soulDesc} />
              <DestinyCard label="Миссия" value={an.destinyMatrix.missionNumber} name={an.destinyMatrix.missionName} desc={an.destinyMatrix.missionDesc} />
              <DestinyCard label="Реализация" value={an.destinyMatrix.realizationNumber} name={an.destinyMatrix.realizationName} desc={an.destinyMatrix.realizationDesc} />
              <DestinyCard label="Итог жизни" value={an.destinyMatrix.lifeOutcomeNumber} name={an.destinyMatrix.lifeOutcomeName} desc={an.destinyMatrix.lifeOutcomeDesc} />
            </div>
          </div>

          {/* Кармические задачи */}
          <PaidBlock isPaid={showPaid} label="Кармические задачи доступны в полном отчёте" level="Стандарт">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2"><Skull className="w-5 h-5 text-amber-600" /> Кармические задачи</h3>
              {an.destinyMatrix.karmicTasks.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {an.destinyMatrix.karmicTasks.map((k, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-xs font-bold text-amber-700">{k.number}</span>
                      <p>{k.task}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Все числа присутствуют — кармические задачи минимальны</p>
              )}
            </div>
          </PaidBlock>

          {/* Теневая и сильная энергии */}
          <PaidBlock isPaid={showPaid} label="Энергетический баланс в полном отчёте" level="Стандарт">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border p-4 space-y-2">
                <h4 className="font-medium text-red-600 dark:text-red-400 flex items-center gap-1"><TrendingDown className="w-4 h-4" /> Теневая энергия (дефициты)</h4>
                {an.destinyMatrix.shadowEnergy.length > 0 ? (
                  an.destinyMatrix.shadowEnergy.map((s, i) => (
                    <p key={i} className="text-sm">• {s.desc}</p>
                  ))
                ) : <p className="text-sm text-muted-foreground">Дефицитов нет</p>}
              </div>
              <div className="bg-card rounded-xl border p-4 space-y-2">
                <h4 className="font-medium text-green-600 dark:text-green-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Сильные энергии</h4>
                {an.destinyMatrix.strongEnergies.map((s, i) => (
                  <p key={i} className="text-sm">• {s.desc} {s.count > 1 && `(×${s.count})`}</p>
                ))}
                {an.destinyMatrix.strongEnergies.length === 0 && <p className="text-sm text-muted-foreground">Нет выраженных сильных энергий</p>}
              </div>
            </div>
          </PaidBlock>

          {!isPaid && <ActivationCTA />}
        </div>
      )}

      {/* ===== ЛИЧНЫЕ ГОДЫ ===== */}
      {activeTab === 'ly' && (
        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">
              {an.targetYear}: Личный год {an.currentPersonalYear.personalYear} — {an.currentPersonalYear.name}
            </h3>
            <CalcTraceBlock trace={an.currentPersonalYear.calcTrace} isPaid={showPaid} />
            <p className="text-sm">{an.currentPersonalYear.theme}</p>
            
            <PaidBlock isPaid={showPaid} label="Подробности доступны в полном отчёте">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-1"><Flame className="w-3 h-3" /> Отношения</p>
                  <p>{an.currentPersonalYear.forRelationships}</p>
                </div>
                <div>
                  <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-1"><TrendingUp className="w-3 h-3" /> Бизнес</p>
                  <p>{an.currentPersonalYear.forBusiness}</p>
                </div>
              </div>
            </PaidBlock>
          </div>

          {/* Год в действиях */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">Год в действиях: {an.yearInActions.value}</h3>
            <CalcTraceBlock trace={an.yearInActions.calcTrace} isPaid={showPaid} />
            <PaidBlock isPaid={showPaid} label="Поведенческий разбор в полном отчёте">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Как действует:</p>
                  {an.yearInActions.behavior.map((b, i) => <p key={i} className="text-green-700 dark:text-green-400">✓ {b}</p>)}
                </div>
                <div>
                  <p className="font-medium mb-1">Стоп-сигналы:</p>
                  {an.yearInActions.stopSignals.map((s, i) => <p key={i} className="text-amber-700 dark:text-amber-400">⚠ {s}</p>)}
                </div>
              </div>
            </PaidBlock>
          </div>

          {/* 5-year forecast */}
          <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
            <h3 className="font-display font-semibold text-lg">Прогноз на 5 лет</h3>
            <div className="space-y-2">
              {an.personalYears.map((py, i) => (
                <div key={py.year} className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  py.isCrisis ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800" : "bg-card border-border",
                  i === 0 && "ring-2 ring-primary"
                )}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-lg text-primary">{py.year}</span>
                    <span className="font-medium">{py.personalYear} — {py.name}</span>
                    {py.isCrisis && <AlertTriangle className="w-3 h-3 text-red-500" />}
                  </div>
                  {i > 0 && an.personalYears[i - 1].personalYear === 6 && py.personalYear === 7 && (
                    <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded-full">6→7</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== ПРОГНОЗ (месяц/день) ===== */}
      {activeTab === 'forecast' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="Помесячный прогноз — уровень Стандарт" level="Стандарт">
            {/* Today */}
            <div className="bg-primary/5 rounded-xl border-2 border-primary p-4 md:p-6 space-y-3">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Сегодня: {an.today.name}
              </h3>
              <CalcTraceBlock trace={an.today.calcTrace} isPaid={true} />
              <p className="text-sm">{an.today.energy}</p>
            </div>

            {/* Current month */}
            <div className="bg-card rounded-xl border-2 border-primary/50 p-4 md:p-6 space-y-3 mt-4">
              <h3 className="font-display font-semibold text-lg">
                Текущий месяц: {an.currentMonth.personalMonth} — {an.currentMonth.name}
              </h3>
              <CalcTraceBlock trace={an.currentMonth.calcTrace} isPaid={true} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="font-medium mb-1">⚡ Энергия</p>
                  <p>{an.currentMonth.energy}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="font-medium mb-1">🟢 Возможности</p>
                  <p>{an.currentMonth.opportunities}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="font-medium mb-1">🔴 Риски</p>
                  <p>{an.currentMonth.risks}</p>
                </div>
              </div>
            </div>

            {/* All 12 months */}
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3 mt-4">
              <h3 className="font-display font-semibold text-lg">12 месяцев {an.targetYear}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {an.forecastMonths.map((m) => {
                  const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
                  const isCurrent = m.month === an.currentMonth.month;
                  return (
                    <div key={m.month} className={cn(
                      "p-3 rounded-lg border text-center",
                      isCurrent ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border",
                      [7, 8, 9].includes(m.personalMonth) && "bg-red-50 dark:bg-red-950/20"
                    )}>
                      <p className="text-xs text-muted-foreground">{monthNames[m.month - 1]}</p>
                      <p className="text-xl font-display font-bold text-primary">{m.personalMonth}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{m.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </PaidBlock>
        </div>
      )}

      {/* ===== ФИНАНСОВЫЙ КОД ===== */}
      {activeTab === 'finance' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="Финансовый код — уровень Стандарт" level="Стандарт">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2"><Wallet className="w-5 h-5 text-primary" /> Финансовый код</h3>
              <CalcTraceBlock trace={an.financialCode.calcTrace} isPaid={true} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-muted-foreground mb-1">Финансовый канал</p>
                  <p className="text-2xl font-display font-bold text-green-700 dark:text-green-400">{an.financialCode.channelNumber}</p>
                  <p className="font-medium text-sm">{an.financialCode.channelName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{an.financialCode.channelDesc}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-muted-foreground mb-1">Блокировка денег</p>
                  <p className="text-2xl font-display font-bold text-red-700 dark:text-red-400">{an.financialCode.blockNumber}</p>
                  <p className="font-medium text-sm">{an.financialCode.blockName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{an.financialCode.blockDesc}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-muted-foreground mb-1">Активация</p>
                  <p className="text-2xl font-display font-bold text-blue-700 dark:text-blue-400">{an.financialCode.activationNumber}</p>
                  <p className="font-medium text-sm">{an.financialCode.activationName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{an.financialCode.activationDesc}</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="font-medium text-sm">💼 Рекомендуемые сферы дохода:</p>
                <div className="flex flex-wrap gap-2">
                  {an.financialCode.spheres.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {an.financialCode.moneyMistakes.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 space-y-1">
                  <p className="font-medium text-sm text-red-700 dark:text-red-400">🚫 Ошибки в деньгах:</p>
                  {an.financialCode.moneyMistakes.map((m, i) => (
                    <p key={i} className="text-sm">• {m}</p>
                  ))}
                </div>
              )}
            </div>
          </PaidBlock>
        </div>
      )}

      {/* ===== ПСИХОПРОФИЛЬ ===== */}
      {activeTab === 'psych' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="Психопрофиль — уровень Премиум" level="Премиум">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Психологическая расшифровка</h3>
              <CalcTraceBlock trace={an.psychProfile.calcTrace} isPaid={true} />

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Поведенческий психотип</p>
                <p className="text-xl font-display font-bold text-primary">{an.psychProfile.psychotype.name}</p>
                <p className="text-sm mt-1">{an.psychProfile.psychotype.desc}</p>
              </div>

              <div className="bg-card rounded-xl border p-4 space-y-2">
                <p className="font-medium text-sm flex items-center gap-1"><Heart className="w-4 h-4 text-pink-500" /> Реакция в отношениях</p>
                <p className="text-sm">{an.psychProfile.relationshipReaction}</p>
              </div>

              {an.psychProfile.fears.length > 0 && (
                <div className="bg-card rounded-xl border p-4 space-y-2">
                  <p className="font-medium text-sm">😨 Страхи</p>
                  {an.psychProfile.fears.map((f, i) => <p key={i} className="text-sm text-red-700 dark:text-red-400">• {f}</p>)}
                </div>
              )}

              {an.psychProfile.lifeScenarios.length > 0 && (
                <div className="bg-card rounded-xl border p-4 space-y-2">
                  <p className="font-medium text-sm">🎭 Сценарии жизни</p>
                  {an.psychProfile.lifeScenarios.map((s, i) => <p key={i} className="text-sm">• {s}</p>)}
                </div>
              )}

              {an.psychProfile.repeatingCycles.length > 0 && (
                <div className="bg-card rounded-xl border p-4 space-y-2">
                  <p className="font-medium text-sm">🔄 Повторяющиеся циклы</p>
                  {an.psychProfile.repeatingCycles.map((c, i) => <p key={i} className="text-sm">• {c}</p>)}
                </div>
              )}
            </div>
          </PaidBlock>
        </div>
      )}

      {/* ===== ЭНЕРГОКАРТА ===== */}
      {activeTab === 'energy' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="Энергокарта — уровень Премиум" level="Премиум">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Энергетическая карта</h3>
              <CalcTraceBlock trace={an.energyMap.calcTrace} isPaid={true} />

              {/* Balance */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">Баланс энергии</p>
                  <span className={cn("text-sm font-bold",
                    an.energyMap.balance >= 75 ? "text-green-600" :
                    an.energyMap.balance >= 50 ? "text-amber-600" : "text-red-600"
                  )}>{an.energyMap.balance}%</span>
                </div>
                <Progress value={an.energyMap.balance} className="h-2" />
                <p className="text-xs text-muted-foreground">{an.energyMap.balanceLabel}</p>
              </div>

              {/* 9 Centers Grid */}
              <div className="grid grid-cols-3 gap-2">
                {an.energyMap.centers.map((c) => {
                  const colors = {
                    deficit: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
                    normal: 'bg-card border-border',
                    strong: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
                    excess: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
                  };
                  return (
                    <div key={c.number} className={cn("rounded-lg border p-3 text-center", colors[c.status])}>
                      <p className="text-2xl font-display font-bold text-primary">{c.number}</p>
                      <p className="text-[10px] font-medium truncate">{c.name}</p>
                      <p className="text-[9px] text-muted-foreground">{c.statusLabel} ({c.count})</p>
                    </div>
                  );
                })}
              </div>

              {/* Leaks & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="font-medium text-sm text-red-600 dark:text-red-400">🔋 Утечки ресурса</p>
                  {an.energyMap.leaks.length > 0 ? (
                    an.energyMap.leaks.map((l, i) => <p key={i} className="text-sm">• {l.desc}</p>)
                  ) : <p className="text-sm text-muted-foreground">Утечек не обнаружено</p>}
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm text-green-600 dark:text-green-400">💪 Сила личности</p>
                  {an.energyMap.strengths.map((s, i) => <p key={i} className="text-sm">• {s.desc}</p>)}
                  {an.energyMap.strengths.length === 0 && <p className="text-sm text-muted-foreground">Равномерное распределение</p>}
                </div>
              </div>
            </div>
          </PaidBlock>
        </div>
      )}

      {/* ===== ПИННАКЛИ ===== */}
      {activeTab === 'pinnacles' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="Пиннакли — уровень Стандарт" level="Стандарт">
            <div className="bg-card rounded-xl border p-4">
              <CalcTraceBlock trace={an.pinnaclesCalcTrace} isPaid={true} />
            </div>
            {an.pinnacles.map((p) => (
              <div key={p.index} className={cn(
                "bg-card rounded-xl border-2 p-4 md:p-6 space-y-3 mt-4",
                p.isActive ? "border-primary bg-primary/5" : "border-border",
                p.isCrisis && "ring-1 ring-red-300"
              )}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-display font-bold text-primary">P{p.index + 1} = {p.value}</span>
                    {p.isActive && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Сейчас</span>}
                    {p.isCrisis && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <span className="text-sm text-muted-foreground">{p.startAge}–{p.endAge ?? '∞'} лет ({p.startYear}–{p.endYear ?? '...'})</span>
                </div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.essence}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="font-medium text-pink-600 dark:text-pink-400 flex items-center gap-1"><Flame className="w-3 h-3" /> Любовь</p>
                    {p.lovePlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400">✓ {s}</p>)}
                    {p.loveMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400">✗ {s}</p>)}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Бизнес</p>
                    {p.businessPlus.map((s, j) => <p key={j} className="text-green-700 dark:text-green-400">✓ {s}</p>)}
                    {p.businessMinus.map((s, j) => <p key={j} className="text-red-700 dark:text-red-400">✗ {s}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </PaidBlock>
        </div>
      )}

      {/* ===== RISK SCORE ===== */}
      {activeTab === 'risk' && (
        <div className="space-y-4">
          <div className={cn("rounded-xl border-2 p-6 space-y-4", riskBgColors[an.riskScore.level])}>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/20" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" className={riskColors[an.riskScore.level]}
                    strokeDasharray={`${an.riskScore.score} ${100 - an.riskScore.score}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn("text-xl font-display font-bold", riskColors[an.riskScore.level])}>{an.riskScore.score}</span>
                </div>
              </div>
              <div>
                <h3 className={cn("font-display font-semibold text-xl", riskColors[an.riskScore.level])}>{an.riskScore.label}</h3>
                <p className="text-sm text-muted-foreground">Risk Score на {an.targetYear}</p>
              </div>
            </div>
            <CalcTraceBlock trace={an.riskScore.calcTrace} isPaid={showPaid} />
          </div>

          <PaidBlock isPaid={showPaid} label="Полная карта рисков в полном отчёте">
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3">
              <h3 className="font-display font-semibold text-lg">Факторы риска</h3>
              {an.riskScore.factors.map((f, i) => (
                <p key={i} className="flex items-start gap-2 text-sm"><AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />{f}</p>
              ))}
              {an.riskScore.factors.length === 0 && <p className="text-sm text-muted-foreground">Критических факторов нет</p>}
            </div>
            <div className="bg-card rounded-xl border p-4 md:p-6 space-y-3 mt-4">
              <h3 className="font-display font-semibold text-lg">Рекомендации</h3>
              {an.riskScore.recommendations.map((r, i) => (
                <p key={i} className="flex items-start gap-2 text-sm"><Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />{r}</p>
              ))}
            </div>
          </PaidBlock>
        </div>
      )}

      {/* ===== ПЛАН ДЕЙСТВИЙ ===== */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <PaidBlock isPaid={showPaid} label="План действий — уровень Стандарт" level="Стандарт">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 p-4 space-y-2">
                <p className="font-display font-semibold text-green-700 dark:text-green-400 flex items-center gap-1"><Lightbulb className="w-4 h-4" /> Что делать сейчас</p>
                {an.actionPlan.doNow.map((d, i) => <p key={i} className="text-sm">✅ {d}</p>)}
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-2">
                <p className="font-display font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Что усилить</p>
                {an.actionPlan.strengthen.map((s, i) => <p key={i} className="text-sm">💪 {s}</p>)}
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 p-4 space-y-2">
                <p className="font-display font-semibold text-red-700 dark:text-red-400 flex items-center gap-1"><Shield className="w-4 h-4" /> Чего избегать</p>
                {an.actionPlan.avoid.map((a, i) => <p key={i} className="text-sm">🚫 {a}</p>)}
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 p-4 space-y-2">
                <p className="font-display font-semibold text-purple-700 dark:text-purple-400 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Как раскрыть потенциал</p>
                {an.actionPlan.unlockPotential.map((u, i) => <p key={i} className="text-sm">🔓 {u}</p>)}
              </div>
            </div>
          </PaidBlock>
        </div>
      )}

      {/* Life COD Club CTA (always at bottom) */}
      {!isPaid && <ActivationCTA />}
    </div>
  );
}

// ===== Helper Components =====

function SummaryCard({ label, value, sub, crisis }: { label: string; value: number; sub: string; crisis?: boolean }) {
  return (
    <div className={cn(
      "bg-card rounded-xl border p-3 text-center",
      crisis && "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
    )}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-2xl font-display font-bold", crisis ? "text-red-600 dark:text-red-400" : "text-primary")}>{value}</p>
      <p className="text-[10px] text-muted-foreground truncate">{sub}</p>
    </div>
  );
}

function DestinyCard({ label, value, name, desc }: { label: string; value: number; name: string; desc: string }) {
  return (
    <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-3xl font-display font-bold text-primary">{value}</p>
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function ActivationCTA() {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20 rounded-2xl p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <Crown className="w-6 h-6 text-primary" />
        <h3 className="font-display font-semibold text-xl text-primary">Профессиональный разбор</h3>
      </div>
      <p className="text-muted-foreground text-sm max-w-lg mx-auto">
        Получите полный доступ ко всем блокам анализа: помесячный прогноз, финансовый код, 
        психопрофиль, энергокарту и персональный план действий.
      </p>
      <Button size="lg" className="bg-primary text-primary-foreground" onClick={() => {/* будет подключена оплата */}}>
        <Crown className="w-4 h-4 mr-2" /> Получить профессиональный разбор
      </Button>
    </div>
  );
}
