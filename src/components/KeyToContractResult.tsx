import { useTranslation } from "react-i18next";
import { KeyToCompatResult as CompatType } from "@/lib/keytoCompatCalc";
import { contractMind, contractAction, contractRealiz, contractOutcome, contractDigit, ContractNum } from "@/lib/keytoContract";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: CompatType;
  onReset: () => void;
}

function NumberBadge({ value, full, title }: { value: number; full: number; title: string }) {
  return (
    <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-5 text-center">
      <div className="flex items-start justify-center gap-1.5">
        <span className="text-4xl md:text-5xl font-display font-bold text-primary leading-none">{value}</span>
        {full !== value && (
          <span className="text-[11px] text-muted-foreground leading-tight mt-1">из<br />{full}</span>
        )}
      </div>
      <div className="font-display font-semibold text-foreground mt-2">{title}</div>
    </div>
  );
}

function DigitCards({ heading, digits, field, highlight }: { heading: string; digits: number[]; field: "strength" | "challenge" | "improve"; highlight?: boolean }) {
  return (
    <div className="mt-5">
      <h4 className="text-center font-display font-semibold text-foreground mb-3">{heading}</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        {digits.map((d, i) => (
          <div key={i} className={"rounded-xl p-4 flex gap-3 items-start border " + (highlight ? "bg-primary/10 border-primary/25" : "bg-muted/25 border-border/50")}>
            <span className="font-display font-bold text-2xl text-primary leading-none">{d}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{contractDigit[d]?.[field]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SingleBullet({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="mt-5">
      <h4 className="text-center font-display font-semibold text-foreground mb-3">{heading}</h4>
      <div className="rounded-xl bg-muted/25 border border-border/50 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex gap-2"><span className="text-primary mt-0.5">•</span><span>{text}</span></p>
      </div>
    </div>
  );
}

function ContractBlock({ title, value, full, digits, data }: { title: string; value: number; full: number; digits: number[]; data?: ContractNum }) {
  return (
    <section className="gradient-card rounded-2xl border border-border p-6 md:p-7">
      <NumberBadge value={value} full={full} title={title} />
      {data?.sub && <p className="font-display font-semibold text-foreground mb-3">{data.sub}</p>}
      <p className="text-sm text-muted-foreground leading-relaxed">{data?.desc}</p>
      <DigitCards heading={`Сильные стороны ${value} состоят из ${full}`} digits={digits} field="strength" highlight />
      <DigitCards heading={`Потенциальные вызовы ${value} состоят из ${full}`} digits={digits} field="challenge" />
      <DigitCards heading="Как улучшить договор" digits={digits} field="improve" />
    </section>
  );
}

export function KeyToContractResultComponent({ result, onReset }: Props) {
  const { t } = useTranslation();
  const { date1, date2, code, mind, action, realiz, outcome } = result;
  const oc = contractOutcome[outcome.n];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Энергия договора</h1>
        <p className="text-lg text-foreground">{date1} + {date2}</p>
      </div>

      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Код события</div>
        <div className="text-4xl font-display font-bold text-primary tracking-[0.2em]">{code}</div>
      </div>

      <ContractBlock title="Общее Число Ума" value={mind.n} full={mind.full} digits={mind.digits} data={contractMind[mind.n]} />
      <ContractBlock title="Общее Число Действия" value={action.n} full={action.full} digits={action.digits} data={contractAction[action.n]} />
      <ContractBlock title="Общее Число Реализации" value={realiz.n} full={realiz.full} digits={realiz.digits} data={contractRealiz[realiz.n]} />

      <section className="gradient-card rounded-2xl border border-border p-6 md:p-7">
        <NumberBadge value={outcome.n} full={outcome.full} title="Общее Число Итога" />
        {oc?.sub && <p className="font-display font-semibold text-foreground mb-3">{oc.sub}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed">{oc?.desc}</p>
        {oc && <SingleBullet heading="Сильные стороны" text={oc.strengths} />}
        {oc && <SingleBullet heading="Потенциальные вызовы" text={oc.challenges} />}
        {oc && <SingleBullet heading="Как улучшить договор" text={oc.improve} />}
      </section>

      <NadezhdaSignature />
    </div>
  );
}
