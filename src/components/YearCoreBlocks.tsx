import { AIYearReading } from "@/lib/aiYearForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { Target, TrendingUp, BookOpen, Coins, Briefcase, Heart, Activity, Compass } from "lucide-react";

interface Props {
  reading: AIYearReading | null;
  loading: boolean;
}

// Введение, основная энергия, глубокий разбор аркана и сферы года.
export function YearCoreBlocks({ reading }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock icon={Target} title="Введение в ваш год">
        {T(reading?.intro)}
      </ChapterBlock>

      <ChapterBlock icon={TrendingUp} title="Основная энергия года">
        {T(reading?.atmosphere)}
      </ChapterBlock>

      <ChapterBlock icon={BookOpen} title="Глубокий разбор аркана года">
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-4">
              <h4 className="text-sm font-medium text-emerald-600 mb-2">Сильные стороны года</h4>
              {reading ? <ProTextBlock text={reading.arcanaStrengths} /> : <ChapterSkeleton lines={3} />}
            </div>
            <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4">
              <h4 className="text-sm font-medium text-destructive mb-2">Слабые стороны года</h4>
              {reading ? <ProTextBlock text={reading.arcanaWeaknesses} /> : <ChapterSkeleton lines={3} />}
            </div>
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Искажения энергии</h4>
            {reading ? <ProTextBlock text={reading.arcanaDistortions} /> : <ChapterSkeleton lines={3} />}
          </div>
          <div className="rounded-xl bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Как проявляется в жизни</h4>
            {reading ? <ProTextBlock text={reading.lifeManifest} /> : <ChapterSkeleton lines={3} />}
          </div>
        </div>
      </ChapterBlock>

      <ChapterBlock icon={Coins} title="Деньги и финансы">
        {T(reading?.money)}
      </ChapterBlock>

      <ChapterBlock icon={Briefcase} title="Работа и реализация">
        {T(reading?.work)}
      </ChapterBlock>

      <ChapterBlock icon={Heart} title="Отношения">
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
