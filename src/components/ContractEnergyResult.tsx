import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, BookOpen, Target, AlertTriangle, CheckCircle, Shield, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContractProData } from "@/lib/proInterpretationsExtra";
import { ProSectionBlock, ProTextBlock, ProListBlock } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface Props {
  result: DailyForecastType;
  personName: string;
  onReset: () => void;
  tier?: TierType;
}

const contractPositionTitles: Record<number, string> = {
  1: 'Начало / Первое впечатление',
  2: 'Внутренняя суть договора',
  3: 'Взаимодействие сторон',
  4: 'Цель / Результат договора',
  5: 'Ресурсы и возможности',
  6: 'Фундамент отношений',
  7: 'Главная задача',
  8: 'Способ решения',
  9: 'Итог сотрудничества',
  10: 'Скрытые мотивы',
  11: 'Внешние обстоятельства',
  12: 'Кармический урок',
};

export function ContractEnergyResultComponent({ result, personName, onReset, tier = 'basic' }: Props) {
  const isPro = tier === 'professional';
  const { targetDate, birthDate, positions } = result;
  const contractDateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;
  const birthDateStr = `${birthDate.day}.${String(birthDate.month).padStart(2, '0')}.${birthDate.year}`;

  const keyPositions = [positions[3], positions[5], positions[8], positions[11]];
  const harmonious = [1, 3, 4, 6, 8, 10, 14, 17, 19, 21];
  const harmonyScore = keyPositions.filter(p => harmonious.includes(p.arcana)).length;
  const isGood = harmonyScore >= 3;

  const proData = isPro ? getContractProData(positions, contractDateStr, isGood) : null;
  const shownPositions = isPro ? positions : positions.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onReset} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Новый расчёт
      </Button>

      <div className="text-center mb-4">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "✦ Профессиональный разбор" : "Базовый разбор"}
        </span>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="text-2xl font-display text-primary mb-1">Энергия договора</h2>
        <p className="text-muted-foreground text-sm mb-1">
          {personName ? `${personName} (${birthDateStr})` : `Рождение: ${birthDateStr}`}
        </p>
        <p className="text-muted-foreground text-sm mb-4">Дата договора: {contractDateStr}</p>

        <div className={`p-4 rounded-xl border mb-6 ${
          isGood 
            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
        }`}>
          <p className="text-sm font-medium text-foreground">
            {isGood ? '✅ Дата благоприятна для заключения договора' : '⚠️ Дата требует внимания — есть сложные энергии'}
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="pos-4">
          {shownPositions.map((pos) => {
            const arcanaData = getArcana(pos.arcana);
            return (
              <AccordionItem key={pos.position} value={`pos-${pos.position}`} className="border-border">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{pos.arcana}</span>
                    <div>
                      <span className="font-display text-foreground text-sm">{contractPositionTitles[pos.position]}</span>
                      <span className="text-xs text-muted-foreground ml-2">{arcanaData?.name}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4">{pos.description}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <div className="space-y-6">
          <ProSectionBlock icon={BookOpen} title="Энергетический анализ договора" variant="highlight">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <ProTextBlock text={proData.overallEnergy} />
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Глубокий разбор ключевых позиций">
            <ProTextBlock text={proData.keyPositionsDeep} />
          </ProSectionBlock>

          <ProSectionBlock icon={AlertTriangle} title="Скрытые риски" variant="warning">
            <ProTextBlock text={proData.hiddenRisks} />
          </ProSectionBlock>

          <ProSectionBlock icon={Shield} title="Оптимальная стратегия">
            <ProTextBlock text={proData.bestStrategy} className="mb-4" />
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">Анализ тайминга</h4>
              <ProTextBlock text={proData.timingAnalysis} />
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={CheckCircle} title="Рекомендации" variant="success">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProListBlock items={proData.recommendations} icon="✦" className="mb-6" />
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.avoidList} icon="✗" />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог" variant="highlight">
            <ProTextBlock text={proData.conclusion} />
          </ProSectionBlock>
        </div>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: все 12 позиций, глубокий анализ ключевых позиций, скрытые риски,
            оптимальная стратегия, анализ тайминга и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}
