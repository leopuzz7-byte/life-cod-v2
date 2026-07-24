// Движок матрицы Предназначения (методика 1).
// Портирован БЕЗ ИЗМЕНЕНИЙ из калькулятора life-cod-v2 (src/lib/calculations.ts).
// Калькулятор не трогаем: это отдельная копия чистых функций для бота.
// Любая правка методики делается сначала в калькуляторе, потом переносится сюда.

// Приведение числа к аркану (1..22)
function normalizeToArcana(num) {
  while (num > 22) num -= 22;
  if (num === 0) return 22;
  while (num < 0) num += 22;
  while (num > 22) num -= 22;
  if (num === 0) return 22;
  return num;
}

// Сумма цифр числа
function sumDigits(num) {
  return Math.abs(num)
    .toString()
    .split("")
    .reduce((sum, d) => sum + parseInt(d, 10), 0);
}

function yearToArcana(year) {
  return normalizeToArcana(sumDigits(year));
}

function dayToArcana(day) {
  return normalizeToArcana(day);
}

// Расчёт личной матрицы (12 позиций). Раскладка:
//     10   11   12
//      1    2    4
//         3    5
//            6
//         7  8  9
function calculatePersonalMatrix(day, month, year) {
  const positions = new Array(12).fill(0);

  positions[0] = dayToArcana(day);          // 1: день
  positions[1] = month;                     // 2: месяц (1..12)
  positions[3] = yearToArcana(year);        // 4: год (сумма цифр)

  positions[2] = normalizeToArcana(positions[0] + positions[1]); // 3 = 1+2
  positions[4] = normalizeToArcana(positions[1] + positions[3]); // 5 = 2+4
  positions[5] = normalizeToArcana(positions[2] + positions[4]); // 6 = 3+5

  positions[6] = normalizeToArcana(positions[2] + positions[3]); // 7 = 3+4
  positions[7] = normalizeToArcana(positions[1] + positions[5]); // 8 = 2+6
  positions[8] = normalizeToArcana(positions[6] + positions[7]); // 9 = 7+8

  positions[9] = normalizeToArcana(positions[0] - positions[1]);  // 10 = 1-2
  positions[10] = normalizeToArcana(positions[1] - positions[3]); // 11 = 2-4
  positions[11] = normalizeToArcana(positions[9] - positions[10]); // 12 = 10-11

  const { mirrorArcana, reversedArcana } = findSpecialArcana(positions);
  const successCode = [positions[3], positions[4], positions[6], positions[11]]; // 4,5,7,12

  return {
    birthDate: { day, month, year },
    positions,
    mirrorArcana,
    reversedArcana,
    successCode,
  };
}

// Портирован без изменений из калькулятора (findSpecialArcana).
function findSpecialArcana(positions) {
  const mirrorArcana = [];
  const reversedArcana = [];

  // Только основной треугольник (позиции 1-6)
  const mainTriangle = positions.slice(0, 6);
  const occ = new Map();
  mainTriangle.forEach((arcana, index) => {
    const pos = index + 1;
    if (!occ.has(arcana)) occ.set(arcana, []);
    occ.get(arcana).push(pos);
  });

  occ.forEach((occurrences, arcana) => {
    if (occurrences.length >= 2) {
      const isMirror1_4 = occurrences.includes(1) && occurrences.includes(4);
      const isMirror3_5 = occurrences.includes(3) && occurrences.includes(5);
      if (isMirror1_4) mirrorArcana.push({ positions: [1, 4], arcana });
      if (isMirror3_5) mirrorArcana.push({ positions: [3, 5], arcana });

      if (!isMirror1_4 && !isMirror3_5 && occurrences.length >= 2) {
        reversedArcana.push({ positions: occurrences, arcana });
      } else if ((isMirror1_4 || isMirror3_5) && occurrences.length >= 3) {
        reversedArcana.push({ positions: [...occurrences], arcana });
      }
    }
  });

  return { mirrorArcana, reversedArcana };
}

module.exports = {
  normalizeToArcana,
  sumDigits,
  yearToArcana,
  dayToArcana,
  calculatePersonalMatrix,
};
