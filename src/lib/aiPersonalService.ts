import { CompatibilityResult } from './calculations';
import { getArcana } from './arcana';

export interface PersonalReading {
  intro: string;
  positions: Record<string, string>;           // "1".."12" -> 4-5 sentences
  positions_expanded: Record<string, string>;  // "1".."12" -> deeper
  cross_positions: Record<string, string>;     // "1".."12" -> "В отношениях" tab
}

const CACHE_PREFIX = 'ai_personal_v2_';

function buildCacheKey(result: CompatibilityResult, person: 1 | 2): string {
  const s = person === 1 ? result.person1 : result.person2;
  const p = person === 1 ? result.person2 : result.person1;
  return `${CACHE_PREFIX}${s.name}_${s.birthDate.day}.${s.birthDate.month}.${s.birthDate.year}_with_${p.name}_${p.birthDate.day}.${p.birthDate.month}.${p.birthDate.year}`;
}

function formatDate(d: { day: number; month: number; year: number }): string {
  return `${String(d.day).padStart(2, '0')}.${String(d.month).padStart(2, '0')}.${d.year}`;
}

function arcanaLabel(n: number): string {
  const a = getArcana(n);
  return a ? `${n} - ${a.name}` : String(n);
}

const PERSONAL_POSITION_TITLES: Record<number, string> = {
  1: 'Начало пути',
  2: 'Суть личности',
  3: 'Проявление вовне',
  4: 'Точка опоры',
  5: 'Природный талант',
  6: 'Кармический вызов',
  7: 'Жизненная цель',
  8: 'Инструмент достижения',
  9: 'Зона комфорта',
  10: 'Кармическое зеркало',
  11: 'Теневая сторона',
  12: 'Главная миссия',
};

function buildPrompt(result: CompatibilityResult, person: 1 | 2): string {
  const subjectData = person === 1 ? result.person1 : result.person2;
  const partnerData = person === 1 ? result.person2 : result.person1;
  const personalMatrix = person === 1 ? result.matrix1 : result.matrix2;
  const crossMatrix = person === 1 ? result.cross1Matrix : result.cross2Matrix;
  const unionArcanaNum = result.unionArcana;
  const unionArcana = getArcana(unionArcanaNum);

  const n = subjectData.name || (person === 1 ? 'Партнер А' : 'Партнер Б');
  const partner = partnerData.name || (person === 1 ? 'Партнер Б' : 'Партнер А');
  const d = formatDate(subjectData.birthDate);

  const p = personalMatrix?.positions ?? [];
  const cp = crossMatrix?.positions ?? [];

  const posLines = p
    .map((v, i) => `  Поз.${i + 1} (${PERSONAL_POSITION_TITLES[i + 1]}): Аркан ${arcanaLabel(v)}`)
    .join('\n');

  const crossLines = cp
    .map((v, i) => `  Поз.${i + 1}: Аркан ${arcanaLabel(v)}`)
    .join('\n');

  return `Ты - нумеролог системы Аркан-Коды. Пишешь персональный разбор для человека в контексте его союза. Язык: русский.

ЧЕЛОВЕК: ${n} (${d})
ПАРТНЕР: ${partner}
АРКАН СОЮЗА: ${arcanaLabel(unionArcanaNum)} - ${unionArcana?.name ?? ''} (контекст: упоминай там, где это добавляет смысл)

ЛИЧНАЯ МАТРИЦА ${n.toUpperCase()}:
${posLines}

КРОСС-МАТРИЦА (${n} в отношениях с ${partner}):
${crossLines}

ПРАВИЛА СТИЛЯ (строго):
- Пиши от третьего лица. Имя ${n} упоминай только там, где без него непонятно - не в каждом предложении
- ЗАПРЕТ на длинное тире (-). Только запятая или обычный короткий дефис (-)
- В каждом тексте ровно 4-6 предложений
- Разные стили для разных групп позиций (см. ниже)
- Перекрестные ссылки между блоками: positions 4-6 ссылаются на 1-3, positions 7-9 ссылаются на 4-6, position 12 упоминает аркан союза и поз.6

СТИЛИ:

positions 1-3 >> НАРРАТИВНЫЙ: рассказывай историю формирования ${n}. Начинай с образа или ощущения, не с названия аркана. Детство, первые уроки, как складывался характер.
positions 4-6 >> ПСИХОЛОГИЧЕСКИЙ: внутренние ресурсы, опоры, вызовы. Конкретно и глубоко. Ссылайся на поз.1-3.
positions 7-9 >> СТРАТЕГИЧЕСКИЙ: цели и движение к ним. По-деловому, конкретно. Опирайся на поз.4-6.
positions 10-12 >> ТРАНСФОРМАЦИОННЫЙ: тень, зеркало, миссия. Образно и трансформационно. Поз.12 - итог, упоминает аркан союза.
intro >> ПОРТРЕТ: живой, образный портрет ${n} в контексте союза с ${partner}. Кто он/она в этих отношениях, что приносит, в чем его/её роль.
cross_positions >> КОНТЕКСТНЫЙ: как именно ${n} проживает и воспринимает союз с ${partner} через призму своей кросс-матрицы. Личный угол зрения. Что это для него/неё значит.

Напиши СТРОГО JSON (без markdown, без комментариев):
{
  "intro": "портрет ${n} в этом союзе - кто он/она здесь, что приносит в отношения с ${partner}",
  "positions": {
    "1": "нарративно: с чего начался путь ${n}, детство и первые впечатления о себе и мире",
    "2": "нарративно: суть личности ${n} - что за человек в самой глубине",
    "3": "нарративно: как ${n} проявляется снаружи, что видят другие люди",
    "4": "психологически: точка опоры ${n} - откуда берет силу, ссылка на поз.1-3",
    "5": "психологически: природный талант ${n} и как он может усилить этот союз",
    "6": "психологически: кармический вызов ${n} - что нужно проработать, связь с союзом",
    "7": "стратегически: жизненная цель ${n} - куда движется, опора на поз.4-6",
    "8": "стратегически: как ${n} достигает целей - конкретные стратегии и инструменты",
    "9": "стратегически: зона комфорта ${n} - где восстанавливается и набирает ресурс",
    "10": "трансформационно: кармическое зеркало - что ${n} видит в других из себя самого",
    "11": "трансформационно: теневая сторона ${n} и путь её трансформации в ресурс",
    "12": "трансформационно: главная миссия ${n} в этой жизни, связь с арканом союза и поз.6"
  },
  "positions_expanded": {
    "1": "глубже: конкретные паттерны из начала пути, которые ведут ${n} по сей день",
    "2": "глубже: как суть личности ${n} проявляется в близких отношениях - с ${partner} конкретно",
    "3": "глубже: что внешнее проявление ${n} говорит о его/её внутреннем мире",
    "4": "глубже: через какие конкретные ситуации ${n} обращается к своей точке опоры",
    "5": "глубже: как талант ${n} раскрывается и усиливается рядом с ${partner}",
    "6": "глубже: конкретные паттерны вызова и как работать с ними в этих отношениях",
    "7": "глубже: как союз с ${partner} помогает или осложняет жизненную цель ${n}",
    "8": "глубже: конкретные стратегии ${n} и типичные ловушки на пути к результату",
    "9": "глубже: что разрушает зону комфорта ${n} и как восстанавливать её в рамках союза",
    "10": "глубже: конкретные качества, которые ${n} проецирует на других, осознанная работа с этим",
    "11": "глубже: конкретные сценарии тени ${n} и трансформация через отношения с ${partner}",
    "12": "глубже: как выглядит реализованная миссия ${n} и что изменится в союзе когда это произойдет"
  },
  "cross_positions": {
    "1": "как ${n} воспринимает начало и основу отношений с ${partner} - его/её угол зрения",
    "2": "что для ${n} является сутью этих отношений на самом глубоком уровне",
    "3": "как ${n} видит этот союз снаружи, как представляет его в мире",
    "4": "на чем ${n} строит стабильность и опору внутри этих отношений",
    "5": "как ${n} движется вместе с ${partner}, его/её вклад в совместный путь",
    "6": "кармический вызов ${n} именно в этих отношениях - что здесь прорабатывается",
    "7": "личная цель ${n} в этом союзе - чего он/она хочет и куда движется через эти отношения",
    "8": "как ${n} достигает своего внутри союза - стратегии и инструменты в отношениях",
    "9": "где ${n} восстанавливается в рамках этого союза - зона покоя и ресурса",
    "10": "что ${n} зеркалит в ${partner} из себя самого - проекции и осознание",
    "11": "теневая сторона ${n} как она проявляется именно с ${partner}",
    "12": "главный урок ${n} в этих конкретных отношениях - что он/она здесь проходит"
  }
}`;
}

export async function generatePersonalReading(
  result: CompatibilityResult,
  person: 1 | 2
): Promise<PersonalReading> {
  const cacheKey = buildCacheKey(result, person);

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as PersonalReading;
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
      max_tokens: 7000,
      messages: [
        {
          role: 'system',
          content: 'Отвечай только JSON. Никаких markdown-оберток, никаких пояснений.',
        },
        { role: 'user', content: buildPrompt(result, person) },
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
  const reading: PersonalReading = JSON.parse(cleaned);

  try { localStorage.setItem(cacheKey, JSON.stringify(reading)); } catch {}
  return reading;
}
