import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, AlertTriangle, TrendingUp, Shield, MessageCircle, Wallet, Flame, CheckCircle, BookOpen, Zap, Brain, Target, ShieldAlert, Lightbulb } from "lucide-react";
import { CompatibilityResult, formatBirthDate } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { getCompatibilityProInterpretation } from "@/lib/proInterpretations";
import { ProSectionBlock, ProTextBlock, ProListBlock, ProNumberedList } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface CompatibilityResultProps {
  result: CompatibilityResult;
  onReset: () => void;
  tier?: TierType;
}

export function CompatibilityResultComponent({ result, onReset, tier = 'basic' }: CompatibilityResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';

  const unionArcana = getArcana(result.unionArcana);
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);
  const person1DestinyArcana = getArcana(result.person1.destinyArcana);
  const person2DestinyArcana = getArcana(result.person2.destinyArcana);
  
  const proData = isPro ? getCompatibilityProInterpretation(
    result.unionArcana, result.harmonyArcana, result.karmaArcana, result.compatibilityPercent
  ) : null;

  const getCompatibilityColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-primary";
    if (percent >= 40) return "text-yellow-600";
    return "text-red-500";
  };
  const getCompatibilityLabel = (percent: number) => {
    if (percent >= 80) return t("compatibility.excellent");
    if (percent >= 60) return t("compatibility.good");
    if (percent >= 40) return t("compatibility.moderate");
    return t("compatibility.challenging");
  };

  const handleDownloadPDF = async () => {
    const person1Date = formatBirthDateForPDF(result.person1.birthDate.day, result.person1.birthDate.month, result.person1.birthDate.year);
    const person2Date = formatBirthDateForPDF(result.person2.birthDate.day, result.person2.birthDate.month, result.person2.birthDate.year);
    await generatePDF({
      title: t("compatibility.title"),
      subtitle: `${result.person1.name} & ${result.person2.name}`,
      birthDate: `${person1Date} / ${person2Date}`,
      sections: [
        { title: `${t("compatibility.compatibilityScore")}: ${result.compatibilityPercent}%`, content: getCompatibilityLabel(result.compatibilityPercent), highlight: true },
        { title: `${t("compatibility.unionArcana")}: ${result.unionArcana} — ${unionArcana?.name || ""}`, content: unionArcana?.compatibilityDescription || unionArcana?.personalDescription || "" },
        { title: t("compatibility.strengths"), content: result.strengths },
        { title: t("compatibility.challenges"), content: result.challenges },
      ],
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center mb-8">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "✦ Профессиональный разбор" : "Базовый разбор"}
        </span>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl md:text-3xl font-display text-primary">{t("compatibility.title")}</h1>
        </div>
        <p className="text-muted-foreground">{result.person1.name} & {result.person2.name}</p>
      </div>

      {/* Score */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border mb-8 text-center">
        <div className="mb-4">
          <span className={cn("text-5xl md:text-6xl font-display font-bold", getCompatibilityColor(result.compatibilityPercent))}>
            {result.compatibilityPercent}%
          </span>
        </div>
        <p className={cn("text-lg font-medium", getCompatibilityColor(result.compatibilityPercent))}>
          {getCompatibilityLabel(result.compatibilityPercent)}
        </p>
      </div>

      {/* Partners Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[result.person1, result.person2].map((person, idx) => {
          const destinyArcana = idx === 0 ? person1DestinyArcana : person2DestinyArcana;
          return (
            <div key={idx} className="gradient-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">{person.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {formatBirthDate(person.birthDate.day, person.birthDate.month, person.birthDate.year)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("compatibility.destinyArcana")}:</span>
                <span className="px-2 py-1 bg-primary/10 rounded text-sm font-medium text-primary">
                  {person.destinyArcana} - {destinyArcana?.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Union Arcana — always shown */}
      <div className="mb-8">
        <h2 className="text-xl font-display text-primary mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          {t("compatibility.unionArcana")}: {result.unionArcana} — {unionArcana?.name}
        </h2>
        <div className="gradient-card rounded-xl p-5 border border-primary/30">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {unionArcana?.compatibilityDescription || unionArcana?.personalDescription}
          </p>
        </div>
      </div>

      {/* ===== PRO CONTENT — 9-block standard ===== */}
      {isPro && proData && (
        <>
          {/* 1. ВВОДНЫЙ БЛОК */}
          <ProSectionBlock icon={BookOpen} title="Введение в анализ пары" variant="highlight" className="mb-6">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-sm font-medium text-foreground mb-2">Энергия пары</h4>
              <ProTextBlock text={proData.pairEnergy} />
            </div>
          </ProSectionBlock>

          {/* 2. ОСНОВНОЙ РАЗБОР */}
          <ProSectionBlock icon={Target} title="Глубокий разбор арканов пары" className="mb-6">
            <ProTextBlock text={proData.pairDynamics} className="mb-4" />
            
            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Аркан Союза ({result.unionArcana} — {unionArcana?.name})
                </h4>
                <ProTextBlock text={proData.unionDeepMeaning} />
              </div>
              
              <div className="bg-accent/20 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Аркан Гармонии ({result.harmonyArcana} — {harmonyArcana?.name})
                </h4>
                <ProTextBlock text={proData.harmonyDeepMeaning} />
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {harmonyArcana?.compatibilityDescription || harmonyArcana?.personalDescription}
                </p>
              </div>
              
              <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Аркан Кармы ({result.karmaArcana} — {karmaArcana?.name})
                </h4>
                <ProTextBlock text={proData.karmaDeepMeaning} />
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {karmaArcana?.personalDescription}
                </p>
              </div>
            </div>
          </ProSectionBlock>

          {/* 3. РАЗБОР ПО СФЕРАМ */}
          <ProSectionBlock icon={Wallet} title="💰 Финансовая динамика пары" className="mb-6">
            <ProTextBlock text={proData.financialDynamics} className="mb-4" />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                <h5 className="text-xs font-medium text-destructive mb-1">Финансовые риски</h5>
                <p className="text-xs text-muted-foreground">{proData.financialRisks}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.financialRecommendations}</p>
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={TrendingUp} title="💼 Карьерная совместимость" className="mb-6">
            <ProTextBlock text={proData.careerDynamics} className="mb-3" />
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
              <p className="text-xs text-muted-foreground">{proData.careerRecommendations}</p>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ProSectionBlock icon={Flame} title="🔥 Сексуальная совместимость">
              <ProTextBlock text={proData.sexualChemistry} className="mb-3" />
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.sexualRecommendations}</p>
              </div>
            </ProSectionBlock>

            <ProSectionBlock icon={Brain} title="💭 Эмоциональная связь">
              <ProTextBlock text={proData.emotionalDynamics} className="mb-3" />
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">Рекомендации</h5>
                <p className="text-xs text-muted-foreground">{proData.emotionalRecommendations}</p>
              </div>
            </ProSectionBlock>
          </div>

          {/* 4. СВЯЗКИ И ВЗАИМОДЕЙСТВИЕ */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="gradient-card rounded-xl p-5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-display font-semibold text-foreground text-sm">Зоны конфликтов</h3>
              </div>
              <ProListBlock items={proData.conflictZones} icon="⚠" />
            </div>
            <div className="gradient-card rounded-xl p-5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-semibold text-foreground text-sm">Зоны роста</h3>
              </div>
              <ProListBlock items={proData.growthAreas} icon="↑" />
            </div>
            <div className="gradient-card rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground text-sm">Синергия</h3>
              </div>
              <ProListBlock items={proData.synergyPoints} icon="✦" />
            </div>
          </div>

          {/* 5. СЦЕНАРИИ */}
          <ProSectionBlock icon={Sparkles} title="Сценарии развития отношений" className="mb-6">
            <div className="space-y-4">
              {proData.scenarios.map((s, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border",
                  i === 0 ? "bg-emerald-500/5 border-emerald-500/20" :
                  i === 1 ? "bg-muted/30 border-border" :
                  "bg-destructive/5 border-destructive/20"
                )}>
                  <h4 className="font-display font-semibold text-foreground text-sm mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </ProSectionBlock>

          {/* 6. РИСКИ */}
          <ProSectionBlock icon={ShieldAlert} title="Риски отношений" variant="warning" className="mb-6">
            <ProListBlock items={proData.risks} icon="⚠" className="mb-4" />
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Повторяющиеся паттерны</h4>
              <ProTextBlock text={proData.repeatingPatterns} />
            </div>
          </ProSectionBlock>

          {/* 7. ВОЗМОЖНОСТИ */}
          <ProSectionBlock icon={Sparkles} title="Возможности пары" variant="success" className="mb-6">
            <ProListBlock items={proData.opportunities} icon="★" />
          </ProSectionBlock>

          {/* 8. РЕКОМЕНДАЦИИ */}
          <ProSectionBlock icon={CheckCircle} title="Рекомендации на каждый день" variant="highlight" className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProNumberedList items={proData.dailyLifeTips} className="mb-6" />
            
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.whatToAvoid} icon="✗" />
          </ProSectionBlock>

          {/* 9. ИТОГ */}
          <ProSectionBlock icon={Shield} title="Долгосрочный прогноз и итог" variant="highlight" className="mb-6">
            <ProTextBlock text={proData.longTermOutlook} className="mb-4" />
            <div className="border-t border-border pt-4">
              <ProTextBlock text={proData.conclusion} className="mb-3" />
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
              </div>
            </div>
          </ProSectionBlock>

          {/* Full strengths & challenges */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t("compatibility.strengths")}
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("compatibility.challenges")}
              </h3>
              <ul className="space-y-2">
                {result.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-0.5">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* Basic tier */}
      {!isPro && (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {t("compatibility.strengths")}
              </h3>
              <ul className="space-y-2">
                {result.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t("compatibility.challenges")}
              </h3>
              <ul className="space-y-2">
                {result.challenges.slice(0, 3).map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-0.5">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              В профессиональном разборе: глубокий анализ арканов пары (союз, гармония, карма), 
              финансовая и сексуальная совместимость, эмоциональная связь, зоны конфликтов и синергии, 
              3 сценария развития, повторяющиеся паттерны, рекомендации на каждый день и долгосрочный прогноз.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
