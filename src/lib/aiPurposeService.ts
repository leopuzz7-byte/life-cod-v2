// ИИ-разбор Предназначения (методика 1) по расширенному ТЗ Надежды.
// Живой человечный таро-стиль, большой объём, строго без длинных тире.
// Генерация многими параллельными запросами, у каждого свой бюджет токенов.
import { PersonalMatrix } from "./calculations";
import { getArcana, positionDescriptions } from "./arcana";
import {
  computeMirrors, computeReversedOrdered, MirrorHit, ReversedHit,
  PROFESSION_CATEGORIES, posLabel, TRIANGLE_DESTINY, SOUL_GOALS, KARMA_TRIANGLE, DESTINY_SIX,
} from "./purposeExtras";

const API_KEY = import.meta.env.VITE_AI_API_KEY || "sk-fLiNqGfbS2vyJorwNtnkz1F9ftCVAz2W";
const API_URL = "https://api.proxyapi.ru/openai/v1/chat/completions";

/* ============ типы ============ */

export interface ProfGroup { group: string; items: string[] }

export interface TriangleBlock {
  positionTitle: string; arcanaName: string;
  description: string; plus: string; minus: string; task: string;
  inLife: string; inYou: string;
  strengths: string[]; weaknesses: string[];
  professions: ProfGroup[]; advice: string[]; conclusion: string;
}
export interface MatrixPositionBlock { position: number; title: string; arcanaName: string; meaning: string; inYou: string; advice: string }
export interface PeriodBlock { title: string; range: string; text: string; focus: string }
export interface PosMini { position: number; title: string; arcanaName: string; text: string; plus: string; minus: string }
export interface MirrorBlock { positions: string; arcanaName: string; kind: string; repeats: string; plus: string; minus: string; scenario: string; influence: string }
export interface ReversedBlock { arcanaName: string; intro: string; minus: string; toPlus: string; plus: string }

export interface PurposeReading {
  intro?: string;
  triangle: TriangleBlock[];
  periods?: PeriodBlock[];
  fullMatrix?: MatrixPositionBlock[];
  destinyTriangle?: { intro: string; items: PosMini[]; conclusion: string };
  soulGoals?: { intro: string; items: PosMini[]; accelerators: string; brakes: string; recommendations: string; conclusion: string };
  work?: { interaction: string; whatReveals: string; professions: { arcanaName: string; groups: ProfGroup[] }[] };
  mirrors?: { intro: string; items: MirrorBlock[] } | null;
  reversed?: { intro: string; items: ReversedBlock[]; verdict: string };
  karma?: { triangle: string; lesson: string; situations: string; helps: string; worsens: string; recommendations: string };
  final?: { intro: string; minus: string; plus: string; recommendation: string; spheres: string[]; format: string; strengths: string[]; path: string; numerologist: string };
}

/* ============ инфраструктура ============ */

const STYLE = `СТИЛЬ И ТРЕБОВАНИЯ:
Ты профессиональный таролог-нумеролог Надежда. Пиши живым, тёплым, человечным тарологическим языком, лично обращаясь к человеку на «вы».
Пиши ЩЕДРО и РАЗВЁРНУТО, это премиальный разбор. Конкретика, образность, никакой воды и общих фраз.
СТРОГО ЗАПРЕЩЕНЫ длинные тире (символы — и –). Только запятые, точки, двоеточия. Короткий дефис лишь внутри слов.
Без смайликов, без канцелярита, без кринжа. Опирайся строго на указанные арканы, их планеты и стихии, не путай их.`;

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
          temperature: 0.85, max_tokens: maxTokens,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error("empty");
      return fixDashes(JSON.parse(raw)) as T;
    } catch {
      await new Promise((r) => setTimeout(r, 900 * (attempt + 1)));
    }
  }
  return null;
}

function ctx(m: PersonalMatrix, name: string): string {
  const all = m.positions.map((n, i) => `${i + 1} (${positionDescriptions[i + 1]?.title || ""}): ${arcInfo(n)}`).join("; ");
  return `Человек${name ? ` по имени ${name}` : ""}, дата рождения ${m.birthDate.day}.${m.birthDate.month}.${m.birthDate.year}.
Матрица из 12 позиций: ${all}.`;
}

const CATS = PROFESSION_CATEGORIES.join(", ");
const TRI_TITLES = ["Детство и юность (до 25 лет)", "Внутренняя суть личности", "Цель накопления мудрости (после 50 лет)"];

/* ============ генераторы ============ */

function genTriangle(m: PersonalMatrix, name: string, idx: number) {
  const n = m.positions[idx];
  return callAI<TriangleBlock>(
    `${STYLE}

${ctx(m, name)}

Подробный разбор позиции основного треугольника личности.
Позиция: ${TRI_TITLES[idx]}. Энергия: ${arcInfo(n)}.

Верни строго JSON:
{"positionTitle":"${TRI_TITLES[idx]}","arcanaName":"${n} Аркан «${getArcana(n)?.name || ""}»",
"description":"описание аркана, 8-11 предложений","plus":"в плюсе, 6-8 предложений","minus":"в минусе, 6-8 предложений",
"task":"главная задача аркана, 5-6 предложений","inLife":"как проявляется в жизни в этой позиции, 6-8 предложений",
"inYou":"как проявляется именно у вас, тёплое личное обращение, 8-11 предложений",
"strengths":["10-12 сильных сторон"],"weaknesses":["10-12 слабых сторон"],
"professions":[{"group":"категория из списка: ${CATS}","items":["6-9 профессий"]}],
"advice":["5-7 практических советов"],"conclusion":"Главный вывод, 3-4 предложения"}
В professions используй только подходящие категории из списка, 3-5 категорий.`,
    6000
  );
}

function genPeriods(m: PersonalMatrix, name: string) {
  return callAI<{ periods: PeriodBlock[] }>(
    `${STYLE}

${ctx(m, name)}

Разбор трёх жизненных периодов: до 25 лет, с 25 до 50, после 50.
JSON: {"periods":[{"title":"название","range":"возраст","text":"что происходит, какие энергии ведут, уроки и возможности, 8-10 предложений","focus":"на чём сосредоточиться, 3-4 предложения"}]} Ровно 3 периода.`,
    4500
  );
}

function genFullMatrix(m: PersonalMatrix, name: string) {
  const list = m.positions.map((n, i) => `${i + 1}. ${positionDescriptions[i + 1]?.title || ""}: ${arcInfo(n)}`).join("\n");
  return callAI<{ items: MatrixPositionBlock[] }>(
    `${STYLE}

${ctx(m, name)}

Разбери ПОЛНУЮ матрицу из 12 позиций:
${list}
JSON: {"items":[{"position":1,"title":"название","arcanaName":"N Аркан «Имя»","meaning":"значение аркана в этой позиции, 4-6 предложений","inYou":"как работает у вас, 4-6 предложений","advice":"совет, 2-3 предложения"}]} Ровно 12 объектов по порядку.`,
    9000
  );
}

function genDestinySoul(m: PersonalMatrix, name: string) {
  const dt = TRIANGLE_DESTINY.map((p) => posLabel(p, m.positions[p - 1])).join("\n");
  const sg = SOUL_GOALS.map((p) => posLabel(p, m.positions[p - 1])).join("\n");
  return callAI<{ destinyTriangle: PurposeReading["destinyTriangle"]; soulGoals: PurposeReading["soulGoals"] }>(
    `${STYLE}

${ctx(m, name)}

Два раздела.

РАЗДЕЛ А. Треугольник предназначения, позиции 2, 4, 5:
${dt}
Это то, что вы призваны реализовать. Для каждой позиции опиши энергию, в плюсе и в минусе.

РАЗДЕЛ Б. Цели и задачи души, позиции 7, 8, 9:
${sg}
7 позиция это главная цель и задача души, 8 позиция это через что реализуются цели, 9 позиция это зона комфорта. Для каждой опиши, в плюсе, в минусе.

JSON:
{"destinyTriangle":{"intro":"вступление, 3-4 предложения","items":[{"position":2,"title":"название позиции","arcanaName":"N Аркан «Имя»","text":"что вы призваны реализовать через эту энергию, 5-7 предложений","plus":"в плюсе, 2-3 предложения","minus":"в минусе, 2-3 предложения"}],"conclusion":"Главный вывод, 2-3 предложения"},
 "soulGoals":{"intro":"вступление, 3-4 предложения","items":[{"position":7,"title":"название","arcanaName":"N Аркан «Имя»","text":"описание, 5-7 предложений","plus":"в плюсе, 2-3 предложения","minus":"в минусе, 2-3 предложения"}],"accelerators":"что ускоряет выполнение предназначения, 4-6 предложений","brakes":"что тормозит реализацию, 4-6 предложений","recommendations":"практические рекомендации, 4-6 предложений","conclusion":"Главный вывод, 2-3 предложения"}}
В destinyTriangle ровно 3 объекта (позиции 2,4,5), в soulGoals ровно 3 (позиции 7,8,9).`,
    7000
  );
}

function genWork(m: PersonalMatrix, name: string) {
  const key = [2, 4, 5, 7, 8, 9].map((p) => posLabel(p, m.positions[p - 1])).join("\n");
  return callAI<{ work: PurposeReading["work"] }>(
    `${STYLE}

${ctx(m, name)}

Раздел «Взаимодействие арканов в работе и самореализации».
Ключевые арканы:
${key}
Напиши цельный живой текст о том, как эти энергии взаимодействуют в профессиональной реализации, где усиливают, где конфликтуют, какой сценарий создают. Затем блок «Какая деятельность раскрывает ваш потенциал». Затем для каждого из ключевых арканов дай подходящие профессии структурированным каталогом по категориям.

JSON:
{"work":{"interaction":"как арканы взаимодействуют в работе и самореализации, живой связный текст, 12-16 предложений","whatReveals":"какая деятельность раскрывает ваш потенциал, 6-8 предложений","professions":[{"arcanaName":"N Аркан «Имя»","groups":[{"group":"категория из списка: ${CATS}","items":["профессии"]}]}]}}
В professions по одному объекту на каждый ключевой аркан (без повторов арканов), в каждом 3-6 категорий из списка.`,
    9000
  );
}

function genMirrors(m: PersonalMatrix, name: string, mirrors: MirrorHit[]) {
  if (mirrors.length === 0) return Promise.resolve(null);
  const desc = mirrors.map((h) => `позиции ${h.a} и ${h.b} (${h.kind === "direct" ? "прямая" : "перекрёстная"} пара), одинаковый ${arcInfo(h.arcana)}`).join("; ");
  return callAI<{ intro: string; items: MirrorBlock[] }>(
    `${STYLE}

${ctx(m, name)}

Раздел «Зеркальные арканы». В матрице найдены совпадения: ${desc}.
Разбирай не аркан отдельно, а взаимодействие двух позиций: что повторяется и усиливается, плюс, минус, какой жизненный сценарий создаёт совпадение, как одна позиция влияет на другую.

JSON:
{"intro":"вводный текст про зеркальные арканы и почему они важны, 5-7 предложений",
"items":[{"positions":"позиции 4 и 7","arcanaName":"N Аркан «Имя»","kind":"прямая или перекрёстная","repeats":"что повторяется и усиливается, 3-5 предложений","plus":"как проявляется в плюсе, 3-4 предложения","minus":"как в минусе, 3-4 предложения","scenario":"какой жизненный сценарий создаёт совпадение, 3-5 предложений","influence":"как одна позиция влияет на другую, 3-4 предложения"}]}
По объекту на каждое совпадение.`,
    7000
  );
}

function genReversed(m: PersonalMatrix, name: string, reversed: ReversedHit[]) {
  const count = reversed.length;
  const desc = count
    ? reversed.map((r) => `${arcInfo(r.arcana)} (позиции ${r.positions.join(", ")}${r.inTriangle ? ", основной треугольник" : ""})`).join("; ")
    : "выраженных перевёрнутых арканов не обнаружено";
  return callAI<PurposeReading["reversed"]>(
    `${STYLE}

${ctx(m, name)}

Раздел «Перевёрнутые арканы». Обнаружено перевёрнутых арканов: ${count}. Список: ${desc}.
Сначала идут арканы основного треугольника, затем остальные. Один аркан не повторять.
Для КАЖДОГО перевёрнутого аркана дай ровно три блока: как проявляется в минусе, как перевести энергию в плюс, как проявляется в плюсе. Плюс короткое введение по аркану.
Если перевёрнутых нет, всё равно опиши 2-3 энергии матрицы, которые работают не в полную силу, в том же формате.

JSON:
{"intro":"вводный текст: в вашей матрице обнаружено ${count} перевёрнутых арканов, и пояснение про приоритет треугольника, 5-7 предложений",
"items":[{"arcanaName":"Перевёрнутый аркан N, Имя","intro":"короткое введение, 2-3 предложения","minus":"как проявляется в минусе, 5-7 предложений","toPlus":"как перевести энергию в плюс, практические рекомендации, 5-7 предложений","plus":"как проявляется в плюсе после проработки, 5-7 предложений"}],
"verdict":"Итог от нумеролога: перевёрнутый аркан это не приговор, а зона развития, 4-6 предложений"}`,
    8000
  );
}

function genKarma(m: PersonalMatrix, name: string) {
  const kt = KARMA_TRIANGLE.map((p) => posLabel(p, m.positions[p - 1])).join("\n");
  return callAI<{ karma: PurposeReading["karma"] }>(
    `${STYLE}

${ctx(m, name)}

Раздел «Кармические задачи». Кармический треугольник, позиции 10, 11, 12:
${kt}
JSON:
{"karma":{"triangle":"взаимодействие кармических энергий треугольника, что связывает эти арканы и к чему ведёт душа, 8-11 предложений","lesson":"главный кармический урок, 5-7 предложений","situations":"через какие ситуации проявляется карма, 5-7 предложений","helps":"что помогает закрыть кармические уроки, 4-6 предложений","worsens":"что усиливает кармические проблемы, 4-6 предложений","recommendations":"практические рекомендации, 4-6 предложений"}}`,
    6000
  );
}

function genFinal(m: PersonalMatrix, name: string) {
  const six = DESTINY_SIX.map((p) => posLabel(p, m.positions[p - 1])).join("\n");
  return callAI<{ intro: string; final: PurposeReading["final"] }>(
    `${STYLE}

${ctx(m, name)}

Вступление ко всему разбору и финальное экспертное заключение о взаимодействии шести позиций предназначения (2, 4, 5 треугольник предназначения и 7, 8, 9 цели души):
${six}
Это заключение объединяет всю матрицу в единый путь реализации. Сначала как взаимодействие проявляется в минусе, затем в плюсе, затем главная профессиональная рекомендация, подходящие сферы, формат работы, сильные стороны, оптимальный путь, и финальное слово нумеролога.

JSON:
{"intro":"тёплое вступление к разбору предназначения, 5-7 предложений",
"final":{"minus":"как взаимодействие шести позиций проявляется в минусе, внутренний конфликт, 7-9 предложений","plus":"как в плюсе, энергии усиливают друг друга, 7-9 предложений","recommendation":"главная профессиональная рекомендация, 5-7 предложений","spheres":["5-7 подходящих сфер деятельности"],"format":"оптимальный формат работы, 3-5 предложений","strengths":["6-8 ключевых сильных сторон"],"path":"оптимальный путь реализации, 5-7 предложений","numerologist":"финальное слово нумеролога, вдохновляющее, 5-7 предложений"}}`,
    7000
  );
}

/* ============ сборка ============ */

function cacheKey(m: PersonalMatrix): string {
  const d = m.birthDate;
  return `ai_purpose_v3_${d.day}_${d.month}_${d.year}`;
}

export async function generatePurposeReading(m: PersonalMatrix, name: string): Promise<PurposeReading> {
  const key = cacheKey(m);
  try { const c = localStorage.getItem(key); if (c) return JSON.parse(c); } catch { /* ignore */ }

  const mirrors = computeMirrors(m);
  const reversed = computeReversedOrdered(m);

  const [t0, t1, t2, periods, full, ds, work, mir, rev, karma, fin] = await Promise.all([
    genTriangle(m, name, 0), genTriangle(m, name, 1), genTriangle(m, name, 2),
    genPeriods(m, name), genFullMatrix(m, name), genDestinySoul(m, name),
    genWork(m, name), genMirrors(m, name, mirrors), genReversed(m, name, reversed),
    genKarma(m, name), genFinal(m, name),
  ]);

  const triangle = [t0, t1, t2].filter(Boolean) as TriangleBlock[];
  if (triangle.length === 0) throw new Error("purpose generation failed");

  const reading: PurposeReading = {
    intro: fin?.intro,
    triangle,
    periods: periods?.periods,
    fullMatrix: full?.items,
    destinyTriangle: ds?.destinyTriangle,
    soulGoals: ds?.soulGoals,
    work: work?.work,
    mirrors: mir,
    reversed: rev || undefined,
    karma: karma?.karma,
    final: fin?.final,
  };

  try { localStorage.setItem(key, JSON.stringify(reading)); } catch { /* ignore */ }
  return reading;
}
