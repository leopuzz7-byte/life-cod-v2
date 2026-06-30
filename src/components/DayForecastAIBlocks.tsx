import { AIDayReading } from "@/lib/aiDayForecastService";
import { ProSectionBlock, ProTextBlock } from "./ProSectionBlock";
import { BookOpen, Target, Briefcase, Heart, Activity, AlertTriangle, CheckCircle, Sparkles, MessageCircle } from "lucide-react";

function Skel({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-muted/40 rounded ${i === lines - 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

interface Props {
  reading: AIDayReading | null;
  loading: boolean;
}

export function DayForecastAIBlocks({ reading, loading }: Props) {
  const sk = <Skel />;

  return (
    <>
      <ProSectionBlock icon={BookOpen} title="Глубокий разбор дня" variant="highlight">
        {reading ? <ProTextBlock text={reading.deepAnalysis} /> : sk}
      </ProSectionBlock>

      <ProSectionBlock icon={Target} title="Стратегия дня">
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">🌅 Утро</h4>
            {reading ? <ProTextBlock text={reading.morning} /> : sk}
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">☀️ День</h4>
            {reading ? <ProTextBlock text={reading.afternoon} /> : sk}
          </div>
          <div className="bg-muted/30 rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">🌙 Вечер</h4>
            {reading ? <ProTextBlock text={reading.evening} /> : sk}
          </div>
        </div>
      </ProSectionBlock>

      <div className="grid md:grid-cols-2 gap-4">
        <ProSectionBlock icon={Briefcase} title="Деньги">
          {reading ? <ProTextBlock text={reading.money} /> : sk}
        </ProSectionBlock>
        <ProSectionBlock icon={Briefcase} title="Карьера">
          {reading ? <ProTextBlock text={reading.career} /> : sk}
        </ProSectionBlock>
        <ProSectionBlock icon={Heart} title="Отношения">
          {reading ? <ProTextBlock text={reading.relationships} /> : sk}
        </ProSectionBlock>
        <ProSectionBlock icon={Activity} title="Здоровье">
          {reading ? <ProTextBlock text={reading.health} /> : sk}
        </ProSectionBlock>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ProSectionBlock icon={AlertTriangle} title="Риски дня" variant="warning">
          {reading ? <ProTextBlock text={reading.risks} /> : sk}
        </ProSectionBlock>
        <ProSectionBlock icon={CheckCircle} title="Возможности дня" variant="success">
          {reading ? <ProTextBlock text={reading.opportunities} /> : sk}
        </ProSectionBlock>
      </div>

      <ProSectionBlock icon={Sparkles} title="Практика дня">
        {reading ? <ProTextBlock text={reading.practice} /> : sk}
      </ProSectionBlock>

      <ProSectionBlock icon={MessageCircle} title="Итог дня" variant="highlight">
        {reading ? (
          <div className="bg-primary/10 rounded-xl p-4 text-center">
            <p className="text-sm text-foreground font-medium italic">«{reading.conclusion}»</p>
          </div>
        ) : sk}
      </ProSectionBlock>
    </>
  );
}
