// Энергия названия — перевод букв в числа по системе 22 арканов
import { normalizeToArcana } from './calculations';
import { getArcana } from './arcana';

// Таблица: русские и английские буквы → числа 1-9
const letterMap: Record<string, number> = {
  // Русские
  'а': 1, 'б': 2, 'в': 3, 'г': 4, 'д': 5, 'е': 6, 'ё': 7, 'ж': 8, 'з': 9,
  'и': 1, 'й': 2, 'к': 3, 'л': 4, 'м': 5, 'н': 6, 'о': 7, 'п': 8, 'р': 9,
  'с': 1, 'т': 2, 'у': 3, 'ф': 4, 'х': 5, 'ц': 6, 'ч': 7, 'ш': 8, 'щ': 9,
  'ъ': 1, 'ы': 2, 'ь': 3, 'э': 4, 'ю': 5, 'я': 6,
  // Английские
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'j': 1, 'k': 2, 'l': 3, 'm': 4, 'n': 5, 'o': 6, 'p': 7, 'q': 8, 'r': 9,
  's': 1, 't': 2, 'u': 3, 'v': 4, 'w': 5, 'x': 6, 'y': 7, 'z': 8,
};

export interface NameEnergyResult {
  name: string;
  letterBreakdown: { letter: string; value: number }[];
  totalSum: number;
  arcana: number;
  arcanaName: string;
  description: string;
  isHarmonious: boolean;
  recommendation: string;
}

export function calculateNameEnergy(name: string): NameEnergyResult {
  const letters = name.toLowerCase().split('');
  const letterBreakdown: { letter: string; value: number }[] = [];
  let totalSum = 0;

  letters.forEach(letter => {
    const val = letterMap[letter];
    if (val !== undefined) {
      letterBreakdown.push({ letter, value: val });
      totalSum += val;
    }
  });

  const arcana = normalizeToArcana(totalSum);
  const arcanaData = getArcana(arcana);

  // Гармоничные арканы для бизнеса/названий
  const harmoniousArcana = [1, 3, 4, 6, 8, 10, 14, 17, 19, 21];
  const isHarmonious = harmoniousArcana.includes(arcana);

  let recommendation = '';
  if (isHarmonious) {
    recommendation = 'Название несёт гармоничную энергию. Оно привлекает клиентов и способствует развитию.';
  } else if ([7, 9, 12, 13, 16, 18, 20].includes(arcana)) {
    recommendation = 'Название несёт трансформационную энергию. Возможны резкие перемены и нестабильность. Рекомендуется рассмотреть альтернативные варианты.';
  } else {
    recommendation = 'Название нейтрально. Энергия не помогает и не мешает. Можно усилить, изменив написание.';
  }

  return {
    name,
    letterBreakdown,
    totalSum,
    arcana,
    arcanaName: arcanaData?.name || '',
    description: arcanaData?.personalDescription || '',
    isHarmonious,
    recommendation,
  };
}
