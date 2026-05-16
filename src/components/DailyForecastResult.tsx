import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, BookOpen, Target, Briefcase, Heart, Activity, AlertTriangle, CheckCircle, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDailyProData } from "@/lib/proInterpretationsExtra";
import { ProSectionBlock, ProTextBlock, ProListBlock } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface Props {
  result: DailyForecastType;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function DailyForecastResultComponent({ result, name, onReset, tier = 'basic' }: Props) {
  const isPro = tier === 'professional';
  const { targetDate, positions } = result;
  const dateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;
  const proData = isPro ? getDailyProData(positions, dateStr) : null;

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
        <h2 className="text-2xl font-display text-primary mb-1">Прогноз на день</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {name ? `${name}, ` : ''}дата: {dateStr}
        </p>

        <Accordion type="single" collapsible defaultValue={`pos-${shownPositions[0]?.position}`}>
          {shownPositions.map((pos) => {
            const arcanaData = getArcana(pos.arcana);
            return (
              <AccordionItem key={pos.position} value={`pos-${pos.position}`} className="border-border">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 text-left">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{pos.arcana}</span>
                    <div>
                      <span className="font-display text-foreground text-sm">{pos.title}</span>
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
          <ProSectionBlock icon={BookOpen} title="Энергетический разбор дня" variant="highlight">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <h4 className="text-sm font-medium text-foreground mb-2">Главная энергия дня</h4>
              <ProTextBlock text={proData.mainEnergy} />
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title="Стратегия дня">
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌅 Утро</h4>
                <ProTextBlock text={proData.morningFocus} />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-sm font-medium text-foreground mb-2">☀️ Дневная стратегия</h4>
                <ProTextBlock text={proData.dayStrategy} />
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌙 Вечер</h4>
                <ProTextBlock text={proData.eveningReflection} />
              </div>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Briefcase} title="💰 Деньги">
              <ProTextBlock text={proData.spheres.money} />
            </ProSectionBlock>
            <ProSectionBlock icon={Briefcase} title="💼 Карьера">
              <ProTextBlock text={proData.spheres.career} />
            </ProSectionBlock>
            <ProSectionBlock icon={Heart} title="❤️ Отношения">
              <ProTextBlock text={proData.spheres.relationships} />
            </ProSectionBlock>
            <ProSectionBlock icon={Activity} title="🏥 Здоровье">
              <ProTextBlock text={proData.spheres.health} />
            </ProSectionBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={AlertTriangle} title="Риски дня" variant="warning">
              <ProListBlock items={proData.risks} icon="⚠" />
            </ProSectionBlock>
            <ProSectionBlock icon={CheckCircle} title="Возможности дня" variant="success">
              <ProListBlock items={proData.opportunities} icon="★" />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={Sparkles} title="Практика дня">
            <ProTextBlock text={proData.practice} />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог" variant="highlight">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
            </div>
          </ProSectionBlock>
        </div>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: все 12 позиций, глубокий энергетический анализ, стратегия дня по часам,
            разбор по сферам жизни, риски и возможности, практики и ритуалы дня.
          </p>
        </div>
      )}
    </div>
  );
}
