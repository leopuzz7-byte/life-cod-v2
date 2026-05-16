// PDF экспорт для Life C⚙D — Basic + Full

import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { LifeCodCompatibilityResult, PersonLifeCodAnalysis } from "./types";
import { consciousnessDescriptions, actionDescriptions, personalYearDescriptions } from "./data";
import { calculatePinnacles, getIntegratedYearAnalysis, pinnacleDescriptions, challengeDescriptions } from "./pinnacles";
import { calculateMonthlyForecast } from "./monthlyForecast";
import { calculatePersonalYear } from "./calculations";
import { getPairYearLink, getPairYearRatingLabel } from "./pairYearLinks";

// ============= PERSONAL PDF =============

export async function generateLifeCodPersonalPDF(
  name: string, day: number, month: number, year: number,
  mode: 'basic' | 'full' = 'basic'
) {
  const { analyzePersonLifeCod } = await import("./calculations");
  const person = analyzePersonLifeCod(name, day, month, year);
  const pinnacles = calculatePinnacles(day, month, year);
  const monthly = calculateMonthlyForecast(day);
  const currentYear = new Date().getFullYear();

  const consData = consciousnessDescriptions[person.consciousness.result];
  const actData = actionDescriptions[person.action.result];
  const yearData = personalYearDescriptions[person.currentPersonalYear];

  const sections = [];

  // Overview
  sections.push({
    title: `Сознание: ${person.consciousness.result} — ${consData?.name || ''}`,
    content: [
      consData?.core || '',
      `В плюсе: ${consData?.inPlus || ''}`,
      `В минусе: ${consData?.inMinus || ''}`,
      `Цепочка: ${person.consciousness.chain.join(' → ')}`,
    ],
    highlight: true,
  });

  sections.push({
    title: `Действия: ${person.action.result} — ${actData?.name || ''}`,
    content: [
      actData?.core || '',
      `В плюсе: ${actData?.inPlus || ''}`,
      `В минусе: ${actData?.inMinus || ''}`,
      `Цепочка: ${person.action.chain.join(' → ')}`,
    ],
  });

  sections.push({
    title: `Личный год ${currentYear}: ${person.currentPersonalYear} — ${yearData?.name || ''}`,
    content: [
      yearData?.theme || '',
      `Для отношений: ${yearData?.forRelationships || ''}`,
    ],
  });

  // Monthly summary
  const riskNames = monthly.riskMonths.map(m => monthly.months[m - 1]?.monthName).join(', ');
  const resNames = monthly.resourceMonths.map(m => monthly.months[m - 1]?.monthName).join(', ');
  
  sections.push({
    title: 'Карта года по месяцам',
    content: [
      `🔴 Рискованные: ${riskNames || '—'}`,
      `🟢 Ресурсные: ${resNames || '—'}`,
    ],
    highlight: true,
  });

  if (mode === 'full') {
    // Pinnacles
    pinnacles.pinnacles.forEach((p, i) => {
      const desc = pinnacleDescriptions[p.value];
      sections.push({
        title: `Пиннакль P${i + 1} = ${p.value} (${p.startAge}–${p.endAge ?? '∞'} лет, ${p.startYear}–${p.endYear ?? '...'})`,
        content: [
          desc?.name || '',
          desc?.essence || '',
          `Любовь (+): ${desc?.lovePlus?.join('; ') || ''}`,
          `Любовь (−): ${desc?.loveMinus?.join('; ') || ''}`,
          `Бизнес (+): ${desc?.businessPlus?.join('; ') || ''}`,
          `Бизнес (−): ${desc?.businessMinus?.join('; ') || ''}`,
        ],
      });
    });

    // Challenges
    pinnacles.challenges.forEach((c, i) => {
      const desc = challengeDescriptions[c.value];
      const labels = ['Первичный конфликт', 'Конфликт реализации', 'Главный урок', 'Финальный урок'];
      sections.push({
        title: `Challenge C${i + 1} = ${c.value} — ${labels[i]}`,
        content: [
          desc?.name || '',
          desc?.essence || '',
          `В плюсе: ${desc?.inPlus?.join('; ') || ''}`,
          `В минусе: ${desc?.inMinus?.join('; ') || ''}`,
        ],
      });
    });

    // Full monthly
    monthly.months.forEach(m => {
      const riskLabel = { resource: 'Ресурсный', neutral: 'Нейтральный', risk: 'Повышенный риск' }[m.riskLevel];
      sections.push({
        title: `${m.monthName} — ${riskLabel}`,
        content: [
          `Энергии: ${m.activeDigits.join(' + ')}`,
          '',
          'В плюсе:',
          ...m.plus.map(s => `• ${s}`),
          '',
          'В минусе:',
          ...m.minus.map(s => `• ${s}`),
          '',
          `Рекомендация: ${m.recommendation}`,
          ...(m.redFlags?.length ? ['', '⚠ Красные флаги:', ...m.redFlags.map(f => `• ${f}`)] : []),
        ],
      });
    });

    // Integrated years
    for (let i = 0; i < 4; i++) {
      const ty = currentYear + i;
      const py = calculatePersonalYear(day, month, ty);
      const iy = getIntegratedYearAnalysis(pinnacles.pinnacles, pinnacles.challenges, year, ty, py);
      sections.push({
        title: `Прогноз ${iy.year} — ${iy.crisisLevel.label}`,
        content: [
          `Личный год: ${iy.personalYear}`,
          `Пиннакль: ${iy.activePinnacle.value}, Challenge: ${iy.activeChallenge.value}`,
          iy.crisisLevel.description,
          iy.recommendation,
        ],
      });
    }
  }

  await generatePDF({
    title: mode === 'full' ? 'Полный персональный разбор' : 'Персональный разбор (базовый)',
    subtitle: 'Life C⚙D',
    name,
    birthDate: formatBirthDateForPDF(day, month, year),
    sections,
  });
}

// ============= COMPATIBILITY PDF =============

export async function generateLifeCodCompatibilityPDF(
  result: LifeCodCompatibilityResult,
  mode: 'basic' | 'full' = 'basic'
) {
  const sections = [];
  const p1 = result.person1;
  const p2 = result.person2;

  // Verdict
  const verdictLabel = result.overallVerdict.longTermProspect === 'HIGH' ? 'Высокие'
    : result.overallVerdict.longTermProspect === 'MEDIUM' ? 'Средние' : 'Низкие';
  
  sections.push({
    title: 'Общий вердикт',
    content: [
      `Можно ли быть вместе сейчас: ${result.overallVerdict.canBeTogetherNow ? 'Да' : 'Нет'}`,
      `Долгосрочные перспективы: ${verdictLabel}`,
      `Главный риск: ${result.overallVerdict.mainRisk}`,
      `Рекомендация: ${result.overallVerdict.recommendation}`,
    ],
    highlight: true,
  });

  // Person summaries
  [p1, p2].forEach(p => {
    const cons = consciousnessDescriptions[p.consciousness.result];
    const act = actionDescriptions[p.action.result];
    sections.push({
      title: `${p.name} (${p.birthDate.day}.${String(p.birthDate.month).padStart(2, '0')}.${p.birthDate.year})`,
      content: [
        `Сознание: ${p.consciousness.result} — ${cons?.name || ''} (${cons?.core || ''})`,
        `Действия: ${p.action.result} — ${act?.name || ''} (${act?.core || ''})`,
        `Личный год: ${p.currentPersonalYear}`,
      ],
    });
  });

  // Consciousness compatibility
  sections.push({
    title: 'Совместимость сознаний',
    content: [
      `${p1.consciousness.result} (${p1.name}) ↔ ${p2.consciousness.result} (${p2.name})`,
      result.consciousnessCompatibility.description,
      result.relationType === 'love'
        ? result.consciousnessCompatibility.loveInterpretation
        : result.consciousnessCompatibility.businessInterpretation,
    ],
  });

  // Stabilizer
  const stabLabels = { STRONG: 'Сильный', OK: 'Нормальный', WEAK: 'Слабый', NO: 'Нет' };
  sections.push({
    title: 'Стабилизатор',
    content: [
      `Статус: ${stabLabels[result.stabilizer.status]}`,
      result.stabilizer.hasStabilizer
        ? `Тип: ${result.stabilizer.stabilizerType}`
        : 'Стабилизатор отсутствует',
    ],
  });

  // 81-link pair year matrix
  sections.push({
    title: 'Связка личных годов (81 матрица)',
    content: result.forecast.map(point => {
      const link = getPairYearLink(point.person1Year, point.person2Year);
      return `${point.year}: ${point.person1Year}↔${point.person2Year} — ${getPairYearRatingLabel(link.rating)} — ${link.dynamics}`;
    }),
    highlight: true,
  });

  // Forecast
  sections.push({
    title: 'Прогноз на 5 лет',
    content: result.forecast.map(point => {
      const typeLabels = { STABLE: 'Стабильный', CRISIS: 'Кризис', BREAKDOWN: 'Разрыв', RECOVERY: 'Восстановление', NEW_UNION: 'Новый союз' };
      return `${point.year}: ${typeLabels[point.type]} — ${point.description}`;
    }),
  });

  const title = result.relationType === 'love' ? 'Совместимость (любовь)' : 'Совместимость (бизнес)';

  await generatePDF({
    title,
    subtitle: 'Life C⚙D',
    name: `${p1.name} & ${p2.name}`,
    birthDate: `${formatBirthDateForPDF(p1.birthDate.day, p1.birthDate.month, p1.birthDate.year)} & ${formatBirthDateForPDF(p2.birthDate.day, p2.birthDate.month, p2.birthDate.year)}`,
    sections,
  });
}
