// Блок 5: Психологическая расшифровка
import { CalcTrace } from './personalAnalysis';

function reduceToSingle(num: number): number {
  if (num === 0) return 0;
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
  }
  return num;
}

export interface PsychProfileModule {
  psychotype: { name: string; desc: string };
  relationshipReaction: string;
  fears: string[];
  lifeScenarios: string[];
  repeatingCycles: string[];
  calcTrace: CalcTrace;
}

const psychotypes: Record<string, { name: string; desc: string }> = {
  '1-1': { name: 'Волк-одиночка', desc: 'Действует один, принимает решения без оглядки' },
  '1-2': { name: 'Стратег-дипломат', desc: 'Лидер, умеющий договариваться' },
  '1-3': { name: 'Генератор идей', desc: 'Инициатор с талантом коммуникации' },
  '1-4': { name: 'Строитель империй', desc: 'Лидер с дисциплиной и порядком' },
  '1-5': { name: 'Авантюрист', desc: 'Лидер, ищущий новые горизонты' },
  '1-6': { name: 'Покровитель', desc: 'Лидер, заботящийся о команде' },
  '1-7': { name: 'Стратег-аналитик', desc: 'Лидер с глубоким мышлением' },
  '1-8': { name: 'Магнат', desc: 'Лидер с жаждой власти и масштаба' },
  '1-9': { name: 'Визионер', desc: 'Лидер с глобальным мышлением' },
  '2-1': { name: 'Серый кардинал', desc: 'Влияет через связи, действует через лидера' },
  '2-2': { name: 'Зеркало', desc: 'Отражает людей, глубокая эмпатия' },
  '2-3': { name: 'Коммуникатор', desc: 'Строит мосты между людьми' },
  '2-4': { name: 'Надёжный тыл', desc: 'Партнёр, создающий стабильность' },
  '2-5': { name: 'Адаптивный партнёр', desc: 'Гибкий в отношениях, подстраивается' },
  '2-6': { name: 'Хранитель очага', desc: 'Заботливый, семейный, жертвенный' },
  '2-7': { name: 'Мудрый советник', desc: 'Интуитивный и глубокий наблюдатель' },
  '2-8': { name: 'Партнёр в бизнесе', desc: 'Умеет работать с сильными людьми' },
  '2-9': { name: 'Целитель', desc: 'Понимает боль других, помогает трансформироваться' },
};

const relationshipReactions: Record<number, string> = {
  1: 'Доминирует, берёт контроль. Нужен партнёр, который не ломается, но и не борется.',
  2: 'Подстраивается, теряет себя. Нужен партнёр, дающий пространство.',
  3: 'Переключает конфликт в шутку. Нужен партнёр, принимающий легкость.',
  4: 'Закрывается, уходит в молчание. Нужен партнёр с терпением.',
  5: 'Сбегает или переключается. Нужен партнёр, дающий свободу.',
  6: 'Берёт ответственность за всё. Нужен партнёр, не злоупотребляющий этим.',
  7: 'Анализирует, отстраняется. Нужен партнёр, не давящий эмоциями.',
  8: 'Давит, настаивает на своём. Нужен партнёр, умеющий стоять на позиции.',
  9: 'Обрывает резко. Нужен партнёр, помогающий завершать мягко.',
};

const fearsByMissing: Record<number, string> = {
  1: 'Страх одиночества и отвержения',
  2: 'Страх предательства и зависимости',
  3: 'Страх быть непонятым и высмеянным',
  4: 'Страх хаоса и потери контроля',
  5: 'Страх ограничений и рутины',
  6: 'Страх ненужности и отвержения семьёй',
  7: 'Страх бессмысленности и незнания',
  8: 'Страх бедности и безвластия',
  9: 'Страх потери и невозвратности',
};

const scenariosByDominant: Record<number, string> = {
  1: 'Сценарий «Я сам» — всё делает один, выгорает',
  2: 'Сценарий «Без меня не обойдутся» — растворяется в других',
  3: 'Сценарий «Вечный студент» — учится вместо действий',
  4: 'Сценарий «Всё под контролем» — невроз от невозможности контроля',
  5: 'Сценарий «Вечный путешественник» — бежит от обязательств',
  6: 'Сценарий «Жертва» — тянет на себе всех',
  7: 'Сценарий «Отшельник» — уходит от людей',
  8: 'Сценарий «Тиран» — давит ради результата',
  9: 'Сценарий «Сжигатель мостов» — разрушает связи',
};

const cyclesByPinnacle: Record<number, string> = {
  1: 'Цикл одиноких решений — каждые 9 лет повторяется потребность всё начать заново',
  2: 'Цикл зависимости — каждые 9 лет ищет нового «спасателя»',
  3: 'Цикл незавершённости — каждые 9 лет начинает, но не доводит',
  4: 'Цикл застревания — каждые 9 лет упирается в систему',
  5: 'Цикл бегства — каждые 9 лет сбегает от рутины',
  6: 'Цикл выгорания — каждые 9 лет выгорает от гиперответственности',
  7: 'Цикл изоляции — каждые 9 лет уходит в себя',
  8: 'Цикл борьбы — каждые 9 лет вступает в конфликт за ресурсы',
  9: 'Цикл обнуления — каждые 9 лет теряет то, что построил',
};

export function calculatePsychProfile(
  consciousness: number, action: number,
  missingDigits: number[], dominantDigits: number[],
  pinnacleValues: number[]
): PsychProfileModule {
  const key = `${consciousness}-${action}`;
  const psychotype = psychotypes[key] || { name: `Тип ${consciousness}-${action}`, desc: 'Уникальная комбинация энергий' };
  const reaction = relationshipReactions[consciousness] || '';

  const fears = missingDigits.slice(0, 3).map(d => fearsByMissing[d] || '');
  const scenarios = dominantDigits.slice(0, 2).map(d => scenariosByDominant[d] || '');
  
  // Repeating cycles based on pinnacle dominant value
  const pinnacleSet = [...new Set(pinnacleValues)];
  const cycles = pinnacleSet.slice(0, 2).map(v => cyclesByPinnacle[v] || '');

  return {
    psychotype, relationshipReaction: reaction,
    fears: fears.filter(Boolean), lifeScenarios: scenarios.filter(Boolean),
    repeatingCycles: cycles.filter(Boolean),
    calcTrace: {
      input: `Сознание: ${consciousness}, Действия: ${action}`,
      steps: [
        `Психотип: ${consciousness}-${action} → ${psychotype.name}`,
        `Страхи (по дефицитам): ${missingDigits.join(', ') || 'нет'}`,
        `Сценарии (по доминантам): ${dominantDigits.join(', ') || 'нет'}`,
      ],
      result: psychotype.name,
    },
  };
}
