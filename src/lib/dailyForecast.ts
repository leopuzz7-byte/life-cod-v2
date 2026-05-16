// Прогноз на день — 12-позиционная матрица совместимости персоны с датой
import { normalizeToArcana, dayToArcana, yearToArcana } from './calculations';
import { getArcana } from './arcana';

export interface DailyForecastPosition {
  position: number;
  arcana: number;
  title: string;
  description: string;
}

export interface DailyForecastResult {
  birthDate: { day: number; month: number; year: number };
  targetDate: { day: number; month: number; year: number };
  positions: DailyForecastPosition[];
}

const positionTitles: Record<number, string> = {
  1: 'Утро / Старт дня',
  2: 'Потенциал дня',
  3: 'Самооценка',
  4: 'Цель дня',
  5: 'Ресурс',
  6: 'Основа',
  7: 'Задача дня',
  8: 'Способ решения',
  9: 'Результат',
  10: 'Подсознательное',
  11: 'Внешнее влияние',
  12: 'Итог / Кармическая задача дня',
};

export function calculateDailyForecast(
  birthDay: number, birthMonth: number, birthYear: number,
  targetDay: number, targetMonth: number, targetYear: number
): DailyForecastResult {
  const pos = new Array(12).fill(0);

  // Входные позиции — совместимость персоны с датой
  pos[0] = normalizeToArcana(dayToArcana(birthDay) + dayToArcana(targetDay));
  pos[1] = normalizeToArcana(birthMonth + targetMonth);
  pos[3] = normalizeToArcana(yearToArcana(birthYear) + yearToArcana(targetYear));

  // Основной треугольник
  pos[2] = normalizeToArcana(pos[0] + pos[1]);
  pos[4] = normalizeToArcana(pos[1] + pos[3]);
  pos[5] = normalizeToArcana(pos[2] + pos[4]);

  // Диагональный ряд
  pos[6] = normalizeToArcana(pos[2] + pos[3]);
  pos[7] = normalizeToArcana(pos[1] + pos[5]);
  pos[8] = normalizeToArcana(pos[6] + pos[7]);

  // Кармический треугольник
  pos[9] = normalizeToArcana(pos[0] - pos[1]);
  pos[10] = normalizeToArcana(pos[1] - pos[3]);
  pos[11] = normalizeToArcana(pos[9] - pos[10]);

  const positions: DailyForecastPosition[] = pos.map((arcana, i) => {
    const arcanaData = getArcana(arcana);
    return {
      position: i + 1,
      arcana,
      title: positionTitles[i + 1],
      description: arcanaData?.yearForecast || '',
    };
  });

  return {
    birthDate: { day: birthDay, month: birthMonth, year: birthYear },
    targetDate: { day: targetDay, month: targetMonth, year: targetYear },
    positions,
  };
}
