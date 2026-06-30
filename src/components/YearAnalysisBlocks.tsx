import { AIYearReading } from "@/lib/aiYearForecastService";
import { ChapterBlock, ChapterSkeleton } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { Sparkles, ShieldAlert, CheckCircle, AlertTriangle, MessageCircle, Flag } from "lucide-react";

interface Props {
  reading: AIYearReading | null;
  loading: boolean;
}

// Возможности, риски, аркан в плюсе и минусе, рекомендации, итог года.
export function YearAnalysisBlocks({ reading }: Props) {
  const T = (text?: string) => (reading ? <ProTextBlock text={text || ""} /> : <ChapterSkeleton />);

  return (
    <>
      <ChapterBlock icon={Sparkles} title="Главные возможности года" variant="success">
        {T(reading?.opportunities)}
      </ChapterBlock>

      <ChapterBlock icon={ShieldAlert} title="Главные риски года" variant="warning">
        {T(reading?.risks)}
      </ChapterBlock>

      <ChapterBlock icon={CheckCircle} title="Аркан в плюсе" variant="success">
        {T(reading?.plusManifest)}
      </ChapterBlock>

      <ChapterBlock icon={AlertTriangle} title="Аркан в минусе" variant="warning">
        {T(reading?.minusManifest)}
      </ChapterBlock>

      <ChapterBlock icon={MessageCircle} title="Практические рекомендации" variant="highlight">
        {T(reading?.recommendations)}
      </ChapterBlock>

      <ChapterBlock icon={Flag} title="Итог года" variant="highlight">
        {T(reading?.conclusion)}
      </ChapterBlock>
    </>
  );
}
