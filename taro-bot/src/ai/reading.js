// Все ИИ-генерации бота. Тон: живой таролог-психолог, на «ты», деликатно,
// загадочно, психологично, очень по-человечески. Строго без длинных тире и стрелок.
const { getArcana, positionTitles } = require("../engine/arcana");
const { sphereCards } = require("../engine/spheres");
const config = require("../bot/config");

function clean(s) {
  return String(s || "")
    .replace(/[—–]/g, ", ").replace(/→/g, " ")
    .replace(/\s+,/g, ",").replace(/,\s*,/g, ",").trim();
}
function arcInfo(n) {
  const a = getArcana(n);
  return a ? `${n} Аркан «${a.name}» (планета ${a.planet}, стихия ${a.element})` : `${n} Аркан`;
}

const VOICE = `Ты Надежда, таролог и психолог с опытом более 10 лет. Говоришь живо, тепло, по-человечески, на «ты», мягко и уважительно, без грубого тыканья.
Голос загадочный, тонкий, психологичный. Ты будто видишь человека насквозь и говоришь то, что отзывается внутри, чтобы возникло чувство «откуда ты знаешь». Пиши так, чтобы попадало в сердце и хотелось читать дальше.
Без воды, без общих фраз, без канцелярита. Живые, тёплые, узнаваемые формулировки. СТРОГО ЗАПРЕЩЕНЫ длинные тире (— и –) и стрелки, только запятые, точки, двоеточия, союзы. Без смайликов.
Опирайся строго на указанные арканы, их планеты и стихии, ничего не выдумывай сверху.`;

async function callAI(prompt, maxTokens, json = true) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const body = { model: config.ai.model, messages: [{ role: "user", content: prompt }], temperature: 0.92, max_tokens: maxTokens };
      if (json) body.response_format = { type: "json_object" };
      const res = await fetch(config.ai.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.ai.key}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content;
      if (!raw) throw new Error("empty");
      if (!json) return clean(raw);
      const parsed = JSON.parse(raw);
      for (const k of Object.keys(parsed)) if (typeof parsed[k] === "string") parsed[k] = clean(parsed[k]);
      return parsed;
    } catch (e) {
      if (attempt === 2) return null;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return null;
}

// 1) Мини-разбор по трём сферам: предисловие + к каждой сфере живой человечный заход и разбор.
async function generateSpheres(matrix, name) {
  const cards = sphereCards(matrix);
  const list = cards.map((c) => `${c.label}: ${arcInfo(c.n)}`).join("; ");
  const prompt = `${VOICE}

Человек${name ? ` по имени ${name}` : ""}, дата рождения ${matrix.birthDate.day}.${matrix.birthDate.month}.${matrix.birthDate.year}.
Три карты по сферам: ${list}.

Сделай короткий, но живой разбор по этим трём сферам. К каждой сфере дай отдельный человечный заход, будто ты только что всмотрелась в карту (например: «Первое, что бросилось мне в глаза», «Знаешь, что меня зацепило», «А вот здесь я задержалась»). Заходы должны быть РАЗНЫЕ, живые, тёплые.
Верни строго JSON:
{
  "preface": "1 короткая тёплая фраза вступления, будто карты только легли",
  "love_lead": "живой человечный заход к сфере отношений",
  "love": "2-3 предложения про отношения по её аркану, узнаваемо, чтобы ёкнуло",
  "money_lead": "живой заход к сфере денег и дела",
  "money": "2-3 предложения про деньги и реализацию по её аркану",
  "path_lead": "живой заход к сфере пути и силы",
  "path": "2-3 предложения про путь и предназначение по её аркану"
}`;
  return callAI(prompt, 1100);
}

// 2) Глубокий разбор по выбранной сфере и боли (без полной матрицы), даётся после подписки.
async function generateDeep(matrix, name, sphereLabel, concern) {
  const cards = sphereCards(matrix);
  const card = cards.find((c) => c.label === sphereLabel) || cards[0];
  const p = matrix.positions;
  const support = `Дополнительно вижу: суть ${arcInfo(p[1])}, точка опоры ${arcInfo(p[5])}, цель ${arcInfo(p[6])}.`;
  const focus = concern && concern !== "Просто интересно"
    ? `Человека сейчас особенно волнует: «${concern}». Мягко и точно попади в это, не пугая, а поддерживая.`
    : `Человек пришёл из интереса, без острой боли. Открой в этой сфере что-то неожиданное и притягательное.`;
  const prompt = `${VOICE}

Человек${name ? ` по имени ${name}` : ""}, дата рождения ${matrix.birthDate.day}.${matrix.birthDate.month}.${matrix.birthDate.year}.
Тема разбора: ${sphereLabel}. Карта этой сферы: ${arcInfo(card.n)}. ${support}
${focus}

Сделай глубокий тёплый разбор по этой теме, как таролог-психолог. Погрузи человека в его тему, чтобы отозвалось. Не давай полную матрицу, говори только по этой сфере.
Верни строго JSON:
{
  "opening": "2-3 предложения, тепло назови то, что человек чувствует по этой теме, чтобы он узнал себя",
  "insight": "4-5 предложений, глубокий разбор по этой сфере через её аркан, психологично и образно",
  "advice": "2-3 предложения мягкой поддержки и подсказки, что с этим делать",
  "closing": "2 предложения, тепло закрой и намекни, что дальше можно пойти глубже со мной, в разборах и на консультации"
}`;
  return callAI(prompt, 1600);
}

// 3) Ответ ИИ-таролога в чате.
async function generateChatReply(history, userMsg, matrix, name) {
  const p = matrix ? matrix.positions : null;
  const ctx = matrix
    ? `Контекст: человек${name ? ` по имени ${name}` : ""}. Суть ${arcInfo(p[1])}, цель ${arcInfo(p[6])}.`
    : "";
  const hist = (history || []).slice(-6).map((m) => `${m.role === "user" ? "Человек" : "Ты"}: ${m.content}`).join("\n");
  const prompt = `${VOICE}
Ты ведёшь живой диалог как таролог Надежда. Отвечай коротко и по делу, 2-4 предложения, тепло и точно.
${ctx}
${hist ? "История:\n" + hist + "\n" : ""}Человек написал: "${userMsg}"
Ответь одним живым сообщением, без JSON, без списков, просто текст.`;
  return callAI(prompt, 500, false);
}

// 4) Короткий разбор дня.
async function generateDayReading(matrix, name) {
  const p = matrix.positions;
  const d = new Date();
  const prompt = `${VOICE}

Человек${name ? ` по имени ${name}` : ""}. Суть ${arcInfo(p[1])}, точка опоры ${arcInfo(p[5])}. Сегодня ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}.
Дай короткий тёплый разбор дня, 3-4 предложения. Верни строго JSON:
{ "text": "разбор дня одним живым абзацем", "hook": "1 короткая фраза, чтобы захотелось вернуться завтра" }`;
  return callAI(prompt, 500);
}

module.exports = { generateSpheres, generateDeep, generateChatReply, generateDayReading };
