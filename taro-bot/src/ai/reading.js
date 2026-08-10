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

// ---- ПЛАТНЫЙ ЦИФРОВОЙ РАСКЛАД (3 карты + уточняющие вопросы) ----
// Глубокий разбор одной карты на её позиции. Возвращает живой текст без JSON.
async function generateSpreadCard(sphereLabel, question, position, index, arcanaNum, prevNums) {
  const ordinal = ["первая", "вторая", "третья"][index] || "следующая";
  const prev = (prevNums && prevNums.length)
    ? `Предыдущие карты расклада: ${prevNums.map(arcInfo).join("; ")}. Свяжи эту карту с ними.`
    : "";
  const hook = index < 2 ? "В самом конце добавь одну короткую фразу-крючок, лёгкую интригу к следующей карте." : "Это последняя, третья карта, крючок к следующей не нужен.";
  const prompt = `${VOICE}

Ты ведёшь платный расклад Таро на трёх картах. Тема: ${sphereLabel}. Вопрос человека: "${question}".
Это ${ordinal} карта, позиция расклада: "${position}". Выпал аркан ${arcInfo(arcanaNum)}.
${prev}

Дай глубокий, конкретный и деликатный разбор именно этой карты на этой позиции по вопросу.
Пиши цельным живым текстом, 4-6 небольших абзацев по 2-4 предложения, без списков и заголовков.
Сначала попади в суть через эту карту, её планету и стихию, чтобы человек узнал себя.
Потом раскрой, что стоит за этим глубже, психологично и правдоподобно, чтобы возникло чувство «откуда ты знаешь».
Давай конкретику про поведение, чувства и динамику, а не общие слова.
${hook}
Без воды и банальностей, тепло и точно. Верни только текст разбора.`;
  return callAI(prompt, 1300, false);
}

// Финальный свод по трём картам плюс конкретный совет и тёплое послание.
async function generateSpreadFinal(sphereLabel, question, nums, positions) {
  const list = nums.map((n, i) => `${positions[i]}: ${arcInfo(n)}`).join("; ");
  const prompt = `${VOICE}

Ты завершаешь платный расклад Таро на трёх картах. Тема: ${sphereLabel}. Вопрос: "${question}".
Карты по позициям: ${list}.

Собери три карты в одну ясную историю и дай финальный свод.
Пиши цельным живым текстом, 3-4 абзаца, без списков.
Сначала свяжи три карты в единую линию и дай прямой честный ответ на вопрос.
Потом один конкретный совет, что сделать, по шагам, без размытости.
В конце короткое тёплое послание, одна-две фразы.
Без воды и общих фраз. Верни только текст.`;
  return callAI(prompt, 1100, false);
}

// Ответ на уточняющий вопрос по одной карте.
async function generateSpreadExtra(sphereLabel, mainQuestion, arcanaNum, userQuestion) {
  const prompt = `${VOICE}

Идёт платный расклад Таро. Тема: ${sphereLabel}. Основной вопрос был: "${mainQuestion}".
Человек задал уточняющий вопрос: "${userQuestion}". На него выпала одна карта: ${arcInfo(arcanaNum)}.

Дай подробный, деликатный и точный ответ строго на этот уточняющий вопрос через выпавшую карту.
Пиши цельным живым текстом, 4-6 предложений, при необходимости с мягким конкретным советом.
Отвечай прямо по сути вопроса, психологично, без воды. Верни только текст ответа.`;
  return callAI(prompt, 900, false);
}

module.exports = { generateTarotReveal, generateTarotDeep, generateSpheres, generateDeep, generateChatReply, generateSpreadCard, generateSpreadFinal, generateSpreadExtra };
