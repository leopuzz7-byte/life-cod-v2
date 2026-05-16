// Функции расчётов для нумерологии
import { getArcana } from './arcana';

// Интерфейсы
export interface PersonalMatrix {
  birthDate: { day: number; month: number; year: number };
  positions: number[]; // 12 позиций
  mirrorArcana: { positions: [number, number]; arcana: number }[];
  reversedArcana: { positions: number[]; arcana: number }[];
  successCode: number[]; // позиции 4, 5, 7, 12
}

export interface YearForecast {
  birthDate: { day: number; month: number; year: number };
  targetYear: number;
  arcana: number;
}

export interface MonthForecast {
  birthDate: { day: number; month: number; year: number };
  targetMonth: number;
  targetYear: number;
  // Треугольник месяца
  position1: number; // Аркан года
  position2: number; // Аркан месяца (1-12)
  position3: number; // Сумма позиций 1 и 2
}

// Совместимость двух людей
export interface CompatibilityResult {
  person1: {
    name: string;
    birthDate: { day: number; month: number; year: number };
    destinyArcana: number; // Аркан предназначения (позиция 4)
    soulArcana: number; // Аркан души (позиция 1)
  };
  person2: {
    name: string;
    birthDate: { day: number; month: number; year: number };
    destinyArcana: number;
    soulArcana: number;
  };
  // Арканы совместимости
  unionArcana: number; // Аркан союза (сумма арканов предназначения)
  karmaArcana: number; // Кармический аркан (разница арканов)
  harmonyArcana: number; // Аркан гармонии (сумма арканов души)
  compatibilityPercent: number; // Процент совместимости
  strengths: string[]; // Сильные стороны союза
  challenges: string[]; // Вызовы союза
}

// Базовые правила приведения числа к аркану (1-22)
export function normalizeToArcana(num: number): number {
  // Правило 1: Если число > 22, вычитаем 22
  while (num > 22) {
    num -= 22;
  }
  // Правило 2: Если число = 0, заменяем на 22
  if (num === 0) {
    return 22;
  }
  // Правило 3: Если число отрицательное, прибавляем 22
  while (num < 0) {
    num += 22;
  }
  // После прибавления 22 число может стать > 22
  while (num > 22) {
    num -= 22;
  }
  if (num === 0) {
    return 22;
  }
  return num;
}

// Сумма цифр числа
export function sumDigits(num: number): number {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}

// Приведение года к аркану
export function yearToArcana(year: number): number {
  let sum = sumDigits(year);
  return normalizeToArcana(sum);
}

// Приведение дня к аркану
export function dayToArcana(day: number): number {
  return normalizeToArcana(day);
}

// Расчёт личной матрицы (12 позиций)
// Структура:
//     10     11     12
//      1      2      4
//         3      5
//            6
//         7  8  9 (диагональный ряд)
export function calculatePersonalMatrix(day: number, month: number, year: number): PersonalMatrix {
  const positions: number[] = new Array(12).fill(0);
  
  // === ВВОДНЫЕ ДАННЫЕ ===
  // Позиция 1: День рождения (если > 22, вычитаем 22)
  positions[0] = dayToArcana(day);
  
  // Позиция 2: Месяц рождения (1-12, не меняем)
  positions[1] = month;
  
  // Позиция 4: Год рождения (сумма цифр, если > 22, вычитаем 22)
  // ВАЖНО: позиция 4, а не 3!
  positions[3] = yearToArcana(year);
  
  // === ОСНОВНОЙ ТРЕУГОЛЬНИК ===
  // Позиция 3: Позиция 1 + Позиция 2
  positions[2] = normalizeToArcana(positions[0] + positions[1]);
  
  // Позиция 5: Позиция 2 + Позиция 4
  positions[4] = normalizeToArcana(positions[1] + positions[3]);
  
  // Позиция 6: Позиция 3 + Позиция 5
  positions[5] = normalizeToArcana(positions[2] + positions[4]);
  
  // === ДИАГОНАЛЬНЫЙ РЯД ===
  // Позиция 7: Позиция 3 + Позиция 4
  positions[6] = normalizeToArcana(positions[2] + positions[3]);
  
  // Позиция 8: Позиция 2 + Позиция 6
  positions[7] = normalizeToArcana(positions[1] + positions[5]);
  
  // Позиция 9: Позиция 7 + Позиция 8
  positions[8] = normalizeToArcana(positions[6] + positions[7]);
  
  // === КАРМИЧЕСКИЙ ТРЕУГОЛЬНИК (вычитание) ===
  // Позиция 10: Позиция 1 - Позиция 2 (если отрицательное, прибавляем 22)
  positions[9] = normalizeToArcana(positions[0] - positions[1]);
  
  // Позиция 11: Позиция 2 - Позиция 4 (если отрицательное, прибавляем 22)
  positions[10] = normalizeToArcana(positions[1] - positions[3]);
  
  // Позиция 12: Позиция 10 - Позиция 11 (если отрицательное, прибавляем 22)
  positions[11] = normalizeToArcana(positions[9] - positions[10]);
  
  // Определение зеркальных и перевёрнутых арканов
  const { mirrorArcana, reversedArcana } = findSpecialArcana(positions);
  
  // Код успеха: позиции 4, 5, 7, 12
  const successCode = [positions[3], positions[4], positions[6], positions[11]];
  
  return {
    birthDate: { day, month, year },
    positions,
    mirrorArcana,
    reversedArcana,
    successCode
  };
}

// Поиск зеркальных и перевёрнутых арканов в основном треугольнике (позиции 1-6)
function findSpecialArcana(positions: number[]): {
  mirrorArcana: { positions: [number, number]; arcana: number }[];
  reversedArcana: { positions: number[]; arcana: number }[];
} {
  const mirrorArcana: { positions: [number, number]; arcana: number }[] = [];
  const reversedArcana: { positions: number[]; arcana: number }[] = [];
  
  // Только основной треугольник (позиции 0-5, т.е. 1-6)
  const mainTriangle = positions.slice(0, 6);
  
  // Находим все повторяющиеся арканы
  const arcanaOccurrences: Map<number, number[]> = new Map();
  
  mainTriangle.forEach((arcana, index) => {
    const pos = index + 1; // 1-based position
    if (!arcanaOccurrences.has(arcana)) {
      arcanaOccurrences.set(arcana, []);
    }
    arcanaOccurrences.get(arcana)!.push(pos);
  });
  
  // Проверяем каждый повторяющийся аркан
  arcanaOccurrences.forEach((occurrences, arcana) => {
    if (occurrences.length >= 2) {
      // Зеркальные: позиции 1-4 или 3-5
      const isMirror1_4 = occurrences.includes(1) && occurrences.includes(4);
      const isMirror3_5 = occurrences.includes(3) && occurrences.includes(5);
      
      if (isMirror1_4) {
        mirrorArcana.push({ positions: [1, 4], arcana });
      }
      if (isMirror3_5) {
        mirrorArcana.push({ positions: [3, 5], arcana });
      }
      
      // Перевёрнутые: все остальные комбинации (исключая зеркальные пары)
      const remainingPositions = occurrences.filter(pos => {
        if (isMirror1_4 && (pos === 1 || pos === 4)) return false;
        if (isMirror3_5 && (pos === 3 || pos === 5)) return false;
        return true;
      });
      
      // Если есть другие повторения или это не зеркальная пара
      if (!isMirror1_4 && !isMirror3_5 && occurrences.length >= 2) {
        reversedArcana.push({ positions: occurrences, arcana });
      } else if (remainingPositions.length >= 1 && (isMirror1_4 || isMirror3_5)) {
        // Тройной аркан - остаток после зеркальной пары
        const allPositions = [...occurrences];
        if (allPositions.length >= 3) {
          // Это тройной аркан - супер-усиление
          reversedArcana.push({ positions: allPositions, arcana });
        }
      }
    }
  });
  
  return { mirrorArcana, reversedArcana };
}

// Расчёт годового прогноза
export function calculateYearForecast(day: number, month: number, year: number, targetYear: number): YearForecast {
  // Формула: аркан_года_рождения + аркан_целевого_года
  const birthYearArcana = yearToArcana(year);
  const targetYearArcana = yearToArcana(targetYear);
  const arcana = normalizeToArcana(birthYearArcana + targetYearArcana);
  
  return {
    birthDate: { day, month, year },
    targetYear,
    arcana
  };
}

// Расчёт месячного прогноза
export function calculateMonthForecast(
  day: number, 
  month: number, 
  year: number, 
  targetMonth: number, 
  targetYear: number
): MonthForecast {
  // Позиция 1: Аркан года (годовой прогноз)
  const yearForecast = calculateYearForecast(day, month, year, targetYear);
  const position1 = yearForecast.arcana;
  
  // Позиция 2: Номер месяца (1-12)
  const position2 = targetMonth;
  
  // Позиция 3: Сумма позиций 1 и 2
  const position3 = normalizeToArcana(position1 + position2);
  
  return {
    birthDate: { day, month, year },
    targetMonth,
    targetYear,
    position1,
    position2,
    position3
  };
}

// Расчёт совместимости двух людей
//
// Алгоритм взвешенной оценки по 6 факторам, каждый из которых даёт 0–100,
// затем взвешенная сумма ограничивается диапазоном 25–98%.
//
// Опирается на ARCANA_UNION_QUALITY — таблицу качества каждого аркана как
// "энергии для союза", построенную на классической Таро-нумерологии
// (Маг = лидерство, Влюблённые/Солнце = высокая совместимость, Башня/Дьявол = разрушение).

// Качество каждого аркана как «энергии для союза» (0–100)
const ARCANA_UNION_QUALITY: Record<number, number> = {
  1:  75,  // Маг — мастерство, лидерство
  2:  80,  // Жрица — интуиция, гармония
  3:  90,  // Императрица — любовь, изобилие
  4:  70,  // Император — стабильность
  5:  65,  // Иерофант — традиция, брак
  6:  95,  // Влюблённые — главный аркан любви
  7:  60,  // Колесница — движение, но конфликтность
  8:  80,  // Сила — мягкая власть, терпение
  9:  50,  // Отшельник — уединение
  10: 70,  // Колесо — перемены, удача
  11: 75,  // Справедливость — баланс
  12: 40,  // Повешенный — пауза, жертва
  13: 35,  // Смерть — окончания, трансформация
  14: 90,  // Умеренность — гармония, исцеление
  15: 30,  // Дьявол — страсть, зависимость
  16: 25,  // Башня — кризис, разрушение
  17: 95,  // Звезда — надежда, вдохновение
  18: 45,  // Луна — иллюзии, тревога
  19: 100, // Солнце — радость, наполненность
  20: 70,  // Суд — обновление, пробуждение
  21: 95,  // Мир — завершённость, успех
  22: 65,  // Шут — старт, лёгкость
};

function computeCompatibilityPercent(
  matrix1Positions: number[],
  matrix2Positions: number[],
  destiny1: number,
  destiny2: number,
  soul1: number,
  soul2: number,
  unionArcana: number,
  karmaArcana: number,
  harmonyArcana: number
): number {
  // Фактор 1: качество аркана союза (30%)
  const unionScore = ARCANA_UNION_QUALITY[unionArcana] ?? 50;

  // Фактор 2: качество аркана гармонии — эмоциональная составляющая (20%)
  const harmonyScore = ARCANA_UNION_QUALITY[harmonyArcana] ?? 50;

  // Фактор 3: кармический аркан (15%)
  // Лёгкая карма (high quality arcana) — плюс, тяжёлая — минус,
  // но сглаживаем потому что любая карма даёт рост
  const karmaScore = 50 + ((ARCANA_UNION_QUALITY[karmaArcana] ?? 50) - 50) * 0.5;

  // Фактор 4: близость арканов предназначения (20%)
  let destinyScore: number;
  if (destiny1 === destiny2) {
    destinyScore = 90;
  } else if (destiny1 + destiny2 === 23) {
    // Комплементарная пара (1↔22, 2↔21, ...)
    destinyScore = 85;
  } else if (destiny1 + destiny2 === 22) {
    // Зеркальная пара через 11
    destinyScore = 80;
  } else {
    const diff = Math.abs(destiny1 - destiny2);
    if (diff <= 3) destinyScore = 70;
    else if (diff <= 7) destinyScore = 55;
    else if (diff <= 11) destinyScore = 45;
    else destinyScore = 35;
  }

  // Фактор 5: близость арканов души (10%)
  let soulScore: number;
  if (soul1 === soul2) {
    soulScore = 85;
  } else if (soul1 + soul2 === 22 || soul1 + soul2 === 23) {
    soulScore = 75;
  } else {
    const diff = Math.abs(soul1 - soul2);
    if (diff <= 4) soulScore = 65;
    else if (diff <= 8) soulScore = 50;
    else soulScore = 40;
  }

  // Фактор 6: перекрытие полных матриц — сколько арканов общие из 12 позиций (5%)
  const set1 = new Set(matrix1Positions);
  const set2 = new Set(matrix2Positions);
  let shared = 0;
  set1.forEach(a => { if (set2.has(a)) shared++; });
  const overlapScore = Math.min(98, 50 + shared * 5);

  // Взвешенная сумма
  const weighted =
    unionScore   * 0.30 +
    harmonyScore * 0.20 +
    karmaScore   * 0.15 +
    destinyScore * 0.20 +
    soulScore    * 0.10 +
    overlapScore * 0.05;

  return Math.round(Math.max(25, Math.min(98, weighted)));
}

export function calculateCompatibility(
  person1Day: number,
  person1Month: number,
  person1Year: number,
  person1Name: string,
  person2Day: number,
  person2Month: number,
  person2Year: number,
  person2Name: string
): CompatibilityResult {
  // Рассчитываем матрицы обоих людей
  const matrix1 = calculatePersonalMatrix(person1Day, person1Month, person1Year);
  const matrix2 = calculatePersonalMatrix(person2Day, person2Month, person2Year);

  // Аркан предназначения (позиция 4) и души (позиция 1)
  const destiny1 = matrix1.positions[3];
  const destiny2 = matrix2.positions[3];
  const soul1 = matrix1.positions[0];
  const soul2 = matrix2.positions[0];

  // Аркан союза — сумма арканов предназначения
  const unionArcana = normalizeToArcana(destiny1 + destiny2);

  // Кармический аркан — разница арканов предназначения
  // (если разница 0 — берём 22 как "полный круг кармы")
  const diffDestiny = Math.abs(destiny1 - destiny2);
  const karmaArcana = normalizeToArcana(diffDestiny === 0 ? 22 : diffDestiny);

  // Аркан гармонии — сумма арканов души
  const harmonyArcana = normalizeToArcana(soul1 + soul2);

  // Процент совместимости — взвешенная оценка по 6 факторам
  const compatibilityPercent = computeCompatibilityPercent(
    matrix1.positions,
    matrix2.positions,
    destiny1, destiny2,
    soul1, soul2,
    unionArcana, karmaArcana, harmonyArcana,
  );

  // Определяем сильные стороны и вызовы на основе арканов
  const strengths = getCompatibilityStrengths(unionArcana, harmonyArcana, destiny1, destiny2);
  const challenges = getCompatibilityChallenges(karmaArcana, soul1, soul2);

  return {
    person1: {
      name: person1Name || "Партнёр 1",
      birthDate: { day: person1Day, month: person1Month, year: person1Year },
      destinyArcana: destiny1,
      soulArcana: soul1,
    },
    person2: {
      name: person2Name || "Партнёр 2",
      birthDate: { day: person2Day, month: person2Month, year: person2Year },
      destinyArcana: destiny2,
      soulArcana: soul2,
    },
    unionArcana,
    karmaArcana,
    harmonyArcana,
    compatibilityPercent,
    strengths,
    challenges,
  };
}

// Сильные стороны союза
function getCompatibilityStrengths(unionArcana: number, harmonyArcana: number, destiny1: number, destiny2: number): string[] {
  const strengths: string[] = [];
  
  // На основе аркана союза
  const unionStrengths: Record<number, string> = {
    1: "Сильное лидерство и инициатива в паре",
    2: "Глубокая интуитивная связь",
    3: "Творческое взаимодействие и радость общения",
    4: "Стабильность и надёжность отношений",
    5: "Духовный рост и мудрость в паре",
    6: "Гармония в любви и семейных ценностях",
    7: "Успех в совместных начинаниях",
    8: "Справедливость и баланс в отношениях",
    9: "Глубокая мудрость и понимание друг друга",
    10: "Удача и позитивные перемены вместе",
    11: "Сила и мужество преодолевать трудности",
    12: "Духовное развитие через отношения",
    13: "Способность к трансформации и обновлению",
    14: "Умеренность и гармония в быту",
    15: "Страсть и магнетизм в отношениях",
    16: "Способность преодолевать кризисы",
    17: "Надежда и вдохновение друг для друга",
    18: "Интуитивное понимание без слов",
    19: "Радость и оптимизм в отношениях",
    20: "Духовное возрождение через любовь",
    21: "Полнота и завершённость союза",
    22: "Свобода и приключения вместе",
  };
  
  if (unionStrengths[unionArcana]) {
    strengths.push(unionStrengths[unionArcana]);
  }
  
  // На основе аркана гармонии
  if (harmonyArcana <= 11) {
    strengths.push("Эмоциональная близость и взаимопонимание");
  } else {
    strengths.push("Глубокая духовная связь");
  }
  
  // Одинаковые арканы предназначения
  if (destiny1 === destiny2) {
    strengths.push("Общие жизненные цели и ценности");
  }
  
  return strengths;
}

// Вызовы союза
function getCompatibilityChallenges(karmaArcana: number, soul1: number, soul2: number): string[] {
  const challenges: string[] = [];
  
  const karmaChallenges: Record<number, string> = {
    1: "Борьба за лидерство в паре",
    2: "Сложности с принятием решений",
    3: "Поверхностность в общении",
    4: "Излишняя rigидность и упрямство",
    5: "Разные духовные пути",
    6: "Сложности с ответственностью",
    7: "Разные направления развития",
    8: "Споры о справедливости",
    9: "Отстранённость и замкнутость",
    10: "Нестабильность и перемены",
    11: "Конфликты из-за силы характеров",
    12: "Жертвенность одного из партнёров",
    13: "Страх перемен в отношениях",
    14: "Скука и рутина",
    15: "Манипуляции и зависимости",
    16: "Неожиданные кризисы",
    17: "Нереалистичные ожидания",
    18: "Иллюзии и недопонимание",
    19: "Разный уровень энергии",
    20: "Разные темпы личностного роста",
    21: "Чувство незавершённости",
    22: "Безответственность и хаос",
  };
  
  if (karmaChallenges[karmaArcana]) {
    challenges.push(karmaChallenges[karmaArcana]);
  }
  
  // Большая разница в арканах души
  if (Math.abs(soul1 - soul2) > 10) {
    challenges.push("Разные эмоциональные потребности");
  }
  
  return challenges;
}

// Получение названия месяца
export function getMonthName(month: number): string {
  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  return months[month - 1] || "";
}

// Форматирование даты
export function formatBirthDate(day: number, month: number, year: number): string {
  const monthName = getMonthName(month);
  return `${day} ${monthName} ${year}`;
}
