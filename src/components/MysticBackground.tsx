import { useMysticMode } from "@/lib/mysticMode";

const SIZE = 1000;
const C = SIZE / 2;
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
// Тонкие астрологические символы (как в референсе), одним золотом
const SYMS = ["☉", "☽", "☿", "♀", "♁", "♃", "♄", "♅", "♆", "♇", "☊", "⚸"];

function cycle<T>(base: T[], n: number): T[] {
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

// Веер радиальных штрихов (главный элемент), штрихи чередуются по длине
function Ticks({ count, r, long, short, dur, reverse }: { count: number; r: number; long: number; short: number; dur: number; reverse?: boolean }) {
  const from = reverse ? `360 ${C} ${C}` : `0 ${C} ${C}`;
  const to = reverse ? `0 ${C} ${C}` : `360 ${C} ${C}`;
  return (
    <g stroke="url(#mysticGold)" strokeWidth={1.4}>
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" from={from} to={to} dur={`${dur}s`} repeatCount="indefinite" />
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * 2 * Math.PI;
        const len = i % 4 === 0 ? long : short;
        const x1 = C + r * Math.cos(a), y1 = C + r * Math.sin(a);
        const x2 = C + (r + len) * Math.cos(a), y2 = C + (r + len) * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 4 === 0 ? 0.9 : 0.55} />;
      })}
    </g>
  );
}

function SymbolRing({ r, count, items, dur, reverse, digits, size }: {
  r: number; count: number; items: string[]; dur: number; reverse?: boolean; digits: boolean; size: number;
}) {
  const list = cycle(items, count);
  const from = reverse ? `360 ${C} ${C}` : `0 ${C} ${C}`;
  const to = reverse ? `0 ${C} ${C}` : `360 ${C} ${C}`;
  return (
    <g>
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" from={from} to={to} dur={`${dur}s`} repeatCount="indefinite" />
      {list.map((it, i) => {
        const a = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = C + r * Math.cos(a);
        const y = C + r * Math.sin(a);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={size}
            fontFamily={digits ? "'Cormorant', serif" : "'Segoe UI Symbol', 'Noto Sans Symbols', serif"}
            fontWeight={digits ? 600 : 400} fill="url(#mysticGold)">{it}</text>
        );
      })}
    </g>
  );
}

export function MysticBackground() {
  const { mode } = useMysticMode();
  const digits = mode === "digits";
  const items = digits ? DIGITS : SYMS;

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[205vmin] h-[205vmin] max-w-none opacity-[0.35] md:opacity-[0.5]">
        <defs>
          <linearGradient id="mysticGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F0D98A" />
            <stop offset="0.5" stopColor="#C9973A" />
            <stop offset="1" stopColor="#A87626" />
          </linearGradient>
        </defs>

        {/* Веер радиальных штрихов */}
        <Ticks count={120} r={392} long={34} short={20} dur={260} />

        {/* Окружности */}
        <circle cx={C} cy={C} r={388} fill="none" stroke="url(#mysticGold)" strokeWidth={2} opacity={0.85} />
        <circle cx={C} cy={C} r={378} fill="none" stroke="url(#mysticGold)" strokeWidth={1} opacity={0.5} />

        {/* Символы по окружности */}
        <SymbolRing r={340} count={12} items={items} dur={240} digits={digits} size={digits ? 52 : 40} />

        {/* Внутренние тонкие окружности для глубины */}
        <circle cx={C} cy={C} r={250} fill="none" stroke="url(#mysticGold)" strokeWidth={1} strokeDasharray="1 14" opacity={0.4} />
        <circle cx={C} cy={C} r={150} fill="none" stroke="url(#mysticGold)" strokeWidth={1} opacity={0.35} />
      </svg>
    </div>
  );
}
