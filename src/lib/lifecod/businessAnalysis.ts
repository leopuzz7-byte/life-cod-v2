// src/lib/lifecod/businessAnalysis.ts
// Бизнес-разбор — использует существующие модули М2
// Базовый: числа Ума и Действия (бизнес-угол)
// Профессиональный: + финкод + психотип + пиннакли + план

import {
  calculateConsciousness,
  calculateAction,
} from './calculations';
import { calculateFinancialCodeLC, FinancialCodeLCModule } from './financialCodeLC';
import { calculatePsychProfile, PsychProfileModule } from './psychProfile';
import {
  calculatePinnacles,
  getActivePinnacleIndex,
  pinnacleDescriptions,
  PinnaclesAnalysis,
} from './pinnacles';
import { ConsciousnessModule, ActionsModule } from './personalAnalysis';
import { consciousnessDescriptions, actionDescriptions } from './data';

export interface BusinessBasicModule {
  consciousness: ConsciousnessModule;
  actions: ActionsModule;
  // Текущий личный год — нужен для контекста
  currentYear: number;
}

export interface BusinessProModule extends BusinessBasicModule {
  financialCode: FinancialCodeLCModule;
  psychProfile: PsychProfileModule;
  pinnacles: PinnaclesAnalysis;
  activePinnacleIndex: number;
  // Бизнес-типаж на основе числа Ума + Действия
  businessProfile: {
    type: string;
    strengths: string[];
    risks: string[];
    bestRoles: string[];
    partnerCompatibility: string;
  };
}

// Бизнес-типажи на основе числа Ума (как в keyto)
const businessTypes: Record<number, {
  type: string;
  strengths: string[];
  risks: string[];
  bestRoles: string[];
}> = {
  1: {
    type: 'Независимый лидер',
    strengths: ['Инициатива', 'Решительность', 'Самодостаточность', 'Умение вести за собой'],
    risks: ['Сложно делегировать', 'Конфликты с партнёрами', 'Авторитарность'],
    bestRoles: ['Основатель компании', 'CEO', 'Предприниматель-одиночка', 'Стартап-визионер'],
  },
  2: {
    type: 'Партнёр-стратег',
    strengths: ['Дипломатия', 'Умение слушать', 'Создание альянсов', 'Интуиция в людях'],
    risks: ['Нерешительность', 'Зависимость от партнёра', 'Избегание конфликтов'],
    bestRoles: ['Сооснователь', 'Директор по партнёрствам', 'Медиатор', 'HR-директор'],
  },
  3: {
    type: 'Коммуникатор-визионер',
    strengths: ['Харизма', 'Генерация идей', 'Продажи', 'Убеждение'],
    risks: ['Непоследовательность', 'Распыление', 'Много идей — мало реализации'],
    bestRoles: ['Директор по маркетингу', 'Продакт', 'Публичный спикер', 'Бренд-амбассадор'],
  },
  4: {
    type: 'Системный строитель',
    strengths: ['Дисциплина', 'Организация процессов', 'Надёжность', 'Работа с деталями'],
    risks: ['Сопротивление переменам', 'Бюрократизм', 'Медленное принятие решений'],
    bestRoles: ['COO', 'Операционный директор', 'Project Manager', 'Финансовый директор'],
  },
  5: {
    type: 'Адаптивный исследователь',
    strengths: ['Гибкость', 'Инновационность', 'Сеть контактов', 'Умение видеть тренды'],
    risks: ['Непостоянство', 'Хаотичность', 'Трудно удержать фокус'],
    bestRoles: ['Директор по развитию', 'Growth Hacker', 'Трейдер', 'Агент изменений'],
  },
  6: {
    type: 'Ответственный лидер',
    strengths: ['Забота о команде', 'Создание атмосферы', 'Долгосрочные отношения', 'Репутация'],
    risks: ['Трудно отказывать', 'Жертвует собой ради команды', 'Перегрузка'],
    bestRoles: ['HR-директор', 'Руководитель команды', 'Сервисный бизнес', 'Образование'],
  },
  7: {
    type: 'Эксперт-аналитик',
    strengths: ['Глубокая экспертиза', 'Системное мышление', 'Высокое качество', 'Инновации'],
    risks: ['Перфекционизм', 'Трудно масштабировать', 'Закрытость от команды'],
    bestRoles: ['CTO', 'Технический эксперт', 'Консультант', 'Исследователь', 'Аналитик'],
  },
  8: {
    type: 'Магнат-управляющий',
    strengths: ['Масштаб мышления', 'Управление ресурсами', 'Власть', 'Материализация идей'],
    risks: ['Жёсткость', 'Доминирование', 'Игнорирование людей ради результата'],
    bestRoles: ['CEO крупной компании', 'Инвестор', 'Управляющий активами', 'Директор'],
  },
  9: {
    type: 'Глобальный реформатор',
    strengths: ['Глобальное мышление', 'Завершение проектов', 'Миссия', 'Широкий кругозор'],
    risks: ['Сложно начинать', 'Идеализм', 'Не всегда практичен'],
    bestRoles: ['Социальный предприниматель', 'NFP-директор', 'Международный бизнес', 'Ментор'],
  },
};

// Совместимость партнёров по числам (бизнес-угол)
function getPartnerCompatibility(consciousness: number, action: number): string {
  const sum = consciousness + action;
  const reduced = sum > 9 ? Math.floor(sum / 10) + (sum % 10) : sum;
  if (reduced <= 3) return 'Лучший партнёр — с числом 8 или 1. Нужен кто-то, кто заземлит и масштабирует.';
  if (reduced <= 6) return 'Лучший партнёр — с числом 1 или 4. Нужен лидер или системный человек.';
  return 'Лучший партнёр — с числом 2 или 6. Нужен дипломат и строитель отношений.';
}

export function calculateBusinessBasic(
  day: number, month: number, year: number
): BusinessBasicModule {
  const consciousnessResult = calculateConsciousness(day, month);
  const actionsResult = calculateAction(day, month, year);

  const consciousnessDesc = consciousnessDescriptions[consciousnessResult.result];
  const actionsDesc = actionDescriptions[actionsResult.result];

  const consciousness: ConsciousnessModule = {
    result: consciousnessResult.result,
    chain: consciousnessResult.chain,
    name: consciousnessDesc?.name ?? String(consciousnessResult.result),
    calcTrace: { input: `${day}.${month}`, steps: [], result: String(consciousnessResult.result) },
    innerState: consciousnessDesc?.innerState ?? '',
    personalLife: consciousnessDesc?.personalLife ?? '',
    influenceOnOthers: consciousnessDesc?.influenceOnOthers ?? '',
    plus: consciousnessDesc?.plus ?? [],
    minus: consciousnessDesc?.minus ?? [],
    warning: consciousnessDesc?.warning ?? '',
  };

  const actions: ActionsModule = {
    result: actionsResult.result,
    chain: actionsResult.chain,
    name: actionsDesc?.name ?? String(actionsResult.result),
    calcTrace: { input: `${day}.${month}.${year}`, steps: [], result: String(actionsResult.result) },
    chainMeaning: actionsDesc?.chainMeaning ?? '',
    plus: actionsDesc?.plus ?? [],
    minus: actionsDesc?.minus ?? [],
    love: actionsDesc?.love ?? '',
    business: actionsDesc?.business ?? '',
    redFlags: actionsDesc?.redFlags ?? [],
  };

  return {
    consciousness,
    actions,
    currentYear: new Date().getFullYear(),
  };
}

export function calculateBusinessPro(
  day: number, month: number, year: number
): BusinessProModule {
  const basic = calculateBusinessBasic(day, month, year);
  const financialCode = calculateFinancialCodeLC(day, month, year);
  const psychProfile = calculatePsychProfile(day, month, year);
  const pinnacles = calculatePinnacles(day, month, year);
  const activePinnacleIndex = getActivePinnacleIndex(pinnacles, year);

  const bType = businessTypes[basic.consciousness.result] ?? businessTypes[1];
  const businessProfile = {
    ...bType,
    partnerCompatibility: getPartnerCompatibility(
      basic.consciousness.result,
      basic.actions.result
    ),
  };

  return {
    ...basic,
    financialCode,
    psychProfile,
    pinnacles,
    activePinnacleIndex,
    businessProfile,
  };
}
