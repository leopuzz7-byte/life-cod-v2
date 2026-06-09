import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Heart, Compass, Clock, TrendingUp, Star, Anchor,
  Target, ShieldAlert, CheckCircle, Users, X, Layers, ChevronDown, ChevronUp
} from "lucide-react";
import { CompatibilityResult, PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { getPositionInterpretation, PositionInterpretation } from "@/lib/matrixInterpretation";
import { ProArcanaCard } from "./ProArcanaCard";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import type { TierType } from "@/lib/analysisConfig";

// ─── Совместимостные переопределения ──────────────────────────────────────────

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
  1: "Первое что объединило этих двух людей — первоначальный импульс, энергия притяжения, тот самый момент когда что-то щёлкнуло. Аркан первой позиции описывает саму природу этой встречи и то, как всё начиналось.",
  2: "Аркан союза — ядро матрицы. Вся остальная структура строится вокруг этой позиции. Это не характеристика кого-то одного — это энергия, рождающаяся между ними. Именно она определяет характер и судьбу союза на самом глубоком уровне.",
  3: "Аркан гармонии показывает, как пара воспринимается снаружи — друзьями, семьёй, обществом. Это общий «социальный образ» отношений, то, как они выглядят в мире и что транслируют другим людям.",
  4: "Позиция, которая раскрывается в зрелых отношениях. Здесь лежит та мудрость, к которой пара приходит, пройдя через опыт первых двух периодов. Это не «награда за терпение» — это потенциал, который растёт с годами.",
  5: "Как эти двое могут поддерживать амбиции и социальную реализацию друг друга. Совместимость в профессиональной и общественной сфере — насколько они могут расти в одном направлении или уважать пути друг друга.",
  6: "В матрице совместимости шестая позиция занята кармическим арканом. Это не просто точка опоры — это то, что нужно трансформировать обоим. Здесь живёт ключевой вызов пары, но также и скрытый ресурс роста.",
  7: "Зачем эти два человека встретились на уровне жизненных целей. Какое совместное движение, какие общие смыслы рождаются из этих отношений — то, к чему они идут вместе осознанно или нет.",
  8: "Конкретный способ, через который пара реализует свою общую цель. Это методы, инструменты и подходы, которые работают именно для этого союза — путь, а не только назначение.",
  9: "Общее ресурсное состояние пары. Место, куда оба партнёра возвращаются за восстановлением, что приносит покой и заряжает снова. Важно уметь находить это состояние вместе — и не застревать в нём.",
  10: "Кармические паттерны из прошлого, которые оба принесли в эти отношения. Ситуации, которые будут повторяться снова и снова, пока не будут проработаны обоими — не по отдельности, а вместе.",
  11: "Автоматические сценарии, запускающиеся в этих отношениях. «Снова наступаем на одни и те же грабли» — именно про эту позицию. Осознание этого паттерна обоими уже наполовину его снимает.",
  12: "Главная кармическая задача всего союза. То ради чего эти два человека встретились на самом глубинном уровне. Когда эта задача решается — многое другое в отношениях начинает рассасываться само собой.",
};

/** Возвращает PositionInterpretation с текстами, адаптированными для совместимости */
function getCompatInterpretation(position: number, arcanaNumber: number): PositionInterpretation {
  const base = getPositionInterpretation(position, arcanaNumber);
  return {
    ...base,
    positionTitle: compatPositionTitles[position] || base.positionTitle,
    positionIntro: compatPositionIntros[position] || base.positionIntro,
    ageRange: undefined, // убираем возрастные рамки в контексте совместимости
  };
}

// ─── Arcana image helper ───────────────────────────────────────────────────────

function getArcanaImage(n: number): string {
  return `/arcana/arcana-${n}.webp`;
}

// ─── Arcana Modal ──────────────────────────────────────────────────────────────

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
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full sm:w-auto flex flex-col items-center pb-6 pt-4 sm:pb-0 sm:pt-0"
        onClick={e => e.stopPropagation()}
      >
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
          className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:max-h-[80vh] sm:h-[520px] sm:w-auto"
        />
      </div>
    </div>
  );
}

// ─── Matrix Cell (card style, clickable) ──────────────────────────────────────

function MatrixCell({
  position, value, isHighlight = false
}: { position: number; value: number; isHighlight?: boolean }) {
  const imgSrc = getArcanaImage(value);
  const [modalOpen, setModalOpen] = useState(false);
  const handleClose = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer",
          "w-12 h-[72px] md:w-14 md:h-[84px]",
          isHighlight
            ? "ring-2 ring-amber-400 shadow-[0_0_8px_2px] shadow-amber-400/40"
            : "ring-1 ring-border/60"
        )}
        onClick={() => setModalOpen(true)}
      >
        {imgSrc ? (
          <img src={imgSrc} alt={`Аркан ${value}`} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-lg font-display font-bold text-foreground">{value}</span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center py-[2px]">
          <span className={cn("text-[10px] font-bold leading-none", isHighlight ? "text-amber-300" : "text-white/90")}>
            {value}
          </span>
        </div>
        <div className={cn(
          "absolute top-[3px] right-[3px] w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold leading-none",
          isHighlight ? "bg-amber-400 text-black" : "bg-black/50 text-white/80"
        )}>
          {position}
        </div>
      </div>
      {modalOpen && <ArcanaModal value={value} onClose={handleClose} />}
    </>
  );
}

// ─── Visual Matrix Grid ────────────────────────────────────────────────────────

function MatrixGrid({ matrix, accentPos2 = false }: { matrix: PersonalMatrix; accentPos2?: boolean }) {
  const p = matrix.positions;
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Кармический треугольник */}
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={10} value={p[9]} />
        <MatrixCell position={11} value={p[10]} />
        <MatrixCell position={12} value={p[11]} isHighlight />
      </div>
      <div className="w-full h-px bg-border/40 my-0.5" />
      {/* Основной треугольник */}
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
      {/* Диагональный ряд */}
      <div className="flex gap-2 md:gap-3">
        <MatrixCell position={7} value={p[6]} />
        <MatrixCell position={8} value={p[7]} />
        <MatrixCell position={9} value={p[8]} />
      </div>
    </div>
  );
}

// ─── Section Header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  variant = 'default'
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  variant?: 'default' | 'amber' | 'subtle';
}) {
  return (
    <div className={cn(
      "flex items-start gap-3 pb-3 border-b",
      variant === 'amber' ? "border-amber-500/30" : "border-border/60"
    )}>
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
        variant === 'amber' ? "bg-amber-500/15" : "bg-primary/10"
      )}>
        <Icon className={cn("w-4.5 h-4.5", variant === 'amber' ? "text-amber-600" : "text-primary")} />
      </div>
      <div>
        <h3 className={cn(
          "font-display font-semibold text-base",
          variant === 'amber' ? "text-amber-700" : "text-foreground"
        )}>{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

// ─── Mini Arcana Ref (компактная ссылка на уже показанную позицию) ─────────────

function MiniArcanaRef({ position, value, note }: { position: number; value: number; note: string }) {
  const arcana = getArcana(value);
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border/40">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-display font-bold text-primary">{value}</span>
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

// ─── Compact Score Bar ─────────────────────────────────────────────────────────

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

// ─── Expandable Block ──────────────────────────────────────────────────────────

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
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);
  const matrix = result.unionMatrix;
  if (!matrix) return null;
  const p = matrix.positions;

  return (
    <div className="space-y-6">

      {/* 3 ключевых аркана — вводный блок */}
      <div className="gradient-card rounded-2xl border border-primary/25 p-5 space-y-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-center">Три ключевых аркана союза</p>
        <div className="grid grid-cols-3 gap-3">
          {/* Аркан союза */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/8 border border-primary/20">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-muted-foreground text-center uppercase tracking-wide">Аркан союза</span>
            <span className="text-2xl font-display font-bold text-primary">{result.unionArcana}</span>
            <span className="text-xs text-foreground text-center font-medium leading-tight">{unionArcana?.name}</span>
          </div>
          {/* Аркан гармонии */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <Star className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] text-muted-foreground text-center uppercase tracking-wide">Гармония</span>
            <span className="text-2xl font-display font-bold text-emerald-600">{result.harmonyArcana}</span>
            <span className="text-xs text-foreground text-center font-medium leading-tight">{harmonyArcana?.name}</span>
          </div>
          {/* Аркан кармы */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] text-muted-foreground text-center uppercase tracking-wide">Карма</span>
            <span className="text-2xl font-display font-bold text-amber-600">{result.karmaArcana}</span>
            <span className="text-xs text-foreground text-center font-medium leading-tight">{karmaArcana?.name}</span>
          </div>
        </div>
        {/* Вводный текст об аркане союза */}
        <div className="text-sm text-muted-foreground leading-relaxed bg-primary/5 rounded-xl p-4 border border-primary/10">
          <p>{unionArcana?.compatibilityDescription || unionArcana?.personalDescription}</p>
        </div>
      </div>

      {/* Визуальная матрица */}
      <div className="gradient-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-primary" />
          <span className="font-display font-semibold text-foreground">Матрица союза</span>
        </div>
        <div className="flex justify-center">
          <MatrixGrid matrix={matrix} accentPos2 />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">Нажмите на карту чтобы рассмотреть аркан</p>
      </div>

      {/* ═══ ПЕРИОД 1: Начало отношений ══════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Clock}
          title="Начало отношений"
          subtitle="Первый треугольник (позиции 1 · 2 · 3) — энергия первого контакта, притяжения и начального периода."
        />
        {[1, 2, 3].map(pos => (
          <ProArcanaCard
            key={pos}
            interpretation={getCompatInterpretation(pos, p[pos - 1])}
          />
        ))}
      </div>

      {/* ═══ ПЕРИОД 2: Середина отношений ═══════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={TrendingUp}
          title="Середина отношений"
          subtitle="Второй треугольник (позиции 2 · 3 · 5) — к сути союза и внешнему образу добавляется совместный путь."
        />
        <div className="space-y-2">
          <MiniArcanaRef position={2} value={p[1]} note="суть союза — присутствует во всех трёх периодах" />
          <MiniArcanaRef position={3} value={p[2]} note="внешний образ пары — см. начало отношений" />
        </div>
        <ProArcanaCard interpretation={getCompatInterpretation(5, p[4])} />
      </div>

      {/* ═══ ПЕРИОД 3: Дальнейшее развитие ══════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Star}
          title="Дальнейшее развитие"
          subtitle="Третий треугольник (позиции 2 · 4 · 5) — мудрость, которая накапливается в зрелых отношениях."
        />
        <div className="space-y-2">
          <MiniArcanaRef position={2} value={p[1]} note="суть союза" />
          <MiniArcanaRef position={5} value={p[4]} note="совместный путь — см. середину отношений" />
        </div>
        <ProArcanaCard interpretation={getCompatInterpretation(4, p[3])} />
      </div>

      {/* ═══ ТОЧКА ОПОРЫ ══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Anchor}
          title="Кармическая ось"
          subtitle="Позиция 6 — в матрице совместимости здесь стоит кармический аркан. Ключевой вызов и скрытый ресурс пары."
          variant="amber"
        />
        <ProArcanaCard interpretation={getCompatInterpretation(6, p[5])} />
      </div>

      {/* ═══ ЦЕЛИ В ОТНОШЕНИЯХ ════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={Target}
          title="Цели в отношениях"
          subtitle="Позиции 7 · 8 · 9 — куда идёт эта пара, через что достигает и где восстанавливается."
        />
        {[7, 8, 9].map(pos => (
          <ProArcanaCard key={pos} interpretation={getCompatInterpretation(pos, p[pos - 1])} />
        ))}
      </div>

      {/* ═══ КАРМИЧЕСКИЕ ЗАДАЧИ ═══════════════════════════════════════════════ */}
      <div className="space-y-4">
        <SectionHeader
          icon={ShieldAlert}
          title="Кармические задачи союза"
          subtitle="Позиции 10 · 11 · 12 — что нужно проработать обоим, повторяющиеся паттерны и главная задача этого союза."
          variant="amber"
        />
        <div className="gradient-card rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 text-sm text-muted-foreground leading-relaxed">
          Эти три позиции показывают кармическую программу отношений. Они не «плохие» — они точки трансформации. Пара, осознавшая свои кармические задачи, превращает их из источника конфликтов в источник роста.
        </div>
        {[10, 11, 12].map(pos => (
          <ProArcanaCard key={pos} interpretation={getCompatInterpretation(pos, p[pos - 1])} />
        ))}
      </div>

    </div>
  );
}

// ─── Partner Tab (предназначение партнёра + крест-матрица) ──────────────────────

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
  const [destTab, setDestTab] = useState<'triangle' | 'goals' | 'karma'>('triangle');

  const p = matrix.positions;
  const crossP = crossMatrix?.positions;

  // Позиции которые изменились в кросс-матрице: 2, 5, 7 (по calculations.ts)
  const changedPositions = [2, 5, 7];

  return (
    <div className="space-y-6">

      {/* Шапка партнёра */}
      <div className={cn("gradient-card rounded-2xl border p-5", borderClass)}>
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", bgClass)}>
            <Users className={cn("w-5 h-5", colorClass)} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Предназначение</p>
            <h3 className={cn("font-display font-bold text-lg", colorClass)}>{name}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Полная матрица предназначения {name} — все 12 позиций в контексте личности, а не совместимости. Ниже — как {name} проявляется именно в этих отношениях с {otherName}.
        </p>
      </div>

      {/* Матрица партнёра */}
      <div className={cn("gradient-card rounded-2xl border p-5", borderClass)}>
        <div className="flex items-center gap-2 mb-4">
          <Compass className={cn("w-5 h-5", colorClass)} />
          <span className="font-display font-semibold text-foreground">Матрица предназначения</span>
        </div>
        <div className="flex justify-center">
          <MatrixGrid matrix={matrix} />
        </div>
      </div>

      {/* Вкладки предназначения */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'triangle' as const, label: 'Основной треугольник' },
          { id: 'goals' as const, label: 'Цели и карьера' },
          { id: 'karma' as const, label: 'Кармический блок' },
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

      {/* Основной треугольник (поз. 1-6) */}
      {destTab === 'triangle' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Позиции 1–6 — основа личности, детство, таланты, цели и точка опоры.</p>
          {[1, 2, 3, 4, 5, 6].map(pos => (
            <ProArcanaCard
              key={pos}
              interpretation={getPositionInterpretation(pos, p[pos - 1])}
            />
          ))}
        </div>
      )}

      {/* Цели и карьера (поз. 7-9) */}
      {destTab === 'goals' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Позиции 7–9 — цель жизни, инструмент достижения и зона комфорта.</p>
          {[7, 8, 9].map(pos => (
            <ProArcanaCard
              key={pos}
              interpretation={getPositionInterpretation(pos, p[pos - 1])}
            />
          ))}
        </div>
      )}

      {/* Кармический блок (поз. 10-12) */}
      {destTab === 'karma' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Позиции 10–12 — кармические задачи, ошибки прошлого и главная задача жизни.</p>
          {[10, 11, 12].map(pos => (
            <ProArcanaCard
              key={pos}
              interpretation={getPositionInterpretation(pos, p[pos - 1])}
            />
          ))}
        </div>
      )}

      {/* Кросс-матрица — как партнёр проявляется в этих конкретных отношениях */}
      {crossMatrix && crossP && (
        <ExpandableBlock title={`Как ${name} меняется в этих отношениях`} defaultOpen={true}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Кросс-матрица показывает, как именно отношения с {otherName} трансформируют {name}. Изменены позиции 2, 5 и 7 — внутренняя суть, профессиональный путь и цель жизни.
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
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Что изменилось</p>
            {changedPositions.map(pos => {
              const orig = p[pos - 1];
              const cross = crossP[pos - 1];
              const origArcana = getArcana(orig);
              const crossArcana = getArcana(cross);
              if (orig === cross) return null;
              return (
                <div key={pos} className={cn("rounded-xl p-4 border", bgClass, borderClass)}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">Поз. {pos}: {compatPositionTitles[pos]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Обычно</div>
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <span className="font-display font-bold text-sm text-foreground">{orig}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{origArcana?.name}</div>
                    </div>
                    <div className={cn("flex-1 h-px", isRose ? "bg-rose-300/40" : "bg-primary/30")} />
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">В союзе</div>
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isRose ? "bg-rose-400/20" : "bg-primary/20")}>
                        <span className={cn("font-display font-bold text-sm", colorClass)}>{cross}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">{crossArcana?.name}</div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
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

// ─── Matrices Tab (only visual, 5 matrices) ────────────────────────────────────

function MatricesTab({ result }: { result: CompatibilityResult }) {
  if (!result.matrix1 || !result.matrix2 || !result.unionMatrix) return null;

  const matrices = [
    { label: `Предназначение — ${result.person1.name}`, matrix: result.matrix1, accent: 'primary' as const },
    { label: `Предназначение — ${result.person2.name}`, matrix: result.matrix2, accent: 'rose' as const },
    { label: "Матрица союза", matrix: result.unionMatrix, accent: 'amber' as const },
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
          accent === 'rose' ? "border-rose-300/25" : accent === 'amber' ? "border-amber-500/25" : "border-primary/25"
        )}>
          <p className={cn(
            "text-xs font-medium uppercase tracking-wide mb-4 text-center",
            accent === 'rose' ? "text-rose-500" : accent === 'amber' ? "text-amber-600" : "text-primary"
          )}>{label}</p>
          <div className="flex justify-center">
            <MatrixGrid matrix={matrix} accentPos2={accent === 'amber'} />
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
  const harmonyArcana = getArcana(result.harmonyArcana);
  const karmaArcana = getArcana(result.karmaArcana);

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
          {/* Union arcana */}
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

          {/* Strengths & challenges */}
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
          {activeTab === 'union' && (
            <UnionTab result={result} />
          )}
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
          {activeTab === 'matrices' && (
            <MatricesTab result={result} />
          )}
        </>
      )}

    </div>
  );
}
