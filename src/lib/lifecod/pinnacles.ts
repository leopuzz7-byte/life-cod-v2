// Пиннакли (Pinnacles) + Challenges + интеграция с личными годами

export interface PinnacleResult {
  value: number;
  startAge: number;
  endAge: number | null;
  startYear: number;
  endYear: number | null;
}

export interface ChallengeResult {
  value: number;
  // C1 привязан к P1, C2 к P2, C3 к P3, C4 к P4
  pinnacleIndex: number;
}

export interface PinnaclesAnalysis {
  lifePath: number;
  dayCore: number;
  monthCore: number;
  yearCore: number;
  pinnacles: PinnacleResult[];
  challenges: ChallengeResult[];
  steps: {
    dayCore: string;
    monthCore: string;
    yearCore: string;
    lifePath: string;
    P1: string;
    P2: string;
    P3: string;
    P4: string;
    timing: string;
  };
}

export interface CrisisLevel {
  level: 0 | 1 | 2 | 3;
  label: string;
  description: string;
}

export interface IntegratedYearAnalysis {
  year: number;
  personalYear: number;
  activePinnacle: PinnacleResult;
  activePinnacleIndex: number;
  activeChallenge: ChallengeResult;
  crisisLevel: CrisisLevel;
  recommendation: string;
}

// === Утилиты ===

function sumDigits(n: number): number {
  return String(Math.abs(n)).split('').reduce((s, d) => s + parseInt(d), 0);
}

function reduceToSingle(n: number): number {
  if (n === 0) return 0;
  while (n > 9) {
    n = sumDigits(n);
  }
  return n;
}

// === Расчёт пиннаклей ===

export function calculatePinnacles(day: number, month: number, year: number): PinnaclesAnalysis {
  // Ядра
  const dayCore = reduceToSingle(sumDigits(day));
  const monthCore = reduceToSingle(sumDigits(month));
  const yearCore = reduceToSingle(sumDigits(year));

  // Life Path
  const lifePathRaw = sumDigits(day) + sumDigits(month) + sumDigits(year);
  const lifePath = reduceToSingle(lifePathRaw);

  // Пиннакли
  const p1Raw = monthCore + dayCore;
  const P1 = reduceToSingle(p1Raw);

  const p2Raw = dayCore + yearCore;
  const P2 = reduceToSingle(p2Raw);

  const p3Raw = P1 + P2;
  const P3 = reduceToSingle(p3Raw);

  const p4Raw = monthCore + yearCore;
  const P4 = reduceToSingle(p4Raw);

  // Сроки
  const ageEndP1 = 36 - lifePath;
  const pinnacles: PinnacleResult[] = [
    { value: P1, startAge: 0, endAge: ageEndP1, startYear: year, endYear: year + ageEndP1 },
    { value: P2, startAge: ageEndP1 + 1, endAge: ageEndP1 + 9, startYear: year + ageEndP1 + 1, endYear: year + ageEndP1 + 9 },
    { value: P3, startAge: ageEndP1 + 10, endAge: ageEndP1 + 18, startYear: year + ageEndP1 + 10, endYear: year + ageEndP1 + 18 },
    { value: P4, startAge: ageEndP1 + 19, endAge: null, startYear: year + ageEndP1 + 19, endYear: null },
  ];

  // Challenges
  const C1 = Math.abs(monthCore - dayCore);
  const C2 = Math.abs(dayCore - yearCore);
  const C3 = Math.abs(C1 - C2);
  const C4 = Math.abs(monthCore - yearCore);

  const challenges: ChallengeResult[] = [
    { value: C1, pinnacleIndex: 0 },
    { value: C2, pinnacleIndex: 1 },
    { value: C3, pinnacleIndex: 2 },
    { value: C4, pinnacleIndex: 3 },
  ];

  // Шаги расчёта
  const steps = {
    dayCore: `${day} → ${day > 9 ? sumDigits(day) + ' → ' : ''}${dayCore}`,
    monthCore: `${month} → ${month > 9 ? sumDigits(month) + ' → ' : ''}${monthCore}`,
    yearCore: `${year} → ${sumDigits(year)}${sumDigits(year) > 9 ? ' → ' + yearCore : ''}`,
    lifePath: `${day}+${month}+${year} → ${lifePathRaw}${lifePathRaw > 9 ? ' → ' + lifePath : ''}`,
    P1: `${monthCore}+${dayCore}=${p1Raw}${p1Raw > 9 ? ' → ' + P1 : ''}`,
    P2: `${dayCore}+${yearCore}=${p2Raw}${p2Raw > 9 ? ' → ' + P2 : ''}`,
    P3: `${P1}+${P2}=${p3Raw}${p3Raw > 9 ? ' → ' + P3 : ''}`,
    P4: `${monthCore}+${yearCore}=${p4Raw}${p4Raw > 9 ? ' → ' + P4 : ''}`,
    timing: `36 − ${lifePath} = ${ageEndP1}`,
  };

  return { lifePath, dayCore, monthCore, yearCore, pinnacles, challenges, steps };
}

// === Определение активного пиннакля по возрасту ===

export function getActivePinnacleIndex(pinnacles: PinnacleResult[], currentAge: number): number {
  for (let i = 0; i < pinnacles.length; i++) {
    const p = pinnacles[i];
    if (p.endAge === null || currentAge <= p.endAge) {
      return i;
    }
  }
  return 3;
}

// === Кризисный уровень ===

export function determineCrisisLevel(pinnacleValue: number, challengeValue: number, personalYear: number): CrisisLevel {
  const isCrisisPinnacle = [7, 8, 9].includes(pinnacleValue);
  const isCrisisChallenge = [7, 8, 9].includes(challengeValue);
  const isCrisisYear = [7, 8, 9].includes(personalYear);
  const isTenseYear = [5, 6].includes(personalYear);

  // Уровень 3: Обнуление
  if (isCrisisPinnacle && personalYear === 9) {
    return { level: 3, label: 'ОБНУЛЕНИЕ', description: 'Финал. Если не осознанно — через потери.' };
  }

  // Уровень 2: Активный кризис
  if (isCrisisPinnacle && isCrisisYear) {
    return { level: 2, label: 'АКТИВНЫЙ КРИЗИС', description: 'Перелом, давление, риск разрушений.' };
  }

  // Уровень 1: Напряжение
  if (isCrisisPinnacle && isTenseYear) {
    return { level: 1, label: 'НАПРЯЖЕНИЕ', description: 'Старое трещит, но человек ещё держится.' };
  }

  // Дополнительная проверка challenge
  if (isCrisisChallenge && isCrisisYear) {
    return { level: 2, label: 'КРИЗИС УРОКА', description: 'Внутренний конфликт обостряется событиями.' };
  }

  if (isCrisisChallenge && isTenseYear) {
    return { level: 1, label: 'ВНУТРЕННЕЕ НАПРЯЖЕНИЕ', description: 'Урок даёт о себе знать.' };
  }

  return { level: 0, label: 'СТАБИЛЬНО', description: 'Период спокойного развития.' };
}

// === Рекомендации по кризисному уровню ===

function getCrisisRecommendation(crisisLevel: CrisisLevel, pinnacleValue: number, personalYear: number): string {
  if (crisisLevel.level === 0) {
    return 'Благоприятный период для развития и новых начинаний.';
  }

  const recs: string[] = [];

  if ([7, 8, 9].includes(pinnacleValue)) {
    if (pinnacleValue === 7) {
      recs.push('Не начинать новые отношения.');
      recs.push('Не принимать решения на эмоциях.');
      recs.push('Завершать старое мягко.');
    } else if (pinnacleValue === 8) {
      recs.push('Не давить.');
      recs.push('Следить за границами.');
      recs.push('Работать с контролем и деньгами.');
    } else if (pinnacleValue === 9) {
      recs.push('Завершать.');
      recs.push('Не возвращаться в прошлое.');
      recs.push('Отпускать без мести.');
    }
  }

  if (personalYear === 9) {
    recs.push('Готовиться к новому циклу.');
  }

  return recs.length > 0 ? recs.join(' ') : 'Замедлиться и сократить нагрузку.';
}

// === Интегрированный анализ года ===

export function getIntegratedYearAnalysis(
  pinnacles: PinnacleResult[],
  challenges: ChallengeResult[],
  birthYear: number,
  targetYear: number,
  personalYear: number
): IntegratedYearAnalysis {
  const age = targetYear - birthYear;
  const pinnacleIndex = getActivePinnacleIndex(pinnacles, age);
  const activePinnacle = pinnacles[pinnacleIndex];
  const activeChallenge = challenges[pinnacleIndex];

  const crisisLevel = determineCrisisLevel(activePinnacle.value, activeChallenge.value, personalYear);
  const recommendation = getCrisisRecommendation(crisisLevel, activePinnacle.value, personalYear);

  return {
    year: targetYear,
    personalYear,
    activePinnacle,
    activePinnacleIndex: pinnacleIndex,
    activeChallenge,
    crisisLevel,
    recommendation,
  };
}

// === Трактовки пиннаклей ===

export const pinnacleDescriptions: Record<number, {
  name: string;
  essence: string;
  lovePlus: string[];
  loveMinus: string[];
  businessPlus: string[];
  businessMinus: string[];
  isCrisis: boolean;
}> = {
  1: {
    name: 'Начало / Личная сила',
    essence: 'Новые начинания, инициатива, лидерство',
    lovePlus: ['Новые отношения', 'Инициатива, страсть', 'Желание вести, брать ответственность'],
    loveMinus: ['Эгоизм', '«Я сам, ты мешаешь»', 'Конфликт за лидерство'],
    businessPlus: ['Запуск проектов', 'Личный бренд', 'Предпринимательство'],
    businessMinus: ['Одиночная игра', 'Конфликт с партнёрами', 'Импульсивные решения'],
    isCrisis: false,
  },
  2: {
    name: 'Партнёрство / Связь',
    essence: 'Деньги и статус идут через людей, союз, команду',
    lovePlus: ['Союз, брак', 'Умение слышать', 'Эмоциональная близость'],
    loveMinus: ['Обиды', 'Зависимость', 'Манипуляции чувствами'],
    businessPlus: ['Партнёрские проекты', 'Сервис, клиенты', 'Переговоры'],
    businessMinus: ['Страх конфликта', 'Зависимость от чужого мнения', 'Пассивность'],
    isCrisis: false,
  },
  3: {
    name: 'Коммуникация / Социум',
    essence: 'Общение, знакомства, самовыражение',
    lovePlus: ['Лёгкость', 'Флирт', 'Радость общения'],
    loveMinus: ['Поверхностность', 'Треугольники', 'Слова без действий'],
    businessPlus: ['Медиа, блогинг', 'Обучение', 'Продажи'],
    businessMinus: ['Распыление', 'Хаос', 'Нет доведения до конца'],
    isCrisis: false,
  },
  4: {
    name: 'Структура / Фундамент',
    essence: 'Построение, дисциплина, долгосрочные проекты',
    lovePlus: ['Надёжность', 'Совместный быт', 'Стабильность'],
    loveMinus: ['Рутина', 'Контроль', 'Эмоциональная холодность'],
    businessPlus: ['Система', 'Процессы', 'Долгосрочные проекты'],
    businessMinus: ['Жёсткость', 'Страх изменений', 'Микроменеджмент'],
    isCrisis: false,
  },
  5: {
    name: 'Свобода / Перемены',
    essence: 'Обновление, движение, выход из рутины',
    lovePlus: ['Обновление', 'Страсть', 'Выход из токсичных связей'],
    loveMinus: ['Измены', 'Бегство от ответственности', 'Нестабильность'],
    businessPlus: ['Рост', 'Новые рынки', 'Гибкость'],
    businessMinus: ['Авантюризм', 'Хаотичные решения', 'Срывы сроков'],
    isCrisis: false,
  },
  6: {
    name: 'Семья / Ответственность',
    essence: 'Забота, дом, стабильность, союз',
    lovePlus: ['Брак', 'Дети', 'Забота'],
    loveMinus: ['Гиперконтроль', 'Чувство долга вместо любви', 'Манипуляция заботой'],
    businessPlus: ['Управление людьми', 'Сервис', 'Стабильный доход'],
    businessMinus: ['Выгорание', '«Я тащу всех»', 'Невозможность делегировать'],
    isCrisis: false,
  },
  7: {
    name: 'Трансформация / Кризис роста',
    essence: 'Пересборка, переоценка, обнуление старого',
    lovePlus: ['Осознанность', 'Глубина', 'Честные разговоры'],
    loveMinus: ['Разрывы', 'Дистанция', 'Одиночество', 'Холод'],
    businessPlus: ['Стратегия', 'Обучение', 'Пересборка'],
    businessMinus: ['Уход в изоляцию', 'Сомнения', 'Саботаж'],
    isCrisis: true,
  },
  8: {
    name: 'Власть / Деньги / Контроль',
    essence: 'Масштаб, управление, борьба за ресурсы',
    lovePlus: ['Защита', 'Сила', 'Зрелый партнёр'],
    loveMinus: ['Абьюз', 'Собственничество', 'Давление', 'Ревность'],
    businessPlus: ['Масштаб', 'Капитал', 'Управление'],
    businessMinus: ['Жадность', 'Власть ради власти', 'Конфликты'],
    isCrisis: true,
  },
  9: {
    name: 'Завершение / Обнуление',
    essence: 'Итоги, закрытие циклов, подготовка к новому',
    lovePlus: ['Зрелость', 'Прощание без войны', 'Новый этап'],
    loveMinus: ['Резкие расставания', 'Эмоциональное насилие', '«Я исчез»'],
    businessPlus: ['Масштаб', 'Публичность', 'Наставничество'],
    businessMinus: ['Выгорание', 'Закрытие проектов', 'Разрушение из-за усталости'],
    isCrisis: true,
  },
};

// === Трактовки challenges ===

export const challengeDescriptions: Record<number, {
  name: string;
  essence: string;
  inMinus: string[];
  inPlus: string[];
  crisisAdvice: string[];
}> = {
  0: {
    name: 'Комплексный урок',
    essence: 'Нет одной проблемы. Испытания зависят от выбора.',
    inMinus: ['Ощущение хаоса', '«Меня бросает из стороны в сторону»', 'Отсутствие опоры'],
    inPlus: ['Высокая адаптивность', 'Сильная интуиция', 'Способность выходить из любых ситуаций'],
    crisisAdvice: ['Создавать структуру и ритуалы', 'Иначе жизнь будет «разрывать»'],
  },
  1: {
    name: 'Конфликт Я / Мир',
    essence: 'Борьба за право быть собой.',
    inMinus: ['Одиночество', 'Ощущение «я против всех»', 'Борьба за право быть собой'],
    inPlus: ['Лидерство', 'Умение идти своим путём', 'Внутренняя сила'],
    crisisAdvice: ['Не доказывать', 'Не бороться', 'Выбирать, а не защищаться'],
  },
  2: {
    name: 'Зависимость и границы',
    essence: 'Страх одиночества и растворение в другом.',
    inMinus: ['Страх одиночества', 'Растворение в партнёре', 'Манипуляции'],
    inPlus: ['Эмпатия', 'Партнёрство', 'Умение договариваться'],
    crisisAdvice: ['Учиться говорить «нет»', 'Не спасать', 'Не жертвовать собой'],
  },
  3: {
    name: 'Слово и самовыражение',
    essence: 'Замалчивание, обесценивание себя.',
    inMinus: ['Замалчивание', 'Обесценивание себя', 'Психосоматика'],
    inPlus: ['Голос', 'Влияние', 'Публичность'],
    crisisAdvice: ['Говорить', 'Писать', 'Выносить мысли наружу'],
  },
  4: {
    name: 'Страх потери контроля',
    essence: 'Зажим, страх перемен.',
    inMinus: ['Зажим', 'Страх перемен', 'Жёсткость'],
    inPlus: ['Дисциплина', 'Устойчивость', 'Фундамент'],
    crisisAdvice: ['Не держаться за старое', 'Позволить структуре меняться'],
  },
  5: {
    name: 'Свобода vs Ответственность',
    essence: 'Бегство, зависимости, хаос.',
    inMinus: ['Бегство', 'Зависимости', 'Хаос'],
    inPlus: ['Гибкость', 'Рост', 'Новые возможности'],
    crisisAdvice: ['Не убегать', 'Менять форму, а не разрушать всё'],
  },
  6: {
    name: 'Жертва и гиперответственность',
    essence: '«Я должна», выгорание, контроль.',
    inMinus: ['«Я должна»', 'Выгорание', 'Контроль'],
    inPlus: ['Забота', 'Зрелая ответственность', 'Лидерство'],
    crisisAdvice: ['Делегировать', 'Перестать спасать', 'Выбирать себя'],
  },
  7: {
    name: 'Кризис смысла',
    essence: 'Одиночество, депрессия, резкие обрывы.',
    inMinus: ['Одиночество', 'Депрессия', 'Резкие обрывы'],
    inPlus: ['Трансформация', 'Мудрость', 'Рост через осознание'],
    crisisAdvice: ['Не принимать резких решений', 'Не обрывать связи импульсивно', 'Идти в глубину'],
  },
  8: {
    name: 'Власть и контроль',
    essence: 'Абьюз, давление, страх потери власти.',
    inMinus: ['Абьюз', 'Давление', 'Страх потери власти'],
    inPlus: ['Сила', 'Защита', 'Управление'],
    crisisAdvice: ['Отпускать контроль', 'Не давить', 'Учиться договариваться'],
  },
  9: {
    name: 'Финалы и обнуления',
    essence: 'Разрушение, резкие разрывы.',
    inMinus: ['Разрушение', 'Резкие разрывы', 'Эмоциональное насилие'],
    inPlus: ['Завершение', 'Зрелость', 'Новый уровень'],
    crisisAdvice: ['Закрывать экологично', 'Не мстить', 'Не исчезать'],
  },
};
