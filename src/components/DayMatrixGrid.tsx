import { ForecastMiniCard } from "./ForecastCard";

interface DayPos { position: number; arcana: number; }

interface Props { positions: DayPos[]; }

export function DayMatrixGrid({ positions }: Props) {
  const arc = (pos: number) => positions.find(p => p.position === pos)?.arcana ?? 1;
  const hl = (pos: number) => pos === 12; // кармическая задача — акцент

  const Cell = ({ pos }: { pos: number }) => (
    <ForecastMiniCard value={arc(pos)} posNum={pos} highlight={hl(pos)} />
  );

  return (
    <div className="gradient-card rounded-2xl p-4 border border-border">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-4 text-center">
        Матрица дня · нажмите на карту
      </p>
      <div className="flex flex-col items-center gap-2">
        {/* Верхний ряд: подсознание, внешнее влияние, карма */}
        <div className="flex gap-2 md:gap-3">
          <Cell pos={10} /><Cell pos={11} /><Cell pos={12} />
        </div>
        <div className="w-full h-px bg-border/40 my-0.5" />
        {/* Главный треугольник */}
        <div className="flex flex-col items-start gap-2">
          <div className="flex gap-2 md:gap-3">
            <Cell pos={1} /><Cell pos={2} /><Cell pos={4} />
          </div>
          <div className="flex gap-2 md:gap-3 ml-[28px] md:ml-[34px]">
            <Cell pos={3} /><Cell pos={5} />
          </div>
          <div className="ml-[56px] md:ml-[68px]">
            <Cell pos={6} />
          </div>
        </div>
        <div className="w-full h-px bg-border/40 my-0.5" />
        {/* Нижний ряд: задача, способ, итог */}
        <div className="flex gap-2 md:gap-3">
          <Cell pos={7} /><Cell pos={8} /><Cell pos={9} />
        </div>
      </div>
    </div>
  );
}
