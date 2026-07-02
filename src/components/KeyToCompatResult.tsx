import { useTranslation } from "react-i18next";
import { KeyToCompatResult as CompatType, compatDigit } from "@/lib/keytoCompatCalc";
import { compatMind, compatAction, compatRealiz, compatOutcome } from "@/lib/keytoCompat";
import { compatMindText, compatActionText, compatRealizText, compatOutcomeText, compatYearText } from "@/lib/keytoCompatText";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: CompatType;
  onReset: () => void;
  isPro?: boolean;
}

function Recommendations({ rec }: { rec: string[] }) {
  if (!rec || rec.length === 0) return null;
  return (
    <div className="rounded-xl bg-muted/25 border border-border/50 p-4 mt-4">
      <div className="text-xs font-medium text-primary uppercase tracking-wide mb-2">Рекомендации</div>
      <ul className="space-y-2">
        {rec.map((r, i) => (
          <li key={i} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
            <span className="text-primary mt-0.5">•</span><span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Breakdown({ label, num, full, digits }: { label: string; num: number; full: number; digits: number[] }) {
  return (
    <div className="mt-5">
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

interface BlockProps {
  id: string; title: string; value: number; full?: number; sub: string; description: string;
  rec: string[]; breakdownLabel?: string; digits?: number[]; isPro?: boolean;
}

function NumberBlock({ id, title, value, full, sub, description, rec, breakdownLabel, digits, isPro }: BlockProps) {
  return (
    <section id={id} className="gradient-card rounded-2xl border border-border p-6 md:p-7 scroll-mt-24">
      <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-5 text-center">
        <div className="flex items-start justify-center gap-1.5">
          <span className="text-4xl md:text-5xl font-display font-bold text-primary leading-none">{value}</span>
          {full !== undefined && full !== value && (
            <span className="text-[11px] text-muted-foreground leading-tight mt-1">из<br />{full}</span>
          )}
        </div>
        <div className="font-display font-semibold text-foreground mt-2">{title}</div>
      </div>
      {sub && <p className="font-display font-semibold text-foreground mb-3">{sub}</p>}
      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{description}</p>
      <Recommendations rec={rec} />
      {isPro && breakdownLabel && digits && full !== undefined && (
        <Breakdown label={breakdownLabel} num={value} full={full} digits={digits} />
      )}
    </section>
  );
}

export function KeyToCompatResultComponent({ result, onReset, isPro = false }: Props) {
  const { t } = useTranslation();
  const { mind, action, realiz, outcome, commonYear } = result;
  const yr = compatYearText[commonYear];

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

      <NumberBlock id="c-mind" title="Число Ума" value={mind.n} full={mind.full}
        sub={compatMindText[mind.n]?.sub || ""} description={compatMind[mind.n] || ""}
        rec={compatMindText[mind.n]?.rec || []} breakdownLabel="Ума" digits={mind.digits} isPro={isPro} />

      <NumberBlock id="c-action" title="Число Действия" value={action.n} full={action.full}
        sub={compatActionText[action.n]?.sub || ""} description={compatAction[action.n] || ""}
        rec={compatActionText[action.n]?.rec || []} breakdownLabel="Действия" digits={action.digits} isPro={isPro} />

      <NumberBlock id="c-realiz" title="Число Реализации" value={realiz.n} full={realiz.full}
        sub={compatRealizText[realiz.n]?.sub || ""} description={compatRealiz[realiz.n] || ""}
        rec={compatRealizText[realiz.n]?.rec || []} breakdownLabel="Реализации" digits={realiz.digits} isPro={isPro} />

      <NumberBlock id="c-year" title="Общий год" value={commonYear}
        sub={yr?.sub || ""} description={yr?.desc || ""} rec={yr?.rec || []} />

      <NumberBlock id="c-outcome" title="Число Итога" value={outcome.n} full={outcome.full}
        sub={compatOutcomeText[outcome.n]?.sub || ""} description={compatOutcome[outcome.n] || ""}
        rec={compatOutcomeText[outcome.n]?.rec || []} breakdownLabel="Итога" digits={outcome.digits} isPro={isPro} />

      <NadezhdaSignature />
    </div>
  );
}
