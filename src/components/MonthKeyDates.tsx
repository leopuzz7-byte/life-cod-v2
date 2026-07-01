import { AIMonthReading, MonthKeyDate } from "@/lib/aiMonthForecastService";
import { getArcana } from "@/lib/arcana";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { CalendarHeart, Star } from "lucide-react";

interface Props {
  reading: AIMonthReading | null;
  keyDates: MonthKeyDate[];
  monthName: string;
  consciousnessArcana: number;
}

function arcanaImage(n: number): string {
  return `/arcana/arcana-${n}.webp`;
}

// Глава 18: ключевые даты месяца с карточками арканов + особый блок дня рождения.
export function MonthKeyDates({ reading, keyDates, monthName, consciousnessArcana }: Props) {
  const consc = getArcana(consciousnessArcana);

  return (
    <ChapterBlock icon={CalendarHeart} title="Ключевые даты месяца">
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        Ваше число Сознания — <span className="text-foreground font-medium">{consciousnessArcana} {consc?.name}</span>.
        Именно через него активируются самые значимые дни месяца.
      </p>
      {reading ? (
        reading.keyDatesIntro && <p className="text-sm text-muted-foreground leading-relaxed mb-4">{reading.keyDatesIntro}</p>
      ) : <div className="mb-4"><ChapterSkeleton lines={2} /></div>}

      <div className="space-y-3">
        {keyDates.map((d) => {
          const arc = getArcana(d.arcana);
          const text = d.isBirthday ? (reading?.specialDate || reading?.keyDates?.[String(d.day)]) : reading?.keyDates?.[String(d.day)];
          return (
            <div
              key={d.day}
              className={d.isBirthday
                ? "flex gap-3 rounded-2xl border border-primary/40 bg-primary/8 p-4"
                : "flex gap-3 rounded-2xl border border-border bg-muted/20 p-4"}
            >
              <div className="relative w-12 h-[72px] rounded-xl overflow-hidden shrink-0 ring-1 ring-border/60">
                <img src={arcanaImage(d.arcana)} alt={arc?.name} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-center py-[2px]">
                  <span className="text-[9px] font-bold text-white/90">{d.arcana}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] uppercase tracking-wide font-medium text-muted-foreground">{d.day} {monthName}</span>
                  {d.isBirthday && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      <Star className="w-3 h-3" /> День рождения · новый личный год
                    </span>
                  )}
                </div>
                <div className={d.isBirthday ? "font-display font-bold text-lg text-primary leading-tight" : "font-display font-bold text-base text-foreground leading-tight"}>
                  {arc?.name}
                </div>
                {reading ? <p className="text-sm text-muted-foreground leading-relaxed mt-1">{text}</p> : <div className="mt-2"><ChapterSkeleton lines={2} /></div>}
              </div>
            </div>
          );
        })}
      </div>
    </ChapterBlock>
  );
}
