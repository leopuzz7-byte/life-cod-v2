import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Users, Sparkles, AlertTriangle, TrendingUp, Shield, MessageCircle, Wallet, Flame, CheckCircle, BookOpen, Zap, Brain, Target, ShieldAlert, Lightbulb, Grid3X3 } from "lucide-react";
import { CompatibilityResult, formatBirthDate, PersonalMatrix } from "@/lib/calculations";
import { getArcana, positionDescriptions } from "@/lib/arcana";
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
  const [activeTab, setActiveTab] = useState<'analysis' | 'matrices'>('analysis');

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
          {isPro ? `✦ ${t("res.proAnalysis")}` : t("res.basicAnalysis")}
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

      {/* Tab switcher — только для PRO */}
      {isPro && (
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setActiveTab('analysis')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === 'analysis' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            Разбор
          </button>
          <button
            onClick={() => setActiveTab('matrices')}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
              activeTab === 'matrices' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <Grid3X3 className="w-4 h-4" /> Матрицы
          </button>
        </div>
      )}

      {/* === ВКЛ. МАТРИЦЫ === */}
      {isPro && activeTab === 'matrices' && (
        <CompatibilityMatrices result={result} />
      )}

      {/* === ВКЛ. РАЗБОР (весь существующий контент) === */}
      {(!isPro || activeTab === 'analysis') && (
      <>

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
          <ProSectionBlock icon={BookOpen} title={t("res.compat.intro")} variant="highlight" className="mb-6">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-sm font-medium text-foreground mb-2">{t("res.compat.pairEnergy")}</h4>
              <ProTextBlock text={proData.pairEnergy} />
            </div>
          </ProSectionBlock>

          {/* 2. ОСНОВНОЙ РАЗБОР */}
          <ProSectionBlock icon={Target} title={t("res.compat.deepArcana")} className="mb-6">
            <ProTextBlock text={proData.pairDynamics} className="mb-4" />

            <div className="space-y-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  {t("compatibility.unionArcana")} ({result.unionArcana} — {unionArcana?.name})
                </h4>
                <ProTextBlock text={proData.unionDeepMeaning} />
              </div>

              <div className="bg-accent/20 rounded-xl p-4 border border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  {t("compatibility.harmonyArcana")} ({result.harmonyArcana} — {harmonyArcana?.name})
                </h4>
                <ProTextBlock text={proData.harmonyDeepMeaning} />
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {harmonyArcana?.compatibilityDescription || harmonyArcana?.personalDescription}
                </p>
              </div>
              
              <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
                <h4 className="text-sm font-medium text-foreground mb-2">
                  {t("compatibility.karmaArcana")} ({result.karmaArcana} — {karmaArcana?.name})
                </h4>
                <ProTextBlock text={proData.karmaDeepMeaning} />
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed whitespace-pre-line">
                  {karmaArcana?.personalDescription}
                </p>
              </div>
            </div>
          </ProSectionBlock>

          {/* 3. РАЗБОР ПО СФЕРАМ */}
          <ProSectionBlock icon={Wallet} title={t("res.compat.financialDynamics")} className="mb-6">
            <ProTextBlock text={proData.financialDynamics} className="mb-4" />
            <div className="grid md:grid-cols-2 gap-3">
              <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                <h5 className="text-xs font-medium text-destructive mb-1">{t("res.compat.financialRisks")}</h5>
                <p className="text-xs text-muted-foreground">{proData.financialRisks}</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">{t("res.recommendationsWord")}</h5>
                <p className="text-xs text-muted-foreground">{proData.financialRecommendations}</p>
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={TrendingUp} title={t("res.compat.careerCompat")} className="mb-6">
            <ProTextBlock text={proData.careerDynamics} className="mb-3" />
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <h5 className="text-xs font-medium text-primary mb-1">{t("res.recommendationsWord")}</h5>
              <p className="text-xs text-muted-foreground">{proData.careerRecommendations}</p>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ProSectionBlock icon={Flame} title={t("res.compat.sexualCompat")}>
              <ProTextBlock text={proData.sexualChemistry} className="mb-3" />
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">{t("res.recommendationsWord")}</h5>
                <p className="text-xs text-muted-foreground">{proData.sexualRecommendations}</p>
              </div>
            </ProSectionBlock>

            <ProSectionBlock icon={Brain} title={t("res.compat.emotionalBond")}>
              <ProTextBlock text={proData.emotionalDynamics} className="mb-3" />
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <h5 className="text-xs font-medium text-primary mb-1">{t("res.recommendationsWord")}</h5>
                <p className="text-xs text-muted-foreground">{proData.emotionalRecommendations}</p>
              </div>
            </ProSectionBlock>
          </div>

          {/* 4. СВЯЗКИ И ВЗАИМОДЕЙСТВИЕ */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="gradient-card rounded-xl p-5 border border-destructive/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h3 className="font-display font-semibold text-foreground text-sm">{t("res.compat.conflictZones")}</h3>
              </div>
              <ProListBlock items={proData.conflictZones} icon="⚠" />
            </div>
            <div className="gradient-card rounded-xl p-5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-semibold text-foreground text-sm">{t("res.compat.growthZones")}</h3>
              </div>
              <ProListBlock items={proData.growthAreas} icon="↑" />
            </div>
            <div className="gradient-card rounded-xl p-5 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground text-sm">{t("res.matrix.synergy")}</h3>
              </div>
              <ProListBlock items={proData.synergyPoints} icon="✦" />
            </div>
          </div>

          {/* 5. СЦЕНАРИИ */}
          <ProSectionBlock icon={Sparkles} title={t("res.compat.scenarios")} className="mb-6">
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
          <ProSectionBlock icon={ShieldAlert} title={t("res.compat.risksTitle")} variant="warning" className="mb-6">
            <ProListBlock items={proData.risks} icon="⚠" className="mb-4" />
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">{t("res.compat.repeatingPatterns")}</h4>
              <ProTextBlock text={proData.repeatingPatterns} />
            </div>
          </ProSectionBlock>

          {/* 7. ВОЗМОЖНОСТИ */}
          <ProSectionBlock icon={Sparkles} title={t("res.compat.opportunities")} variant="success" className="mb-6">
            <ProListBlock items={proData.opportunities} icon="★" />
          </ProSectionBlock>

          {/* 8. РЕКОМЕНДАЦИИ */}
          <ProSectionBlock icon={CheckCircle} title={t("res.compat.dailyRec")} variant="highlight" className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">{t("res.whatToDo")}</h4>
            <ProNumberedList items={proData.dailyLifeTips} className="mb-6" />

            <h4 className="text-sm font-medium text-destructive mb-3">{t("res.whatToAvoid")}</h4>
            <ProListBlock items={proData.whatToAvoid} icon="✗" />
          </ProSectionBlock>

          {/* 9. ИТОГ */}
          <ProSectionBlock icon={Shield} title={t("res.compat.longTerm")} variant="highlight" className="mb-6">
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
              {t("res.compat.proFooter")}
            </p>
          </div>
        </>
      )}

      </> /* конец обёртки вкладки "Разбор" */
      )}
    </div>
  );
}

// ===== Компонент 5 матриц =====

function CMatrixCell({ position, value, highlight = false }: { position: number; value: number; highlight?: boolean }) {
  return (
    <div className={cn(
      "w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all",
      highlight ? "bg-amber-500/20 border-2 border-amber-500/60" : "bg-muted border border-border"
    )}>
      <span className={cn("text-xl font-display font-bold", highlight ? "text-amber-600" : "text-foreground")}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{position}</span>
    </div>
  );
}

function PersonMatrix({ matrix, name, color, emoji }: {
  matrix: PersonalMatrix;
  name: string;
  color: 'primary' | 'rose';
  emoji: string;
}) {
  const p = matrix.positions;
  const isRose = color === 'rose';
  const borderClass = isRose ? 'border-rose-300/30' : 'border-primary/30';
  const bgClass = isRose ? 'bg-rose-400/5' : 'bg-primary/5';
  const textClass = isRose ? 'text-rose-400' : 'text-primary';
  const badgeBg = isRose ? 'bg-rose-400/10 text-rose-400' : 'bg-primary/10 text-primary';

  const soulArcana = getArcana(p[0]);       // поз. 1 — детство/душа
  const innerArcana = getArcana(p[1]);      // поз. 2 — внутренняя суть
  const socialArcana = getArcana(p[2]);     // поз. 3 — таланты/социум
  const destinyArcana = getArcana(p[3]);    // поз. 4 — цель мудрости
  const profArcana = getArcana(p[4]);       // поз. 5 — призвание
  const supportArcana = getArcana(p[5]);    // поз. 6 — точка опоры
  const goalArcana = getArcana(p[6]);       // поз. 7 — цель жизни
  const toolArcana = getArcana(p[7]);       // поз. 8 — инструмент

  return (
    <div className={cn("gradient-card rounded-2xl border p-5 md:p-6 space-y-5", borderClass)}>
      {/* Шапка */}
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0", bgClass)}>
          {emoji}
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Матрица предназначения</p>
          <h3 className={cn("font-display font-bold text-lg", textClass)}>{name}</h3>
        </div>
      </div>

      {/* Живой вводный текст — конкретный */}
      <div className={cn("rounded-xl p-4 border text-sm text-muted-foreground leading-relaxed space-y-2", bgClass, borderClass)}>
        <p>
          В основе личности {name} — аркан <strong className="text-foreground">{p[1]} «{innerArcana?.name}»</strong> (внутренняя суть). {innerArcana?.personalDescription?.split('.')[0]}.
        </p>
        <p>
          Главная цель жизни — аркан <strong className="text-foreground">{p[6]} «{goalArcana?.name}»</strong>. {goalArcana?.personalDescription?.split('.')[0]}.
        </p>
        <p>
          В отношения {name} привносит энергию аркана <strong className="text-foreground">{p[2]} «{socialArcana?.name}»</strong> — именно так этот человек проявляется в контакте с другими.
        </p>
      </div>

      {/* Матрица */}
      <div className={cn("rounded-xl p-4 border", bgClass, borderClass)}>
        <p className="text-[11px] text-muted-foreground text-center mb-3 uppercase tracking-wide">Матрица позиций</p>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2 md:gap-3">
            <CMatrixCell position={1} value={p[0]} />
            <CMatrixCell position={2} value={p[1]} highlight />
            <CMatrixCell position={4} value={p[3]} />
          </div>
          <div className="flex gap-2 md:gap-3">
            <CMatrixCell position={3} value={p[2]} />
            <CMatrixCell position={5} value={p[4]} />
          </div>
          <CMatrixCell position={6} value={p[5]} />
          <div className="w-full h-px bg-border/40 my-1" />
          <div className="flex gap-2 md:gap-3">
            <CMatrixCell position={7} value={p[6]} highlight />
            <CMatrixCell position={8} value={p[7]} />
            <CMatrixCell position={9} value={p[8]} />
          </div>
        </div>
      </div>

      {/* 4 ключевые позиции с конкретными описаниями */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">🔑 Ключевые позиции</p>
        <div className="space-y-2">
          {[
            { pos: 2, label: "Внутренняя суть", icon: "✦", arcana: innerArcana, val: p[1] },
            { pos: 4, label: "Цель накопления мудрости", icon: "◈", arcana: destinyArcana, val: p[3] },
            { pos: 5, label: "Профессиональное призвание", icon: "◉", arcana: profArcana, val: p[4] },
            { pos: 7, label: "Главная цель жизни", icon: "★", arcana: goalArcana, val: p[6] },
          ].map(({ pos, label, icon, arcana, val }) => (
            <div key={pos} className={cn("rounded-xl px-4 py-3 border", bgClass, borderClass)}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-sm shrink-0", textClass)}>{icon}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
                <span className={cn("ml-auto text-sm font-display font-bold", textClass)}>{val} — {arcana?.name}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                {arcana?.personalDescription?.split('.').slice(0, 2).join('. ')}.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Профессии */}
      {destinyArcana?.professions?.length ? (
        <div>
          <p className="text-xs text-muted-foreground mb-2">💼 Сферы реализации</p>
          <div className="flex flex-wrap gap-1.5">
            {destinyArcana.professions.slice(0, 5).map((prof, i) => (
              <span key={i} className={cn("text-xs px-2.5 py-1 rounded-full border", badgeBg, borderClass)}>{prof}</span>
            ))}
          </div>
        </div>
      ) : null}

      {/* Точка опоры */}
      <div className={cn("rounded-xl p-3 border", bgClass, borderClass)}>
        <p className="text-xs text-muted-foreground mb-1">⚓ Точка опоры — аркан {p[5]} «{supportArcana?.name}»</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {supportArcana?.personalDescription?.split('.')[0]}. Это зона комфорта — то, на что {name} опирается в трудные моменты, но от чего важно постепенно двигаться дальше.
        </p>
      </div>
    </div>
  );
}

function UnionMatrixBlock({ matrix, result }: { matrix: PersonalMatrix; result: CompatibilityResult }) {
  const p = matrix.positions;
  const unionArcana = getArcana(result.unionArcana);
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);

  return (
    <div className="gradient-card rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 md:p-6 space-y-5">
      {/* Шапка */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-xl">💫</div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Общая матрица</p>
          <h3 className="font-display font-bold text-lg text-amber-600">{result.person1.name} & {result.person2.name}</h3>
        </div>
      </div>

      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-muted-foreground leading-relaxed space-y-2">
        <p>
          Когда {result.person1.name} и {result.person2.name} встречаются — рождается новая энергия. Аркан союза <strong className="text-foreground">{result.unionArcana} «{unionArcana?.name}»</strong> описывает саму суть этих отношений.
        </p>
        <p>{unionArcana?.compatibilityDescription?.split('.').slice(0, 2).join('. ')}.</p>
      </div>

      {/* Матрица */}
      <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <CMatrixCell position={1} value={p[0]} />
            <CMatrixCell position={2} value={p[1]} highlight />
            <CMatrixCell position={4} value={p[3]} />
          </div>
          <div className="flex gap-2">
            <CMatrixCell position={3} value={p[2]} />
            <CMatrixCell position={5} value={p[4]} />
          </div>
          <CMatrixCell position={6} value={p[5]} highlight />
          <div className="w-full h-px bg-border/40 my-1" />
          <div className="flex gap-2">
            <CMatrixCell position={7} value={p[6]} />
            <CMatrixCell position={8} value={p[7]} />
            <CMatrixCell position={9} value={p[8]} />
          </div>
        </div>
      </div>

      {/* 3 ключевых аркана союза с описаниями */}
      <div className="space-y-3">
        <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">❤️</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Аркан союза</p>
              <p className="font-display font-bold text-primary">{result.unionArcana} — {unionArcana?.name}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {unionArcana?.compatibilityDescription?.split('.').slice(2, 4).join('. ')}.
          </p>
        </div>

        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">🌿</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Аркан гармонии — как вам хорошо вместе</p>
              <p className="font-display font-bold text-emerald-600">{result.harmonyArcana} — {harmonyArcana?.name}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {harmonyArcana?.compatibilityDescription?.split('.').slice(0, 2).join('. ')}.
          </p>
        </div>

        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">⚖️</span>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Кармический аркан — что нужно проработать</p>
              <p className="font-display font-bold text-destructive">{result.karmaArcana} — {karmaArcana?.name}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {karmaArcana?.personalDescription?.split('.').slice(0, 2).join('. ')}.
          </p>
        </div>
      </div>

      {/* Дополнительные матрицы в отношениях */}
      {result.cross1Matrix && result.cross2Matrix && (
        <div className="border-t border-amber-500/20 pt-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">🔄 Каждый в этих отношениях</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { matrix: result.cross1Matrix, name: result.person1.name },
              { matrix: result.cross2Matrix, name: result.person2.name },
            ].map(({ matrix: m, name }, idx) => (
              <div key={idx} className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <p className="text-xs font-medium text-amber-600 mb-2 text-center">{name}</p>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex gap-1.5">
                    <CMatrixCell position={1} value={m.positions[0]} />
                    <CMatrixCell position={2} value={m.positions[1]} />
                    <CMatrixCell position={4} value={m.positions[3]} />
                  </div>
                  <div className="flex gap-1.5">
                    <CMatrixCell position={3} value={m.positions[2]} />
                    <CMatrixCell position={5} value={m.positions[4]} />
                  </div>
                  <CMatrixCell position={6} value={m.positions[5]} />
                  <div className="w-full h-px bg-border/30 my-0.5" />
                  <div className="flex gap-1.5">
                    <CMatrixCell position={7} value={m.positions[6]} />
                    <CMatrixCell position={8} value={m.positions[7]} />
                    <CMatrixCell position={9} value={m.positions[8]} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CompatibilityMatrices({ result }: { result: CompatibilityResult }) {
  if (!result.matrix1 || !result.matrix2) return null;

  const p1 = result.person1;
  const p2 = result.person2;

  return (
    <div className="space-y-6">
      {/* Вводный текст */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          ✨ <strong className="text-foreground">5 матриц</strong> — это полный энергетический портрет вашей пары. Начнём с каждого по отдельности, потом посмотрим что рождается между вами.
        </p>
      </div>

      {/* 1. Матрица первого */}
      <PersonMatrix
        matrix={result.matrix1}
        name={p1.name}
        color="primary"
        emoji="🌟"
      />

      {/* Разделитель */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-sm px-2">и</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 2. Матрица второго */}
      <PersonMatrix
        matrix={result.matrix2}
        name={p2.name}
        color="rose"
        emoji="🌹"
      />

      {/* Разделитель */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground text-sm px-2">вместе</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* 3. Общая матрица + кросс-матрицы */}
      <UnionMatrixBlock matrix={result.unionMatrix!} result={result} />
    </div>
  );
}
