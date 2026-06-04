// Помесячный прогноз по энергии дня + месяца

import i18n from '@/i18n';
import { getMonthlySet } from './monthlyForecastI18n';

export type MonthRiskLevel = 'resource' | 'neutral' | 'risk';

export interface MonthForecastItem {
  month: number;
  monthName: string;
  activeDigits: number[];
  riskScore: number;
  riskLevel: MonthRiskLevel;
  plus: string[];
  minus: string[];
  recommendation: string;
  redFlags?: string[];
}

export interface MonthlyForecastResult {
  birthDay: number;
  dayDigits: number[];
  dayCore: number;
  isMasterDay: boolean;
  months: MonthForecastItem[];
  riskMonths: number[];
  resourceMonths: number[];
  neutralMonths: number[];
}

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

function getDigits(n: number): number[] {
  return String(n).split('').map(d => parseInt(d));
}

function getMonthDigits(month: number): number[] {
  if (month <= 9) return [month];
  return getDigits(month);
}

// Словарь плюсов/минусов по цифрам
const digitTraits: Record<number, { plus: string[]; minus: string[]; keywords: string[] }> = {
  0: { plus: ['Пауза, перезагрузка'], minus: ['Обнуление, потеря направления'], keywords: ['обнуление', 'пауза'] },
  1: { plus: ['Лидерство, инициатива, решения'], minus: ['Эго, давление, конфликтность'], keywords: ['лидерство', 'эго'] },
  2: { plus: ['Диалог, партнёрство, эмпатия'], minus: ['Обиды, зависимость, манипуляции'], keywords: ['партнёрство', 'чувствительность'] },
  3: { plus: ['Общение, презентации, креатив'], minus: ['Болтовня, распыление, обещания без дела'], keywords: ['общение', 'слово'] },
  4: { plus: ['Структура, дисциплина, порядок'], minus: ['Контроль, жадность, упрямство'], keywords: ['контроль', 'система'] },
  5: { plus: ['Движение, возможности, креатив'], minus: ['Нестабильность, импульсы, качели'], keywords: ['свобода', 'перемены'] },
  6: { plus: ['Ответственность, стабильность, семья'], minus: ['Выгорание, злопамятность, «тащу всё»'], keywords: ['забота', 'ответственность'] },
  7: { plus: ['Инсайты, переоценка, стратегия'], minus: ['Закрытость, обнуления, разрывы'], keywords: ['трансформация', 'кризис'] },
  8: { plus: ['Деньги, карьера, управление'], minus: ['Давление, контроль, ревность'], keywords: ['власть', 'деньги'] },
  9: { plus: ['Завершение, зрелость, итоги'], minus: ['Обиды, давление, резкие расставания'], keywords: ['итоги', 'завершение'] },
};

function calculateRiskScore(activeDigits: number[], isMasterDay: boolean): number {
  let score = 0;
  const counts: Record<number, number> = {};
  activeDigits.forEach(d => { counts[d] = (counts[d] || 0) + 1; });

  const has = (n: number) => counts[n] && counts[n] > 0;

  // Перегруз единиц
  if ((counts[1] || 0) >= 3) {
    score += isMasterDay ? 55 : 20;
  } else if ((counts[1] || 0) === 2) {
    score += 10;
  }

  // Триггерные цифры
  if (has(7)) score += 25;
  if (has(8)) score += 25;
  if (has(9)) score += 20;
  if (has(4)) score += 15;
  if (has(5)) score += 15;

  // Смягчающие
  if (has(2) && !has(8) && !has(4)) score -= 10;
  if (has(6) && !has(8) && !has(4)) score -= 10;
  if (has(3) && (counts[1] || 0) < 3) score -= 5;

  return Math.max(0, score);
}

function getRiskLevel(score: number): MonthRiskLevel {
  if (score < 25) return 'resource';
  if (score < 50) return 'neutral';
  return 'risk';
}

function buildMonthText(activeDigits: number[], riskLevel: MonthRiskLevel): { plus: string[]; minus: string[]; recommendation: string; redFlags?: string[] } {
  const set = getMonthlySet(i18n.language);
  const traitsD = set?.traits ?? digitTraits;
  const rf = set?.redFlags ?? { d7: 'Риск резких обнулений', d8: 'Риск давления и контроля', d9: 'Риск резких расставаний', overload1: 'Перегруз «Я», конфликтность' };
  const rc = set?.recs ?? {
    risk7: 'Не решать судьбоносное в импульсе. Месяц для «тихой пересборки».',
    risk8: 'Власть — только через правила и договор.',
    riskOverload1: 'Сон, спорт, дисциплина речи. Токсичность усиливается.',
    riskDefault: 'Замедлиться, не принимать резких решений.',
    neutral: 'Контролировать импульсы, работать по плану.',
    resource: 'Ресурсный месяц. Можно начинать новое и договариваться.',
  };

  const uniqueDigits = [...new Set(activeDigits)];
  const plus: string[] = [];
  const minus: string[] = [];
  const redFlags: string[] = [];

  uniqueDigits.forEach(d => {
    const traits = traitsD[d];
    if (traits) {
      plus.push(...traits.plus);
      minus.push(...traits.minus);
    }
  });

  // Red flags for crisis digits
  if (activeDigits.includes(7)) redFlags.push(rf.d7);
  if (activeDigits.includes(8)) redFlags.push(rf.d8);
  if (activeDigits.includes(9)) redFlags.push(rf.d9);
  const count1 = activeDigits.filter(d => d === 1).length;
  if (count1 >= 3) redFlags.push(rf.overload1);

  let recommendation = '';
  if (riskLevel === 'risk') {
    if (activeDigits.includes(7)) recommendation = rc.risk7;
    else if (activeDigits.includes(8)) recommendation = rc.risk8;
    else if (count1 >= 3) recommendation = rc.riskOverload1;
    else recommendation = rc.riskDefault;
  } else if (riskLevel === 'neutral') {
    recommendation = rc.neutral;
  } else {
    recommendation = rc.resource;
  }

  return { plus, minus, recommendation, redFlags: redFlags.length > 0 ? redFlags : undefined };
}

export function calculateMonthlyForecast(birthDay: number): MonthlyForecastResult {
  const dayDigits = getDigits(birthDay);
  const dayCore = dayDigits.reduce((a, b) => a + b, 0);
  const isMasterDay = birthDay === 11 || birthDay === 22;

  const months: MonthForecastItem[] = [];
  const monthNames = getMonthlySet(i18n.language)?.monthNames ?? MONTH_NAMES;

  for (let m = 1; m <= 12; m++) {
    const monthDigits = getMonthDigits(m);
    const activeDigits = [...dayDigits, ...monthDigits];
    const riskScore = calculateRiskScore(activeDigits, isMasterDay);
    const riskLevel = getRiskLevel(riskScore);
    const text = buildMonthText(activeDigits, riskLevel);

    months.push({
      month: m,
      monthName: monthNames[m - 1],
      activeDigits,
      riskScore,
      riskLevel,
      ...text,
    });
  }

  return {
    birthDay,
    dayDigits,
    dayCore,
    isMasterDay,
    months,
    riskMonths: months.filter(m => m.riskLevel === 'risk').map(m => m.month),
    resourceMonths: months.filter(m => m.riskLevel === 'resource').map(m => m.month),
    neutralMonths: months.filter(m => m.riskLevel === 'neutral').map(m => m.month),
  };
}
