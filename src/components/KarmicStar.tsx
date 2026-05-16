import { useTranslation } from "react-i18next";

interface KarmicStarProps {
  counts: {
    twos: number;
    fours: number;
    fives: number;
    sevens: number;
    eights: number;
  };
}

export function KarmicStar({ counts }: KarmicStarProps) {
  const { t } = useTranslation();
  
  // Позиции цифр в звезде (по часовой стрелке, начиная с 2)
  // Верхний треугольник пропускаем - символ эволюции
  const positions = [
    { digit: "2", count: counts.twos, x: 85, y: 190, label: t("ancestral.digits.two") },   // левый верх
    { digit: "4", count: counts.fours, x: 200, y: 290, label: t("ancestral.digits.four") },  // низ
    { digit: "7", count: counts.sevens, x: 315, y: 190, label: t("ancestral.digits.seven") }, // правый верх
    { digit: "8", count: counts.eights, x: 315, y: 110, label: t("ancestral.digits.eight") }, // правый
    { digit: "5", count: counts.fives, x: 85, y: 110, label: t("ancestral.digits.five") },   // левый
  ];

  return (
    <div className="relative w-full max-w-[400px] mx-auto aspect-square">
      <svg viewBox="0 0 400 350" className="w-full h-full">
        {/* Треугольник вниз (мужская энергия) */}
        <polygon
          points="200,20 50,280 350,280"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Треугольник вверх (женская энергия) */}
        <polygon
          points="200,330 50,70 350,70"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.5"
        />
        
        {/* Центральный гексаграм - заливка */}
        <polygon
          points="200,20 125,150 50,280 200,200 350,280 275,150"
          fill="hsl(var(--primary) / 0.1)"
          stroke="none"
        />
        
        {/* Верхняя точка - символ эволюции (без числа) */}
        <circle
          cx="200"
          cy="35"
          r="20"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        <text
          x="200"
          y="40"
          textAnchor="middle"
          className="fill-primary text-sm font-medium"
        >
          ↑
        </text>
        
        {/* Позиции с числами */}
        {positions.map((pos, index) => (
          <g key={pos.digit}>
            {/* Круг позиции */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="32"
              fill={pos.count > 0 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            
            {/* Номер позиции (цифра) */}
            <text
              x={pos.x}
              y={pos.y - 6}
              textAnchor="middle"
              className={`text-lg font-bold ${pos.count > 0 ? "fill-primary-foreground" : "fill-muted-foreground"}`}
            >
              {pos.digit}
            </text>
            
            {/* Количество */}
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor="middle"
              className={`text-sm font-medium ${pos.count > 0 ? "fill-primary-foreground" : "fill-muted-foreground"}`}
            >
              ×{pos.count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
