import { CompatibilityResult } from './calculations';
import { getArcana } from './arcana';

export interface PersonalReading {
  intro: string;
  positions: Record<string, string>;           // "1".."12" -> 4-5 sentences
  positions_expanded: Record<string, string>;  // "1".."12" -> deeper
  cross_positions: Record<string, string>;     // "1".."12" -> "В отношениях" tab
}

const CACHE_PREFIX = 'ai_personal_v3_';

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

  return `Ты - нумеролог системы Аркан-Коды. Пишешь глубокий персональный разбор. Язык: русский.

ЧЕЛОВЕК: ${n} (${d})
ПАРТНЕР: ${partner}
АРКАН СОЮЗА: ${arcanaLabel(unionArcanaNum)} - ${unionArcana?.name ?? ''}

ЛИЧНАЯ МАТРИЦА:
${posLines}

КРОСС-МАТРИЦА (в отношениях с ${partner}):
${crossLines}

ПРАВИЛА СТИЛЯ (нарушение = ошибка):
- Пиши от третьего лица: "он"/"она", "его"/"её", "ему"/"ей"
- Имя "${n}" используй ТОЛЬКО в поле "intro". В остальных полях - ТОЛЬКО местоимения
- НИКОГДА не ставь имя в косвенные падежи. ЗАПРЕЩЕНО: "вызов ${n}", "талант ${n}", "цель ${n}". ПРАВИЛЬНО: "его вызов", "её цель"
- ЗАПРЕТ на длинное тире. Только запятая или короткий дефис (-)
- Каждый текст: 5-7 предложений. Конкретно, глубоко, не банально
- Перекрестные ссылки: pos 4-6 ссылаются на 1-3, pos 7-9 на 4-6, pos 12 упоминает аркан союза

СТИЛИ:
positions 1-3 >> НАРРАТИВНЫЙ: история формирования. Начинай с образа или ощущения, не с названия аркана. Детство, первые уроки, характер.
positions 4-6 >> ПСИХОЛОГИЧЕСКИЙ: внутренние ресурсы и вызовы. Конкретные механизмы психики. Ссылка на 1-3.
positions 7-9 >> СТРАТЕГИЧЕСКИЙ: цели и путь к ним. Практично и по делу. Опора на 4-6.
positions 10-12 >> ТРАНСФОРМАЦИОННЫЙ: тень, зеркало, миссия. Образно. Pos 12 связывает с арканом союза.
intro >> ПОРТРЕТ: живой образный портрет ${n} в контексте союза с ${partner}. Кто он/она в этих отношениях, что приносит.
cross_positions >> КОНТЕКСТНЫЙ: как воспринимает и проживает союз с ${partner} через призму кросс-матрицы. Личный угол.

Напиши СТРОГО JSON (без markdown, без комментариев):
{
  "intro": "живой портрет ${n} в союзе с ${partner}: кто он/она здесь, что приносит, какова роль",
  "positions": {
    "1": "нарративно: с чего начался путь, детство, первые ощущения себя и мира (только он/она)",
    "2": "нарративно: суть личности в глубине, что за человек на самом деле (только он/она)",
    "3": "нарративно: как проявляется снаружи, что видят другие люди (только он/она)",
    "4": "психологически: откуда черпает силу, конкретные опоры и механизмы (ссылка на 1-3)",
    "5": "психологически: природный талант и как он усиливает союз с ${partner}",
    "6": "психологически: кармический вызов - что прорабатывается, связь с союзом (его/её вызов)",
    "7": "стратегически: жизненная цель - куда движется, опора на 4-6",
    "8": "стратегически: как достигает целей, конкретные стратегии и типичные ловушки",
    "9": "стратегически: зона комфорта - где восстанавливается и набирает ресурс",
    "10": "трансформационно: кармическое зеркало - что видит в других из себя самого/самой",
    "11": "трансформационно: теневая сторона и путь её трансформации в ресурс",
    "12": "трансформационно: главная миссия в жизни, связь с арканом союза и с поз.6"
  },
  "positions_expanded": {
    "1": "глубже: конкретные паттерны из начала пути, которые действуют по сей день",
    "2": "глубже: как суть личности проявляется в близких отношениях - с ${partner} конкретно",
    "3": "глубже: что внешнее проявление говорит о внутреннем мире",
    "4": "глубже: через какие конкретные ситуации обращается к своей точке опоры",
    "5": "глубже: как талант раскрывается и усиливается рядом с ${partner}",
    "6": "глубже: конкретные паттерны вызова и как работать с ними в этих отношениях",
    "7": "глубже: как союз с ${partner} помогает или осложняет движение к цели",
    "8": "глубже: конкретные инструменты достижения и типичные ловушки",
    "9": "глубже: что разрушает зону комфорта и как восстанавливать её внутри союза",
    "10": "глубже: конкретные качества, которые проецирует на других, осознанная работа с этим",
    "11": "глубже: конкретные сценарии тени и трансформация через отношения с ${partner}",
    "12": "глубже: как выглядит реализованная миссия и что изменится в союзе когда это произойдет"
  },
  "cross_positions": {
    "1": "как воспринимает основу отношений с ${partner} - личный угол зрения",
    "2": "что является сутью этих отношений для него/неё на самом глубоком уровне",
    "3": "как видит этот союз снаружи, как представляет его в мире",
    "4": "на чем строит стабильность и опору внутри этих отношений",
    "5": "его/её вклад в совместный путь, как движется вместе с ${partner}",
    "6": "кармический вызов именно в этих отношениях - что здесь прорабатывается",
    "7": "личная цель в этом союзе - чего хочет и куда движется через эти отношения",
    "8": "как достигает своего внутри союза - стратегии и инструменты",
    "9": "где восстанавливается в рамках этого союза - зона покоя и ресурса",
    "10": "что зеркалит в ${partner} из себя самого/самой - проекции и осознание",
    "11": "теневая сторона как проявляется именно с ${partner}",
    "12": "главный урок в этих конкретных отношениях - что он/она здесь проходит"
  }
}`;
}

export function getCachedPersonalReading(result: CompatibilityResult, person: 1 | 2): AIPersonalReading | null {
  try {
    const cached = localStorage.getItem(buildCacheKey(result, person));
    return cached ? JSON.parse(cached) as AIPersonalReading : null;
  } catch { return null; }
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
