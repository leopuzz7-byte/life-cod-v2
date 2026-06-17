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

const CACHE_PREFIX = 'ai_reading_v5_';

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

  return `Ты - нумеролог системы Аркан-Коды. Пишешь персональный разбор совместимости. Язык: русский.

ПАРА: ${n1} (${d1}) и ${n2} (${d2})

МАТРИЦА СОЮЗА:
${posLines}

КЛЮЧЕВЫЕ ПОЗИЦИИ ${n1.toUpperCase()}: ${p1Key}
КЛЮЧЕВЫЕ ПОЗИЦИИ ${n2.toUpperCase()}: ${p2Key}

ПРАВИЛА СТИЛЯ (обязательно):
- Имена только по именам: ${n1} и ${n2}, никогда "партнёр А/Б"
- ЗАПРЕТ на длинное тире (знак -). Только запятая или обычный дефис (-)
- В каждом тексте ровно 4-6 предложений, не меньше 4
- Каждый блок пишется СВОИМ стилем (описано ниже)
- Перекрёстные ссылки: упоминай конкретные арканы из других позиций там, где это усиливает смысл
- Не начинай каждое предложение с имени аркана или с имени партнёра, варьируй

СТИЛИ БЛОКОВ:

positions 1-3 >> НАРРАТИВНЫЙ: пиши как историю. Начинай с образа, сцены или ощущения. Не с названия аркана.
positions 4-5 >> ПСИХОЛОГИЧЕСКИЙ: внутренние процессы, мотивы, динамика изнутри. Ссылайся на поз.1-3.
position 6 >> КАРМИЧЕСКИЙ: вскрываешь скрытое, паттерны из прошлого. Образно, мистично. Связывай с поз.2.
positions 7-9 >> СТРАТЕГИЧЕСКИЙ: цели, ресурсы, конкретные шаги. Настоящее и будущее время. Опирайся на поз.4-5.
positions 10-12 >> ТРАНСФОРМАЦИОННЫЙ: тень, зеркало, скрытое - и путь через. Поз.12 - итог союза, со ссылкой на поз.2 и поз.6.
union_arcana >> ОБЗОРНЫЙ: задаёт тон разбору. Сильно и образно. Что этот союз значит в масштабе судьбы.
perspective >> ВИЗИОНЕРСКИЙ: каждый из 4 ключей со своим углом. union_arcana - судьбоносно, external - социально, goal - к горизонту, karma - про смысл встречи душ.
recommendations >> ПРЯМОЙ: конкретно и тепло, без пафоса. Почему этот совет важен именно сейчас.
analysis >> АНАЛИТИЧЕСКИЙ: психологически точно. conflict - корни и проявление в быту. strength - что делает именно их особенными. weakness - зона внимания, не приговор.

Напиши СТРОГО JSON (без markdown, без комментариев):
{
  "union_arcana": "4-5 предложений, обзорно и образно: какой союз перед нами через призму главного аркана, что это значит для ${n1} и ${n2}",
  "positions": {
    "1": "нарративно: образ или сцена притяжения - почему именно они",
    "2": "нарративно: суть связи, что скрепляет на самом глубоком уровне",
    "3": "нарративно: как эта пара выглядит снаружи, конкретные наблюдения",
    "4": "психологически: через что и почему именно это понимание пришло к ним, ссылка на поз.1-3",
    "5": "психологически: внутренняя динамика совместного движения",
    "6": "кармически: что несут из прошлого, образно и мистично, связь с поз.2",
    "7": "стратегически: общая цель, конкретно к чему идут, опора на поз.4-5",
    "8": "стратегически: инструмент - как именно эта пара двигается к результату",
    "9": "стратегически: зона восстановления - где и как пара набирает силы",
    "10": "трансформационно: зеркало - что каждый видит в другом из своего непознанного",
    "11": "трансформационно: тень союза - что скрыто и путь трансформации в ресурс",
    "12": "трансформационно итог: главный урок союза, со ссылкой на аркан союза и кармическую поз.6"
  },
  "positions_expanded": {
    "1": "психология притяжения глубже: какие внутренние паттерны сработали у каждого при встрече",
    "2": "конкретные проявления этой сути в повседневной жизни пары - в быту, в кризисах",
    "3": "что этот внешний образ говорит о самом союзе - рефлексивно",
    "4": "через какие конкретные сценарии приходит это понимание",
    "5": "к чему конкретно движутся и что тормозит или ускоряет",
    "6": "конкретные паттерны из прошлого в этом союзе и работа с ними",
    "7": "что значит эта цель в жизни каждого и как они поддерживают друг друга",
    "8": "конкретные стратегии и типичные ошибки этой пары при движении к целям",
    "9": "что разрушает их пространство безопасности и как восстанавливать",
    "10": "конкретные качества в зеркале и как работать с этим осознанно",
    "11": "конкретные сценарии тени и путь трансформации",
    "12": "как выглядит союз после пройденного урока - что изменится в каждом"
  },
  "perspective": {
    "union_arcana": "судьбоносно: что аркан союза говорит о предназначении этих отношений",
    "external": "социально: образ пары в мире - как окружение воспринимает ${n1} и ${n2} вместе",
    "goal": "к горизонту: куда конкретно ведут эти отношения в долгосрочной перспективе",
    "karma": "смысл встречи: почему именно эти двое, что стоит за этой встречей на уровне судьбы"
  },
  "recommendations": {
    "him": "главный совет ${n1} + почему это важно именно сейчас для этого союза",
    "her": "главный совет ${n2} + почему это важно именно сейчас для этого союза",
    "pair": "что развивать вместе и чего избегать - конкретно, со связью с их силой и конфликтом"
  },
  "analysis": {
    "conflict": "аналитически: главный конфликт ${n1} и ${n2} - корни и проявление в повседневных ситуациях",
    "strength": "аналитически: главная уникальная сила этого союза - что делает именно их особенными",
    "weakness": "аналитически: уязвимое место как зона внимания и роста, не приговор"
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
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 6000,
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
