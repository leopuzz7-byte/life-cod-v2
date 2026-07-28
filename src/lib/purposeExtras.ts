// Дополнительная логика разбора Предназначения по правилам Надежды.
// Зеркальные арканы, приоритет перевёрнутых, каталог профессий, ключевые позиции.
import { PersonalMatrix } from "./calculations";
import { getArcana, positionDescriptions } from "./arcana";

// Зеркальные пары позиций (1-индексация как в методике).
export const MIRROR_PAIRS_DIRECT: [number, number][] = [[4, 7], [5, 8], [6, 9]];
export const MIRROR_PAIRS_CROSS: [number, number][] = [[4, 8], [5, 7], [5, 9], [6, 8]];

export interface MirrorHit {
  a: number;        // позиция 1
  b: number;        // позиция 2
  kind: "direct" | "cross";
  arcana: number;   // одинаковый аркан в обеих позициях
}

// Находит зеркальные арканы: одинаковый аркан в паре зеркальных позиций.
export function computeMirrors(m: PersonalMatrix): MirrorHit[] {
  const p = m.positions;
  const hits: MirrorHit[] = [];
  const push = (pairs: [number, number][], kind: MirrorHit["kind"]) => {
    for (const [a, b] of pairs) {
      const va = p[a - 1], vb = p[b - 1];
      if (va && vb && va === vb) hits.push({ a, b, kind, arcana: va });
    }
  };
  push(MIRROR_PAIRS_DIRECT, "direct");
  push(MIRROR_PAIRS_CROSS, "cross");
  return hits;
}

export interface ReversedHit { arcana: number; positions: number[]; inTriangle: boolean }

// Перевёрнутые арканы с приоритетом: основной треугольник (позиции 1-6) первым,
// затем остальные позиции. Один и тот же аркан не дублируется.
export function computeReversedOrdered(m: PersonalMatrix): ReversedHit[] {
  const seen = new Set<number>();
  const out: ReversedHit[] = [];
  const list = (m.reversedArcana || []).map((r) => ({
    arcana: r.arcana,
    positions: r.positions,
    inTriangle: r.positions.some((pos) => pos >= 1 && pos <= 6),
  }));
  list.sort((x, y) => Number(y.inTriangle) - Number(x.inTriangle));
  for (const r of list) {
    if (seen.has(r.arcana)) continue;
    seen.add(r.arcana);
    out.push(r);
  }
  return out;
}

// Каталог категорий профессий (структурированный вид вместо длинного списка).
export const PROFESSION_CATEGORIES = [
  "Помощь людям",
  "Бизнес и управление",
  "Творчество",
  "Наука и образование",
  "Технологии",
  "Государственная служба",
  "Медицина",
  "Финансы",
  "Право",
  "Духовная сфера",
] as const;

// Удобные ярлыки позиций для промптов и заголовков.
export function posLabel(pos: number, arcanaNum: number): string {
  const a = getArcana(arcanaNum);
  const title = positionDescriptions[pos]?.title || `Позиция ${pos}`;
  return a ? `${pos} позиция (${title}): ${arcanaNum} Аркан «${a.name}»` : `${pos} позиция (${title})`;
}

// Ключевые группы позиций методики.
export const TRIANGLE_DESTINY = [2, 4, 5];   // треугольник предназначения
export const SOUL_GOALS = [7, 8, 9];         // цели и задачи души
export const KARMA_TRIANGLE = [10, 11, 12];  // кармический треугольник
export const DESTINY_SIX = [2, 4, 5, 7, 8, 9]; // шесть позиций для финального заключения
