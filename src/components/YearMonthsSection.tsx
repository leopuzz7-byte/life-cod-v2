import { useState, useMemo } from "react";
import { calculateMonthForecast, MonthForecast } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { useMonthForecastAI } from "@/hooks/useMonthForecastAI";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { ChevronDown, ChevronUp, CalendarRange } from "lucide-react";

const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

const arcanaImg = (n: number) => `/arcana/arcana-${n}.webp`;

function SubCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-muted/30 p-4">
      <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      {children}
    </div>
  );
}

// Полный разбор месяца (генерируется лениво при раскрытии).
function YearMonthBody({ forecast, name }: { forecast: MonthForecast; name: string }) {
  const { reading } = useMonthForecastAI(forecast, name);
  const T = (t?: string) => (reading ? <ProTextBlock text={t || ""} /> : <ChapterSkeleton lines={3} />);
  return (
    <div className="space-y-3 pt-3">
      <SubCard title="Главная энергия месяца">{T(reading?.mainEnergy)}</SubCard>
      <SubCard title="Общий прогноз">{T(reading?.generalForecast)}</SubCard>
      <div className="grid md:grid-cols-2 gap-3">
        <SubCard title="Деньги">{T(reading?.money)}</SubCard>
        <SubCard title="Работа">{T(reading?.career)}</SubCard>
        <SubCard title="Отношения">{T(reading?.relationships)}</SubCard>
        <SubCard title="Здоровье">{T(reading?.health)}</SubCard>
      </div>
      <SubCard title="Рекомендации">{T(reading?.recommendations)}</SubCard>
      <SubCard title="Главный урок месяца">{T(reading?.conclusion)}</SubCard>
    </div>
  );
}

function YearMonthCard({ base, month, name }: { base: { day: number; month: number; year: number; targetYear: number }; month: number; name: string }) {
  const [open, setOpen] = useState(false);
  const mf = useMemo(
    () => calculateMonthForecast(base.day, base.month, base.year, month, base.targetYear),
    [base.day, base.month, base.year, base.targetYear, month]
  );
  const a1 = getArcana(mf.position1), a2 = getArcana(mf.position2), a3 = getArcana(mf.position3);
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
            {mf.position1} {a1?.name} · {mf.position2} {a2?.name} · <span className="text-primary">{mf.position3} {a3?.name}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && <div className="px-3 pb-3 border-t border-border/40">{<YearMonthBody forecast={mf} name={name} />}</div>}
    </div>
  );
}

interface Props {
  base: { day: number; month: number; year: number; targetYear: number };
  name: string;
}

export function YearMonthsSection({ base, name }: Props) {
  return (
    <ChapterBlock icon={CalendarRange} title="Подробный прогноз по месяцам" subtitle="Нажмите на месяц, чтобы раскрыть полный разбор">
      <div className="space-y-2">
        {MONTHS.map((_, i) => (
          <YearMonthCard key={i + 1} base={base} month={i + 1} name={name} />
        ))}
      </div>
    </ChapterBlock>
  );
}
