// Функции расчётов для Life C⚙D - 8 методик

import {
  ConsciousnessAnalysis,
  ActionAnalysis,
  PersonalYear,
  PersonLifeCodAnalysis,
  StabilizerResult,
  StabilizerStatus,
  YearEntryAnalysis,
  EntryStatus,
  EntryType,
  PairEntryAnalysis,
  PairEntryStatus,
  InteractionAnalysis,
  InteractionCategory,
  YearForecastPoint,
  YearType,
  PartnerFilter,
  LifeCodCompatibilityResult,
  LifeCodSingleAnalysis,
  RelationType,
} from './types';

import {
  personalYearDescriptions,
  interactionMatrix,
  consciousnessCompatibility,
  partnerFilters,
} from './data';

// ============= БАЗОВЫЕ ФУНКЦИИ =============

// Редукция числа к 1-9
function reduceToSingle(num: number): number {
  if (num === 0) return 0;
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

// Сумма цифр числа
function sumDigits(num: number): number {
  return String(Math.abs(num)).split('').reduce((sum, d) => sum + parseInt(d), 0);
}

// ============= МЕТОДИКА 1: СОЗНАНИЕ =============

export function calculateConsciousness(day: number, month: number): ConsciousnessAnalysis {
  const rawSum = day + month;
  const chain: number[] = [day, month];
  
  let current = rawSum;
  if (rawSum > 9) {
    chain.push(rawSum);
    current = reduceToSingle(rawSum);
  }
  chain.push(current);
  
  return {
    day,
    month,
    rawSum,
    result: current,
    chain: [...new Set(chain)], // уникальные значения
  };
}

// ============= МЕТОДИКА 7: ДЕЙСТВИЯ =============

export function calculateAction(year: number): ActionAnalysis {
  const lastTwo = year % 100;
  const digit1 = Math.floor(lastTwo / 10);
  const digit2 = lastTwo % 10;
  
  const chain: number[] = [digit1, digit2];
  const intermediateSum = digit1 + digit2;
  
  let result = intermediateSum;
  if (intermediateSum > 9) {
    chain.push(intermediateSum);
    result = reduceToSingle(intermediateSum);
  }
  chain.push(result);
  
  return {
    yearLastTwoDigits: [digit1, digit2],
    intermediateSum,
    result,
    chain: [...new Set(chain)],
  };
}

// ============= ЛИЧНЫЙ ГОД (9-летний цикл) =============

export function calculatePersonalYear(day: number, month: number, targetYear: number): number {
  const sum = day + month + sumDigits(targetYear);
  return reduceToSingle(sum);
}

export function getPersonalYears(day: number, month: number, startYear: number, count: number = 5): PersonalYear[] {
  const years: PersonalYear[] = [];
  for (let i = 0; i < count; i++) {
    const year = startYear + i;
    years.push({
      year,
      personalYear: calculatePersonalYear(day, month, year),
    });
  }
  return years;
}

// ============= ПОЛНЫЙ АНАЛИЗ ЧЕЛОВЕКА =============

export function analyzePersonLifeCod(
  name: string,
  day: number,
  month: number,
  year: number
): PersonLifeCodAnalysis {
  const currentYear = new Date().getFullYear();
  const personalYears = getPersonalYears(day, month, currentYear, 5);
  
  return {
    name,
    birthDate: { day, month, year },
    consciousness: calculateConsciousness(day, month),
    action: calculateAction(year),
    personalYears,
    currentPersonalYear: personalYears[0].personalYear,
  };
}

// ============= МЕТОДИКА 4: ГОД ВХОДА В ОТНОШЕНИЯ =============

export function analyzeYearEntry(personalYear: number): YearEntryAnalysis {
  const yearData = personalYearDescriptions[personalYear];
  
  let entryStatus: EntryStatus;
  let entryType: EntryType = null;
  let risks: string[] = [];
  
  switch (personalYear) {
    case 2:
      entryStatus = 'ALLOWED';
      entryType = 'FAMILY';
      break;
    case 4:
      entryStatus = 'CONDITIONAL';
      entryType = 'FORMAL';
      risks = ['Если нет готовности — ломается'];
      break;
    case 6:
      entryStatus = 'ALLOWED';
      entryType = 'FAMILY';
      break;
    case 5:
      entryStatus = 'CONDITIONAL';
      entryType = 'TRANSITION';
      risks = ['Хаос', 'Треугольники', 'Нестабильность'];
      break;
    case 9:
      entryStatus = 'CONDITIONAL';
      entryType = 'EXPERIMENTAL';
      risks = ['Прошлое должно быть закрыто'];
      break;
    case 1:
      entryStatus = 'NOT_RECOMMENDED';
      risks = ['Эго', 'Партнёр вторичен', 'Фокус на себя'];
      break;
    case 3:
      entryStatus = 'NOT_RECOMMENDED';
      risks = ['Флирт', 'Поверхностность', 'Мало закрепления'];
      break;
    case 7:
      entryStatus = 'NOT_RECOMMENDED';
      risks = ['Пересборка', 'Качели', 'Отстранённость'];
      break;
    case 8:
      entryStatus = 'NOT_RECOMMENDED';
      risks = ['Давление', 'Контроль', 'Токсичный сценарий'];
      break;
    default:
      entryStatus = 'CONDITIONAL';
  }
  
  return {
    personalYear,
    entryStatus,
    entryType,
    shortReason: yearData?.forRelationships || '',
    risks,
    recommendation: yearData?.entryCondition || (yearData?.entryAllowed ? 'Вход разрешён' : 'Вход не рекомендуется'),
  };
}

export function analyzePairEntry(
  person1Year: number,
  person2Year: number
): PairEntryAnalysis {
  const person1Entry = analyzeYearEntry(person1Year);
  const person2Entry = analyzeYearEntry(person2Year);
  
  const allowedYears = [2, 4, 5, 6, 9];
  const bothAllowed = allowedYears.includes(person1Year) && allowedYears.includes(person2Year);
  const oneAllowed = allowedYears.includes(person1Year) || allowedYears.includes(person2Year);
  
  let pairStatus: PairEntryStatus;
  let pairComment: string;
  let stabilizerNeeded = false;
  
  // Лучшие комбинации
  if ((person1Year === 2 && person2Year === 2) ||
      (person1Year === 6 && person2Year === 6) ||
      (person1Year === 4 && person2Year === 6) ||
      (person1Year === 6 && person2Year === 4) ||
      (person1Year === 4 && person2Year === 4)) {
    pairStatus = 'BEST';
    pairComment = 'Обоюдная готовность к союзу';
  }
  // Хорошие с оговорками
  else if (bothAllowed) {
    pairStatus = 'OK';
    pairComment = 'Вход возможен с условиями';
    stabilizerNeeded = true;
  }
  // Один готов, другой нет
  else if (oneAllowed) {
    pairStatus = 'TEMP';
    pairComment = 'Один партнёр не готов. Временный союз';
    stabilizerNeeded = true;
  }
  // Оба не готовы
  else {
    pairStatus = 'NO';
    pairComment = 'Оба партнёра в неподходящих годах';
  }
  
  // Абсолютно плохие комбинации
  if ((person1Year === 7 && person2Year === 7) ||
      (person1Year === 8 && person2Year === 8) ||
      (person1Year === 1 && person2Year === 1) ||
      (person1Year === 7 && person2Year === 8) ||
      (person1Year === 8 && person2Year === 7)) {
    pairStatus = 'NO';
    pairComment = 'Критически несовместимые года';
  }
  
  return {
    person1Entry,
    person2Entry,
    pairStatus,
    pairComment,
    stabilizerNeeded,
  };
}

// ============= МЕТОДИКА 5: СТАБИЛИЗАТОР =============

export function analyzeStabilizer(person1Year: number, person2Year: number): StabilizerResult {
  let stabilizerPoints = 0;
  let destabilizerPoints = 0;
  const destabilizers: string[] = [];
  
  // Стабилизаторы
  const has4p1 = person1Year === 4;
  const has6p1 = person1Year === 6;
  const has4p2 = person2Year === 4;
  const has6p2 = person2Year === 6;
  
  if (has4p1) stabilizerPoints += 2;
  if (has6p1) stabilizerPoints += 2;
  if (has4p2) stabilizerPoints += 2;
  if (has6p2) stabilizerPoints += 2;
  
  // Дестабилизаторы
  if (person1Year === 7) { destabilizerPoints += 2; destabilizers.push('7_REBUILD'); }
  if (person1Year === 8) { destabilizerPoints += 2; destabilizers.push('8_CONTROL'); }
  if (person1Year === 5) { destabilizerPoints += 1; destabilizers.push('5_CHAOS'); }
  if (person1Year === 3) { destabilizerPoints += 1; destabilizers.push('3_FLIRT'); }
  if (person1Year === 1) { destabilizerPoints += 1; destabilizers.push('1_EGO'); }
  
  if (person2Year === 7) { destabilizerPoints += 2; destabilizers.push('7_REBUILD'); }
  if (person2Year === 8) { destabilizerPoints += 2; destabilizers.push('8_CONTROL'); }
  if (person2Year === 5) { destabilizerPoints += 1; destabilizers.push('5_CHAOS'); }
  if (person2Year === 3) { destabilizerPoints += 1; destabilizers.push('3_FLIRT'); }
  if (person2Year === 1) { destabilizerPoints += 1; destabilizers.push('1_EGO'); }
  
  const hasStabilizer = has4p1 || has6p1 || has4p2 || has6p2;
  const score = stabilizerPoints - destabilizerPoints;
  
  let stabilizerType: '4' | '6' | '4+6' | 'none';
  if ((has4p1 || has4p2) && (has6p1 || has6p2)) stabilizerType = '4+6';
  else if (has4p1 || has4p2) stabilizerType = '4';
  else if (has6p1 || has6p2) stabilizerType = '6';
  else stabilizerType = 'none';
  
  let stabilizerHolder: 'person1' | 'person2' | 'both' | 'none';
  const p1HasStab = has4p1 || has6p1;
  const p2HasStab = has4p2 || has6p2;
  if (p1HasStab && p2HasStab) stabilizerHolder = 'both';
  else if (p1HasStab) stabilizerHolder = 'person1';
  else if (p2HasStab) stabilizerHolder = 'person2';
  else stabilizerHolder = 'none';
  
  let status: StabilizerStatus;
  if (!hasStabilizer) {
    status = 'NO';
  } else if (score >= 2) {
    status = 'STRONG';
  } else if (score === 1) {
    status = 'OK';
  } else if (score === 0) {
    status = 'WEAK';
  } else {
    status = 'NO';
  }
  
  return {
    hasStabilizer,
    stabilizerType,
    stabilizerHolder,
    score,
    status,
    destabilizers,
  };
}

// ============= МЕТОДИКА 6: МАТРИЦА ВЗАИМОДЕЙСТВИЯ =============

export function analyzeInteraction(
  person1Year: number,
  person2Year: number,
  relationType: RelationType
): InteractionAnalysis {
  const key = `${person1Year}-${person2Year}`;
  const data = interactionMatrix[key];
  
  let category: InteractionCategory;
  let loveMeaning: string;
  let businessMeaning: string;
  let riskLevel: number;
  
  if (data) {
    category = data.category;
    loveMeaning = data.loveMeaning;
    businessMeaning = data.businessMeaning;
  } else {
    // Дефолтная логика для не прописанных комбинаций
    category = 'UNSTABLE';
    loveMeaning = `Сочетание годов ${person1Year} и ${person2Year} требует внимания`;
    businessMeaning = `Сочетание годов ${person1Year} и ${person2Year} в бизнесе требует баланса`;
  }
  
  switch (category) {
    case 'STABLE': riskLevel = 20; break;
    case 'UNSTABLE': riskLevel = 50; break;
    case 'CRISIS': riskLevel = 75; break;
    case 'BREAKDOWN': riskLevel = 95; break;
    default: riskLevel = 50;
  }
  
  return {
    person1Year,
    person2Year,
    category,
    loveMeaning,
    businessMeaning,
    riskLevel,
    needsStabilizer: category !== 'STABLE',
  };
}

// ============= МЕТОДИКА 7 (ПРОГНОЗ): КРИЗИСНЫЕ ТОЧКИ =============

export function analyzeForecast(
  person1: PersonLifeCodAnalysis,
  person2: PersonLifeCodAnalysis
): YearForecastPoint[] {
  const forecast: YearForecastPoint[] = [];
  
  for (let i = 0; i < 5; i++) {
    const year = person1.personalYears[i].year;
    const p1Year = person1.personalYears[i].personalYear;
    const p2Year = person2.personalYears[i].personalYear;
    
    const stabilizer = analyzeStabilizer(p1Year, p2Year);
    const interaction = analyzeInteraction(p1Year, p2Year, 'love');
    
    let type: YearType;
    let description: string;
    
    if (interaction.category === 'STABLE') {
      type = 'STABLE';
      description = 'Стабильный период';
    } else if (interaction.category === 'BREAKDOWN' || (interaction.category === 'CRISIS' && !stabilizer.hasStabilizer)) {
      type = 'BREAKDOWN';
      description = 'Высокая вероятность разрыва';
    } else if (interaction.category === 'CRISIS') {
      type = 'CRISIS';
      description = 'Год кризиса и проверки союза';
    } else if ((p1Year === 2 || p2Year === 2 || p1Year === 6 || p2Year === 6) && i > 0 && forecast[i-1]?.type === 'CRISIS') {
      type = 'RECOVERY';
      description = 'Год восстановления и переосмысления';
    } else {
      type = 'STABLE';
      description = 'Нестабильный, но управляемый период';
    }
    
    // Проверка на год нового союза после разрыва
    if (i > 0 && forecast[i-1]?.type === 'BREAKDOWN' && [2, 3, 6].includes(p1Year)) {
      type = 'NEW_UNION';
      description = 'Готовность к новым отношениям';
    }
    
    forecast.push({
      year,
      person1Year: p1Year,
      person2Year: p2Year,
      type,
      description,
      hasStabilizer: stabilizer.hasStabilizer,
    });
  }
  
  return forecast;
}

// ============= МЕТОДИКА 8: ПОДБОР ПАРТНЁРА =============

export function analyzePartnerFilter(consciousness: number, action: number): PartnerFilter {
  const consFilter = partnerFilters[consciousness] || partnerFilters[5];
  const actFilter = partnerFilters[action] || partnerFilters[5];
  
  // Комбинируем фильтры сознания и действий
  return {
    suitableConsciousness: consFilter.suitableConsciousness,
    suitableActions: actFilter.suitableActions,
    bestMonths: consFilter.bestMonths,
    conflictMonths: consFilter.conflictMonths,
    notRecommendedConsciousness: consFilter.notRecommended,
    notRecommendedActions: actFilter.notRecommended,
    reason: consFilter.reason,
  };
}

// ============= СОВМЕСТИМОСТЬ СОЗНАНИЙ =============

function analyzeConsciousnessCompatibility(
  person1Cons: number,
  person2Cons: number,
  relationType: RelationType
): { status: 'COMPATIBLE' | 'TENSE' | 'CONFLICT'; description: string; loveInterpretation: string; businessInterpretation: string } {
  const key = `${person1Cons}-${person2Cons}`;
  const data = consciousnessCompatibility[key];
  
  let status: 'COMPATIBLE' | 'TENSE' | 'CONFLICT';
  let description: string;
  
  if (data) {
    status = data.status;
    description = data.description;
  } else {
    // Дефолт для не прописанных комбинаций
    status = 'TENSE';
    description = `Сознания ${person1Cons} и ${person2Cons} требуют адаптации`;
  }
  
  let loveInterpretation: string;
  let businessInterpretation: string;
  
  switch (status) {
    case 'COMPATIBLE':
      loveInterpretation = 'На уровне мышления союз гармоничен. Партнёры понимают друг друга';
      businessInterpretation = 'Хорошее понимание бизнес-целей и подходов';
      break;
    case 'TENSE':
      loveInterpretation = 'Напряжённость в понимании. Требуется осознанная работа над отношениями';
      businessInterpretation = 'Разные подходы к бизнесу. Нужны чёткие договорённости';
      break;
    case 'CONFLICT':
      loveInterpretation = 'Конфликт мировоззрений. Без глубокой работы союз нестабилен';
      businessInterpretation = 'Высокий риск конфликтов и борьбы за влияние';
      break;
  }
  
  return { status, description, loveInterpretation, businessInterpretation };
}

// ============= ГЛАВНАЯ ФУНКЦИЯ: ПОЛНЫЙ АНАЛИЗ СОВМЕСТИМОСТИ =============

export function calculateLifeCodCompatibility(
  person1Name: string, person1Day: number, person1Month: number, person1Year: number,
  person2Name: string, person2Day: number, person2Month: number, person2Year: number,
  relationType: RelationType = 'love'
): LifeCodCompatibilityResult {
  // Анализ каждого человека
  const person1 = analyzePersonLifeCod(person1Name, person1Day, person1Month, person1Year);
  const person2 = analyzePersonLifeCod(person2Name, person2Day, person2Month, person2Year);
  
  // Методика 3: Совместимость сознаний
  const consciousnessCompatibilityResult = analyzeConsciousnessCompatibility(
    person1.consciousness.result,
    person2.consciousness.result,
    relationType
  );
  
  // Методика 4: Год входа
  const yearEntry = analyzePairEntry(person1.currentPersonalYear, person2.currentPersonalYear);
  
  // Методика 5: Стабилизатор
  const stabilizer = analyzeStabilizer(person1.currentPersonalYear, person2.currentPersonalYear);
  
  // Методика 6: Текущее взаимодействие
  const currentInteraction = analyzeInteraction(
    person1.currentPersonalYear,
    person2.currentPersonalYear,
    relationType
  );
  
  // Методика 7: Прогноз
  const forecast = analyzeForecast(person1, person2);
  
  // Общий вердикт
  const canBeTogetherNow = yearEntry.pairStatus !== 'NO' && stabilizer.status !== 'NO';
  
  let whoHoldsUnion: 'person1' | 'person2' | 'both' | 'none';
  if (stabilizer.stabilizerHolder !== 'none') {
    whoHoldsUnion = stabilizer.stabilizerHolder;
  } else if (person1.action.result === 6 || person1.action.result === 4) {
    whoHoldsUnion = 'person1';
  } else if (person2.action.result === 6 || person2.action.result === 4) {
    whoHoldsUnion = 'person2';
  } else {
    whoHoldsUnion = 'none';
  }
  
  let mainRisk = '';
  if (stabilizer.destabilizers.length > 0) {
    const riskMap: Record<string, string> = {
      '7_REBUILD': 'Пересборка личности',
      '8_CONTROL': 'Давление и контроль',
      '5_CHAOS': 'Нестабильность и хаос',
      '3_FLIRT': 'Поверхностность',
      '1_EGO': 'Эгоцентризм',
    };
    mainRisk = stabilizer.destabilizers.map(d => riskMap[d] || d).join(', ');
  }
  
  let longTermProspect: 'HIGH' | 'MEDIUM' | 'LOW';
  const crisisYears = forecast.filter(f => f.type === 'CRISIS' || f.type === 'BREAKDOWN').length;
  if (crisisYears === 0 && consciousnessCompatibilityResult.status === 'COMPATIBLE') {
    longTermProspect = 'HIGH';
  } else if (crisisYears <= 2 && stabilizer.hasStabilizer) {
    longTermProspect = 'MEDIUM';
  } else {
    longTermProspect = 'LOW';
  }
  
  let recommendation: string;
  if (canBeTogetherNow && longTermProspect === 'HIGH') {
    recommendation = relationType === 'love' 
      ? 'Союз имеет высокий потенциал. Рекомендуется развивать отношения'
      : 'Партнёрство перспективно. Можно масштабировать сотрудничество';
  } else if (canBeTogetherNow) {
    recommendation = relationType === 'love'
      ? 'Союз возможен с условиями. Важно работать над коммуникацией'
      : 'Партнёрство требует чётких договорённостей и распределения ролей';
  } else {
    recommendation = relationType === 'love'
      ? 'Сейчас не лучшее время для серьёзных отношений. Рекомендуется подождать'
      : 'Партнёрство рискованно. Рекомендуется отложить или пересмотреть условия';
  }
  
  return {
    relationType,
    person1,
    person2,
    consciousnessCompatibility: consciousnessCompatibilityResult,
    yearEntry,
    stabilizer,
    currentInteraction,
    forecast,
    overallVerdict: {
      canBeTogetherNow,
      whoHoldsUnion,
      mainRisk,
      longTermProspect,
      recommendation,
    },
  };
}

// ============= ОДИНОЧНЫЙ АНАЛИЗ (для Методики 8) =============

export function calculateLifeCodSingle(
  name: string,
  day: number,
  month: number,
  year: number
): LifeCodSingleAnalysis {
  const person = analyzePersonLifeCod(name, day, month, year);
  const partnerFilter = analyzePartnerFilter(person.consciousness.result, person.action.result);
  const currentReadiness = analyzeYearEntry(person.currentPersonalYear);
  
  const bestYears = person.personalYears
    .filter(py => [2, 4, 6].includes(py.personalYear))
    .map(py => py.year);
  
  return {
    person,
    partnerFilter,
    currentReadiness,
    bestYearsForRelationship: bestYears,
  };
}
