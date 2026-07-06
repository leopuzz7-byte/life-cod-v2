// Конфигурация всех типов разборов и их тарифов
//
// Структура (Phase 1):
//
// МЕТОДИКА 1 — 22 Аркана (Life COD / Матрица судьбы):
//   1. Предназначение      — только Pro
//   2. Совместимость       — Базовый + Pro
//   3. Прогноз на день     — только Pro
//   3. Прогноз на месяц    — только Pro
//   3. Прогноз на год      — только Pro
//   4. Род                 — только Pro
//   5. Энергия договора    — только Pro
//
// МЕТОДИКА 2 — Классическая нумерология (1-9):
//   1. Предназначение      — Базовый + Pro
//   2. Совместимость       — Базовый + Pro
//   3. Бизнес              — «Скоро будет»
//   4. Энергия договора    — только Pro
//   5. Энергия названия    — только Pro
//   6. Финансовый код      — только Pro
//   7. Прогноз             — только Pro
//   8. Путь к успеху       — «Скоро будет»

export type TierType = 'basic' | 'professional';

export interface TierConfig {
  available: boolean;
  isFree: boolean;
  label: string;
  description: string;
}

export interface AnalysisTypeConfig {
  id: string;
  methodId: string;
  title: string;
  description: string;
  icon: string;
  basic: TierConfig;
  professional: TierConfig | null;
  inputType: 'date' | 'name' | 'compatibility' | 'date-contract' | 'none';
  // К каким методикам относится: "1" = 22 Аркана, "2" = Классика
  methodologies: ('1' | '2')[];
  // Если true — кнопка показывается как «Скоро будет», расчёт не запускается
  comingSoon?: boolean;
}

// Описания того, что входит в Профессиональный разбор для каждой методики
export const proExtendedDescriptions = {
  '1': 'Методика 1 (22 Аркана): полная матрица из 12 позиций, диагональ, карма, код успеха, жизненные периоды, родовые программы, прогнозы день/месяц/год, энергия договора.',
  '2': 'Методика 2 (Классика): все 4 числа судьбы, пиннакли, личный год/месяц/день, финансовый код, психопрофиль, энергокарта, план действий, прогнозы.',
} as const;

export const analysisConfigs: AnalysisTypeConfig[] = [
  // ============= МЕТОДИКА 1 (22 Аркана) =============
  {
    id: 'purpose',
    methodId: 'purpose',
    title: 'Предназначение',
    description: 'Ваша личная матрица судьбы по 12 позициям',
    icon: 'Compass',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций матрицы, диагональ, карма, код успеха, жизненные периоды',
    },
    inputType: 'date',
    methodologies: ['1'],
  },
  {
    id: 'compatibility',
    methodId: 'compatibility',
    title: 'Совместимость',
    description: 'Анализ совместимости двух людей по дате рождения',
    icon: 'Users',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Процент совместимости, аркан союза, краткие выводы',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полный анализ: гармония, карма, сильные/слабые стороны, рекомендации',
    },
    inputType: 'compatibility',
    methodologies: ['1'],
  },
  {
    id: 'year',
    methodId: 'year',
    title: 'Прогноз на год',
    description: 'Энергия и ключевые темы вашего года',
    icon: 'CalendarDays',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Детальный прогноз, рекомендации, подходящие профессии, подводные камни',
    },
    inputType: 'date',
    methodologies: ['1'],
  },
  {
    id: 'month',
    methodId: 'month',
    title: 'Прогноз на месяц',
    description: 'Энергетический треугольник месяца',
    icon: 'Calendar',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все три энергии, влияющие арканы, детальные рекомендации',
    },
    inputType: 'date',
    methodologies: ['1', '2'],
  },
  {
    id: 'day',
    methodId: 'day',
    title: 'Прогноз на день',
    description: 'Подробный расклад энергий на конкретный день',
    icon: 'Clock',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций дня с полными описаниями',
    },
    inputType: 'date',
    methodologies: ['1', '2'],
  },
  {
    id: 'ancestral',
    methodId: 'ancestral',
    title: 'Род',
    description: 'Кармическая звезда и родовые программы',
    icon: 'Brain',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полные интерпретации всех цифр, глубокий анализ проклятий и ролей',
    },
    inputType: 'date',
    methodologies: ['1'],
  },
  {
    id: 'contract',
    methodId: 'contract',
    title: 'Энергия договора',
    description: 'Энергетический анализ даты заключения договора',
    icon: 'FileText',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 12 позиций: ресурсы, скрытые мотивы, кармический урок',
    },
    inputType: 'date',
    methodologies: ['1', '2'],
  },

  // ============= МЕТОДИКА 2 (Классическая нумерология) =============
  {
    id: 'classic-full',
    methodId: 'classic-full',
    title: 'Предназначение',
    description: '4 главных числа вашей судьбы',
    icon: 'Compass',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: 'Обзор базовой матрицы, краткий профиль',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полный отчёт: пиннакли, личный год, финкод, психопрофиль, энергокарта, план действий',
    },
    inputType: 'date',
    methodologies: ['2'],
  },
  {
    id: 'lifecod-compatibility',
    methodId: 'lifecod-compatibility',
    title: 'Совместимость',
    description: 'Анализ совместимости пары по классической нумерологии',
    icon: 'Heart',
    basic: {
      available: true,
      isFree: true,
      label: 'Базовый',
      description: '4 числа судьбы пары и Общий год, краткие описания',
    },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Полный разбор пары: 4 числа судьбы с раскладкой «состоит из», Общий год, подробные описания',
    },
    inputType: 'compatibility',
    methodologies: ['2'],
  },
  {
    id: 'business',
    methodId: 'business',
    title: 'Бизнес разбор',
    description: 'Профессиональный разбор способностей и пути реализации в деле',
    icon: 'Briefcase',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: { available: true, isFree: false, label: 'Профессиональный', description: 'Числа Ума, Действия и Реализации в бизнесе, подходящие профессии, ключевые навыки, матрица' },
    inputType: 'date',
    methodologies: ['2'],
  },
  {
    id: 'name',
    methodId: 'name',
    title: 'Энергия названия',
    description: 'Нумерологический анализ названия или имени',
    icon: 'Type',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Аркан названия, гармоничность, полная рекомендация',
    },
    inputType: 'name',
    methodologies: ['2'],
  },
  {
    id: 'finance',
    methodId: 'finance',
    title: 'Финансовый код',
    description: 'Ваш код финансового потенциала',
    icon: 'Wallet',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: {
      available: true,
      isFree: false,
      label: 'Профессиональный',
      description: 'Все 4 аркана, миссия, блоки, профессии, детальные рекомендации',
    },
    inputType: 'date',
    methodologies: ['2'],
  },
  {
    id: 'success-path',
    methodId: 'success-path',
    title: 'Путь к успеху',
    description: 'Карта пути к самореализации',
    icon: 'Sparkles',
    basic: { available: false, isFree: false, label: 'Базовый', description: '' },
    professional: { available: true, isFree: false, label: 'Профессиональный', description: 'Полная карта пути, годовые точки, шаги' },
    inputType: 'date',
    methodologies: ['2'],
  },
];

import i18n from '@/i18n';

// Возвращает перевод по ключу, либо fallback (встроенный русский), если ключ отсутствует.
function tr(key: string, fallback: string): string {
  const val = i18n.t(key);
  return val === key ? fallback : val;
}

// Локализует строки конфига через i18n. ID/структура не меняются — только тексты.
function localizeConfig(cfg: AnalysisTypeConfig): AnalysisTypeConfig {
  const base = `cfg.methods.${cfg.id}`;
  return {
    ...cfg,
    title: tr(`${base}.title`, cfg.title),
    description: tr(`${base}.desc`, cfg.description),
    basic: {
      ...cfg.basic,
      label: tr('cfg.tierBasic', cfg.basic.label),
      description: tr(`${base}.basicDesc`, cfg.basic.description),
    },
    professional: cfg.professional
      ? {
          ...cfg.professional,
          label: tr('cfg.tierPro', cfg.professional.label),
          description: tr(`${base}.proDesc`, cfg.professional.description),
        }
      : null,
  };
}

// Локализованные описания того, что входит в Профессиональный разбор
export function proExtendedDescription(methodology: '1' | '2'): string {
  return tr(`cfg.proExtended.${methodology}`, proExtendedDescriptions[methodology]);
}

export function getAnalysisConfig(id: string): AnalysisTypeConfig | undefined {
  const cfg = analysisConfigs.find(c => c.id === id);
  return cfg ? localizeConfig(cfg) : undefined;
}

// Возвращает конфиги разделов для конкретной методики в нужном порядке
export function getConfigsForMethodology(methodology: '1' | '2'): AnalysisTypeConfig[] {
  // Порядок для методики 1
  const order1 = ['purpose', 'compatibility', 'year', 'month', 'day', 'ancestral', 'contract'];
  // Порядок для методики 2
  const order2 = ['classic-full', 'lifecod-compatibility', 'business', 'contract', 'name', 'finance', 'success-path'];

  const order = methodology === '1' ? order1 : order2;
  return order
    .map(id => analysisConfigs.find(c => c.id === id && c.methodologies.includes(methodology)))
    .filter((c): c is AnalysisTypeConfig => c !== undefined)
    .map(localizeConfig);
}
