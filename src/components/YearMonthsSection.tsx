import { useState } from "react";
import { calculateMonthForecast } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { AIYearMonthDetail } from "@/lib/aiYearForecastService";
import { ChapterBlock } from "./ChapterBlock";
import { ChevronDown, ChevronUp, CalendarRange } from "lucide-react";

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const arcanaImg = (n: number) => `/arcana/arcana-${n}.webp`;

function Sub({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="rounded-xl bg-muted/30 p-4">
      <h4 className="text-sm font-medium text-foreground mb-1.5">{title}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

interface Base { day: number; month: number; year: number; targetYear: number }

function YearMonthCard({ base, month, detail }: { base: Base; month: number; detail?: AIYearMonthDetail }) {
  const [open, setOpen] = useState(false);
  const mf = calculateMonthForecast(base.day, base.month, base.year, month, base.targetYear);
  const a3 = getArcana(mf.position3);
  const tri = [mf.position1, mf.position2, mf.position3];

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 p-3 hover:bg-muted/20 transition-colors text-left">
        <div className="flex gap-1.5 shrink-0">
          {tri.map((v, i) => (
            <div key={i} className={`relative w-8 h-12 rounded-md overflow-hidden ring-1 ${i === 2 ? "ring-primary/50" : "ring-border/60"}`}>
              <img src={arcanaImg(v)} alt="" className="w-full h-full object-cover" draggable={false} />
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-base text-foreground">{MONTHS[month - 1]}</div>
          <div className="text-xs text-muted-foreground truncate">
            {mf.position1} · {mf.position2} · <span className="text-primary">{mf.position3} {a3?.name}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && detail && (
        <div className="px-3 pb-3 border-t border-border/40 pt-3 space-y-3">
          <Sub title="Общая тема месяца" text={detail.theme} />
          <div className="grid md:grid-cols-2 gap-3">
            <Sub title="Работа и деньги" text={detail.moneyWork} />
            <Sub title="Отношения" text={detail.relationships} />
            <Sub title="Здоровье и состояние" text={detail.health} />
            <Sub title="Главный шанс" text={detail.chance} />
          </div>
          <Sub title="Главный риск" text={detail.risk} />
          {detail.tip && (
            <div className="rounded-xl bg-primary/8 border border-primary/20 p-4">
              <h4 className="text-sm font-medium text-primary mb-1.5">Совет месяца</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface Props {
  base: Base;
  months: Record<string, AIYearMonthDetail>;
}

export function YearMonthsSection({ base, months }: Props) {
  return (
    <ChapterBlock icon={CalendarRange} title="Подробный прогноз по месяцам" subtitle="Нажмите на месяц, чтобы раскрыть разбор по сферам">
      <div className="space-y-2">
        {MONTHS.map((_, i) => (
          <YearMonthCard key={i + 1} base={base} month={i + 1} detail={months?.[String(i + 1)]} />
        ))}
      </div>
    </ChapterBlock>
  );
}
