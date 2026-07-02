import { useTranslation } from "react-i18next";
import { KeyToResult as KeyToResultType, getKeyToNumberData } from "@/lib/keyto";
import { computeMatrix } from "@/lib/keytoMatrix";
import { personalYear, personalMonth, personalYearText, personalMonthText } from "@/lib/keytoPersonal";
import { umaCycle, actionCycle } from "@/lib/keytoCycles";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { KeyToNumberSection } from "./KeyToNumberSection";
import { KeyToMatrixSection } from "./KeyToMatrixSection";
import { StrengthsWeaknesses, CycleUmaBlock, CycleActionBlock, ProfessionsBlock, KarmicBlock } from "./KeyToExtras";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: KeyToResultType;
  name: string;
  onReset: () => void;
  isPro?: boolean;
}

function genderEnergy(n: number): string {
  if (n === 5) return "Нейтральная";
  return [1, 3, 7, 9].includes(n) ? "Мужская" : "Женская";
}

export function KeyToResultComponent({ result, name, onReset, isPro = false }: Props) {
  const { t } = useTranslation();
  const { day, month, year, mindNumber, actionNumber, realizationNumber, outcomeNumber } = result;
  const mind = getKeyToNumberData(mindNumber);
  const action = getKeyToNumberData(actionNumber);
  const realiz = getKeyToNumberData(realizationNumber);
  const outcome = getKeyToNumberData(outcomeNumber);
  const matrix = computeMatrix(day, month, year);
  const ty = new Date().getFullYear();
  const py = personalYear(day, month, ty);
  const pm = personalMonth(day, month, ty, new Date().getMonth() + 1);
  const code = `${mindNumber}${actionNumber}${realizationNumber}${outcomeNumber}`;
  const dateStr = `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`;

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const tabs = [
    { id: "num-mind", label: "Число Ума" },
    { id: "num-action", label: "Число Действия" },
    { id: "num-realiz", label: "Число Реализации" },
    { id: "num-outcome", label: "Число Итога" },
    { id: "py", label: "Личный год" },
    ...(isPro ? [{ id: "pm", label: "Личный месяц" }] : []),
    { id: "matrix", label: "Матрица" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Предназначение</h1>
        {name && <p className="text-lg text-foreground">{name}</p>}
        <p className="text-muted-foreground text-sm">Дата рождения: {dateStr}</p>
      </div>

      {/* Планета / камень / энергетика / цвет */}
      <div className="gradient-card rounded-2xl border border-border p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div><div className="text-xs text-muted-foreground mb-0.5">Планета</div><div className="font-medium text-foreground">{mind?.planet}</div></div>
        <div><div className="text-xs text-muted-foreground mb-0.5">Камень удачи</div><div className="font-medium text-foreground">{mind?.luckyStone}</div></div>
        <div><div className="text-xs text-muted-foreground mb-0.5">Энергетика</div><div className="font-medium text-foreground">{genderEnergy(mindNumber)}</div></div>
        <div><div className="text-xs text-muted-foreground mb-0.5">Цвет удачи</div><div className="font-medium text-foreground">{mind?.luckyColor}</div></div>
      </div>

      {/* Табы-навигация */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map((tb) => (
          <button key={tb.id} onClick={() => go(tb.id)} className="text-xs px-3 py-1.5 rounded-full bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground">
            {tb.label}
          </button>
        ))}
      </div>

      {/* Личный код */}
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5 text-center">
        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Личный код</div>
        <div className="text-4xl font-display font-bold text-primary tracking-[0.2em]">{code}</div>
      </div>

      <KeyToNumberSection id="num-mind" title="Число Ума" value={mindNumber} full={result.mindFull} name={mind?.name} description={mind?.description || ""}>
        {isPro && mind && <StrengthsWeaknesses pos={mind.positiveQualities} neg={mind.negativeQualities} />}
        {isPro && <CycleUmaBlock cyc={umaCycle(mindNumber)} />}
        {isPro && mind && <KarmicBlock task={mind.karmicTask} />}
      </KeyToNumberSection>

      <KeyToNumberSection id="num-action" title="Число Действия" value={actionNumber} full={result.actionFull} name={action?.name} description={action?.description || ""}>
        {isPro && action && <ProfessionsBlock items={action.professions} />}
        {isPro && <CycleActionBlock cyc={actionCycle(actionNumber)} />}
      </KeyToNumberSection>

      <KeyToNumberSection id="num-realiz" title="Число Реализации" value={realizationNumber} full={result.realizFull} name={realiz?.name} description={realiz?.description || ""} />

      <KeyToNumberSection id="num-outcome" title="Число Итога" value={outcomeNumber} full={result.outcomeFull} name={outcome?.name} description={outcome?.description || ""} />

      <KeyToNumberSection id="py" title="Личный год" value={py} description={personalYearText[py] || ""} />

      {isPro && <KeyToNumberSection id="pm" title="Личный месяц" value={pm} description={personalMonthText[pm] || ""} />}

      <KeyToMatrixSection id="matrix" matrix={matrix} />

      <NadezhdaSignature />
    </div>
  );
}
