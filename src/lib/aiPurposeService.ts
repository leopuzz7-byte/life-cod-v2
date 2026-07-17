// ИИ-разбор Предназначения (методика 1) по шаблону Надежды.
// Живой человечный таро-стиль, полноценный объём, строго без длинных тире.
import { PersonalMatrix } from "./calculations";
import { getArcana } from "./arcana";

const API_KEY = import.meta.env.VITE_AI_API_KEY || "sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W";
const API_URL = "https://api.proxyapi.ru/openai/v1/chat/completions";

export interface TriangleBlock {
  positionTitle: string;
  arcanaName: string;
  planet: string;
  element: string;
  description: string;
  plus: string;
  minus: string;
  task: string;
  inLife: string;
  inYou: string;
  strengths: string[];
  weaknesses: string[];
  professions: { group: string; items: string[] }[];
  conclusion: string;
}

export interface PurposeReading {
  intro: string;
  triangle: TriangleBlock[];
  reversed: { intro: string; items: { arcanaName: string; how: string; what: string }[]; conclusion: string };
  purpose: { mission: string; soulTask: string; inPlus: string; inMinus: string; conclusion: string };
  karma: { tail: string; unfinished: string; lesson: string; conclusion: string };
  successCode: { formula: string; strengths: string[]; accelerators: string[]; brakes: string[]; conclusion: string };
  connections: { text: string; conflicts: string[]; amplifications: string[]; hidden: string[]; conclusion: string };
  final: { who: string; potential: string; risks: string; whereRealize: string; recommendation: string };
}

function cacheKey(m: PersonalMatrix): string {
  const d = m.birthDate;
  return `ai_purpose_v1_${d.day}_${d.month}_${d.year}`;
}

function arcInfo(n: number): string {
  const a = getArcana(n);
  return a ? `${n} Аркан «${a.name}» (${a.planet}, ${a.element})` : `${n} Аркан`;
}

function buildPrompt(m: PersonalMatrix, name: string): string {
  const p = m.positions;
  const triangle = [
    `Позиция 1 — Детство и юность (до 25 лет): ${arcInfo(p[0])}`,
    `Позиция 2 — Внутренняя суть личности: ${arcInfo(p[1])}`,
    `Позиция 3 — Цель накопления жизненной мудрости (после 50 лет): ${arcInfo(p[2])}`,
  ].join("\n");
  const reversed = m.reversedArcana.length
    ? m.reversedArcana.map((r) => arcInfo(r.arcana)).join("; ")
    : "нет выраженных перевёрнутых арканов";
  const success = m.successCode.map((n) => arcInfo(n)).join("; ");
  const allPos = p.map((n, i) => `${i + 1}: ${arcInfo(n)}`).join("; ");

  return `Ты профессиональный таролог-нумеролог Надежда. Составь глубокий, живой и человечный разбор Предназначения по системе 22 арканов для человека${name ? ` по имени ${name}` : ""}.

Данные матрицы:
Основной треугольник:
${triangle}
Перевёрнутые (заблокированные) арканы: ${reversed}
Код успеха (позиции 4, 5, 7, 12): ${success}
Все 12 позиций: ${allPos}

ТРЕБОВАНИЯ К ТЕКСТУ:
- Живой, тёплый, человечный тарологический стиль, как будто мастер лично говорит с человеком. Обращайся на «вы».
- Пиши подробно и щедро, полноценный объём как у эксперта, без воды, но и не кратко. Каждое описание 4-8 предложений.
- СТРОГО без длинных тире (— и –). Используй запятые, точки, двоеточия, короткий дефис только внутри слов.
- Без смайликов и кринжа. Красиво, достойно, вдохновляюще.
- Опирайся на арканы и планеты/стихии из данных, не путай их.

Верни СТРОГО JSON такого вида (все поля заполни живым текстом):
{
 "intro": "вступление про основной треугольник как фундамент личности, 3-4 предложения",
 "triangle": [
   {
     "positionTitle": "название позиции",
     "arcanaName": "N Аркан «Имя»",
     "planet": "планета",
     "element": "стихия",
     "description": "описание аркана, 5-7 предложений",
     "plus": "проявление энергии в плюсе, 3-5 предложений",
     "minus": "проявление энергии в минусе, 3-5 предложений",
     "task": "главная задача аркана, 3-4 предложения",
     "inLife": "как эта энергия проявляется в жизни в этой позиции, 3-5 предложений",
     "inYou": "как это проявляется именно у вас, личное обращение, 4-6 предложений",
     "strengths": ["8-10 сильных сторон, каждая короткой фразой"],
     "weaknesses": ["8-10 слабых сторон, каждая короткой фразой"],
     "professions": [{"group":"название сферы","items":["профессии"]}],
     "conclusion": "Главный вывод по этой позиции, 2-3 предложения"
   }
 ],
 "reversed": {"intro":"вступление про заблокированные энергии, 2-3 предложения","items":[{"arcanaName":"N Аркан «Имя»","how":"как проявляется блок, 2-3 предложения","what":"что с этим делать, 2-3 предложения"}],"conclusion":"Главный вывод, 2-3 предложения"},
 "purpose": {"mission":"предназначение, 4-6 предложений","soulTask":"главная задача души, 3-4 предложения","inPlus":"что происходит при реализации, 2-4 предложения","inMinus":"что происходит при уходе в минус, 2-4 предложения","conclusion":"Главный вывод, 2-3 предложения"},
 "karma": {"tail":"кармический хвост, 3-4 предложения","unfinished":"невыполненные задачи, 3-4 предложения","lesson":"главный урок текущего воплощения, 3-4 предложения","conclusion":"Главный вывод, 2-3 предложения"},
 "successCode": {"formula":"личная формула достижения результата, 4-6 предложений","strengths":["6-8 сильных сторон"],"accelerators":["4-6 что ускоряет реализацию"],"brakes":["4-6 что тормозит"],"conclusion":"Главный вывод, 2-3 предложения"},
 "connections": {"text":"анализ взаимодействия энергий матрицы, 4-6 предложений","conflicts":["3-5 конфликтов энергий"],"amplifications":["3-5 усилений"],"hidden":["3-5 скрытых закономерностей"],"conclusion":"Главный вывод, 2-3 предложения"},
 "final": {"who":"кто этот человек в целом, 4-6 предложений","potential":"главный потенциал, 3-4 предложения","risks":"ключевые риски, 3-4 предложения","whereRealize":"где реализуется быстрее всего, 3-4 предложения","recommendation":"главная рекомендация на жизнь, 3-5 предложений"}
}
В triangle должно быть РОВНО 3 объекта по трём позициям треугольника. Профессий дай по 2-4 сферы на позицию.`;
}

function sanitize<T>(obj: T): T {
  // подчистка длинных тире на всякий случай
  const fix = (s: string) => s.replace(/[—–]/g, ", ").replace(/\s+,/g, ",");
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return fix(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const o: Record<string, unknown> = {};
      for (const k in v as Record<string, unknown>) o[k] = walk((v as Record<string, unknown>)[k]);
      return o;
    }
    return v;
  };
  return walk(obj) as T;
}

export async function generatePurposeReading(m: PersonalMatrix, name: string): Promise<PurposeReading> {
  const key = cacheKey(m);
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }

  const prompt = buildPrompt(m, name);
  let lastErr: unknown;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
          max_tokens: 13000,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error("empty");
      const parsed = sanitize(JSON.parse(raw)) as PurposeReading;
      if (!parsed.triangle || parsed.triangle.length < 1) throw new Error("bad shape");
      try { localStorage.setItem(key, JSON.stringify(parsed)); } catch { /* ignore */ }
      return parsed;
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("purpose generation failed");
}
