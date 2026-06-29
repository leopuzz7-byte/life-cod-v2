import { MonthForecast } from './calculations';
import { getArcana } from './arcana';

export interface AIMonthReading {
  mainEnergy: string;
  generalForecast: string;
  arcana1influence: string;
  arcana2influence: string;
  lifeManifest: string;
  money: string;
  relationships: string;
  health: string;
  mainRisk: string;
  opportunities: string;
  recommendations: string;
}

const CACHE_PREFIX = 'ai_month_v1_';

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

  return `Ты нумеролог системы Аркан-Коды. Пишешь персональный прогноз на месяц. Язык: русский.
${name ? `\nКЛИЕНТ: ${name}` : ''}
МЕСЯЦ: ${monthName} ${targetYear}

РАСЧЁТ ТРЕУГОЛЬНИКА:
Первая энергия (аркан месяца): месяц рождения ${birthDate.month} + ${targetMonth} (${monthName}) = ${arcanaLabel(position1)} - показывает КАК будут развиваться события
Вторая энергия (аркан года): ${arcanaLabel(position2)} - создаёт основной жизненный фон
Итоговый аркан месяца: ${arcanaLabel(position3)} - главная тема и результат

ТРЕУГОЛЬНИК: ${arcanaLabel(position1)} + ${arcanaLabel(position2)} = ${arcanaLabel(position3)}
Планета итогового аркана: ${a3?.planet ?? '-'}
Стихия: ${a3?.element ?? '-'}

КОНТЕКСТ:
Аркан года: ${arcanaLabel(position2)} (${a2?.planet ?? ''})

ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Никаких "месяц трансформации", "месяц роста" - это запрещено
- Сначала факт, потом трактовка, потом практический вывод
- Конкретика: не "отдыхайте", а "прогулки, медитация, ванны"
- Язык "вы/ваш", тепло, по-человечески
- Каждый блок отвечает на свой вопрос, не повторяет другой

Верни СТРОГО JSON без markdown:
{
  "mainEnergy": "главная энергия месяца: аркан ${position3}, планета, ключевая тема (2-3 предложения)",
  "generalForecast": "общая атмосфера ${monthName}: что будет происходить, главные тенденции (5-6 предложений)",
  "arcana1influence": "глубокий разбор энергии месяца ${position1} (${a1?.name}): как эта энергия проявится в событиях, её влияние на поведение и решения (3-4 предложения)",
  "arcana2influence": "глубокий разбор аркана года ${position2} (${a2?.name}): как годовая энергия влияет на этот месяц, что она усиливает или тормозит (3-4 предложения)",
  "lifeManifest": "как всё это конкретно проявится в жизни: события, ситуации, встречи (4-5 предложений)",
  "money": "деньги и работа в ${monthName}: возможности, риски, конкретные советы (4-5 предложений)",
  "relationships": "отношения в ${monthName}: что ожидать, как использовать энергию (4-5 предложений)",
  "health": "здоровье: на что обратить внимание, что полезно делать (3-4 предложения)",
  "mainRisk": "главный риск месяца и как его избежать (2-3 предложения)",
  "opportunities": "главные возможности ${monthName}: что открывается, что нельзя упустить (4-5 предложений)",
  "recommendations": "практические рекомендации: конкретный список что делать и чего избегать в ${monthName}"
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

  const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 5000,
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
  const reading: AIMonthReading = JSON.parse(cleaned);

  try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
  return reading;
}
