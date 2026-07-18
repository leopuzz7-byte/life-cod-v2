// ИИ-разбор Предназначения (методика 1) по шаблону Надежды.
// Живой человечный таро-стиль, большой объём, строго без длинных тире.
// Генерация идёт 8 параллельными запросами, у каждого свой бюджет токенов,
// поэтому текста получается в разы больше, чем за один запрос.
import { PersonalMatrix } from "./calculations";
import { getArcana, positionDescriptions } from "./arcana";

const API_KEY = import.meta.env.VITE_AI_API_KEY || "sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W";
const API_URL = "https://api.proxyapi.ru/openai/v1/chat/completions";

export interface TriangleBlock {
  positionTitle: string;
  arcanaName: string;
  description: string;
  plus: string;
  minus: string;
  task: string;
  inLife: string;
  inYou: string;
  strengths: string[];
  weaknesses: string[];
  professions: { group: string; items: string[] }[];
  advice: string[];
  conclusion: string;
}

export interface MatrixPositionBlock {
  position: number;
  title: string;
  arcanaName: string;
  meaning: string;
  inYou: string;
  advice: string;
}

export interface PeriodBlock { title: string; range: string; text: string; focus: string }

export interface PurposeReading {
  intro?: string;
  triangle: TriangleBlock[];
  periods?: PeriodBlock[];
  fullMatrix?: MatrixPositionBlock[];
  reversed?: { intro: string; items: { arcanaName: string; how: string; what: string }[]; conclusion: string };
  purpose?: { mission: string; soulTask: string; inPlus: string; inMinus: string; signs: string[]; conclusion: string };
  karma?: { tail: string; unfinished: string; lesson: string; patterns: string[]; conclusion: string };
  successCode?: { formula: string; strengths: string[]; accelerators: string[]; brakes: string[]; steps: string[]; conclusion: string };
  connections?: { text: string; conflicts: string[]; amplifications: string[]; hidden: string[]; conclusion: string };
  final?: { who: string; potential: string; risks: string; whereRealize: string; recommendation: string };
}

const TRI_TITLES = [
  "Детство и юность (до 25 лет)",
  "Внутренняя суть личности",
  "Цель накопления мудрости (после 50 лет)",
];

const STYLE = `СТИЛЬ И ТРЕБОВАНИЯ:
Ты профессиональный таролог-нумеролог Надежда. Пиши живым, тёплым, человечным тарологическим языком, как будто лично говоришь с человеком. Обращайся на «вы».
Пиши ЩЕДРО и РАЗВЁРНУТО, это премиальный разбор на много страниц. Никакой сухости и никаких общих фраз, только конкретика и образность.
СТРОГО ЗАПРЕЩЕНЫ длинные тире (символы — и –). Используй запятые, точки, двоеточия. Короткий дефис только внутри слов.
Без смайликов, без канцелярита, без кринжа. Красиво, достойно, вдохновляюще.
Опирайся строго на указанные арканы, их планеты и стихии, не путай их и не выдумывай другие.`;

function arcInfo(n: number): string {
  const a = getArcana(n);
  return a ? `${n} Аркан «${a.name}» (планета ${a.planet}, стихия ${a.element})` : `${n} Аркан`;
}

function fixDashes<T>(obj: T): T {
  const fix = (s: string) => s.replace(/[—–]/g, ", ").replace(/\s+,/g, ",").replace(/,\s*,/g, ",");
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

async function callAI<T>(prompt: string, maxTokens: number): Promise<T | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error("empty");
      return fixDashes(JSON.parse(raw)) as T;
    } catch {
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return null;
}

function ctx(m: PersonalMatrix, name: string): string {
  const p = m.positions;
  const all = p.map((n, i) => `позиция ${i + 1} (${positionDescriptions[i + 1]?.title || ""}): ${arcInfo(n)}`).join("; ");
  const rev = m.reversedArcana.length ? m.reversedArcana.map((r) => arcInfo(r.arcana)).join("; ") : "нет выраженных";
  return `Человек${name ? ` по имени ${name}` : ""}, дата рождения ${m.birthDate.day}.${m.birthDate.month}.${m.birthDate.year}.
Матрица из 12 позиций: ${all}.
Перевёрнутые арканы: ${rev}.
Код успеха (позиции 4, 5, 7, 12): ${m.successCode.map(arcInfo).join("; ")}.`;
}

// --- отдельные генераторы, работают параллельно ---

function genTriangle(m: PersonalMatrix, name: string, idx: number) {
  const n = m.positions[idx];
  return callAI<TriangleBlock>(
    `${STYLE}

${ctx(m, name)}

Напиши МАКСИМАЛЬНО подробный разбор одной позиции основного треугольника.
Позиция: ${TRI_TITLES[idx]}. Энергия этой позиции: ${arcInfo(n)}.

Верни строго JSON:
{
 "positionTitle": "${TRI_TITLES[idx]}",
 "arcanaName": "${n} Аркан «${getArcana(n)?.name || ""}»",
 "description": "подробное описание аркана и его природы, 8-12 предложений",
 "plus": "проявление энергии в плюсе, развёрнуто, 6-9 предложений",
 "minus": "проявление энергии в минусе и теневая сторона, 6-9 предложений",
 "task": "главная задача этого аркана, 5-7 предложений",
 "inLife": "как эта энергия проявляется в жизни именно в этой позиции, 6-9 предложений",
 "inYou": "как это проявляется именно у вас, личное тёплое обращение с конкретикой, 8-12 предложений",
 "strengths": ["10-12 сильных сторон, каждая развёрнутой фразой"],
 "weaknesses": ["10-12 слабых сторон, каждая развёрнутой фразой"],
 "professions": [{"group":"название сферы","items":["6-9 профессий"]}],
 "advice": ["5-7 практических советов, что делать с этой энергией"],
 "conclusion": "Главный вывод по позиции, 3-4 предложения"
}
Профессий дай 3-5 разных сфер.`,
    6000
  );
}

function genPeriods(m: PersonalMatrix, name: string) {
  return callAI<{ periods: PeriodBlock[] }>(
    `${STYLE}

${ctx(m, name)}

Напиши разбор трёх жизненных периодов человека по его матрице: до 25 лет, с 25 до 50 лет, после 50 лет.
Верни строго JSON:
{"periods":[{"title":"название периода","range":"возраст","text":"что происходит в этот период, какие энергии ведут, какие уроки и возможности, 8-11 предложений","focus":"на чём важно сосредоточиться в этот период, 3-4 предложения"}]}
Ровно 3 периода.`,
    4500
  );
}

function genFullMatrix(m: PersonalMatrix, name: string) {
  const list = m.positions
    .map((n, i) => `${i + 1}. ${positionDescriptions[i + 1]?.title || ""}: ${arcInfo(n)}`)
    .join("\n");
  return callAI<{ items: MatrixPositionBlock[] }>(
    `${STYLE}

${ctx(m, name)}

Разбери ПОЛНУЮ матрицу из 12 позиций. Вот позиции и их арканы:
${list}

Верни строго JSON:
{"items":[{"position":1,"title":"название позиции","arcanaName":"N Аркан «Имя»","meaning":"что означает этот аркан в этой позиции, 5-7 предложений","inYou":"как это работает именно у вас, 5-7 предложений","advice":"практический совет по этой позиции, 2-3 предложения"}]}
Ровно 12 объектов, по одному на каждую позицию, по порядку.`,
    9000
  );
}

function genReversed(m: PersonalMatrix, name: string) {
  const rev = m.reversedArcana.length
    ? m.reversedArcana.map((r) => `${arcInfo(r.arcana)} на позициях ${r.positions.join(", ")}`).join("; ")
    : "выраженных перевёрнутых арканов нет";
  return callAI<PurposeReading["reversed"]>(
    `${STYLE}

${ctx(m, name)}

Разбери перевёрнутые (заблокированные) арканы: ${rev}.
Если выраженных перевёрнутых арканов нет, всё равно напиши раздел о том, какие энергии матрицы работают не в полную силу и почему, и дай 2-3 таких энергии в items.

Верни строго JSON:
{"intro":"вступление про заблокированные энергии и что это значит, 5-7 предложений","items":[{"arcanaName":"N Аркан «Имя»","how":"как проявляется блок в жизни, конкретно и образно, 5-7 предложений","what":"что с этим делать, практическая проработка, 5-7 предложений"}],"conclusion":"Главный вывод, 3-4 предложения"}`,
    5000
  );
}

function genPurposeKarma(m: PersonalMatrix, name: string) {
  return callAI<{ purpose: PurposeReading["purpose"]; karma: PurposeReading["karma"] }>(
    `${STYLE}

${ctx(m, name)}

Напиши два больших раздела: Цель жизни и Кармические задачи.
Опирайся на позицию 7 (цель жизни) ${arcInfo(m.positions[6])}, позицию 10 (невыполненные задачи) ${arcInfo(m.positions[9])}, позицию 11 (ошибки прошлого) ${arcInfo(m.positions[10])} и позицию 12 (главная кармическая задача) ${arcInfo(m.positions[11])}.

Верни строго JSON:
{"purpose":{"mission":"предназначение развёрнуто, 9-12 предложений","soulTask":"главная задача души, 6-8 предложений","inPlus":"что происходит в жизни при реализации предназначения, 5-7 предложений","inMinus":"что происходит при уходе в минус, 5-7 предложений","signs":["5-7 признаков того, что вы идёте своим путём"],"conclusion":"Главный вывод, 3-4 предложения"},
 "karma":{"tail":"кармический хвост, что тянется из прошлого, 7-9 предложений","unfinished":"невыполненные задачи, 6-8 предложений","lesson":"главный урок текущего воплощения, 6-8 предложений","patterns":["5-7 повторяющихся сценариев, которые важно заметить"],"conclusion":"Главный вывод, 3-4 предложения"}}`,
    7000
  );
}

function genSuccessConnections(m: PersonalMatrix, name: string) {
  return callAI<{ successCode: PurposeReading["successCode"]; connections: PurposeReading["connections"] }>(
    `${STYLE}

${ctx(m, name)}

Напиши два больших раздела: Код успеха и Связки позиций.
Код успеха строй на позициях 4, 5, 7, 12: ${m.successCode.map(arcInfo).join("; ")}.
В связках проанализируй, как энергии позиций матрицы взаимодействуют между собой, где усиливают друг друга, а где конфликтуют.

Верни строго JSON:
{"successCode":{"formula":"личная формула достижения результата, развёрнуто и конкретно, 9-12 предложений","strengths":["7-9 сильных сторон"],"accelerators":["6-8 что ускоряет реализацию"],"brakes":["6-8 что тормозит"],"steps":["5-7 конкретных шагов, с чего начать"],"conclusion":"Главный вывод, 3-4 предложения"},
 "connections":{"text":"анализ взаимодействия энергий матрицы, 9-12 предложений","conflicts":["4-6 конфликтов энергий с пояснением"],"amplifications":["4-6 усилений с пояснением"],"hidden":["4-6 скрытых закономерностей"],"conclusion":"Главный вывод, 3-4 предложения"}}`,
    7000
  );
}

function genFinal(m: PersonalMatrix, name: string) {
  return callAI<{ intro: string; final: PurposeReading["final"] }>(
    `${STYLE}

${ctx(m, name)}

Напиши вступление ко всему разбору и профессиональное итоговое заключение.
Заключение это не пересказ разделов, а взгляд мастера на человека целиком.

Верни строго JSON:
{"intro":"тёплое вступление к разбору предназначения, 5-7 предложений",
 "final":{"who":"кто этот человек в целом, портрет личности, 9-12 предложений","potential":"главный потенциал, 6-8 предложений","risks":"ключевые риски, 6-8 предложений","whereRealize":"где реализуется быстрее всего, 6-8 предложений","recommendation":"главная рекомендация на жизнь, 7-9 предложений"}}`,
    6000
  );
}

function cacheKey(m: PersonalMatrix): string {
  const d = m.birthDate;
  return `ai_purpose_v2_${d.day}_${d.month}_${d.year}`;
}

export async function generatePurposeReading(m: PersonalMatrix, name: string): Promise<PurposeReading> {
  const key = cacheKey(m);
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch { /* ignore */ }

  const [t0, t1, t2, periods, full, reversed, pk, sc, fin] = await Promise.all([
    genTriangle(m, name, 0),
    genTriangle(m, name, 1),
    genTriangle(m, name, 2),
    genPeriods(m, name),
    genFullMatrix(m, name),
    genReversed(m, name),
    genPurposeKarma(m, name),
    genSuccessConnections(m, name),
    genFinal(m, name),
  ]);

  const triangle = [t0, t1, t2].filter(Boolean) as TriangleBlock[];
  if (triangle.length === 0) throw new Error("purpose generation failed");

  const reading: PurposeReading = {
    intro: fin?.intro,
    triangle,
    periods: periods?.periods,
    fullMatrix: full?.items,
    reversed: reversed || undefined,
    purpose: pk?.purpose,
    karma: pk?.karma,
    successCode: sc?.successCode,
    connections: sc?.connections,
    final: fin?.final,
  };

  try { localStorage.setItem(key, JSON.stringify(reading)); } catch { /* ignore */ }
  return reading;
}
