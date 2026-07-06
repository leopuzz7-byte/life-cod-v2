import { useMysticMode } from "@/lib/mysticMode";

const ZODIAC = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
const PLANETS = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆"];
const STARS = ["✦", "✧", "✶", "✦", "✧", "✶"];
const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const SIZE = 900;
const C = SIZE / 2;

function cycle(base: string[], n: number): string[] {
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

function Ring({ r, count, glyphs, dur, reverse, dash, glyphSize, gold }: {
  r: number; count: number; glyphs: string[]; dur: number; reverse?: boolean; dash?: string; glyphSize: number; gold?: boolean;
}) {
  const items = cycle(glyphs, count);
  const from = reverse ? `360 ${C} ${C}` : `0 ${C} ${C}`;
  const to = reverse ? `0 ${C} ${C}` : `360 ${C} ${C}`;
  return (
    <g>
      <animateTransform attributeName="transform" attributeType="XML" type="rotate" from={from} to={to} dur={`${dur}s`} repeatCount="indefinite" />
      <circle cx={C} cy={C} r={r} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray={dash || "2 12"} opacity={0.55} />
      {items.map((g, i) => {
        const a = (i / count) * 2 * Math.PI - Math.PI / 2;
        const x = C + r * Math.cos(a);
        const y = C + r * Math.sin(a);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={glyphSize} fontWeight={600}
            fill={gold ? "#C9973A" : "currentColor"} opacity={0.75}>{g}</text>
        );
      })}
    </g>
  );
}

export function MysticBackground() {
  const { mode } = useMysticMode();
  const digits = mode === "digits";
  const outer = digits ? DIGITS : ZODIAC;
  const mid = digits ? DIGITS : PLANETS;
  const inner = digits ? DIGITS : STARS;

  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-[150vmin] h-[150vmin] max-w-none opacity-[0.10] md:opacity-[0.14]" style={{ color: "#0F2044" }}>
        <g>
          <animateTransform attributeName="transform" attributeType="XML" type="rotate" from={`0 ${C} ${C}`} to={`360 ${C} ${C}`} dur="220s" repeatCount="indefinite" />
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * 2 * Math.PI;
            const r1 = 350, r2 = 366;
            return <line key={i} x1={C + r1 * Math.cos(a)} y1={C + r1 * Math.sin(a)} x2={C + r2 * Math.cos(a)} y2={C + r2 * Math.sin(a)} stroke="currentColor" strokeWidth={1} opacity={0.4} />;
          })}
        </g>
        <Ring r={415} count={12} glyphs={outer} dur={170} glyphSize={28} />
        <Ring r={300} count={9} glyphs={mid} dur={130} reverse glyphSize={26} gold />
        <Ring r={195} count={6} glyphs={inner} dur={95} glyphSize={22} />
        <circle cx={C} cy={C} r={120} fill="none" stroke="currentColor" strokeWidth={1} strokeDasharray="1 14" opacity={0.45} />
      </svg>
    </div>
  );
}
