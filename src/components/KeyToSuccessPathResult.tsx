import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SuccessResult, successStages, successIntro, successFinalNote } from "@/lib/keytoSuccessPath";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: SuccessResult;
  onReset: () => void;
}

export function KeyToSuccessPathResultComponent({ result, onReset }: Props) {
  const { t } = useTranslation();
  const { present } = result;
  const [open, setOpen] = useState<number>(0);

  const strong = successStages.filter((s) => present[s.energy]);
  const weak = successStages.filter((s) => !present[s.energy]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Путь к успеху</h1>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{successIntro}</p>

      <div className="gradient-card rounded-2xl border border-border p-6 md:p-7">
        <h3 className="font-display font-semibold text-foreground mb-1">Ваши сильные этапы и зоны роста</h3>
        <p className="text-sm text-muted-foreground mb-4">По вашей психоматрице: какие этапы пройдут естественно, а каким стоит уделить особое внимание или усилить командой.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
            <div className="text-sm font-medium text-primary mb-2">Сильные этапы</div>
            {strong.length ? (
              <ul className="space-y-1.5">
                {strong.map((s) => (
                  <li key={s.energy} className="text-sm text-foreground flex gap-2">
                    <span className="font-display font-bold text-primary">{s.energy}</span>{s.title}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">Нет проявленных энергий, все этапы требуют внимания.</p>}
          </div>
          <div className="rounded-xl bg-muted/25 border border-border/50 p-4">
            <div className="text-sm font-medium text-muted-foreground mb-2">Зоны роста</div>
            {weak.length ? (
              <ul className="space-y-1.5">
                {weak.map((s) => (
                  <li key={s.energy} className="text-sm text-muted-foreground flex gap-2">
                    <span className="font-display font-bold text-foreground">{s.energy}</span>{s.title}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted-foreground">Все энергии проявлены, каждый этап даётся вам естественно.</p>}
          </div>
        </div>
        {weak.length > 0 && (
          <p className="text-xs text-muted-foreground mt-4">Совет: на слабых этапах привлекайте в команду людей, у которых недостающие энергии проявлены от рождения.</p>
        )}
      </div>

      <div className="space-y-3">
        {successStages.map((stage, i) => {
          const isOpen = open === i;
          const has = present[stage.energy];
          return (
            <div key={i} className="rounded-2xl bg-muted/25 border border-border/50 overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={"w-9 h-9 shrink-0 rounded-lg flex items-center justify-center font-display font-bold border " + (has ? "bg-primary/15 border-primary/40 text-primary" : "bg-muted/40 border-border/50 text-muted-foreground")}>
                    {stage.energy}
                  </span>
                  <span className="text-primary font-display font-semibold">Этап {i + 1} — {stage.title}</span>
                </div>
                <ChevronDown className={"w-5 h-5 shrink-0 text-primary transition-transform " + (isOpen ? "rotate-180" : "")} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 space-y-4">
                  <div className={"rounded-xl p-3 text-sm leading-relaxed " + (has ? "bg-primary/10 text-foreground" : "bg-muted/40 text-muted-foreground")}>
                    {has ? stage.strong : stage.weak}
                  </div>
                  <ol className="space-y-3">
                    {stage.steps.map((st, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="text-primary font-display font-semibold shrink-0">{j + 1}.</span>
                        <div>
                          {st.title && <div className="font-medium text-foreground mb-0.5">{st.title}</div>}
                          <p className="text-sm text-muted-foreground leading-relaxed">{st.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
                    <div className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Итог</div>
                    <p className="text-sm text-foreground leading-relaxed">{stage.summary}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5">
        <p className="text-sm text-foreground leading-relaxed">{successFinalNote}</p>
      </div>

      <NadezhdaSignature />
    </div>
  );
}
