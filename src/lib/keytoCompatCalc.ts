// KEYTO (методика 2) — расчёт совместимости.
// Общее число = сумма данностей двух людей, сведённая к 1-9 (проверено по книге и скринам: код 4948).
import { calculateKeyTo } from './keyto';

function reduce(n: number): number {
  while (n > 9) n = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  return n;
}

export interface CompatNumber {
  n: number;        // сведённое общее число (4)
  full: number;     // сумма полных чисел двух людей (для «из»)
  digits: number[]; // цифры full для раскладки «состоит из»
}

export interface KeyToCompatResult {
  date1: string;
  date2: string;
  code: string;     // «4948»
  mind: CompatNumber;
  action: CompatNumber;
  realiz: CompatNumber;
  outcome: CompatNumber;
  commonYear: number;
}

export function calculateKeyToCompat(
  d1: number, m1: number, y1: number,
  d2: number, m2: number, y2: number,
): KeyToCompatResult {
  const a = calculateKeyTo(d1, m1, y1);
  const b = calculateKeyTo(d2, m2, y2);
  const mk = (an: number, bn: number, af: number, bf: number): CompatNumber => {
    const full = af + bf;
    return { n: reduce(an + bn), full, digits: String(full).split('').map(Number) };
  };
  const mind = mk(a.mindNumber, b.mindNumber, a.mindFull, b.mindFull);
  const action = mk(a.actionNumber, b.actionNumber, a.actionFull, b.actionFull);
  const realiz = mk(a.realizationNumber, b.realizationNumber, a.realizFull, b.realizFull);
  const outcome = mk(a.outcomeNumber, b.outcomeNumber, a.outcomeFull, b.outcomeFull);

  const ty = new Date().getFullYear();
  const py = (d: number, m: number) => reduce(reduce(d) + reduce(m) + String(ty).split('').reduce((s, c) => s + parseInt(c), 0));
  const commonYear = reduce(py(d1, m1) + py(d2, m2));

  const fmt = (d: number, m: number, y: number) => `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y}`;
  return {
    date1: fmt(d1, m1, y1),
    date2: fmt(d2, m2, y2),
    code: `${mind.n}${action.n}${realiz.n}${outcome.n}`,
    mind, action, realiz, outcome, commonYear,
  };
}

// Короткие значения цифр «раскрывается через» (по смыслу книги/скринов, без длинных тире).
export const compatDigit: Record<number, string> = {
  0: "Вдохновение в этом партнёрстве или, наоборот, обнуление общих планов.",
  1: "Общую стратегию и лидерство, желание взять на себя ответственность.",
  2: "Понимание и доверие, умение опереться друг на друга.",
  3: "Поиск новых знаний, стремление к организации и договорённостям.",
  4: "Совместные цели и создание нового, работу на результат.",
  5: "Живое общение, психологию и умение находить возможности вместе.",
  6: "Углубление эмоциональных связей, любовь и чувство прекрасного.",
  7: "Совместные испытания и духовный рост через преодоление.",
  8: "Материальный результат, ответственность и глубину.",
  9: "Служение, отдачу и работу на общее дело.",
};
