import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FinancialCodeResult as FinancialCodeType } from "@/lib/financialCode";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, Wallet, Star, Shield, AlertTriangle, BookOpen, Target, CheckCircle, Sparkles, MessageCircle, TrendingUp, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFinancialCodeProData } from "@/lib/proInterpretationsExtra";
import { ProSectionBlock, ProTextBlock, ProListBlock, ProNumberedList } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface Props {
  result: FinancialCodeType;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function FinancialCodeResultComponent({ result, name, onReset, tier = 'basic' }: Props) {
  const isPro = tier === 'professional';
  const proData = isPro ? getFinancialCodeProData(result.talentArcana, result.resourceArcana, result.missionArcana, result.blockArcana) : null;

  const allCards = [
    { arcana: result.talentArcana, title: 'Талант для заработка', desc: result.talentDesc, icon: Star, color: 'text-yellow-500' },
    { arcana: result.resourceArcana, title: 'Финансовый ресурс', desc: result.resourceDesc, icon: Wallet, color: 'text-green-500' },
    { arcana: result.missionArcana, title: 'Финансовая миссия', desc: result.missionDesc, icon: Shield, color: 'text-blue-500' },
    { arcana: result.blockArcana, title: 'Финансовый блок', desc: result.blockDesc, icon: AlertTriangle, color: 'text-red-400' },
  ];

  const shownCards = isPro ? allCards : allCards.slice(0, 2);

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
        <h2 className="text-2xl font-display text-primary mb-1">Финансовый код</h2>
        <p className="text-muted-foreground text-sm mb-6">
          {name ? `${name}, ` : ''}дата рождения: {result.birthDate.day}.{String(result.birthDate.month).padStart(2, '0')}.{result.birthDate.year}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {allCards.map((card) => {
            const arcanaData = getArcana(card.arcana);
            return (
              <div key={card.title} className="bg-card rounded-xl border border-border p-4 text-center">
                <card.icon className={`w-5 h-5 mx-auto mb-2 ${card.color}`} />
                <div className="text-2xl font-display text-primary mb-1">{card.arcana}</div>
                <div className="text-xs text-muted-foreground">{arcanaData?.name}</div>
                <div className="text-[10px] text-muted-foreground/70 mt-1">{card.title}</div>
              </div>
            );
          })}
        </div>

        <Accordion type="single" collapsible defaultValue="card-0">
          {shownCards.map((card, i) => (
            <AccordionItem key={i} value={`card-${i}`} className="border-border">
              <AccordionTrigger className="hover:no-underline py-3">
                <span className="font-display text-foreground text-sm flex items-center gap-2">
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                  {card.title} — {card.arcana} ({getArcana(card.arcana)?.name})
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4">{card.desc}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {isPro && result.professions.length > 0 && (
          <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
            <h3 className="font-display text-foreground text-sm mb-2">Рекомендуемые профессии для заработка</h3>
            <div className="flex flex-wrap gap-2">
              {result.professions.map((p, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <div className="space-y-6">
          <ProSectionBlock icon={BookOpen} title="Введение в ваш финансовый код" variant="highlight">
            <ProTextBlock text={proData.intro} />
          </ProSectionBlock>

          <ProSectionBlock icon={Star} title="Глубокий разбор позиций">
            <div className="space-y-4">
              <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500" /> Талант для заработка
                </h4>
                <ProTextBlock text={proData.talentDeep} />
              </div>
              <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/20">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-500" /> Финансовый ресурс
                </h4>
                <ProTextBlock text={proData.resourceDeep} />
              </div>
              <div className="bg-blue-500/5 rounded-xl p-4 border border-blue-500/20">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-500" /> Финансовая миссия
                </h4>
                <ProTextBlock text={proData.missionDeep} />
              </div>
              <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-destructive" /> Финансовый блок
                </h4>
                <ProTextBlock text={proData.blockDeep} />
              </div>
            </div>
          </ProSectionBlock>

          <ProSectionBlock icon={Brain} title="Денежная психология">
            <ProTextBlock text={proData.moneyPsychology} />
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={TrendingUp} title="Стратегия дохода">
              <ProTextBlock text={proData.incomeStrategy} />
            </ProSectionBlock>
            <ProSectionBlock icon={Target} title="Инвестиционный профиль">
              <ProTextBlock text={proData.investmentProfile} />
            </ProSectionBlock>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={AlertTriangle} title="Финансовые риски" variant="warning">
              <ProListBlock items={proData.financialRisks} icon="⚠" />
            </ProSectionBlock>
            <ProSectionBlock icon={Sparkles} title="Финансовые возможности" variant="success">
              <ProListBlock items={proData.financialOpportunities} icon="★" />
            </ProSectionBlock>
          </div>

          <ProSectionBlock icon={CheckCircle} title="План действий" variant="highlight">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProNumberedList items={proData.actionPlan} className="mb-6" />
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.avoidList} icon="✗" />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог" variant="highlight">
            <ProTextBlock text={proData.conclusion} className="mb-4" />
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
            </div>
          </ProSectionBlock>
        </div>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: глубокий анализ всех 4 позиций, денежная психология, стратегия дохода,
            инвестиционный профиль, риски и возможности, план действий и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}
