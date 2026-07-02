import { useTranslation } from "react-i18next";
import { KeyToCompatResult as CompatType, compatDigit } from "@/lib/keytoCompatCalc";
import { compatMind, compatAction, compatRealiz, compatOutcome } from "@/lib/keytoCompat";
import { personalYearText } from "@/lib/keytoPersonal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { KeyToNumberSection } from "./KeyToNumberSection";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: CompatType;
  onReset: () => void;
  isPro?: boolean;
}

function Breakdown({ label, num, full, digits }: { label: string; num: number; full: number; digits: number[] }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-foreground mb-3">Число {label} {num} состоит из {full}</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        {digits.map((d, i) => (
          <div key={i} className="rounded-xl bg-muted/25 border border-border/50 p-4">
            <div className="font-display font-bold text-2xl text-primary mb-1">{d}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{compatDigit[d]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyToCompatResultComponent({ result, onReset, isPro = false }: Props) {
  const { t } = useTranslation();
  const { mind, action, realiz, outcome, commonYear } = result;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Разбор совместимости</h1>
        <p className="text-lg text-foreground">{result.date1} + {result.date2}</p>
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Код совместимости</div>
        <div className="text-4xl font-display font-bold text-primary tracking-[0.2em]">{result.code}</div>
      </div>

      <KeyToNumberSection id="c-mind" title="Число Ума" value={mind.n} full={mind.full} description={compatMind[mind.n] || ""}>
        {isPro && <Breakdown label="Ума" num={mind.n} full={mind.full} digits={mind.digits} />}
      </KeyToNumberSection>

      <KeyToNumberSection id="c-action" title="Число Действия" value={action.n} full={action.full} description={compatAction[action.n] || ""}>
        {isPro && <Breakdown label="Действия" num={action.n} full={action.full} digits={action.digits} />}
      </KeyToNumberSection>

      <KeyToNumberSection id="c-realiz" title="Число Реализации" value={realiz.n} full={realiz.full} description={compatRealiz[realiz.n] || ""}>
        {isPro && <Breakdown label="Реализации" num={realiz.n} full={realiz.full} digits={realiz.digits} />}
      </KeyToNumberSection>

      <KeyToNumberSection id="c-year" title="Общий год" value={commonYear} description={personalYearText[commonYear] || ""} />

      <KeyToNumberSection id="c-outcome" title="Число Итога" value={outcome.n} full={outcome.full} description={compatOutcome[outcome.n] || ""}>
        {isPro && <Breakdown label="Итога" num={outcome.n} full={outcome.full} digits={outcome.digits} />}
      </KeyToNumberSection>

      <NadezhdaSignature />
    </div>
  );
}
