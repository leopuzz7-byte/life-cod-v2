// Блок 1: Матрица судьбы — уникальность личности
import { CalcTrace } from './personalAnalysis';

function reduceToSingle(num: number): number {
  if (num === 0) return 0;
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
  }
  return num;
}

function sumAllDigits(num: number): number {
  return String(Math.abs(num)).split('').reduce((s, d) => s + parseInt(d), 0);
}

export interface DestinyMatrixModule {
  // Число души / сознания (день+месяц)
  soulNumber: number;
  soulName: string;
  soulDesc: string;

  // Миссия (Life Path = день+месяц+год → редукция)
  missionNumber: number;
  missionName: string;
  missionDesc: string;

  // Реализация (день → редукция)
  realizationNumber: number;
  realizationName: string;
  realizationDesc: string;

  // Итог жизни (сумма всех позиций → редукция)
  lifeOutcomeNumber: number;
  lifeOutcomeName: string;
  lifeOutcomeDesc: string;

  // Кармические задачи (отсутствующие числа 1-9)
  karmicTasks: { number: number; task: string }[];

  // Теневая энергия (дефициты)
  shadowEnergy: { number: number; desc: string }[];

  // Сильные энергии (числа с count >= 2 + мастер-числа)
  strongEnergies: { number: number; count: number; desc: string }[];

  // Полная карта присутствия чисел
  digitPresence: Record<number, number>;

  calcTrace: CalcTrace;
}

const soulDescriptions: Record<number, { name: string; desc: string }> = {
  1: { name: 'Лидер', desc: 'Самостоятельность, инициатива, потребность вести за собой' },
  2: { name: 'Дипломат', desc: 'Партнёрство, чувствительность, потребность в гармонии' },
  3: { name: 'Творец', desc: 'Самовыражение, коммуникация, потребность быть услышанным' },
  4: { name: 'Строитель', desc: 'Стабильность, порядок, потребность в структуре' },
  5: { name: 'Искатель', desc: 'Свобода, перемены, потребность в новом опыте' },
  6: { name: 'Наставник', desc: 'Забота, ответственность, потребность быть нужным' },
  7: { name: 'Аналитик', desc: 'Глубина, интроспекция, потребность понимать суть' },
  8: { name: 'Управляющий', desc: 'Власть, амбиции, потребность в материальном успехе' },
  9: { name: 'Гуманист', desc: 'Завершение, мудрость, потребность служить миру' },
};

const missionDescriptions: Record<number, { name: string; desc: string }> = {
  1: { name: 'Миссия лидерства', desc: 'Научиться действовать самостоятельно, не ждать одобрения' },
  2: { name: 'Миссия партнёрства', desc: 'Научиться сотрудничать, не теряя себя' },
  3: { name: 'Миссия самовыражения', desc: 'Научиться выражать свой внутренний мир без страха' },
  4: { name: 'Миссия порядка', desc: 'Научиться строить устойчивый фундамент в жизни' },
  5: { name: 'Миссия свободы', desc: 'Научиться управлять переменами, а не бежать от них' },
  6: { name: 'Миссия ответственности', desc: 'Научиться заботиться без жертвенности и контроля' },
  7: { name: 'Миссия мудрости', desc: 'Научиться доверять интуиции и делиться знаниями' },
  8: { name: 'Миссия силы', desc: 'Научиться использовать власть этично и ответственно' },
  9: { name: 'Миссия завершения', desc: 'Научиться отпускать и служить высшей цели' },
};

const realizationDescriptions: Record<number, { name: string; desc: string }> = {
  1: { name: 'Реализация через действие', desc: 'Ваш путь — через инициативу и самостоятельные решения' },
  2: { name: 'Реализация через связи', desc: 'Ваш путь — через партнёрства и дипломатию' },
  3: { name: 'Реализация через творчество', desc: 'Ваш путь — через слово, искусство, коммуникацию' },
  4: { name: 'Реализация через систему', desc: 'Ваш путь — через дисциплину, порядок, методичность' },
  5: { name: 'Реализация через опыт', desc: 'Ваш путь — через эксперименты и разнообразие' },
  6: { name: 'Реализация через служение', desc: 'Ваш путь — через помощь другим и наставничество' },
  7: { name: 'Реализация через знания', desc: 'Ваш путь — через исследования и глубокий анализ' },
  8: { name: 'Реализация через управление', desc: 'Ваш путь — через бизнес, финансы и власть' },
  9: { name: 'Реализация через трансформацию', desc: 'Ваш путь — через завершение циклов и мудрость' },
};

const lifeOutcomeDescriptions: Record<number, { name: string; desc: string }> = {
  1: { name: 'Итог: Независимость', desc: 'К концу жизни вы приходите к полной самодостаточности' },
  2: { name: 'Итог: Гармония', desc: 'К концу жизни вы обретаете баланс и глубокие связи' },
  3: { name: 'Итог: Наследие', desc: 'К концу жизни вы оставляете творческое наследие' },
  4: { name: 'Итог: Фундамент', desc: 'К концу жизни вы создаёте прочную базу для потомков' },
  5: { name: 'Итог: Свобода', desc: 'К концу жизни вы обретаете истинную внутреннюю свободу' },
  6: { name: 'Итог: Любовь', desc: 'К концу жизни вы познаёте безусловную любовь' },
  7: { name: 'Итог: Просветление', desc: 'К концу жизни вы обретаете глубокое понимание жизни' },
  8: { name: 'Итог: Влияние', desc: 'К концу жизни вы оставляете значимый след в мире' },
  9: { name: 'Итог: Мудрость', desc: 'К концу жизни вы становитесь источником мудрости' },
};

const karmicTaskDescriptions: Record<number, string> = {
  1: 'Урок лидерства — научиться действовать самостоятельно, преодолеть страх одиночества',
  2: 'Урок партнёрства — научиться сотрудничать без потери себя',
  3: 'Урок самовыражения — научиться говорить о себе без страха осуждения',
  4: 'Урок дисциплины — научиться создавать структуру и следовать плану',
  5: 'Урок свободы — научиться принимать перемены без паники',
  6: 'Урок ответственности — научиться заботиться без выгорания',
  7: 'Урок глубины — научиться доверять интуиции и уединению',
  8: 'Урок власти — научиться управлять ресурсами этично',
  9: 'Урок завершения — научиться отпускать прошлое',
};

const shadowDescriptions: Record<number, string> = {
  1: 'Дефицит 1: страх одиночества, зависимость от одобрения',
  2: 'Дефицит 2: трудности в отношениях, неумение слушать',
  3: 'Дефицит 3: подавленное самовыражение, страх критики',
  4: 'Дефицит 4: хаос в жизни, неспособность создать стабильность',
  5: 'Дефицит 5: страх перемен, застревание в зоне комфорта',
  6: 'Дефицит 6: избегание ответственности или гиперконтроль',
  7: 'Дефицит 7: поверхностность, неспособность к глубокому анализу',
  8: 'Дефицит 8: проблемы с деньгами и властью',
  9: 'Дефицит 9: незавершённые циклы, неумение отпускать',
};

const strongEnergyDescriptions: Record<number, string> = {
  1: 'Сильная 1: мощная воля и лидерские качества',
  2: 'Сильная 2: развитая интуиция и дипломатия',
  3: 'Сильная 3: яркий талант к коммуникации',
  4: 'Сильная 4: исключительная организованность',
  5: 'Сильная 5: высокая адаптивность и гибкость',
  6: 'Сильная 6: глубокая способность к заботе',
  7: 'Сильная 7: мощный аналитический ум',
  8: 'Сильная 8: природный талант к управлению',
  9: 'Сильная 9: глубокая мудрость и сострадание',
  11: 'Мастер-число 11: интуитивное видение и вдохновение',
  22: 'Мастер-число 22: способность воплощать великие планы',
};

export function calculateDestinyMatrix(day: number, month: number, year: number): DestinyMatrixModule {
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  
  // Soul / Consciousness
  const soulRaw = sumAllDigits(day) + sumAllDigits(month);
  const soulNumber = reduceToSingle(soulRaw);

  // Mission (Life Path)
  const missionRaw = sumAllDigits(day) + sumAllDigits(month) + sumAllDigits(year);
  const missionNumber = reduceToSingle(missionRaw);

  // Realization (from day)
  const realizationNumber = reduceToSingle(day);

  // Life Outcome (soul + mission + realization)
  const outcomeRaw = soulNumber + missionNumber + realizationNumber;
  const lifeOutcomeNumber = reduceToSingle(outcomeRaw);

  // Digit presence (1-9)
  const digitPresence: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) digitPresence[i] = 0;
  allDigits.forEach(d => { if (d >= 1 && d <= 9) digitPresence[d]++; });

  // Check for master numbers in intermediate sums
  const hasMaster11 = soulRaw === 11 || missionRaw === 11 || (day + month) === 11;
  const hasMaster22 = soulRaw === 22 || missionRaw === 22 || (day + month) === 22;

  // Karmic tasks (missing digits)
  const karmicTasks = Object.entries(digitPresence)
    .filter(([_, count]) => count === 0)
    .map(([num]) => ({ number: parseInt(num), task: karmicTaskDescriptions[parseInt(num)] || '' }));

  // Shadow energy (deficits)
  const shadowEnergy = karmicTasks.map(k => ({
    number: k.number,
    desc: shadowDescriptions[k.number] || '',
  }));

  // Strong energies
  const strongEnergies: { number: number; count: number; desc: string }[] = [];
  Object.entries(digitPresence)
    .filter(([_, count]) => count >= 2)
    .forEach(([num, count]) => {
      strongEnergies.push({ number: parseInt(num), count, desc: strongEnergyDescriptions[parseInt(num)] || '' });
    });
  if (hasMaster11) strongEnergies.push({ number: 11, count: 1, desc: strongEnergyDescriptions[11] });
  if (hasMaster22) strongEnergies.push({ number: 22, count: 1, desc: strongEnergyDescriptions[22] });

  const soul = soulDescriptions[soulNumber] || { name: `Душа ${soulNumber}`, desc: '' };
  const mission = missionDescriptions[missionNumber] || { name: `Миссия ${missionNumber}`, desc: '' };
  const realization = realizationDescriptions[realizationNumber] || { name: `Реализация ${realizationNumber}`, desc: '' };
  const outcome = lifeOutcomeDescriptions[lifeOutcomeNumber] || { name: `Итог ${lifeOutcomeNumber}`, desc: '' };

  const steps = [
    `Душа: ${day} + ${month} = ${soulRaw}${soulRaw > 9 ? ' → ' + soulNumber : ''}`,
    `Миссия: ${sumAllDigits(day)} + ${sumAllDigits(month)} + ${sumAllDigits(year)} = ${missionRaw}${missionRaw > 9 ? ' → ' + missionNumber : ''}`,
    `Реализация: ${day}${day > 9 ? ' → ' + realizationNumber : ''}`,
    `Итог: ${soulNumber} + ${missionNumber} + ${realizationNumber} = ${outcomeRaw}${outcomeRaw > 9 ? ' → ' + lifeOutcomeNumber : ''}`,
    `Присутствие: ${Object.entries(digitPresence).map(([n, c]) => `${n}×${c}`).join(', ')}`,
    `Кармические задачи: ${karmicTasks.length > 0 ? karmicTasks.map(k => k.number).join(', ') : 'нет'}`,
  ];

  return {
    soulNumber, soulName: soul.name, soulDesc: soul.desc,
    missionNumber, missionName: mission.name, missionDesc: mission.desc,
    realizationNumber, realizationName: realization.name, realizationDesc: realization.desc,
    lifeOutcomeNumber, lifeOutcomeName: outcome.name, lifeOutcomeDesc: outcome.desc,
    karmicTasks, shadowEnergy, strongEnergies, digitPresence,
    calcTrace: {
      input: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
      steps,
      result: `Душа: ${soulNumber}, Миссия: ${missionNumber}, Реализация: ${realizationNumber}, Итог: ${lifeOutcomeNumber}`,
    },
  };
}
