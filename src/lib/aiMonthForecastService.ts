import { MonthForecast, normalizeToArcana } from './calculations';
import { getArcana } from './arcana';

export interface AIMonthReading {
  // Треугольник (3 аркана)
  arcana1influence: string;   // энергия месяца
  arcana2influence: string;   // аркан года
  mainEnergy: string;         // итоговый аркан — главная энергия месяца
  // Основной разбор
  generalForecast: string;    // общий прогноз через 3 аркана
  yearEnergyDeep: string;     // глубокий разбор энергии года
  monthEnergyDeep: string;    // глубокий разбор энергии месяца
  resultEnergyDeep: string;   // глубокий разбор итогового аркана
  synergy: string;            // синергия энергий
  conflict: string;           // конфликт энергий
  // Сферы
  money: string;
  career: string;
  relationships: string;
  health: string;
  innerState: string;         // внутреннее состояние
  // Недели
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  // Практика
  recommendations: string;
  avoid: string;              // чего избегать
  practice: string;           // ежедневная практика
  // Даты
  keyDatesIntro: string;
  keyDates: Record<string, string>; // день месяца -> описание
  specialDate: string;        // день рождения (если в этом месяце)
  conclusion: string;         // итог месяца
}

export interface MonthKeyDate { day: number; arcana: number; isBirthday: boolean; }

// Число Сознания человека = аркан дня рождения
export function getConsciousnessArcana(birthDay: number): number {
  return normalizeToArcana(birthDay);
}

// Ключевые даты месяца: дни личного ритма (день рождения по модулю 7).
// Энергия дня = нормализация(день + число Сознания).
export function getMonthKeyDates(forecast: MonthForecast): MonthKeyDate[] {
  const { birthDate, targetMonth, targetYear } = forecast;
  const consciousness = getConsciousnessArcana(birthDate.day);
  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const start = ((birthDate.day - 1) % 7) + 1;
  const dates: MonthKeyDate[] = [];
  for (let d = start; d <= daysInMonth; d += 7) {
    dates.push({
      day: d,
      arcana: normalizeToArcana(d + consciousness),
      isBirthday: targetMonth === birthDate.month && d === birthDate.day,
    });
  }
  return dates;
}

const CACHE_PREFIX = 'ai_month_v2_';

const MONTH_NAMES: Record<number, string> = {
  1:'Январь',2:'Февраль',3:'Март',4:'Апрель',5:'Май',6:'Июнь',
  7:'Июль',8:'Август',9:'Сентябрь',10:'Октябрь',11:'Ноябрь',12:'Декабрь',
};

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} - ${a.name}` : String(n);
}

function buildPrompt(forecast: MonthForecast, name: string): string {
  const { birthDate, targetMonth, targetYear, position1, position2, position3 } = forecast;
  const a1 = getArcana(position1);
  const a2 = getArcana(position2);
  const a3 = getArcana(position3);
  const monthName = MONTH_NAMES[targetMonth];
  const consciousness = getConsciousnessArcana(birthDate.day);
  const keyDates = getMonthKeyDates(forecast);
  const keyDatesLines = keyDates
    .map(d => `  ${d.day} ${monthName}: ${arcanaLabel(d.arcana)}${d.isBirthday ? ' (ДЕНЬ РОЖДЕНИЯ - начало нового личного года)' : ''}`)
    .join('\n');
  const birthday = keyDates.find(d => d.isBirthday);
  const keyDatesJson = keyDates
    .map(d => `"${d.day}": "что несёт этот день, энергия ${arcanaLabel(d.arcana)}, как его использовать (2-3 предложения)"`)
    .join(',\n    ');

  return `Ты нумеролог системы Аркан-Коды. Пишешь персональный профессиональный прогноз на месяц. Язык: русский.
${name ? `\nКЛИЕНТ: ${name}` : ''}
ДАТА РОЖДЕНИЯ: ${birthDate.day}.${birthDate.month}.${birthDate.year}
МЕСЯЦ ПРОГНОЗА: ${monthName} ${targetYear}

РАСЧЁТ ТРЕУГОЛЬНИКА МЕСЯЦА:
Энергия месяца (КАК развиваются события): ${arcanaLabel(position1)} (${a1?.planet ?? ''})
Энергия года (общий фон): ${arcanaLabel(position2)} (${a2?.planet ?? ''})
Итоговый аркан месяца (главная тема): ${arcanaLabel(position3)} (${a3?.planet ?? ''}, ${a3?.element ?? ''})
Формула: ${arcanaLabel(position1)} + ${arcanaLabel(position2)} = ${arcanaLabel(position3)}

ЧИСЛО СОЗНАНИЯ КЛИЕНТА: ${arcanaLabel(consciousness)}
КЛЮЧЕВЫЕ ДАТЫ МЕСЯЦА (день: энергия):
${keyDatesLines}

ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Не используй штампы вроде "месяц трансформации" или "месяц роста"
- Сначала факт об аркане, потом трактовка, потом практический вывод
- Конкретика вместо общих слов: не "отдыхайте", а "прогулки, вода, ранний сон"
- Язык "вы/ваш", тепло и по-человечески, как живой наставник
- Каждый блок отвечает на свой вопрос и не повторяет соседние
- Свяжи три аркана в единую логику месяца

Верни СТРОГО JSON без markdown:
{
  "arcana1influence": "энергия месяца ${arcanaLabel(position1)}: КАК будут разворачиваться события (3-4 предложения)",
  "arcana2influence": "энергия года ${arcanaLabel(position2)}: какой фон задаёт и как влияет на месяц (3-4 предложения)",
  "mainEnergy": "итоговый аркан ${arcanaLabel(position3)}: главная тема месяца и её смысл (3-4 предложения)",
  "generalForecast": "общий прогноз через взаимодействие трёх арканов: как месяц разворачивается от начала к концу (6-7 предложений)",
  "yearEnergyDeep": "глубокий разбор энергии года ${arcanaLabel(position2)}: задача года, как проявится в этом месяце, главный вопрос периода (5-6 предложений)",
  "monthEnergyDeep": "глубокий разбор энергии месяца ${arcanaLabel(position1)}: чему учит, плюс и обратная сторона, главный совет (5-6 предложений)",
  "resultEnergyDeep": "глубокий разбор итогового аркана ${arcanaLabel(position3)}: ради чего даётся месяц, главный урок и предупреждение (5-6 предложений)",
  "synergy": "синергия энергий: как три аркана последовательно помогают друг другу (3-4 предложения)",
  "conflict": "конфликт энергий: главное внутреннее противоречие месяца и как его пройти (3-4 предложения)",
  "money": "деньги и финансы: возможности, на что обратить внимание, конкретный совет (4-5 предложений)",
  "career": "карьера и работа: что происходит в профессии, как использовать месяц (4-5 предложений)",
  "relationships": "отношения и личная жизнь: для пар и для одиноких (4-5 предложений)",
  "health": "здоровье: на что обратить внимание, что полезно (3-4 предложения)",
  "innerState": "внутреннее состояние: эмоциональный фон, интуиция, внутренние процессы (4-5 предложений)",
  "week1": "первая неделя (1-7 ${monthName}): тема и главная задача недели (3-4 предложения)",
  "week2": "вторая неделя (8-14 ${monthName}): тема и главная задача недели (3-4 предложения)",
  "week3": "третья неделя (15-21 ${monthName}): тема и главная задача недели (3-4 предложения)",
  "week4": "четвёртая неделя (22 - конец ${monthName}): тема и главная задача недели (3-4 предложения)",
  "recommendations": "практические рекомендации месяца, тёплым живым текстом без маркеров (4-5 предложений)",
  "avoid": "чего избегать в этом месяце (3-4 предложения)",
  "practice": "ежедневная практика месяца: конкретное упражнение или ритуал (3-4 предложения)",
  "keyDatesIntro": "вступление к ключевым датам: что число Сознания ${arcanaLabel(consciousness)} значит для активных дней месяца (2-3 предложения)",
  "keyDates": {
    ${keyDatesJson}
  },
  "specialDate": "${birthday ? `особый разбор дня рождения ${birthday.day} ${monthName} как начала нового личного года под арканом ${arcanaLabel(birthday.arcana)}: смысл дня и главный совет (4-5 предложений)` : ''}",
  "conclusion": "итог месяца: главный смысл, главный урок и тёплое пожелание (5-6 предложений)"
}`;
}

export function getCachedMonthReading(forecast: MonthForecast): AIMonthReading | null {
  try {
    const key = `${CACHE_PREFIX}${forecast.birthDate.day}.${forecast.birthDate.month}.${forecast.birthDate.year}_${forecast.targetMonth}.${forecast.targetYear}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as AIMonthReading : null;
  } catch { return null; }
}

export async function generateMonthReading(
  forecast: MonthForecast,
  name: string
): Promise<AIMonthReading> {
  const { birthDate, targetMonth, targetYear } = forecast;
  const cacheKey = `${CACHE_PREFIX}${birthDate.day}.${birthDate.month}.${birthDate.year}_${targetMonth}.${targetYear}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as AIMonthReading;
  } catch {}

  const apiKey = import.meta.env.VITE_AI_API_KEY || 'sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W';

  const payload = JSON.stringify({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 9000,
    messages: [
      { role: 'system', content: 'Отвечай только JSON. Никаких markdown-оберток, никаких пояснений.' },
      { role: 'user', content: buildPrompt(forecast, name) },
    ],
  });

  // proxyapi периодически флапает (Failed to fetch / 429 / 5xx). Повторяем автоматически.
  let lastErr: unknown = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: payload,
      });

      if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);

      const data = await response.json();
      const raw = data.choices?.[0]?.message?.content ?? '';
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const reading: AIMonthReading = JSON.parse(cleaned);

      try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
      return reading;
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise(r => setTimeout(r, 700 * (attempt + 1)));
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('AI request failed');
}
