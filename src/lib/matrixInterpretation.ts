// Глубокий анализ для профессионального разбора матрицы предназначения
import { getArcana, positionDescriptions } from './arcana';
import { PersonalMatrix } from './calculations';
import i18n from '@/i18n';
import { matrixDeepOverlays, matrixTraitsOverlays, positionTitleOverlays, type DeepMeaning, type Traits } from './matrixI18n';

export interface PositionInterpretation {
  position: number;
  arcanaNumber: number;
  arcanaName: string;
  positionTitle: string;
  lifeManifestations: string;
  strengths: string[];
  weaknesses: string[];
  whereEarns: string;
  whereLoses: string;
  recommendations: string[];
}

export interface CrossPositionLink {
  positions: [number, number];
  title: string;
  description: string;
  type: 'conflict' | 'synergy' | 'neutral';
}

export interface MatrixSummary {
  overallProfile: string;
  keyProblems: string[];
  growthPoints: string[];
  strategicRecommendations: string[];
}

// Глубокие трактовки по позициям — расширенная информация для каждой позиции
const positionDeepMeanings: Record<number, {
  lifeContext: string;
  earnContext: string;
  loseContext: string;
}> = {
  1: {
    lifeContext: "Эта энергия задаёт фон всего детства и юности. Она определяет, как человек воспринимал мир в раннем возрасте, какие установки были заложены, какие травмы или ресурсы сформировались.",
    earnContext: "Использование детских паттернов как ресурса: навыки адаптации, ранняя самостоятельность, умение находить выход из сложных ситуаций.",
    loseContext: "Застревание в детских сценариях, воспроизведение родительских ошибок, инфантильность в принятии решений.",
  },
  2: {
    lifeContext: "Внутренняя суть — это ядро личности, которое не меняется с возрастом. Это то, как человек чувствует себя наедине с собой, его глубинная мотивация и ценности.",
    earnContext: "Принятие себя таким, какой есть. Использование внутренних качеств как основы для профессионального и личного роста.",
    loseContext: "Игнорирование своей природы, попытки быть кем-то другим, внутренний конфликт между «хочу» и «надо».",
  },
  3: {
    lifeContext: "Социальная реализация — как человек проявляет себя в обществе. Эта энергия активируется при взаимодействии с другими людьми и определяет стиль коммуникации и самопрезентации.",
    earnContext: "Развитие социальных навыков, нетворкинг, умение продавать свои идеи и таланты. Публичная деятельность.",
    loseContext: "Социальная тревожность, неумение продвигать себя, зависимость от чужого мнения, токсичное окружение.",
  },
  4: {
    lifeContext: "Цель накопления мудрости — это вектор долгосрочного развития. К 50 годам эта энергия становится ведущей и определяет, чему человек посвятит зрелые годы.",
    earnContext: "Стратегическое мышление, наставничество, передача опыта. Долгосрочные инвестиции в образование и развитие.",
    loseContext: "Отказ от развития после определённого возраста, ригидность мышления, неготовность к переменам.",
  },
  5: {
    lifeContext: "Профессиональная ориентация указывает на сферу, в которой человек может достичь максимальных результатов. Это не конкретная профессия, а тип деятельности.",
    earnContext: "Следование своему профессиональному призванию, выбор работы по душе, монетизация талантов.",
    loseContext: "Работа не по призванию, погоня за деньгами в ущерб самореализации, профессиональное выгорание.",
  },
  6: {
    lifeContext: "Точка опоры — это зона наибольшего комфорта и одновременно ловушка. Здесь человеку легче всего, но именно от этого паттерна нужно постепенно отходить.",
    earnContext: "Использование накопленного опыта как трамплина для нового. Способность опираться на проверенное, но двигаться дальше.",
    loseContext: "Зацикленность на привычном, страх нового, застой в зоне комфорта, отказ от роста.",
  },
  7: {
    lifeContext: "Цель жизни — главный ориентир, который включается к 35 годам. Именно к этой энергии человек движется всю жизнь, осознанно или нет.",
    earnContext: "Осознанное движение к цели, постановка амбициозных задач, выход за рамки привычного.",
    loseContext: "Игнорирование своего предназначения, жизнь «на автопилоте», отсутствие смысла и направления.",
  },
  8: {
    lifeContext: "Инструмент достижения цели — конкретный метод или энергия, через которую реализуется цель жизни из позиции 7.",
    earnContext: "Целенаправленное развитие навыков, связанных с этой энергией. Это «как» вы достигаете своего «зачем».",
    loseContext: "Использование неподходящих методов, копирование чужих стратегий, игнорирование своих уникальных инструментов.",
  },
  9: {
    lifeContext: "Зона комфорта — состояние максимального расслабления и ресурса. Это энергия, к которой человек возвращается для восстановления.",
    earnContext: "Осознанное использование ресурсного состояния для восстановления и подзарядки. Баланс между активностью и отдыхом.",
    loseContext: "Уход в комфорт как способ избежать реальности, лень, прокрастинация, застой.",
  },
  10: {
    lifeContext: "Невыполненные кармические задачи — это то, что «досталось» из прошлого. Энергии, которые требуют проработки и трансформации в этой жизни.",
    earnContext: "Осознание и принятие кармических задач. Превращение слабых мест в точки силы через осознанную работу.",
    loseContext: "Игнорирование повторяющихся проблем, обвинение обстоятельств, отказ от внутренней работы.",
  },
  11: {
    lifeContext: "Ошибки прошлого — паттерны, которые повторяются, пока не будут осознаны. Это автоматические реакции и сценарии, работающие «по умолчанию».",
    earnContext: "Распознавание и трансформация деструктивных паттернов. Осознанный выбор вместо автоматических реакций.",
    loseContext: "Повторение одних и тех же ошибок, «наступание на те же грабли», нежелание меняться.",
  },
  12: {
    lifeContext: "Главная кармическая задача — единственная ключевая задача всей жизни. Если она решена, остальные кармические узлы развязываются автоматически.",
    earnContext: "Фокус на решении главной задачи. Это ключ ко всему: когда эта задача решена, жизнь меняется кардинально.",
    loseContext: "Распыление на второстепенное, избегание ключевого вызова, подмена главного суетой.",
  },
};

// Расширенные характеристики аркана (сильные/слабые стороны)
const arcanaTraits: Record<number, { strengths: string[]; weaknesses: string[]; recommendations: string[] }> = {
  1: {
    strengths: ["Ораторский талант", "Находчивость", "Способность начинать с нуля", "Разносторонность", "Дар убеждения"],
    weaknesses: ["Поверхностность", "Разбросанность", "Незавершённость дел", "Манипулятивность"],
    recommendations: ["Выберите одно главное направление и углубляйтесь", "Развивайте речь и письмо", "Начинайте действовать, не дожидаясь идеальных условий"],
  },
  2: {
    strengths: ["Сильная интуиция", "Эмпатия", "Мудрость", "Терпение", "Энергетическая чувствительность"],
    weaknesses: ["Нерешительность", "Пассивность", "Уход в иллюзии", "Зависимость от чужого мнения"],
    recommendations: ["Доверяйте интуиции, но проверяйте факты", "Развивайте самостоятельность в принятии решений", "Практикуйте медитацию"],
  },
  3: {
    strengths: ["Умение зарабатывать", "Творческий подход", "Привлекательность", "Практичность", "Хозяйственность"],
    weaknesses: ["Материализм", "Зацикленность на внешности", "Ревность", "Расточительность"],
    recommendations: ["Создавайте красоту вокруг себя", "Инвестируйте в комфорт, но не в роскошь ради статуса", "Развивайте материнские/отцовские качества"],
  },
  4: {
    strengths: ["Лидерство", "Организаторские способности", "Ответственность", "Системное мышление", "Целеустремлённость"],
    weaknesses: ["Авторитарность", "Чрезмерный контроль", "Жёсткость", "Неумение расслабляться"],
    recommendations: ["Учитесь делегировать", "Развивайте гибкость", "Баланс между контролем и доверием"],
  },
  5: {
    strengths: ["Мудрость", "Нравственность", "Умение учить", "Глубокие знания", "Следование традициям"],
    weaknesses: ["Морализаторство", "Догматизм", "Негибкость", "Осуждение других"],
    recommendations: ["Делитесь знаниями без навязывания", "Будьте открыты новому", "Учитесь у своих учеников"],
  },
  6: {
    strengths: ["Обаяние", "Умение выбирать", "Чувство красоты", "Романтичность", "Дипломатичность"],
    weaknesses: ["Нерешительность в выборе", "Зависимость от отношений", "Поверхностность чувств", "Непостоянство"],
    recommendations: ["Учитесь делать окончательный выбор", "Не путайте любовь с привязанностью", "Развивайте самодостаточность"],
  },
  7: {
    strengths: ["Целеустремлённость", "Успех в движении", "Энергичность", "Умение побеждать", "Харизма"],
    weaknesses: ["Нетерпеливость", "Агрессивность", "Неумение останавливаться", "Выгорание"],
    recommendations: ["Двигайтесь к цели, но делайте паузы", "Выбирайте битвы осознанно", "Контролируйте агрессию"],
  },
  8: {
    strengths: ["Справедливость", "Аналитический ум", "Баланс", "Объективность", "Правовое чутьё"],
    weaknesses: ["Чрезмерная критичность", "Холодность", "Перфекционизм", "Склонность судить"],
    recommendations: ["Применяйте справедливость и к себе", "Не будьте слишком строги", "Развивайте эмоциональный интеллект"],
  },
  9: {
    strengths: ["Мудрость одиночества", "Глубина", "Исследовательский дух", "Духовность", "Самодостаточность"],
    weaknesses: ["Замкнутость", "Страх близости", "Депрессивность", "Мизантропия"],
    recommendations: ["Принимайте периоды одиночества как ресурс", "Не изолируйтесь от мира", "Найдите баланс между одиночеством и общением"],
  },
  10: {
    strengths: ["Удачливость", "Умение использовать шансы", "Оптимизм", "Адаптивность", "Цикличность"],
    weaknesses: ["Непостоянство", "Азартность", "Зависимость от удачи", "Безответственность"],
    recommendations: ["Используйте удачу, но не полагайтесь только на неё", "Создавайте запасные планы", "Учитесь видеть циклы"],
  },
  11: {
    strengths: ["Внутренняя сила", "Стойкость", "Выносливость", "Храбрость", "Умение преодолевать"],
    weaknesses: ["Грубая сила вместо мудрости", "Упрямство", "Неумение просить о помощи", "Истощение"],
    recommendations: ["Используйте мягкую силу", "Принимайте помощь", "Восстанавливайте ресурсы регулярно"],
  },
  12: {
    strengths: ["Жертвенность", "Глубокое понимание страдания", "Духовная трансформация", "Милосердие"],
    weaknesses: ["Жертвенность как привычка", "Созависимость", "Самобичевание", "Пассивность"],
    recommendations: ["Различайте жертвенность и самопожертвование", "Устанавливайте границы", "Трансформируйте боль в мудрость"],
  },
  13: {
    strengths: ["Трансформация", "Умение отпускать", "Обновление", "Глубина перемен", "Очищение"],
    weaknesses: ["Страх перемен", "Деструктивность", "Склонность разрушать хорошее", "Фиксация на прошлом"],
    recommendations: ["Принимайте естественные завершения", "Не держитесь за отжившее", "Каждый конец — начало нового"],
  },
  14: {
    strengths: ["Умеренность", "Баланс", "Терпение", "Гармония", "Целительство"],
    weaknesses: ["Чрезмерная осторожность", "Нерешительность", "Скука", "Избегание крайностей"],
    recommendations: ["Ищите золотую середину, но не бойтесь рисковать", "Развивайте терпение как силу", "Гармонизируйте все сферы жизни"],
  },
  15: {
    strengths: ["Магнетизм", "Сексуальность", "Финансовый талант", "Власть над материей", "Харизма"],
    weaknesses: ["Зависимости", "Манипуляции", "Жадность", "Одержимость властью"],
    recommendations: ["Используйте харизму этично", "Следите за зависимостями", "Материальный успех — инструмент, не цель"],
  },
  16: {
    strengths: ["Способность к кардинальным переменам", "Стрессоустойчивость", "Строительство заново", "Честность"],
    weaknesses: ["Катастрофическое мышление", "Самосаботаж", "Разрушение стабильности", "Конфликтность"],
    recommendations: ["Стройте на прочном фундаменте", "Не разрушайте ради разрушения", "Принимайте кризисы как точки роста"],
  },
  17: {
    strengths: ["Надежда", "Вдохновение", "Творчество", "Открытость вселенной", "Целительская энергия"],
    weaknesses: ["Наивность", "Оторванность от реальности", "Хрупкость", "Зависимость от вдохновения"],
    recommendations: ["Сохраняйте надежду, но действуйте практично", "Развивайте творческие таланты", "Будьте маяком для других"],
  },
  18: {
    strengths: ["Глубокая интуиция", "Связь с бессознательным", "Творческое воображение", "Чувствительность"],
    weaknesses: ["Страхи", "Фобии", "Обман", "Иллюзии", "Тревожность"],
    recommendations: ["Работайте со страхами осознанно", "Различайте интуицию и тревогу", "Используйте воображение в творчестве"],
  },
  19: {
    strengths: ["Жизнерадостность", "Успех", "Витальность", "Щедрость", "Лидерство через вдохновение"],
    weaknesses: ["Эгоцентризм", "Выгорание от чрезмерной активности", "Потребность в восхищении", "Гордыня"],
    recommendations: ["Светите, но не ослепляйте", "Делитесь энергией с другими", "Оставайтесь скромными при успехе"],
  },
  20: {
    strengths: ["Переоценка ценностей", "Духовное пробуждение", "Семейная карма", "Исцеление рода"],
    weaknesses: ["Зацикленность на прошлом", "Чувство вины", "Давление семьи", "Нежелание меняться"],
    recommendations: ["Исцелите отношения с родом", "Примите ответственность за свою жизнь", "Отпустите чужие ожидания"],
  },
  21: {
    strengths: ["Завершённость", "Успех", "Целостность", "Мировоззрение", "Достижение высшей цели"],
    weaknesses: ["Застой после достижения", "Потеря мотивации", "Высокомерие", "Закрытость к новому"],
    recommendations: ["Каждое достижение — ступень к следующему", "Делитесь успехом", "Оставайтесь открытыми для роста"],
  },
  22: {
    strengths: ["Свобода", "Нестандартное мышление", "Творческий гений", "Непредсказуемость как сила"],
    weaknesses: ["Безответственность", "Хаотичность", "Инфантильность", "Неспособность к обязательствам"],
    recommendations: ["Превратите хаос в творчество", "Научитесь завершать дела", "Свобода — это ответственность"],
  },
};

// Выбор локализованных данных с fallback на русскую базу
function pickDeep(position: number): DeepMeaning | undefined {
  const lang = i18n.language;
  if (lang && lang !== 'ru' && matrixDeepOverlays[lang]?.[position]) return matrixDeepOverlays[lang][position];
  return positionDeepMeanings[position];
}
function pickTraits(arcanaNumber: number): Traits {
  const lang = i18n.language;
  if (lang && lang !== 'ru' && matrixTraitsOverlays[lang]?.[arcanaNumber]) return matrixTraitsOverlays[lang][arcanaNumber];
  return arcanaTraits[arcanaNumber] || { strengths: [], weaknesses: [], recommendations: [] };
}
function pickPositionTitle(position: number): string {
  const lang = i18n.language;
  if (lang && lang !== 'ru' && positionTitleOverlays[lang]?.[position]) return positionTitleOverlays[lang][position];
  return positionDescriptions[position]?.title || `${i18n.t("matrix.position")} ${position}`;
}

// Генерация глубокой трактовки позиции
export function getPositionInterpretation(position: number, arcanaNumber: number): PositionInterpretation {
  const arcana = getArcana(arcanaNumber);
  const deepMeaning = pickDeep(position);
  const traits = pickTraits(arcanaNumber);

  return {
    position,
    arcanaNumber,
    arcanaName: arcana?.name || `${i18n.t("res.arcanaWord")} ${arcanaNumber}`,
    positionTitle: pickPositionTitle(position),
    lifeManifestations: deepMeaning?.lifeContext || '',
    strengths: traits.strengths,
    weaknesses: traits.weaknesses,
    whereEarns: deepMeaning?.earnContext || '',
    whereLoses: deepMeaning?.loseContext || '',
    recommendations: traits.recommendations,
  };
}

// Анализ связок между позициями
export function getCrossPositionLinks(matrix: PersonalMatrix): CrossPositionLink[] {
  const links: CrossPositionLink[] = [];
  const p = matrix.positions;

  links.push({
    positions: [1, 2],
    title: i18n.t("matrixGen.link_1_2.title"),
    description: relDesc("matrixGen.link_1_2", p[0], p[1]),
    type: areSynergetic(p[0], p[1]) ? 'synergy' : areConflicting(p[0], p[1]) ? 'conflict' : 'neutral',
  });

  links.push({
    positions: [3, 5],
    title: i18n.t("matrixGen.link_3_5.title"),
    description: relDesc("matrixGen.link_3_5", p[2], p[4]),
    type: areSynergetic(p[2], p[4]) ? 'synergy' : areConflicting(p[2], p[4]) ? 'conflict' : 'neutral',
  });

  links.push({
    positions: [6, 7],
    title: i18n.t("matrixGen.link_6_7.title"),
    description: relDesc("matrixGen.link_6_7", p[5], p[6]),
    type: areConflicting(p[5], p[6]) ? 'conflict' : areSynergetic(p[5], p[6]) ? 'synergy' : 'neutral',
  });

  links.push({
    positions: [10, 12],
    title: i18n.t("matrixGen.link_10_12.title"),
    description: relDesc("matrixGen.link_10_12", p[9], p[11]),
    type: 'neutral',
  });

  links.push({
    positions: [2, 4],
    title: i18n.t("matrixGen.link_2_4.title"),
    description: relDesc("matrixGen.link_2_4", p[1], p[3]),
    type: areSynergetic(p[1], p[3]) ? 'synergy' : areConflicting(p[1], p[3]) ? 'conflict' : 'neutral',
  });

  links.push({
    positions: [7, 8],
    title: i18n.t("matrixGen.link_7_8.title"),
    description: relDesc("matrixGen.link_7_8", p[6], p[7]),
    type: areSynergetic(p[6], p[7]) ? 'synergy' : areConflicting(p[6], p[7]) ? 'conflict' : 'neutral',
  });

  return links;
}

function relDesc(prefix: string, a1: number, a2: number): string {
  const arc1 = getArcana(a1);
  const arc2 = getArcana(a2);
  const base = i18n.t(`${prefix}.base`);
  const filled = i18n.t(`${prefix}.tmpl`, { a1, n1: arc1?.name || '', a2, n2: arc2?.name || '' });
  return `${base} ${filled}`;
}

// Определение синергии: одинаковая стихия или дополняющие планеты
function areSynergetic(a1: number, a2: number): boolean {
  const arc1 = getArcana(a1);
  const arc2 = getArcana(a2);
  if (!arc1 || !arc2) return false;
  if (arc1.element === arc2.element) return true;
  // Вода + Земля = синергия
  if ((arc1.element === 'Вода' && arc2.element === 'Земля') || (arc1.element === 'Земля' && arc2.element === 'Вода')) return true;
  // Огонь + Воздух = синергия
  if ((arc1.element === 'Огонь' && arc2.element === 'Воздух') || (arc1.element === 'Воздух' && arc2.element === 'Огонь')) return true;
  return false;
}

function areConflicting(a1: number, a2: number): boolean {
  const arc1 = getArcana(a1);
  const arc2 = getArcana(a2);
  if (!arc1 || !arc2) return false;
  // Огонь + Вода = конфликт
  if ((arc1.element === 'Огонь' && arc2.element === 'Вода') || (arc1.element === 'Вода' && arc2.element === 'Огонь')) return true;
  // Земля + Воздух = конфликт
  if ((arc1.element === 'Земля' && arc2.element === 'Воздух') || (arc1.element === 'Воздух' && arc2.element === 'Земля')) return true;
  return false;
}

// Генерация итогового профиля
export function generateMatrixSummary(matrix: PersonalMatrix): MatrixSummary {
  const p = matrix.positions;
  const arcana12 = getArcana(p[11]);
  const arcana7 = getArcana(p[6]);
  const arcana2 = getArcana(p[1]);
  const arcana5 = getArcana(p[4]);
  const arcana6 = getArcana(p[5]);

  const overallProfile = [
    i18n.t("matrixGen.profile1", { name: arcana2?.name || p[1], n: p[1] }),
    i18n.t("matrixGen.profile2", { name: arcana7?.name || p[6], n: p[6] }),
    i18n.t("matrixGen.profile3", { name: arcana12?.name || p[11], n: p[11] }),
    i18n.t("matrixGen.profile4", { name: arcana5?.name || p[4], n: p[4] }),
    i18n.t("matrixGen.profile5", { name: getArcana(p[8])?.name || p[8], n: p[8], name6: arcana6?.name || p[5], n6: p[5] }),
  ].join(' ');

  const keyProblems: string[] = [];
  // Конфликт между точкой опоры и целью
  if (areConflicting(p[5], p[6])) {
    keyProblems.push(i18n.t("matrixGen.problemConflict", { n5: p[5], name5: getArcana(p[5])?.name, n7: p[6], name7: getArcana(p[6])?.name }));
  }
  // Перевёрнутые арканы
  if (matrix.reversedArcana.length > 0) {
    keyProblems.push(i18n.t("matrixGen.problemReversed", { list: matrix.reversedArcana.map(r => r.arcana).join(', ') }));
  }
  // Кармический хвост
  keyProblems.push(i18n.t("matrixGen.problemKarma", { p10: p[9], p11: p[10], p12: p[11] }));

  const growthPoints: string[] = [];
  if (matrix.mirrorArcana.length > 0) {
    growthPoints.push(i18n.t("matrixGen.growthMirror", { list: matrix.mirrorArcana.map(m => m.arcana).join(', ') }));
  }
  growthPoints.push(i18n.t("matrixGen.growthSuccess", { list: matrix.successCode.join(', ') }));
  growthPoints.push(i18n.t("matrixGen.growthSocial", { p3: p[2], name3: getArcana(p[2])?.name }));

  const strategicRecommendations: string[] = [
    i18n.t("matrixGen.strat1", { name12: arcana12?.name }),
    i18n.t("matrixGen.strat2", { name8: getArcana(p[7])?.name, name7: arcana7?.name }),
    i18n.t("matrixGen.strat3", { name6: arcana6?.name }),
    i18n.t("matrixGen.strat4", { name5: arcana5?.name }),
  ];

  return { overallProfile, keyProblems, growthPoints, strategicRecommendations };
}
