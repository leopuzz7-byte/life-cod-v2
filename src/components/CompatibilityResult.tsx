import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Heart, Compass, Clock, TrendingUp, Star, Anchor,
  Target, ShieldAlert, CheckCircle, Users, X, Layers,
  ChevronDown, ChevronUp, Sparkles, Key
} from "lucide-react";
import { useAIReading } from "@/hooks/useAIReading";
import { CompatibilityResult, PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { arcanaCompatibilityData } from "@/lib/arcanaCompatibilityData";
import { getCompatPositionText } from "@/lib/compatibilityTexts";
import { getPositionInterpretation } from "@/lib/matrixInterpretation";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { LoadingScreen } from "./LoadingScreen";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import type { TierType } from "@/lib/analysisConfig";

// ─── Совместимостные тексты ────────────────────────────────────────────────────

const compatPositionTitles: Record<number, string> = {
  1: "Начало союза",
  2: "Суть союза",
  3: "Пара вовне",
  4: "Мудрость отношений",
  5: "Совместный путь",
  6: "Основа отношений",
  7: "Общая цель",
  8: "Инструмент достижения",
  9: "Зона комфорта пары",
  10: "Ошибка прошлого воплощения",
  11: "Задача прошлого воплощения",
  12: "Космическая задача пары",
};

const compatPositionIntros: Record<number, string> = {
  1: "Первый импульс, с которого всё началось. Эта позиция описывает природу встречи — что притянуло двух людей друг к другу, какую энергию они почувствовали в самом начале. Это не обязательно «счастливое начало» — это честный портрет первого периода отношений.",
  2: "Самая важная позиция в матрице союза — аркан союза. Это не характеристика кого-то одного: это энергия, которая рождается между ними. Она определяет характер и глубинный смысл этих отношений на всём протяжении.",
  3: "Как пара выглядит снаружи — что видят друзья, семья, коллеги. Это общий социальный образ, то, что они транслируют миру, то, за что их знают как пару.",
  4: "Это позиция зрелых отношений. Мудрость, к которой пара приходит со временем — если оба готовы учиться у своего союза. Не «награда за терпение», а потенциал, который накапливается в живых отношениях.",
  5: "Профессиональная и социальная совместимость — могут ли они расти в одну сторону или хотя бы поддерживать пути друг друга. Как их амбиции взаимодействуют: дополняют, конкурируют или вдохновляют.",
  6: "В матрице совместимости эта позиция занята кармическим арканом. Это ключевой вызов пары — то, что будет возникать снова и снова, пока оба не проработают это вместе. Но это и скрытый ресурс: именно здесь спрятана точка глубокого роста.",
  7: "Зачем эти двое встретились с точки зрения жизненных целей. Какое движение рождается из союза — куда они идут вместе, осознанно или нет.",
  8: "Конкретный способ, которым пара реализует свою общую цель. Методы, инструменты, подходы — то, что работает именно для этого союза.",
  9: "Состояние, в котором оба партнёра восстанавливаются — то, что заряжает их вместе. Важно уметь находить это состояние и не застревать в нём.",
  10: "Кармические паттерны из прошлого, которые оба принесли в эти отношения. Ситуации, которые будут повторяться, пока их не проработают вместе — не по отдельности.",
  11: "Автоматические сценарии этих отношений. «Снова наступаем на одни грабли» — именно про эту позицию. Осознание паттерна обоими уже наполовину его снимает.",
  12: "Главная кармическая задача всего союза. То, ради чего эти двое встретились на глубинном уровне. Когда задача решается — многое в отношениях начинает рассасываться само собой.",
};

const TRIANGLES = [
  {
    num: 1,
    label: "Начало отношений",
    positions: [1, 2, 3] as const,
    intro: "Первый треугольник — это сама встреча. Первый период отношений: почему притянулись, как начинали, что стало фундаментом. Три позиции здесь составляют основной тон союза.",
  },
  {
    num: 2,
    label: "Динамика отношений",
    positions: [2, 3, 5] as const,
    intro: "Второй треугольник показывает, как пара живёт внутри союза — суть и образ отношений встречаются с совместным путём в мире.",
  },
  {
    num: 3,
    label: "Зрелость союза",
    positions: [2, 4, 5] as const,
    intro: "Третий треугольник — это куда ведут отношения при долгом развитии. Суть союза соединяется с накопленной мудростью и совместным путём.",
  },
];

// Pre-computed: which positions have been shown in earlier triangles
const TRIANGLE_SHOWN_SETS: Set<number>[] = TRIANGLES.map((tri, idx) => {
  const shown = new Set<number>();
  if (idx > 0) {
    tri.positions.forEach(pos => {
      if (TRIANGLES.slice(0, idx).some(prev => (prev.positions as readonly number[]).includes(pos))) {
        shown.add(pos);
      }
    });
  }
  return shown;
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getArcanaImage(n: number): string {
  return `/arcana/arcana-${n}.webp`;
}

// ─── ArcanaModal ───────────────────────────────────────────────────────────────

function ArcanaModal({ value, onClose }: { value: number; onClose: () => void }) {
  const imgSrc = getArcanaImage(value);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 w-full sm:w-auto flex flex-col items-center pb-6 pt-4 sm:pb-0 sm:pt-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 transition-colors flex items-center justify-center text-white shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        <img
          src={imgSrc}
          alt={`Аркан ${value}`}
          draggable={false}
          className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:max-h-[80vh] sm:h-[520px]"
        />
      </div>
    </div>
  );
}

// ─── MatrixCell (card style, clickable) ────────────────────────────────────────

function MatrixCell({ position, value, isHighlight = false }: { position: number; value: number; isHighlight?: boolean }) {
  const imgSrc = getArcanaImage(value);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), []);
  return (
    <>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer",
          "w-12 h-[72px] md:w-14 md:h-[84px]",
          isHighlight ? "ring-2 ring-primary shadow-[0_0_8px_2px] shadow-primary/30" : "ring-1 ring-border/60"
        )}
        onClick={() => setModalOpen(true)}
      >
        <img src={imgSrc} alt={`Аркан ${value}`} className="w-full h-full object-cover" draggable={false} />
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center py-[2px]">
          <span className={cn("text-[10px] font-bold leading-none", isHighlight ? "text-primary-foreground" : "text-white/90")}>
            {value}
          </span>
        </div>
        <div className={cn(
          "absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold leading-none",
          isHighlight ? "bg-primary text-primary-foreground" : "bg-black/50 text-white/80"
        )}>
          {position}
        </div>
      </div>
      {modalOpen && <ArcanaModal value={value} onClose={handleClose} />}
    </>
  );
}

// ─── MatrixGrid ─────────────────────────────────────────────────────────────────

function MatrixGrid({ matrix, accentPos2 = false }: { matrix: PersonalMatrix; accentPos2?: boolean }) {
  const p = matrix.positions;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={10} value={p[9]} />
        <MatrixCell position={11} value={p[10]} />
        <MatrixCell position={12} value={p[11]} isHighlight />
      </div>
      <div className="w-full h-px bg-border/40 my-0.5" />
      <div className="flex flex-col items-start gap-2 md:gap-3">
        <div className="flex gap-2 md:gap-3">
          <MatrixCell position={1} value={p[0]} />
          <MatrixCell position={2} value={p[1]} isHighlight={accentPos2} />
          <MatrixCell position={4} value={p[3]} />
        </div>
        <div className="flex gap-2 md:gap-3 ml-[28px] md:ml-[34px]">
          <MatrixCell position={3} value={p[2]} />
          <MatrixCell position={5} value={p[4]} />
        </div>
        <div className="ml-[56px] md:ml-[68px]">
          <MatrixCell position={6} value={p[5]} />
        </div>
      </div>
      <div className="w-full h-px bg-border/40 my-0.5" />
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={7} value={p[6]} />
        <MatrixCell position={8} value={p[7]} />
        <MatrixCell position={9} value={p[8]} />
      </div>
    </div>
  );
}

// ─── CompCard — главная карта аркана для разбора ────────────────────────────────

interface CompCardProps {
  position: number;
  value: number;
  positionTitle: string;
  contextIntro: string;
  expandableLabel?: string;    // label for the expand toggle (default: 'Энергия аркана')
  expandableContent?: string;  // content for expandable section (overrides arcana desc)
  accentColor?: 'primary' | 'violet';
  highlight?: boolean;
}

function CompCard({ position, value, positionTitle, contextIntro, expandableLabel, expandableContent, accentColor = 'primary', highlight = false }: CompCardProps) {
  const arcana = getArcana(value);
  if (!arcana) return null;
  const imgSrc = getArcanaImage(value);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isViolet = accentColor === 'violet';
  const accentText = isViolet ? "text-primary" : "text-primary";
  const accentBorder = isViolet ? "border-primary/40" : "border-primary/30";
  const accentBg = isViolet ? "bg-primary/8" : "bg-primary/8";

  return (
    <div className={cn(
      "gradient-card rounded-2xl overflow-hidden",
      highlight ? `border ${accentBorder}` : "border border-border"
    )}>
      {/* Top: image + position info */}
      <div className="flex items-start gap-4 p-4">
        {/* Arcana card image */}
        <button
          className="relative w-[50px] h-[75px] rounded-xl overflow-hidden shrink-0 ring-1 ring-border/60 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setModalOpen(true)}
          aria-label={`Открыть аркан ${value}`}
        >
          <img src={imgSrc} alt={`Аркан ${value}`} className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[2px]">
            <span className={cn("text-[9px] font-bold leading-none", highlight ? accentText : "text-white/90")}>{value}</span>
          </div>
        </button>

        {/* Position + arcana info */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground mb-0.5">
            Поз. {position} · {positionTitle}
          </div>
          <div className={cn("font-display font-bold text-xl leading-tight", highlight ? accentText : "text-foreground")}>
            {arcana.name}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{arcana.planet} · {arcana.element}</div>
        </div>
      </div>

      {/* Context intro */}
      <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
        {contextIntro}
      </div>

      {/* Expandable section */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{expanded ? 'Скрыть' : (expandableLabel ?? 'Энергия аркана')}</span>
        </button>
        {expanded && (
          <div className={cn("mt-2 rounded-xl p-3 text-sm text-muted-foreground leading-relaxed", highlight ? `${accentBg} border ${accentBorder}` : "bg-muted/25")}>
            {expandableContent ?? (arcana.compatibilityDescription || arcana.personalDescription)}
          </div>
        )}
      </div>

      {modalOpen && <ArcanaModal value={value} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// Обёртка для совместимости — contextIntro динамический (по аркану × позиции)
function CompatCard({ position, value, highlight = false, context = 'union', aiText }: {
  position: number;
  value: number;
  highlight?: boolean;
  context?: 'union' | 'cross';
  aiText?: string;
}) {
  const arcana = getArcana(value);
  const compatData = arcanaCompatibilityData[value];
  const expandable = compatData
    ? `${compatData.upright}\n\nВ минусе: ${compatData.reversed}`
    : (compatPositionIntros[position] || '');
  const positionText = getCompatPositionText(context, position, value);
  const contextIntro = aiText || positionText || arcana?.compatibilityDescription || arcana?.personalDescription || '';
  return (
    <CompCard
      position={position}
      value={value}
      positionTitle={compatPositionTitles[position] || `Позиция ${position}`}
      contextIntro={contextIntro}
      expandableLabel="Расширенный разбор"
      expandableContent={expandable}
      highlight={highlight}
    />
  );
}

// Обёртка для личной матрицы
function PersonalCard({ position, value, accentColor = 'primary' as const }: { position: number; value: number; accentColor?: 'primary' | 'violet' }) {
  const interp = getPositionInterpretation(position, value);
  return (
    <CompCard
      position={position}
      value={value}
      positionTitle={interp.positionTitle || `Позиция ${position}`}
      contextIntro={interp.positionIntro || ''}
      accentColor={accentColor}
    />
  );
}

// ─── TriangleMiniRow — мини-ряд карт для заголовка треугольника ────────────────

function TriangleMiniRow({ positions, matrix }: { positions: readonly number[]; matrix: PersonalMatrix }) {
  const p = matrix.positions;
  const [modalVal, setModalVal] = useState<number | null>(null);
  return (
    <>
      <div className="flex items-end gap-3">
        {positions.map(pos => {
          const val = p[pos - 1];
          const arcana = getArcana(val);
          return (
            <button key={pos} onClick={() => setModalVal(val)} className="flex flex-col items-center gap-1 group">
              <div className="relative w-11 h-[66px] rounded-xl overflow-hidden ring-1 ring-border/60 group-hover:scale-105 transition-transform">
                <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                  <span className="text-[8px] text-white/80 font-bold">{val}</span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">Поз. {pos}</span>
              {arcana && <span className="text-[9px] text-muted-foreground/50 -mt-0.5 max-w-[46px] truncate">{arcana.name}</span>}
            </button>
          );
        })}
      </div>
      {modalVal !== null && <ArcanaModal value={modalVal} onClose={() => setModalVal(null)} />}
    </>
  );
}

// ─── KeyArcanaBlock — Ключ союза ───────────────────────────────────────────────

function KeyArcanaBlock({ matrix }: { matrix: PersonalMatrix }) {
  const keyPositions = [1, 2, 3, 4, 5, 12];
  const p = matrix.positions;
  const [modalVal, setModalVal] = useState<number | null>(null);

  return (
    <>
      <div className="gradient-card rounded-2xl border border-primary/20 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Ключ союза</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {keyPositions.map((pos, idx) => {
            const val = p[pos - 1];
            const arcana = getArcana(val);
            return (
              <button
                key={pos}
                onClick={() => setModalVal(val)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/6 border border-primary/15 hover:bg-primary/12 transition-colors group"
              >
                <div className="relative w-6 h-9 rounded-md overflow-hidden shrink-0 ring-1 ring-primary/20">
                  <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] text-muted-foreground/60">Поз. {pos}</div>
                  <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                    {arcana?.name ?? val}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {modalVal !== null && <ArcanaModal value={modalVal} onClose={() => setModalVal(null)} />}
    </>
  );
}

// ─── SectionHeader ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-4 pb-4 border-b border-border/60">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-primary/10">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-display font-bold text-xl md:text-2xl text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── TriangleSection ── секция треугольника ────────────────────────────────────

function TriangleSection({
  triangleNum,
  label,
  intro,
  positions,
  matrix,
  shownPositions,
  context = 'union',
}: {
  triangleNum: number;
  label: string;
  intro: string;
  positions: readonly number[];
  matrix: PersonalMatrix;
  shownPositions: Set<number>;
  context?: 'union' | 'cross';
}) {
  const p = matrix.positions;
  const newPositions = positions.filter(pos => !shownPositions.has(pos));
  const repeatedPositions = positions.filter(pos => shownPositions.has(pos));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-lg font-display font-bold text-primary">{triangleNum}</span>
        </div>
        <div>
          <h4 className="font-display font-bold text-lg text-foreground">Треугольник {triangleNum} · {label}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{intro}</p>
        </div>
      </div>

      {/* Mini-cards row */}
      <TriangleMiniRow positions={positions} matrix={matrix} />

      {/* Repeated positions — compact refs */}
      {repeatedPositions.length > 0 && (
        <div className="space-y-1.5">
          {repeatedPositions.map(pos => {
            const val = p[pos - 1];
            const arcana = getArcana(val);
            return (
              <div key={pos} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/30 border border-border/40">
                <div className="relative w-7 h-[42px] rounded-lg overflow-hidden shrink-0 ring-1 ring-border/50">
                  <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Поз. {pos}: {arcana?.name}</span>
                  {" · "}{compatPositionTitles[pos]} — разобрано выше
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* New positions — full CompCards */}
      {newPositions.map(pos => (
        <CompatCard key={pos} position={pos} value={p[pos - 1]} highlight={pos === 2} context={context} />
      ))}
    </div>
  );
}

// ─── MiniArcanaRef ─────────────────────────────────────────────────────────────

function MiniArcanaRef({ position, value, note }: { position: number; value: number; note: string }) {
  const arcana = getArcana(value);
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border/40">
      <div className="relative w-7 h-[42px] rounded-lg overflow-hidden shrink-0 ring-1 ring-border/50">
        <img src={getArcanaImage(value)} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Поз. {position}: {arcana?.name}</span>
          {" · "}{note}
        </p>
      </div>
    </div>
  );
}

// ─── ScoreBar ──────────────────────────────────────────────────────────────────

function ScoreBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-emerald-500" : percent >= 60 ? "bg-primary" : percent >= 40 ? "bg-amber-500" : "bg-red-400";
  const label = percent >= 80 ? "Высокая совместимость" : percent >= 60 ? "Хорошая совместимость" : percent >= 40 ? "Средняя совместимость" : "Сложный союз";
  return (
    <div className="space-y-1.5">
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percent}%` }} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">0%</span>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">100%</span>
      </div>
    </div>
  );
}

// ─── ExpandableBlock ───────────────────────────────────────────────────────────

function ExpandableBlock({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="gradient-card rounded-2xl border border-border overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="font-display font-semibold text-foreground text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}


// ─── CommonArcanaBlock ─────────────────────────────────────────────────────────
function CommonArcanaBlock({ matrix1, matrix2, name1, name2 }: {
  matrix1: PersonalMatrix; matrix2: PersonalMatrix; name1: string; name2: string;
}) {
  const p1 = matrix1.positions;
  const p2 = matrix2.positions;
  const map1 = new Map<number, number[]>();
  p1.forEach((val, idx) => {
    if (!map1.has(val)) map1.set(val, []);
    map1.get(val)!.push(idx + 1);
  });
  const commonItems: { arcana: number; pos1: number[]; pos2: number[] }[] = [];
  const seen = new Set<number>();
  p2.forEach((val, idx) => {
    if (map1.has(val) && !seen.has(val)) {
      seen.add(val);
      const allPos2: number[] = [];
      p2.forEach((v2, i2) => { if (v2 === val) allPos2.push(i2 + 1); });
      commonItems.push({ arcana: val, pos1: map1.get(val)!, pos2: allPos2 });
    }
  });
  if (commonItems.length === 0) {
    return (
      <div className="gradient-card rounded-2xl border border-border p-4 text-sm text-muted-foreground text-center">
        У партнёров нет совпадающих арканов — энергии разные и дополняют друг друга.
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {commonItems.map(item => {
        const arcana = getArcana(item.arcana);
        if (!arcana) return null;
        const tags: string[] = [
          arcana.isChildArcana ? 'Детский' : '',
          arcana.isFinancialArcana ? 'Финансовый' : '',
          arcana.isMaleArcana ? 'Мужской' : '',
          arcana.isFemaleArcana ? 'Женский' : '',
        ].filter(Boolean);
        return (
          <div key={item.arcana} className="gradient-card rounded-2xl border border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <div className="relative w-10 h-[60px] rounded-xl overflow-hidden shrink-0 ring-1 ring-primary/20">
                <img src={getArcanaImage(item.arcana)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                  <span className="text-[8px] text-white/80 font-bold">{item.arcana}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-base text-foreground">{arcana.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 mb-2">
                  <span className="text-primary">{name1}:</span> поз. {item.pos1.join(', ')}
                  {' · '}
                  <span className="text-primary">{name2}:</span> поз. {item.pos2.join(', ')}
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/15">{tag}</span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">{arcana.compatibilityDescription}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SuccessCodeCompare ────────────────────────────────────────────────────────
function SuccessCodeCompare({ matrix1, matrix2, name1, name2 }: {
  matrix1: PersonalMatrix; matrix2: PersonalMatrix; name1: string; name2: string;
}) {
  const scLabels = ['Мудрость', 'Профессия', 'Цель жизни', 'Карма'];
  const scPositions = [4, 5, 7, 12];
  const sc1 = matrix1.successCode;
  const sc2 = matrix2.successCode;
  const common = sc1.filter(v => sc2.includes(v));

  const renderRow = (code: number[], colorClass: string, borderClass: string, name: string) => (
    <div>
      <p className={cn("text-xs uppercase tracking-wide font-medium mb-2", colorClass)}>{name}</p>
      <div className="flex gap-3 flex-wrap">
        {code.map((val, i) => {
          const arcana = getArcana(val);
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={cn("relative w-11 h-[66px] rounded-xl overflow-hidden ring-2", borderClass)}>
                <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                  <span className="text-[8px] text-white/80 font-bold">{val}</span>
                </div>
                <div className={cn("absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white", colorClass.replace('text-', 'bg-'))}>
                  {scPositions[i]}
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground/60 text-center leading-tight">{scLabels[i]}</span>
              <span className={cn("text-[9px] font-medium text-center leading-tight max-w-[44px]", colorClass)}>{arcana?.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {renderRow(sc1, "text-primary", "ring-primary/30", name1)}
      {renderRow(sc2, "text-primary", "ring-primary/30", name2)}
      {common.length > 0 && (
        <div className="gradient-card rounded-xl border border-primary/20 bg-primary/3 p-3">
          <p className="text-xs text-primary font-medium mb-1.5">Общие арканы кода успеха</p>
          <div className="flex gap-2 flex-wrap mb-2">
            {common.map(val => (
              <span key={val} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary/8 border border-primary/15">
                <span className="font-medium text-primary">{val}</span>
                <span className="text-muted-foreground">{getArcana(val)?.name}</span>
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">Общие арканы в коде успеха — вы смотрите в одном направлении. Это создаёт взаимопонимание на уровне целей и поддерживает союз в движении вперёд.</p>
        </div>
      )}
    </div>
  );
}

// ─── KeyEnergiesBlock ─────────────────────────────────────────────────────────
function KeyEnergiesBlock({ matrix }: { matrix: PersonalMatrix }) {
  const keyPositions = [4, 5, 7, 12];
  const [active, setActive] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground leading-relaxed">
        Четыре ключевые позиции — через них проходит главная энергия отношений. В плюсе они усиливают союз, в минусе — создают точки напряжения.
      </p>
      {keyPositions.map(pos => {
        const val = matrix.positions[pos - 1];
        const arcana = getArcana(val);
        if (!arcana) return null;
        const isOpen = active === pos;
        return (
          <div key={pos} className="gradient-card rounded-2xl border border-border overflow-hidden">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors text-left"
              onClick={() => setActive(isOpen ? null : pos)}
            >
              <div className="relative w-9 h-[54px] rounded-lg overflow-hidden ring-1 ring-border/50 shrink-0">
                <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                  <span className="text-[8px] text-white/80 font-bold">{val}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Поз. {pos} · {compatPositionTitles[pos]}</p>
                <p className="font-display font-bold text-base text-foreground">{arcana.name}</p>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-4 space-y-2">
                <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-3">
                  <p className="text-[10px] font-medium text-emerald-600 mb-1">В плюсе — как усиливает союз</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{arcana.personalDescription}</p>
                </div>
                <div className="rounded-xl bg-red-500/8 border border-red-500/20 p-3">
                  <p className="text-[10px] font-medium text-red-500 mb-1">В минусе — как разрушает союз</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{arcana.personalReversed}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MoneyAndChildrenBlock ─────────────────────────────────────────────────────
function MoneyAndChildrenBlock({ result }: { result: CompatibilityResult }) {
  const allMatrices: { matrix: PersonalMatrix | undefined; label: string; color: 'primary' | 'violet' }[] = [
    { matrix: result.matrix1, label: result.person1.name, color: 'primary' },
    { matrix: result.matrix2, label: result.person2.name, color: 'violet' },
    { matrix: result.unionMatrix, label: 'Матрица союза', color: 'primary' },
  ];
  const financialHits: { arcana: number; pos: number; source: string; color: 'primary' | 'violet' }[] = [];
  const childrenHits: { arcana: number; pos: number; source: string; color: 'primary' | 'violet' }[] = [];
  allMatrices.forEach(({ matrix, label, color }) => {
    if (!matrix) return;
    matrix.positions.forEach((val, idx) => {
      const arc = getArcana(val);
      if (!arc) return;
      if (arc.isFinancialArcana) financialHits.push({ arcana: val, pos: idx + 1, source: label, color });
      if (arc.isChildArcana) childrenHits.push({ arcana: val, pos: idx + 1, source: label, color });
    });
  });

  const renderHitList = (hits: typeof financialHits) => (
    <div className="flex flex-wrap gap-2">
      {hits.map((hit, i) => (
        <div key={i} className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl gradient-card border",
          hit.color === 'violet' ? "border-primary/30" : "border-primary/25"
        )}>
          <div className="relative w-7 h-[42px] rounded-lg overflow-hidden ring-1 ring-border/50 shrink-0">
            <img src={getArcanaImage(hit.arcana)} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="text-xs">
            <p className={cn("font-medium", hit.color === 'violet' ? "text-primary" : "text-primary")}>
              {getArcana(hit.arcana)?.name}
            </p>
            <p className="text-muted-foreground">{hit.source} · Поз. {hit.pos}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Денежная совместимость</span>
        </div>
        {financialHits.length === 0 ? (
          <p className="text-sm text-muted-foreground">Финансовые арканы в ключевых позициях не выражены.</p>
        ) : renderHitList(financialHits)}
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Детская тема пары</span>
        </div>
        {childrenHits.length === 0 ? (
          <p className="text-sm text-muted-foreground">Детские арканы в ключевых позициях не выражены.</p>
        ) : (
          <>
            {renderHitList(childrenHits)}
            <p className="text-xs text-muted-foreground leading-relaxed bg-primary/3 rounded-xl border border-primary/15 px-3 py-2">
              {childrenHits.length >= 5
                ? 'Тема детей ярко выражена в матрицах — союз несёт сильный семейный потенциал.'
                : childrenHits.length >= 3
                ? 'Тема семьи и детей присутствует в союзе — есть природная склонность к созданию семьи.'
                : 'Тема детей присутствует в матрице.'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── HarmonizesBlock ──────────────────────────────────────────────────────────
function HarmonizesBlock({ matrix1, matrix2, unionMatrix, name1, name2 }: {
  matrix1: PersonalMatrix; matrix2: PersonalMatrix; unionMatrix: PersonalMatrix; name1: string; name2: string;
}) {
  const stabilityArcana = new Set([8, 14, 6, 2, 9, 3, 21]);
  const sc1 = matrix1.successCode;
  const sc2 = matrix2.successCode;
  const stab1 = sc1.filter(v => stabilityArcana.has(v)).length;
  const stab2 = sc2.filter(v => stabilityArcana.has(v)).length;
  const [harmonizer, mover] = stab1 >= stab2 ? [name1, name2] : [name2, name1];
  const harmonyArcana = getArcana(unionMatrix.positions[2]);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="gradient-card rounded-xl border border-primary/25 bg-primary/3 p-3">
          <p className="text-[10px] text-primary uppercase tracking-wide font-medium mb-1">Гармонизирует</p>
          <p className="text-sm font-semibold text-foreground">{harmonizer}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Берёт роль стабилизатора — через понимание, мудрость, поиск баланса.</p>
        </div>
        <div className="gradient-card rounded-xl border border-primary/25 bg-primary/3 p-3">
          <p className="text-[10px] text-primary uppercase tracking-wide font-medium mb-1">Двигает вперёд</p>
          <p className="text-sm font-semibold text-foreground">{mover}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Вносит в союз движение, энергию, новые идеи и жизненную силу.</p>
        </div>
      </div>
      {harmonyArcana && (
        <div className="gradient-card rounded-xl border border-border p-3 flex gap-3 items-start">
          <div className="relative w-8 h-[48px] rounded-lg overflow-hidden ring-1 ring-border/50 shrink-0">
            <img src={getArcanaImage(unionMatrix.positions[2])} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Аркан гармонии союза · {harmonyArcana.name}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{harmonyArcana.compatibilityDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TriggersBlock ────────────────────────────────────────────────────────────
function TriggersBlock({ matrix1, matrix2, name1, name2 }: {
  matrix1: PersonalMatrix; matrix2: PersonalMatrix; name1: string; name2: string;
}) {
  interface TriggerItem { label: string; arcana: number; text: string; variant: 'p1' | 'p2' | 'cross' }
  const items: TriggerItem[] = [];
  const keyIdx = [3, 4, 6, 11]; // positions 4,5,7,12 zero-indexed

  matrix1.reversedArcana.forEach(r => {
    const arc = getArcana(r.arcana);
    if (!arc) return;
    items.push({ label: `${name1} · ${arc.name} (поз. ${r.positions.join(', ')})`, arcana: r.arcana, text: arc.personalReversed, variant: 'p1' });
  });
  matrix2.reversedArcana.forEach(r => {
    const arc = getArcana(r.arcana);
    if (!arc) return;
    items.push({ label: `${name2} · ${arc.name} (поз. ${r.positions.join(', ')})`, arcana: r.arcana, text: arc.personalReversed, variant: 'p2' });
  });
  // Cross-triggers: reversed from p1 that hits key positions of p2
  matrix1.reversedArcana.forEach(r => {
    const inKey2 = keyIdx.filter(i => matrix2.positions[i] === r.arcana);
    if (inKey2.length > 0) {
      const arc = getArcana(r.arcana);
      if (!arc) return;
      items.push({
        label: `${arc.name} — взаимный триггер`,
        arcana: r.arcana,
        text: `Перевёрнутый аркан у ${name1} совпадает с ключевой позицией у ${name2}. Один активирует тень другого. ${arc.personalReversed}`,
        variant: 'cross',
      });
    }
  });

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Выраженных перевёрнутых и взаимных триггеров в матрицах не обнаружено.</p>
    );
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className={cn(
          "gradient-card rounded-xl border p-3 flex gap-3",
          item.variant === 'p1' ? "border-primary/25" : item.variant === 'p2' ? "border-primary/25" : "border-amber-400/25"
        )}>
          <div className="relative w-8 h-[48px] rounded-lg overflow-hidden ring-1 ring-border/50 shrink-0">
            <img src={getArcanaImage(item.arcana)} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn("text-xs font-medium",
              item.variant === 'p1' ? "text-primary" : item.variant === 'p2' ? "text-primary" : "text-amber-500"
            )}>{item.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SuccessCodeBlock (PartnerTab) ────────────────────────────────────────────
function SuccessCodeBlock({ matrix, accentColor }: { matrix: PersonalMatrix; accentColor: 'primary' | 'violet' }) {
  const isViolet = accentColor === 'violet';
  const colorClass = isViolet ? "text-primary" : "text-primary";
  const borderClass = isViolet ? "border-primary/25" : "border-primary/25";
  const bgClass = isViolet ? "bg-primary/5" : "bg-primary/5";
  const ringClass = isViolet ? "ring-primary/30" : "ring-primary/30";
  const scLabels = ['Мудрость', 'Профессия', 'Цель жизни', 'Карма'];
  const scPositions = [4, 5, 7, 12];
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  return (
    <div className={cn("gradient-card rounded-2xl border p-4 space-y-3", borderClass, bgClass)}>
      <div className="flex items-center gap-2 mb-1">
        <Key className={cn("w-4 h-4", colorClass)} />
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Код успеха</span>
      </div>
      <div className="flex gap-3 flex-wrap">
        {matrix.successCode.map((val, i) => {
          const arcana = getArcana(val);
          return (
            <button key={i} onClick={() => setActiveIdx(activeIdx === i ? null : i)} className="flex flex-col items-center gap-1 group">
              <div className={cn("relative w-11 h-[66px] rounded-xl overflow-hidden ring-2 transition-all",
                activeIdx === i ? (isViolet ? "ring-primary" : "ring-primary") : cn("ring-border/50 group-hover:", ringClass)
              )}>
                <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                  <span className="text-[8px] text-white/80 font-bold">{val}</span>
                </div>
                <div className={cn("absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white",
                  isViolet ? "bg-primary" : "bg-primary"
                )}>{scPositions[i]}</div>
              </div>
              <span className="text-[9px] text-muted-foreground/60 leading-tight">{scLabels[i]}</span>
              <span className={cn("text-[9px] font-medium leading-tight max-w-[44px] text-center", colorClass)}>{arcana?.name}</span>
            </button>
          );
        })}
      </div>
      {activeIdx !== null && (() => {
        const val = matrix.successCode[activeIdx];
        const arcana = getArcana(val);
        if (!arcana) return null;
        return (
          <div className={cn("rounded-xl border p-3 space-y-2", borderClass)}>
            <p className={cn("text-xs font-semibold", colorClass)}>{arcana.name} — {scLabels[activeIdx]}</p>
            <div className="rounded-lg bg-emerald-500/8 border border-emerald-500/15 p-2">
              <p className="text-[10px] font-medium text-emerald-600 mb-0.5">В плюсе</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{arcana.personalDescription}</p>
            </div>
            <div className="rounded-lg bg-red-500/8 border border-red-500/15 p-2">
              <p className="text-[10px] font-medium text-red-500 mb-0.5">В минусе</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{arcana.personalReversed}</p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── MirrorReversedBlock (PartnerTab) ─────────────────────────────────────────
function MirrorReversedBlock({ matrix, accentColor }: { matrix: PersonalMatrix; accentColor: 'primary' | 'violet' }) {
  const isViolet = accentColor === 'violet';
  const colorClass = isViolet ? "text-primary" : "text-primary";
  const borderClass = isViolet ? "border-primary/25" : "border-primary/25";
  const bgClass = isViolet ? "bg-primary/5" : "bg-primary/5";
  const hasMirror = matrix.mirrorArcana.length > 0;
  const hasReversed = matrix.reversedArcana.length > 0;
  if (!hasMirror && !hasReversed) return null;
  return (
    <div className="space-y-4">
      {hasMirror && (
        <div className={cn("gradient-card rounded-2xl border p-4 space-y-3", borderClass, bgClass)}>
          <p className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Зеркальные арканы</p>
          {matrix.mirrorArcana.map((item, i) => {
            const arcana = getArcana(item.arcana);
            if (!arcana) return null;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="relative w-10 h-[60px] rounded-xl overflow-hidden ring-1 ring-border/50 shrink-0">
                  <img src={getArcanaImage(item.arcana)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                    <span className="text-[8px] text-white/80 font-bold">{item.arcana}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn("font-display font-bold text-base", colorClass)}>{arcana.name}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1">Зеркало: поз. {item.positions[0]} ↔ поз. {item.positions[1]}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Эта энергия усилена в матрице и задаёт мощный тон личности. {arcana.personalDescription}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {hasReversed && (
        <div className="gradient-card rounded-2xl border border-amber-400/25 bg-amber-400/3 p-4 space-y-3">
          <p className="text-xs uppercase tracking-wide font-medium text-muted-foreground">Перевёрнутые арканы</p>
          {matrix.reversedArcana.map((item, i) => {
            const arcana = getArcana(item.arcana);
            if (!arcana) return null;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="relative w-10 h-[60px] rounded-xl overflow-hidden ring-1 ring-amber-400/30 shrink-0">
                  <img src={getArcanaImage(item.arcana)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                    <span className="text-[8px] text-white/80 font-bold">{item.arcana}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-base text-amber-500">{arcana.name}</div>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-1">
                    {item.positions.length >= 3 ? 'Тройной аркан' : 'Перевёрнутый'} · поз. {item.positions.join(', ')}
                  </p>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground"><span className="text-emerald-600 font-medium">В плюсе: </span>{arcana.personalDescription}</p>
                    <p className="text-xs text-muted-foreground"><span className="text-red-500 font-medium">В минусе: </span>{arcana.personalReversed}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TriplesBlock — тройные арканы союза ──────────────────────────────────────

function TriplesBlock({ matrix, title = "Тройные арканы" }: { matrix: PersonalMatrix; title?: string }) {
  const triples = matrix.reversedArcana.filter(item => item.positions.length >= 3);
  if (triples.length === 0) return null;
  return (
    <div className="gradient-card rounded-2xl border border-primary/25 bg-primary/3 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Тройной аркан — это повторяющаяся энергия, которая звучит особенно громко. Это не ошибка и не плохой знак — это усиленный акцент на конкретной теме. Такой аркан требует особого внимания: он либо главный ресурс пары, либо главная точка роста.
      </p>
      {triples.map((item, i) => {
        const arcana = getArcana(item.arcana);
        const compatData = arcanaCompatibilityData[item.arcana];
        if (!arcana) return null;
        return (
          <div key={i} className="flex items-start gap-3 pt-3 border-t border-primary/15">
            <div className="relative w-12 h-[72px] rounded-xl overflow-hidden ring-1 ring-primary/30 shrink-0">
              <img src={getArcanaImage(item.arcana)} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
                <span className="text-[8px] text-white/80 font-bold">{item.arcana}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-display font-bold text-base text-primary">{arcana.name}</span>
                <span className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                  {item.positions.length}× · поз. {item.positions.join(', ')}
                </span>
              </div>
              {compatData && (
                <p className="text-xs text-muted-foreground leading-relaxed">{compatData.general}</p>
              )}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 font-medium">Усиленный плюс: </span>
                  {compatData?.upright.slice(0, 180) || arcana.personalDescription}
                  {(compatData?.upright.length ?? 0) > 180 ? '...' : ''}
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-amber-500 font-medium">Усиленный вызов: </span>
                  {compatData?.reversed.slice(0, 180) || arcana.personalReversed}
                  {(compatData?.reversed.length ?? 0) > 180 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PerspectiveBlock — перспектива союза ──────────────────────────────────────

function PerspectiveBlock({ result, ai }: { result: CompatibilityResult; ai?: import("@/lib/aiReadingService").AIReading["perspective"] | null }) {
  const matrix = result.unionMatrix;
  if (!matrix) return null;
  const p = matrix.positions;
  const unionArcana = getArcana(result.unionArcana);
  const harmonyArcana = getArcana(p[2]); // поз. 3 — пара вовне
  const destArcana = getArcana(p[11]);   // поз. 12 — кармическая задача
  const pathArcana = getArcana(p[6]);    // поз. 7 — общая цель
  const compatData = arcanaCompatibilityData[result.unionArcana];

  const perspectives = [
    {
      label: "Аркан союза",
      value: result.unionArcana,
      arcana: unionArcana,
      text: ai?.union_arcana || compatData?.conclusion || "Ключевая энергия, которая определяет характер этого союза на всём его протяжении.",
    },
    {
      label: "Как вас видит мир",
      value: p[2],
      arcana: harmonyArcana,
      text: ai?.external || "Образ пары снаружи — что транслируется людям вокруг. Именно это воспринимают друзья, семья, коллеги.",
    },
    {
      label: "Общая цель",
      value: p[6],
      arcana: pathArcana,
      text: ai?.goal || "Зачем эти двое встретились — с точки зрения движения и смысла. Куда ведут отношения.",
    },
    {
      label: "Главная задача",
      value: p[11],
      arcana: destArcana,
      text: ai?.karma || "Глубинная кармическая задача союза — то, ради чего они пришли друг к другу на уровне судьбы.",
    },
  ];

  return (
    <div className="gradient-card rounded-2xl border border-primary/20 p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Перспектива союза</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Четыре ключевые точки, которые определяют будущее этого союза. Где пара сейчас, как её воспринимают, куда она движется — и какова её глубинная задача.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {perspectives.map(({ label, value, arcana, text }) => (
          <div key={label} className="gradient-card rounded-xl border border-border/50 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-12 rounded-lg overflow-hidden shrink-0 ring-1 ring-primary/20">
                <img src={getArcanaImage(value)} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wide leading-none">{label}</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{arcana?.name ?? value}</p>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RecommendationsBlock — рекомендации паре ─────────────────────────────────

function RecommendationsBlock({ result, ai }: { result: CompatibilityResult; ai?: import("@/lib/aiReadingService").AIReading["recommendations"] | null }) {
  const matrix = result.unionMatrix;
  if (!matrix) return null;
  const p = matrix.positions;
  const unionArcana = result.unionArcana;
  const karmaArcana = p[11]; // поз. 12
  const goalArcana = p[6];   // поз. 7
  const baseArcana = p[5];   // поз. 6

  // Рекомендации на основе ключевых арканов
  const getRecForArcana = (arcana: number, role: 'him' | 'her' | 'pair'): string => {
    const compatData = arcanaCompatibilityData[arcana];
    if (!compatData) return '';
    if (role === 'pair') return compatData.conclusion;
    // For him/her we use parts of upright/reversed
    return role === 'him'
      ? compatData.upright.split('.')[0] + '.'
      : compatData.reversed.split('.')[0] + '.';
  };

  const pairRec = ai?.pair || getRecForArcana(unionArcana, 'pair');
  const goalText = arcanaCompatibilityData[goalArcana]?.general?.split('.')[0] + '.' || '';
  const karmaText = arcanaCompatibilityData[karmaArcana]?.general?.split('.')[0] + '.' || '';

  const himName = result.person1.name || 'Партнёр А';
  const herName = result.person2.name || 'Партнёр Б';

  // Cross matrix position 4 texts for each partner
  const cross1Pos4 = result.cross1Matrix?.positions[3];
  const cross2Pos4 = result.cross2Matrix?.positions[3];
  const himRec = ai?.him || (cross1Pos4 ? getCompatPositionText('cross', 4, cross1Pos4) : '');
  const herRec = ai?.her || (cross2Pos4 ? getCompatPositionText('cross', 4, cross2Pos4) : '');

  return (
    <div className="space-y-4">
      {/* Ему */}
      {himRec && (
        <div className="gradient-card rounded-2xl border border-primary/20 bg-primary/3 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">Е</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{himName}</span>
            {cross1Pos4 && (
              <div className="relative w-5 h-7 rounded overflow-hidden ring-1 ring-primary/20 ml-auto">
                <img src={getArcanaImage(cross1Pos4)} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{himRec}</p>
        </div>
      )}

      {/* Ей */}
      {herRec && (
        <div className="gradient-card rounded-2xl border border-primary/20 bg-primary/3 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">Е</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{herName}</span>
            {cross2Pos4 && (
              <div className="relative w-5 h-7 rounded overflow-hidden ring-1 ring-primary/20 ml-auto">
                <img src={getArcanaImage(cross2Pos4)} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{herRec}</p>
        </div>
      )}

      {/* Паре */}
      <div className="gradient-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Паре вместе</span>
        </div>
        <div className="space-y-2">
          {pairRec && <p className="text-xs text-muted-foreground leading-relaxed">{pairRec}</p>}
          {goalText && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Общая цель: </span>{goalText}
            </p>
          )}
          {karmaText && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Главная задача: </span>{karmaText}
            </p>
          )}
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 pt-2 border-t border-border/50">
            Помните: матрица предназначения показывает потенциал, а не приговор. Всё, что здесь написано — это возможности и точки роста. Ваши отношения — это живая система, которую вы создаёте каждый день.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Union Tab ─────────────────────────────────────────────────────────────────

function UnionTab({ result, isPro, aiReading, aiLoading }: { result: CompatibilityResult; isPro: boolean; aiReading: import("@/lib/aiReadingService").AIReading | null; aiLoading: boolean }) {
  const unionArcana = getArcana(result.unionArcana);
  const matrix = result.unionMatrix;
  if (!matrix) return null;
  const p = matrix.positions;

  if (isPro && aiLoading) {
    return <LoadingScreen methodId="compatibility" phrases={["Читаем ваши матрицы…", "Сводим две судьбы воедино…", "Ищем точки притяжения…", "Составляем персональный разбор…", "Финальные штрихи…"]} />;
  }

  return (
    <div className="space-y-8">

      {/* Ключ союза */}
      <KeyArcanaBlock matrix={matrix} />

      {/* Визуальная матрица */}
      <div className="gradient-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold text-foreground">Матрица союза</span>
        </div>
        <div className="flex justify-center">
          <MatrixGrid matrix={matrix} accentPos2 />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Нажмите на карту чтобы рассмотреть аркан</p>
      </div>

      {/* Общая энергия — вводный текст */}
      <div className="gradient-card rounded-2xl border border-primary/20 p-5 bg-primary/3">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Аркан союза · {unionArcana?.name}</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {aiReading?.union_arcana || getCompatPositionText('union', 2, result.unionArcana) || arcanaCompatibilityData[result.unionArcana]?.general || unionArcana?.compatibilityDescription || unionArcana?.personalDescription}
        </p>
        {!aiReading && arcanaCompatibilityData[result.unionArcana] && (
          <p className="text-xs text-muted-foreground/70 leading-relaxed mt-2 pt-2 border-t border-primary/10">
            {arcanaCompatibilityData[result.unionArcana].conclusion}
          </p>
        )}
      </div>

      {/* ═══ СОВПАДАЮЩИЕ ЭНЕРГИИ ════════════════════════════════════════════════ */}
      {result.matrix1 && result.matrix2 && (
        <div className="space-y-4">
          <SectionHeader
            icon={Users}
            title="Совпадающие энергии партнёров"
            subtitle="Арканы, которые есть у обоих — они создают узнавание и общий язык между партнёрами."
          />
          <CommonArcanaBlock
            matrix1={result.matrix1}
            matrix2={result.matrix2}
            name1={result.person1.name}
            name2={result.person2.name}
          />
        </div>
      )}

      {/* ═══ ТРЕУГОЛЬНИКИ ══════════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <SectionHeader
          icon={Clock}
          title="Три периода отношений"
          subtitle="Матрица строится вокруг трёх треугольников. Каждый описывает отдельный слой отношений — от начала до глубинных задач."
        />

        {TRIANGLES.map((tri, idx) => (
          <div key={tri.num} className="gradient-card rounded-2xl border border-border p-5 space-y-5">
            <TriangleSection
              triangleNum={tri.num}
              label={tri.label}
              intro={tri.intro}
              positions={tri.positions}
              matrix={matrix}
              shownPositions={TRIANGLE_SHOWN_SETS[idx]}
            />
          </div>
        ))}
      </div>

      {/* ═══ ТОЧКА ОПОРЫ — позиция 6 ══════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Anchor}
          title="Кармическая ось"
          subtitle="Позиция 6 — в матрице совместимости здесь стоит кармический аркан. Ключевой вызов и скрытый ресурс пары."
        />
        <CompatCard position={6} value={p[5]} aiText={aiReading?.positions?.['6']} />
      </div>

      {/* ═══ ЦЕЛИ В ОТНОШЕНИЯХ ════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Target}
          title="Цели в отношениях"
          subtitle="Позиции 7 · 8 · 9 — куда идёт пара, через что достигает и где восстанавливается."
        />
        {[7, 8, 9].map(pos => (
          <CompatCard key={pos} position={pos} value={p[pos - 1]} aiText={aiReading?.positions?.[String(pos)]} />
        ))}
      </div>

      {/* ═══ КАРМИЧЕСКИЕ ЗАДАЧИ ═══════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={ShieldAlert}
          title="Кармические задачи союза"
          subtitle="Позиции 10 · 11 · 12 — кармические паттерны, повторяющиеся сценарии и главная задача этого союза."
        />
        <div className="gradient-card rounded-2xl border border-border p-4 text-sm text-muted-foreground leading-relaxed bg-muted/20">
          Кармические позиции — не приговор и не плохой знак. Это точки трансформации: то, что будет провоцировать конфликты, пока пара не осознает их вместе. Именно здесь — самый глубокий рост.
        </div>
        {[10, 11, 12].map(pos => (
          <CompatCard key={pos} position={pos} value={p[pos - 1]} highlight={pos === 12} aiText={aiReading?.positions?.[String(pos)]} />
        ))}
      </div>


      {/* ═══ ПЛЮС И МИНУС ГЛАВНЫХ ЭНЕРГИЙ ══════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Star}
          title="Плюс и минус главных энергий"
          subtitle="Позиции 4 · 5 · 7 · 12 — ключевые арканы союза. Как они усиливают пару и где могут создавать конфликт."
        />
        <KeyEnergiesBlock matrix={matrix} />
      </div>

      {/* ═══ КОД УСПЕХА ПАРЫ ═════════════════════════════════════════════════ */}
      {result.matrix1 && result.matrix2 && (
        <div className="space-y-4">
          <SectionHeader
            icon={Key}
            title="Код успеха пары"
            subtitle="Жизненные программы партнёров — через что каждый идёт к результатам и насколько ваши пути совпадают."
          />
          <SuccessCodeCompare
            matrix1={result.matrix1}
            matrix2={result.matrix2}
            name1={result.person1.name}
            name2={result.person2.name}
          />
        </div>
      )}

      {/* ═══ ДЕНЬГИ И ДЕТИ ═══════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={TrendingUp}
          title="Деньги и дети"
          subtitle="Денежные и детские арканы в матрицах — финансовый потенциал союза и тема семьи."
        />
        <MoneyAndChildrenBlock result={result} />
      </div>

      {/* ═══ КТО ГАРМОНИЗИРУЕТ ═══════════════════════════════════════════════ */}
      {result.matrix1 && result.matrix2 && result.unionMatrix && (
        <div className="space-y-4">
          <SectionHeader
            icon={Heart}
            title="Кто гармонизирует отношения"
            subtitle="Кто больше стабилизирует союз, кто двигает его вперёд — и аркан гармонии пары."
          />
          <HarmonizesBlock
            matrix1={result.matrix1}
            matrix2={result.matrix2}
            unionMatrix={result.unionMatrix}
            name1={result.person1.name}
            name2={result.person2.name}
          />
        </div>
      )}

      {/* ═══ ГЛАВНЫЕ ТРИГГЕРЫ ════════════════════════════════════════════════ */}
      {result.matrix1 && result.matrix2 && (
        <div className="space-y-4">
          <SectionHeader
            icon={ShieldAlert}
            title="Главные триггеры пары"
            subtitle="Перевёрнутые арканы и взаимные точки напряжения — что чаще всего будет провоцировать конфликты."
          />
          <TriggersBlock
            matrix1={result.matrix1}
            matrix2={result.matrix2}
            name1={result.person1.name}
            name2={result.person2.name}
          />
        </div>
      )}

      {/* ═══ ТРОЙНЫЕ АРКАНЫ ══════════════════════════════════════════════════ */}
      {matrix.reversedArcana.some(item => item.positions.length >= 3) && (
        <div className="space-y-4">
          <SectionHeader
            icon={Layers}
            title="Тройные арканы союза"
            subtitle="Арканы, которые появляются три и более раз — усиленный акцент на конкретной теме союза."
          />
          <TriplesBlock matrix={matrix} />
        </div>
      )}

      {/* ═══ ПЕРСПЕКТИВА СОЮЗА ═══════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Sparkles}
          title="Перспектива союза"
          subtitle="Четыре ключевые точки, которые определяют будущее этих отношений."
        />
        <PerspectiveBlock result={result} ai={aiReading?.perspective} />
      </div>

      {/* ═══ РЕКОМЕНДАЦИИ ════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={CheckCircle}
          title="Рекомендации"
          subtitle="Ключевые зоны роста и практические советы — ему, ей и паре вместе."
        />
        <RecommendationsBlock result={result} ai={aiReading?.recommendations} />
      </div>

    </div>
  );
}

// ─── Partner Tab ───────────────────────────────────────────────────────────────

function PartnerTab({
  matrix,
  crossMatrix,
  name,
  accentColor,
  otherName,
}: {
  matrix: PersonalMatrix;
  crossMatrix: PersonalMatrix | undefined;
  name: string;
  accentColor: 'primary' | 'violet';
  otherName: string;
}) {
  const isViolet = accentColor === 'violet';
  const colorClass = isViolet ? "text-primary" : "text-primary";
  const borderClass = isViolet ? "border-primary/30" : "border-primary/30";
  const bgClass = isViolet ? "bg-primary/5" : "bg-primary/5";
  const [destTab, setDestTab] = useState<'main' | 'goals' | 'karma'>('main');

  const p = matrix.positions;
  const crossP = crossMatrix?.positions;

  // Ключевые арканы личной матрицы
  const keyPositions = [1, 2, 3, 7, 12];

  return (
    <div className="space-y-6">

      {/* Шапка */}
      <div className={cn("gradient-card rounded-2xl border p-5", borderClass, bgClass)}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", isViolet ? "bg-primary/15" : "bg-primary/10")}>
            <Users className={cn("w-5 h-5", colorClass)} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Предназначение</p>
            <h3 className={cn("font-display font-bold text-lg", colorClass)}>{name}</h3>
          </div>
        </div>
        {/* Ключевые арканы */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {keyPositions.map(pos => {
            const val = p[pos - 1];
            const arcana = getArcana(val);
            return (
              <div key={pos} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border", isViolet ? "border-primary/30 bg-primary/5" : "border-primary/20 bg-primary/5")}>
                <div className="relative w-4 h-6 rounded overflow-hidden shrink-0">
                  <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-muted-foreground">Поз.{pos}:</span>
                <span className={cn("font-medium", colorClass)}>{arcana?.name ?? val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Матрица */}
      <div className={cn("gradient-card rounded-2xl border p-5", borderClass)}>
        <div className="flex items-center gap-2 mb-4">
          <Compass className={cn("w-5 h-5", colorClass)} />
          <span className="font-display font-semibold text-foreground">Матрица предназначения</span>
        </div>
        <div className="flex justify-center">
          <MatrixGrid matrix={matrix} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">Нажмите на карту чтобы рассмотреть аркан</p>
      </div>

      {/* ── Код успеха ──────────────────────────────────────────────────────── */}
      <SuccessCodeBlock matrix={matrix} accentColor={accentColor} />

      {/* ── Зеркальные / Перевёрнутые ──────────────────────────────────────── */}
      <MirrorReversedBlock matrix={matrix} accentColor={accentColor} />

      {/* Sub-tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'main' as const, label: 'Основной треугольник' },
          { id: 'goals' as const, label: 'Цели' },
          { id: 'karma' as const, label: 'Карма' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setDestTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              destTab === tab.id
                ? isViolet ? "bg-primary text-white" : "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Основной треугольник */}
      {destTab === 'main' && (
        <div className="space-y-4">
          <div className="gradient-card rounded-xl border border-border px-4 py-3 bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Личность и начало пути</p>
            <p className="text-xs text-muted-foreground mt-0.5">Позиции 1–6 · детство, суть, таланты, точка опоры</p>
          </div>
          {[1, 2, 3, 4, 5, 6].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* Цели */}
      {destTab === 'goals' && (
        <div className="space-y-4">
          <div className="gradient-card rounded-xl border border-border px-4 py-3 bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Цели и реализация</p>
            <p className="text-xs text-muted-foreground mt-0.5">Позиции 7–9 · жизненная цель, инструмент, зона комфорта</p>
          </div>
          {[7, 8, 9].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* Карма */}
      {destTab === 'karma' && (
        <div className="space-y-4">
          <div className="gradient-card rounded-xl border border-border px-4 py-3 bg-muted/20">
            <p className="text-sm font-semibold text-foreground">Кармические задачи</p>
            <p className="text-xs text-muted-foreground mt-0.5">Позиции 10–12 · ошибки прошлого, задачи, главная миссия</p>
          </div>
          {[10, 11, 12].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* ─── В ЭТИХ ОТНОШЕНИЯХ ──────────────────────────────────────────────── */}
      {crossMatrix && crossP && (
        <div className="space-y-6 pt-2">
          <SectionHeader
            icon={Users}
            title={`${name} в этих отношениях`}
            subtitle={`Как ${name} воспринимает этот союз — кросс-матрица с ${otherName}.`}
          />

          {/* Ключевые арканы кросс-матрицы */}
          <div className={cn("gradient-card rounded-2xl border p-4", borderClass, bgClass)}>
            <div className="flex items-center gap-2 mb-3">
              <Key className={cn("w-4 h-4", colorClass)} />
              <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Ключ в отношениях</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 5, 12].map(pos => {
                const val = crossP[pos - 1];
                const arcana = getArcana(val);
                return (
                  <div key={pos} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border", borderClass, bgClass)}>
                    <div className="relative w-4 h-6 rounded overflow-hidden shrink-0">
                      <img src={getArcanaImage(val)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-muted-foreground">Поз.{pos}:</span>
                    <span className={cn("font-medium", colorClass)}>{arcana?.name ?? val}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Визуальная матрица кросс */}
          <div className={cn("gradient-card rounded-2xl border p-5", borderClass)}>
            <div className="flex items-center gap-2 mb-4">
              <Compass className={cn("w-5 h-5", colorClass)} />
              <span className="font-display font-semibold text-foreground">Матрица в отношениях</span>
            </div>
            <div className="flex justify-center">
              <MatrixGrid matrix={crossMatrix} />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">Нажмите на карту чтобы рассмотреть аркан</p>
          </div>

          {/* Три треугольника */}
          <div className="space-y-4">
            <SectionHeader
              icon={Clock}
              title="Три периода"
              subtitle="Как эти отношения влияют на начало, динамику и зрелость восприятия союза."
            />
            {TRIANGLES.map((tri, idx) => (
              <div key={tri.num} className="gradient-card rounded-2xl border border-border p-5 space-y-5">
                <TriangleSection
                  triangleNum={tri.num}
                  label={tri.label}
                  intro={tri.intro}
                  positions={tri.positions}
                  matrix={crossMatrix}
                  shownPositions={TRIANGLE_SHOWN_SETS[idx]}
                  context="cross"
                />
              </div>
            ))}
          </div>

          {/* Основа отношений — поз. 6 */}
          <div className="space-y-4">
            <SectionHeader
              icon={Anchor}
              title="Основа отношений"
              subtitle="Позиция 6 — кармический аркан, ключевой вызов и скрытый ресурс."
            />
            <CompatCard position={6} value={crossP[5]} context="cross" />
          </div>

          {/* Цели */}
          <div className="space-y-4">
            <SectionHeader
              icon={Target}
              title="Цели в этих отношениях"
              subtitle="Позиции 7 · 8 · 9 — жизненная цель, способ достижения, зона комфорта."
            />
            {[7, 8, 9].map(pos => (
              <CompatCard key={pos} position={pos} value={crossP[pos - 1]} context="cross" />
            ))}
          </div>

          {/* Кармические задачи */}
          <div className="space-y-4">
            <SectionHeader
              icon={ShieldAlert}
              title="Кармические задачи"
              subtitle="Позиции 10 · 11 · 12 — ошибки прошлого, автоматические сценарии и главная кармическая задача в этом союзе."
            />
            {[10, 11, 12].map(pos => (
              <CompatCard key={pos} position={pos} value={crossP[pos - 1]} context="cross" highlight={pos === 12} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Matrices Tab ──────────────────────────────────────────────────────────────

function MatricesTab({ result }: { result: CompatibilityResult }) {
  if (!result.matrix1 || !result.matrix2 || !result.unionMatrix) return null;

  const matrices = [
    { label: `Предназначение — ${result.person1.name}`, matrix: result.matrix1, accent: 'primary' as const },
    { label: `Предназначение — ${result.person2.name}`, matrix: result.matrix2, accent: 'violet' as const },
    { label: "Матрица союза", matrix: result.unionMatrix, accent: 'primary' as const },
    ...(result.cross1Matrix ? [{ label: `${result.person1.name} в отношениях`, matrix: result.cross1Matrix, accent: 'primary' as const }] : []),
    ...(result.cross2Matrix ? [{ label: `${result.person2.name} в отношениях`, matrix: result.cross2Matrix, accent: 'violet' as const }] : []),
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground text-center">
        Пять матриц — полный энергетический портрет пары. Нажмите на карту чтобы рассмотреть аркан.
      </p>
      {matrices.map(({ label, matrix, accent }) => (
        <div key={label} className={cn(
          "gradient-card rounded-2xl border p-5",
          accent === 'violet' ? "border-primary/25" : "border-primary/25"
        )}>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wide mb-4 text-center",
            accent === 'violet' ? "text-primary" : "text-primary"
          )}>{label}</p>
          <div className="flex justify-center">
            <MatrixGrid matrix={matrix} accentPos2={label === "Матрица союза"} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface CompatibilityResultProps {
  result: CompatibilityResult;
  onReset: () => void;
  tier?: TierType;
}

type TabType = 'union' | 'person1' | 'person2' | 'matrices';

export function CompatibilityResultComponent({ result, onReset, tier = 'basic' }: CompatibilityResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const [activeTab, setActiveTab] = useState<TabType>('union');
  const { reading: aiReading, loading: aiLoading } = useAIReading(result, isPro);

  const unionArcana = getArcana(result.unionArcana);

  const handleDownloadPDF = async () => {
    const person1Date = formatBirthDateForPDF(result.person1.birthDate.day, result.person1.birthDate.month, result.person1.birthDate.year);
    const person2Date = formatBirthDateForPDF(result.person2.birthDate.day, result.person2.birthDate.month, result.person2.birthDate.year);
    await generatePDF({
      title: t("compatibility.title"),
      subtitle: `${result.person1.name} & ${result.person2.name}`,
      birthDate: `${person1Date} / ${person2Date}`,
      sections: [
        { title: `${t("compatibility.compatibilityScore")}: ${result.compatibilityPercent}%`, content: "", highlight: true },
        { title: `${t("compatibility.unionArcana")}: ${result.unionArcana} — ${unionArcana?.name || ""}`, content: unionArcana?.compatibilityDescription || unionArcana?.personalDescription || "" },
        { title: t("compatibility.strengths"), content: result.strengths.join("\n") },
        { title: t("compatibility.challenges"), content: result.challenges.join("\n") },
      ],
    });
  };

  const tabs: { id: TabType; label: string }[] = isPro ? [
    { id: 'union', label: 'Союз' },
    { id: 'person1', label: result.person1.name || 'Партнёр А' },
    { id: 'person2', label: result.person2.name || 'Партнёр Б' },
    { id: 'matrices', label: 'Матрицы' },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      {/* Hero Card: Partners + Score */}
      <div className="gradient-card rounded-2xl border border-primary/20 p-5 mb-6">
        {/* Badge + title */}
        <div className="text-center mb-4">
          <span className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
            isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
          )}>
            {isPro ? `✦ ${t("res.proAnalysis")}` : t("res.basicAnalysis")}
          </span>
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-primary/70" />
            <span className="text-sm text-muted-foreground">{t("compatibility.title")}</span>
          </div>
        </div>

        {/* Partner cards */}
        <div className="flex items-stretch gap-3 mb-5">
          <div className="flex-1 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3 text-center">
            <p className="font-display font-bold text-2xl text-primary leading-tight">{result.person1.name || 'Партнёр А'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {String(result.person1.birthDate.day).padStart(2, '0')}.{String(result.person1.birthDate.month).padStart(2, '0')}.{result.person1.birthDate.year}
            </p>
          </div>

          <div className="flex items-center justify-center shrink-0 px-1">
            <Heart className="w-5 h-5 text-primary/50" />
          </div>

          <div className="flex-1 rounded-xl bg-primary/5 border border-primary/30 px-4 py-3 text-center">
            <p className="font-display font-bold text-2xl text-primary leading-tight">{result.person2.name || 'Партнёр Б'}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {String(result.person2.birthDate.day).padStart(2, '0')}.{String(result.person2.birthDate.month).padStart(2, '0')}.{result.person2.birthDate.year}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className={cn(
            "text-5xl font-display font-bold shrink-0",
            result.compatibilityPercent >= 80 ? "text-emerald-600" :
            result.compatibilityPercent >= 60 ? "text-primary" :
            result.compatibilityPercent >= 40 ? "text-amber-600" : "text-red-500"
          )}>
            {result.compatibilityPercent}%
          </span>
          <div className="flex-1 w-full">
            <ScoreBar percent={result.compatibilityPercent} />
          </div>
        </div>
      </div>

      {/* ═══ BASIC TIER ═══════════════════════════════════════════════════════ */}
      {!isPro && (
        <div className="space-y-6">
          <div className="gradient-card rounded-xl p-5 border border-primary/30">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">
                {t("compatibility.unionArcana")}: {result.unionArcana} — {unionArcana?.name}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {unionArcana?.compatibilityDescription || unionArcana?.personalDescription}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="gradient-card rounded-xl p-5 border border-border">
              <h3 className="text-base font-display text-primary mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {t("compatibility.strengths")}
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
              <h3 className="text-base font-display text-primary mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> {t("compatibility.challenges")}
              </h3>
              <ul className="space-y-2">
                {result.challenges.slice(0, 3).map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-amber-500 mt-0.5">!</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border p-5 text-center">
            <p className="text-sm text-muted-foreground">{t("res.compat.proFooter")}</p>
          </div>
        </div>
      )}

      {/* ═══ PRO TIER ═════════════════════════════════════════════════════════ */}
      {isPro && (
        <>
          {/* Tab bar */}
          <div className="flex gap-2 flex-wrap mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.id === 'matrices' && <Layers className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'union' && <UnionTab result={result} isPro={isPro} aiReading={aiReading ?? null} aiLoading={aiLoading} />}
          {activeTab === 'person1' && result.matrix1 && (
            <PartnerTab
              matrix={result.matrix1}
              crossMatrix={result.cross1Matrix}
              name={result.person1.name}
              accentColor="primary"
              otherName={result.person2.name}
            />
          )}
          {activeTab === 'person2' && result.matrix2 && (
            <PartnerTab
              matrix={result.matrix2}
              crossMatrix={result.cross2Matrix}
              name={result.person2.name}
              accentColor="primary"
              otherName={result.person1.name}
            />
          )}
          {activeTab === 'matrices' && <MatricesTab result={result} />}
        </>
      )}

    </div>
  );
}
