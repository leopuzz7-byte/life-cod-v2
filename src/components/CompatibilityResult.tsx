import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Heart, Compass, Clock, TrendingUp, Star, Anchor,
  Target, ShieldAlert, CheckCircle, Users, X, Layers,
  ChevronDown, ChevronUp, Sparkles, Key
} from "lucide-react";
import { CompatibilityResult, PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { getPositionInterpretation } from "@/lib/matrixInterpretation";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import type { TierType } from "@/lib/analysisConfig";

// ─── Совместимостные тексты ────────────────────────────────────────────────────

const compatPositionTitles: Record<number, string> = {
  1: "Начало союза",
  2: "Суть союза",
  3: "Пара вовне",
  4: "Мудрость отношений",
  5: "Совместный путь",
  6: "Кармическая ось",
  7: "Общая цель",
  8: "Инструмент достижения",
  9: "Ресурс пары",
  10: "Кармический груз",
  11: "Повторяющиеся паттерны",
  12: "Главная задача союза",
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
          className="absolute top-2 right-4 sm:-top-10 sm:right-0 z-20 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 transition-colors flex items-center justify-center text-white"
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
  accentColor?: 'primary' | 'rose';
  highlight?: boolean;
}

function CompCard({ position, value, positionTitle, contextIntro, accentColor = 'primary', highlight = false }: CompCardProps) {
  const arcana = getArcana(value);
  if (!arcana) return null;
  const imgSrc = getArcanaImage(value);
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isRose = accentColor === 'rose';
  const accentText = isRose ? "text-rose-500" : "text-primary";
  const accentBorder = isRose ? "border-rose-300/40" : "border-primary/30";
  const accentBg = isRose ? "bg-rose-400/8" : "bg-primary/8";

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

      {/* Arcana description — expandable */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          <span>{expanded ? 'Скрыть' : 'Энергия аркана'}</span>
        </button>
        {expanded && (
          <div className={cn("mt-2 rounded-xl p-3 text-sm text-muted-foreground leading-relaxed", highlight ? `${accentBg} border ${accentBorder}` : "bg-muted/25")}>
            {arcana.compatibilityDescription || arcana.personalDescription}
          </div>
        )}
      </div>

      {modalOpen && <ArcanaModal value={value} onClose={() => setModalOpen(false)} />}
    </div>
  );
}

// Обёртка для совместимости
function CompatCard({ position, value, highlight = false }: { position: number; value: number; highlight?: boolean }) {
  return (
    <CompCard
      position={position}
      value={value}
      positionTitle={compatPositionTitles[position] || `Позиция ${position}`}
      contextIntro={compatPositionIntros[position] || ''}
      highlight={highlight}
    />
  );
}

// Обёртка для личной матрицы
function PersonalCard({ position, value, accentColor = 'primary' as const }: { position: number; value: number; accentColor?: 'primary' | 'rose' }) {
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
    <div className="flex items-start gap-3 pb-3 border-b border-border/60">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h3 className="font-display font-semibold text-base text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>}
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
}: {
  triangleNum: number;
  label: string;
  intro: string;
  positions: readonly number[];
  matrix: PersonalMatrix;
  shownPositions: Set<number>;
}) {
  const p = matrix.positions;
  const newPositions = positions.filter(pos => !shownPositions.has(pos));
  const repeatedPositions = positions.filter(pos => shownPositions.has(pos));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-display font-bold text-primary">{triangleNum}</span>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground">Треугольник {triangleNum} · {label}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{intro}</p>
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
        <CompatCard key={pos} position={pos} value={p[pos - 1]} highlight={pos === 2} />
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
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percent}%` }} />
      </div>
      <span className="text-sm font-display font-bold text-foreground shrink-0">{percent}%</span>
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
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

// ─── Union Tab ─────────────────────────────────────────────────────────────────

function UnionTab({ result }: { result: CompatibilityResult }) {
  const unionArcana = getArcana(result.unionArcana);
  const matrix = result.unionMatrix;
  if (!matrix) return null;
  const p = matrix.positions;

  // Треугольники — отслеживаем уже показанные позиции
  const shownSets: Set<number>[] = [new Set(), new Set(), new Set()];
  TRIANGLES.forEach((tri, idx) => {
    if (idx > 0) tri.positions.forEach(pos => {
      if (TRIANGLES.slice(0, idx).some(prev => prev.positions.includes(pos as never))) {
        shownSets[idx].add(pos);
      }
    });
  });

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
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Общая энергия союза</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {unionArcana?.compatibilityDescription || unionArcana?.personalDescription}
        </p>
      </div>

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
              shownPositions={shownSets[idx]}
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
        <CompatCard position={6} value={p[5]} />
      </div>

      {/* ═══ ЦЕЛИ В ОТНОШЕНИЯХ ════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Target}
          title="Цели в отношениях"
          subtitle="Позиции 7 · 8 · 9 — куда идёт пара, через что достигает и где восстанавливается."
        />
        {[7, 8, 9].map(pos => (
          <CompatCard key={pos} position={pos} value={p[pos - 1]} />
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
          <CompatCard key={pos} position={pos} value={p[pos - 1]} highlight={pos === 12} />
        ))}
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
  accentColor: 'primary' | 'rose';
  otherName: string;
}) {
  const isRose = accentColor === 'rose';
  const colorClass = isRose ? "text-rose-500" : "text-primary";
  const borderClass = isRose ? "border-rose-300/30" : "border-primary/30";
  const bgClass = isRose ? "bg-rose-400/5" : "bg-primary/5";
  const [destTab, setDestTab] = useState<'main' | 'goals' | 'karma'>('main');

  const p = matrix.positions;
  const crossP = crossMatrix?.positions;
  const changedPositions = [2, 5, 7];

  // Ключевые арканы личной матрицы
  const keyPositions = [1, 2, 3, 7, 12];

  return (
    <div className="space-y-6">

      {/* Шапка */}
      <div className={cn("gradient-card rounded-2xl border p-5", borderClass, bgClass)}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", isRose ? "bg-rose-400/15" : "bg-primary/10")}>
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
              <div key={pos} className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border", isRose ? "border-rose-300/30 bg-rose-400/5" : "border-primary/20 bg-primary/5")}>
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
                ? isRose ? "bg-rose-500 text-white" : "bg-primary text-primary-foreground"
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
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Позиции 1–6 · детство, личность, таланты, точка опоры</p>
          {[1, 2, 3, 4, 5, 6].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* Цели */}
      {destTab === 'goals' && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Позиции 7–9 · цель, инструмент, зона комфорта</p>
          {[7, 8, 9].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* Карма */}
      {destTab === 'karma' && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Позиции 10–12 · кармические задачи</p>
          {[10, 11, 12].map(pos => (
            <PersonalCard key={pos} position={pos} value={p[pos - 1]} accentColor={accentColor} />
          ))}
        </div>
      )}

      {/* Крест-матрица */}
      {crossMatrix && crossP && (
        <ExpandableBlock title={`${name} в этих отношениях`} defaultOpen={true}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Кросс-матрица показывает, как отношения с {otherName} меняют {name}. Изменены три ключевые позиции — внутренняя суть (2), совместный путь (5) и жизненная цель (7).
          </p>

          {/* Визуальная матрица кросс */}
          <div className={cn("rounded-xl p-4 border", bgClass, borderClass)}>
            <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">Матрица в отношениях</p>
            <div className="flex justify-center">
              <MatrixGrid matrix={crossMatrix} />
            </div>
          </div>

          {/* Изменённые позиции */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Что меняется в союзе</p>
            {changedPositions.map(pos => {
              const orig = p[pos - 1];
              const cross = crossP[pos - 1];
              const origArcana = getArcana(orig);
              const crossArcana = getArcana(cross);
              if (orig === cross) return null;
              return (
                <div key={pos} className={cn("rounded-xl p-4 border", bgClass, borderClass)}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-3">Поз. {pos} · {compatPositionTitles[pos]}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Обычно</span>
                      <div className="relative w-10 h-[60px] rounded-lg overflow-hidden ring-1 ring-border/50">
                        <img src={getArcanaImage(orig)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] text-muted-foreground/70">{origArcana?.name}</span>
                    </div>
                    <div className={cn("flex-1 h-px", isRose ? "bg-rose-300/40" : "bg-primary/30")} />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">В союзе</span>
                      <div className={cn("relative w-10 h-[60px] rounded-lg overflow-hidden ring-2", isRose ? "ring-rose-400/60" : "ring-primary/60")}>
                        <img src={getArcanaImage(cross)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className={cn("text-[9px] font-medium", colorClass)}>{crossArcana?.name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {getPositionInterpretation(pos, cross).positionIntro}
                  </p>
                </div>
              );
            })}
          </div>
        </ExpandableBlock>
      )}
    </div>
  );
}

// ─── Matrices Tab ──────────────────────────────────────────────────────────────

function MatricesTab({ result }: { result: CompatibilityResult }) {
  if (!result.matrix1 || !result.matrix2 || !result.unionMatrix) return null;

  const matrices = [
    { label: `Предназначение — ${result.person1.name}`, matrix: result.matrix1, accent: 'primary' as const },
    { label: `Предназначение — ${result.person2.name}`, matrix: result.matrix2, accent: 'rose' as const },
    { label: "Матрица союза", matrix: result.unionMatrix, accent: 'primary' as const },
    ...(result.cross1Matrix ? [{ label: `${result.person1.name} в отношениях`, matrix: result.cross1Matrix, accent: 'primary' as const }] : []),
    ...(result.cross2Matrix ? [{ label: `${result.person2.name} в отношениях`, matrix: result.cross2Matrix, accent: 'rose' as const }] : []),
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground text-center">
        Пять матриц — полный энергетический портрет пары. Нажмите на карту чтобы рассмотреть аркан.
      </p>
      {matrices.map(({ label, matrix, accent }) => (
        <div key={label} className={cn(
          "gradient-card rounded-2xl border p-5",
          accent === 'rose' ? "border-rose-300/25" : "border-primary/25"
        )}>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wide mb-4 text-center",
            accent === 'rose' ? "text-rose-500" : "text-primary"
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

      {/* Title */}
      <div className="text-center mb-6">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? `✦ ${t("res.proAnalysis")}` : t("res.basicAnalysis")}
        </span>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <h1 className="text-2xl md:text-3xl font-display text-primary">{t("compatibility.title")}</h1>
        </div>
        <p className="text-muted-foreground font-medium">{result.person1.name} · {result.person2.name}</p>
      </div>

      {/* Score */}
      <div className="gradient-card rounded-2xl border border-border p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-center sm:text-left">
            <span className={cn(
              "text-5xl font-display font-bold",
              result.compatibilityPercent >= 80 ? "text-emerald-600" :
              result.compatibilityPercent >= 60 ? "text-primary" :
              result.compatibilityPercent >= 40 ? "text-amber-600" : "text-red-500"
            )}>
              {result.compatibilityPercent}%
            </span>
          </div>
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
          {activeTab === 'union' && <UnionTab result={result} />}
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
              accentColor="rose"
              otherName={result.person1.name}
            />
          )}
          {activeTab === 'matrices' && <MatricesTab result={result} />}
        </>
      )}

    </div>
  );
}
