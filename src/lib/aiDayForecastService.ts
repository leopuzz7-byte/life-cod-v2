import { DailyForecastResult } from './dailyForecast';
import { getArcana } from './arcana';
import { normalizeToArcana } from './calculations';

export interface AIDayReading {
  positions: Record<string, string>; // "1"-"12"
  deepAnalysis: string;
  morning: string;
  afternoon: string;
  evening: string;
  money: string;
  career: string;
  relationships: string;
  health: string;
  risks: string;
  opportunities: string;
  practice: string;
  conclusion: string;
}

const CACHE_PREFIX = 'ai_day_v1_';

const POS_TITLES: Record<number, string> = {
  1: 'Утро / Старт дня',
  2: 'Потенциал дня',
  3: 'Самооценка',
  4: 'Цель дня',
  5: 'Главный ресурс',
  6: 'Основа дня',
  7: 'Главная задача',
  8: 'Способ решения задач',
  9: 'Итог / Результат',
  10: 'Подсознательные процессы',
  11: 'Внешнее влияние',
  12: 'Кармическая задача дня',
};

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} - ${a.name}` : String(n);
}

function buildPrompt(result: DailyForecastResult, name: string): string {
  const { birthDate, targetDate, positions } = result;
  const bStr = `${birthDate.day}.${String(birthDate.month).padStart(2,'0')}.${birthDate.year}`;
  const tStr = `${targetDate.day}.${String(targetDate.month).padStart(2,'0')}.${targetDate.year}`;

  // Month context
  const monthArcana = normalizeToArcana(birthDate.month + targetDate.month);
  // Year context
  const birthYearSum = birthDate.year.toString().split('').reduce((s,d)=>s+parseInt(d),0);
  const targetYearSum = targetDate.year.toString().split('').reduce((s,d)=>s+parseInt(d),0);
  const yearArcana = normalizeToArcana(birthYearSum + targetYearSum);

  const posLines = positions.map(p =>
    `  Поз.${p.position} - ${POS_TITLES[p.position]}: Аркан ${arcanaLabel(p.arcana)}`
  ).join('\n');

  return `Ты нумеролог системы Аркан-Коды. Пишешь персональный прогноз на день. Язык: русский.
${name ? `\nКЛИЕНТ: ${name}` : ''}
ДАТА РОЖДЕНИЯ: ${bStr}
ДАТА ПРОГНОЗА: ${tStr}

МАТРИЦА ДНЯ (12 позиций):
${posLines}

КОНТЕКСТ:
Аркан месяца: ${arcanaLabel(monthArcana)}
Аркан года: ${arcanaLabel(yearArcana)}

ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Конкретика: "сегодня", "этот день", конкретные советы
- Язык "вы/ваш", тепло, по-человечески
- Каждый блок отвечает на свой вопрос
- Свяжи позиции между собой - они создают единую картину дня

Верни СТРОГО JSON без markdown:
{
  "positions": {
    "1": "утро/старт: как начнётся день, внутреннее состояние при пробуждении (3-4 предложения)",
    "2": "потенциал: что доступно сегодня, скрытые ресурсы (3-4 предложения)",
    "3": "самооценка: как человек ощущает себя сегодня, внутренний диалог (3 предложения)",
    "4": "цель дня: к чему стремиться, главный фокус (3 предложения)",
    "5": "ресурс: откуда черпать энергию, что помогает (3 предложения)",
    "6": "основа: что является фундаментом этого дня (3 предложения)",
    "7": "главная задача: ключевой вызов дня (3-4 предложения)",
    "8": "способ решения: как подходить к задачам, стратегия (3 предложения)",
    "9": "результат: к чему придёт день, итог к вечеру (3 предложения)",
    "10": "подсознание: глубинные процессы, интуиция, внутренняя работа (3 предложения)",
    "11": "внешнее влияние: люди, события, обстоятельства вокруг (3 предложения)",
    "12": "кармическая задача: главный урок этого дня (3-4 предложения)"
  },
  "deepAnalysis": "глубокий разбор: как все 12 позиций складываются в единую картину дня (5-6 предложений)",
  "morning": "стратегия утра: что делать с момента пробуждения до полудня (3-4 предложения)",
  "afternoon": "стратегия дня: как провести вторую половину (3-4 предложения)",
  "evening": "стратегия вечера: как завершить день, что важно сделать (3-4 предложения)",
  "money": "деньги и финансы сегодня: возможности и на что обратить внимание (3 предложения)",
  "career": "работа и карьера: как использовать день для профессионального роста (3 предложения)",
  "relationships": "отношения сегодня: что важно в общении с близкими и коллегами (3 предложения)",
  "health": "здоровье: на что обратить внимание, что полезно сегодня (3 предложения)",
  "risks": "риски дня: чего избегать, какие ошибки типичны (2-3 предложения)",
  "opportunities": "возможности дня: что можно использовать, где открыты двери (3 предложения)",
  "practice": "практика дня: конкретное упражнение или действие (2-3 предложения, конкретно)",
  "conclusion": "итог и главный вывод дня: одна главная мысль которую нужно забрать из этого дня (2-3 предложения)"
}`;
}

export function getCachedDayReading(result: DailyForecastResult): AIDayReading | null {
  try {
    const { birthDate, targetDate } = result;
    const key = `${CACHE_PREFIX}${birthDate.day}.${birthDate.month}.${birthDate.year}_${targetDate.day}.${targetDate.month}.${targetDate.year}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as AIDayReading : null;
  } catch { return null; }
}

export async function generateDayReading(
  result: DailyForecastResult,
  name: string
): Promise<AIDayReading> {
  const { birthDate, targetDate } = result;
  const cacheKey = `${CACHE_PREFIX}${birthDate.day}.${birthDate.month}.${birthDate.year}_${targetDate.day}.${targetDate.month}.${targetDate.year}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as AIDayReading;
  } catch {}

  const apiKey = import.meta.env.VITE_AI_API_KEY || 'sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W';

  const payload = JSON.stringify({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 6000,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Отвечай только JSON. Никаких markdown-оберток, никаких пояснений.' },
      { role: 'user', content: buildPrompt(result, name) },
    ],
  });

  // proxyapi периодически флапает (Failed to fetch / 429 / 5xx). Повторяем автоматически,
  // чтобы пользователю просто работало, без кнопок. До 4 попыток с нарастающей паузой.
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
      const reading: AIDayReading = JSON.parse(cleaned);

      try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
      return reading;
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise(r => setTimeout(r, 700 * (attempt + 1)));
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error('AI request failed');
}
