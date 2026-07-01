import { AIYearReading } from "@/lib/aiYearForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { Layers, BatteryCharging, BatteryLow, Star, HeartPulse, GraduationCap, ListChecks, Gift, CalendarClock } from "lucide-react";

interface Props {
  reading: AIYearReading | null;
  loading: boolean;
}

// Расширенный VIP-анализ: энергетические взаимодействия и итоговые темы года.
export function YearExtendedBlocks({ reading }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock icon={Layers} title="Энергетические взаимодействия" subtitle="Как энергии года складываются по периодам" variant="highlight">
        {T(reading?.energyInteractions)}
      </ChapterBlock>

      <ChapterBlock icon={CalendarClock} title="Ключевые даты года">
        {T(reading?.keyDates)}
      </ChapterBlock>

      <div className="grid md:grid-cols-2 gap-4">
        <ChapterBlock icon={BatteryCharging} title="Что даёт вам энергию" variant="success">
          {T(reading?.energyGivers)}
        </ChapterBlock>
        <ChapterBlock icon={BatteryLow} title="Что забирает энергию" variant="warning">
          {T(reading?.energyTakers)}
        </ChapterBlock>
      </div>

      <ChapterBlock icon={Star} title="Таланты и точки роста">
        {T(reading?.talents)}
      </ChapterBlock>

      <ChapterBlock icon={HeartPulse} title="Исцеляющие темы года">
        {T(reading?.healing)}
      </ChapterBlock>

      <ChapterBlock icon={GraduationCap} title="Главный экзамен года" variant="warning">
        {T(reading?.exam)}
      </ChapterBlock>

      <ChapterBlock icon={ListChecks} title="Задачи года">
        {T(reading?.tasks)}
      </ChapterBlock>

      <ChapterBlock icon={Gift} title="Пожелание на следующий год" variant="highlight">
        {T(reading?.wish)}
      </ChapterBlock>
    </>
  );
}
