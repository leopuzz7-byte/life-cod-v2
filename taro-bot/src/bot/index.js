// Телеграм-бот Надежды. Две цепочки на выбор (Таро и Нумерология),
// подписочный гейт, глубокий разбор, меню reply-клавиатурой, мини-апп калькулятор,
// оплата Robokassa (заглушка с готовой логикой). Тон: таролог-психолог, на «ты» умеренно.
const path = require("path");
const { Bot, InlineKeyboard, Keyboard, InputFile } = require("grammy");
const config = require("./config");
const { getUser, saveUser, getCircles, setCircle } = require("./store");
const { calculatePersonalMatrix } = require("../engine/calculations");
const { getArcana } = require("../engine/arcana");
const { SPHERES, sphereCards, concernText } = require("../engine/spheres");
const { THEMES, themeById, drawArcana, fallbackReveal, today } = require("../engine/tarot");
const deck = require("../engine/deck78");
const { renderThemeCards } = require("../render/theme");
const { renderDeckChoice } = require("../render/deck");
const ai = require("../ai/reading");
const { applyReferral, sendAll } = require("./broadcasts");
const pay = require("./payment");
const analytics = require("./analytics");
const track = analytics.track;

const bot = new Bot(config.botToken);
let botUsername = "taroiibbot";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ARCANA_DIR = path.join(__dirname, "..", "..", "assets", "arcana");
const LOADING = path.join(__dirname, "..", "..", "assets", "loading.mp4");

// ---- меню (reply-клавиатура) ----
const L = {
  arkan: "🃏 Аркан-код", numer: "🔢 Нумерология",
  tarot: "🔮 Таро расклад", shop: "🛍 Магазин", invite: "👥 Пригласить друга",
  academy: "🎓 Академия", consult: "🕊 Консультация",
  chat: "💬 Чат с Надеждой (ИИ)", support: "🛟 Техподдержка",
  social: "🌐 Соцсети Надежды", club: "🔒 Закрытый клуб",
};
function mainMenu() {
  return new Keyboard()
    .text(L.arkan).text(L.numer).row()
    .text(L.tarot).webApp("🧮 Калькулятор", config.calcUrl).row()
    .text(L.shop).text(L.invite).row()
    .text(L.academy).text(L.consult).row()
    .text(L.chat).text(L.support).row()
    .text(L.social).text(L.club).row()
    .resized()
    .placeholder("Меню с кнопками внизу 👇");
}
async function showMenu(ctx, text) {
  await ctx.reply(text || "Что откликается сейчас. Выбирай.", { reply_markup: mainMenu() });
  try {
    const u = getUser(ctx.from.id);
    if (!u.menuHintShown) { u.menuHintShown = true; saveUser(u); await ctx.reply("Меню с кнопками открылось внизу. Если кнопок не видно, нажми на значок с квадратиками справа от поля ввода."); }
  } catch (_) {}
}
const isPaid = (u) => !!(u.proUntil && u.proUntil > Date.now());
async function showChatPaywall(ctx) {
  const p = config.plans;
  const fmt = (x) => `${x.label}: ${x.price} руб, было ${x.old}, скидка ${x.discount}%`;
  await ctx.reply(
    "💬 Бесплатные сообщения закончились.\n\nОткрой безлимитное общение с Надеждой по подписке:\n\n" +
    fmt(p.week) + "\n" + fmt(p.month) + "\n" + fmt(p.year),
    { reply_markup: new InlineKeyboard()
        .text(`Неделя ${p.week.price} руб`, "buy:week").row()
        .text(`Месяц ${p.month.price} руб`, "buy:month").row()
        .text(`Год ${p.year.price} руб`, "buy:year") }
  );
}

function quickKb() {
  return new InlineKeyboard()
    .text("🔮 Таро расклад", "go:tarot").row()
    .text("💬 Чат", "go:chat").text("🕊 Консультация", "go:consult").row()
    .text("☰ Всё меню", "go:menu");
}

// ---- тексты методик ----
const ARKAN_DESC =
  "🃏 <b>Методика «Аркан-код»</b>\n\n" +
  "Глубокая система анализа личности на основе 22 Старших Арканов Таро. Каждый аркан отражает тип личности: характер, модели поведения, врождённые таланты, сильные стороны и жизненные задачи.\n\n" +
  "По дате рождения рассчитывается уникальный набор арканов, который показывает, как эти качества проявляются в решениях, отношениях, деньгах, профессии и самореализации. На выходе не абстрактные советы, а понятная карта себя: кто ты по сути, в чём главный ресурс, какие сценарии влияют на жизнь и куда двигаться.";
const ARKAN_SELL =
  "Полный разбор по «Аркан-коду» собран в интерактивном калькуляторе. Скажу честно: доступ платный, потому что это не шаблон, а глубокий персональный разбор по авторской методике. На выходе полная карта личности: сильные стороны, таланты, задачи, что влияет на жизнь и куда двигаться, чтобы раскрыть потенциал и решать осознаннее.";
const NUMER_DESC =
  "🔢 <b>Методика «Нумерология»</b>\n\n" +
  "Авторская система на основе классической нумерологии. Дата рождения и есть персональный код: каждая цифра отражает черты характера, модели поведения, таланты и жизненные задачи.\n\n" +
  "Такой анализ помогает понять себя, увидеть сильные стороны, осознать, какие сценарии влияют на жизнь, и выбрать направление, где реализуешься сильнее всего.";
const NUMER_SELL =
  "Полный разбор по нумерологии тоже в интерактивном калькуляторе. Скажу честно: доступ платный, потому что это глубокий персональный разбор по авторской методике, а не общие описания. На выходе полная карта личности: сильные стороны, таланты, задачи, что влияет на жизнь и куда двигаться, чтобы раскрыть потенциал и жить осознаннее.";

function parseDate(t) {
  const m = String(t).trim().match(/^(\d{1,2})[.\/\s-](\d{1,2})[.\/\s-](\d{4})$/);
  if (!m) return null;
  const day = +m[1], month = +m[2], year = +m[3], now = new Date().getFullYear();
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > now) return null;
  return { day, month, year };
}
async function waiting(ctx) {
  // анимация загрузки, потом удаляем
  try {
    const m = await ctx.replyWithAnimation(new InputFile(LOADING));
    await sleep(3800);
    try { await ctx.api.deleteMessage(ctx.chat.id, m.message_id); } catch (_) {}
    return;
  } catch (_) {}
  // запасной вариант текстом, если анимация не ушла
  try {
    const m = await ctx.reply("🔮 Считаю...");
    await sleep(1500); await ctx.api.editMessageText(ctx.chat.id, m.message_id, "✨ Смотрю на карты...");
    await sleep(1500); await ctx.api.editMessageText(ctx.chat.id, m.message_id, "🌙 Ещё немного...");
    await sleep(1000); await ctx.api.deleteMessage(ctx.chat.id, m.message_id);
  } catch (_) {}
}
async function isSubscribed(ctx) {
  try { const mm = await ctx.api.getChatMember(config.channel, ctx.from.id); return ["member", "administrator", "creator"].includes(mm.status); } catch (_) { return false; }
}
function subKeyboard() { return new InlineKeyboard().url("Подписаться на канал", config.channelUrl).row().text("Я подписался, открой разбор", "check_sub"); }
async function sendCircle(ctx, slot) {
  try { const c = getCircles(); if (c && c[slot]) await ctx.replyWithVideoNote(c[slot]); } catch (_) {}
}

let deckCache = null;
async function deckImage() { if (!deckCache) deckCache = await renderDeckChoice(5, { title: "Выбери карту", subtitle: "ту, к которой тянет" }); return deckCache; }

// ---------- цифровой расклад Таро (3 карты + уточняющие) ----------
const SPREADS = {
  love:   { label: "Любовь и отношения", emoji: "💞", positions: ["Ты", "Партнёр", "Куда идут отношения"] },
  money:  { label: "Деньги и работа", emoji: "💰", positions: ["Где ты сейчас", "Что мешает или помогает", "Исход"] },
  choice: { label: "Ситуация и выбор", emoji: "🧭", positions: ["Суть ситуации", "Что влияет", "Совет и исход"] },
  future: { label: "Прогноз", emoji: "🌙", positions: ["Прошлое", "Настоящее", "Будущее"] },
};
function draw3() { return deck.drawCards(3); }
function drawOne() { return deck.drawCard(); }
let deck3Cache = null;
async function deck3Image() { if (!deck3Cache) deck3Cache = await renderDeckChoice(3, { title: "Выбери карту", subtitle: "ту, к которой тянет" }); return deck3Cache; }
async function showSphereChoice(ctx) {
  const kb = new InlineKeyboard();
  Object.entries(SPREADS).forEach(([id, sp]) => kb.text(`${sp.emoji} ${sp.label}`, `sp:${id}`).row());
  await ctx.reply("Выбери, о чём гадаем.", { reply_markup: kb });
}
async function startRitual(ctx) {
  const u = getUser(ctx.from.id);
  u.spread = u.spread || {}; u.spread.cards = draw3(); u.spread.revealed = 0; u.spread.extra = 0; u.step = "sp_reading"; saveUser(u);
  try {
    const m = await ctx.reply("Тасую колоду...");
    await sleep(1200); await ctx.api.editMessageText(ctx.chat.id, m.message_id, "Карты ложатся под твой вопрос...");
    await sleep(1200); await ctx.api.deleteMessage(ctx.chat.id, m.message_id);
  } catch (_) {}
  const img = await deck3Image();
  await ctx.replyWithPhoto(new InputFile(img), { caption: "Перед тобой три карты рубашкой вверх. Выбери одну, ту, к которой тянет.", reply_markup: new InlineKeyboard().text("Карта 1", "sprev").text("Карта 2", "sprev").text("Карта 3", "sprev") });
}
async function showExtraPrompt(ctx) {
  const u = getUser(ctx.from.id);
  const left = 3 - ((u.spread && u.spread.extra) || 0);
  if (left <= 0) { await finishSpread(ctx); return; }
  await ctx.reply(`Хочешь копнуть глубже? Можно задать ещё до ${left} уточняющих вопросов, на каждый выпадет своя карта.`, { reply_markup: new InlineKeyboard().text("Задать вопрос", "spask").row().text("Готово", "spdone") });
}
async function finishSpread(ctx) {
  const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u);
  await ctx.reply("Если захочешь живой голосовой разбор лично от Надежды, это отдельная кнопка, Консультация. Береги себя.", { reply_markup: quickKb() });
}

// ---------- /start ----------
bot.command("start", async (ctx) => {
  const u = getUser(ctx.from.id);
  const ref = (ctx.match || "").trim();
  if (ref && /^\d+$/.test(ref) && !u.referredBy) applyReferral(ctx.from.id, ref);
  if (ref && !/^\d+$/.test(ref) && !u.source) u.source = ref.slice(0, 64);
  track(ctx.from.id, "start", { source: u.source || "direct", returning: !!u.onboarded });
  if (u.onboarded) { u.step = "menu"; saveUser(u); await showMenu(ctx, "Ты уже со мной. Выбирай, что дальше."); return; }
  Object.assign(u, { step: "idle", branch: null, name: "", birth: null, tarotQuestion: "", tarotTheme: null, tarotCard: null, theme: null, concern: null, chatHistory: [] });
  saveUser(u);
  await sendCircle(ctx, "welcome");
  const nm = ctx.from.first_name ? `, ${ctx.from.first_name}` : "";
  await ctx.reply(
    `Здравствуй${nm}.\n\n` +
    "Меня зовут Надежда. Я цифровой психолог и нумеролог. Здесь можно найти инструменты, которые помогут глубже понять себя, увидеть скрытые причины происходящего и принять решения, меняющие жизнь.\n\n" +
    "Иногда ответы приходят через карты. Иногда через язык чисел.\n\n" +
    "<i>Выбери, с чего хочешь начать.</i>",
    { parse_mode: "HTML", reply_markup: new InlineKeyboard().text("🔮 Таро", "br:tarot").text("🔢 Нумерология", "br:numer") }
  );
});
bot.command("menu", async (ctx) => { const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u); await showMenu(ctx); });
bot.command("id", async (ctx) => { await ctx.reply("Твой Telegram ID: " + ctx.from.id); });
bot.command("notify", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const text = (ctx.match || "").trim();
  if (!text) { await ctx.reply("Формат: /notify текст рассылки"); return; }
  await ctx.reply("Рассылаю...");
  const sent = await sendAll(bot, text);
  await ctx.reply("Отправлено: " + sent + " получателям.");
});
bot.command("stats", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const days = parseInt((ctx.match || "").trim(), 10) || 0;
  await ctx.reply(analytics.summary(days));
});
bot.command("give", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const parts = (ctx.match || "").trim().split(/\s+/);
  const targetId = parts[0];
  const plan = (parts[1] || "").toLowerCase();
  if (!targetId || !plan) { await ctx.reply("Формат: /give ID план\nПланы: week, month, year, forever, taro\nСвой ID человек берёт командой /id."); return; }
  const target = getUser(targetId);
  const now = Date.now();
  const base = (target.proUntil && target.proUntil > now) ? target.proUntil : now;
  if (plan === "week") target.proUntil = base + 7 * 86400000;
  else if (plan === "month") target.proUntil = base + 30 * 86400000;
  else if (plan === "year") target.proUntil = base + 365 * 86400000;
  else if (plan === "forever") target.proUntil = now + 100 * 365 * 86400000;
  else if (plan === "taro") target.taroFree = (target.taroFree || 0) + 1;
  else { await ctx.reply("Не понял план. Доступно: week, month, year, forever, taro."); return; }
  saveUser(target);
  const human = { week: "подписка на неделю", month: "подписка на месяц", year: "подписка на год", forever: "бессрочная подписка", taro: "бесплатный таро-расклад" }[plan];
  await ctx.reply(`Готово. Выдал: ${human}, пользователю ${targetId}.`);
  try { await bot.api.sendMessage(targetId, plan === "taro" ? "Надежда открыла тебе бесплатный таро-расклад. Загляни в меню, кнопка «Таро расклад»." : "Надежда открыла тебе подписку. Чат со мной теперь без ограничений."); } catch (_) {}
});
bot.command("help", async (ctx) => {
  await ctx.reply("Я бот Надежды. Внизу есть меню с кнопками, если его не видно, нажми на значок с квадратиками справа от поля ввода.\n\nБыстрые команды: /menu меню, /taro расклад, /chat чат.\n\nЕсли что-то не работает, напиши в техподдержку " + config.contacts.support, { reply_markup: quickKb() });
});
bot.command("taro", async (ctx) => { await handleMenu(ctx, L.tarot); });
bot.command("chat", async (ctx) => { await handleMenu(ctx, L.chat); });
bot.command("circle", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const slot = (ctx.match || "").trim().toLowerCase();
  const valid = ["welcome", "arkan", "numer"];
  const vn = ctx.message.reply_to_message && ctx.message.reply_to_message.video_note;
  if (!valid.includes(slot)) { await ctx.reply("Формат: ответь на кружок командой /circle welcome (или arkan, или numer)."); return; }
  if (!vn) { await ctx.reply("Отправь /circle в ответ на сам кружок, видео-заметку."); return; }
  setCircle(slot, vn.file_id);
  await ctx.reply(`Кружок сохранён как «${slot}». Он будет играть в нужном месте.`);
});

// ---------- ветка ТАРО ----------
bot.callbackQuery("br:tarot", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.branch = "tarot"; u.step = "tarot_theme"; saveUser(u);
  track(ctx.from.id, "branch", { value: "tarot" });
  await ctx.reply("<i>В картах нет случайностей.</i> Сегодня выпадет именно та карта, которую важно увидеть.\n\nНо карты отвечают точнее, когда есть настоящий вопрос, тот, что правда не отпускает.", { parse_mode: "HTML" });
  const kb = new InlineKeyboard();
  THEMES.forEach((t) => kb.text(`${t.emoji} ${t.label}`, `tt:${t.id}`).row());
  kb.text("✍️ Написать свой вопрос", "tt:custom");
  await ctx.reply("Выбери, что откликается, или напиши свой вопрос колоде. 🌙", { reply_markup: kb });
});
bot.callbackQuery(/^tt:(love|money|choice|future)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const t = themeById(ctx.match[1]);
  const u = getUser(ctx.from.id); u.tarotTheme = t.id; u.tarotQuestion = t.label; u.step = "tarot_pick"; saveUser(u);
  track(ctx.from.id, "theme", { branch: "tarot", value: t.id });
  await sendDeck(ctx);
});
bot.callbackQuery("tt:custom", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.step = "await_custom_q"; saveUser(u);
  track(ctx.from.id, "theme", { branch: "tarot", value: "custom" });
  await ctx.reply("Напиши вопрос одним сообщением, своими словами. Спрашивай как есть.");
});
async function sendDeck(ctx) {
  const img = await deckImage();
  await ctx.replyWithPhoto(new InputFile(img), {
    caption: "Держи вопрос в сердце и не отпускай. Перед тобой пять карт. Выбери одну, ту, к которой тянет.",
    reply_markup: new InlineKeyboard().text("1", "pick:1").text("2", "pick:2").text("3", "pick:3").text("4", "pick:4").text("5", "pick:5"),
  });
}
bot.callbackQuery(/^pick:([1-5])$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.tarotQuestion) { await ctx.reply("Напиши /start, чтобы начать заново."); return; }
  const pos = +ctx.match[1];
  const card = deck.drawCard();
  u.tarotCard = card; u.step = "tarot_sub"; saveUser(u);
  track(ctx.from.id, "pick", { branch: "tarot", card: card.key });
  await waiting(ctx);
  await ctx.replyWithChatAction("upload_photo");
  // сырая карта оригиналом, без эффектов
  const cf = deck.cardFile(card); if (cf) await ctx.replyWithPhoto(new InputFile(cf));
  let r = await ai.generateTarotReveal(deck.cardInfo(card), u.tarotQuestion);
  const name = deck.cardName(card);
  const text = r
    ? `Твоя карта: <b>${esc(name)}</b>.\n\n${esc(r.text)}\n\n<i>${esc(r.hook)}</i>`
    : `Твоя карта: <b>${esc(name)}</b>.\n\n${esc(name + " пришла не случайно. В ней ключ к тому, о чём сейчас думаешь. Сила уже внутри, осталось разрешить себе её увидеть.")}\n\n<i>Но одна карта показывает лишь верхний слой. Что привело к этому и чем закончится, откроет полный расклад.</i>`;
  await ctx.reply(text, { parse_mode: "HTML" });
  track(ctx.from.id, "reveal", { branch: "tarot" });
  await sleep(400);
  await ctx.reply("Чтобы раскрыть глубже, что стоит за этим и чем всё закончится, загляни в мой канал. 🌙\n\nПодпишись, и полный разбор откроется.", { reply_markup: subKeyboard() });
  track(ctx.from.id, "subgate", { branch: "tarot" });
});

// ---------- ветка НУМЕРОЛОГИЯ ----------
bot.callbackQuery("br:numer", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.branch = "numerology"; u.step = "await_name"; saveUser(u);
  track(ctx.from.id, "branch", { value: "numer" });
  await ctx.reply("Хорошо. Числа расскажут о тебе многое.\n\nКак мне к тебе обращаться?");
});
bot.callbackQuery(/^th:(love|money|path)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1];
  const u = getUser(ctx.from.id); u.theme = key; u.step = "await_concern"; saveUser(u);
  track(ctx.from.id, "theme", { branch: "numer", value: key });
  const s = SPHERES[key];
  const kb = new InlineKeyboard();
  s.concerns.forEach((c) => kb.text(c.text, `co:${key}:${c.id}`).row());
  await ctx.reply(`${s.emoji} ${s.label}. А что именно сейчас откликается?`, { reply_markup: kb });
});
bot.callbackQuery(/^co:(love|money|path):([a-z]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.theme = ctx.match[1]; u.concern = ctx.match[2]; u.step = "num_sub"; saveUser(u);
  track(ctx.from.id, "subgate", { branch: "numer", concern: ctx.match[2] });
  await ctx.reply(`Услышала. По теме «${SPHERES[u.theme].label}» в твоих картах есть глубокий узор.\n\nЧтобы раскрыть его целиком, загляни в канал. Подпишись, и разбор откроется.`, { reply_markup: subKeyboard() });
});

// ---------- подписка -> глубокий разбор -> меню ----------
bot.callbackQuery("check_sub", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!(await isSubscribed(ctx))) {
    await ctx.reply("Пока не вижу тебя в канале. Загляни, и разбор откроется.", { reply_markup: subKeyboard() });
    return;
  }
  u.subscribed = true; saveUser(u);
  track(ctx.from.id, "subscribed", { branch: u.branch === "tarot" ? "tarot" : "numer" });
  await ctx.replyWithChatAction("typing");
  let fbBranch = null;
  if (u.branch === "tarot" && u.tarotCard) {
    let d = await ai.generateTarotDeep(deck.cardInfo(u.tarotCard), u.tarotQuestion, u.tarotTheme ? themeById(u.tarotTheme).label : "твой вопрос");
    await sendDeep(ctx, d, deck.cardName(u.tarotCard));
    fbBranch = "tarot";
  } else if (u.branch === "numerology" && u.birth) {
    const matrix = calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year);
    let d = await ai.generateDeep(matrix, u.name, SPHERES[u.theme].label, concernText(u.theme, u.concern));
    await sendDeep(ctx, d, SPHERES[u.theme].label);
    fbBranch = "numer";
  } else { await ctx.reply("Напиши /start, чтобы начать."); return; }
  u.step = "menu"; u.onboarded = true; saveUser(u);
  if (fbBranch) track(ctx.from.id, "deep", { branch: fbBranch });
  if (fbBranch) { await sleep(1000); await askFeedback(ctx, fbBranch); }
  await sleep(400);
  await showMenu(ctx, "А теперь идём дальше. Спроси о чём угодно в чате со мной, или выбери в меню.");
});
async function sendDeep(ctx, d, fallbackName) {
  if (!d) { await ctx.reply(`Карта ${fallbackName} говорит о многом. В ней и сила, и то, что пока в тени. Не торопи себя, один честный шаг здесь дороже десяти суетливых. Глубже можно пойти со мной, в разборах и на консультации.`); return; }
  await ctx.reply(`${esc(d.opening)}\n\n${esc(d.insight)}\n\n<i>${esc(d.advice)}</i>\n\n${esc(d.closing)}`, { parse_mode: "HTML" });
}

// ---------- опросник после разбора ----------
const FB_REPLY = { hit: "Чувствую это. Значит, смотрим в одну сторону.", part: "Уже хорошо. Остальное дораскроется, если пойдём глубже.", miss: "Спасибо, что сказала честно. Задай вопрос в чате, всмотрюсь иначе." };
async function askFeedback(ctx, br) {
  await ctx.reply("Скажи честно, откликнулось?", { reply_markup: new InlineKeyboard().text("Да, про меня", `fb:${br}:hit`).row().text("Кое-что да", `fb:${br}:part`).row().text("Не откликнулось", `fb:${br}:miss`) });
}
bot.callbackQuery(/^fb:(tarot|numer):(hit|part|miss)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const br = ctx.match[1], val = ctx.match[2];
  const u = getUser(ctx.from.id);
  u.feedback = u.feedback || {}; u.feedback[br] = val; saveUser(u);
  track(ctx.from.id, "feedback", { branch: br, value: val });
  try { await ctx.editMessageText(`Скажи честно, откликнулось?\n\n${FB_REPLY[val]}`); } catch (_) {}
});

// ---------- пункты меню (reply-клавиатура шлёт текст) ----------
async function handleMenu(ctx, label) {
  const u = getUser(ctx.from.id);
  track(ctx.from.id, "menu_click", { button: label });
  if (label === L.tarot) {
    const t = config.taro;
    u.step = "sp_sphere"; u.spread = { sphere: null, question: "", cards: [], revealed: 0, extra: 0 }; saveUser(u);
    await ctx.reply(`🔮 <b>Полный расклад Таро</b>\n\nГлубокий разбор на трёх картах под твой конкретный вопрос, карта за картой, плюс до трёх уточняющих вопросов.\n\nСтоимость ${t.price} рублей, было ${t.old}, скидка ${t.discount}%.`, { parse_mode: "HTML" });
    await showSphereChoice(ctx);
  } else if (label === L.arkan) {
    await sendCircle(ctx, "arkan");
    await ctx.reply(ARKAN_DESC, { parse_mode: "HTML" });
    await ctx.reply(ARKAN_SELL, { reply_markup: new InlineKeyboard().webApp("🔮 Открыть калькулятор", config.calcUrl) });
  } else if (label === L.numer) {
    await sendCircle(ctx, "numer");
    await ctx.reply(NUMER_DESC, { parse_mode: "HTML" });
    await ctx.reply(NUMER_SELL, { reply_markup: new InlineKeyboard().webApp("🔮 Открыть калькулятор", config.calcUrl) });
  } else if (label === L.chat) {
    u.step = "chat"; saveUser(u);
    const paid = isPaid(u);
    const left = Math.max(0, config.limits.aiMessagesPerDay - (u.chatFree || 0));
    await ctx.reply("💬 <b>Чат с Надеждой (ИИ)</b>\n\nЭто моя цифровая версия, отвечает искусственный интеллект, обученный на моих методиках. Живо и по делу. Живая встреча со мной это отдельная кнопка, Консультация.", { parse_mode: "HTML" });
    if (paid) await ctx.reply("У тебя активна подписка. Спрашивай о чём угодно, отвечаю без ограничений.");
    else if (left > 0) await ctx.reply(`Спроси о чём угодно, что тревожит или радует. Есть ${left} бесплатных сообщения, дальше по подписке.`);
    else await showChatPaywall(ctx);
  } else if (label === L.consult) {
    const phone = config.contacts.consultPhone;
    await ctx.reply(`🕊 <b>Консультация с Надеждой</b>\n\nЭто личная встреча один на один, не с ботом, а со мной вживую. Час работы: отношения, выбор, деньги, реализация, повторяющиеся сценарии. На выходе ясность и конкретные шаги.\n\nМинимум час, ${config.prices.consult} рублей.\n\nДля записи напиши мне в Telegram.`, { parse_mode: "HTML", reply_markup: new InlineKeyboard().url("Написать для записи", "tg://resolve?phone=" + phone) });
  } else if (label === L.academy) {
    await ctx.reply("🎓 <b>Лайф Код Академия</b>\n\nСкоро здесь появится академия с обучением. Следи за анонсами в канале.", { parse_mode: "HTML", reply_markup: new InlineKeyboard().url("Канал Надежды", config.channelUrl) });
  } else if (label === L.club) {
    await ctx.reply("🔒 <b>Закрытый клуб</b>\n\nСкоро откроется закрытый клуб Надежды: личные разборы, живые эфиры и разборы знаменитостей. Следи за анонсами в канале.", { parse_mode: "HTML", reply_markup: new InlineKeyboard().url("Канал Надежды", config.channelUrl) });
  } else if (label === L.shop) {
    await ctx.reply(`🛍 <b>Магазин</b>\n\nУ нас можно приобрести: уникальные авторские карты Таро, фирменную одежду в тематике нумерологии и Таро, полотенца, постельное бельё.\n\nДля покупки напиши: ${config.contacts.buyCards}`, { parse_mode: "HTML" });
  } else if (label === L.invite) {
    const link = `https://t.me/${botUsername}?start=${ctx.from.id}`;
    await ctx.reply(`👥 <b>Пригласить друга</b>\n\nОтправь эту ссылку другу. Когда он зайдёт по ней и запустит бота, вы оба получите бонусное сообщение в чате со мной.\n\n${link}`, { parse_mode: "HTML" });
  } else if (label === L.support) {
    await ctx.reply(`🛟 <b>Техподдержка</b>\n\nЕсли что-то не работает или есть вопрос, напиши нам: ${config.contacts.support}`, { parse_mode: "HTML" });
  } else if (label === L.social) {
    const s = config.social;
    const kb = new InlineKeyboard()
      .url("Instagram · Таро", s.instaTaro).row()
      .url("Instagram · Нумерология", s.instaNumer).row()
      .url("YouTube · Таро", s.youtubeTaro).row()
      .url("YouTube · Нумерология", s.youtubeNumer).row()
      .url("TikTok", s.tiktok);
    await ctx.reply("🌐 <b>Официальные соцсети Надежды</b>\n\nТолько эти аккаунты настоящие. Будь внимателен, не ведись на фейки и страницы-двойники.", { parse_mode: "HTML", reply_markup: kb });
  } else return false;
  return true;
}

// ---------- оплата (заглушка) ----------
bot.callbackQuery(/^buy:(week|month|year)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1];
  const plan = config.plans[key];
  const r = await pay.createBotPayment(ctx.from.id, plan.product);
  if (!r || !r.payment_url) { await ctx.reply("Не удалось создать оплату, попробуй ещё раз или напиши в техподдержку " + config.contacts.support); return; }
  const u = getUser(ctx.from.id); u.pay = { kind: "sub", key, product: plan.product, invId: r.inv_id }; saveUser(u);
  track(ctx.from.id, "pay_click", { what: plan.product });
  const testNote = r.is_test ? "\n\n(тестовый режим оплаты)" : "";
  await ctx.reply(`Счёт на ${plan.price} рублей, подписка ${plan.label}.${testNote}\n\nОплати по кнопке, потом вернись и нажми «Проверить оплату».`, { reply_markup: new InlineKeyboard().url(`Оплатить ${plan.price} руб`, r.payment_url).row().text("Проверить оплату", "chk:sub") });
});
bot.callbackQuery("chk:sub", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.pay || u.pay.kind !== "sub") { await ctx.reply("Нет активного счёта. Начни оплату заново."); return; }
  const key = u.pay.key;
  const r = await pay.checkBotPayment(ctx.from.id, u.pay.invId);
  if (r && r.status === "paid") {
    const days = config.plans[key].days;
    const base = isPaid(u) ? u.proUntil : Date.now();
    u.proUntil = base + days * 86400000;
    track(ctx.from.id, "paid", { product: config.plans[key].product });
    u.pay = null; saveUser(u);
    await ctx.reply("Оплата получена, подписка активна. Пиши, отвечаю без ограничений.");
  } else {
    await ctx.reply("Оплату пока не вижу. Если только что оплатил, подожди минуту и нажми ещё раз.", { reply_markup: new InlineKeyboard().text("Проверить оплату", "chk:sub") });
  }
});
bot.callbackQuery(/^sp:(love|money|choice|future)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  u.spread = u.spread || { cards: [], revealed: 0, extra: 0 };
  u.spread.sphere = ctx.match[1]; u.step = "sp_question"; saveUser(u);
  track(ctx.from.id, "spread_sphere", { sphere: ctx.match[1] });
  await ctx.reply(`${SPREADS[ctx.match[1]].label}. Теперь напиши свой вопрос одним сообщением, конкретно и своими словами.`);
});
bot.callbackQuery("spno", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  u.step = "sp_sphere"; u.spread = { sphere: null, question: "", cards: [], revealed: 0, extra: 0 }; saveUser(u);
  await showSphereChoice(ctx);
});
bot.callbackQuery("spok", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.spread || !u.spread.sphere || !u.spread.question) { await ctx.reply("Начни заново через кнопку «Таро расклад»."); return; }
  if ((u.taroFree || 0) > 0) {
    u.taroFree = u.taroFree - 1; u.pay = null; saveUser(u);
    track(ctx.from.id, "paid", { product: config.taro.product, free: true });
    await startRitual(ctx);
    return;
  }
  const t = config.taro;
  const r = await pay.createBotPayment(ctx.from.id, t.product);
  if (!r || !r.payment_url) { await ctx.reply("Не удалось создать оплату, попробуй ещё раз или напиши в техподдержку " + config.contacts.support); return; }
  u.pay = { kind: "taro", product: t.product, invId: r.inv_id }; saveUser(u);
  track(ctx.from.id, "pay_click", { what: t.product });
  const testNote = r.is_test ? "\n\n(тестовый режим оплаты)" : "";
  await ctx.reply(`Счёт на ${t.price} рублей за полный расклад.${testNote}\n\nОплати по кнопке, потом вернись и нажми «Проверить оплату».`, { reply_markup: new InlineKeyboard().url(`Оплатить ${t.price} руб`, r.payment_url).row().text("Проверить оплату", "chk:taro") });
});
bot.callbackQuery("chk:taro", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.pay || u.pay.kind !== "taro") { await ctx.reply("Нет активного счёта. Начни оплату заново."); return; }
  const r = await pay.checkBotPayment(ctx.from.id, u.pay.invId);
  if (r && r.status === "paid") {
    track(ctx.from.id, "paid", { product: u.pay.product });
    u.pay = null; saveUser(u);
    await startRitual(ctx);
  } else {
    await ctx.reply("Оплату пока не вижу. Если только что оплатил, подожди минуту и нажми ещё раз.", { reply_markup: new InlineKeyboard().text("Проверить оплату", "chk:taro") });
  }
});
bot.callbackQuery("sprev", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.spread || !u.spread.cards || u.spread.cards.length !== 3) { await ctx.reply("Начни заново через кнопку «Таро расклад»."); return; }
  const idx = u.spread.revealed || 0;
  if (idx >= 3) return;
  const card = u.spread.cards[idx];
  const sp = SPREADS[u.spread.sphere];
  const pos = sp.positions[idx];
  await waiting(ctx);
  await ctx.replyWithChatAction("upload_photo");
  try { const cf = deck.cardFile(card); if (cf) await ctx.replyWithPhoto(new InputFile(cf)); } catch (_) {}
  const prev = u.spread.cards.slice(0, idx);
  const txt = await ai.generateSpreadCard(sp.label, u.spread.question, pos, idx, deck.cardInfo(card), prev.map(deck.cardInfo));
  const name = deck.cardName(card);
  const ordinal = ["Первая карта", "Вторая карта", "Третья карта"][idx];
  await ctx.reply(`<b>${ordinal}, ${esc(pos.toLowerCase())}: ${esc(name)}</b>\n\n${esc(txt || (name + " говорит о многом. Прислушайся к первому чувству."))}`, { parse_mode: "HTML" });
  u.spread.revealed = idx + 1; saveUser(u);
  track(ctx.from.id, "spread_card", { idx: idx + 1 });
  if (u.spread.revealed < 3) {
    await sleep(1500);
    await ctx.reply("Готова открыть следующую карту.", { reply_markup: new InlineKeyboard().text("Открыть ещё карту", "sprev") });
  } else {
    await sleep(700);
    await ctx.replyWithChatAction("typing");
    const fin = await ai.generateSpreadFinal(sp.label, u.spread.question, u.spread.cards.map(deck.cardInfo), sp.positions);
    if (fin) await ctx.reply(`<b>Свод</b>\n\n${esc(fin)}`, { parse_mode: "HTML" });
    await sleep(600);
    await showExtraPrompt(ctx);
    track(ctx.from.id, "spread_done", {});
  }
});
bot.callbackQuery("spask", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.step = "sp_extra_q"; saveUser(u);
  await ctx.reply("Напиши свой уточняющий вопрос одним сообщением.");
});
bot.callbackQuery("spdone", async (ctx) => {
  await ctx.answerCallbackQuery();
  await finishSpread(ctx);
});
bot.callbackQuery("to:menu", async (ctx) => { await ctx.answerCallbackQuery(); const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u); await showMenu(ctx); });
bot.callbackQuery(/^go:(tarot|chat|consult|menu)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const which = ctx.match[1];
  if (which === "menu") { const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u); await showMenu(ctx); return; }
  const label = which === "tarot" ? L.tarot : which === "chat" ? L.chat : L.consult;
  await handleMenu(ctx, label);
});

// ---------- текст: ввод и меню ----------
bot.on("message:text", async (ctx) => {
  const u = getUser(ctx.from.id);
  const text = ctx.message.text;

  if (u.step === "await_name") {
    u.name = text.trim().slice(0, 40).replace(/[<>]/g, ""); u.step = "await_date"; saveUser(u);
    await ctx.reply(`Приятно познакомиться, ${u.name}. А когда ты родился(-ась)?\n\nВведи дату в формате ДД.ММ.ГГГГ, например 01.02.1991.`);
    return;
  }
  if (u.step === "await_date") {
    const d = parseDate(text);
    if (!d) { await ctx.reply("Что-то не так с датой. Напиши в формате ДД.ММ.ГГГГ, например 01.02.1991."); return; }
    u.birth = d; saveUser(u);
    await waiting(ctx);
    const matrix = calculatePersonalMatrix(d.day, d.month, d.year);
    const cards = sphereCards(matrix);
    const png = await renderThemeCards(cards.map((c) => ({ n: c.n, label: c.label, sub: c.name })), { title: "Твои три карты", subtitle: "три сферы, где решается твоя судьба" });
    await ctx.replyWithPhoto(new InputFile(png), { caption: "Вот они, три твои карты. Смотри." });
    track(ctx.from.id, "reveal", { branch: "numer" });
    let t = await ai.generateSpheres(matrix, u.name);
    if (t) {
      const msg = `${esc(t.preface)}\n\n${SPHERES.love.emoji} <b>Отношения</b>\n${esc(t.love_lead)} ${esc(t.love)}\n\n${SPHERES.money.emoji} <b>Деньги и дело</b>\n${esc(t.money_lead)} ${esc(t.money)}\n\n${SPHERES.path.emoji} <b>Путь и сила</b>\n${esc(t.path_lead)} ${esc(t.path)}`;
      await ctx.reply(msg, { parse_mode: "HTML" });
    } else {
      await ctx.reply(`Карты легли. В отношениях ведёт ${cards[0].name}, в деле ${cards[1].name}, а путь освещает ${cards[2].name}. За этими тремя картами скрыто гораздо больше.`);
    }
    await sleep(500);
    const kb = new InlineKeyboard().text(`${SPHERES.love.emoji} Отношения`, "th:love").row().text(`${SPHERES.money.emoji} Деньги и дело`, "th:money").row().text(`${SPHERES.path.emoji} Путь и сила`, "th:path");
    await ctx.reply("Скажи, что откликается сильнее. С чего начнём?", { reply_markup: kb });
    u.step = "await_theme"; saveUser(u);
    return;
  }
  if (u.step === "await_custom_q") {
    u.tarotQuestion = text.trim().slice(0, 300); u.step = "tarot_pick"; saveUser(u);
    await ctx.reply("Приняла вопрос. Теперь сосредоточься на нём.");
    await sendDeck(ctx);
    return;
  }
  if (u.step === "sp_question") {
    const q = text.trim().slice(0, 300);
    if (q.length < 3) { await ctx.reply("Напиши вопрос чуть подробнее, одним сообщением."); return; }
    u.spread = u.spread || {}; u.spread.question = q; u.step = "sp_confirm"; saveUser(u);
    const sp = SPREADS[u.spread.sphere];
    await ctx.reply(`Проверим. Ниша: ${sp.label}. Вопрос: «${esc(q)}». Всё верно?`, { parse_mode: "HTML", reply_markup: new InlineKeyboard().text("Да, всё верно", "spok").row().text("Нет, изменить", "spno") });
    return;
  }
  if (u.step === "sp_extra_q") {
    if (!u.spread || !u.spread.sphere) { u.step = "menu"; saveUser(u); await showMenu(ctx); return; }
    const q = text.trim().slice(0, 300);
    const card = drawOne();
    await waiting(ctx);
    await ctx.replyWithChatAction("upload_photo");
    try { const cf = deck.cardFile(card); if (cf) await ctx.replyWithPhoto(new InputFile(cf)); } catch (_) {}
    const ans = await ai.generateSpreadExtra(SPREADS[u.spread.sphere].label, u.spread.question, deck.cardInfo(card), q);
    const name = deck.cardName(card);
    await ctx.reply(`<b>${esc(name)}</b>\n\n${esc(ans || "Карта отвечает мягко, прислушайся к первому чувству.")}`, { parse_mode: "HTML" });
    u.spread.extra = (u.spread.extra || 0) + 1; u.step = "sp_reading"; saveUser(u);
    track(ctx.from.id, "spread_extra", { n: u.spread.extra });
    await sleep(800);
    await showExtraPrompt(ctx);
    return;
  }

  // пункты меню (reply-клавиатура)
  if (Object.values(L).includes(text)) { if (await handleMenu(ctx, text)) return; }

  if (u.step === "chat") {
    const FREE = config.limits.aiMessagesPerDay;
    const paid = isPaid(u);
    if (!paid && (u.chatFree || 0) >= FREE) { await showChatPaywall(ctx); return; }
    if (!paid) { u.chatFree = (u.chatFree || 0) + 1; }
    track(ctx.from.id, "chat_msg", {});
    u.chatHistory = (u.chatHistory || []).concat({ role: "user", content: text }).slice(-12); saveUser(u);
    await ctx.replyWithChatAction("typing");
    const matrix = u.birth ? calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year) : null;
    let reply = await ai.generateChatReply(u.chatHistory, text, matrix, u.name);
    if (!reply) reply = "Карты сейчас молчат, но я рядом. Спроси иначе, и я всмотрюсь ещё раз.";
    u.chatHistory = u.chatHistory.concat({ role: "assistant", content: reply }).slice(-12); saveUser(u);
    await ctx.reply(reply);
    if (!paid) {
      const left = FREE - (u.chatFree || 0);
      if (left === 1) await ctx.reply("Осталось одно бесплатное сообщение, дальше открывается по подписке.");
      else if (left <= 0) await showChatPaywall(ctx);
    }
    return;
  }

  if (u.branch || u.birth) await ctx.reply("Не совсем поняла. Выбери кнопкой ниже или открой всё меню.", { reply_markup: quickKb() });
  else await ctx.reply("Чтобы начать, напиши /start.");
});

bot.catch((err) => console.error("Ошибка бота:", err?.error?.message || err?.message || err));

async function setup() {
  try { await bot.api.setChatMenuButton({ menu_button: { type: "web_app", text: "Калькулятор", web_app: { url: config.calcUrl } } }); } catch (e) { console.error("menu button:", e?.message); }
  try { await bot.api.setMyCommands([
    { command: "menu", description: "Открыть меню" },
    { command: "taro", description: "Таро расклад" },
    { command: "chat", description: "Чат с Надеждой" },
    { command: "help", description: "Как тут всё устроено" },
  ]); } catch (_) {}
  try { await bot.api.setMyDescription("Бот Надежды: таро, нумерология и личные разборы. Вопросы и техподдержка: " + config.contacts.support); } catch (_) {}
  pay.startResultServer((invId) => console.log("Оплачен счёт", invId));
}
bot.start({ onStart: async (bi) => { botUsername = bi.username; await setup(); console.log("Бот запущен: @" + bi.username); } });
