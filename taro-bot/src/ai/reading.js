// Все ИИ-генерации бота. Тон: живой таролог-психолог, обращение на «ты» через глаголы,
// само местоимение «ты» использовать умеренно. Загадочно, психологично, по-человечески.
// Строго без длинных тире и стрелок.
const { getArcana, positionTitles } = require("../engine/arcana");
const { sphereCards } = require("../engine/spheres");
const config = require("../bot/config");

function clean(s) {
  return String(s || "").replace(/[—–]/g, ", ").replace(/→/g, " ")
    .replace(/\s+,/g, ",").replace(/,\s*,/g, ",").replace(/,[ \t]+/g, ", ").replace(/[ \t]{2,}/g, " ").trim();
}
function arcInfo(n) {
  const a = getArcana(n);
  return a ? `${n} Аркан «${a.name}» (планета ${a.planet}, стихия ${a.element})` : `${n} Аркан`;
}

const VOICE = `Ты Надежда, таролог и психолог с опытом более 10 лет. Говоришь живо, тепло, по-человечески, обращаешься на «ты», но мягко.
ВАЖНО про стиль: обращение на «ты» передавай через глаголы (видишь, чувствуешь, идёшь), а само местоимение «ты, тебя, твой» используй умеренно, не в каждом предложении. Текст должен звучать легко, без частокола местоимений.
Голос загадочный, тонкий, психологичный, будто видишь человека насквозь, чтобы возникло чувство «откуда ты знаешь». Пиши так, чтобы попадало в сердце.
Без воды и общих фраз. СТРОГО ЗАПРЕЩЕНЫ длинные тире (— и –) и стрелки, только запятые, точки, двоеточия, союзы. Без смайликов.
Опирайся строго на указанные карты, их масти, планеты и стихии, ничего не выдумывай сверху.`;

async function callAI(prompt, maxTokens, json = true, temperature = 0.92) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const body = { model: config.ai.model, messages: [{ role: "user", content: prompt }], temperature, max_tokens: maxTokens };
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
async function generateTarotReveal(cardDesc, question) {
  const prompt = `${VOICE}

Человек мысленно задал вопрос: "${question}".
Ему выпала карта: ${cardDesc}.

Дай короткое толкование этой карты именно по его вопросу. 3-4 предложения, остро, лично, чтобы ёкнуло. Не давай советов на будущее, только точное попадание в момент. Верни строго JSON:
{ "text": "толкование 3-4 предложения", "hook": "1 фраза, что это лишь верхний слой, а причины и финал откроет полный расклад" }`;
  return callAI(prompt, 600);
}

// Глубокий разбор по теме после подписки (без матрицы).
async function generateTarotDeep(cardDesc, question, themeLabel) {
  const prompt = `${VOICE}

Тема: ${themeLabel}. Вопрос человека: "${question}". Ведущая карта: ${cardDesc}.
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

// ---- ПЛАТНЫЙ ЦИФРОВОЙ РАСКЛАД (5 специализированных колод) ----
const PAID_READING_RULES = `Работай как опытный практикующий таролог, а не как автор гороскопа или мотивационного текста.
Сначала отвечай на заданный вопрос, затем объясняй, как именно карты привели к этому выводу.
Отделяй наблюдаемую динамику от предположения. Будущее описывай как наиболее вероятный сценарий при текущем курсе, не как гарантированный факт.
Не выдумывай имена, даты, события, диагнозы, измену, беременность, преступление или чужие тайные действия, если карты и формулировка вопроса не дают достаточного основания.
Не ставь медицинских и психологических диагнозов. В вопросах здоровья говори только об общем фоне, самочувствии и необходимости обратиться к профильному специалисту при симптомах.
Пиши на естественном современном русском. Не используй длинные тире, стрелки, канцелярит, эзотерический туман, театральные обещания и фразы вроде «карты кричат».
Не повторяй «эта карта говорит» и слово «энергия» в каждом абзаце. Не льсти человеку и не подгоняй любой ответ под желаемый исход.
Если пол человека неизвестен, не используй формы «готов/готова», «сделал/сделала» и другие гендерные догадки.
Не заканчивай штампами «ты на правильном пути», «всё не случайно», «всё служит во благо» или «просто доверься интуиции».
Текст должен быть конкретным, правдоподобным, деликатным и легко читаться в Telegram.`;

async function selectPaidDeck(question) {
  const prompt = `Ты выбираешь одну колоду для платного расклада по точному вопросу человека: "${question}".

Выбери строго один deckId:
thoth: универсальный или комплексный вопрос, причины процесса, выбор, кризис, трансформация, предназначение, общий прогноз.
lenormand: конкретное событие, срок, звонок, сообщение, встреча, возврат, брак, третье лицо, получение работы или денег, документы, сделка, поездка, переезд, недвижимость, конкретный итог.
ludy-lescot: кто этот человек, характер, надёжность, тип личности, социальная роль, поведение и совместимость характеров.
deviant-moon: почему человек так себя ведёт, скрытый мотив, страх, подавленное желание, теневая внутренняя причина и эмоциональное состояние.
golden-taurus: деньги, работа, бизнес, ресурсы, материальный риск, прибыльность и практическая стратегия.

Если вопрос смешанный и ни одна специализация явно не сильнее, выбери thoth. Не выбирай колоду по одному слову, учитывай намерение вопроса.
Различай близкие формулировки: «Есть ли перспектива у отношений?» относится к thoth, а «Будет ли брак или встреча?» к lenormand. «Стоит ли менять работу?» относится к thoth, «Получу ли я работу или придут ли деньги?» к lenormand, а «Как усилить доход и где риск бизнеса?» к golden-taurus.
Верни строго JSON: { "deckId": "одно из пяти значений", "confidence": 0.0, "reason": "одно короткое понятное предложение по-русски" }`;
  const result = await callAI(prompt, 260, true, 0.15);
  const allowed = new Set(["thoth", "lenormand", "ludy-lescot", "deviant-moon", "golden-taurus"]);
  if (!result || !allowed.has(result.deckId)) return null;
  return {
    deckId: result.deckId,
    confidence: Math.max(0, Math.min(1, Number(result.confidence) || 0)),
    reason: String(result.reason || "").slice(0, 180),
  };
}

// Глубокий разбор одной карты на её позиции. Возвращает живой текст без JSON.
async function generateSpreadCard(deckProfile, sphereLabel, question, position, index, cardDesc, prevDescs) {
  const ordinal = ["первая", "вторая", "третья"][index] || "следующая";
  const prev = (prevDescs && prevDescs.length)
    ? `Предыдущие карты расклада: ${prevDescs.join("; ")}. Свяжи эту карту с ними.`
    : "";
  const isLenormand = deckProfile && deckProfile.id === "lenormand";
  const method = deckProfile ? `${deckProfile.method}\nСпециализация колоды: ${deckProfile.profile}.` : "";
  const combination = isLenormand && prevDescs && prevDescs.length
    ? "Обязательно прочитай новую карту вместе с ближайшей предыдущей как связку Ленорман. Покажи, какое событие или уточнение создаёт пара."
    : "";
  const hook = index < 2 ? "В конце оставь одну спокойную фразу, зачем нужна следующая позиция. Без искусственной интриги." : "Это третья карта, не обещай следующую карту.";
  const prompt = `${VOICE}

${PAID_READING_RULES}

Ты ведёшь платный расклад на колоде «${deckProfile ? deckProfile.label : "Таро"}». Тема: ${sphereLabel}. Вопрос человека: "${question}".
${method}
Это ${ordinal} карта, позиция расклада: "${position}". Выпала карта: ${cardDesc}.
${prev}
${combination}

Дай конкретный разбор только этой позиции, но держи в уме весь вопрос. Начни с прямого вывода по позиции.
Пиши цельным живым текстом, 3-4 коротких абзаца по 2-3 предложения, без списков, заголовков и пересказа инструкции.
Потом объясни проявления в поведении, решениях, чувствах или событиях. Назови один проверяемый признак, по которому человек сможет понять, что трактовка проявляется в реальности.
Не описывай деталей рисунка, которых нет в метаданных карты.
${hook}
Верни только текст разбора.`;
  return callAI(prompt, 1050, false, 0.72);
}

// Финальный свод по трём картам плюс конкретный совет и тёплое послание.
async function generateSpreadFinal(deckProfile, sphereLabel, question, descs, positions) {
  const list = descs.map((d, i) => `${positions[i]}: ${d}`).join("; ");
  const isLenormand = deckProfile && deckProfile.id === "lenormand";
  const lenormandTask = isLenormand
    ? `В тексте обязательно назови и истолкуй две конкретные связки: первая карта + вторая карта, затем вторая карта + третья карта. После этого прочитай всю последовательность 1+2+3 слева направо как одно событийное сообщение. Учитывай номера и игральные соответствия только как дополнительный слой. Не складывай номера и не делай числовую редукцию.`
    : "Покажи причинную связь между тремя позициями, а не три отдельных значения.";
  const prompt = `${VOICE}

${PAID_READING_RULES}

Ты завершаешь платный расклад на колоде «${deckProfile ? deckProfile.label : "Таро"}». Тема: ${sphereLabel}. Вопрос: "${question}".
Метод колоды: ${deckProfile ? deckProfile.method : "связать карты в единую историю"}
Карты по позициям: ${list}.
${lenormandTask}

В ответе сначала дай прямой честный вывод. Не выдавай категоричное «точно да» или «точно нет» за факт. Формулируй через «скорее», «при текущем курсе» и главное условие исхода.
Не пересказывай каждую карту отдельно и не повторяй то, что уже было сказано при открытии карт.
Совет должен быть одним конкретным, проверяемым следующим шагом. Закрывающая фраза должна быть тёплой, но без пафоса и утешительного штампа.

${isLenormand ? `Верни строго JSON:
{
  "answer": "прямой ответ, 1-2 предложения",
  "pair12": "связка первой и второй карты с названиями обеих карт, 2-3 предложения",
  "pair23": "связка второй и третьей карты с названиями обеих карт, 2-3 предложения",
  "sequence": "единый событийный сценарий 1+2+3, 3-4 предложения",
  "advice": "один практический следующий шаг, 1-2 предложения",
  "closing": "одно спокойное предложение"
}` : `Верни строго JSON:
{
  "answer": "прямой ответ, 1-2 предложения",
  "synthesis": "единая причинная история трёх позиций без поочерёдного пересказа, 4-6 предложений",
  "advice": "один практический следующий шаг, 2 предложения",
  "closing": "одно спокойное предложение"
}`}`;
  const result = await callAI(prompt, isLenormand ? 1250 : 1050, true, 0.62);
  if (!result) return null;
  const paragraphs = isLenormand
    ? [result.answer, result.pair12, result.pair23, result.sequence, result.advice, result.closing]
    : [result.answer, result.synthesis, result.advice, result.closing];
  return clean(paragraphs.filter(Boolean).join("\n\n"));
}

// Ответ на уточняющий вопрос по одной карте.
async function generateSpreadExtra(deckProfile, sphereLabel, mainQuestion, cardDesc, userQuestion, contextDescs) {
  const context = contextDescs && contextDescs.length ? `Главные карты расклада: ${contextDescs.join("; ")}. Уточняющая карта должна дополнять их, а не противоречить без объяснения.` : "";
  const prompt = `${VOICE}

${PAID_READING_RULES}

Идёт платный расклад на колоде «${deckProfile ? deckProfile.label : "Таро"}». Тема: ${sphereLabel}. Основной вопрос: "${mainQuestion}".
Метод колоды: ${deckProfile ? deckProfile.method : "трактовать карту в контексте вопроса"}
${context}
Человек задал уточняющий вопрос: "${userQuestion}". На него выпала одна карта: ${cardDesc}.

Сразу ответь по сути уточняющего вопроса. Затем кратко объясни вывод через карту и общий расклад.
Пиши 5-7 естественных предложений, без списков и заголовков. Если уместно, добавь один конкретный совет.
Верни только текст ответа.`;
  return callAI(prompt, 850, false, 0.68);
}

module.exports = { generateTarotReveal, generateTarotDeep, generateSpheres, generateDeep, generateChatReply, selectPaidDeck, generateSpreadCard, generateSpreadFinal, generateSpreadExtra };
