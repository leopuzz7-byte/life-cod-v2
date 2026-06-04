// Блок 3: Личный прогноз — месяц и день
import { CalcTrace } from './personalAnalysis';
import i18n from '@/i18n';
import { getForecastSet, getForecastLabels } from './personalForecastI18n';

function reduceToSingle(num: number): number {
  if (num === 0) return 0;
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d), 0);
  }
  return num;
}

export interface PersonalMonthModule {
  month: number;
  year: number;
  personalMonth: number;
  name: string;
  energy: string;
  risks: string;
  opportunities: string;
  calcTrace: CalcTrace;
}

export interface PersonalDayModule {
  day: number;
  month: number;
  year: number;
  personalDay: number;
  name: string;
  energy: string;
  calcTrace: CalcTrace;
}

const monthDescriptions: Record<number, { name: string; energy: string; risks: string; opportunities: string }> = {
  1: { name: 'Месяц старта', energy: 'Новые начинания, инициатива', risks: 'Импульсивные решения', opportunities: 'Запуск проектов, личные решения' },
  2: { name: 'Месяц партнёрства', energy: 'Дипломатия, сотрудничество', risks: 'Нерешительность, зависимость', opportunities: 'Переговоры, укрепление связей' },
  3: { name: 'Месяц общения', energy: 'Творчество, социальная активность', risks: 'Распыление, пустая болтовня', opportunities: 'Нетворкинг, презентации, творчество' },
  4: { name: 'Месяц труда', energy: 'Структура, дисциплина', risks: 'Перегрузка, жёсткость', opportunities: 'Построение фундамента, систематизация' },
  5: { name: 'Месяц перемен', energy: 'Движение, эксперименты', risks: 'Хаос, незавершённость', opportunities: 'Путешествия, новый опыт, гибкость' },
  6: { name: 'Месяц ответственности', energy: 'Забота, обязательства', risks: 'Выгорание, гиперконтроль', opportunities: 'Семейные дела, помощь другим' },
  7: { name: 'Месяц анализа', energy: 'Рефлексия, интроспекция', risks: 'Изоляция, паранойя', opportunities: 'Обучение, исследования, уединение' },
  8: { name: 'Месяц власти', energy: 'Управление, амбиции', risks: 'Давление, конфликты за ресурсы', opportunities: 'Финансовые решения, карьерный рост' },
  9: { name: 'Месяц завершения', energy: 'Отпускание, итоги', risks: 'Резкие разрывы, потери', opportunities: 'Закрытие дел, благотворительность' },
};

const dayDescriptions: Record<number, { name: string; energy: string }> = {
  1: { name: 'День действия', energy: 'Решайте, начинайте, берите инициативу' },
  2: { name: 'День терпения', energy: 'Слушайте, договаривайтесь, будьте мягче' },
  3: { name: 'День общения', energy: 'Говорите, пишите, создавайте контакты' },
  4: { name: 'День работы', energy: 'Делайте рутину, стройте систему' },
  5: { name: 'День свободы', energy: 'Экспериментируйте, пробуйте новое' },
  6: { name: 'День заботы', energy: 'Позаботьтесь о близких и себе' },
  7: { name: 'День тишины', energy: 'Анализируйте, не принимайте решений' },
  8: { name: 'День силы', energy: 'Работайте с деньгами и ресурсами' },
  9: { name: 'День итогов', energy: 'Завершайте старое, отпускайте' },
};

export function calculatePersonalMonth(
  birthDay: number, birthMonth: number, personalYear: number,
  targetMonth: number, targetYear: number
): PersonalMonthModule {
  const rawSum = personalYear + targetMonth;
  const pm = reduceToSingle(rawSum);
  const set = getForecastSet(i18n.language);
  const L = getForecastLabels(i18n.language);
  const desc = (set?.months ?? monthDescriptions)[pm] || (set?.months ?? monthDescriptions)[1]!;

  return {
    month: targetMonth, year: targetYear, personalMonth: pm,
    name: desc.name, energy: desc.energy, risks: desc.risks, opportunities: desc.opportunities,
    calcTrace: {
      input: `${L.ly} = ${personalYear}, ${L.month} = ${targetMonth}`,
      steps: [`${personalYear} + ${targetMonth} = ${rawSum}${rawSum > 9 ? ' → ' + pm : ''}`],
      result: `${L.personalMonth}: ${pm}`,
    },
  };
}

export function calculatePersonalDay(
  birthDay: number, birthMonth: number, personalMonth: number,
  targetDay: number, targetMonth: number, targetYear: number
): PersonalDayModule {
  const rawSum = personalMonth + targetDay;
  const pd = reduceToSingle(rawSum);
  const set = getForecastSet(i18n.language);
  const L = getForecastLabels(i18n.language);
  const desc = (set?.days ?? dayDescriptions)[pd] || (set?.days ?? dayDescriptions)[1]!;

  return {
    day: targetDay, month: targetMonth, year: targetYear, personalDay: pd,
    name: desc.name, energy: desc.energy,
    calcTrace: {
      input: `${L.pm} = ${personalMonth}, ${L.day} = ${targetDay}`,
      steps: [`${personalMonth} + ${targetDay} = ${rawSum}${rawSum > 9 ? ' → ' + pd : ''}`],
      result: `${L.personalDay}: ${pd}`,
    },
  };
}

export function calculateFullForecast(
  birthDay: number, birthMonth: number, birthYear: number,
  personalYear: number, targetYear: number
): { months: PersonalMonthModule[]; currentMonth: PersonalMonthModule; today: PersonalDayModule } {
  const now = new Date();
  const currentMonthNum = targetYear === now.getFullYear() ? now.getMonth() + 1 : 1;
  const currentDayNum = targetYear === now.getFullYear() ? now.getDate() : 1;

  const months: PersonalMonthModule[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(calculatePersonalMonth(birthDay, birthMonth, personalYear, m, targetYear));
  }

  const currentMonth = months[currentMonthNum - 1];
  const today = calculatePersonalDay(birthDay, birthMonth, currentMonth.personalMonth, currentDayNum, currentMonthNum, targetYear);

  return { months, currentMonth, today };
}
