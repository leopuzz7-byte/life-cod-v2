import { MatrixResult, MATRIX_GRID, matrixDigit } from "@/lib/keytoMatrix";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  matrix: MatrixResult;
}

// Психоматрица 3x3 (сетка Пифагора) в наших цветах + описания цифр.
export function KeyToMatrixSection({ id, matrix }: Props) {
  return (
    <section id={id} className="gradient-card rounded-2xl border border-border p-6 md:p-7 scroll-mt-24">
      <h2 className="font-display font-bold text-xl md:text-2xl text-foreground mb-1">Детализированная матрица</h2>
      <p className="text-sm text-muted-foreground mb-5">Цифры вашей даты рождения в квадрате Пифагора. Золотым отмечены проявленные энергии, серым те, что нужно наработать.</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-[300px] mx-auto mb-6">
        {MATRIX_GRID.map((d) => {
          const count = matrix.counts[d];
          const present = count > 0;
          return (
            <div
              key={d}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center border",
                present ? "bg-primary/12 border-primary/40" : "bg-muted/30 border-border/50"
              )}
            >
              <span className={cn(
                "font-display font-bold tabular-nums",
                present ? "text-primary text-xl sm:text-2xl" : "text-muted-foreground/50 text-lg"
              )}>
                {present ? String(d).repeat(count) : d}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }, (_, i) => i + 1).map((d) => {
          const present = matrix.counts[d] > 0;
          return (
            <div key={d} className="rounded-xl bg-muted/25 border border-border/50 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn("font-display font-bold text-lg", present ? "text-primary" : "text-muted-foreground")}>{d}</span>
                <span className={cn("text-xs font-medium", present ? "text-primary" : "text-muted-foreground")}>
                  {present ? "есть энергия" : "нет энергии"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {present ? matrixDigit[d].present : matrixDigit[d].absent}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
