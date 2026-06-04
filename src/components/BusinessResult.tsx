// src/components/BusinessResult.tsx
import { useTranslation } from 'react-i18next';
import { BusinessBasicModule, BusinessProModule } from '@/lib/lifecod/businessAnalysis';
import { Briefcase, TrendingUp, AlertTriangle, Users, Star, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BusinessResultProps {
  result: BusinessBasicModule | BusinessProModule;
  isPro: boolean;
}

function isPro(r: BusinessBasicModule | BusinessProModule): r is BusinessProModule {
  return 'businessProfile' in r;
}

export function BusinessResult({ result, isPro: isProTier }: BusinessResultProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* Заголовок */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-3">
          <Briefcase className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl text-foreground">
          {t('business.title', 'Бизнес-разбор')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isProTier ? t('business.subtitlePro', 'Полный профессиональный анализ') : t('business.subtitleBasic', 'Базовый анализ')}
        </p>
      </div>

      {/* Числа — всегда показываем */}
      <div className="grid grid-cols-2 gap-4">
        <div className="gradient-card rounded-xl p-4 border border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('business.mindNumber', 'Число Ума')}</p>
          <p className="text-4xl font-display text-primary mb-1">{result.consciousness.result}</p>
          <p className="text-sm font-medium text-foreground">{result.consciousness.name}</p>
        </div>
        <div className="gradient-card rounded-xl p-4 border border-border text-center">
          <p className="text-xs text-muted-foreground mb-1">{t('business.actionNumber', 'Число Действия')}</p>
          <p className="text-4xl font-display text-primary mb-1">{result.actions.result}</p>
          <p className="text-sm font-medium text-foreground">{result.actions.name}</p>
        </div>
      </div>

      {/* Бизнес-качества по числу Ума */}
      <div className="gradient-card rounded-xl p-5 border border-border space-y-4">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          {t('business.mindInBusiness', 'Ваш ум в бизнесе')}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.consciousness.innerState}
        </p>
        {result.consciousness.plus.length > 0 && (
          <div>
            <p className="text-xs font-medium text-primary mb-2">{t('business.strengths', 'Сильные стороны')}</p>
            <div className="flex flex-wrap gap-2">
              {result.consciousness.plus.slice(0, 4).map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Стиль действия в бизнесе */}
      <div className="gradient-card rounded-xl p-5 border border-border space-y-3">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          {t('business.actionInBusiness', 'Стиль действия')}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.actions.business || result.actions.chainMeaning}
        </p>
        {result.actions.redFlags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-destructive mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {t('business.watchOut', 'Обратите внимание')}
            </p>
            <ul className="space-y-1">
              {result.actions.redFlags.slice(0, 2).map((r, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <ChevronRight className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ПРОФЕССИОНАЛЬНЫЙ — доп блоки */}
      {isProTier && isPro(result) && (
        <>
          {/* Бизнес-типаж */}
          <div className="gradient-card rounded-xl p-5 border-2 border-primary/30 space-y-4">
            <h3 className="font-display text-lg text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {t('business.yourType', 'Ваш бизнес-типаж')}
            </h3>
            <div className="text-center py-2">
              <span className="text-xl font-display text-primary">{result.businessProfile.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-primary mb-2">{t('business.strengths', 'Сильные стороны')}</p>
                <ul className="space-y-1">
                  {result.businessProfile.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-primary mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-destructive mb-2">{t('business.risks', 'Риски')}</p>
                <ul className="space-y-1">
                  {result.businessProfile.risks.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-destructive mt-0.5">!</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t('business.bestRoles', 'Лучшие роли в бизнесе')}</p>
              <div className="flex flex-wrap gap-2">
                {result.businessProfile.bestRoles.map((role, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-secondary text-foreground rounded-full">{role}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Финансовый канал */}
          <div className="gradient-card rounded-xl p-5 border border-border space-y-3">
            <h3 className="font-display text-lg text-foreground">
              {t('business.financialChannel', 'Финансовый канал')}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display text-primary">{result.financialCode.channelNumber}</span>
              <div>
                <p className="font-medium text-foreground">{result.financialCode.channelName}</p>
                <p className="text-sm text-muted-foreground">{result.financialCode.channelDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.financialCode.spheres.map((s, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* Психотип */}
          <div className="gradient-card rounded-xl p-5 border border-border space-y-3">
            <h3 className="font-display text-lg text-foreground">
              {t('business.psychotype', 'Психотип в команде')}
            </h3>
            <p className="font-medium text-primary">{result.psychProfile.psychotype.name}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{result.psychProfile.psychotype.desc}</p>
          </div>

          {/* Партнёрская совместимость */}
          <div className="gradient-card rounded-xl p-5 border border-border">
            <h3 className="font-display text-lg text-foreground mb-2">
              {t('business.partnerCompatibility', 'Бизнес-партнёрство')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.businessProfile.partnerCompatibility}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
