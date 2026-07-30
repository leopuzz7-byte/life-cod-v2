// Телеграм-бот Надежды. Две цепочки на выбор (Таро и Нумерология),
// подписочный гейт, глубокий разбор, меню reply-клавиатурой, мини-апп калькулятор,
// оплата Robokassa (заглушка с готовой логикой). Тон: таролог-психолог, на «ты» умеренно.
const path = require("path");
const { Bot, InlineKeyboard, Keyboard, InputFile } = require("grammy");
const config = require("./config");
const { getUser, saveUser } = require("./store");
const { calculatePersonalMatrix } = require("../engine/calculations");
const { getArcana } = require("../engine/arcana");
const { SPHERES, sphereCards, concernText } = require("../engine/spheres");
const { THEMES, themeById, drawArcana, fallbackReveal, today } = require("../engine/tarot");
const { renderThemeCards } = require("../render/theme");
const { renderDeckChoice } = require("../render/deck");
const ai = require("../ai/reading");
const { applyReferral, sendAll } = require("./broadcasts");
const pay = require("./payment");

const bot = new Bot(config.botToken);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ARCANA_DIR = path.join(__dirname, "..", "..", "assets", "arcana");

// ---- меню (reply-клавиатура) ----
const L = {
  tarot: "🔮 Таро расклад", chat: "💬 Чат с Надеждой", arkan: "🃏 Аркан-код",
  numer: "🔢 Нумерология", consult: "🕊 Консультация", academy: "🎓 Академия", buy: "🛍 Купить карты",
};
function mainMenu() {
  return new Keyboard()
    .text(L.tarot).text(L.chat).row()
    .text(L.arkan).text(L.numer).row()
    .text(L.consult).text(L.academy).row()
    .text(L.buy).webApp("🧮 Калькулятор", config.calcUrl).row()
    .resized();
}
async function showMenu(ctx, text) {
  await ctx.reply(text || "Что откликается сейчас. Выбирай.", { reply_markup: mainMenu() });
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
  const steps = ["🔮 Считаю...", "✨ Смотрю на карты...", "🌙 Ещё немного..."];
  let m;
  try { m = await ctx.reply(steps[0]); for (let i = 1; i < steps.length; i++) { await sleep(1500); await ctx.api.editMessageText(ctx.chat.id, m.message_id, steps[i]); } await sleep(1100); await ctx.api.deleteMessage(ctx.chat.id, m.message_id); } catch (_) {}
}
async function isSubscribed(ctx) {
  try { const mm = await ctx.api.getChatMember(config.channel, ctx.from.id); return ["member", "administrator", "creator"].includes(mm.status); } catch (_) { return false; }
}
function subKeyboard() { return new InlineKeyboard().url("Подписаться на канал", config.channelUrl).row().text("Я подписался, открой разбор", "check_sub"); }

let deckCache = null;
async function deckImage() { if (!deckCache) deckCache = await renderDeckChoice(5, { title: "Выбери карту", subtitle: "ту, к которой тянет" }); return deckCache; }

// ---------- /start ----------
bot.command("start", async (ctx) => {
  const u = getUser(ctx.from.id);
  const ref = (ctx.match || "").trim();
  if (ref && /^\d+$/.test(ref) && !u.referredBy) applyReferral(ctx.from.id, ref);
  if (u.onboarded) { u.step = "menu"; saveUser(u); await showMenu(ctx, "Ты уже со мной. Выбирай, что дальше."); return; }
  Object.assign(u, { step: "idle", branch: null, name: "", birth: null, tarotQuestion: "", tarotTheme: null, tarotCard: null, theme: null, concern: null, chatHistory: [] });
  saveUser(u);
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

// ---------- ветка ТАРО ----------
bot.callbackQuery("br:tarot", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.branch = "tarot"; u.step = "tarot_theme"; saveUser(u);
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
  await sendDeck(ctx);
});
bot.callbackQuery("tt:custom", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.step = "await_custom_q"; saveUser(u);
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
  const card = drawArcana(ctx.from.id, pos, today());
  u.tarotCard = card; u.step = "tarot_sub"; saveUser(u);
  await waiting(ctx);
  await ctx.replyWithChatAction("upload_photo");
  // сырая карта оригиналом, без эффектов
  await ctx.replyWithPhoto(new InputFile(path.join(ARCANA_DIR, `arcana-${card}.webp`)));
  let r = await ai.generateTarotReveal(card, u.tarotQuestion);
  const name = getArcana(card).name;
  const text = r
    ? `Твоя карта: <b>${esc(name)}</b>.\n\n${esc(r.text)}\n\n<i>${esc(r.hook)}</i>`
    : `Твоя карта: <b>${esc(name)}</b>.\n\n${esc(fallbackReveal(card))}\n\n<i>Но одна карта показывает лишь верхний слой. Что привело к этому и чем закончится, откроет полный расклад.</i>`;
  await ctx.reply(text, { parse_mode: "HTML" });
  await sleep(400);
  await ctx.reply("Чтобы раскрыть глубже, что стоит за этим и чем всё закончится, загляни в мой канал. 🌙\n\nПодпишись, и полный разбор откроется.", { reply_markup: subKeyboard() });
});

// ---------- ветка НУМЕРОЛОГИЯ ----------
bot.callbackQuery("br:numer", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.branch = "numerology"; u.step = "await_name"; saveUser(u);
  await ctx.reply("Хорошо. Числа расскажут о тебе многое.\n\nКак мне к тебе обращаться?");
});
bot.callbackQuery(/^th:(love|money|path)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1];
  const u = getUser(ctx.from.id); u.theme = key; u.step = "await_concern"; saveUser(u);
  const s = SPHERES[key];
  const kb = new InlineKeyboard();
  s.concerns.forEach((c) => kb.text(c.text, `co:${key}:${c.id}`).row());
  await ctx.reply(`${s.emoji} ${s.label}. А что именно сейчас откликается?`, { reply_markup: kb });
});
bot.callbackQuery(/^co:(love|money|path):([a-z]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.theme = ctx.match[1]; u.concern = ctx.match[2]; u.step = "num_sub"; saveUser(u);
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
  await ctx.replyWithChatAction("typing");
  if (u.branch === "tarot" && u.tarotCard) {
    let d = await ai.generateTarotDeep(u.tarotCard, u.tarotQuestion, u.tarotTheme ? themeById(u.tarotTheme).label : "твой вопрос");
    await sendDeep(ctx, d, getArcana(u.tarotCard).name);
  } else if (u.branch === "numerology" && u.birth) {
    const matrix = calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year);
    let d = await ai.generateDeep(matrix, u.name, SPHERES[u.theme].label, concernText(u.theme, u.concern));
    await sendDeep(ctx, d, SPHERES[u.theme].label);
  } else { await ctx.reply("Напиши /start, чтобы начать."); return; }
  u.step = "menu"; u.onboarded = true; saveUser(u);
  await sleep(400);
  await showMenu(ctx, "А теперь идём дальше. Спроси о чём угодно в чате со мной, или выбери в меню.");
});
async function sendDeep(ctx, d, fallbackName) {
  if (!d) { await ctx.reply(`Карта ${fallbackName} говорит о многом. В ней и сила, и то, что пока в тени. Не торопи себя, один честный шаг здесь дороже десяти суетливых. Глубже можно пойти со мной, в разборах и на консультации.`); return; }
  await ctx.reply(`${esc(d.opening)}\n\n${esc(d.insight)}\n\n<i>${esc(d.advice)}</i>\n\n${esc(d.closing)}`, { parse_mode: "HTML" });
}

// ---------- пункты меню (reply-клавиатура шлёт текст) ----------
async function handleMenu(ctx, label) {
  const u = getUser(ctx.from.id);
  if (label === L.tarot) {
    u.step = "menu"; saveUser(u);
    const priceLine = config.prices.tarot ? `\n\nСтоимость: ${config.prices.tarot} рублей.` : "";
    await ctx.reply(`🔮 <b>Полный расклад</b>\n\nПервый расклад уже показала, теперь идём глубже. Полный расклад собираю под конкретный вопрос: что в корне, что мешает и чем всё закончится. Это разбор именно твоей ситуации, как на консультации, поэтому он платный.${priceLine}`, { parse_mode: "HTML", reply_markup: new InlineKeyboard().text("Оплатить расклад", "pay:tarot") });
  } else if (label === L.arkan) {
    await ctx.reply(ARKAN_DESC, { parse_mode: "HTML" });
    await ctx.reply(ARKAN_SELL, { reply_markup: new InlineKeyboard().webApp("🔮 Открыть калькулятор", config.calcUrl) });
  } else if (label === L.numer) {
    await ctx.reply(NUMER_DESC, { parse_mode: "HTML" });
    await ctx.reply(NUMER_SELL, { reply_markup: new InlineKeyboard().webApp("🔮 Открыть калькулятор", config.calcUrl) });
  } else if (label === L.chat) {
    u.step = "chat"; saveUser(u);
    const left = Math.max(0, config.limits.aiMessagesPerDay - u.counters.aiMessages);
    await ctx.reply(left > 0 ? `Я здесь. Спроси о чём угодно, что тревожит или радует.\n\nСегодня есть ${left} бесплатных сообщения.` : "На сегодня бесплатные сообщения закончились. Безлимит открывается по подписке.", left > 0 ? undefined : { reply_markup: new InlineKeyboard().text("Оплатить", "pay:sub") });
  } else if (label === L.consult) {
    const c = config.contacts.consult;
    const cta = c ? `Записаться: ${c}` : "Запись открою совсем скоро, а пока загляни в канал.";
    await ctx.reply(`🕊 <b>Консультация с Надеждой</b>\n\nЛичный разбор один на один. Час работы, где разбираем ситуацию глубоко: отношения, выбор, деньги, реализация, повторяющиеся сценарии. На выходе ясность и конкретные шаги.\n\nМинимум час, ${config.prices.consult} рублей.\n\n${cta}`, { parse_mode: "HTML", reply_markup: c ? undefined : new InlineKeyboard().url("Канал Надежды", config.channelUrl) });
  } else if (label === L.academy) {
    await ctx.reply("🎓 <b>Лайф Код Академия</b>\n\nСкоро здесь появится академия с обучением. Следи за анонсами в канале.", { parse_mode: "HTML", reply_markup: new InlineKeyboard().url("Канал Надежды", config.channelUrl) });
  } else if (label === L.buy) {
    await ctx.reply(`🛍 <b>Купить карты Таро</b>\n\nАвторскую колоду можно купить у нас. Напиши, и всё расскажем: ${config.contacts.buyCards}`, { parse_mode: "HTML" });
  } else return false;
  return true;
}

// ---------- оплата (заглушка) ----------
bot.callbackQuery(/^pay:/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Оплата через Robokassa скоро подключится прямо здесь. Пока записала заявку, Надежда откроет доступ.", { reply_markup: new InlineKeyboard().url("Канал Надежды", config.channelUrl).row().text("В меню", "to:menu") });
});
bot.callbackQuery("to:menu", async (ctx) => { await ctx.answerCallbackQuery(); const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u); await showMenu(ctx); });

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

  // пункты меню (reply-клавиатура)
  if (Object.values(L).includes(text)) { if (await handleMenu(ctx, text)) return; }

  if (u.step === "chat") {
    const limit = config.limits.aiMessagesPerDay;
    if (u.counters.aiMessages >= limit && !u.subscribed) {
      await ctx.reply("Мне бы хотелось говорить без границ, но на сегодня бесплатные сообщения закончились. Безлимит открывается по подписке.", { reply_markup: new InlineKeyboard().text("Оплатить", "pay:sub") });
      return;
    }
    u.counters.aiMessages++;
    u.chatHistory = (u.chatHistory || []).concat({ role: "user", content: text }).slice(-12); saveUser(u);
    await ctx.replyWithChatAction("typing");
    const matrix = u.birth ? calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year) : null;
    let reply = await ai.generateChatReply(u.chatHistory, text, matrix, u.name);
    if (!reply) reply = "Карты сейчас молчат, но я рядом. Спроси иначе, и я всмотрюсь ещё раз.";
    u.chatHistory = u.chatHistory.concat({ role: "assistant", content: reply }).slice(-12); saveUser(u);
    await ctx.reply(reply);
    const left = limit - u.counters.aiMessages;
    if (!u.subscribed && left === 1) await ctx.reply("Осталось одно бесплатное сообщение на сегодня. Задай его от сердца.");
    else if (!u.subscribed && left <= 0) await ctx.reply("Это было последнее бесплатное сообщение на сегодня. Безлимит открывается по подписке.", { reply_markup: new InlineKeyboard().text("Оплатить", "pay:sub") });
    return;
  }

  if (u.branch || u.birth) await showMenu(ctx, "Выбирай в меню, о чём поговорим.");
  else await ctx.reply("Чтобы начать, напиши /start.");
});

bot.catch((err) => console.error("Ошибка бота:", err?.error?.message || err?.message || err));

async function setup() {
  try { await bot.api.setChatMenuButton({ menu_button: { type: "web_app", text: "Калькулятор", web_app: { url: config.calcUrl } } }); } catch (e) { console.error("menu button:", e?.message); }
  pay.startResultServer((invId) => console.log("Оплачен счёт", invId));
}
bot.start({ onStart: async (bi) => { await setup(); console.log("Бот запущен: @" + bi.username); } });
