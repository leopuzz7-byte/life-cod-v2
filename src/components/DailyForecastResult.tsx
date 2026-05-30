import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const { targetDate, positions } = result;
  const dateStr = `${targetDate.day}.${String(targetDate.month).padStart(2, '0')}.${targetDate.year}`;
  const proData = isPro ? getDailyProData(positions, dateStr) : null;

  const shownPositions = isPro ? positions : positions.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onReset} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("res.newCalc")}
      </Button>

      <div className="text-center mb-4">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium mb-2",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? `✦ ${t("res.proAnalysis")}` : t("res.basicAnalysis")}
        </span>
      </div>

      <div className="gradient-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="text-2xl font-display text-primary mb-1">{t("cfg.methods.day.title")}</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {name ? `${name}, ` : ''}{t("res.day.dateWord")}: {dateStr}
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
          <ProSectionBlock icon={BookOpen} title={t("res.day.energyAnalysis")} variant="highlight">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <h4 className="text-sm font-medium text-foreground mb-2">{t("res.day.mainEnergy")}</h4>
              <ProTextBlock text={proData.mainEnergy} />
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Target} title={t("res.day.strategy")}>
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌅 {t("res.day.morning")}</h4>
                <ProTextBlock text={proData.morningFocus} />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <h4 className="text-sm font-medium text-foreground mb-2">☀️ {t("res.day.dayStrategy")}</h4>
                <ProTextBlock text={proData.dayStrategy} />
              </div>
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="text-sm font-medium text-foreground mb-2">🌙 {t("res.day.evening")}</h4>
                <ProTextBlock text={proData.eveningReflection} />
              </div>
            </div>
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Briefcase} title={`💰 ${t("res.day.money")}`}>
              <ProTextBlock text={proData.spheres.money} />
            </ProSectionBlock>
            <ProSectionBlock icon={Briefcase} title={`💼 ${t("res.day.career")}`}>
              <ProTextBlock text={proData.spheres.career} />
            </ProSectionBlock>
            <ProSectionBlock icon={Heart} title={`❤️ ${t("res.day.relationships")}`}>
              <ProTextBlock text={proData.spheres.relationships} />
            </ProSectionBlock>
            <ProSectionBlock icon={Activity} title={`🏥 ${t("res.day.health")}`}>
              <ProTextBlock text={proData.spheres.health} />
            </ProSectionBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={AlertTriangle} title={t("res.day.risks")} variant="warning">
              <ProListBlock items={proData.risks} icon="⚠" />
            </ProSectionBlock>
            <ProSectionBlock icon={CheckCircle} title={t("res.day.opportunities")} variant="success">
              <ProListBlock items={proData.opportunities} icon="★" />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={Sparkles} title={t("res.day.practice")}>
            <ProTextBlock text={proData.practice} />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title={t("res.conclusion")} variant="highlight">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
            </div>
          </ProSectionBlock>
        </div>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("res.day.proFooter")}
          </p>
        </div>
      )}
    </div>
  );
}
