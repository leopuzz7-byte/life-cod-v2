import { AIMonthReading } from "@/lib/aiMonthForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { BookOpen, Layers, Briefcase, TrendingUp, Heart, Activity, Compass } from "lucide-react";

interface Props {
  reading: AIMonthReading | null;
  a1: number; // энергия месяца
  a2: number; // аркан года
  a3: number; // итоговый аркан
}

// Главы разбора месяца. У глав про конкретный аркан — кликабельная карта, у сфер — иконка.
export function MonthForecastAIBlocks({ reading, a1, a2, a3 }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock arcana={a3} title="Главная энергия месяца" variant="highlight">
        {T(reading?.mainEnergy)}
      </ChapterBlock>

      <ChapterBlock icon={BookOpen} title="Общий прогноз" subtitle="Через взаимодействие трёх арканов">
        {T(reading?.generalForecast)}
      </ChapterBlock>

      <ChapterBlock arcana={a2} title="Глубокий разбор энергии года">
        {T(reading?.yearEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock arcana={a1} title="Глубокий разбор энергии месяца">
        {T(reading?.monthEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock arcana={a3} title="Глубокий разбор итогового аркана">
        {T(reading?.resultEnergyDeep)}
      </ChapterBlock>

      <ChapterBlock icon={Layers} title="Синергия и конфликт энергий">
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

      <ChapterBlock icon={TrendingUp} title="Деньги и финансы">
        {T(reading?.money)}
      </ChapterBlock>

      <ChapterBlock icon={Briefcase} title="Карьера и работа">
        {T(reading?.career)}
      </ChapterBlock>

      <ChapterBlock icon={Heart} title="Отношения и личная жизнь">
        {T(reading?.relationships)}
      </ChapterBlock>

      <ChapterBlock icon={Activity} title="Здоровье">
        {T(reading?.health)}
      </ChapterBlock>

      <ChapterBlock icon={Compass} title="Внутреннее состояние">
        {T(reading?.innerState)}
      </ChapterBlock>
    </>
  );
}
