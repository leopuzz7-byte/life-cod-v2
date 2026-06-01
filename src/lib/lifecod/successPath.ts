// src/lib/lifecod/successPath.ts
// Путь к успеху — только профессиональный
// Использует: пиннакли, личные годы, психопрофиль, финкод

import { calculatePinnacles, getActivePinnacleIndex, pinnacleDescriptions, PinnaclesAnalysis } from './pinnacles';
import { calculatePsychProfile, PsychProfileModule } from './psychProfile';
import { calculateFinancialCodeLC, FinancialCodeLCModule } from './financialCodeLC';
import { calculateConsciousness, calculateAction, calculatePersonalYear, getPersonalYears } from './calculations';
import { personalYearDescriptions, consciousnessDescriptions, actionDescriptions } from './data';

export interface SuccessYearForecast {
  year: number;
  personalYear: number;
  name: string;
  forBusiness: string;
  isOpportunity: boolean; // лучшее время для старта
  isRisk: boolean;        // год испытаний
}

export interface SuccessPathModule {
  // Личный код
  consciousnessNumber: number;
  consciousnessName: string;
  actionNumber: number;
  actionName: string;

  // Бизнес-типаж (кратко)
  businessType: string;
  coreStrengths: string[];
  coreRisks: string[];

  // Текущий момент
  currentPersonalYear: number;
  currentPersonalYearName: string;
  currentPersonalYearBusiness: string;
  isCurrentYearOpportunity: boolean;

  // Финансовый канал
  financialChannel: number;
  financialChannelName: string;
  financialChannelDesc: string;
  bestSpheres: string[];

  // Пиннакли — периоды жизни
  pinnacles: PinnaclesAnalysis;
  activePinnacleIndex: number;
  currentPinnacleName: string;
  currentPinnacleEssence: string;
  currentPinnacleBusinessTip: string;

  // Прогноз на 3 года
  nextThreeYears: SuccessYearForecast[];

  // Стратегия прямо сейчас
  strategyNow: string[];
  strategyAvoid: string[];
}

// Бизнес-советы по личному году
const yearBusinessAdvice: Record<number, { forBusiness: string; isOpportunity: boolean; isRisk: boolean }> = {
  1: { forBusiness: 'Лучший год для запуска новых проектов и бизнесов. Начинайте всё новое.', isOpportunity: true, isRisk: false },
  2: { forBusiness: 'Год партнёрств и переговоров. Заключайте сделки, ищите союзников.', isOpportunity: false, isRisk: false },
  3: { forBusiness: 'Год коммуникации и продвижения. Активно продавайте себя и продукт.', isOpportunity: false, isRisk: false },
  4: { forBusiness: 'Год систематизации. Выстраивайте процессы, нанимайте команду, создавайте базу.', isOpportunity: false, isRisk: false },
  5: { forBusiness: 'Год перемен и расширения. Выходите на новые рынки, меняйте стратегию.', isOpportunity: false, isRisk: false },
  6: { forBusiness: 'Год репутации и команды. Инвестируйте в людей и долгосрочные отношения.', isOpportunity: false, isRisk: false },
  7: { forBusiness: 'Год анализа и экспертизы. Исследуйте, обучайтесь, планируйте следующий цикл.', isOpportunity: false, isRisk: true },
  8: { forBusiness: 'Год денег и масштаба. Самый сильный год для роста прибыли и расширения.', isOpportunity: true, isRisk: false },
  9: { forBusiness: 'Год завершений. Закрывайте неработающее, готовьтесь к новому циклу.', isOpportunity: false, isRisk: true },
};

// Бизнес-советы по пиннаклю
const pinnacleBusiness: Record<number, string> = {
  1: 'Сейчас ваш период независимости — время для личных инициатив и лидерских решений.',
  2: 'Период партнёрств — ищите надёжных союзников, не действуйте в одиночку.',
  3: 'Период самовыражения — продвигайте себя, создавайте контент, выступайте публично.',
  4: 'Период строительства — закладывайте фундамент бизнеса, выстраивайте системы.',
  5: 'Период перемен — будьте гибкими, используйте неожиданные возможности.',
  6: 'Период ответственности — берите на себя важные роли, инвестируйте в команду.',
  7: 'Период мудрости — углубляйтесь в экспертизу, работайте качеством, не количеством.',
  8: 'Период силы и достижений — максимальный потенциал для финансового роста.',
  9: 'Период завершения цикла — закрывайте старое, освобождайте место для нового.',
};

// Стратегии по личному году
const strategyByYear: Record<number, { now: string[]; avoid: string[] }> = {
  1: {
    now: ['Запустите то, что откладывали', 'Заявите о себе публично', 'Примите решение о новом направлении'],
    avoid: ['Цепляться за старое', 'Ждать идеального момента', 'Работать в одиночку без команды'],
  },
  2: {
    now: ['Найдите бизнес-партнёра', 'Заключите важные договоры', 'Укрепляйте деловые связи'],
    avoid: ['Принимать решения единолично по крупным вопросам', 'Игнорировать детали контрактов'],
  },
  3: {
    now: ['Активно продвигайтесь в соцсетях', 'Выступайте на мероприятиях', 'Запускайте рекламу'],
    avoid: ['Прятаться за кулисами', 'Откладывать публичность', 'Работать без маркетинга'],
  },
  4: {
    now: ['Систематизируйте бизнес-процессы', 'Наймите ключевых людей', 'Выстройте финансовый учёт'],
    avoid: ['Резкие перемены без плана', 'Распыляться на новые направления'],
  },
  5: {
    now: ['Выйдите на новый рынок', 'Попробуйте новый формат продукта', 'Расширьте географию'],
    avoid: ['Держаться за устаревшие модели', 'Бояться экспериментировать'],
  },
  6: {
    now: ['Вложите в обучение команды', 'Улучшите сервис и репутацию', 'Создайте долгосрочные партнёрства'],
    avoid: ['Жертвовать качеством ради скорости', 'Игнорировать потребности клиентов'],
  },
  7: {
    now: ['Проведите аудит бизнеса', 'Углубитесь в обучение', 'Планируйте следующие 3 года'],
    avoid: ['Запускать крупные проекты', 'Активно расширяться', 'Принимать поспешные решения'],
  },
  8: {
    now: ['Масштабируйте то, что работает', 'Поднимите цены', 'Привлекайте инвестиции'],
    avoid: ['Останавливаться на достигнутом', 'Тратить больше, чем зарабатываете'],
  },
  9: {
    now: ['Закройте неприбыльные направления', 'Отпустите токсичных клиентов', 'Подведите итоги'],
    avoid: ['Запускать новые большие проекты', 'Тратить ресурсы на умирающее'],
  },
};

export function calculateSuccessPath(
  day: number, month: number, year: number
): SuccessPathModule {
  const currentYear = new Date().getFullYear();

  const consciousnessResult = calculateConsciousness(day, month);
  const actionsResult = calculateAction(day, month, year);
  const financialCode = calculateFinancialCodeLC(day, month, year);
  const pinnacles = calculatePinnacles(day, month, year);
  const activePinnacleIndex = getActivePinnacleIndex(pinnacles, currentYear);

  const consciousnessDesc = consciousnessDescriptions[consciousnessResult.result];
  const actionsDesc = actionDescriptions[actionsResult.result];

  const currentPY = calculatePersonalYear(day, month, currentYear);
  const yearAdvice = yearBusinessAdvice[currentPY] ?? yearBusinessAdvice[1];
  const pinnacleDesc = pinnacleDescriptions[pinnacles.pinnacles[activePinnacleIndex]?.value ?? 1];

  // Прогноз на 3 года
  const nextThreeYears: SuccessYearForecast[] = [0, 1, 2].map(offset => {
    const y = currentYear + offset;
    const py = calculatePersonalYear(day, month, y);
    const adv = yearBusinessAdvice[py] ?? yearBusinessAdvice[1];
    const pyDesc = personalYearDescriptions[py];
    return {
      year: y,
      personalYear: py,
      name: pyDesc?.name ?? String(py),
      forBusiness: adv.forBusiness,
      isOpportunity: adv.isOpportunity,
      isRisk: adv.isRisk,
    };
  });

  const strategy = strategyByYear[currentPY] ?? strategyByYear[1];

  // Бизнес-типаж из числа Ума
  const businessTypesMap: Record<number, { type: string; strengths: string[]; risks: string[] }> = {
    1: { type: 'Независимый лидер', strengths: ['Инициатива', 'Решительность', 'Самодостаточность'], risks: ['Сложно делегировать', 'Конфликты с партнёрами'] },
    2: { type: 'Партнёр-стратег', strengths: ['Дипломатия', 'Создание альянсов', 'Интуиция'], risks: ['Нерешительность', 'Зависимость от партнёра'] },
    3: { type: 'Коммуникатор-визионер', strengths: ['Харизма', 'Генерация идей', 'Убеждение'], risks: ['Распыление', 'Много идей — мало реализации'] },
    4: { type: 'Системный строитель', strengths: ['Дисциплина', 'Организация', 'Надёжность'], risks: ['Сопротивление переменам', 'Медленное принятие решений'] },
    5: { type: 'Адаптивный исследователь', strengths: ['Гибкость', 'Инновационность', 'Сеть контактов'], risks: ['Непостоянство', 'Трудно удержать фокус'] },
    6: { type: 'Ответственный лидер', strengths: ['Забота о команде', 'Репутация', 'Долгосрочные отношения'], risks: ['Трудно отказывать', 'Перегрузка'] },
    7: { type: 'Эксперт-аналитик', strengths: ['Глубокая экспертиза', 'Системное мышление', 'Высокое качество'], risks: ['Перфекционизм', 'Закрытость'] },
    8: { type: 'Магнат-управляющий', strengths: ['Масштаб мышления', 'Управление ресурсами', 'Материализация'], risks: ['Жёсткость', 'Игнорирование людей'] },
    9: { type: 'Глобальный реформатор', strengths: ['Глобальное мышление', 'Завершение проектов', 'Миссия'], risks: ['Сложно начинать', 'Идеализм'] },
  };
  const bt = businessTypesMap[consciousnessResult.result] ?? businessTypesMap[1];

  return {
    consciousnessNumber: consciousnessResult.result,
    consciousnessName: consciousnessDesc?.name ?? String(consciousnessResult.result),
    actionNumber: actionsResult.result,
    actionName: actionsDesc?.name ?? String(actionsResult.result),
    businessType: bt.type,
    coreStrengths: bt.strengths,
    coreRisks: bt.risks,
    currentPersonalYear: currentPY,
    currentPersonalYearName: personalYearDescriptions[currentPY]?.name ?? String(currentPY),
    currentPersonalYearBusiness: yearAdvice.forBusiness,
    isCurrentYearOpportunity: yearAdvice.isOpportunity,
    financialChannel: financialCode.channelNumber,
    financialChannelName: financialCode.channelName,
    financialChannelDesc: financialCode.channelDesc,
    bestSpheres: financialCode.spheres,
    pinnacles,
    activePinnacleIndex,
    currentPinnacleName: pinnacleDesc?.name ?? '',
    currentPinnacleEssence: pinnacleDesc?.essence ?? '',
    currentPinnacleBusinessTip: pinnacleBusiness[pinnacles.pinnacles[activePinnacleIndex]?.value ?? 1] ?? '',
    nextThreeYears,
    strategyNow: strategy.now,
    strategyAvoid: strategy.avoid,
  };
}
