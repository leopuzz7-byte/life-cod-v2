import { UmaCycle, ActionCycle } from "@/lib/keytoCycles";

// Сильные / слабые стороны (две колонки) в нашем стиле.
export function StrengthsWeaknesses({ pos, neg }: { pos: string[]; neg: string[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
        <h4 className="text-sm font-medium text-primary mb-2">Сильные стороны</h4>
        <ul className="space-y-1.5">
          {pos.map((q, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-primary">+</span>{q}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Слабые стороны</h4>
        <ul className="space-y-1.5">
          {neg.map((q, i) => (
            <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-muted-foreground/60">-</span>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Цикл развития Числа Ума (соседние энергии -1 / +1).
export function CycleUmaBlock({ cyc }: { cyc: UmaCycle }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-foreground mb-3">Цикл развития</h4>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
          <div className="text-center mb-2"><span className="font-display font-bold text-foreground">-1</span> <span className="text-xs text-muted-foreground">к энергии {cyc.minusEnergy}</span></div>
          <p className="text-sm text-muted-foreground leading-relaxed">{cyc.minus}</p>
        </div>
        <div className="rounded-xl bg-primary/8 border border-primary/20 p-4">
          <div className="text-center mb-2"><span className="font-display font-bold text-primary">+1</span> <span className="text-xs text-muted-foreground">к энергии {cyc.plusEnergy}</span></div>
          <p className="text-sm text-muted-foreground leading-relaxed">{cyc.plus}</p>
        </div>
      </div>
    </div>
  );
}

// Цикл развития Числа Действия (триада +3).
export function CycleActionBlock({ cyc }: { cyc: ActionCycle }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-foreground mb-3">Цикл развития +3</h4>
      <div className="rounded-xl bg-primary/8 border border-primary/20 p-3 text-center font-display font-bold text-primary text-lg mb-3">
        {cyc.triad.join("  -  ")}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{cyc.positive}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{cyc.negative}</p>
    </div>
  );
}

// Подходящие профессии.
export function ProfessionsBlock({ items }: { items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="font-display font-semibold text-foreground mb-3">Подходящие профессии</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((p, i) => (
          <span key={i} className="text-sm px-3 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">{p}</span>
        ))}
      </div>
    </div>
  );
}

// Кармическая задача.
export function KarmicBlock({ task }: { task: string }) {
  return (
    <div className="rounded-xl bg-muted/25 border border-border/50 p-4">
      <h4 className="text-sm font-medium text-foreground mb-1.5">Кармическая задача</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{task}</p>
    </div>
  );
}
