// Единый расчётный движок для персонального анализа
// 10 модулей: Матрица судьбы, Пиннаклы, LY/GA/месяц/день, Финкод, Психопрофиль, Энергокарта, План

import { calculateConsciousness, calculateAction, calculatePersonalYear, getPersonalYears } from './calculations';
import { calculatePinnacles, determineCrisisLevel, getActivePinnacleIndex, pinnacleDescriptions, PinnaclesAnalysis, CrisisLevel } from './pinnacles';
import { personalYearDescriptions, consciousnessDescriptions, actionDescriptions } from './data';
import { calculateDestinyMatrix, DestinyMatrixModule } from './destinyMatrix';
import { calculateFullForecast, PersonalMonthModule, PersonalDayModule } from './personalForecast';
import { calculateFinancialCodeLC, FinancialCodeLCModule } from './financialCodeLC';
import { calculatePsychProfile, PsychProfileModule } from './psychProfile';
import { calculateEnergyMap, EnergyMapModule } from './energyMap';
import { calculateActionPlan, ActionPlanModule } from './actionPlan';
import i18n from '@/i18n';
import { getPAStrings } from './personalAnalysisI18n';

// ============= ТИПЫ =============

export interface CalcTrace {
  input: string;
  steps: string[];
  result: string;
}

export interface PersonalYearModule {
  year: number;
  personalYear: number;
  name: string;
  theme: string;
  forRelationships: string;
  forBusiness: string;
  isCrisis: boolean;
  calcTrace: CalcTrace;
}

export interface YearInActionsModule {
  value: number;
  intermediateSum: number;
  calcTrace: CalcTrace;
  behavior: string[];
  minusBehavior: string[];
  stopSignals: string[];
  whatToDo: string[];
}

export interface ConsciousnessModule {
  result: number;
  chain: number[];
  name: string;
  calcTrace: CalcTrace;
  innerState: string;
  personalLife: string;
  influenceOnOthers: string;
  plus: string[];
  minus: string[];
  warning: string;
}

export interface ActionsModule {
  result: number;
  chain: number[];
  name: string;
  calcTrace: CalcTrace;
  chainMeaning: string;
  plus: string[];
  minus: string[];
  love: string;
  business: string;
  redFlags: string[];
}

export interface PinnacleModule {
  index: number;
  value: number;
  startAge: number;
  endAge: number | null;
  startYear: number;
  endYear: number | null;
  isActive: boolean;
  isCrisis: boolean;
  name: string;
  essence: string;
  lovePlus: string[];
  loveMinus: string[];
  businessPlus: string[];
  businessMinus: string[];
  risks: string[];
  calcTrace: CalcTrace;
}

export interface SummaryNumbersModule {
  sumBase: number;
  sumFull: number;
  interpretation: string;
  intensityLevel: 'SOFT' | 'TRANSFORM' | 'PRESSURE' | 'OVERHEAT';
  intensityLabel: string;
  calcTrace: CalcTrace;
}

export type RiskScoreLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskScoreModule {
  score: number;
  level: RiskScoreLevel;
  label: string;
  factors: string[];
  recommendations: string[];
  calcTrace: CalcTrace;
}

export interface UnifiedPersonalAnalysis {
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  targetYear: number;

  // Блок 1: Матрица судьбы
  destinyMatrix: DestinyMatrixModule;

  // Модуль: Личные годы
  personalYears: PersonalYearModule[];
  currentPersonalYear: PersonalYearModule;

  // Модуль: Год в действиях
  yearInActions: YearInActionsModule;

  // Модуль: Число сознания
  consciousness: ConsciousnessModule;

  // Модуль: Число действий
  actions: ActionsModule;

  // Блок 2: Пиннакли
  pinnacles: PinnacleModule[];
  pinnaclesCalcTrace: CalcTrace;

  // Блок 3: Личный прогноз (месяц + день)
  forecastMonths: PersonalMonthModule[];
  currentMonth: PersonalMonthModule;
  today: PersonalDayModule;

  // Блок 4: Финансовый код
  financialCode: FinancialCodeLCModule;

  // Блок 5: Психопрофиль
  psychProfile: PsychProfileModule;

  // Блок 6: Энергокарта
  energyMap: EnergyMapModule;

  // План действий
  actionPlan: ActionPlanModule;

  // Суммарные числа + Risk Score
  summaryNumbers: SummaryNumbersModule;
  riskScore: RiskScoreModule;

  // Кризисный уровень текущего периода
  currentCrisisLevel: CrisisLevel;
}

// ============= УТИЛИТЫ =============

function reduceToSingle(num: number): number {
  if (num === 0) return 0;
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

function sumDigits(num: number): number {
  return String(Math.abs(num)).split('').reduce((sum, d) => sum + parseInt(d), 0);
}

function getReductionSteps(num: number): string[] {
  const steps: string[] = [];
  let current = num;
  while (current > 9) {
    const digits = String(current).split('');
    const sum = digits.reduce((s, d) => s + parseInt(d), 0);
    steps.push(`${digits.join(' + ')} = ${sum}`);
    current = sum;
  }
  return steps;
}

// ============= МОДУЛЬ 1: ЛИЧНЫЕ ГОДЫ =============

function calculatePersonalYearModule(day: number, month: number, targetYear: number): PersonalYearModule {
  // Формула: день + месяц + цифры года → редукция
  const yearDigits = String(targetYear).split('').map(Number);
  const rawSum = day + month + yearDigits.reduce((s, d) => s + d, 0);
  
  const steps: string[] = [];
  const allParts = [...String(day).split(''), ...String(month).split(''), ...yearDigits.map(String)];
  steps.push(`${day} + ${month} + ${yearDigits.join(' + ')} = ${rawSum}`);
  
  let current = rawSum;
  const reductionSteps = getReductionSteps(current);
  steps.push(...reductionSteps);
  
  const py = reduceToSingle(rawSum);
  const desc = personalYearDescriptions[py];
  const isCrisis = [7, 8, 9].includes(py);
  const L = getPAStrings(i18n.language)?.labels;

  return {
    year: targetYear,
    personalYear: py,
    name: desc?.name || (L ? L.nameYear(py) : `Год ${py}`),
    theme: desc?.theme || '',
    forRelationships: desc?.forRelationships || '',
    forBusiness: desc?.forBusiness || '',
    isCrisis,
    calcTrace: {
      input: `${L?.date ?? 'Дата'}: ${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}, ${L?.year ?? 'Год'}: ${targetYear}`,
      steps,
      result: `${L?.personalYear ?? 'Личный год'}: ${py}`,
    },
  };
}

// ============= МОДУЛЬ 2: ГОД В ДЕЙСТВИЯХ =============

function calculateYearInActionsModule(personalYear: number, birthDay: number): YearInActionsModule {
  const rawSum = personalYear + birthDay;
  const steps: string[] = [`${personalYear} + ${birthDay} = ${rawSum}`];
  const reductionSteps = getReductionSteps(rawSum);
  steps.push(...reductionSteps);
  const result = reduceToSingle(rawSum);

  // Поведенческие описания по числу действий в году
  const gaDescriptions: Record<number, { behavior: string[]; minus: string[]; stop: string[]; whatToDo: string[] }> = {
    1: {
      behavior: ['Действует самостоятельно', 'Принимает решения один', 'Фокусируется на себе'],
      minus: ['Игнорирует чужое мнение', 'Давит на окружающих'],
      stop: ['Упрямство ради принципа', 'Отказ от помощи'],
      whatToDo: ['Направить лидерство в конструктив', 'Учитывать мнение окружающих'],
    },
    2: {
      behavior: ['Ищет партнёрство', 'Договаривается', 'Действует через диалог'],
      minus: ['Зависимость от чужого мнения', 'Нерешительность'],
      stop: ['Подчинение ради мира', 'Потеря собственной позиции'],
      whatToDo: ['Сохранять свою позицию', 'Учиться говорить «нет»'],
    },
    3: {
      behavior: ['Общается, презентует', 'Создаёт связи', 'Выражает идеи'],
      minus: ['Много слов — мало дела', 'Разбрасывается'],
      stop: ['Обещания без исполнения', 'Поверхностность в действиях'],
      whatToDo: ['Фиксировать договорённости письменно', 'Завершать начатое'],
    },
    4: {
      behavior: ['Структурирует процессы', 'Строит фундамент', 'Берёт ответственность'],
      minus: ['Зажимается', 'Контролирует всё'],
      stop: ['Перфекционизм до паралича', 'Жёсткость без гибкости'],
      whatToDo: ['Делегировать', 'Позволить процессу идти без контроля'],
    },
    5: {
      behavior: ['Экспериментирует', 'Меняет подход', 'Ищет новое'],
      minus: ['Хаос в действиях', 'Незавершённость'],
      stop: ['Бегство от ответственности', 'Смена направления каждую неделю'],
      whatToDo: ['Выбрать одно направление', 'Довести до результата'],
    },
    6: {
      behavior: ['Заботится о людях', 'Берёт на себя обязательства', 'Стабилизирует'],
      minus: ['Тянет всё на себе', 'Выгорает'],
      stop: ['Жертвенность', 'Контроль через заботу'],
      whatToDo: ['Просить помощь', 'Не забывать о себе'],
    },
    7: {
      behavior: ['Анализирует', 'Пересматривает стратегию', 'Уходит в себя'],
      minus: ['Изоляция', 'Недоверие к окружающим'],
      stop: ['Паралич решений', 'Уход от контактов'],
      whatToDo: ['Не принимать резких решений', 'Практиковать осознанность'],
    },
    8: {
      behavior: ['Управляет ресурсами', 'Принимает жёсткие решения', 'Фокусируется на результате'],
      minus: ['Давление', 'Жёсткость без эмпатии'],
      stop: ['Авторитаризм', 'Подавление других ради цели'],
      whatToDo: ['Слушать обратную связь', 'Балансировать контроль и доверие'],
    },
    9: {
      behavior: ['Завершает циклы', 'Отпускает старое', 'Подводит итоги'],
      minus: ['Резкие разрывы', 'Эмоциональное выгорание'],
      stop: ['Уход без объяснений', 'Обнуление без плана'],
      whatToDo: ['Завершать мягко', 'Готовить почву для нового цикла'],
    },
  };

  const S = getPAStrings(i18n.language);
  const gaLoc = S?.ga ?? gaDescriptions;
  const desc = gaLoc[result] || gaLoc[5]!;
  const L = S?.labels;

  return {
    value: result,
    intermediateSum: rawSum,
    calcTrace: {
      input: `LY = ${personalYear}, ${L?.day ?? 'День'} = ${birthDay}`,
      steps,
      result: `${L?.yearInActions ?? 'Год в действиях'}: ${result}`,
    },
    behavior: desc.behavior,
    minusBehavior: desc.minus,
    stopSignals: desc.stop,
    whatToDo: desc.whatToDo,
  };
}

// ============= МОДУЛЬ 3: ЧИСЛО СОЗНАНИЯ (расширенное) =============

function calculateConsciousnessModule(day: number, month: number): ConsciousnessModule {
  // Расчёт с полной цепочкой
  const dayReduced = reduceToSingle(sumDigits(day));
  const monthReduced = reduceToSingle(sumDigits(month));
  const rawSum = dayReduced + monthReduced;
  const result = reduceToSingle(rawSum);

  // Цепочка: все промежуточные числа
  const chain: number[] = [];
  // Разбираем день
  if (day > 9) {
    String(day).split('').forEach(d => chain.push(parseInt(d)));
    chain.push(dayReduced);
  } else {
    chain.push(day);
  }
  // Разбираем месяц
  if (month > 9) {
    String(month).split('').forEach(d => chain.push(parseInt(d)));
    chain.push(monthReduced);
  } else {
    chain.push(month);
  }
  // Сумма и редукция
  if (rawSum > 9) {
    chain.push(rawSum);
    String(rawSum).split('').forEach(d => chain.push(parseInt(d)));
  }
  chain.push(result);
  // Уникальные значения в порядке появления
  const uniqueChain = [...new Set(chain)];

  const L = getPAStrings(i18n.language)?.labels;
  const steps: string[] = [];
  if (day > 9) steps.push(`${day} → ${String(day).split('').join('+')} = ${sumDigits(day)}${sumDigits(day) > 9 ? ' → ' + dayReduced : ''}`);
  else steps.push(`${L?.day ?? 'День'}: ${day}`);
  if (month > 9) steps.push(`${month} → ${String(month).split('').join('+')} = ${sumDigits(month)}${sumDigits(month) > 9 ? ' → ' + monthReduced : ''}`);
  else steps.push(`${L?.month ?? 'Месяц'}: ${month}`);
  steps.push(`${dayReduced} + ${monthReduced} = ${rawSum}${rawSum > 9 ? ' → ' + result : ''}`);
  steps.push(`${L?.chain ?? 'Цепочка'}: ${uniqueChain.join(' → ')}`);

  const desc = consciousnessDescriptions[result];

  return {
    result,
    chain: uniqueChain,
    name: desc?.name || (L ? L.nameConsciousness(result) : `Сознание ${result}`),
    calcTrace: {
      input: `${L?.date ?? 'Дата'}: ${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}`,
      steps,
      result: `${L?.consciousnessNumber ?? 'Число сознания'}: ${result}`,
    },
    innerState: desc?.core || '',
    personalLife: desc?.inRelationships || '',
    influenceOnOthers: desc?.inBusiness || '',
    plus: desc ? [desc.inPlus] : [],
    minus: desc ? [desc.inMinus] : [],
    warning: getConsciousnessWarning(result),
  };
}

function getConsciousnessWarning(consciousness: number): string {
  const warnings: Record<number, string> = getPAStrings(i18n.language)?.warnings ?? {
    1: 'Склонность к изоляции при неосознанном проживании',
    2: 'Риск созависимости и потери себя в партнёре',
    3: 'Риск поверхностности и нереализованных обещаний',
    4: 'Риск гиперконтроля и эмоциональной блокировки',
    5: 'Риск хаоса, распыления и незавершённых дел',
    6: 'Риск гиперответственности и жертвенного сценария',
    7: 'Риск закрытости, недоверия и эмоционального холода',
    8: 'Риск авторитаризма и давления на окружающих',
    9: 'Риск резких обрывов и саморазрушающего поведения',
  };
  return warnings[consciousness] || '';
}

// ============= МОДУЛЬ 4: ЧИСЛО ДЕЙСТВИЙ (расширенное) =============

function calculateActionsModule(year: number): ActionsModule {
  const lastTwo = year % 100;
  const digit1 = Math.floor(lastTwo / 10);
  const digit2 = lastTwo % 10;

  const chain: number[] = [digit1, digit2];
  const intermediateSum = digit1 + digit2;
  let current = intermediateSum;

  const L = getPAStrings(i18n.language)?.labels;
  const steps: string[] = [`${L?.year ?? 'Год'}: ${year}, ${i18n.language === 'en' ? 'last digits' : i18n.language === 'es' ? 'últimas cifras' : 'последние цифры'}: ${digit1} ${i18n.language === 'en' ? 'and' : i18n.language === 'es' ? 'y' : 'и'} ${digit2}`];
  steps.push(`${digit1} + ${digit2} = ${intermediateSum}`);

  if (intermediateSum > 9) {
    chain.push(intermediateSum);
    const reductionSteps = getReductionSteps(intermediateSum);
    steps.push(...reductionSteps);
    current = reduceToSingle(intermediateSum);
  }
  chain.push(current);
  const uniqueChain = [...new Set(chain)];
  steps.push(`${L?.chain ?? 'Цепочка'}: ${uniqueChain.join(' → ')}`);

  const desc = actionDescriptions[current];

  return {
    result: current,
    chain: uniqueChain,
    name: desc?.name || (L ? L.nameAction(current) : `Действие ${current}`),
    calcTrace: {
      input: `${i18n.language === 'en' ? 'Birth year' : i18n.language === 'es' ? 'Año de nacimiento' : 'Год рождения'}: ${year}`,
      steps,
      result: `${L?.actionsNumber ?? 'Число действий'}: ${current}`,
    },
    chainMeaning: L ? L.bond(uniqueChain.join('-'), desc?.core || '') : `Связка ${uniqueChain.join('-')}: ${desc?.core || ''}`,
    plus: desc ? [desc.inPlus] : [],
    minus: desc ? [desc.inMinus] : [],
    love: desc?.inRelationships || '',
    business: desc?.inBusiness || '',
    redFlags: desc?.riskScenarios || [],
  };
}

// ============= МОДУЛЬ 5: ПИННАКЛИ (расширенные) =============

function calculatePinnaclesModule(day: number, month: number, year: number): { pinnacles: PinnacleModule[]; calcTrace: CalcTrace } {
  const data = calculatePinnacles(day, month, year);
  const currentAge = new Date().getFullYear() - year;
  const activeIndex = getActivePinnacleIndex(data.pinnacles, currentAge);

  const S = getPAStrings(i18n.language);
  const L = S?.labels;

  const pinnacles: PinnacleModule[] = data.pinnacles.map((p, i) => {
    const desc = pinnacleDescriptions[p.value];
    const isActive = i === activeIndex;
    const isCrisis = desc?.isCrisis || [7, 8, 9].includes(p.value);

    return {
      index: i,
      value: p.value,
      startAge: p.startAge,
      endAge: p.endAge,
      startYear: p.startYear,
      endYear: p.endYear,
      isActive,
      isCrisis,
      name: desc?.name || (L ? L.namePinnacle(p.value) : `Пиннакль ${p.value}`),
      essence: desc?.essence || '',
      lovePlus: desc?.lovePlus || [],
      loveMinus: desc?.loveMinus || [],
      businessPlus: desc?.businessPlus || [],
      businessMinus: desc?.businessMinus || [],
      risks: isCrisis ? (S?.pinnacleCrisisRisks ?? ['Кризисный период', 'Высокая вероятность трансформации']) : [],
      calcTrace: {
        input: `P${i + 1}`,
        steps: [(data.steps as any)[`P${i + 1}`] || ''],
        result: `P${i + 1} = ${p.value}`,
      },
    };
  });

  const calcTrace: CalcTrace = {
    input: `${L?.date ?? 'Дата'}: ${day}.${String(month).padStart(2, '0')}.${year}`,
    steps: [
      `${L?.day ?? 'День'}: ${data.steps.dayCore}`,
      `${L?.month ?? 'Месяц'}: ${data.steps.monthCore}`,
      `${L?.year ?? 'Год'}: ${data.steps.yearCore}`,
      `Life Path: ${data.steps.lifePath}`,
      `P1 (DD+MM): ${data.steps.P1}`,
      `P2 (DD+YY): ${data.steps.P2}`,
      `P3 (P1+P2): ${data.steps.P3}`,
      `P4 (MM+YY): ${data.steps.P4}`,
      `${L?.p1border ?? 'Граница P1'}: ${data.steps.timing}`,
    ],
    result: `${L?.pinnacles ?? 'Пиннакли'}: ${data.pinnacles.map((p, i) => `P${i + 1}=${p.value}`).join(', ')}`,
  };

  return { pinnacles, calcTrace };
}

// ============= МОДУЛЬ 6: СУММАРНЫЕ ЧИСЛА =============

function calculateSummaryNumbers(consciousness: number, action: number, personalYear: number, pinnacleValue: number): SummaryNumbersModule {
  const sumBase = consciousness + action;
  const sumFull = sumBase + personalYear + pinnacleValue;
  const S = getPAStrings(i18n.language);
  const L = S?.labels;
  const consW = L?.consciousness ?? 'Сознание';
  const actW = L?.actions ?? 'Действия';
  const pinW = i18n.language === 'en' ? 'Pinnacle' : i18n.language === 'es' ? 'Pináculo' : 'Пиннакль';

  const steps = [
    `SUM_base = ${consW}(${consciousness}) + ${actW}(${action}) = ${sumBase}`,
    `SUM_full = SUM_base(${sumBase}) + LY(${personalYear}) + ${pinW}(${pinnacleValue}) = ${sumFull}`,
  ];

  let intensityLevel: 'SOFT' | 'TRANSFORM' | 'PRESSURE' | 'OVERHEAT';
  if (sumFull <= 12) intensityLevel = 'SOFT';
  else if (sumFull <= 18) intensityLevel = 'TRANSFORM';
  else if (sumFull <= 22) intensityLevel = 'PRESSURE';
  else intensityLevel = 'OVERHEAT';

  const ruIntensity: Record<typeof intensityLevel, { label: string; interpretation: string }> = {
    SOFT: { label: 'Мягкий', interpretation: 'Период спокойного развития. Энергии гармоничны, давление минимально.' },
    TRANSFORM: { label: 'Трансформация', interpretation: 'Период активных перемен. Старые сценарии ломаются, формируется новое.' },
    PRESSURE: { label: 'Давление', interpretation: 'Высокая нагрузка. Внешнее давление, необходимость принимать решения.' },
    OVERHEAT: { label: 'Перегрев', interpretation: 'Перегрузка системы. Необходимо снижать нагрузку, иначе — сбои и кризисы.' },
  };
  const intens = (S?.intensity ?? ruIntensity)[intensityLevel];
  const intensityLabel = intens.label;
  const interpretation = intens.interpretation;

  return {
    sumBase,
    sumFull,
    interpretation,
    intensityLevel,
    intensityLabel,
    calcTrace: {
      input: `${consW}: ${consciousness}, ${actW}: ${action}, LY: ${personalYear}, ${pinW}: ${pinnacleValue}`,
      steps,
      result: `SUM_base = ${sumBase}, SUM_full = ${sumFull} → ${intensityLabel}`,
    },
  };
}

// ============= RISK SCORE =============

function calculateRiskScore(
  personalYear: number,
  pinnacleValue: number,
  challengeValue: number,
  consciousness: number,
  action: number,
  sumFull: number
): RiskScoreModule {
  let score = 0;
  const factors: string[] = [];
  const factorScores: number[] = [];
  const recommendations: string[] = [];

  const S = getPAStrings(i18n.language);
  const F = S?.factors;
  const R = S?.recs;
  const Lb = S?.labels;
  const addFactor = (label: string, pts: number) => { factors.push(label); factorScores.push(pts); };

  // Фактор 1: Кризисные годы (7-9)
  if ([7, 8, 9].includes(personalYear)) {
    score += 25;
    addFactor(F ? F.crisisYear(personalYear) : `Кризисный личный год (${personalYear})`, 25);
    if (personalYear === 7) recommendations.push(R?.year7 ?? 'Не начинать новые проекты. Анализировать.');
    if (personalYear === 8) recommendations.push(R?.year8 ?? 'Контролировать финансы. Не давить.');
    if (personalYear === 9) recommendations.push(R?.year9 ?? 'Завершать старое. Не возвращаться в прошлое.');
  } else if ([5, 6].includes(personalYear)) {
    score += 10;
    addFactor(F ? F.tenseYear(personalYear) : `Напряжённый год (${personalYear})`, 10);
    if (personalYear === 5) recommendations.push(R?.year5 ?? 'Не бросать начатое. Довести до результата.');
    if (personalYear === 6) recommendations.push(R?.year6 ?? 'Делегировать. Не тянуть всё на себе.');
  }

  // Фактор 2: Пиннакли
  if ([7, 8, 9].includes(pinnacleValue)) {
    score += 20;
    addFactor(F ? F.crisisPinnacle(pinnacleValue) : `Кризисный пиннакль (${pinnacleValue})`, 20);
    recommendations.push(R?.crisisPinnacle ?? 'Кризисный период жизни — замедлиться, не разрушать.');
  }

  // Фактор 3: Challenges
  if ([7, 8, 9].includes(challengeValue)) {
    score += 15;
    addFactor(F ? F.hardLesson(challengeValue) : `Тяжёлый урок (Challenge = ${challengeValue})`, 15);
    recommendations.push(R?.hardLesson ?? 'Внутренний конфликт обострён — работать с психологом.');
  }

  // Фактор 4: Цепочки сознания/действий
  if ([7, 8, 9].includes(consciousness)) {
    score += 10;
    addFactor(F ? F.tenseConsciousness(consciousness) : `Напряжённое сознание (${consciousness})`, 10);
  }
  if ([7, 8, 9].includes(action)) {
    score += 10;
    addFactor(F ? F.tenseActions(action) : `Напряжённые действия (${action})`, 10);
  }

  // Фактор 5: Суммарные числа
  if (sumFull > 22) {
    score += 15;
    addFactor(F ? F.overheatSum(sumFull) : `Перегрев суммарных чисел (${sumFull})`, 15);
    recommendations.push(R?.overheat ?? 'Снизить нагрузку. Приоритизировать.');
  } else if (sumFull > 18) {
    score += 10;
    addFactor(F ? F.pressureSum(sumFull) : `Давление суммарных чисел (${sumFull})`, 10);
  }

  // Фактор 6: Комбинация кризисов
  if ([7, 8, 9].includes(personalYear) && [7, 8, 9].includes(pinnacleValue)) {
    score += 10;
    addFactor(F?.doubleCrisis ?? 'Двойной кризис: год + пиннакль', 10);
    recommendations.push(R?.doubleCrisis ?? '⚠️ Особо опасный период. Минимум изменений.');
  }

  // Ограничиваем 0-100
  score = Math.min(100, Math.max(0, score));

  let level: RiskScoreLevel;
  if (score <= 30) level = 'LOW';
  else if (score <= 60) level = 'MEDIUM';
  else level = 'HIGH';
  const ruLevels: Record<RiskScoreLevel, string> = { LOW: 'Низкий риск', MEDIUM: 'Средний риск', HIGH: 'Высокий риск' };
  const label = (S?.levels ?? ruLevels)[level];

  if (recommendations.length === 0) {
    recommendations.push(R?.favorable ?? 'Благоприятный период для развития и новых начинаний.');
  }

  const pinW = i18n.language === 'en' ? 'Pinnacle' : i18n.language === 'es' ? 'Pináculo' : 'Пиннакль';

  return {
    score,
    level,
    label,
    factors,
    recommendations,
    calcTrace: {
      input: `LY=${personalYear}, ${pinW}=${pinnacleValue}, Challenge=${challengeValue}, ${Lb?.consciousness ?? 'Сознание'}=${consciousness}, ${Lb?.actions ?? 'Действия'}=${action}, SUM=${sumFull}`,
      steps: factors.map((f, i) => `+${factorScores[i]} — ${f}`),
      result: `${Lb?.riskScore ?? 'Risk Score'}: ${score}/100 → ${label}`,
    },
  };
}

function getFactorScore(factor: string): number {
  if (factor.includes('Двойной кризис')) return 10;
  if (factor.includes('Кризисный личный год')) return 25;
  if (factor.includes('Кризисный пиннакль')) return 20;
  if (factor.includes('Тяжёлый урок')) return 15;
  if (factor.includes('Перегрев')) return 15;
  if (factor.includes('Напряжённый год')) return 10;
  if (factor.includes('Давление суммарных')) return 10;
  if (factor.includes('Напряжённое сознание')) return 10;
  if (factor.includes('Напряжённые действия')) return 10;
  return 5;
}

// ============= ГЛАВНАЯ ФУНКЦИЯ =============

export function calculateUnifiedPersonalAnalysis(
  name: string,
  day: number,
  month: number,
  year: number,
  targetYear?: number
): UnifiedPersonalAnalysis {
  const ty = targetYear || new Date().getFullYear();

  // Личные годы (текущий + 4 следующих)
  const personalYears: PersonalYearModule[] = [];
  for (let i = 0; i < 5; i++) {
    personalYears.push(calculatePersonalYearModule(day, month, ty + i));
  }
  const currentPY = personalYears[0];

  // Год в действиях
  const yearInActions = calculateYearInActionsModule(currentPY.personalYear, day);

  // Число сознания
  const consciousness = calculateConsciousnessModule(day, month);

  // Число действий
  const actions = calculateActionsModule(year);

  // Пиннакли
  const { pinnacles, calcTrace: pinnaclesCalcTrace } = calculatePinnaclesModule(day, month, year);
  const activePinnacle = pinnacles.find(p => p.isActive) || pinnacles[0];

  // Блок 1: Матрица судьбы
  const destinyMatrix = calculateDestinyMatrix(day, month, year);

  // Блок 3: Прогноз (месяцы + день)
  const forecast = calculateFullForecast(day, month, year, currentPY.personalYear, ty);

  // Блок 4: Финансовый код
  const financialCode = calculateFinancialCodeLC(day, month, year);

  // Блок 5: Психопрофиль
  const missingDigits = Object.entries(destinyMatrix.digitPresence)
    .filter(([_, c]) => c === 0).map(([n]) => parseInt(n));
  const dominantDigits = Object.entries(destinyMatrix.digitPresence)
    .filter(([_, c]) => c >= 2).map(([n]) => parseInt(n));
  const psychProfile = calculatePsychProfile(
    consciousness.result, actions.result,
    missingDigits, dominantDigits,
    pinnacles.map(p => p.value)
  );

  // Блок 6: Энергокарта
  const energyMap = calculateEnergyMap(destinyMatrix.digitPresence);

  // Суммарные числа
  const summaryNumbers = calculateSummaryNumbers(
    consciousness.result, actions.result,
    currentPY.personalYear, activePinnacle.value
  );

  // Risk Score
  const pinnaclesData = calculatePinnacles(day, month, year);
  const currentAge = ty - year;
  const activeIdx = getActivePinnacleIndex(pinnaclesData.pinnacles, currentAge);
  const activeChallenge = pinnaclesData.challenges[activeIdx];

  const riskScore = calculateRiskScore(
    currentPY.personalYear, activePinnacle.value,
    activeChallenge.value, consciousness.result,
    actions.result, summaryNumbers.sumFull
  );

  // План действий
  const actionPlan = calculateActionPlan(
    currentPY.personalYear, consciousness.result, actions.result,
    destinyMatrix.missionNumber, missingDigits, dominantDigits
  );

  // Кризисный уровень
  const currentCrisisLevel = determineCrisisLevel(
    activePinnacle.value, activeChallenge.value, currentPY.personalYear
  );

  return {
    name, birthDay: day, birthMonth: month, birthYear: year, targetYear: ty,
    destinyMatrix,
    personalYears, currentPersonalYear: currentPY,
    yearInActions, consciousness, actions,
    pinnacles, pinnaclesCalcTrace,
    forecastMonths: forecast.months, currentMonth: forecast.currentMonth, today: forecast.today,
    financialCode, psychProfile, energyMap, actionPlan,
    summaryNumbers, riskScore, currentCrisisLevel,
  };
}
