// Телеграм-бот Надежды. Сценарий (черно-золото, сферы жизни):
// старт -> имя -> дата -> анимация -> три карты по сферам (отношения, деньги, путь) +
// живой мини-разбор -> вопрос про тему -> вопрос про боль -> подписка на канал ->
// глубокий разбор по теме (без матрицы) -> меню со смайликами + мини-апп калькулятор.
// Тон: таролог-психолог, на «ты», без длинных тире.

const { Bot, InlineKeyboard, InputFile } = require("grammy");
const config = require("./config");
const { getUser, saveUser } = require("./store");
const { calculatePersonalMatrix } = require("../engine/calculations");
const { getArcana } = require("../engine/arcana");
const { SPHERES, sphereCards, concernText } = require("../engine/spheres");
const { renderThemeCards } = require("../render/theme");
const ai = require("../ai/reading");
const { applyReferral } = require("./broadcasts");

const bot = new Bot(config.botToken);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function parseDate(text) {
  const m = String(text).trim().match(/^(\d{1,2})[.\/\s-](\d{1,2})[.\/\s-](\d{4})$/);
  if (!m) return null;
  const day = +m[1], month = +m[2], year = +m[3];
  const now = new Date().getFullYear();
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > now) return null;
  return { day, month, year };
}

function mainMenu() {
  return new InlineKeyboard()
    .webApp("🔮 Калькулятор судьбы", config.calcUrl).row()
    .text("🌙 Разбор дня", "menu:day").text("✨ Разбор месяца", "menu:month").row()
    .text("🤍 Совместимость", "menu:compat").text("🕯 Расклад по вопросу", "menu:spread").row()
    .text("📜 Чат с тарологом", "menu:chat").row()
    .url("⭐ Канал Надежды", config.channelUrl).text("🕊 Консультация", "menu:consult");
}
function payKeyboard() {
  return new InlineKeyboard().text("Оплатить", "pay:sub").row().text("В меню", "menu:open");
}
async function payStub(ctx, what) {
  await ctx.reply(
    `Чтобы открыть ${what}, нужна подписка. Оплата скоро подключится прямо здесь, а пока я запишу тебя, и Надежда откроет доступ.`,
    { reply_markup: payKeyboard() }
  );
}

async function waiting(ctx) {
  const steps = ["🔮 Считаю...", "✨ Смотрю на карты...", "🌙 Ещё немного..."];
  let msg;
  try {
    msg = await ctx.reply(steps[0]);
    for (let i = 1; i < steps.length; i++) { await sleep(1500); await ctx.api.editMessageText(ctx.chat.id, msg.message_id, steps[i]); }
    await sleep(1200); await ctx.api.deleteMessage(ctx.chat.id, msg.message_id);
  } catch (_) {}
}

// ---------- /start ----------
bot.command("start", async (ctx) => {
  const u = getUser(ctx.from.id);
  const ref = (ctx.match || "").trim();
  if (ref && /^\d+$/.test(ref) && !u.referredBy) applyReferral(ctx.from.id, ref);
  u.step = "await_name"; u.name = ""; u.birth = null; u.chatHistory = []; u.theme = null; u.concern = null;
  saveUser(u);
  await ctx.reply(
    "Здравствуй. Меня зовут Надежда, и уже больше 10 лет я помогаю людям разобраться в себе, в отношениях, в деле, в том, что для них по-настоящему важно.\n\n" +
    "Сейчас я разложу карты на тебя. Но сначала один маленький вопрос."
  );
  await ctx.reply("Как мне к тебе обращаться?");
});

bot.command("menu", async (ctx) => {
  const u = getUser(ctx.from.id);
  if (!u.birth) { await ctx.reply("Давай сначала познакомимся. Напиши /start."); return; }
  u.step = "menu"; saveUser(u);
  await ctx.reply("Что тебя сейчас волнует. Выбирай.", { reply_markup: mainMenu() });
});

// ---------- выбор темы (сферы) ----------
bot.callbackQuery(/^th:(love|money|path)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1];
  const u = getUser(ctx.from.id); u.theme = key; u.step = "await_concern"; saveUser(u);
  const s = SPHERES[key];
  const kb = new InlineKeyboard();
  s.concerns.forEach((c) => kb.text(c.text, `co:${key}:${c.id}`).row());
  await ctx.reply(`${s.emoji} ${s.label}. А что именно сейчас откликается по этой теме?`, { reply_markup: kb });
});

// ---------- выбор боли ----------
bot.callbackQuery(/^co:(love|money|path):([a-z]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1], cid = ctx.match[2];
  const u = getUser(ctx.from.id); u.theme = key; u.concern = cid; u.step = "await_sub"; saveUser(u);
  const s = SPHERES[key];
  await ctx.reply(
    `Я услышала тебя. В твоих картах по теме «${s.label}» правда есть глубокий узор.\n\n` +
    `Чтобы раскрыть его для тебя целиком, загляни в мой канал. Подпишись, и я тут же открою разбор.`,
    { reply_markup: new InlineKeyboard().url("Подписаться на канал", config.channelUrl).row().text("Я подписался, открой разбор", "check_sub") }
  );
});

// ---------- проверка подписки -> глубокий разбор -> меню ----------
bot.callbackQuery("check_sub", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  let ok = false;
  try { const m = await ctx.api.getChatMember(config.channel, ctx.from.id); ok = ["member", "administrator", "creator"].includes(m.status); } catch (_) {}
  if (!ok) {
    await ctx.reply("Пока не вижу тебя в канале. Загляни, и я тут же открою разбор.",
      { reply_markup: new InlineKeyboard().url("Открыть канал", config.channelUrl).row().text("Я подписался, проверь", "check_sub") });
    return;
  }
  if (!u.birth || !u.theme) { await ctx.reply("Напиши /start, чтобы начать заново."); return; }
  u.subscribed = true; saveUser(u);
  await ctx.replyWithChatAction("typing");
  const matrix = calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year);
  const label = SPHERES[u.theme].label;
  const concern = concernText(u.theme, u.concern);
  let d = await ai.generateDeep(matrix, u.name, label, concern);
  if (!d) {
    const card = sphereCards(matrix).find((c) => c.key === u.theme);
    d = {
      opening: `Я всмотрелась в твою карту по теме «${label}», и там звучит ${card.name}.`,
      insight: `Эта карта говорит о тебе больше, чем кажется. В ней и твоя сила, и то, что ты пока держишь в тени.`,
      advice: `Не торопи себя. Один честный шаг здесь стоит десяти суетливых.`,
      closing: `Это лишь часть. Глубже мы можем пойти со мной, в разборах и на консультации.`,
    };
  }
  const text = `${d.opening}\n\n${d.insight}\n\n${d.advice}\n\n${d.closing}`;
  await ctx.reply(text);
  u.step = "menu"; saveUser(u);
  await sleep(400);
  await ctx.reply("А теперь мы можем идти дальше. Спроси меня о чём угодно, у тебя есть три бесплатных сообщения в день. Или загляни в меню.", { reply_markup: mainMenu() });
});

// ---------- меню ----------
bot.callbackQuery("menu:open", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.step = "menu"; saveUser(u);
  await ctx.reply("Что тебя сейчас волнует. Выбирай.", { reply_markup: mainMenu() });
});
bot.callbackQuery("menu:day", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.birth) { await ctx.reply("Сначала напиши /start."); return; }
  if (u.counters.dayReading >= config.limits.dayReadingPerDay && !u.subscribed) { await payStub(ctx, "безлимитный разбор дня"); return; }
  u.counters.dayReading++; saveUser(u);
  await ctx.replyWithChatAction("typing");
  const matrix = calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year);
  let r = await ai.generateDayReading(matrix, u.name);
  if (!r) r = { text: "Сегодня день слушать себя, а не спешить. Одно тихое решение окажется важнее десяти громких.", hook: "Завтра карты откроют новую грань. Возвращайся." };
  await ctx.reply(`🌙 Разбор дня\n\n${r.text}\n\n${r.hook}`, { reply_markup: new InlineKeyboard().text("В меню", "menu:open") });
});
bot.callbackQuery("menu:month", async (ctx) => { await ctx.answerCallbackQuery(); await payStub(ctx, "разбор месяца"); });
bot.callbackQuery("menu:spread", async (ctx) => { await ctx.answerCallbackQuery(); await payStub(ctx, "расклад по твоему вопросу"); });
bot.callbackQuery("menu:compat", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Совместимость я считаю по двум датам рождения. Для глубокого разбора отношений у нас есть отдельный калькулятор, он видит гораздо больше.",
    { reply_markup: new InlineKeyboard().webApp("🔮 Открыть калькулятор", config.calcUrl).row().text("В меню", "menu:open") });
});
bot.callbackQuery("menu:consult", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Личная консультация со мной это отдельный глубокий разговор один на один. Записаться можно через канал.",
    { reply_markup: new InlineKeyboard().url("Написать в канал", config.channelUrl).row().text("В меню", "menu:open") });
});
bot.callbackQuery("menu:chat", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.step = "chat"; saveUser(u);
  const left = Math.max(0, config.limits.aiMessagesPerDay - u.counters.aiMessages);
  await ctx.reply(left > 0 ? `Я здесь. Спроси меня о чём угодно, что тревожит или радует.\n\nСегодня у тебя ${left} бесплатных сообщения.`
    : "На сегодня бесплатные сообщения закончились. Открыть безлимит можно по подписке.", left > 0 ? undefined : { reply_markup: payKeyboard() });
});
bot.callbackQuery(/^pay:/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Спасибо. Оплата через Robokassa скоро подключится прямо здесь. Пока я записала твою заявку, Надежда откроет доступ.",
    { reply_markup: new InlineKeyboard().url("Канал Надежды", config.channelUrl).row().text("В меню", "menu:open") });
});

// ---------- текст: имя, дата, чат ----------
bot.on("message:text", async (ctx) => {
  const u = getUser(ctx.from.id);

  if (u.step === "await_name") {
    u.name = ctx.message.text.trim().slice(0, 40).replace(/[<>]/g, "");
    u.step = "await_date"; saveUser(u);
    await ctx.reply(`Приятно познакомиться, ${u.name}. А когда ты родился(-ась)?\n\nВведи дату в формате ДД.ММ.ГГГГ, например 01.02.1991.`);
    return;
  }

  if (u.step === "await_date") {
    const d = parseDate(ctx.message.text);
    if (!d) { await ctx.reply("Что-то не так с датой. Напиши в формате ДД.ММ.ГГГГ, например 01.02.1991."); return; }
    u.birth = d; saveUser(u);
    await waiting(ctx);

    const matrix = calculatePersonalMatrix(d.day, d.month, d.year);
    const cards = sphereCards(matrix);
    const png = await renderThemeCards(cards.map((c) => ({ n: c.n, label: c.label, sub: c.name })),
      { title: "Твои три карты", subtitle: "три сферы, где решается твоя судьба" });
    await ctx.replyWithPhoto(new InputFile(png), { caption: "Вот они, три твои карты. Смотри." });

    let t = await ai.generateSpheres(matrix, u.name);
    if (!t) {
      t = {
        preface: `${u.name}, карты легли, и они уже говорят.`,
        love_lead: "Первое, что я увидела в твоих отношениях,", love: `это ${cards[0].name}. Ты чувствуешь глубже, чем показываешь.`,
        money_lead: "А вот в деле", money: `звучит ${cards[1].name}. Ты можешь много, когда перестаёшь сомневаться.`,
        path_lead: "И самое важное, твой путь,", path: `это ${cards[2].name}. В нём больше света, чем ты себе позволяешь.`,
      };
    }
    const msg =
      `${esc(t.preface)}\n\n` +
      `${SPHERES.love.emoji} <b>Отношения</b>\n${esc(t.love_lead)} ${esc(t.love)}\n\n` +
      `${SPHERES.money.emoji} <b>Деньги и дело</b>\n${esc(t.money_lead)} ${esc(t.money)}\n\n` +
      `${SPHERES.path.emoji} <b>Путь и сила</b>\n${esc(t.path_lead)} ${esc(t.path)}`;
    await ctx.reply(msg, { parse_mode: "HTML" });

    await sleep(500);
    const kb = new InlineKeyboard()
      .text(`${SPHERES.love.emoji} Отношения`, "th:love").row()
      .text(`${SPHERES.money.emoji} Деньги и дело`, "th:money").row()
      .text(`${SPHERES.path.emoji} Путь и сила`, "th:path");
    await ctx.reply("Скажи, что сейчас откликается сильнее. С чего начнём?", { reply_markup: kb });
    u.step = "await_theme"; saveUser(u);
    return;
  }

  if (u.step === "chat") {
    const limit = config.limits.aiMessagesPerDay;
    if (u.counters.aiMessages >= limit && !u.subscribed) {
      await ctx.reply("Мне бы хотелось говорить с тобой без границ, но на сегодня бесплатные сообщения закончились. Открой безлимит, и я всегда буду на связи.", { reply_markup: payKeyboard() });
      return;
    }
    u.counters.aiMessages++;
    u.chatHistory = (u.chatHistory || []).concat({ role: "user", content: ctx.message.text }).slice(-12);
    saveUser(u);
    await ctx.replyWithChatAction("typing");
    const matrix = u.birth ? calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year) : null;
    let reply = await ai.generateChatReply(u.chatHistory, ctx.message.text, matrix, u.name);
    if (!reply) reply = "Карты сейчас молчат, но я рядом. Спроси иначе, и я всмотрюсь ещё раз.";
    u.chatHistory = u.chatHistory.concat({ role: "assistant", content: reply }).slice(-12); saveUser(u);
    await ctx.reply(reply);
    const left = limit - u.counters.aiMessages;
    if (!u.subscribed && left === 1) await ctx.reply("У тебя осталось одно бесплатное сообщение на сегодня. Задай его от сердца.");
    else if (!u.subscribed && left <= 0) await ctx.reply("Это было последнее бесплатное сообщение на сегодня. Открой безлимит, и мы продолжим без пауз.", { reply_markup: payKeyboard() });
    return;
  }

  if (!u.birth) await ctx.reply("Чтобы начать, напиши /start.");
  else await ctx.reply("Открой меню, и выбери, о чём поговорим.", { reply_markup: new InlineKeyboard().text("Меню", "menu:open") });
});

bot.catch((err) => console.error("Ошибка бота:", err?.error?.message || err?.message || err));

// основная кнопка слева у поля ввода = мини-апп калькулятора
async function setup() {
  try {
    await bot.api.setChatMenuButton({ menu_button: { type: "web_app", text: "Калькулятор", web_app: { url: config.calcUrl } } });
  } catch (e) { console.error("menu button:", e?.message); }
}

bot.start({ onStart: async (bi) => { await setup(); console.log("Бот запущен: @" + bi.username); } });
