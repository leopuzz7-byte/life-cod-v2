// src/components/SuccessPathResult.tsx
import { useTranslation } from 'react-i18next';
import { SuccessPathModule } from '@/lib/lifecod/successPath';
import { Rocket, TrendingUp, AlertTriangle, Star, Calendar, Target, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessPathResultProps {
  result: SuccessPathModule;
}

export function SuccessPathResult({ result }: SuccessPathResultProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Заголовок */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-3">
          <Rocket className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl text-foreground">
          {t('successPath.title', 'Путь к успеху')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('successPath.subtitle', 'Персональный план реализации')}
        </p>
      </div>

      {/* Бизнес-типаж */}
      <div className="gradient-card rounded-xl p-5 border-2 border-primary/30 text-center space-y-3">
        <p className="text-xs text-muted-foreground">{t('successPath.yourType', 'Ваш тип предпринимателя')}</p>
        <p className="text-2xl font-display text-primary">{result.businessType}</p>
        <div className="grid grid-cols-2 gap-3 text-left mt-3">
          <div>
            <p className="text-xs font-medium text-primary mb-2">
              <CheckCircle className="w-3 h-3 inline mr-1" />
              {t('successPath.strengths', 'Сильные стороны')}
            </p>
            {result.coreStrengths.map((s, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {s}</p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-destructive mb-2">
              <AlertTriangle className="w-3 h-3 inline mr-1" />
              {t('successPath.risks', 'Риски')}
            </p>
            {result.coreRisks.map((r, i) => (
              <p key={i} className="text-xs text-muted-foreground">• {r}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Сейчас — личный год */}
      <div className={cn(
        "gradient-card rounded-xl p-5 border-2 space-y-3",
        result.isCurrentYearOpportunity ? "border-green-500/40" : "border-border"
      )}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {t('successPath.rightNow', 'Прямо сейчас')} — {new Date().getFullYear()}
          </h3>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full font-medium",
            result.isCurrentYearOpportunity
              ? "bg-green-100 text-green-700"
              : "bg-secondary text-muted-foreground"
          )}>
            {t('keyto.number', 'Год')} {result.currentPersonalYear} — {result.currentPersonalYearName}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.currentPersonalYearBusiness}
        </p>
        {result.isCurrentYearOpportunity && (
          <p className="text-xs text-green-600 font-medium">
            ✦ {t('successPath.opportunityYear', 'Это год возможностей — используйте его максимально')}
          </p>
        )}
      </div>

      {/* Активный пиннакль */}
      <div className="gradient-card rounded-xl p-5 border border-border space-y-3">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          {t('successPath.currentPeriod', 'Ваш жизненный период')}
        </h3>
        <p className="font-medium text-primary">{result.currentPinnacleName}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{result.currentPinnacleEssence}</p>
        <div className="bg-primary/5 rounded-lg p-3">
          <p className="text-xs font-medium text-primary mb-1">{t('successPath.businessTip', 'Бизнес-совет периода')}</p>
          <p className="text-sm text-muted-foreground">{result.currentPinnacleBusinessTip}</p>
        </div>
      </div>

      {/* Прогноз на 3 года */}
      <div className="space-y-3">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          {t('successPath.threeYears', 'Ближайшие 3 года')}
        </h3>
        {result.nextThreeYears.map((yr) => (
          <div key={yr.year} className={cn(
            "gradient-card rounded-xl p-4 border",
            yr.isOpportunity ? "border-green-500/40" : yr.isRisk ? "border-amber-500/30" : "border-border"
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-base text-foreground">{yr.year}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('keyto.number', 'Год')} {yr.personalYear}</span>
                {yr.isOpportunity && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🚀 {t('successPath.opportunity', 'Возможности')}</span>}
                {yr.isRisk && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⚡ {t('successPath.caution', 'Осторожно')}</span>}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{yr.forBusiness}</p>
          </div>
        ))}
      </div>

      {/* Стратегия */}
      <div className="gradient-card rounded-xl p-5 border-2 border-primary/30 space-y-4">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          {t('successPath.strategy', 'Стратегия прямо сейчас')}
        </h3>
        <div>
          <p className="text-xs font-medium text-primary mb-2">
            <CheckCircle className="w-3 h-3 inline mr-1" />
            {t('successPath.doNow', 'Делайте')}
          </p>
          <ul className="space-y-2">
            {result.strategyNow.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-bold mt-0.5">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-destructive mb-2">
            <XCircle className="w-3 h-3 inline mr-1" />
            {t('successPath.avoid', 'Избегайте')}
          </p>
          <ul className="space-y-1">
            {result.strategyAvoid.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-destructive mt-0.5">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Финансовый канал */}
      <div className="gradient-card rounded-xl p-5 border border-border space-y-3">
        <h3 className="font-display text-lg text-foreground">
          {t('business.financialChannel', 'Финансовый канал')}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-display text-primary">{result.financialChannel}</span>
          <div>
            <p className="font-medium text-foreground">{result.financialChannelName}</p>
            <p className="text-sm text-muted-foreground">{result.financialChannelDesc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {result.bestSpheres.map((s, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{s}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
