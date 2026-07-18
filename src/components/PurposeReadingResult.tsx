import { useState, useEffect } from "react";
import { PersonalMatrix } from "@/lib/calculations";
import { getArcana, positionDescriptions } from "@/lib/arcana";
import {
  generatePurposeReading, PurposeReading, TriangleBlock, MatrixPositionBlock, PeriodBlock,
} from "@/lib/aiPurposeService";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Sparkles, Compass, Flame, Landmark, KeyRound, Link2, Crown, X,
  Sun, Moon, Hourglass, Grid3x3, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, Star,
} from "lucide-react";
import { ChapterBlock } from "./ChapterBlock";
import { LoadingScreen } from "./LoadingScreen";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  matrix: PersonalMatrix;
  name: string;
  onReset: () => void;
  tier?: string;
}

const TRI_TITLES = [
  "Детство и юность (до 25 лет)",
  "Внутренняя суть личности",
  "Цель накопления мудрости (после 50 лет)",
];
const TRI_ICONS = [Sun, Moon, Hourglass];

/* ============ мелкие кирпичики оформления ============ */

function ArcanaZoom({ value, onClose }: { value: number; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [onClose]);
  const a = getArcana(value);
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative z-10 flex flex-col items-center pb-6 pt-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white shadow-lg">
          <X className="w-5 h-5" />
        </button>
        <img src={`/arcana/arcana-${value}.webp`} alt={`Аркан ${value}`} draggable={false} className="rounded-2xl shadow-2xl object-contain max-h-[78vh] w-auto sm:h-[520px]" />
        {a && <div className="mt-3 text-center text-white/90 text-sm font-display">{value} {a.name} · {a.planet} · {a.element}</div>}
      </div>
    </div>
  );
}

function Divider({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 pt-4 pb-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
      <div className="flex items-center gap-2 text-primary shrink-0">
        <Icon className="w-4 h-4" />
        <span className="font-display font-semibold text-sm uppercase tracking-[0.18em]">{title}</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
    </div>
  );
}

function Bullets({ items, tone = "primary" }: { items?: string[]; tone?: "primary" | "warning" | "success" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "warning" ? "text-destructive" : tone === "success" ? "text-emerald-600" : "text-primary";
  return (
    <ul className="space-y-1.5 mt-1">
      {items.map((it, i) => (
        <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
          <span className={`${dot} mt-0.5 shrink-0`}>•</span><span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function Para({ label, text }: { label?: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      {label && <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1.5">{label}</div>}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

function Verdict({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-5 rounded-xl bg-primary/8 border border-primary/25 p-4 backdrop-blur-md">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" /> Главный вывод
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
    </div>
  );
}

function ListPanel({ title, items, tone }: { title: string; items?: string[]; tone: "primary" | "warning" | "success" }) {
  if (!items || items.length === 0) return null;
  const border = tone === "warning" ? "border-destructive/25 bg-destructive/5" : tone === "success" ? "border-emerald-500/25 bg-emerald-500/5" : "border-primary/20 bg-primary/5";
  const head = tone === "warning" ? "text-destructive" : tone === "success" ? "text-emerald-600" : "text-primary";
  const Icon = tone === "warning" ? AlertTriangle : tone === "success" ? CheckCircle2 : Star;
  return (
    <div className={`rounded-xl border p-4 backdrop-blur-md ${border}`}>
      <div className={`text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1.5 ${head}`}>
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <Bullets items={items} tone={tone} />
    </div>
  );
}

function ArcanaThumb({ n, caption, sub, onOpen, big }: { n: number; caption?: string; sub?: string; onOpen: (n: number) => void; big?: boolean }) {
  const a = getArcana(n);
  return (
    <button onClick={() => onOpen(n)} className="group flex flex-col items-center text-center gap-1.5 rounded-2xl border border-border/60 bg-white/35 backdrop-blur-md p-2.5 hover:border-primary/50 hover:bg-white/50 transition-all">
      <div className={`relative w-full ${big ? "aspect-[2/3]" : "aspect-[2/3]"} rounded-xl overflow-hidden ring-1 ring-border/60 shadow-sm`}>
        <img src={`/arcana/arcana-${n}.webp`} alt={a?.name || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center">
          <span className="text-[10px] font-bold text-white/90">{n}</span>
        </div>
      </div>
      {caption && <div className="text-[10px] text-muted-foreground leading-tight">{caption}</div>}
      <div className={`font-display font-semibold text-foreground leading-tight ${big ? "text-sm" : "text-[11px]"}`}>{a?.name}</div>
      {sub && <div className="text-[10px] text-muted-foreground leading-tight">{sub}</div>}
    </button>
  );
}

/* ============ крупные секции ============ */

function TriangleChapter({ b, arcanaNum, idx }: { b: TriangleBlock; arcanaNum: number; idx: number }) {
  const a = getArcana(arcanaNum);
  return (
    <ChapterBlock
      num={idx + 1}
      arcana={arcanaNum}
      title={b.positionTitle || TRI_TITLES[idx]}
      subtitle={a ? `${b.arcanaName || `${arcanaNum} Аркан «${a.name}»`}` : b.arcanaName}
    >
      <Para text={b.description} />

      <div className="grid md:grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Энергия в плюсе
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{b.plus}</p>
        </div>
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-destructive mb-1.5 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Энергия в минусе
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{b.minus}</p>
        </div>
      </div>

      <Para label="Главная задача аркана" text={b.task} />
      <Para label="Как проявляется в жизни" text={b.inLife} />

      <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4 backdrop-blur-md">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" /> Как это проявляется у вас
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{b.inYou}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-5">
        <ListPanel title="Сильные стороны" items={b.strengths} tone="success" />
        <ListPanel title="Слабые стороны" items={b.weaknesses} tone="warning" />
      </div>

      {b.professions?.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Где зарабатывает и подходящие профессии
          </div>
          <div className="space-y-3">
            {b.professions.map((g, i) => (
              <div key={i} className="rounded-xl bg-muted/20 border border-border/50 p-3 backdrop-blur-md">
                <div className="text-sm font-medium text-foreground mb-1.5">{g.group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items?.map((p, j) => (
                    <span key={j} className="text-xs bg-secondary/70 px-2 py-1 rounded-full text-secondary-foreground">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {b.advice?.length > 0 && (
        <div className="mt-5">
          <ListPanel title="Что с этим делать" items={b.advice} tone="primary" />
        </div>
      )}

      <Verdict text={b.conclusion} />
    </ChapterBlock>
  );
}

function PeriodCard({ p, i }: { p: PeriodBlock; i: number }) {
  const Icon = TRI_ICONS[i] || Hourglass;
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center backdrop-blur-md">
        <Icon className="w-3 h-3 text-primary" />
      </div>
      <div className="absolute left-3 top-8 bottom-0 w-px bg-primary/20" />
      <div className="pb-6">
        <div className="font-display font-bold text-lg text-foreground leading-tight">{p.title}</div>
        {p.range && <div className="text-xs text-primary/80 uppercase tracking-wide mt-0.5 mb-2">{p.range}</div>}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{p.text}</p>
        {p.focus && (
          <div className="mt-3 rounded-xl bg-primary/5 border border-primary/20 p-3 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> На чём сосредоточиться
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">{p.focus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixPosCard({ item, arcanaNum, onOpen }: { item: MatrixPositionBlock; arcanaNum: number; onOpen: (n: number) => void }) {
  const a = getArcana(arcanaNum);
  return (
    <div className="gradient-card rounded-2xl border border-border p-5">
      <div className="flex items-start gap-3 mb-3 pb-3 border-b border-border/50">
        <button onClick={() => onOpen(arcanaNum)} className="relative w-11 h-[62px] rounded-lg overflow-hidden shrink-0 ring-1 ring-border/60 hover:scale-105 transition-transform">
          <img src={`/arcana/arcana-${arcanaNum}.webp`} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[1px]">
            <span className="text-[9px] font-bold text-white/90">{arcanaNum}</span>
          </div>
        </button>
        <div className="min-w-0">
          <div className="text-[11px] text-primary/80 uppercase tracking-wide">Позиция {item.position}</div>
          <h3 className="font-display font-bold text-base text-foreground leading-tight">{item.title}</h3>
          {a && <p className="text-xs text-muted-foreground mt-0.5">{arcanaNum} {a.name} · {a.planet} · {a.element}</p>}
        </div>
      </div>
      <Para text={item.meaning} />
      <Para label="У вас" text={item.inYou} />
      {item.advice && (
        <div className="mt-3 rounded-lg bg-primary/5 border border-primary/20 p-3 backdrop-blur-md">
          <p className="text-sm text-foreground/90 leading-relaxed"><span className="font-medium text-primary">Совет: </span>{item.advice}</p>
        </div>
      )}
    </div>
  );
}

/* ============ основной компонент ============ */

export function PurposeReadingResult({ matrix, name, onReset }: Props) {
  const [reading, setReading] = useState<PurposeReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);

  const d = matrix.birthDate;
  const tri = [matrix.positions[0], matrix.positions[1], matrix.positions[2]];

  useEffect(() => {
    let alive = true;
    setLoading(true); setErr(false); setReading(null);
    generatePurposeReading(matrix, name)
      .then((r) => { if (alive) { setReading(r); setLoading(false); } })
      .catch(() => { if (alive) { setErr(true); setLoading(false); } });
    return () => { alive = false; };
  }, [matrix, name]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Новый расчёт
      </Button>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 text-primary/80 text-xs uppercase tracking-[0.25em] mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Методика 22 арканов
        </div>
        <h1 className="text-3xl md:text-4xl font-display text-primary mb-2">Предназначение</h1>
        {name && <p className="text-lg text-foreground">{name}</p>}
        <p className="text-muted-foreground text-sm">Дата рождения: {d.day}.{d.month}.{d.year}</p>
      </div>

      {/* Треугольник виден сразу */}
      <ChapterBlock icon={Compass} title="Основной треугольник" subtitle="Фундамент личности. Нажмите на карту, чтобы увеличить.">
        <div className="grid grid-cols-3 gap-3">
          {tri.map((n, i) => (
            <ArcanaThumb key={i} n={n} caption={TRI_TITLES[i]} onOpen={setZoom} big />
          ))}
        </div>
      </ChapterBlock>

      {/* Полная матрица видна сразу */}
      <ChapterBlock icon={Grid3x3} title="Полная матрица" subtitle="Все 12 позиций вашей матрицы предназначения">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {matrix.positions.map((n, i) => (
            <ArcanaThumb key={i} n={n} caption={`${i + 1}. ${positionDescriptions[i + 1]?.title || ""}`} onOpen={setZoom} />
          ))}
        </div>
      </ChapterBlock>

      {loading && <LoadingScreen methodId="purpose" />}

      {err && !loading && (
        <div className="gradient-card rounded-2xl border border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">Не удалось сгенерировать разбор. Попробуйте открыть его ещё раз чуть позже.</p>
        </div>
      )}

      {reading && !loading && (
        <>
          {reading.intro && (
            <div className="gradient-card rounded-2xl border border-primary/25 p-6 text-center">
              <Sparkles className="w-5 h-5 text-primary mx-auto mb-3" />
              <p className="text-base text-foreground/90 leading-relaxed italic">{reading.intro}</p>
            </div>
          )}

          <Divider title="Основной треугольник" icon={Compass} />
          {reading.triangle.slice(0, 3).map((b, i) => (
            <TriangleChapter key={i} b={b} arcanaNum={tri[i]} idx={i} />
          ))}

          {reading.periods && reading.periods.length > 0 && (
            <>
              <Divider title="Жизненные периоды" icon={Hourglass} />
              <ChapterBlock icon={Hourglass} title="Периоды вашей жизни" subtitle="Как меняются энергии с возрастом">
                <div className="mt-2">
                  {reading.periods.map((p, i) => <PeriodCard key={i} p={p} i={i} />)}
                </div>
              </ChapterBlock>
            </>
          )}

          {reading.fullMatrix && reading.fullMatrix.length > 0 && (
            <>
              <Divider title="Разбор 12 позиций" icon={Grid3x3} />
              <div className="space-y-4">
                {reading.fullMatrix.map((it, i) => (
                  <MatrixPosCard key={i} item={it} arcanaNum={matrix.positions[(it.position || i + 1) - 1] ?? matrix.positions[i]} onOpen={setZoom} />
                ))}
              </div>
            </>
          )}

          {reading.reversed && (
            <>
              <Divider title="Заблокированные энергии" icon={Flame} />
              <ChapterBlock icon={Flame} title="Перевёрнутые арканы" subtitle="Что работает не в полную силу и как это раскрыть" variant="warning">
                <Para text={reading.reversed.intro} />
                <div className="space-y-3 mt-4">
                  {reading.reversed.items?.map((it, i) => (
                    <div key={i} className="rounded-xl bg-muted/20 border border-border/50 p-4 backdrop-blur-md">
                      <div className="font-display font-semibold text-foreground mb-1">{it.arcanaName}</div>
                      <Para label="Как проявляется" text={it.how} />
                      <Para label="Что с этим делать" text={it.what} />
                    </div>
                  ))}
                </div>
                <Verdict text={reading.reversed.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.purpose && (
            <>
              <Divider title="Цель жизни" icon={Compass} />
              <ChapterBlock icon={Compass} title="Цель жизни" subtitle="Предназначение и задача души" variant="highlight">
                <Para label="Предназначение" text={reading.purpose.mission} />
                <Para label="Главная задача души" text={reading.purpose.soulTask} />
                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-md">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">При реализации</div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{reading.purpose.inPlus}</p>
                  </div>
                  <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 backdrop-blur-md">
                    <div className="text-xs font-semibold uppercase tracking-wide text-destructive mb-1.5">При уходе в минус</div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{reading.purpose.inMinus}</p>
                  </div>
                </div>
                <div className="mt-5"><ListPanel title="Признаки, что вы идёте своим путём" items={reading.purpose.signs} tone="success" /></div>
                <Verdict text={reading.purpose.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.karma && (
            <>
              <Divider title="Кармические задачи" icon={Landmark} />
              <ChapterBlock icon={Landmark} title="Кармические задачи" subtitle="Хвост прошлого, уроки и работа воплощения">
                <Para label="Кармический хвост" text={reading.karma.tail} />
                <Para label="Невыполненные задачи" text={reading.karma.unfinished} />
                <Para label="Главный урок воплощения" text={reading.karma.lesson} />
                <div className="mt-5"><ListPanel title="Повторяющиеся сценарии" items={reading.karma.patterns} tone="warning" /></div>
                <Verdict text={reading.karma.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.successCode && (
            <>
              <Divider title="Код успеха" icon={KeyRound} />
              <ChapterBlock icon={KeyRound} title="Код успеха" subtitle="Личная формула достижения результата" variant="success">
                <Para label="Ваша формула" text={reading.successCode.formula} />
                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  <ListPanel title="Что ускоряет" items={reading.successCode.accelerators} tone="success" />
                  <ListPanel title="Что тормозит" items={reading.successCode.brakes} tone="warning" />
                </div>
                <div className="mt-3"><ListPanel title="Сильные стороны" items={reading.successCode.strengths} tone="primary" /></div>
                <div className="mt-3"><ListPanel title="С чего начать" items={reading.successCode.steps} tone="primary" /></div>
                <Verdict text={reading.successCode.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.connections && (
            <>
              <Divider title="Связки позиций" icon={Link2} />
              <ChapterBlock icon={Link2} title="Связки позиций" subtitle="Как энергии матрицы взаимодействуют между собой">
                <Para text={reading.connections.text} />
                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  <ListPanel title="Усиления" items={reading.connections.amplifications} tone="success" />
                  <ListPanel title="Конфликты энергий" items={reading.connections.conflicts} tone="warning" />
                </div>
                <div className="mt-3"><ListPanel title="Скрытые закономерности" items={reading.connections.hidden} tone="primary" /></div>
                <Verdict text={reading.connections.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.final && (
            <>
              <Divider title="Итоговый анализ" icon={Crown} />
              <ChapterBlock icon={Crown} title="Итоговый анализ" subtitle="Профессиональное заключение мастера" variant="highlight">
                <Para label="Кто вы в целом" text={reading.final.who} />
                <Para label="Главный потенциал" text={reading.final.potential} />
                <Para label="Ключевые риски" text={reading.final.risks} />
                <Para label="Где реализуетесь быстрее всего" text={reading.final.whereRealize} />
                <div className="mt-5 rounded-xl bg-primary/8 border border-primary/25 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" /> Главная рекомендация на жизнь
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{reading.final.recommendation}</p>
                </div>
              </ChapterBlock>
            </>
          )}

          <NadezhdaSignature />
        </>
      )}

      {zoom !== null && <ArcanaZoom value={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
