import { CompatibilityResult } from './calculations';
import { getArcana } from './arcana';

export interface AIReading {
  union_arcana: string;
  positions: Record<string, string>;          // "1".."12" → краткий текст
  positions_expanded: Record<string, string>; // "1".."12" → глубокий разбор
  perspective: {
    union_arcana: string;
    external: string;
    goal: string;
    karma: string;
  };
  recommendations: {
    him: string;
    her: string;
    pair: string;
  };
  analysis?: {
    conflict: string;
    strength: string;
    weakness: string;
  };
}

const CACHE_PREFIX = 'ai_reading_v4_';

function buildCacheKey(result: CompatibilityResult): string {
  const { person1, person2 } = result;
  return `${CACHE_PREFIX}${person1.name}_${person1.birthDate.day}.${person1.birthDate.month}.${person1.birthDate.year}_${person2.name}_${person2.birthDate.day}.${person2.birthDate.month}.${person2.birthDate.year}`;
}

function formatDate(d: { day: number; month: number; year: number }): string {
  return `${String(d.day).padStart(2, '0')}.${String(d.month).padStart(2, '0')}.${d.year}`;
}

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} — ${a.name}` : String(n);
}

const POSITION_TITLES: Record<number, string> = {
  1: 'Начало союза',
  2: 'Суть союза',
  3: 'Пара вовне',
  4: 'Мудрость отношений',
  5: 'Совместный путь',
  6: 'Основа / Карма',
  7: 'Общая цель',
  8: 'Инструмент',
  9: 'Зона комфорта',
  10: 'Зеркало',
  11: 'Обратная сторона',
  12: 'Итог — главная задача',
};

function buildPrompt(result: CompatibilityResult): string {
  const n1 = result.person1.name || 'Партнёр А';
  const n2 = result.person2.name || 'Партнёр Б';
  const d1 = formatDate(result.person1.birthDate);
  const d2 = formatDate(result.person2.birthDate);
  const union = result.unionMatrix?.positions ?? [];
  const p1 = result.matrix1?.positions ?? [];
  const p2 = result.matrix2?.positions ?? [];

  const posLines = union
    .map((v, i) => `  Поз.${i + 1} (${POSITION_TITLES[i + 1]}): Аркан ${arcanaLabel(v)}`)
    .join('\n');

  const p1Key = [0,1,2,3,5,6,11].map(i => `Поз.${i+1}: ${arcanaLabel(p1[i])}`).join(', ');
  const p2Key = [0,1,2,3,5,6,11].map(i => `Поз.${i+1}: ${arcanaLabel(p2[i])}`).join(', ');

  return `Ты — нумеролог системы Аркан-Коды. Пишешь персональный разбор совместимости. Язык: русский.

СТИЛЬ:
- Обращайся к паре только по именам "${n1}" и "${n2}", никогда "партнёр А/Б"
- Формула: ФАКТ (аркан, позиция) → ЗНАЧЕНИЕ → ПЛЮС / МИНУС → ВЫВОД для этой конкретной пары
- Тепло, психологично, с образами таро. Конкретно, без банальностей
- Каждый текст: 2-3 содержательных предложения (не больше, не меньше)
- Не используй длинное тире (—): вместо него запятая или обычный дефис (-)
- Перекрёстно ссылайся на обе личные матрицы: "У ${n1} стоит Аркан X, а у ${n2} — Y, и это создаёт..."

ПАРА: ${n1} (${d1}) и ${n2} (${d2})

МАТРИЦА СОЮЗА:
${posLines}

КЛЮЧЕВЫЕ ПОЗИЦИИ ${n1.toUpperCase()}: ${p1Key}
КЛЮЧЕВЫЕ ПОЗИЦИИ ${n2.toUpperCase()}: ${p2Key}

ВАЖНО:
- positions: 2-3 живых предложения, личных. Начинай по-разному — не всегда с имени аркана. Используй имена партнёров.
- positions_expanded: 3-5 предложений ГЛУБЖЕ — психология, конкретные проявления, логично продолжает краткий текст. БЕЗ шаблона "В прямом положении / В минусе". Живо, как история.

Напиши СТРОГО JSON (без markdown):
{
  "union_arcana": "2-3 предложения о главном аркане союза — что он означает именно для ${n1} и ${n2}",
  "positions": {
    "1": "как ${n1} и ${n2} пришли друг к другу — первый контакт, что зацепило",
    "2": "что скрепляет на глубинном уровне — суть их связи",
    "3": "как эту пару воспринимают снаружи",
    "4": "к какому пониманию должны прийти в отношениях",
    "5": "что строят вместе — общее движение",
    "6": "что из прошлого несут оба — кармический вызов",
    "7": "зачем встретились с точки зрения судьбы",
    "8": "как пара достигает целей",
    "9": "где восстанавливаются — безопасное пространство пары",
    "10": "что каждый отражает в другом",
    "11": "теневая сторона — что скрыто и может проявиться",
    "12": "финальный урок — ради чего пришли друг к другу"
  },
  "positions_expanded": {
    "1": "психология притяжения: что конкретно сработало внутри каждого при встрече, какие паттерны, как это ощущалось",
    "2": "конкретные проявления этой связи — в быту, в кризисах, что на самом деле держит вместе",
    "3": "как окружающие реагируют на эту пару — примеры, что это говорит о самом союзе",
    "4": "через какие конкретные ситуации приходит это понимание, какие уроки",
    "5": "к чему реально движутся, что может мешать этому движению и что помогает",
    "6": "конкретные сценарии из прошлого, которые всплывают в этом союзе — как работать с ними",
    "7": "что значит эта цель в жизни каждого из них, через что они к ней идут вместе",
    "8": "конкретные стратегии и типичные ошибки этой пары при движении к целям",
    "9": "что разрушает их безопасное пространство и как его восстановить",
    "10": "какие качества каждый видит в партнёре, которые на самом деле его собственные — зеркало",
    "11": "конкретные сценарии, где проявляется тень — и как трансформировать эту энергию в ресурс",
    "12": "как выглядит трансформация после пройденного урока — что изменится в каждом"
  },
  "perspective": {
    "union_arcana": "вывод про аркан союза — что он говорит о судьбе этих отношений",
    "external": "как мир видит ${n1} и ${n2} как пару, их образ снаружи",
    "goal": "куда ведут отношения, общая цель на горизонте",
    "karma": "глубинный кармический смысл — почему именно эти двое"
  },
  "recommendations": {
    "him": "конкретный совет для ${n1} в этих отношениях — 1-2 предложения",
    "her": "конкретный совет для ${n2} в этих отношениях — 1-2 предложения",
    "pair": "совет паре вместе — что развивать, чего избегать"
  },
  "analysis": {
    "conflict": "главный психологический конфликт ${n1} и ${n2} — откуда он идёт и как проявляется",
    "strength": "главная сила этого союза — что объединяет и делает их особенными вместе",
    "weakness": "уязвимое место союза — что может разрушить, если не работать с этим"
  }
}`;
}

export async function generateAIReading(result: CompatibilityResult): Promise<AIReading> {
  const cacheKey = buildCacheKey(result);

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as AIReading;
  } catch {}

  const apiKey = import.meta.env.VITE_AI_API_KEY || 'sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W';
  if (!apiKey) throw new Error('AI API key not configured');

  const response = await fetch('https://api.proxyapi.ru/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 4000,
      messages: [
        {
          role: 'system',
          content: 'Отвечай только JSON. Никаких markdown-обёрток, никаких пояснений.',
        },
        { role: 'user', content: buildPrompt(result) },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? '';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const reading: AIReading = JSON.parse(cleaned);

  try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
  return reading;
}
