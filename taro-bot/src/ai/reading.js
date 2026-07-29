// Все ИИ-генерации бота. Тон: живой таролог-психолог, обращение на «ты» через глаголы,
// само местоимение «ты» использовать умеренно. Загадочно, психологично, по-человечески.
// Строго без длинных тире и стрелок.
const { getArcana, positionTitles } = require("../engine/arcana");
const { sphereCards } = require("../engine/spheres");
const config = require("../bot/config");

function clean(s) {
  return String(s || "").replace(/[—–]/g, ", ").replace(/→/g, " ")
    .replace(/\s+,/g, ",").replace(/,\s*,/g, ",").trim();
}
function arcInfo(n) {
  const a = getArcana(n);
  return a ? `${n} Аркан «${a.name}» (планета ${a.planet}, стихия ${a.element})` : `${n} Аркан`;
}

const VOICE = `Ты Надежда, таролог и психолог с опытом более 10 лет. Говоришь живо, тепло, по-человечески, обращаешься на «ты», но мягко.
ВАЖНО про стиль: обращение на «ты» передавай через глаголы (видишь, чувствуешь, идёшь), а само местоимение «ты, тебя, твой» используй умеренно, не в каждом предложении. Текст должен звучать легко, без частокола местоимений.
Голос загадочный, тонкий, психологичный, будто видишь человека насквозь, чтобы возникло чувство «откуда ты знаешь». Пиши так, чтобы попадало в сердце.
Без воды и общих фраз. СТРОГО ЗАПРЕЩЕНЫ длинные тире (— и –) и стрелки, только запятые, точки, двоеточия, союзы. Без смайликов.
Опирайся строго на указанные арканы, их планеты и стихии, ничего не выдумывай сверху.`;

async function callAI(prompt, maxTokens, json = true) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const body = { model: config.ai.model, messages: [{ role: "user", content: prompt }], temperature: 0.92, max_tokens: maxTokens };
      if (json) body.response_format = { type: "json_object" };
      const res = await fetch(config.ai.url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.ai.key}` }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error("empty");
      if (!json) return clean(raw);
      const parsed = JSON.parse(raw);
      for (const k of Object.keys(parsed)) if (typeof parsed[k] === "string") parsed[k] = clean(parsed[k]);
      return parsed;
    } catch (e) { if (attempt === 2) return null; await new Promise((r) => setTimeout(r, 800 * (attempt + 1))); }
  }
  return null;
}

// ---- ТАРО ----
// Короткое толкование вытянутой карты по вопросу (крючок).
async function generateTarotReveal(arcanaNum, question) {
  const prompt = `${VOICE}

Человек мысленно задал вопрос: "${question}".
Ему выпала карта ${arcInfo(arcanaNum)}.

Дай короткое толкование этой карты именно по его вопросу. 3-4 предложения, остро, лично, чтобы ёкнуло. Не давай советов на будущее, только точное попадание в момент. Верни строго JSON:
{ "text": "толкование 3-4 предложения", "hook": "1 фраза, что это лишь верхний слой, а причины и финал откроет полный расклад" }`;
  return callAI(prompt, 600);
}

// Глубокий разбор по теме после подписки (без матрицы).
async function generateTarotDeep(arcanaNum, question, themeLabel) {
  const prompt = `${VOICE}

Тема: ${themeLabel}. Вопрос человека: "${question}". Ведущая карта: ${arcInfo(arcanaNum)}.
Сделай глубокий тёплый разбор по этой теме, как таролог-психолог. Погрузи в тему, чтобы отозвалось, поддержи. Верни строго JSON:
{
  "opening": "2-3 предложения, назови то, что человек сейчас чувствует по теме, чтобы узнал себя",
  "insight": "4-5 предложений, глубокий разбор через карту, психологично и образно",
  "advice": "2-3 предложения мягкой поддержки и подсказки, что делать",
  "closing": "2 предложения, тепло закрой и намекни, что глубже можно пойти в полном раскладе, у методик в калькуляторе и на консультации"
}`;
  return callAI(prompt, 1600);
}

// ---- НУМЕРОЛОГИЯ ----
async function generateSpheres(matrix, name) {
  const cards = sphereCards(matrix);
  const list = cards.map((c) => `${c.label}: ${arcInfo(c.n)}`).join("; ");
  const prompt = `${VOICE}

Человек${name ? ` по имени ${name}` : ""}, дата рождения ${matrix.birthDate.day}.${matrix.birthDate.month}.${matrix.birthDate.year}.
Три карты по сферам: ${list}.
Сделай короткий живой разбор по трём сферам. К каждой дай разный человечный заход, будто только всмотрелась в карту. Верни строго JSON:
{ "preface": "1 тёплая фраза вступления", "love_lead": "живой заход к отношениям", "love": "2-3 предложения про отношения по аркану", "money_lead": "заход к деньгам", "money": "2-3 предложения про деньги", "path_lead": "заход к пути", "path": "2-3 предложения про путь" }`;
  return callAI(prompt, 1100);
}

async function generateDeep(matrix, name, sphereLabel, concern) {
  const p = matrix.positions;
  const focus = concern && concern !== "Просто интересно"
    ? `Особенно волнует: «${concern}». Мягко попади в это, поддерживая.`
    : `Пришёл из интереса, без острой боли. Открой в сфере что-то неожиданное.`;
  const prompt = `${VOICE}

Человек${name ? ` по имени ${name}` : ""}. Тема: ${sphereLabel}. Суть ${arcInfo(p[1])}, цель ${arcInfo(p[6])}. ${focus}
Сделай глубокий тёплый разбор по теме, без полной матрицы. Верни строго JSON:
{ "opening": "2-3 предложения узнавания", "insight": "4-5 предложений глубокого разбора", "advice": "2-3 предложения поддержки", "closing": "2 предложения, намёк идти глубже со мной" }`;
  return callAI(prompt, 1600);
}

// ---- ЧАТ ----
async function generateChatReply(history, userMsg, matrix, name) {
  const p = matrix ? matrix.positions : null;
  const ctx = matrix ? `Контекст: человек${name ? ` по имени ${name}` : ""}. Суть ${arcInfo(p[1])}, цель ${arcInfo(p[6])}.` : "";
  const hist = (history || []).slice(-6).map((m) => `${m.role === "user" ? "Человек" : "Ты"}: ${m.content}`).join("\n");
  const prompt = `${VOICE}
Ведёшь живой диалог как таролог Надежда. Отвечай коротко, 2-4 предложения, тепло и точно.
${ctx}
${hist ? "История:\n" + hist + "\n" : ""}Человек написал: "${userMsg}"
Ответь одним живым сообщением, без JSON, просто текст.`;
  return callAI(prompt, 500, false);
}

module.exports = { generateTarotReveal, generateTarotDeep, generateSpheres, generateDeep, generateChatReply };
