import { YearForecast } from './calculations';
import { getArcana } from './arcana';
import { yearToArcana, normalizeToArcana } from './calculations';

export interface AIYearReading {
  // Аркан года и его трактовка
  arcanaOverview: string;     // полная трактовка аркана / основная энергия
  arcanaStrengths: string;    // сильные стороны
  arcanaWeaknesses: string;   // слабые стороны
  arcanaDistortions: string;  // искажения энергии
  lifeManifest: string;       // как проявляется в жизни
  // Персональный год
  intro: string;              // введение в ваш год
  atmosphere: string;         // общая атмосфера года
  money: string;              // деньги и финансы
  work: string;               // работа и реализация
  relationships: string;      // отношения
  health: string;             // здоровье
  innerState: string;         // внутреннее состояние
  opportunities: string;      // главные возможности года
  risks: string;              // главные риски года
  plusManifest: string;       // аркан в плюсе
  minusManifest: string;      // аркан в минусе
  recommendations: string;    // практические рекомендации
  conclusion: string;         // итог года
  // Расширенный VIP-анализ
  energyInteractions: string; // энергетические взаимодействия по периодам
  energyGivers: string;       // что даёт энергию
  energyTakers: string;       // что забирает энергию
  talents: string;            // таланты и возможности года
  healing: string;            // исцеляющие темы года
  exam: string;               // главный экзамен года
  tasks: string;              // задачи года
  wish: string;               // пожелание на следующий год
}

const CACHE_PREFIX = 'ai_year_v2_';
const MONTH_NAMES: Record<number, string> = {
  1:'Январь',2:'Февраль',3:'Март',4:'Апрель',5:'Май',6:'Июнь',
  7:'Июль',8:'Август',9:'Сентябрь',10:'Октябрь',11:'Ноябрь',12:'Декабрь',
};

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} - ${a.name}` : String(n);
}

function yearContext(forecast: YearForecast): string {
  const { birthDate, targetYear, arcana } = forecast;
  const birthYearArcana = yearToArcana(birthDate.year);
  const targetYearArcana = yearToArcana(targetYear);
  const a = getArcana(arcana);
  return `ДАТА РОЖДЕНИЯ: ${birthDate.day}.${birthDate.month}.${birthDate.year}
ГОД ПРОГНОЗА: ${targetYear}

РАСЧЁТ ГОДА:
Аркан года рождения: ${arcanaLabel(birthYearArcana)}
Аркан ${targetYear} года: ${arcanaLabel(targetYearArcana)}
Итоговый аркан года: ${arcanaLabel(arcana)} (планета ${a?.planet ?? '-'}, стихия ${a?.element ?? '-'})`;
}

const STYLE_RULES = `ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Никаких штампов "год трансформации", "год роста", "год возможностей"
- Сначала факт/расчёт, потом трактовка, потом практический вывод
- Конкретные рекомендации (не "занимайтесь спортом", а "плавание, ходьба, велосипед, йога")
- Каждый блок отвечает на свой вопрос и не повторяет другой
- Язык "вы/ваш", тепло, без напыщенности и эзотерических рассуждений
- События важнее философии, человек должен видеть свою жизнь`;

function buildCorePrompt(forecast: YearForecast, name: string): string {
  return `Ты нумеролог системы Аркан-Коды. Пишешь персональный годовой прогноз. Язык: русский.
${name ? `КЛИЕНТ: ${name}\n` : ''}${yearContext(forecast)}

Сначала раскрой сам аркан как архетип, затем покажи, как он будет проживаться именно этим человеком в этом году.

${STYLE_RULES}

Верни СТРОГО JSON без markdown:
{
  "arcanaOverview": "полная трактовка аркана ${arcanaLabel(forecast.arcana)} как архетипа: главная энергия и суть (5-6 предложений)",
  "arcanaStrengths": "сильные стороны этой энергии в году (4-5 предложений)",
  "arcanaWeaknesses": "слабые стороны и ловушки энергии (4-5 предложений)",
  "arcanaDistortions": "искажения энергии: как человек сам создаёт себе проблемы в минусе (4-5 предложений)",
  "lifeManifest": "как энергия проявляется в реальной жизни, через какие события (4-5 предложений)",
  "intro": "введение в ваш год: почему этот аркан пришёл сейчас, какие темы станут главными, что усилится, что уйдёт (5-6 предложений)",
  "atmosphere": "общая атмосфера года: тенденции, куда ведёт год, что растёт, что завершается (5-6 предложений)",
  "money": "деньги и финансы: возможности, риски, ошибки, конкретные способы заработка и советы (6-7 предложений)",
  "work": "работа и реализация: карьера, проекты, стоит ли менять работу, конкретные рекомендации (5-6 предложений)",
  "relationships": "отношения: отдельно для одиноких и для пар, плюсы, риски, рекомендации (6-7 предложений)",
  "health": "здоровье: чувствительные зоны, что полезно, конкретные практики под энергию аркана (5-6 предложений)",
  "innerState": "внутреннее состояние: эмоциональный фон, главный внутренний процесс года, в плюсе и в минусе (5-6 предложений)",
  "opportunities": "главные возможности года: что можно получить, какие двери открываются (5-6 предложений)",
  "risks": "главные риски года: что разрушает результаты, какие ошибки опасны (5-6 предложений)",
  "plusManifest": "аркан в плюсе: как проживать энергию правильно, что усиливает удачу (4-5 предложений)",
  "minusManifest": "аркан в минусе: ошибки, ловушки, деструктивные сценарии, признаки ухода в минус (4-5 предложений)",
  "recommendations": "практические рекомендации года: конкретно что делать и чего избегать (6-7 предложений)",
  "conclusion": "итог года: для чего дан этот год, главный урок, главный результат при правильном проживании (4-5 предложений)"
}`;
}

function buildExtendedPrompt(forecast: YearForecast, name: string): string {
  const { birthDate, arcana } = forecast;
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const p1 = normalizeToArcana(birthDate.month + m);
    const p3 = normalizeToArcana(p1 + arcana);
    return `${MONTH_NAMES[m]}: итог ${arcanaLabel(p3)}`;
  }).join('\n');

  return `Ты нумеролог системы Аркан-Коды. Пишешь расширенный VIP-анализ года. Язык: русский.
${name ? `КЛИЕНТ: ${name}\n` : ''}${yearContext(forecast)}

ИТОГОВЫЕ АРКАНЫ ПО МЕСЯЦАМ (для разбора периодов):
${monthly}

${STYLE_RULES}

Верни СТРОГО JSON без markdown:
{
  "energyInteractions": "энергетические взаимодействия года по периодам (зима, весна, лето, осень): как годовой аркан соединяется с арканами месяцев, главная точка года (7-9 предложений)",
  "energyGivers": "что будет давать вам энергию в этом году: какие месяцы и темы ресурсные (4-5 предложений)",
  "energyTakers": "что будет забирать энергию: какие месяцы и темы самые сложные (4-5 предложений)",
  "talents": "таланты и точки роста года: что раскрывается и в какие месяцы (4-5 предложений)",
  "healing": "исцеляющие темы года: что восстанавливается, какие сферы выходят из дисбаланса (4-5 предложений)",
  "exam": "главный экзамен года: ключевая проверка, главный вопрос, как пройти (5-6 предложений)",
  "tasks": "задачи года: что важно сделать, чему научиться (5-6 предложений)",
  "wish": "тёплое личное пожелание на следующий год (3-4 предложения)"
}`;
}

export function getCachedYearReading(forecast: YearForecast): AIYearReading | null {
  try {
    const key = `${CACHE_PREFIX}${forecast.birthDate.day}.${forecast.birthDate.month}.${forecast.birthDate.year}_${forecast.targetYear}`;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) as AIYearReading : null;
  } catch { return null; }
}

// Один запрос к proxyapi с авто-повтором при флапе (Failed to fetch / 429 / 5xx).
async function callAI(prompt: string, apiKey: string, maxTokens: number): Promise<Record<string, string>> {
  const payload = JSON.stringify({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: 'Отвечай только JSON. Никаких markdown-оберток, никаких пояснений.' },
      { role: 'user', content: prompt },
    ],
  });
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
      return JSON.parse(cleaned);
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise(r => setTimeout(r, 700 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('AI request failed');
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

  // Два запроса: основной разбор года и расширенный VIP-анализ. По отдельности надёжнее, чем один огромный.
  const core = await callAI(buildCorePrompt(forecast, name), apiKey, 12000);
  const ext = await callAI(buildExtendedPrompt(forecast, name), apiKey, 8000);
  const reading = { ...core, ...ext } as unknown as AIYearReading;

  try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
  return reading;
}

function birthKey(f: YearForecast): string {
  return `${f.birthDate.day}.${f.birthDate.month}.${f.birthDate.year}`;
}
