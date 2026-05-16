// Блок 6: Энергетическая карта (9 центров)
import { CalcTrace } from './personalAnalysis';

export interface EnergyCenterInfo {
  number: number;
  name: string;
  count: number;
  status: 'deficit' | 'normal' | 'strong' | 'excess';
  statusLabel: string;
  description: string;
}

export interface EnergyMapModule {
  centers: EnergyCenterInfo[];
  balance: number; // 0-100, where 100 = perfectly balanced
  balanceLabel: string;
  leaks: { number: number; desc: string }[];
  strengths: { number: number; desc: string }[];
  calcTrace: CalcTrace;
}

const centerNames: Record<number, string> = {
  1: 'Воля и Эго',
  2: 'Эмоции и Интуиция',
  3: 'Коммуникация и Творчество',
  4: 'Стабильность и Порядок',
  5: 'Свобода и Адаптация',
  6: 'Ответственность и Забота',
  7: 'Мудрость и Анализ',
  8: 'Власть и Ресурсы',
  9: 'Трансформация и Завершение',
};

const centerDescriptions: Record<number, Record<string, string>> = {
  1: { deficit: 'Слабая воля, зависимость от мнения других', normal: 'Здоровая самостоятельность', strong: 'Мощное эго, лидерство', excess: 'Эгоизм, подавление окружающих' },
  2: { deficit: 'Эмоциональная глухота, трудности с эмпатией', normal: 'Развитая эмоциональность', strong: 'Глубокая интуиция', excess: 'Сверхчувствительность, ранимость' },
  3: { deficit: 'Трудности с самовыражением', normal: 'Хорошие коммуникативные навыки', strong: 'Талант к слову и творчеству', excess: 'Болтливость, поверхностность' },
  4: { deficit: 'Хаос, отсутствие структуры', normal: 'Организованность', strong: 'Надёжность, системность', excess: 'Ригидность, контроль' },
  5: { deficit: 'Страх перемен, застревание', normal: 'Гибкость', strong: 'Высокая адаптивность', excess: 'Непостоянство, хаос' },
  6: { deficit: 'Безответственность или избегание', normal: 'Здоровая ответственность', strong: 'Преданность и забота', excess: 'Жертвенность, выгорание' },
  7: { deficit: 'Поверхностность мышления', normal: 'Аналитический ум', strong: 'Глубокое понимание', excess: 'Закрытость, паранойя' },
  8: { deficit: 'Проблемы с деньгами', normal: 'Здоровое отношение к ресурсам', strong: 'Управленческий талант', excess: 'Жадность, давление' },
  9: { deficit: 'Неумение отпускать', normal: 'Способность завершать', strong: 'Мудрость трансформации', excess: 'Разрушительность' },
};

const leakDescriptions: Record<number, string> = {
  1: 'Утечка через неуверенность — не начинаете, не решаете',
  2: 'Утечка через эмоции — тратите энергию на переживания',
  3: 'Утечка через пустое общение — много слов, мало дела',
  4: 'Утечка через хаос — нет системы, энергия рассеивается',
  5: 'Утечка через непостоянство — не можете сфокусироваться',
  6: 'Утечка через других — отдаёте всё, не получаете ничего',
  7: 'Утечка через изоляцию — закрываетесь от мира',
  8: 'Утечка через борьбу — боретесь вместо того, чтобы строить',
  9: 'Утечка через прошлое — держитесь за то, что пора отпустить',
};

const strengthDescriptions: Record<number, string> = {
  1: 'Сила личности — природное лидерство и воля',
  2: 'Сила чувствования — развитая интуиция и эмпатия',
  3: 'Сила слова — влияние через коммуникацию',
  4: 'Сила порядка — способность создавать систему',
  5: 'Сила адаптации — гибкость в любой ситуации',
  6: 'Сила заботы — притягивает людей надёжностью',
  7: 'Сила ума — глубокий анализ и понимание',
  8: 'Сила управления — талант к масштабным проектам',
  9: 'Сила мудрости — видение полной картины',
};

export function calculateEnergyMap(digitPresence: Record<number, number>): EnergyMapModule {
  const centers: EnergyCenterInfo[] = [];
  const leaks: { number: number; desc: string }[] = [];
  const strengths: { number: number; desc: string }[] = [];

  for (let i = 1; i <= 9; i++) {
    const count = digitPresence[i] || 0;
    let status: EnergyCenterInfo['status'];
    let statusLabel: string;

    if (count === 0) {
      status = 'deficit'; statusLabel = 'Дефицит';
      leaks.push({ number: i, desc: leakDescriptions[i] || '' });
    } else if (count === 1) {
      status = 'normal'; statusLabel = 'Норма';
    } else if (count === 2) {
      status = 'strong'; statusLabel = 'Сильная';
      strengths.push({ number: i, desc: strengthDescriptions[i] || '' });
    } else {
      status = 'excess'; statusLabel = 'Избыток';
      strengths.push({ number: i, desc: strengthDescriptions[i] || '' });
    }

    const descriptions = centerDescriptions[i] || {};
    centers.push({
      number: i, name: centerNames[i] || `Центр ${i}`,
      count, status, statusLabel,
      description: descriptions[status] || '',
    });
  }

  // Balance: how evenly distributed (lower std dev = better balance)
  const counts = centers.map(c => c.count);
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  const variance = counts.reduce((s, c) => s + Math.pow(c - mean, 2), 0) / counts.length;
  const stdDev = Math.sqrt(variance);
  // Map: stdDev 0 = 100, stdDev 2+ = 0
  const balance = Math.max(0, Math.min(100, Math.round(100 - stdDev * 50)));

  let balanceLabel: string;
  if (balance >= 75) balanceLabel = 'Гармоничный';
  else if (balance >= 50) balanceLabel = 'Умеренный';
  else if (balance >= 25) balanceLabel = 'Несбалансированный';
  else balanceLabel = 'Критический дисбаланс';

  return {
    centers, balance, balanceLabel, leaks, strengths,
    calcTrace: {
      input: `Присутствие чисел: ${Object.entries(digitPresence).map(([n, c]) => `${n}×${c}`).join(', ')}`,
      steps: [
        `Баланс: σ=${stdDev.toFixed(2)} → ${balance}%`,
        `Дефициты: ${leaks.length > 0 ? leaks.map(l => l.number).join(', ') : 'нет'}`,
        `Сильные: ${strengths.length > 0 ? strengths.map(s => s.number).join(', ') : 'нет'}`,
      ],
      result: `Баланс: ${balance}% (${balanceLabel})`,
    },
  };
}
