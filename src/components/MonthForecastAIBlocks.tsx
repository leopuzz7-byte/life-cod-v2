import { AIMonthReading } from "@/lib/aiMonthForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { BookOpen, Layers, Briefcase, TrendingUp, Heart, Activity, Compass } from "lucide-react";

interface Props {
  reading: AIMonthReading | null;
  loading: boolean;
}

// Главы 3-13 шаблона: главная энергия, общий прогноз, глубокие разборы, синергия/конфликт, сферы.
export function MonthForecastAIBlocks({ reading }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock num={3} title="Главная энергия месяца" variant="highlight">
        {T(reading?.mainEnergy)}
      </ChapterBlock>

      <ChapterBlock num={4} icon={BookOpen} title="Общий прогноз" subtitle="Через взаимодействие трёх арканов">
        {T(reading?.generalForecast)}
      </ChapterBlock>

      <ChapterBlock num={5} title="Глубокий разбор энергии года">
        {T(reading?.yearEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock num={6} title="Глубокий разбор энергии месяца">
        {T(reading?.monthEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock num={7} title="Глубокий разбор итогового аркана">
        {T(reading?.resultEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock num={8} icon={Layers} title="Синергия и конфликт энергий">
        <div className="space-y-3">
          <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-4">
            <h4 className="text-sm font-medium text-emerald-600 mb-2">Синергия</h4>
            {reading ? <ProTextBlock text={reading.synergy} /> : <ChapterSkeleton lines={3} />}
          </div>
          <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
            <h4 className="text-sm font-medium text-destructive mb-2">Конфликт</h4>
            {reading ? <ProTextBlock text={reading.conflict} /> : <ChapterSkeleton lines={3} />}
          </div>
        </div>
      </ChapterBlock>

      <ChapterBlock num={9} icon={TrendingUp} title="Деньги и финансы">
        {T(reading?.money)}
      </ChapterBlock>

      <ChapterBlock num={10} icon={Briefcase} title="Карьера и работа">
        {T(reading?.career)}
      </ChapterBlock>

      <ChapterBlock num={11} icon={Heart} title="Отношения и личная жизнь">
        {T(reading?.relationships)}
      </ChapterBlock>

      <ChapterBlock num={12} icon={Activity} title="Здоровье">
        {T(reading?.health)}
      </ChapterBlock>

      <ChapterBlock num={13} icon={Compass} title="Внутреннее состояние">
        {T(reading?.innerState)}
      </ChapterBlock>
    </>
  );
}
