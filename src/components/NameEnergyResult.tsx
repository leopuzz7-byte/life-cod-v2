import { Button } from "@/components/ui/button";
import { NameEnergyResult as NameEnergyType } from "@/lib/nameEnergy";
import { getArcana } from "@/lib/arcana";
import { ArrowLeft, CheckCircle, AlertTriangle, MinusCircle } from "lucide-react";

interface Props {
  result: NameEnergyType;
  onReset: () => void;
}

export function NameEnergyResultComponent({ result, onReset }: Props) {
  const arcanaData = getArcana(result.arcana);

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" onClick={onReset} className="mb-4 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Новый расчёт
      </Button>

      <div className="gradient-card rounded-2xl p-6 border border-border mb-6">
        <h2 className="text-2xl font-display text-primary mb-1">Энергия названия</h2>
        <p className="text-muted-foreground text-sm mb-6">«{result.name}»</p>

        {/* Arcana card */}
        <div className="bg-card rounded-xl border border-border p-6 text-center mb-6">
          <div className="text-4xl font-display text-primary mb-2">{result.arcana}</div>
          <div className="text-lg font-display text-foreground mb-1">{result.arcanaName}</div>
          <div className="text-sm text-muted-foreground">Сумма букв: {result.totalSum}</div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${
          result.isHarmonious 
            ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
            : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
        }`}>
          {result.isHarmonious 
            ? <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" /> 
            : <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          }
          <p className="text-sm text-foreground">{result.recommendation}</p>
        </div>

        {/* Letter breakdown */}
        <div className="mb-6">
          <h3 className="font-display text-foreground text-sm mb-3">Разбор по буквам</h3>
          <div className="flex flex-wrap gap-1">
            {result.letterBreakdown.map((item, i) => (
              <div key={i} className="bg-secondary rounded-lg px-2 py-1 text-center min-w-[2rem]">
                <div className="text-xs text-foreground font-medium">{item.letter.toUpperCase()}</div>
                <div className="text-[10px] text-primary font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <h3 className="font-display text-foreground text-sm mb-2">Описание энергии</h3>
          <p className="text-sm text-muted-foreground">{result.description}</p>
        </div>
      </div>
    </div>
  );
}
