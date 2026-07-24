const { calculatePersonalMatrix } = require("./calculations");
const { getArcana, positionTitles } = require("./arcana");
// проверочные даты
[[7,3,1990],[29,12,1985],[1,1,2000],[31,10,1976]].forEach(([d,m,y]) => {
  const mx = calculatePersonalMatrix(d, m, y);
  console.log(`${d}.${m}.${y} -> positions [${mx.positions.join(", ")}] | код успеха [${mx.successCode.join(", ")}]`);
});
// sanity: все значения в диапазоне 1..22
const bad = [];
for (let d=1; d<=28; d++) for (let m=1; m<=12; m++) {
  const p = calculatePersonalMatrix(d,m,1990).positions;
  if (p.some(v => v<1 || v>22)) bad.push(`${d}.${m}`);
}
console.log("out-of-range dates:", bad.length === 0 ? "НЕТ (ок)" : bad.join(","));
console.log("аркан 7 =", getArcana(7).name, "| позиция 7 =", positionTitles[7]);
