import { useState, useEffect } from "react";
import { PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import {
  generatePurposeReading, PurposeReading, TriangleBlock, MatrixPositionBlock, PeriodBlock, PosMini,
} from "@/lib/aiPurposeService";
import { MatrixGrid, MatrixCell } from "./MatrixGrid";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Sparkles, Compass, Flame, Landmark, KeyRound, Link2, Crown,
  Sun, Moon, Hourglass, Grid3x3, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb, Star,
  Target, Briefcase, Copy, RefreshCw,
} from "lucide-react";
import { ChapterBlock } from "./ChapterBlock";
import { LoadingScreen } from "./LoadingScreen";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props { matrix: PersonalMatrix; name: string; onReset: () => void; tier?: string }

const TRI_TITLES = ["Детство и юность (до 25 лет)", "Внутренняя суть личности", "Цель накопления мудрости (после 50 лет)"];
const TRI_ICONS = [Sun, Moon, Hourglass];

/* ============ кирпичики ============ */

function Divider({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 pt-5 pb-1">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
      <div className="flex items-center gap-2 text-primary shrink-0">
        <Icon className="w-4 h-4" />
        <span className="font-display font-semibold text-sm uppercase tracking-[0.18em] text-center">{title}</span>
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

function DualPanel({ plus, minus, plusLabel = "В плюсе", minusLabel = "В минусе" }: { plus?: string; minus?: string; plusLabel?: string; minusLabel?: string }) {
  if (!plus && !minus) return null;
  return (
    <div className="grid md:grid-cols-2 gap-3 mt-4">
      {plus && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {plusLabel}</div>
          <p className="text-sm text-foreground/90 leading-relaxed">{plus}</p>
        </div>
      )}
      {minus && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wide text-destructive mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> {minusLabel}</div>
          <p className="text-sm text-foreground/90 leading-relaxed">{minus}</p>
        </div>
      )}
    </div>
  );
}

function Verdict({ text, title = "Главный вывод", icon: Icon = Sparkles }: { text?: string; title?: string; icon?: React.ElementType }) {
  if (!text) return null;
  return (
    <div className="mt-5 rounded-xl bg-primary/8 border border-primary/25 p-4 backdrop-blur-md">
      <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {title}</div>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

function ListPanel({ title, items, tone, icon: Icon }: { title: string; items?: string[]; tone: "primary" | "warning" | "success"; icon?: React.ElementType }) {
  if (!items || items.length === 0) return null;
  const border = tone === "warning" ? "border-destructive/25 bg-destructive/5" : tone === "success" ? "border-emerald-500/25 bg-emerald-500/5" : "border-primary/20 bg-primary/5";
  const head = tone === "warning" ? "text-destructive" : tone === "success" ? "text-emerald-600" : "text-primary";
  const Ic = Icon || (tone === "warning" ? AlertTriangle : tone === "success" ? CheckCircle2 : Star);
  return (
    <div className={`rounded-xl border p-4 backdrop-blur-md ${border}`}>
      <div className={`text-xs font-semibold uppercase tracking-wide mb-1 flex items-center gap-1.5 ${head}`}><Ic className="w-3.5 h-3.5" /> {title}</div>
      <Bullets items={items} tone={tone} />
    </div>
  );
}

function ProfCatalog({ groups }: { groups: { group: string; items: string[] }[] }) {
  if (!groups || groups.length === 0) return null;
  return (
    <div className="space-y-3">
      {groups.map((g, i) => (
        <div key={i} className="rounded-xl bg-muted/20 border border-border/50 p-3 backdrop-blur-md">
          <div className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-primary" /> {g.group}</div>
          <div className="flex flex-wrap gap-1.5">
            {g.items?.map((p, j) => <span key={j} className="text-xs bg-secondary/70 px-2 py-1 rounded-full text-secondary-foreground">{p}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}

function PosCard({ item, arcanaNum }: { item: PosMini; arcanaNum: number }) {
  const a = getArcana(arcanaNum);
  return (
    <div className="rounded-2xl border border-border/60 bg-white/25 backdrop-blur-md p-4">
      <div className="flex items-start gap-3 mb-2">
        <MatrixCell position={item.position} value={arcanaNum} />
        <div className="min-w-0 pt-0.5">
          <div className="text-[11px] text-primary/80 uppercase tracking-wide">Позиция {item.position}</div>
          <div className="font-display font-semibold text-foreground leading-tight">{item.title}</div>
          {a && <div className="text-xs text-muted-foreground mt-0.5">{arcanaNum} {a.name} · {a.planet} · {a.element}</div>}
        </div>
      </div>
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{item.text}</p>
      <DualPanel plus={item.plus} minus={item.minus} />
    </div>
  );
}

/* ============ секции ============ */

function TriangleChapter({ b, arcanaNum, idx }: { b: TriangleBlock; arcanaNum: number; idx: number }) {
  const a = getArcana(arcanaNum);
  return (
    <ChapterBlock num={idx + 1} arcana={arcanaNum} title={b.positionTitle || TRI_TITLES[idx]} subtitle={b.arcanaName || (a ? `${arcanaNum} Аркан «${a.name}»` : undefined)}>
      <Para text={b.description} />
      <DualPanel plus={b.plus} minus={b.minus} plusLabel="Энергия в плюсе" minusLabel="Энергия в минусе" />
      <Para label="Главная задача аркана" text={b.task} />
      <Para label="Как проявляется в жизни" text={b.inLife} />
      <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4 backdrop-blur-md">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Как это проявляется у вас</div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{b.inYou}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mt-5">
        <ListPanel title="Сильные стороны" items={b.strengths} tone="success" />
        <ListPanel title="Слабые стороны" items={b.weaknesses} tone="warning" />
      </div>
      {b.professions?.length > 0 && (
        <div className="mt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-2 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Где зарабатывает и подходящие профессии</div>
          <ProfCatalog groups={b.professions} />
        </div>
      )}
      {b.advice?.length > 0 && <div className="mt-5"><ListPanel title="Что с этим делать" items={b.advice} tone="primary" icon={Lightbulb} /></div>}
      <Verdict text={b.conclusion} />
    </ChapterBlock>
  );
}

function PeriodCard({ p, i }: { p: PeriodBlock; i: number }) {
  const Icon = TRI_ICONS[i] || Hourglass;
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center backdrop-blur-md"><Icon className="w-3 h-3 text-primary" /></div>
      <div className="absolute left-3 top-8 bottom-0 w-px bg-primary/20" />
      <div className="pb-6">
        <div className="font-display font-bold text-lg text-foreground leading-tight">{p.title}</div>
        {p.range && <div className="text-xs text-primary/80 uppercase tracking-wide mt-0.5 mb-2">{p.range}</div>}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{p.text}</p>
        {p.focus && (
          <div className="mt-3 rounded-xl bg-primary/5 border border-primary/20 p-3 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1 flex items-center gap-1.5"><Lightbulb className="w-3.5 h-3.5" /> На чём сосредоточиться</div>
            <p className="text-sm text-foreground/90 leading-relaxed">{p.focus}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MatrixPosCard({ item, arcanaNum }: { item: MatrixPositionBlock; arcanaNum: number }) {
  const a = getArcana(arcanaNum);
  return (
    <div className="gradient-card rounded-2xl border border-border p-5">
      <div className="flex items-start gap-3 mb-3 pb-3 border-b border-border/50">
        <MatrixCell position={item.position} value={arcanaNum} />
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

  const d = matrix.birthDate;
  const P = matrix.positions;
  const tri = [P[0], P[1], P[2]];

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
        <div className="inline-flex items-center gap-2 text-primary/80 text-xs uppercase tracking-[0.25em] mb-2"><Sparkles className="w-3.5 h-3.5" /> Методика 22 арканов</div>
        <h1 className="text-3xl md:text-4xl font-display text-primary mb-2">Предназначение</h1>
        {name && <p className="text-lg text-foreground">{name}</p>}
        <p className="text-muted-foreground text-sm">Дата рождения: {d.day}.{d.month}.{d.year}</p>
      </div>

      {/* Матрица, единый вид как в остальных разборах */}
      <div className="gradient-card rounded-2xl border border-border p-5">
        <div className="flex items-center gap-2 mb-4"><Compass className="w-5 h-5 text-primary" /><span className="font-display font-semibold text-foreground">Ваша матрица</span></div>
        <div className="flex justify-center"><MatrixGrid matrix={matrix} /></div>
        <p className="text-xs text-muted-foreground text-center mt-3">Нажмите на карту чтобы рассмотреть аркан</p>
      </div>

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
          {reading.triangle.slice(0, 3).map((b, i) => <TriangleChapter key={i} b={b} arcanaNum={tri[i]} idx={i} />)}

          {reading.periods && reading.periods.length > 0 && (
            <>
              <Divider title="Жизненные периоды" icon={Hourglass} />
              <ChapterBlock icon={Hourglass} title="Периоды вашей жизни" subtitle="Как меняются энергии с возрастом">
                <div className="mt-2">{reading.periods.map((p, i) => <PeriodCard key={i} p={p} i={i} />)}</div>
              </ChapterBlock>
            </>
          )}

          {reading.destinyTriangle && (
            <>
              <Divider title="Треугольник предназначения" icon={Target} />
              <ChapterBlock icon={Target} title="Треугольник предназначения" subtitle="Позиции 2, 4, 5. Что вы призваны реализовать" variant="highlight">
                <Para text={reading.destinyTriangle.intro} />
                <div className="space-y-3 mt-4">
                  {reading.destinyTriangle.items?.map((it, i) => <PosCard key={i} item={it} arcanaNum={P[it.position - 1]} />)}
                </div>
                <Verdict text={reading.destinyTriangle.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.soulGoals && (
            <>
              <Divider title="Цели и задачи души" icon={Compass} />
              <ChapterBlock icon={Compass} title="Цели и задачи души" subtitle="Позиции 7, 8, 9. Цель, путь реализации и зона комфорта">
                <Para text={reading.soulGoals.intro} />
                <div className="space-y-3 mt-4">
                  {reading.soulGoals.items?.map((it, i) => <PosCard key={i} item={it} arcanaNum={P[it.position - 1]} />)}
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-5">
                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-md">
                    <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Что ускоряет предназначение</div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{reading.soulGoals.accelerators}</p>
                  </div>
                  <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 backdrop-blur-md">
                    <div className="text-xs font-semibold uppercase tracking-wide text-destructive mb-1.5 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Что тормозит реализацию</div>
                    <p className="text-sm text-foreground/90 leading-relaxed">{reading.soulGoals.brakes}</p>
                  </div>
                </div>
                <Verdict text={reading.soulGoals.recommendations} title="Практические рекомендации" icon={Lightbulb} />
                <Verdict text={reading.soulGoals.conclusion} />
              </ChapterBlock>
            </>
          )}

          {reading.work && (
            <>
              <Divider title="Работа и самореализация" icon={Briefcase} />
              <ChapterBlock icon={Briefcase} title="Взаимодействие арканов в работе" subtitle="Как ваши энергии соединяются в профессиональный путь">
                <Para text={reading.work.interaction} />
                <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Какая деятельность раскрывает ваш потенциал</div>
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{reading.work.whatReveals}</p>
                </div>
                {reading.work.professions?.length > 0 && (
                  <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-primary/80 mb-2 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> Подходящие профессии по вашим арканам</div>
                    <div className="space-y-4">
                      {reading.work.professions.map((pr, i) => (
                        <div key={i}>
                          <div className="font-display font-semibold text-foreground mb-2">{pr.arcanaName}</div>
                          <ProfCatalog groups={pr.groups} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ChapterBlock>
            </>
          )}

          {reading.mirrors && reading.mirrors.items && reading.mirrors.items.length > 0 && (
            <>
              <Divider title="Зеркальные арканы" icon={Copy} />
              <ChapterBlock icon={Copy} title="Зеркальные арканы" subtitle="Энергии, повторяющиеся в ключевых точках матрицы">
                <Para text={reading.mirrors.intro} />
                <div className="space-y-3 mt-4">
                  {reading.mirrors.items.map((it, i) => (
                    <div key={i} className="rounded-2xl border border-primary/20 bg-primary/5 p-4 backdrop-blur-md">
                      <div className="font-display font-semibold text-foreground">{it.arcanaName}</div>
                      <div className="text-xs text-primary/80 uppercase tracking-wide mb-1">{it.positions}{it.kind ? `, ${it.kind}` : ""}</div>
                      <Para label="Что усиливается" text={it.repeats} />
                      <DualPanel plus={it.plus} minus={it.minus} />
                      <Para label="Жизненный сценарий" text={it.scenario} />
                      <Para label="Влияние позиций" text={it.influence} />
                    </div>
                  ))}
                </div>
              </ChapterBlock>
            </>
          )}

          {reading.reversed && reading.reversed.items && reading.reversed.items.length > 0 && (
            <>
              <Divider title="Перевёрнутые арканы" icon={Flame} />
              <ChapterBlock icon={Flame} title="Перевёрнутые арканы" subtitle="Заблокированные энергии и как их раскрыть" variant="warning">
                <Para text={reading.reversed.intro} />
                <div className="space-y-3 mt-4">
                  {reading.reversed.items.map((it, i) => (
                    <div key={i} className="rounded-2xl border border-border/60 bg-white/25 p-4 backdrop-blur-md">
                      <div className="font-display font-semibold text-foreground mb-1">{it.arcanaName}</div>
                      {it.intro && <p className="text-sm text-muted-foreground leading-relaxed">{it.intro}</p>}
                      <Para label="Как проявляется в минусе" text={it.minus} />
                      <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4 backdrop-blur-md">
                        <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Как перевести энергию в плюс</div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{it.toPlus}</p>
                      </div>
                      <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 backdrop-blur-md">
                        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Как проявляется в плюсе</div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{it.plus}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Verdict text={reading.reversed.verdict} title="Итог от нумеролога" icon={Sparkles} />
              </ChapterBlock>
            </>
          )}

          {reading.karma && (
            <>
              <Divider title="Кармические задачи" icon={Landmark} />
              <ChapterBlock icon={Landmark} title="Кармические задачи" subtitle="Кармический треугольник, позиции 10, 11, 12">
                <Para label="Взаимодействие кармических энергий" text={reading.karma.triangle} />
                <Para label="Главный кармический урок" text={reading.karma.lesson} />
                <Para label="Через какие ситуации проявляется карма" text={reading.karma.situations} />
                <DualPanel plus={reading.karma.helps} minus={reading.karma.worsens} plusLabel="Что помогает закрыть уроки" minusLabel="Что усиливает проблемы" />
                <Verdict text={reading.karma.recommendations} title="Практические рекомендации" icon={Lightbulb} />
              </ChapterBlock>
            </>
          )}

          {reading.final && (
            <>
              <Divider title="Итоговое заключение" icon={Crown} />
              <ChapterBlock icon={Crown} title="Взаимодействие шести позиций" subtitle="Позиции 2, 4, 5 и 7, 8, 9. Единый путь реализации" variant="highlight">
                <DualPanel plus={reading.final.plus} minus={reading.final.minus} plusLabel="В гармоничном состоянии" minusLabel="В минусовом проявлении" />
                <div className="mt-5 rounded-xl bg-primary/8 border border-primary/25 p-4 backdrop-blur-md">
                  <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-1.5 flex items-center gap-1.5"><Crown className="w-3.5 h-3.5" /> Главная профессиональная рекомендация</div>
                  <p className="text-sm text-foreground/90 leading-relaxed">{reading.final.recommendation}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  <ListPanel title="Подходящие сферы" items={reading.final.spheres} tone="primary" icon={Briefcase} />
                  <ListPanel title="Ключевые сильные стороны" items={reading.final.strengths} tone="success" />
                </div>
                <Para label="Оптимальный формат работы" text={reading.final.format} />
                <Para label="Оптимальный путь реализации" text={reading.final.path} />
                <Verdict text={reading.final.numerologist} title="Слово нумеролога" icon={Sparkles} />
              </ChapterBlock>
            </>
          )}

          <NadezhdaSignature />
        </>
      )}
    </div>
  );
}
