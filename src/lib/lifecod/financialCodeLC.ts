// Блок 4: Финансовый код (Life C⚙D)
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

export interface FinancialCodeLCModule {
  channelNumber: number;
  channelName: string;
  channelDesc: string;

  blockNumber: number;
  blockName: string;
  blockDesc: string;

  activationNumber: number;
  activationName: string;
  activationDesc: string;

  spheres: string[];
  moneyMistakes: string[];

  calcTrace: CalcTrace;
}

const channelDescriptions: Record<number, { name: string; desc: string; spheres: string[] }> = {
  1: { name: 'Канал лидерства', desc: 'Деньги через самостоятельные проекты, предпринимательство', spheres: ['Стартапы', 'Консалтинг', 'Личный бренд', 'Управление'] },
  2: { name: 'Канал партнёрства', desc: 'Деньги через сотрудничество, посредничество', spheres: ['Партнёрский бизнес', 'Медиация', 'HR', 'Дипломатия'] },
  3: { name: 'Канал творчества', desc: 'Деньги через коммуникацию и самовыражение', spheres: ['Маркетинг', 'Контент', 'Обучение', 'Искусство'] },
  4: { name: 'Канал системы', desc: 'Деньги через структуру, порядок, дисциплину', spheres: ['Финансы', 'Бухгалтерия', 'Недвижимость', 'Производство'] },
  5: { name: 'Канал свободы', desc: 'Деньги через перемены, путешествия, адаптацию', spheres: ['Продажи', 'Путешествия', 'Фриланс', 'Инновации'] },
  6: { name: 'Канал заботы', desc: 'Деньги через помощь и служение другим', spheres: ['Медицина', 'Образование', 'Социальная сфера', 'Ресторанный бизнес'] },
  7: { name: 'Канал знаний', desc: 'Деньги через экспертизу, исследования, аналитику', spheres: ['IT', 'Наука', 'Аналитика', 'Психология'] },
  8: { name: 'Канал власти', desc: 'Деньги через управление ресурсами и масштаб', spheres: ['Инвестиции', 'Корпорации', 'Банковское дело', 'Крупный бизнес'] },
  9: { name: 'Канал трансформации', desc: 'Деньги через завершение циклов и глобальные проекты', spheres: ['Благотворительность', 'Международный бизнес', 'Экология', 'Духовные практики'] },
};

const blockDescriptions: Record<number, { name: string; desc: string; mistakes: string[] }> = {
  0: { name: 'Нет блокировки', desc: 'Финансовый поток открыт', mistakes: [] },
  1: { name: 'Блок страха', desc: 'Страх начать, ждёте идеального момента', mistakes: ['Откладывание старта', 'Ожидание разрешения от других'] },
  2: { name: 'Блок зависимости', desc: 'Финансовая зависимость от партнёра', mistakes: ['Передача контроля за деньги другому', 'Неумение считать свои деньги'] },
  3: { name: 'Блок болтовни', desc: 'Много планов — мало действий', mistakes: ['Обсуждение планов вместо реализации', 'Трата на удовольствия'] },
  4: { name: 'Блок жёсткости', desc: 'Деньги не текут из-за гиперконтроля', mistakes: ['Скупость ради скупости', 'Отказ от инвестиций'] },
  5: { name: 'Блок хаоса', desc: 'Деньги приходят и уходят хаотично', mistakes: ['Импульсивные траты', 'Отсутствие финансового плана'] },
  6: { name: 'Блок жертвенности', desc: 'Раздаёте деньги другим, себе — ничего', mistakes: ['Работа бесплатно', 'Невозможность назначить цену'] },
  7: { name: 'Блок перфекционизма', desc: 'Откладываете заработок до «идеального знания»', mistakes: ['Вечное обучение вместо заработка', 'Обесценивание своих знаний'] },
  8: { name: 'Блок давления', desc: 'Зарабатываете через насилие над собой', mistakes: ['Выгорание ради денег', 'Жёсткие методы заработка'] },
  9: { name: 'Блок отпускания', desc: 'Держитесь за старые источники дохода', mistakes: ['Возврат к неработающим моделям', 'Страх потерять нажитое'] },
};

const activationDescriptions: Record<number, { name: string; desc: string }> = {
  1: { name: 'Активация через действие', desc: 'Начните делать — деньги придут за вами' },
  2: { name: 'Активация через людей', desc: 'Найдите партнёра или наставника' },
  3: { name: 'Активация через голос', desc: 'Заявите о себе публично' },
  4: { name: 'Активация через план', desc: 'Составьте финансовый план на 12 месяцев' },
  5: { name: 'Активация через перемены', desc: 'Смените подход к заработку' },
  6: { name: 'Активация через ценность', desc: 'Покажите людям свою пользу' },
  7: { name: 'Активация через экспертизу', desc: 'Монетизируйте свои знания' },
  8: { name: 'Активация через масштаб', desc: 'Увеличьте средний чек и объёмы' },
  9: { name: 'Активация через миссию', desc: 'Свяжите деньги с высшей целью' },
};

export function calculateFinancialCodeLC(day: number, month: number, year: number): FinancialCodeLCModule {
  // Финансовый канал: день → редукция
  const channelNumber = reduceToSingle(day);
  // Блокировка: |день - месяц| → редукция
  const blockRaw = Math.abs(day - month);
  const blockNumber = blockRaw === 0 ? 0 : reduceToSingle(blockRaw);
  // Активация: (день + год_сумма) → редукция
  const activationRaw = reduceToSingle(day) + reduceToSingle(sumAllDigits(year));
  const activationNumber = reduceToSingle(activationRaw);

  const ch = channelDescriptions[channelNumber] || channelDescriptions[1]!;
  const bl = blockDescriptions[blockNumber] || blockDescriptions[0]!;
  const ac = activationDescriptions[activationNumber] || activationDescriptions[1]!;

  return {
    channelNumber, channelName: ch.name, channelDesc: ch.desc,
    blockNumber, blockName: bl.name, blockDesc: bl.desc,
    activationNumber, activationName: ac.name, activationDesc: ac.desc,
    spheres: ch.spheres,
    moneyMistakes: bl.mistakes,
    calcTrace: {
      input: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`,
      steps: [
        `Канал: ${day}${day > 9 ? ' → ' + channelNumber : ''} = ${channelNumber}`,
        `Блок: |${day} - ${month}| = ${blockRaw}${blockRaw > 9 ? ' → ' + blockNumber : ''}`,
        `Активация: ${reduceToSingle(day)} + ${reduceToSingle(sumAllDigits(year))} = ${activationRaw}${activationRaw > 9 ? ' → ' + activationNumber : ''}`,
      ],
      result: `Канал: ${channelNumber}, Блок: ${blockNumber}, Активация: ${activationNumber}`,
    },
  };
}
