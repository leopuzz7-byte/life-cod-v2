import { useState, useEffect } from "react";
import { PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { generatePurposeReading, PurposeReading, TriangleBlock } from "@/lib/aiPurposeService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Compass, Flame, Landmark, KeyRound, Link2, Crown, X } from "lucide-react";
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

function TriCard({ n, idx, onOpen }: { n: number; idx: number; onOpen: (n: number) => void }) {
  const a = getArcana(n);
  return (
    <button onClick={() => onOpen(n)} className="group flex flex-col items-center text-center gap-2 rounded-2xl border border-border/70 bg-white/40 backdrop-blur-md p-3 hover:border-primary/50 transition-all">
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden ring-1 ring-border/60 shadow-sm">
        <img src={`/arcana/arcana-${n}.webp`} alt={a?.name || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center">
          <span className="text-[10px] font-bold text-white/90">{n}</span>
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground leading-tight">{TRI_TITLES[idx]}</div>
      <div className="text-sm font-display font-semibold text-foreground leading-tight">{a?.name}</div>
    </button>
  );
}

function Bullets({ items, tone = "primary" }: { items: string[]; tone?: "primary" | "warning" }) {
  if (!items || items.length === 0) return null;
  const dot = tone === "warning" ? "text-destructive" : "text-primary";
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

function Para({ label, text }: { label: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1">{label}</div>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

function Verdict({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div className="mt-5 rounded-xl bg-primary/5 border border-primary/20 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" /> Главный вывод
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
    </div>
  );
}

function TriangleChapter({ b, arcanaNum, idx, fallbackTitle }: { b: TriangleBlock; arcanaNum: number; idx: number; fallbackTitle: string }) {
  return (
    <ChapterBlock num={idx + 1} arcana={arcanaNum} title={b.positionTitle || fallbackTitle} subtitle={b.arcanaName}>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{b.description}</p>
      <Para label="Энергия в плюсе" text={b.plus} />
      <Para label="Энергия в минусе" text={b.minus} />
      <Para label="Главная задача аркана" text={b.task} />
      <Para label="Как проявляется в жизни" text={b.inLife} />
      <Para label="Как это проявляется у вас" text={b.inYou} />
      {b.strengths?.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1">Сильные стороны</div>
          <Bullets items={b.strengths} />
        </div>
      )}
      {b.weaknesses?.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-destructive/80 mb-1">Слабые стороны</div>
          <Bullets items={b.weaknesses} tone="warning" />
        </div>
      )}
      {b.professions?.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-2">Где зарабатывает и подходящие профессии</div>
          <div className="space-y-2">
            {b.professions.map((g, i) => (
              <div key={i}>
                <div className="text-sm font-medium text-foreground mb-1">{g.group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((p, j) => (
                    <span key={j} className="text-xs bg-secondary/70 px-2 py-1 rounded-full text-secondary-foreground">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Verdict text={b.conclusion} />
    </ChapterBlock>
  );
}

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

      {/* Матрица — виден сразу, до генерации ИИ */}
      <ChapterBlock icon={Compass} title="Основной треугольник" subtitle="Фундамент вашей личности. Нажмите на карту, чтобы увеличить.">
        <div className="grid grid-cols-3 gap-3">
          {tri.map((n, i) => (
            <TriCard key={i} n={n} idx={i} onOpen={setZoom} />
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
            <p className="text-base text-foreground/90 leading-relaxed text-center px-2">{reading.intro}</p>
          )}

          {reading.triangle.slice(0, 3).map((b, i) => (
            <TriangleChapter key={i} b={b} arcanaNum={tri[i]} idx={i} fallbackTitle={TRI_TITLES[i]} />
          ))}

          {reading.reversed && (
            <ChapterBlock icon={Flame} title="Перевёрнутые арканы" subtitle="Заблокированные энергии и как их раскрыть" variant="warning">
              {reading.reversed.intro && <p className="text-sm text-foreground/90 leading-relaxed mb-3">{reading.reversed.intro}</p>}
              <div className="space-y-4">
                {reading.reversed.items?.map((it, i) => (
                  <div key={i} className="rounded-xl bg-muted/25 border border-border/50 p-4">
                    <div className="font-display font-semibold text-foreground mb-2">{it.arcanaName}</div>
                    <Para label="Как проявляется" text={it.how} />
                    <Para label="Что с этим делать" text={it.what} />
                  </div>
                ))}
              </div>
              <Verdict text={reading.reversed.conclusion} />
            </ChapterBlock>
          )}

          {reading.purpose && (
            <ChapterBlock icon={Compass} title="Цель жизни" subtitle="Предназначение и задача души" variant="highlight">
              <Para label="Предназначение" text={reading.purpose.mission} />
              <Para label="Главная задача души" text={reading.purpose.soulTask} />
              <Para label="При реализации" text={reading.purpose.inPlus} />
              <Para label="При уходе в минус" text={reading.purpose.inMinus} />
              <Verdict text={reading.purpose.conclusion} />
            </ChapterBlock>
          )}

          {reading.karma && (
            <ChapterBlock icon={Landmark} title="Кармические задачи" subtitle="Хвост, уроки и главная работа воплощения">
              <Para label="Кармический хвост" text={reading.karma.tail} />
              <Para label="Невыполненные задачи" text={reading.karma.unfinished} />
              <Para label="Главный урок воплощения" text={reading.karma.lesson} />
              <Verdict text={reading.karma.conclusion} />
            </ChapterBlock>
          )}

          {reading.successCode && (
            <ChapterBlock icon={KeyRound} title="Код успеха" subtitle="Личная формула достижения результата" variant="success">
              <Para label="Формула успеха" text={reading.successCode.formula} />
              {reading.successCode.strengths?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1">Сильные стороны</div><Bullets items={reading.successCode.strengths} /></div>
              )}
              {reading.successCode.accelerators?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-emerald-600/90 mb-1">Что ускоряет реализацию</div><Bullets items={reading.successCode.accelerators} /></div>
              )}
              {reading.successCode.brakes?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-destructive/80 mb-1">Что тормозит</div><Bullets items={reading.successCode.brakes} tone="warning" /></div>
              )}
              <Verdict text={reading.successCode.conclusion} />
            </ChapterBlock>
          )}

          {reading.connections && (
            <ChapterBlock icon={Link2} title="Связки позиций" subtitle="Как энергии матрицы взаимодействуют между собой">
              <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{reading.connections.text}</p>
              {reading.connections.conflicts?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-destructive/80 mb-1">Конфликты энергий</div><Bullets items={reading.connections.conflicts} tone="warning" /></div>
              )}
              {reading.connections.amplifications?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1">Усиления</div><Bullets items={reading.connections.amplifications} /></div>
              )}
              {reading.connections.hidden?.length > 0 && (
                <div className="mt-4"><div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-1">Скрытые закономерности</div><Bullets items={reading.connections.hidden} /></div>
              )}
              <Verdict text={reading.connections.conclusion} />
            </ChapterBlock>
          )}

          {reading.final && (
            <ChapterBlock icon={Crown} title="Итоговый анализ" subtitle="Профессиональное заключение" variant="highlight">
              <Para label="Кто вы в целом" text={reading.final.who} />
              <Para label="Главный потенциал" text={reading.final.potential} />
              <Para label="Ключевые риски" text={reading.final.risks} />
              <Para label="Где реализуетесь быстрее всего" text={reading.final.whereRealize} />
              <Para label="Главная рекомендация на жизнь" text={reading.final.recommendation} />
            </ChapterBlock>
          )}

          <NadezhdaSignature />
        </>
      )}

      {zoom !== null && <ArcanaZoom value={zoom} onClose={() => setZoom(null)} />}
    </div>
  );
}
