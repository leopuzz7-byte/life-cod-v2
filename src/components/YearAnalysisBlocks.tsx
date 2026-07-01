import { AIYearReading } from "@/lib/aiYearForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { Sparkles, ShieldAlert, MessageCircle, Flag, Eye, Ban } from "lucide-react";

interface Props {
  reading: AIYearReading | null;
  loading: boolean;
  arcana: number;
}

// Возможности, риски, внимание, аркан в плюсе и минусе, рекомендации, чего избегать, итог года.
export function YearAnalysisBlocks({ reading, arcana }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock icon={Sparkles} title="Главные возможности года" variant="success">
        {T(reading?.opportunities)}
      </ChapterBlock>

      <ChapterBlock icon={ShieldAlert} title="Главные риски года" variant="warning">
        {T(reading?.risks)}
      </ChapterBlock>

      <ChapterBlock icon={Eye} title="На что обратить особое внимание">
        {T(reading?.attention)}
      </ChapterBlock>

      <ChapterBlock arcana={arcana} title="Аркан в плюсе" variant="success">
        {T(reading?.plusManifest)}
      </ChapterBlock>

      <ChapterBlock arcana={arcana} title="Аркан в минусе" variant="warning">
        {T(reading?.minusManifest)}
      </ChapterBlock>

      <ChapterBlock icon={MessageCircle} title="Практические рекомендации" variant="highlight">
        {T(reading?.recommendations)}
      </ChapterBlock>

      <ChapterBlock icon={Ban} title="Чего лучше избегать" variant="warning">
        {T(reading?.avoid)}
      </ChapterBlock>

      <ChapterBlock icon={Flag} title="Итог года" variant="highlight">
        {T(reading?.conclusion)}
      </ChapterBlock>
    </>
  );
}
