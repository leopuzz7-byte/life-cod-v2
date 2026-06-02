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
function MatrixGrid({ matrix, label }: { matrix: PersonalMatrix; label: string }) {
  return (
    <div className="gradient-card rounded-xl border border-border p-4">
      <h3 className="font-display font-semibold text-foreground mb-4 text-center">{label}</h3>
      <div className="flex flex-col items-center gap-2">
        <div className="grid grid-cols-3 gap-2">
          <MatrixCell pos={1} val={matrix.positions[0]} />
          <MatrixCell pos={2} val={matrix.positions[1]} />
          <MatrixCell pos={4} val={matrix.positions[3]} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MatrixCell pos={3} val={matrix.positions[2]} />
          <MatrixCell pos={5} val={matrix.positions[4]} />
        </div>
        <div className="flex justify-center">
          <MatrixCell pos={6} val={matrix.positions[5]} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <MatrixCell pos={7} val={matrix.positions[6]} />
          <MatrixCell pos={8} val={matrix.positions[7]} />
          <MatrixCell pos={9} val={matrix.positions[8]} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[1,2,3,4,5,6].map(pos => {
          const arcana = getArcana(matrix.positions[pos - 1]);
          return (
            <div key={pos} className="text-center">
              <span className="text-[10px] text-muted-foreground">{positionDescriptions[pos]?.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MatrixCell({ pos, val }: { pos: number; val: number }) {
  const arcana = getArcana(val);
  return (
    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex flex-col items-center justify-center">
      <span className="text-base font-display font-bold text-primary">{val}</span>
      <span className="text-[9px] text-muted-foreground leading-none">{pos}</span>
    </div>
  );
}

function CompatibilityMatrices({ result }: { result: CompatibilityResult }) {
  if (!result.matrix1 || !result.matrix2) return null;

  const matrices = [
    { matrix: result.matrix1, label: `Матрица предназначения — ${result.person1.name}` },
    { matrix: result.matrix2, label: `Матрица предназначения — ${result.person2.name}` },
    { matrix: result.unionMatrix!, label: "Общая матрица союза" },
    { matrix: result.cross1Matrix!, label: `${result.person1.name} в отношениях` },
    { matrix: result.cross2Matrix!, label: `${result.person2.name} в отношениях` },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground text-center">
        Профессиональный разбор включает 5 матриц: личная матрица каждого партнёра, общая матрица союза и индивидуальная матрица каждого в контексте ваших отношений.
      </p>
      <div className="grid md:grid-cols-2 gap-4">
        {matrices.map((m, i) => (
          <div key={i} className={i === 2 ? "md:col-span-2" : ""}>
            <MatrixGrid matrix={m.matrix} label={m.label} />
          </div>
        ))}
      </div>
    </div>
  );
}
