// Типы для системы Life C⚙D - 8 методик совместимости

export type RelationType = 'love' | 'business';

// Методика 1: Сознание (День + Месяц)
export interface ConsciousnessAnalysis {
  day: number;
  month: number;
  rawSum: number; // исходная сумма до редукции
  result: number; // 1-9
  chain: number[]; // цепочка энергий
}

// Методика 7: Действия (последние 2 цифры года)
export interface ActionAnalysis {
  yearLastTwoDigits: [number, number];
  intermediateSum: number;
  result: number; // 0-9
  chain: number[]; // путь действий
}

// Методика 3: Личный год (9-летний цикл)
export interface PersonalYear {
  year: number;
  personalYear: number; // 1-9
}

// Полный анализ одного человека
export interface PersonLifeCodAnalysis {
  name: string;
  birthDate: { day: number; month: number; year: number };
  consciousness: ConsciousnessAnalysis;
  action: ActionAnalysis;
  personalYears: PersonalYear[]; // текущий и +3 года
  currentPersonalYear: number;
}

// Методика 5: Стабилизатор
export type StabilizerStatus = 'STRONG' | 'OK' | 'WEAK' | 'NO';
export interface StabilizerResult {
  hasStabilizer: boolean;
  stabilizerType: '4' | '6' | '4+6' | 'none';
  stabilizerHolder: 'person1' | 'person2' | 'both' | 'none';
  score: number;
  status: StabilizerStatus;
  destabilizers: string[];
}

// Методика 4: Год входа в отношения
export type EntryStatus = 'ALLOWED' | 'CONDITIONAL' | 'NOT_RECOMMENDED';
export type EntryType = 'FAMILY' | 'FORMAL' | 'TRANSITION' | 'EXPERIMENTAL' | null;
export interface YearEntryAnalysis {
  personalYear: number;
  entryStatus: EntryStatus;
  entryType: EntryType;
  shortReason: string;
  risks: string[];
  recommendation: string;
}

export type PairEntryStatus = 'BEST' | 'OK' | 'TEMP' | 'NO';
export interface PairEntryAnalysis {
  person1Entry: YearEntryAnalysis;
  person2Entry: YearEntryAnalysis;
  pairStatus: PairEntryStatus;
  pairComment: string;
  stabilizerNeeded: boolean;
}

// Методика 6: Матрица взаимодействия
export type InteractionCategory = 'STABLE' | 'UNSTABLE' | 'CRISIS' | 'BREAKDOWN';
export interface InteractionAnalysis {
  person1Year: number;
  person2Year: number;
  category: InteractionCategory;
  loveMeaning: string;
  businessMeaning: string;
  riskLevel: number; // 0-100
  needsStabilizer: boolean;
}

// Методика 7 (прогноз): Кризисные точки
export type YearType = 'STABLE' | 'CRISIS' | 'BREAKDOWN' | 'RECOVERY' | 'NEW_UNION';
export interface YearForecastPoint {
  year: number;
  person1Year: number;
  person2Year: number;
  type: YearType;
  description: string;
  hasStabilizer: boolean;
}

// Методика 8: Подбор партнёра
export interface PartnerFilter {
  suitableConsciousness: number[];
  suitableActions: number[];
  bestMonths: number[];
  conflictMonths: number[];
  notRecommendedConsciousness: number[];
  notRecommendedActions: number[];
  reason: string;
}

// Полный результат совместимости Life C⚙D
export interface LifeCodCompatibilityResult {
  relationType: RelationType;
  person1: PersonLifeCodAnalysis;
  person2: PersonLifeCodAnalysis;
  
  // Методика 3: Совместимость сознаний
  consciousnessCompatibility: {
    status: 'COMPATIBLE' | 'TENSE' | 'CONFLICT';
    description: string;
    loveInterpretation: string;
    businessInterpretation: string;
  };
  
  // Методика 4: Год входа
  yearEntry: PairEntryAnalysis;
  
  // Методика 5: Стабилизатор
  stabilizer: StabilizerResult;
  
  // Методика 6: Текущее взаимодействие
  currentInteraction: InteractionAnalysis;
  
  // Методика 7: Прогноз на 5 лет
  forecast: YearForecastPoint[];
  
  // Общий вердикт
  overallVerdict: {
    canBeTogetherNow: boolean;
    whoHoldsUnion: 'person1' | 'person2' | 'both' | 'none';
    mainRisk: string;
    longTermProspect: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
  };
}

// Одиночный анализ (для Методики 8)
export interface LifeCodSingleAnalysis {
  person: PersonLifeCodAnalysis;
  partnerFilter: PartnerFilter;
  currentReadiness: YearEntryAnalysis;
  bestYearsForRelationship: number[];
}
