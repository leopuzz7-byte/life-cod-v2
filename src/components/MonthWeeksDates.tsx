import { AIMonthReading } from "@/lib/aiMonthForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { CalendarDays, MessageCircle, AlertTriangle, Sparkles } from "lucide-react";

interface Props {
  reading: AIMonthReading | null;
  loading: boolean;
}

const WEEKS: { key: 'week1' | 'week2' | 'week3' | 'week4'; label: string; range: string }[] = [
  { key: 'week1', label: 'Первая неделя', range: '1–7' },
  { key: 'week2', label: 'Вторая неделя', range: '8–14' },
  { key: 'week3', label: 'Третья неделя', range: '15–21' },
  { key: 'week4', label: 'Четвёртая неделя', range: '22 – конец' },
];

// Главы 14-17: недели, рекомендации, чего избегать, практика.
export function MonthWeeksDates({ reading }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock icon={CalendarDays} title="Прогноз по четырём неделям">
        <div className="space-y-3">
          {WEEKS.map((w, i) => (
            <div key={w.key} className={i === 2 ? "rounded-xl bg-primary/5 border border-primary/20 p-4" : "rounded-xl bg-muted/30 p-4"}>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">{w.label}</h4>
                <span className="text-xs text-muted-foreground">{w.range}</span>
              </div>
              {reading ? <ProTextBlock text={reading[w.key]} /> : <ChapterSkeleton lines={3} />}
            </div>
          ))}
        </div>
      </ChapterBlock>

      <ChapterBlock icon={MessageCircle} title="Практические рекомендации" variant="highlight">
        {T(reading?.recommendations)}
      </ChapterBlock>

      <ChapterBlock icon={AlertTriangle} title="Чего избегать" variant="warning">
        {T(reading?.avoid)}
      </ChapterBlock>

      <ChapterBlock icon={Sparkles} title="Ежедневная практика месяца">
        {T(reading?.practice)}
      </ChapterBlock>
    </>
  );
}
