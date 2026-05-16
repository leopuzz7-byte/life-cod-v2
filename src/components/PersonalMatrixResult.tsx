import { useTranslation } from "react-i18next";
import { PersonalMatrix, formatBirthDate } from "@/lib/calculations";
import { positionDescriptions, successCodePositions, lifePeriods, getArcanaName, getArcana } from "@/lib/arcana";
import { ArcanaCard } from "./ArcanaCard";
import { ProArcanaCard } from "./ProArcanaCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Star, Clock, Link2, FileText, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import type { TierType } from "@/lib/analysisConfig";
import { getPositionInterpretation, getCrossPositionLinks, generateMatrixSummary, type CrossPositionLink } from "@/lib/matrixInterpretation";

interface PersonalMatrixResultProps {
  matrix: PersonalMatrix;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

type TabType = "main" | "diagonal" | "karmic" | "success" | "periods" | "links" | "summary";

export function PersonalMatrixResult({ matrix, name, onReset, tier = 'basic' }: PersonalMatrixResultProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("main");
  const isPro = tier === 'professional';

  const formattedDate = formatBirthDate(matrix.birthDate.day, matrix.birthDate.month, matrix.birthDate.year);

  const handleDownloadPDF = async () => {
    const sections = [];
    const posCount = isPro ? 12 : 6;
    for (let pos = 1; pos <= posCount; pos++) {
      const arcanaNumber = matrix.positions[pos - 1];
      const arcana = getArcana(arcanaNumber);
      const posDesc = positionDescriptions[pos];
      const content = [posDesc?.description || "", "", arcana?.personalDescription || ""];
      if (arcana?.professions && arcana.professions.length > 0) {
        content.push("", `${t("matrix.suitableProfessions")}: ${arcana.professions.join(", ")}`);
      }
      sections.push({
        title: `${t("results.position")} ${pos}: ${posDesc?.title || ""} — ${arcanaNumber} (${arcana?.name || ""})`,
        content,
        highlight: pos === 12,
      });
    }
    if (isPro) {
      sections.push({
        title: t("results.successCode"),
        content: matrix.successCode.map((a, i) => {
          const arcana = getArcana(a);
          return `${t("results.pos")} ${successCodePositions[i]}: ${a} — ${arcana?.name || ""}`;
        }),
      });
    }
    await generatePDF({
      title: t("results.yourPurpose"),
      subtitle: isPro ? "Профессиональный разбор" : "Базовый разбор",
      birthDate: formatBirthDateForPDF(matrix.birthDate.day, matrix.birthDate.month, matrix.birthDate.year),
      name: name || undefined,
      sections,
    });
  };

  const isMirrorPosition = (position: number): boolean => matrix.mirrorArcana.some(m => m.positions.includes(position));
  const isReversedPosition = (position: number): boolean => matrix.reversedArcana.some(r => r.positions.includes(position));

  const basicTabs = [
    { id: "main" as TabType, label: t("results.mainTriangle") },
  ];

  const proTabs = [
    { id: "main" as TabType, label: t("results.mainTriangle") },
    { id: "diagonal" as TabType, label: t("results.lifeGoals") },
    { id: "karmic" as TabType, label: t("results.karma") },
    { id: "success" as TabType, label: t("results.successCode") },
    { id: "periods" as TabType, label: t("results.lifePeriods") },
    { id: "links" as TabType, label: "Связки позиций" },
    { id: "summary" as TabType, label: "Итоговый анализ" },
  ];

  const visibleTabs = isPro ? proTabs : basicTabs;

  // Pro data
  const crossLinks = isPro ? getCrossPositionLinks(matrix) : [];
  const summary = isPro ? generateMatrixSummary(matrix) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
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
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">{t("results.yourPurpose")}</h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Matrix visualization */}
      <div className="gradient-card rounded-2xl p-6 border border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <Compass className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-display text-foreground">{t("results.personalMatrix")}</h2>
        </div>

        {isPro ? (
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <MatrixCell position={10} value={matrix.positions[9]} />
              <MatrixCell position={11} value={matrix.positions[10]} />
              <MatrixCell position={12} value={matrix.positions[11]} isHighlight />
            </div>
            <div className="w-full h-px bg-border/50 my-2" />
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <MatrixCell position={1} value={matrix.positions[0]} isMirror={isMirrorPosition(1)} isReversed={isReversedPosition(1)} />
              <MatrixCell position={2} value={matrix.positions[1]} isMirror={isMirrorPosition(2)} isReversed={isReversedPosition(2)} />
              <MatrixCell position={4} value={matrix.positions[3]} isMirror={isMirrorPosition(4)} isReversed={isReversedPosition(4)} />
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <MatrixCell position={3} value={matrix.positions[2]} isMirror={isMirrorPosition(3)} isReversed={isReversedPosition(3)} />
              <MatrixCell position={5} value={matrix.positions[4]} isMirror={isMirrorPosition(5)} isReversed={isReversedPosition(5)} />
            </div>
            <div className="flex justify-center">
              <MatrixCell position={6} value={matrix.positions[5]} isMirror={isMirrorPosition(6)} isReversed={isReversedPosition(6)} />
            </div>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4">
              <MatrixCell position={7} value={matrix.positions[6]} />
              <MatrixCell position={8} value={matrix.positions[7]} />
              <MatrixCell position={9} value={matrix.positions[8]} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <MatrixCell position={1} value={matrix.positions[0]} isMirror={isMirrorPosition(1)} isReversed={isReversedPosition(1)} />
              <MatrixCell position={2} value={matrix.positions[1]} isMirror={isMirrorPosition(2)} isReversed={isReversedPosition(2)} />
              <MatrixCell position={4} value={matrix.positions[3]} isMirror={isMirrorPosition(4)} isReversed={isReversedPosition(4)} />
            </div>
            <div className="grid grid-cols-2 gap-2 md:gap-4">
              <MatrixCell position={3} value={matrix.positions[2]} isMirror={isMirrorPosition(3)} isReversed={isReversedPosition(3)} />
              <MatrixCell position={5} value={matrix.positions[4]} isMirror={isMirrorPosition(5)} isReversed={isReversedPosition(5)} />
            </div>
            <div className="flex justify-center">
              <MatrixCell position={6} value={matrix.positions[5]} isMirror={isMirrorPosition(6)} isReversed={isReversedPosition(6)} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/20 border border-primary" />
            <span className="text-muted-foreground">{t("results.legend.mirror")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
            <span className="text-muted-foreground">{t("results.legend.reversed")}</span>
          </div>
          {isPro && (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500" />
              <span className="text-muted-foreground">{t("results.legend.mainTask")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {/* === MAIN TAB === */}
        {activeTab === "main" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              {t("results.mainTriangle")}
              <span className="text-sm text-muted-foreground font-normal">({t("results.positions")} 1-6)</span>
            </h2>
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5, 6].map((pos) =>
                isPro ? (
                  <ProArcanaCard
                    key={pos}
                    interpretation={getPositionInterpretation(pos, matrix.positions[pos - 1])}
                    isMirror={isMirrorPosition(pos)}
                    isReversed={isReversedPosition(pos)}
                  />
                ) : (
                  <ArcanaCard
                    key={pos}
                    number={matrix.positions[pos - 1]}
                    position={pos}
                    positionTitle={positionDescriptions[pos]?.title}
                    positionDescription={positionDescriptions[pos]?.description}
                    isMirror={isMirrorPosition(pos)}
                    isReversed={isReversedPosition(pos)}
                    compact={true}
                  />
                )
              )}
            </div>
            {!isPro && (
              <div className="mt-6 p-4 rounded-xl border border-primary/20 bg-primary/5 text-center">
                <p className="text-sm text-muted-foreground mb-1">Это базовый разбор — 6 из 12 позиций</p>
                <p className="text-xs text-muted-foreground">
                  Профессиональный разбор включает все 12 позиций, связки, кармический треугольник, код успеха, жизненные периоды и итоговый анализ
                </p>
              </div>
            )}
          </>
        )}

        {/* === DIAGONAL (PRO) === */}
        {isPro && activeTab === "diagonal" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              {t("results.diagonalRow")}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">
              Диагональ судьбы определяет вашу цель жизни (позиция 7), инструмент достижения (позиция 8) и зону комфорта (позиция 9).
            </p>
            <div className="grid gap-4">
              {[7, 8, 9].map((pos) => (
                <ProArcanaCard
                  key={pos}
                  interpretation={getPositionInterpretation(pos, matrix.positions[pos - 1])}
                />
              ))}
            </div>
          </>
        )}

        {/* === KARMIC (PRO) === */}
        {isPro && activeTab === "karmic" && (
          <>
            <h2 className="text-lg font-display text-foreground">{t("results.karmicTriangle")}</h2>
            <p className="text-sm text-muted-foreground mb-4">{t("results.karmicTriangleDesc")}</p>
            <div className="grid gap-4">
              {[10, 11, 12].map((pos) => (
                <ProArcanaCard
                  key={pos}
                  interpretation={getPositionInterpretation(pos, matrix.positions[pos - 1])}
                />
              ))}
            </div>
          </>
        )}

        {/* === SUCCESS CODE (PRO) === */}
        {isPro && activeTab === "success" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {t("results.successCode")}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{t("results.successCodeDesc")}</p>
            <div className="flex justify-center gap-3 mb-6">
              {matrix.successCode.map((arcana, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                    <span className="text-xl font-display font-bold text-amber-600">{arcana}</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{t("results.pos")} {successCodePositions[index]}</span>
                </div>
              ))}
            </div>
            <div className="grid gap-4">
              {successCodePositions.map((pos, index) => (
                <ProArcanaCard
                  key={pos}
                  interpretation={getPositionInterpretation(pos, matrix.successCode[index])}
                />
              ))}
            </div>
          </>
        )}

        {/* === PERIODS (PRO) === */}
        {isPro && activeTab === "periods" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              {t("results.lifePeriods")}
            </h2>
            <div className="grid gap-4">
              {lifePeriods.map((period, index) => (
                <div key={index} className="gradient-card rounded-xl p-4 border border-border">
                  <h3 className="font-display font-semibold text-foreground mb-2">{period.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{period.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {period.positions.map((pos) => {
                      const arcana = getArcana(matrix.positions[pos - 1]);
                      return (
                        <div key={pos} className="flex flex-col items-center bg-muted/50 rounded-lg p-2 min-w-[60px]">
                          <span className="text-lg font-display font-bold text-primary">{matrix.positions[pos - 1]}</span>
                          <span className="text-xs text-muted-foreground">{arcana?.name || ''}</span>
                          <span className="text-[10px] text-muted-foreground/60">поз. {pos}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* === CROSS-POSITION LINKS (PRO) === */}
        {isPro && activeTab === "links" && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Связки позиций
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Анализ комбинаций чисел в матрице — как позиции влияют друг на друга, где есть конфликты и усиления.
            </p>
            <div className="grid gap-4">
              {crossLinks.map((link, i) => (
                <CrossLinkCard key={i} link={link} matrix={matrix} />
              ))}
            </div>
          </>
        )}

        {/* === SUMMARY (PRO) === */}
        {isPro && activeTab === "summary" && summary && (
          <>
            <h2 className="text-lg font-display text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Итоговый анализ
            </h2>

            {/* Overall profile */}
            <div className="gradient-card rounded-xl p-5 border border-primary/30">
              <h3 className="font-display font-semibold text-foreground mb-3">Общая картина</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{summary.overallProfile}</p>
            </div>

            {/* Key problems */}
            <div className="rounded-xl p-5 border border-destructive/20 bg-destructive/5">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" /> Ключевые проблемы
              </h3>
              <ul className="space-y-2">
                {summary.keyProblems.map((p, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive mt-0.5 shrink-0">⚠</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth points */}
            <div className="rounded-xl p-5 border border-emerald-500/20 bg-emerald-500/5">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> Точки роста
              </h3>
              <ul className="space-y-2">
                {summary.growthPoints.map((g, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✦</span> {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic recommendations */}
            <div className="rounded-xl p-5 border border-primary/20 bg-primary/5">
              <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" /> Стратегические рекомендации
              </h3>
              <ol className="space-y-2">
                {summary.strategicRecommendations.map((r, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span> {r}
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* === Sub-components === */

function MatrixCell({ position, value, isMirror = false, isReversed = false, isHighlight = false }: { position: number; value: number; isMirror?: boolean; isReversed?: boolean; isHighlight?: boolean }) {
  return (
    <div className={cn(
      "w-14 h-14 md:w-16 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all",
      isMirror && "bg-primary/20 border-2 border-primary",
      isReversed && !isMirror && "bg-destructive/20 border-2 border-destructive",
      isHighlight && !isMirror && !isReversed && "bg-amber-500/20 border-2 border-amber-500",
      !isMirror && !isReversed && !isHighlight && "bg-muted border border-border"
    )}>
      <span className={cn(
        "text-xl font-display font-bold",
        isMirror && "text-primary",
        isReversed && !isMirror && "text-destructive",
        isHighlight && !isMirror && !isReversed && "text-amber-600",
        !isMirror && !isReversed && !isHighlight && "text-foreground"
      )}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{position}</span>
    </div>
  );
}

function CrossLinkCard({ link, matrix }: { link: CrossPositionLink; matrix: PersonalMatrix }) {
  const [p1, p2] = link.positions;
  const v1 = matrix.positions[p1 - 1];
  const v2 = matrix.positions[p2 - 1];
  const a1 = getArcana(v1);
  const a2 = getArcana(v2);

  return (
    <div className={cn(
      "rounded-xl p-4 border",
      link.type === 'synergy' && "border-emerald-500/30 bg-emerald-500/5",
      link.type === 'conflict' && "border-destructive/30 bg-destructive/5",
      link.type === 'neutral' && "border-border bg-card",
    )}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1">
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{v1}</span>
          <span className="text-xs text-muted-foreground">↔</span>
          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{v2}</span>
        </div>
        <div>
          <h4 className="text-sm font-medium text-foreground">{link.title}</h4>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            link.type === 'synergy' && "bg-emerald-500/10 text-emerald-600",
            link.type === 'conflict' && "bg-destructive/10 text-destructive",
            link.type === 'neutral' && "bg-muted text-muted-foreground",
          )}>
            {link.type === 'synergy' ? '✦ Синергия' : link.type === 'conflict' ? '⚡ Конфликт' : '○ Нейтральная связь'}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{link.description}</p>
      <div className="flex gap-4 mt-2 text-xs text-muted-foreground/80">
        <span>{a1?.name} ({a1?.element})</span>
        <span>{a2?.name} ({a2?.element})</span>
      </div>
    </div>
  );
}
