import { YearForecast } from './calculations';
import { getArcana } from './arcana';
import { yearToArcana, normalizeToArcana } from './calculations';

export interface AIYearMonth {
  monthName: string;
  monthNum: number;
  pos1: number; pos1Name: string;
  pos2: number; pos2Name: string;
  pos3: number; pos3Name: string;
  forecast: string;
  keyTip: string;
}

export interface AIYearReading {
  arcanaOverview: string;
  arcanaStrengths: string;
  arcanaWeaknesses: string;
  arcanaDistortions: string;
  intro: string;
  atmosphere: string;
  money: string;
  relationships: string;
  health: string;
  opportunities: string;
  risks: string;
  plusManifest: string;
  minusManifest: string;
  recommendations: string;
  conclusion: string;
  months: AIYearMonth[];
}

const CACHE_PREFIX = 'ai_year_v1_';
const MONTH_NAMES: Record<number, string> = {
  1:'Январь',2:'Февраль',3:'Март',4:'Апрель',5:'Май',6:'Июнь',
  7:'Июль',8:'Август',9:'Сентябрь',10:'Октябрь',11:'Ноябрь',12:'Декабрь',
};

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} - ${a.name}` : String(n);
}

function buildMonthsData(yearArcana: number, targetYear: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const pos1 = yearArcana;
    const pos2 = m;
    const pos3 = normalizeToArcana(pos1 + pos2);
    return {
      monthNum: m,
      monthName: MONTH_NAMES[m],
      pos1, pos1Name: getArcana(pos1)?.name ?? '',
      pos2, pos2Name: String(m),
      pos3, pos3Name: getArcana(pos3)?.name ?? '',
    };
  });
}

function buildPrompt(forecast: YearForecast, name: string): string {
  const { birthDate, targetYear, arcana } = forecast;
  const birthYearArcana = yearToArcana(birthDate.year);
  const targetYearArcana = yearToArcana(targetYear);
  const a = getArcana(arcana);
  const months = buildMonthsData(arcana, targetYear);

  const monthsInfo = months.map(m =>
    `${m.monthName}: треугольник ${m.pos1} ${m.pos1Name} - ${m.pos2} (${m.monthName}) - ${m.pos3} ${m.pos3Name}`
  ).join('\n');

  return `Ты нумеролог системы Аркан-Коды. Пишешь персональный годовой прогноз. Язык: русский.
${name ? `\nКЛИЕНТ: ${name}` : ''}
ГОД ПРОГНОЗА: ${targetYear}

РАСЧЁТ:
Аркан года рождения: ${arcanaLabel(birthYearArcana)}
Аркан ${targetYear} года: ${arcanaLabel(targetYearArcana)}
Итоговый аркан года: ${arcanaLabel(arcana)}
Планета: ${a?.planet ?? '-'}
Стихия: ${a?.element ?? '-'}

ТРЕУГОЛЬНИКИ МЕСЯЦЕВ:
${monthsInfo}

ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Никаких "год трансформации", "год роста", "год возможностей" - это запрещено
- Сначала факт/расчёт, потом трактовка, потом практический вывод
- Конкретные рекомендации (не "занимайтесь спортом" - а "плавание, ходьба, велосипед")
- Каждый блок отвечает на свой вопрос, не повторяет другой
- Язык "вы/ваш", тепло, без напыщенности
- События важнее философии. Человек должен видеть свою жизнь

Верни СТРОГО JSON без markdown:
{
  "arcanaOverview": "главная энергия аркана ${arcana} в этом году (4-5 предложений)",
  "arcanaStrengths": "сильные стороны этой энергии (3-4 предложения)",
  "arcanaWeaknesses": "слабые стороны и ловушки (3-4 предложения)",
  "arcanaDistortions": "как проявляется в минусе, искажения (3-4 предложения)",
  "intro": "почему именно этот аркан пришёл сейчас, какие темы станут главными (4-5 предложений)",
  "atmosphere": "общие тенденции года, что усилится и что уйдёт (4-5 предложений)",
  "money": "деньги и работа: возможности, риски, ошибки, конкретные советы (5-7 предложений)",
  "relationships": "отношения: отдельно для одиноких и для пар, плюсы и риски (5-7 предложений)",
  "health": "здоровье: зоны внимания, что полезно, конкретные практики (4-5 предложений)",
  "opportunities": "главные возможности года (4-5 предложений)",
  "risks": "главные риски и ошибки года (4-5 предложений)",
  "plusManifest": "как правильно проживать энергию, что усиливает удачу (4-5 предложений)",
  "minusManifest": "деструктивные сценарии и ловушки (4-5 предложений)",
  "recommendations": "практические рекомендации: конкретный список что делать и чего избегать",
  "conclusion": "итог: для чего дан этот год, главный урок (3-4 предложения)",
  "months": [
    ${months.map(m => `{"monthName":"${m.monthName}","monthNum":${m.monthNum},"pos1":${m.pos1},"pos1Name":"${m.pos1Name}","pos2":${m.pos2},"pos2Name":"${m.pos2Name}","pos3":${m.pos3},"pos3Name":"${m.pos3Name}","forecast":"3-4 предложения об этом месяце","keyTip":"один главный совет"}`).join(',\n    ')}
  ]
}`;
}

export function getCachedYearReading(forecast: YearForecast): AIYearReading | null {
  try {
    const key = `${CACHE_PREFIX}${forecast.birthDate.day}.${forecast.birthDate.month}.${forecast.birthDate.year}_${forecast.targetYear}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as AIYearReading : null;
  } catch { return null; }
}

export async function generateYearReading(
  forecast: YearForecast,
  name: string
): Promise<AIYearReading> {
  const cacheKey = `${CACHE_PREFIX}${birthKey(forecast)}_${forecast.targetYear}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as AIYearReading;
  } catch {}

  const apiKey = import.meta.env.VITE_AI_API_KEY || 'sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W';

  const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 8000,
      messages: [
        { role: 'system', content: 'Отвечай только JSON. Никаких markdown-оберток, никаких пояснений.' },
        { role: 'user', content: buildPrompt(forecast, name) },
      ],
    }),
  });

  if (!response.ok) throw new Error(`API ${response.status}: ${await response.text()}`);

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const reading: AIYearReading = JSON.parse(cleaned);

  try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
  return reading;
}

function birthKey(f: YearForecast): string {
  return `${f.birthDate.day}.${f.birthDate.month}.${f.birthDate.year}`;
}
