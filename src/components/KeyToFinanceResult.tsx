import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FinCodeResult, finStage, finIntro, finClosing } from "@/lib/keytoFinance";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: FinCodeResult;
  onReset: () => void;
}

export function KeyToFinanceResultComponent({ result, onReset }: Props) {
  const { t } = useTranslation();
  const { code, stages } = result;
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Финансовый код</h1>
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center">
        <div className="text-5xl font-display font-bold text-primary tracking-[0.25em]">{code}</div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{finIntro}</p>

      <p className="font-display font-semibold text-foreground">Вот, что означают ваши этапы в денежном коде:</p>

      <div className="space-y-3">
        {stages.map((energy, i) => {
          const st = finStage[energy];
          const isOpen = open === i;
          return (
            <div key={i} className="rounded-2xl bg-muted/25 border border-border/50 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-muted/40 transition-colors"
              >
                <div>
                  <div className="text-primary font-display font-semibold text-sm">Этап {i + 1} — Энергия {energy}</div>
                  <div className="text-foreground font-display font-semibold">{st?.title}</div>
                </div>
                <ChevronDown className={"w-5 h-5 shrink-0 text-primary transition-transform " + (isOpen ? "rotate-180" : "")} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{st?.desc}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {finClosing.map((c, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">{c}</p>
        ))}
      </div>

      <NadezhdaSignature />
    </div>
  );
}
