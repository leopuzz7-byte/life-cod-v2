import { useTranslation } from "react-i18next";
import { KeyToResult, getKeyToNumberData } from "@/lib/keyto";
import { computeMatrix } from "@/lib/keytoMatrix";
import { businessMind, businessAction, businessRealiz } from "@/lib/keytoBusiness";
import { KeyToMatrixSection } from "./KeyToMatrixSection";
import { NadezhdaSignature } from "./NadezhdaSignature";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  result: KeyToResult;
  name?: string;
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

export function KeyToBusinessResultComponent({ result, name, onReset }: Props) {
  const { t } = useTranslation();
  const { day, month, year, mindNumber, actionNumber, realizationNumber, mindFull, actionFull, realizFull } = result;

  const matrix = computeMatrix(day, month, year);
  const code = `${mindNumber}${actionNumber}${realizationNumber}`;
  const professions = getKeyToNumberData(mindNumber)?.professions || [];
  const bm = businessMind[mindNumber];
  const ba = businessAction[actionNumber];
  const br = businessRealiz[realizationNumber];
  const dateStr = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const navBtn = (id: string, label: string) => (
    <button
      onClick={() => go(id)}
      className="py-3 px-4 rounded-xl border border-border text-sm font-display font-medium text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors"
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Бизнес разбор</h1>
        {name && <p className="text-lg text-foreground">{name}</p>}
        <p className="text-sm text-muted-foreground">Профессиональный разбор: способности, подходящая сфера работы и путь реализации. Дата рождения: {dateStr}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {navBtn("biz-full", "Полный разбор")}
        {navBtn("biz-matrix", "Описание матрицы")}
      </div>

      <div id="biz-full" className="space-y-6 scroll-mt-24">
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Бизнес-код</div>
          <div className="text-4xl font-display font-bold text-primary tracking-[0.2em]">{code}</div>
        </div>

        <section className="gradient-card rounded-2xl border border-border p-6 md:p-7">
          <NumberBadge value={mindNumber} full={mindFull} title="Число Ума" />
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{bm?.desc}</p>
          {bm?.deep && (
            <div className="mt-5">
              <h4 className="font-display font-semibold text-foreground mb-2">Число Ума {mindNumber} состоит из {mindFull}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{bm.deep}</p>
            </div>
          )}
          {professions.length > 0 && (
            <div className="mt-5">
              <h4 className="font-display font-semibold text-foreground mb-3">Подходящие профессии</h4>
              <div className="rounded-xl bg-muted/25 border border-border/50 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{professions.join(", ")}</p>
              </div>
            </div>
          )}
        </section>

        <section className="gradient-card rounded-2xl border border-border p-6 md:p-7">
          <NumberBadge value={actionNumber} full={actionFull} title="Число Действия" />
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{ba?.desc}</p>
          {ba?.skills && (
            <div className="mt-5">
              <h4 className="font-display font-semibold text-foreground mb-3">Ключевые навыки</h4>
              <div className="rounded-xl bg-muted/25 border border-border/50 p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{ba.skills}</p>
              </div>
            </div>
          )}
          {ba?.deep && (
            <div className="mt-5">
              <h4 className="font-display font-semibold text-foreground mb-2">Число Действия {actionNumber} состоит из {actionFull}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{ba.deep}</p>
            </div>
          )}
        </section>

        <section className="gradient-card rounded-2xl border border-border p-6 md:p-7">
          <NumberBadge value={realizationNumber} full={realizFull} title="Число Реализации" />
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{br?.desc}</p>
        </section>
      </div>

      <KeyToMatrixSection id="biz-matrix" matrix={matrix} />

      <NadezhdaSignature />
    </div>
  );
}
