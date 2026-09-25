// Телеграм-бот Надежды. Две цепочки на выбор (Таро и Нумерология),
// подписочный гейт, глубокий разбор, меню reply-клавиатурой, мини-апп калькулятор,
// оплата Robokassa (заглушка с готовой логикой). Тон: таролог-психолог, на «ты» умеренно.
const path = require("path");
const { randomUUID } = require("crypto");
const { Bot, InlineKeyboard, Keyboard, InputFile } = require("grammy");
const config = require("./config");
const { getUser, saveUser, allUsers, getCircles, setCircle } = require("./store");
const { calculatePersonalMatrix } = require("../engine/calculations");
const { getArcana } = require("../engine/arcana");
const { SPHERES, sphereCards, concernText } = require("../engine/spheres");
const { THEMES, themeById, drawArcana, fallbackReveal, today } = require("../engine/tarot");
const deck = require("../engine/deck78");
const paidDecks = require("../engine/paidDecks");
const taroCredits = require("../engine/taroCredits");
const { renderThemeCards } = require("../render/theme");
const { renderDeckChoice } = require("../render/deck");
const ai = require("../ai/reading");
const { applyReferral, sendAll, previewCardOfDay } = require("./broadcasts");
const pay = require("./payment");
const analytics = require("./analytics");
const { t, menuKey } = require("./i18n");
const track = analytics.track;

const bot = new Bot(config.botToken);
let botUsername = "taroiibbot";
// Тихо запоминаем ник и имя из Telegram у каждого, кто пишет боту. Пишем в базу только при изменении.
bot.use(async (ctx, next) => {
  try {
    const from = ctx.from;
    if (from && !from.is_bot) {
      const u = getUser(from.id);
      const uname = from.username || "";
      const fname = from.first_name || "";
      if (u.username !== uname || u.firstName !== fname) { u.username = uname; u.firstName = fname; saveUser(u); }
    }
  } catch (_) {}
  await next();
});
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
function mainMenu(lang) {
  return new Keyboard()
    .text(t(lang, "menu_arkan")).text(t(lang, "menu_numer")).row()
    .text(t(lang, "menu_tarot")).webApp(t(lang, "btn_calc"), config.calcUrl).row()
    .text(t(lang, "menu_shop")).text(t(lang, "menu_invite")).row()
    .text(t(lang, "menu_academy")).text(t(lang, "menu_consult")).row()
    .text(t(lang, "menu_chat")).text(t(lang, "menu_support")).row()
    .text(t(lang, "menu_social")).text(t(lang, "menu_club")).row()
    .resized()
    .placeholder(t(lang, "menu_placeholder"));
}
async function showMenu(ctx, text) {
  const u = getUser(ctx.from.id);
  await ctx.reply(text || t(u.lang, "menu_open"), { reply_markup: mainMenu(u.lang) });
  try {
    if (!u.menuHintShown) { u.menuHintShown = true; saveUser(u); await ctx.reply(t(u.lang, "menu_hint")); }
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
const ARKAN_DESC_EN =
  "🃏 <b>The Arcanum Code method</b>\n\nA deep system of personality analysis based on the 22 Major Arcana of the Tarot. Each arcanum reflects a personality type: character, behavior patterns, innate talents, strengths and life tasks.\n\nFrom your birth date a unique set of arcana is calculated, showing how these qualities appear in your decisions, relationships, money, profession and self realization. The result is not abstract advice but a clear map of yourself: who you are at the core, where your main resource is, which scenarios shape your life and where to move next.";
const ARKAN_SELL_EN =
  "The full Arcanum Code reading is built in an interactive calculator. Honestly, access is paid, because it is not a template but a deep personal reading by the author's method. The result is a full personality map: strengths, talents, tasks, what shapes your life and where to move to unlock your potential and choose more consciously.";
const NUMER_DESC_EN =
  "🔢 <b>The Numerology method</b>\n\nAn author's system based on classic numerology. Your birth date is a personal code: each digit reflects character traits, behavior patterns, talents and life tasks.\n\nThis analysis helps you understand yourself, see your strengths, realize which scenarios shape your life, and choose the direction where you realize yourself best.";
const NUMER_SELL_EN =
  "The full numerology reading is also in the interactive calculator. Honestly, access is paid, because it is a deep personal reading by the author's method, not generic descriptions. The result is a full personality map: strengths, talents, tasks, what shapes your life and where to move to unlock your potential and live more consciously.";

function parseDate(t) {
  const m = String(t).trim().match(/^(\d{1,2})[.\/\s-](\d{1,2})[.\/\s-](\d{4})$/);
  if (!m) return null;
  const day = +m[1], month = +m[2], year = +m[3], now = new Date().getFullYear();
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > now) return null;
  return { day, month, year };
}
async function waiting(ctx) {
  // анимация тасовки колоды, потом удаляем
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
function subKeyboard(lang) { return new InlineKeyboard().url(t(lang, "sub_btn"), config.channelUrl).row().text(t(lang, "sub_check_btn"), "check_sub"); }
const pick = (u, en, ru) => (u && u.lang === "en" ? en : ru);
const LANG_PROMPT = "Выберите язык.\nPlease choose your language.";
async function showLanguageChoice(ctx) {
  await ctx.reply(LANG_PROMPT, { reply_markup: new InlineKeyboard().text("🇷🇺 Русский", "lang:ru").text("🇬🇧 English", "lang:en") });
}
async function sendGreeting(ctx, u) {
  await sendCircle(ctx, "welcome");
  const nm = ctx.from.first_name ? `, ${ctx.from.first_name}` : "";
  await ctx.reply(t(u.lang, "greeting", { name: nm }), { parse_mode: "HTML", reply_markup: new InlineKeyboard().text(t(u.lang, "btn_tarot"), "br:tarot").text(t(u.lang, "btn_numer"), "br:numer") });
}
async function sendCircle(ctx, slot) {
  try { const c = getCircles(); if (c && c[slot]) await ctx.replyWithVideoNote(c[slot]); } catch (_) {}
}

let deckCache = null;
async function deckImage() { if (!deckCache) deckCache = await renderDeckChoice(5, { title: "Выбери карту", subtitle: "ту, к которой тянет" }); return deckCache; }

// ---------- цифровой расклад Таро (3 карты + уточняющие) ----------
// Оставлено только для безопасного завершения старых раскладов, начатых до обновления.
const LEGACY_SPREADS = {
  love:   { label: "Любовь и отношения", emoji: "💞", positions: ["Ты", "Партнёр", "Куда идут отношения"] },
  money:  { label: "Деньги и работа", emoji: "💰", positions: ["Где ты сейчас", "Что мешает или помогает", "Исход"] },
  choice: { label: "Ситуация и выбор", emoji: "🧭", positions: ["Суть ситуации", "Что влияет", "Совет и исход"] },
  future: { label: "Прогноз", emoji: "🌙", positions: ["Прошлое", "Настоящее", "Будущее"] },
};
const LEGACY_DECK_PROFILE = {
  id: "classic", label: "Классическая колода Таро",
  profile: "универсальный расклад",
  method: "Связывай классические значения арканов с вопросом и позициями расклада.",
};

const SPREAD_RELATIONS = {
  partner: "партнёр или человек, который нравится",
  ex: "бывший партнёр",
  family: "родственник",
  friend: "друг или знакомый",
  work: "коллега или руководитель",
  other: "другой человек",
};
const SPREAD_GENDERS = { female: "женщина", male: "мужчина", unspecified: "не указан" };
const SPREAD_COUNTERPARTS = {
  boyfriend: "парень",
  girlfriend: "девушка",
  husband: "муж",
  wife: "жена",
  interest: "человек, который нравится",
  ex: "бывший партнёр",
  other: "другой человек",
};

function sanitizePersonName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ").slice(0, 50);
  return /^[\p{L}\p{M}'’ -]{2,50}$/u.test(name) ? name : "";
}

function newPaidSpread() {
  return {
    deckVersion: 2, category: null, intentId: null, deckId: null, routeReason: "", question: "",
    flowId: randomUUID(), cancelled: false,
    subject: null, counterpart: null, cards: [], revealed: 0, extra: 0, extraCards: [],
  };
}
function isActivePaidStep(u, ...steps) {
  return !!(u && u.spread && !u.spread.cancelled && steps.includes(u.step));
}
function isSamePaidFlow(userId, flowId, ...steps) {
  const current = getUser(userId);
  return !!(current.spread && current.spread.flowId === flowId && !current.spread.cancelled && steps.includes(current.step));
}
function cancelInteractiveFlow(u) {
  if (u.spread && String(u.step || "").startsWith("sp_")) {
    u.spread.cancelled = true;
    delete u.spread.revealingAt;
  }
  u.step = "menu";
  saveUser(u);
}
function spreadSubjectSummary(u) {
  const subject = u && u.spread && u.spread.subject;
  if (!subject || subject.kind === "self") return "для себя";
  const relation = SPREAD_RELATIONS[subject.relation] || SPREAD_RELATIONS.other;
  const gender = SPREAD_GENDERS[subject.gender] || SPREAD_GENDERS.unspecified;
  const name = subject.name ? `, имя ${subject.name}` : "";
  return `для другого человека: ${relation}, ${gender}${name}`;
}
function spreadSubjectContext(u, includeNames = false) {
  const subject = u && u.spread && u.spread.subject;
  const counterpart = u && u.spread && u.spread.counterpart;
  const counterpartContext = counterpart && counterpart.present
    ? ` Второй участник ситуации: ${SPREAD_COUNTERPARTS[counterpart.relation] || SPREAD_COUNTERPARTS.other}, пол ${SPREAD_GENDERS[counterpart.gender] || SPREAD_GENDERS.unspecified}.${includeNames && counterpart.name ? ` Имя: ${counterpart.name}.` : ""}`
    : " Конкретный второй участник ситуации не указан.";
  const nameRule = includeNames
    ? " Имя является только ориентиром. Упомяни каждое переданное имя не более одного раза в этом сообщении и не начинай каждый абзац с обращения."
    : " Не используй имена в ответе.";
  if (!subject || subject.kind === "self") {
    const name = includeNames ? ((subject && subject.name) || u.name || "") : "";
    return `Расклад делают для самого пользователя${name ? `, имя ${name}` : ""}. Не придумывай пол, если он не указан в вопросе.${counterpartContext}${nameRule}`;
  }
  const relation = SPREAD_RELATIONS[subject.relation] || SPREAD_RELATIONS.other;
  const gender = SPREAD_GENDERS[subject.gender] || SPREAD_GENDERS.unspecified;
  const name = includeNames && subject.name ? ` Имя главного человека расклада: ${subject.name}.` : "";
  return `Расклад делают для другого человека. Его связь с пользователем: ${relation}. Пол: ${gender}.${name}${counterpartContext} Не смешивай чувства пользователя, главного человека расклада и второго участника, ясно указывай, о ком идёт речь.${nameRule}`;
}

function spreadCounterpartSummary(u) {
  const counterpart = u && u.spread && u.spread.counterpart;
  if (!counterpart || !counterpart.present) return "конкретный человек не указан";
  const relation = SPREAD_COUNTERPARTS[counterpart.relation] || SPREAD_COUNTERPARTS.other;
  const gender = SPREAD_GENDERS[counterpart.gender] || SPREAD_GENDERS.unspecified;
  return `${relation}, ${gender}${counterpart.name ? `, имя ${counterpart.name}` : ""}`;
}

function isNewPaidSpread(u) {
  return !!(u && u.spread && u.spread.deckVersion === 2 && paidDecks.DECKS[u.spread.deckId]);
}
function spreadDeckProfile(u) {
  return isNewPaidSpread(u) ? paidDecks.getDeck(u.spread.deckId) : LEGACY_DECK_PROFILE;
}
function spreadTopicLabel(u) {
  if (isNewPaidSpread(u)) {
    const category = paidDecks.getCategory(u.spread.category);
    const intent = paidDecks.getIntent(u.spread.intentId);
    return intent ? intent.label : category ? category.label : "Жизненная ситуация";
  }
  return (LEGACY_SPREADS[u.spread && u.spread.sphere] || LEGACY_SPREADS.choice).label;
}
function spreadPositions(u) {
  if (isNewPaidSpread(u)) return paidDecks.getDeck(u.spread.deckId).positions;
  return (LEGACY_SPREADS[u.spread && u.spread.sphere] || LEGACY_SPREADS.choice).positions;
}
function spreadCardName(u, card) {
  return isNewPaidSpread(u) ? paidDecks.cardName(u.spread.deckId, card) : deck.cardName(card);
}
function spreadCardInfo(u, card) {
  return isNewPaidSpread(u) ? paidDecks.cardInfo(u.spread.deckId, card) : deck.cardInfo(card);
}
function spreadCardFile(u, card) {
  return isNewPaidSpread(u) ? paidDecks.cardPath(u.spread.deckId, card) : deck.cardFile(card);
}
function drawSpreadCards(u, count, excluded = []) {
  return isNewPaidSpread(u) ? paidDecks.drawCards(u.spread.deckId, count, excluded) : (count === 1 ? [deck.drawCard()] : deck.drawCards(count));
}
let deck3Cache = null;
async function deck3Image() { if (!deck3Cache) deck3Cache = await renderDeckChoice(3, { title: "Выбери карту", subtitle: "ту, к которой тянет" }); return deck3Cache; }
async function showSphereChoice(ctx) {
  const u = getUser(ctx.from.id);
  if (!u.spread || u.spread.cancelled) u.spread = newPaidSpread();
  u.step = "sp_sphere"; saveUser(u);
  const kb = new InlineKeyboard();
  paidDecks.CATEGORIES.forEach((category) => kb.text(`${category.emoji} ${category.label}`, `spcat:${category.id}`).row());
  await ctx.reply("Выбери главную тему. Затем я уточню, что именно хочется узнать, и предложу подходящую колоду.", { reply_markup: kb });
}
async function askSpreadQuestion(ctx) {
  const u = getUser(ctx.from.id);
  const intent = paidDecks.getIntent(u.spread && u.spread.intentId);
  u.step = "sp_question"; saveUser(u);
  const lead = intent && u.spread.intentId !== "custom" ? `${intent.label}. ` : "";
  await ctx.reply(`${lead}Теперь напиши конкретный вопрос одним сообщением. Чем яснее формулировка, тем точнее будет разбор.`);
}
async function showSpreadSubjectChoice(ctx) {
  await ctx.reply("Для кого делаем расклад?", {
    reply_markup: new InlineKeyboard()
      .text("♡ Для себя", "spsub:self").row()
      .text("✦ Для другого человека", "spsub:other"),
  });
}
async function showSpreadRelationChoice(ctx) {
  const kb = new InlineKeyboard()
    .text("♡ Партнёр или симпатия", "sprel:partner").row()
    .text("Бывший партнёр", "sprel:ex").row()
    .text("Родственник", "sprel:family").row()
    .text("Друг или знакомый", "sprel:friend").row()
    .text("Коллега или руководитель", "sprel:work").row()
    .text("Другой человек", "sprel:other");
  await ctx.reply("Кем этот человек приходится тебе?", { reply_markup: kb });
}
async function showSpreadGenderChoice(ctx) {
  await ctx.reply("Укажи пол человека. Это поможет ИИ писать естественно и не путать участников ситуации.", {
    reply_markup: new InlineKeyboard()
      .text("Женщина", "spgender:female").text("Мужчина", "spgender:male").row()
      .text("Не указывать", "spgender:unspecified"),
  });
}
function isRelationshipQuestion(u, question) {
  if (u.spread && (u.spread.category === "love" || u.spread.category === "intimacy")) return true;
  return /любов|отношен|совместим|чувств|парн|муж|жен|девуш|секс|интим|влечен|страст|близост|ревност|измен|бывш/i.test(question || "");
}
async function showCounterpartCheck(ctx) {
  await ctx.reply("Я правильно понимаю, что вопрос связан ещё с конкретным человеком, например с парнем, девушкой, мужем, женой, бывшим партнёром или человеком, который нравится?", {
    reply_markup: new InlineKeyboard()
      .text("Да, есть конкретный человек", "spcp:yes").row()
      .text("Нет, конкретного человека нет", "spcp:no"),
  });
}
async function showCounterpartRelationChoice(ctx) {
  const kb = new InlineKeyboard()
    .text("Парень", "spcprel:boyfriend").text("Девушка", "spcprel:girlfriend").row()
    .text("Муж", "spcprel:husband").text("Жена", "spcprel:wife").row()
    .text("Симпатия", "spcprel:interest").text("Бывший партнёр", "spcprel:ex").row()
    .text("Другой человек", "spcprel:other");
  await ctx.reply("Кем этот человек приходится главному участнику расклада?", { reply_markup: kb });
}
async function showCounterpartGenderChoice(ctx) {
  await ctx.reply("Укажи пол этого человека.", {
    reply_markup: new InlineKeyboard()
      .text("Женщина", "spcpgender:female").text("Мужчина", "spcpgender:male").row()
      .text("Не указывать", "spcpgender:unspecified"),
  });
}
async function finalizeSpreadQuestion(ctx) {
  const u = getUser(ctx.from.id);
  const q = u.spread && u.spread.question;
  if (!q) { await showSphereChoice(ctx); return; }
  if (!u.spread.flowId) u.spread.flowId = randomUUID();
  const flowId = u.spread.flowId;
  u.step = "sp_routing"; saveUser(u);
  if (!u.spread.deckId || u.spread.intentId === "custom") {
    await ctx.replyWithChatAction("typing");
    const localDeckId = paidDecks.localRoute(q);
    const routed = await ai.selectPaidDeck(q, spreadSubjectContext(u, false));
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_routing")) return;
    const acceptedRoute = routed && routed.confidence >= 0.62;
    u.spread.deckId = acceptedRoute ? routed.deckId : localDeckId;
    u.spread.routeReason = acceptedRoute && routed.reason
      ? routed.reason
      : `По смыслу вопроса лучше всего подходит специализация колоды «${paidDecks.getDeck(u.spread.deckId).label}».`;
  }
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_routing")) return;
  if (!paidDecks.DECKS[u.spread.deckId]) u.spread.deckId = "thoth";
  u.step = "sp_confirm"; saveUser(u);
  track(ctx.from.id, "spread_deck_route", { deck: u.spread.deckId, intent: u.spread.intentId || "custom" });
  await showSpreadConfirmation(ctx);
}
function deckGuideText() {
  return Object.values(paidDecks.DECKS)
    .map((profile) => `<b>${esc(profile.label)}</b>\n${esc(profile.description)}`)
    .join("\n\n");
}
async function showIntentChoice(ctx, categoryId) {
  const current = getUser(ctx.from.id);
  if (!isActivePaidStep(current, "sp_intent")) return;
  const category = paidDecks.getCategory(categoryId);
  if (!category) { await showSphereChoice(ctx); return; }
  if (categoryId === "custom") {
    const u = getUser(ctx.from.id);
    u.spread.category = "custom"; u.spread.intentId = "custom"; u.step = "sp_subject"; saveUser(u);
    await showSpreadSubjectChoice(ctx);
    return;
  }
  const kb = new InlineKeyboard();
  category.intents.forEach((intentId) => kb.text(paidDecks.getIntent(intentId).label, `spint:${intentId}`).row());
  kb.text("← Другие темы", "spback");
  await ctx.reply(`${category.emoji} <b>${category.label}</b>\n\nЧто именно хочется понять?`, { parse_mode: "HTML", reply_markup: kb });
}
function confirmKeyboard() {
  return new InlineKeyboard()
    .text("Продолжить", "spok").row()
    .text("Выбрать другую колоду", "spchange").row()
    .text("Изменить вопрос", "spedit").text("Сменить тему", "spback");
}
async function showSpreadConfirmation(ctx) {
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  const profile = paidDecks.getDeck(u.spread.deckId);
  const category = paidDecks.getCategory(u.spread.category);
  const intent = paidDecks.getIntent(u.spread.intentId);
  const reason = u.spread.routeReason ? `\n\nПочему эта колода: ${esc(u.spread.routeReason)}` : "";
  const counterpart = u.spread.counterpart && (u.spread.counterpart.present || isRelationshipQuestion(u, u.spread.question))
    ? `\nВторой участник: ${esc(spreadCounterpartSummary(u))}`
    : "";
  const healthQuestion = /здоров|самочув|болит|симптом|лечен|диагноз/i.test(u.spread.question || "");
  const health = (intent && intent.healthDisclaimer) || healthQuestion ? "\n\nВажно: это разбор общего состояния и энергетического фона, не медицинская диагностика." : "";
  await ctx.reply(
    `<b>Проверим перед раскладом</b>\n\nТема: ${esc(category ? category.label : "Свой вопрос")}\nЗапрос: ${esc(intent ? intent.label : "Свой вопрос")}\nДля кого: ${esc(spreadSubjectSummary(u))}${counterpart}\nВопрос: «${esc(u.spread.question)}»\n\nКолода: <b>${esc(profile.label)}</b>\n${esc(profile.description)}${reason}${health}`,
    { parse_mode: "HTML", reply_markup: confirmKeyboard() }
  );
}
async function startRitual(ctx) {
  const u = getUser(ctx.from.id);
  u.spread = u.spread || {};
  if (!u.spread.flowId) u.spread.flowId = randomUUID();
  u.spread.cancelled = false;
  const flowId = u.spread.flowId;
  if (!u.spread.deckId || !paidDecks.DECKS[u.spread.deckId]) u.spread.deckId = "thoth";
  u.spread.deckVersion = 2;
  u.spread.cards = paidDecks.drawCards(u.spread.deckId, 3);
  u.spread.revealed = 0; u.spread.extra = 0; u.spread.extraCards = []; u.spread.firstChosen = false; delete u.spread.revealingAt; u.step = "sp_reading"; saveUser(u);
  // тасовка колоды, затем три карты рубашкой вверх
  await waiting(ctx);
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
  const img = await deck3Image();
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
  const profile = paidDecks.getDeck(u.spread.deckId);
  await ctx.replyWithPhoto(new InputFile(img), { caption: `Колода «${profile.label}» перетасована. Перед тобой три карты рубашкой вверх. Выбери ту, к которой тянет. Выбранная карта откроется первой.`, reply_markup: new InlineKeyboard().text("Карта 1", "spfirst:0").text("Карта 2", "spfirst:1").text("Карта 3", "spfirst:2") });
}
async function showExtraPrompt(ctx) {
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
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
  if (ref) {
    const lm = ref.match(/^(en|ru)(?:[-_](.+))?$/i);
    if (lm) { u.lang = lm[1].toLowerCase(); u.langChosen = true; if (lm[2] && !u.source) u.source = lm[2].slice(0, 64); }
    else if (/^\d+$/.test(ref)) { if (!u.referredBy) applyReferral(ctx.from.id, ref); }
    else if (!u.source) { u.source = ref.slice(0, 64); }
  }
  track(ctx.from.id, "start", { source: u.source || "direct", returning: !!u.onboarded });
  if (u.onboarded) { u.step = "menu"; saveUser(u); await showMenu(ctx, t(u.lang, "welcome_back")); return; }
  Object.assign(u, { step: "idle", branch: null, name: "", birth: null, tarotQuestion: "", tarotTheme: null, tarotCard: null, theme: null, concern: null, chatHistory: [] });
  saveUser(u);
  if (!u.langChosen) { await showLanguageChoice(ctx); return; }
  await sendGreeting(ctx, u);
});
bot.callbackQuery(/^lang:(ru|en)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  u.lang = ctx.match[1]; u.langChosen = true; saveUser(u);
  if (u.onboarded) { await ctx.reply(t(u.lang, "lang_changed")); await showMenu(ctx); }
  else { await sendGreeting(ctx, u); }
});
bot.command("language", async (ctx) => { await showLanguageChoice(ctx); });
bot.command("menu", async (ctx) => { const u = getUser(ctx.from.id); cancelInteractiveFlow(u); await showMenu(ctx); });
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
bot.command("export", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  try {
    const csv = "﻿" + analytics.buildExportCsv(allUsers());
    const stamp = new Date().toISOString().slice(0, 10);
    await ctx.replyWithDocument(new InputFile(Buffer.from(csv, "utf8"), `lifecod_users_${stamp}.csv`), { caption: "Полная выгрузка: каждый юзер, ID, ник, источник и путь по воронке. Открывается в Excel." });
  } catch (e) {
    await ctx.reply("Не удалось собрать выгрузку: " + (e && e.message ? e.message : "ошибка"));
  }
});
bot.command("cardday", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  try { await previewCardOfDay(bot, ctx.chat.id); }
  catch (e) { await ctx.reply("Не удалось собрать карту дня: " + (e && e.message ? e.message : "ошибка")); }
});
bot.command("give", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const parts = (ctx.match || "").trim().split(/\s+/);
  const targetId = parts[0];
  const plan = (parts[1] || "").toLowerCase();
  if (!targetId || !plan) { await ctx.reply("Формат: /give ID план\nПланы: week, month, year, forever, taro\nТаро: /give ID TARO 5 или /give ID TARO unlimited\nБез числа выдаётся 1 расклад. Свой ID человек берёт командой /id."); return; }
  const target = getUser(targetId);
  const now = Date.now();
  const base = (target.proUntil && target.proUntil > now) ? target.proUntil : now;
  if (plan === "week") target.proUntil = base + 7 * 86400000;
  else if (plan === "month") target.proUntil = base + 30 * 86400000;
  else if (plan === "year") target.proUntil = base + 365 * 86400000;
  else if (plan === "forever") target.proUntil = now + 100 * 365 * 86400000;
  else if (plan === "taro") {
    const granted = taroCredits.grant(target, parts[2] || "1");
    if (!granted) { await ctx.reply("Для TARO укажи целое число от 1 или unlimited. Например: /give ID TARO 5"); return; }
  }
  else { await ctx.reply("Не понял план. Доступно: week, month, year, forever, taro."); return; }
  saveUser(target);
  const human = plan === "taro" ? `таро-расклады, доступно: ${taroCredits.balance(target)}` : { week: "подписка на неделю", month: "подписка на месяц", year: "подписка на год", forever: "бессрочная подписка" }[plan];
  await ctx.reply(`Готово. Выдал: ${human}, пользователю ${targetId}.`);
  try { await bot.api.sendMessage(targetId, plan === "taro" ? `Надежда открыла тебе доступ к таро-раскладам. Доступно: ${taroCredits.balance(target)}. Загляни в меню, кнопка «Таро расклад».` : "Надежда открыла тебе подписку. Чат со мной теперь без ограничений."); } catch (_) {}
});
bot.command("take", async (ctx) => {
  if (!config.ownerId || String(ctx.from.id) !== String(config.ownerId)) return;
  const parts = (ctx.match || "").trim().split(/\s+/);
  const targetId = parts[0];
  if (!targetId) { await ctx.reply("Формат: /take ID [число|all]\nБез числа или all обнуляет все таро-расклады и снимает безлимит. С числом списывает столько раскладов. Пример: /take 12345 3 или /take 12345 all."); return; }
  const target = getUser(targetId);
  const res = taroCredits.revoke(target, parts[1]);
  if (!res) { await ctx.reply("Второй аргумент: целое число от 1 или all. Пример: /take ID 3."); return; }
  saveUser(target);
  await ctx.reply(res.cleared
    ? `Готово. Обнулил таро-расклады у ${targetId}. Доступно сейчас: ${taroCredits.balance(target)}.`
    : `Готово. Списал ${res.count} у ${targetId}. Осталось: ${taroCredits.balance(target)}.`);
});
bot.command("help", async (ctx) => {
  await ctx.reply("Я бот Надежды. Внизу есть меню с кнопками, если его не видно, нажми на значок с квадратиками справа от поля ввода.\n\nБыстрые команды: /menu меню, /taro расклад, /chat чат.\n\nЕсли что-то не работает, напиши в техподдержку " + config.contacts.support, { reply_markup: quickKb() });
});
bot.command("taro", async (ctx) => { await handleMenu(ctx, "tarot"); });
bot.command("chat", async (ctx) => { await handleMenu(ctx, "chat"); });
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
  await ctx.reply(t(u.lang, "tarot_intro"), { parse_mode: "HTML" });
  const kb = new InlineKeyboard();
  THEMES.forEach((th) => kb.text(t(u.lang, "theme_" + th.id), `tt:${th.id}`).row());
  kb.text(t(u.lang, "tarot_custom_btn"), "tt:custom");
  await ctx.reply(t(u.lang, "tarot_pick_theme"), { reply_markup: kb });
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
  await ctx.reply(t(u.lang, "tarot_custom_prompt"));
});
async function sendDeck(ctx) {
  const u = getUser(ctx.from.id);
  const img = await deckImage();
  await ctx.replyWithPhoto(new InputFile(img), {
    caption: t(u.lang, "tarot_deck_caption"),
    reply_markup: new InlineKeyboard().text("1", "pick:1").text("2", "pick:2").text("3", "pick:3").text("4", "pick:4").text("5", "pick:5"),
  });
}
bot.callbackQuery(/^pick:([1-5])$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.tarotQuestion) { await ctx.reply(t(u.lang, "restart_hint")); return; }
  const pos = +ctx.match[1];
  const card = deck.drawCard();
  u.tarotCard = card; u.step = "tarot_sub"; saveUser(u);
  track(ctx.from.id, "pick", { branch: "tarot", card: card.key });
  await ctx.replyWithChatAction("upload_photo");
  // сырая карта оригиналом, без эффектов
  const cf = deck.cardFile(card); if (cf) await ctx.replyWithPhoto(new InputFile(cf));
  let r = await ai.generateTarotReveal(deck.cardInfo(card), u.tarotQuestion, u.lang);
  const name = deck.cardName(card);
  const label = t(u.lang, "tarot_card_label");
  const text = r
    ? `${label}: <b>${esc(name)}</b>.\n\n${esc(r.text)}\n\n<i>${esc(r.hook)}</i>`
    : `${label}: <b>${esc(name)}</b>.\n\n${esc(t(u.lang, "tarot_reveal_fallback", { name }))}\n\n<i>${esc(t(u.lang, "tarot_reveal_hook_fallback"))}</i>`;
  await ctx.reply(text, { parse_mode: "HTML" });
  track(ctx.from.id, "reveal", { branch: "tarot" });
  await sleep(400);
  await ctx.reply(t(u.lang, "tarot_subgate"), { reply_markup: subKeyboard(u.lang) });
  track(ctx.from.id, "subgate", { branch: "tarot" });
});

// ---------- ветка НУМЕРОЛОГИЯ ----------
bot.callbackQuery("br:numer", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.branch = "numerology"; u.step = "await_name"; saveUser(u);
  track(ctx.from.id, "branch", { value: "numer" });
  await ctx.reply(t(u.lang, "numer_ask_name"));
});
bot.callbackQuery(/^th:(love|money|path)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const key = ctx.match[1];
  const u = getUser(ctx.from.id); u.theme = key; u.step = "await_concern"; saveUser(u);
  track(ctx.from.id, "theme", { branch: "numer", value: key });
  const s = SPHERES[key];
  const kb = new InlineKeyboard();
  s.concerns.forEach((c) => kb.text(c.text, `co:${key}:${c.id}`).row());
  await ctx.reply(t(u.lang, "numer_concern_prompt", { sphere: `${s.emoji} ${s.label}` }), { reply_markup: kb });
});
bot.callbackQuery(/^co:(love|money|path):([a-z]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id); u.theme = ctx.match[1]; u.concern = ctx.match[2]; u.step = "num_sub"; saveUser(u);
  track(ctx.from.id, "subgate", { branch: "numer", concern: ctx.match[2] });
  await ctx.reply(t(u.lang, "numer_subgate", { sphere: SPHERES[u.theme].label }), { reply_markup: subKeyboard(u.lang) });
});

// ---------- подписка -> глубокий разбор -> меню ----------
bot.callbackQuery("check_sub", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!(await isSubscribed(ctx))) {
    await ctx.reply(t(u.lang, "check_sub_notyet"), { reply_markup: subKeyboard(u.lang) });
    return;
  }
  u.subscribed = true; saveUser(u);
  track(ctx.from.id, "subscribed", { branch: u.branch === "tarot" ? "tarot" : "numer" });
  await ctx.replyWithChatAction("typing");
  let fbBranch = null;
  if (u.branch === "tarot" && u.tarotCard) {
    let d = await ai.generateTarotDeep(deck.cardInfo(u.tarotCard), u.tarotQuestion, u.tarotTheme ? themeById(u.tarotTheme).label : "твой вопрос", u.lang);
    await sendDeep(ctx, d, deck.cardName(u.tarotCard));
    fbBranch = "tarot";
  } else if (u.branch === "numerology" && u.birth) {
    const matrix = calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year);
    let d = await ai.generateDeep(matrix, u.name, SPHERES[u.theme].label, concernText(u.theme, u.concern), u.lang);
    await sendDeep(ctx, d, SPHERES[u.theme].label);
    fbBranch = "numer";
  } else { await ctx.reply("Напиши /start, чтобы начать."); return; }
  u.step = "menu"; u.onboarded = true; saveUser(u);
  if (fbBranch) track(ctx.from.id, "deep", { branch: fbBranch });
  if (fbBranch) { await sleep(1000); await askFeedback(ctx, fbBranch); }
  await sleep(400);
  await showMenu(ctx, t(u.lang, "deep_menu_intro"));
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
async function handleMenu(ctx, key) {
  const u = getUser(ctx.from.id);
  cancelInteractiveFlow(u);
  track(ctx.from.id, "menu_click", { button: t("ru", "menu_" + key) });
  if (key === "tarot") {
    const tp = config.taro;
    u.step = "sp_sphere";
    u.spread = newPaidSpread();
    saveUser(u);
    await ctx.reply(pick(u,
      `🔮 <b>Full Tarot reading</b>\n\nFirst we define your exact request. The bot will suggest a fitting deck, and if you wish you can choose any of the seven. Then three cards open on the right positions. After the final reading you can ask up to three follow-up questions on the same deck.\n\nPrice ${tp.price} rubles, was ${tp.old}, discount ${tp.discount}%.`,
      `🔮 <b>Полный расклад Таро</b>\n\nСначала определим точный запрос. Бот предложит подходящую колоду, а при желании можно выбрать любую из семи. Затем откроются три карты по подходящим позициям. После итогового разбора можно задать до трёх уточняющих вопросов на той же колоде.\n\nСтоимость ${tp.price} рублей, было ${tp.old}, скидка ${tp.discount}%.`), { parse_mode: "HTML" });
    await showSphereChoice(ctx);
  } else if (key === "arkan") {
    await sendCircle(ctx, "arkan");
    await ctx.reply(pick(u, ARKAN_DESC_EN, ARKAN_DESC), { parse_mode: "HTML" });
    await ctx.reply(pick(u, ARKAN_SELL_EN, ARKAN_SELL), { reply_markup: new InlineKeyboard().webApp(t(u.lang, "btn_calc"), config.calcUrl) });
  } else if (key === "numer") {
    await sendCircle(ctx, "numer");
    await ctx.reply(pick(u, NUMER_DESC_EN, NUMER_DESC), { parse_mode: "HTML" });
    await ctx.reply(pick(u, NUMER_SELL_EN, NUMER_SELL), { reply_markup: new InlineKeyboard().webApp(t(u.lang, "btn_calc"), config.calcUrl) });
  } else if (key === "chat") {
    u.step = "chat"; saveUser(u);
    const paid = isPaid(u);
    const left = Math.max(0, config.limits.aiMessagesPerDay - (u.chatFree || 0));
    await ctx.reply(pick(u,
      "💬 <b>Chat with Nadezhda (AI)</b>\n\nThis is my digital version, an AI trained on my methods. Warm and to the point. A live session with me in person is a separate button, Consultation.",
      "💬 <b>Чат с Надеждой (ИИ)</b>\n\nЭто моя цифровая версия, отвечает искусственный интеллект, обученный на моих методиках. Живо и по делу. Живая встреча со мной это отдельная кнопка, Консультация."), { parse_mode: "HTML" });
    if (paid) await ctx.reply(pick(u, "Your subscription is active. Ask me anything, I answer without limits.", "У тебя активна подписка. Спрашивай о чём угодно, отвечаю без ограничений."));
    else if (left > 0) await ctx.reply(pick(u, `Ask me anything that worries or delights you. You have ${left} free messages, then by subscription.`, `Спроси о чём угодно, что тревожит или радует. Есть ${left} бесплатных сообщения, дальше по подписке.`));
    else await showChatPaywall(ctx);
  } else if (key === "consult") {
    const phone = config.contacts.consultPhone;
    await ctx.reply(pick(u,
      `🕊 <b>Consultation with Nadezhda</b>\n\nThis is a personal one on one session, not with the bot but with me live. One hour of work: relationships, choices, money, self realization, repeating patterns. You leave with clarity and concrete steps.\n\nMinimum one hour, ${config.prices.consult} rubles.\n\nTo book, write to me on Telegram.`,
      `🕊 <b>Консультация с Надеждой</b>\n\nЭто личная встреча один на один, не с ботом, а со мной вживую. Час работы: отношения, выбор, деньги, реализация, повторяющиеся сценарии. На выходе ясность и конкретные шаги.\n\nМинимум час, ${config.prices.consult} рублей.\n\nДля записи напиши мне в Telegram.`), { parse_mode: "HTML", reply_markup: new InlineKeyboard().url(pick(u, "Write to book", "Написать для записи"), "tg://resolve?phone=" + phone) });
  } else if (key === "academy") {
    await ctx.reply(pick(u,
      "🎓 <b>Life Code Academy</b>\n\nAn academy with courses is coming here soon. Follow the announcements in the channel.",
      "🎓 <b>Лайф Код Академия</b>\n\nСкоро здесь появится академия с обучением. Следи за анонсами в канале."), { parse_mode: "HTML", reply_markup: new InlineKeyboard().url(pick(u, "Nadezhda's channel", "Канал Надежды"), config.channelUrl) });
  } else if (key === "club") {
    await ctx.reply(pick(u,
      "🔒 <b>Private club</b>\n\nNadezhda's private club is opening soon: personal readings, live streams and celebrity readings. Follow the announcements in the channel.",
      "🔒 <b>Закрытый клуб</b>\n\nСкоро откроется закрытый клуб Надежды: личные разборы, живые эфиры и разборы знаменитостей. Следи за анонсами в канале."), { parse_mode: "HTML", reply_markup: new InlineKeyboard().url(pick(u, "Nadezhda's channel", "Канал Надежды"), config.channelUrl) });
  } else if (key === "shop") {
    await ctx.reply(pick(u,
      `🛍 <b>Shop</b>\n\nHere you can buy unique author Tarot cards, branded clothing in the numerology and Tarot theme, towels and bed linen.\n\nTo order, write: ${config.contacts.buyCards}`,
      `🛍 <b>Магазин</b>\n\nУ нас можно приобрести: уникальные авторские карты Таро, фирменную одежду в тематике нумерологии и Таро, полотенца, постельное бельё.\n\nДля покупки напиши: ${config.contacts.buyCards}`), { parse_mode: "HTML" });
  } else if (key === "invite") {
    const link = `https://t.me/${botUsername}?start=${ctx.from.id}`;
    await ctx.reply(pick(u,
      `👥 <b>Invite a friend</b>\n\nSend this link to a friend. When they open it and start the bot, you both get a bonus message in the chat with me.\n\n${link}`,
      `👥 <b>Пригласить друга</b>\n\nОтправь эту ссылку другу. Когда он зайдёт по ней и запустит бота, вы оба получите бонусное сообщение в чате со мной.\n\n${link}`), { parse_mode: "HTML" });
  } else if (key === "support") {
    await ctx.reply(pick(u,
      `🛟 <b>Support</b>\n\nIf something is not working or you have a question, write to us: ${config.contacts.support}`,
      `🛟 <b>Техподдержка</b>\n\nЕсли что-то не работает или есть вопрос, напиши нам: ${config.contacts.support}`), { parse_mode: "HTML" });
  } else if (key === "social") {
    const soc = config.social;
    const kb = new InlineKeyboard()
      .url("Instagram · " + pick(u, "Tarot", "Таро"), soc.instaTaro).row()
      .url("Instagram · " + pick(u, "Numerology", "Нумерология"), soc.instaNumer).row()
      .url("YouTube · " + pick(u, "Tarot", "Таро"), soc.youtubeTaro).row()
      .url("YouTube · " + pick(u, "Numerology", "Нумерология"), soc.youtubeNumer).row()
      .url("TikTok", soc.tiktok);
    await ctx.reply(pick(u,
      "🌐 <b>Nadezhda's official socials</b>\n\nOnly these accounts are real. Be careful, do not fall for fakes and copycat pages.",
      "🌐 <b>Официальные соцсети Надежды</b>\n\nТолько эти аккаунты настоящие. Будь внимателен, не ведись на фейки и страницы-двойники."), { parse_mode: "HTML", reply_markup: kb });
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
bot.callbackQuery(/^spcat:(love|intimacy|person|money|events|choice|path|state|custom)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_sphere")) return;
  u.spread = u.spread || newPaidSpread();
  u.spread.deckVersion = 2; u.spread.category = ctx.match[1]; u.spread.intentId = null; u.spread.deckId = null; u.spread.subject = null; u.spread.counterpart = null; u.spread.question = ""; u.step = "sp_intent"; saveUser(u);
  track(ctx.from.id, "spread_category", { category: ctx.match[1] });
  await showIntentChoice(ctx, ctx.match[1]);
});

bot.callbackQuery(/^spint:([a-z_]+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const intent = paidDecks.getIntent(ctx.match[1]);
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_intent")) return;
  if (!intent || !intent.deckId) { await ctx.reply("Не удалось определить запрос. Выбери тему ещё раз."); await showSphereChoice(ctx); return; }
  u.spread = u.spread || { deckVersion: 2 };
  u.spread.deckVersion = 2; u.spread.intentId = ctx.match[1]; u.spread.deckId = intent.deckId;
  u.spread.routeReason = `Запрос «${intent.label}» точнее всего раскрывает специализация этой колоды.`;
  u.step = "sp_subject"; saveUser(u);
  track(ctx.from.id, "spread_intent", { intent: ctx.match[1], deck: intent.deckId });
  await showSpreadSubjectChoice(ctx);
});

bot.callbackQuery(/^spsub:(self|other)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_subject")) return;
  if (!u.spread || !u.spread.intentId) { await showSphereChoice(ctx); return; }
  if (ctx.match[1] === "self") {
    u.spread.subject = { kind: "self", relation: "self", gender: "unspecified", name: u.name || ctx.from.first_name || "" };
    saveUser(u);
    track(ctx.from.id, "spread_subject", { kind: "self" });
    await askSpreadQuestion(ctx);
    return;
  }
  u.spread.subject = { kind: "other", relation: null, gender: null, name: "" };
  u.step = "sp_subject_relation"; saveUser(u);
  track(ctx.from.id, "spread_subject", { kind: "other" });
  await showSpreadRelationChoice(ctx);
});

bot.callbackQuery(/^sprel:(partner|ex|family|friend|work|other)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_subject_relation")) return;
  if (!u.spread || !u.spread.subject || u.spread.subject.kind !== "other") { await showSpreadSubjectChoice(ctx); return; }
  u.spread.subject.relation = ctx.match[1]; u.step = "sp_subject_gender"; saveUser(u);
  await showSpreadGenderChoice(ctx);
});

bot.callbackQuery(/^spgender:(female|male|unspecified)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_subject_gender")) return;
  if (!u.spread || !u.spread.subject || u.spread.subject.kind !== "other") { await showSpreadSubjectChoice(ctx); return; }
  u.spread.subject.gender = ctx.match[1]; u.step = "sp_subject_name"; saveUser(u);
  await ctx.reply("Как зовут этого человека? Напиши имя одним сообщением или выбери «Без имени».", {
    reply_markup: new InlineKeyboard().text("Без имени", "spname:skip"),
  });
});

bot.callbackQuery("spname:skip", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_subject_name")) return;
  if (!u.spread || !u.spread.subject || u.spread.subject.kind !== "other") { await showSpreadSubjectChoice(ctx); return; }
  u.spread.subject.name = ""; saveUser(u);
  await askSpreadQuestion(ctx);
});

bot.callbackQuery(/^spcp:(yes|no)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_counterpart_check")) return;
  if (!u.spread || !u.spread.question) { await showSphereChoice(ctx); return; }
  if (ctx.match[1] === "no") {
    u.spread.counterpart = { present: false, relation: null, gender: "unspecified", name: "" };
    saveUser(u);
    await finalizeSpreadQuestion(ctx);
    return;
  }
  u.spread.counterpart = { present: true, relation: null, gender: null, name: "" };
  u.step = "sp_counterpart_relation"; saveUser(u);
  await showCounterpartRelationChoice(ctx);
});

bot.callbackQuery(/^spcprel:(boyfriend|girlfriend|husband|wife|interest|ex|other)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_counterpart_relation")) return;
  if (!u.spread || !u.spread.counterpart || !u.spread.counterpart.present) { await showCounterpartCheck(ctx); return; }
  u.spread.counterpart.relation = ctx.match[1];
  u.step = "sp_counterpart_gender"; saveUser(u);
  await showCounterpartGenderChoice(ctx);
});

bot.callbackQuery(/^spcpgender:(female|male|unspecified)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_counterpart_gender")) return;
  if (!u.spread || !u.spread.counterpart || !u.spread.counterpart.present) { await showCounterpartCheck(ctx); return; }
  u.spread.counterpart.gender = ctx.match[1]; u.step = "sp_counterpart_name"; saveUser(u);
  await ctx.reply("Как зовут этого человека? Напиши имя одним сообщением или выбери «Без имени».", {
    reply_markup: new InlineKeyboard().text("Без имени", "spcpname:skip"),
  });
});

bot.callbackQuery("spcpname:skip", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_counterpart_name")) return;
  if (!u.spread || !u.spread.counterpart || !u.spread.counterpart.present) { await showCounterpartCheck(ctx); return; }
  u.spread.counterpart.name = ""; saveUser(u);
  await finalizeSpreadQuestion(ctx);
});

bot.callbackQuery("spback", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.spread || u.spread.cancelled || !String(u.step || "").startsWith("sp_")) return;
  u.step = "sp_sphere"; u.spread = newPaidSpread(); saveUser(u);
  await showSphereChoice(ctx);
});

// Совместимость со старыми сообщениями подтверждения.
bot.callbackQuery("spno", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.spread || u.spread.cancelled || !String(u.step || "").startsWith("sp_")) return;
  u.step = "sp_sphere"; u.spread = newPaidSpread(); saveUser(u);
  await showSphereChoice(ctx);
});

bot.callbackQuery("spedit", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  if (!u.spread) { await showSphereChoice(ctx); return; }
  u.spread.question = ""; u.spread.counterpart = null; u.step = "sp_question"; saveUser(u);
  await ctx.reply("Напиши исправленный вопрос одним сообщением.");
});

bot.callbackQuery("spchange", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  const kb = new InlineKeyboard();
  Object.values(paidDecks.DECKS).forEach((profile) => kb.text(profile.label, `spdeck:${profile.id}`).row());
  kb.text("← Оставить рекомендацию", "spconfirm");
  await ctx.reply(`<b>Выбери колоду вручную</b>\n\n${deckGuideText()}\n\nВопрос и данные человека останутся прежними.`, { parse_mode: "HTML", reply_markup: kb });
});

bot.callbackQuery(/^spdeck:(author|thoth|lenormand|ludy-lescot|deviant-moon|golden-taurus|decameron)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  if (!u.spread || !u.spread.question) { await showSphereChoice(ctx); return; }
  u.spread.deckId = ctx.match[1]; u.spread.deckVersion = 2; u.spread.routeReason = "Колода выбрана вручную."; u.step = "sp_confirm"; saveUser(u);
  track(ctx.from.id, "spread_deck_override", { deck: ctx.match[1] });
  await showSpreadConfirmation(ctx);
});

bot.callbackQuery("spconfirm", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  if (!u.spread || !u.spread.question || !u.spread.deckId) { await showSphereChoice(ctx); return; }
  u.step = "sp_confirm"; saveUser(u);
  await showSpreadConfirmation(ctx);
});

bot.callbackQuery("spok", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_confirm")) return;
  if (!u.spread || !u.spread.question || (!u.spread.deckId && !u.spread.sphere)) { await ctx.reply("Начни заново через кнопку «Таро расклад»."); return; }
  if (taroCredits.hasCredit(u)) {
    taroCredits.consume(u); u.pay = null; saveUser(u);
    track(ctx.from.id, "paid", { product: config.taro.product, free: true });
    await startRitual(ctx);
    return;
  }
  const t = config.taro;
  if (!u.spread.flowId) u.spread.flowId = randomUUID();
  const flowId = u.spread.flowId;
  u.step = "sp_payment"; saveUser(u);
  const r = await pay.createBotPayment(ctx.from.id, t.product);
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_payment")) return;
  if (!r || !r.payment_url) {
    u.step = "sp_confirm"; saveUser(u);
    await ctx.reply("Не удалось создать оплату, попробуй ещё раз или напиши в техподдержку " + config.contacts.support);
    return;
  }
  u.pay = { kind: "taro", product: t.product, invId: r.inv_id }; saveUser(u);
  track(ctx.from.id, "pay_click", { what: t.product });
  const testNote = r.is_test ? "\n\n(тестовый режим оплаты)" : "";
  await ctx.reply(`Счёт на ${t.price} рублей за полный расклад.${testNote}\n\nОплати по кнопке, потом вернись и нажми «Проверить оплату».`, { reply_markup: new InlineKeyboard().url(`Оплатить ${t.price} руб`, r.payment_url).row().text("Проверить оплату", "chk:taro") });
});
bot.callbackQuery("chk:taro", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!u.pay || u.pay.kind !== "taro") { await ctx.reply("Нет активного счёта. Начни оплату заново."); return; }
  const invId = u.pay.invId;
  const r = await pay.checkBotPayment(ctx.from.id, invId);
  const current = getUser(ctx.from.id);
  if (!current.pay || current.pay.kind !== "taro" || current.pay.invId !== invId) return;
  if (r && r.status === "paid") {
    track(ctx.from.id, "paid", { product: current.pay.product });
    current.pay = null;
    if (!isActivePaidStep(current, "sp_payment")) {
      taroCredits.grant(current, "1"); saveUser(current);
      await ctx.reply("Оплата получена. Один расклад сохранён. Когда будешь готов, снова открой «Таро расклад» в меню.");
      return;
    }
    if (current.spread) current.spread.cancelled = false;
    saveUser(current);
    await startRitual(ctx);
  } else if (isActivePaidStep(current, "sp_payment")) {
    await ctx.reply("Оплату пока не вижу. Если только что оплатил, подожди минуту и нажми ещё раз.", { reply_markup: new InlineKeyboard().text("Проверить оплату", "chk:taro") });
  }
});
async function revealNextSpreadCard(ctx) {
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
  if (!u.spread || !u.spread.cards || u.spread.cards.length !== 3) { await ctx.reply("Начни заново через кнопку «Таро расклад»."); return; }
  if (u.spread.revealingAt && Date.now() - u.spread.revealingAt < 120000) return;
  const idx = u.spread.revealed || 0;
  if (idx >= 3) return;
  if (!u.spread.flowId) u.spread.flowId = randomUUID();
  const flowId = u.spread.flowId;
  u.spread.revealingAt = Date.now(); saveUser(u);
  const card = u.spread.cards[idx];
  const positions = spreadPositions(u);
  const pos = positions[idx];
  const topicLabel = spreadTopicLabel(u);
  const profile = spreadDeckProfile(u);
  await ctx.replyWithChatAction("upload_photo");
  try { const cf = spreadCardFile(u, card); if (cf) await ctx.replyWithPhoto(new InputFile(cf)); } catch (_) {}
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
  const prev = u.spread.cards.slice(0, idx);
  const txt = await ai.generateSpreadCard(profile, topicLabel, u.spread.question, pos, idx, spreadCardInfo(u, card), prev.map((item) => spreadCardInfo(u, item)), spreadSubjectContext(u, idx === 0));
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
  const name = spreadCardName(u, card);
  const ordinal = ["Первая карта", "Вторая карта", "Третья карта"][idx];
  await ctx.reply(`<b>${ordinal}, ${esc(pos.toLowerCase())}: ${esc(name)}</b>\n\n${esc(txt || (name + " показывает важную часть ситуации. Сопоставь её с тем, что происходит в реальности."))}`, { parse_mode: "HTML" });
  if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
  u.spread.revealed = idx + 1; delete u.spread.revealingAt; saveUser(u);
  track(ctx.from.id, "spread_card", { idx: idx + 1, deck: u.spread.deckId || "classic" });
  if (u.spread.revealed < 3) {
    await sleep(1500);
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
    const nextPosition = positions[u.spread.revealed];
    const nextNumber = u.spread.revealed === 1 ? "вторую" : "третью";
    const transition = profile.id === "decameron"
      ? (u.spread.revealed === 1
        ? `Притяжение видно не всегда целиком. Вторая позиция, «${nextPosition}», покажет, что действительно хочется прожить, а что пока остаётся только фантазией.`
        : `Желание само по себе ещё не определяет будущее связи. Третья позиция, «${nextPosition}», покажет, совпадают ли близость, намерения и реальные действия.`)
      : `Следующая позиция: «${nextPosition}». Она уточнит то, что предыдущая карта оставила открытым.`;
    await ctx.reply(transition, { reply_markup: new InlineKeyboard().text(`Открыть ${nextNumber} карту`, "sprev") });
  } else {
    await sleep(700);
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
    await ctx.replyWithChatAction("typing");
    const fin = await ai.generateSpreadFinal(profile, topicLabel, u.spread.question, u.spread.cards.map((item) => spreadCardInfo(u, item)), positions, spreadSubjectContext(u, true));
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
    if (fin) await ctx.reply(`<b>Свод</b>\n\n${esc(fin)}`, { parse_mode: "HTML" });
    await sleep(600);
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
    await showExtraPrompt(ctx);
    track(ctx.from.id, "spread_done", { deck: u.spread.deckId || "classic" });
  }
}

bot.callbackQuery(/^spfirst:([0-2])$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
  if (!u.spread || !u.spread.cards || u.spread.cards.length !== 3) { await ctx.reply("Начни заново через кнопку «Таро расклад»."); return; }
  if (u.spread.firstChosen || (u.spread.revealed || 0) > 0) return;
  const selectedIndex = Number(ctx.match[1]);
  const selected = u.spread.cards.splice(selectedIndex, 1)[0];
  u.spread.cards.unshift(selected); u.spread.firstChosen = true; saveUser(u);
  track(ctx.from.id, "spread_first_choice", { selected: selectedIndex + 1, deck: u.spread.deckId });
  await revealNextSpreadCard(ctx);
});

bot.callbackQuery("sprev", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
  if (isNewPaidSpread(u) && !u.spread.firstChosen) { await ctx.reply("Сначала выбери одну из трёх закрытых карт."); return; }
  await revealNextSpreadCard(ctx);
});
bot.callbackQuery("spask", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
  u.step = "sp_extra_q"; saveUser(u);
  await ctx.reply("Напиши свой уточняющий вопрос одним сообщением.");
});
bot.callbackQuery("spdone", async (ctx) => {
  await ctx.answerCallbackQuery();
  const u = getUser(ctx.from.id);
  if (!isActivePaidStep(u, "sp_reading")) return;
  await finishSpread(ctx);
});
bot.callbackQuery("to:menu", async (ctx) => { await ctx.answerCallbackQuery(); const u = getUser(ctx.from.id); cancelInteractiveFlow(u); await showMenu(ctx); });
bot.callbackQuery(/^go:(tarot|chat|consult|menu)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const which = ctx.match[1];
  if (which === "menu") { const u = getUser(ctx.from.id); cancelInteractiveFlow(u); await showMenu(ctx); return; }
  await handleMenu(ctx, which);
});

// ---------- текст: ввод и меню ----------
bot.on("message:text", async (ctx) => {
  const u = getUser(ctx.from.id);
  const text = ctx.message.text;

  // Главное меню имеет приоритет над любым незавершённым сценарием.
  // Иначе подпись кнопки могла быть принята за имя, вопрос или ответ расклада.
  const mk = menuKey(text); if (mk) { if (await handleMenu(ctx, mk)) return; }

  if (u.step === "await_name") {
    u.name = text.trim().slice(0, 40).replace(/[<>]/g, ""); u.step = "await_date"; saveUser(u);
    await ctx.reply(t(u.lang, "numer_ask_date", { name: u.name }));
    return;
  }
  if (u.step === "await_date") {
    const d = parseDate(text);
    if (!d) { await ctx.reply(t(u.lang, "numer_date_error")); return; }
    u.birth = d; saveUser(u);
    await waiting(ctx);
    const matrix = calculatePersonalMatrix(d.day, d.month, d.year);
    const cards = sphereCards(matrix);
    const png = await renderThemeCards(cards.map((c) => ({ n: c.n, label: c.label, sub: c.name })), { title: "Твои три карты", subtitle: "три сферы, где решается твоя судьба" });
    await ctx.replyWithPhoto(new InputFile(png), { caption: t(u.lang, "numer_cards_caption") });
    track(ctx.from.id, "reveal", { branch: "numer" });
    let sph = await ai.generateSpheres(matrix, u.name, u.lang);
    if (sph) {
      const msg = `${esc(sph.preface)}\n\n<b>${t(u.lang, "sphere_love")}</b>\n${esc(sph.love_lead)} ${esc(sph.love)}\n\n<b>${t(u.lang, "sphere_money")}</b>\n${esc(sph.money_lead)} ${esc(sph.money)}\n\n<b>${t(u.lang, "sphere_path")}</b>\n${esc(sph.path_lead)} ${esc(sph.path)}`;
      await ctx.reply(msg, { parse_mode: "HTML" });
    } else {
      await ctx.reply(`Карты легли. В отношениях ведёт ${cards[0].name}, в деле ${cards[1].name}, а путь освещает ${cards[2].name}. За этими тремя картами скрыто гораздо больше.`);
    }
    await sleep(500);
    const kb = new InlineKeyboard().text(t(u.lang, "sphere_love"), "th:love").row().text(t(u.lang, "sphere_money"), "th:money").row().text(t(u.lang, "sphere_path"), "th:path");
    await ctx.reply(t(u.lang, "numer_theme_prompt"), { reply_markup: kb });
    u.step = "await_theme"; saveUser(u);
    return;
  }
  if (u.step === "await_custom_q") {
    u.tarotQuestion = text.trim().slice(0, 300); u.step = "tarot_pick"; saveUser(u);
    await ctx.reply(t(u.lang, "question_accepted"));
    await sendDeck(ctx);
    return;
  }
  if (u.step === "sp_subject_name") {
    if (!u.spread || !u.spread.subject || u.spread.subject.kind !== "other") { u.step = "sp_sphere"; saveUser(u); await showSphereChoice(ctx); return; }
    const personName = sanitizePersonName(text);
    if (personName.length < 2) { await ctx.reply("Напиши имя чуть подробнее или нажми «Без имени»."); return; }
    u.spread.subject.name = personName; saveUser(u);
    await askSpreadQuestion(ctx);
    return;
  }
  if (u.step === "sp_counterpart_name") {
    if (!u.spread || !u.spread.counterpart || !u.spread.counterpart.present) { u.step = "sp_sphere"; saveUser(u); await showSphereChoice(ctx); return; }
    const counterpartName = sanitizePersonName(text);
    if (counterpartName.length < 2) { await ctx.reply("Напиши имя чуть подробнее или нажми «Без имени»."); return; }
    u.spread.counterpart.name = counterpartName; saveUser(u);
    await finalizeSpreadQuestion(ctx);
    return;
  }
  if (u.step === "sp_question") {
    const q = text.trim().slice(0, 300);
    if (q.length < 3) { await ctx.reply("Напиши вопрос чуть подробнее, одним сообщением."); return; }
    u.spread = u.spread || { deckVersion: 2, category: "custom", intentId: "custom" };
    u.spread.question = q; u.spread.deckVersion = 2;
    if (isRelationshipQuestion(u, q)) {
      u.spread.counterpart = null; u.step = "sp_counterpart_check"; saveUser(u);
      await showCounterpartCheck(ctx);
      return;
    }
    u.spread.counterpart = { present: false, relation: null, gender: "unspecified", name: "" };
    saveUser(u);
    await finalizeSpreadQuestion(ctx);
    return;
  }
  if (u.step === "sp_extra_q") {
    if (!u.spread || (!u.spread.deckId && !u.spread.sphere)) { u.step = "menu"; saveUser(u); await showMenu(ctx); return; }
    const q = text.trim().slice(0, 300);
    if (q.length < 3) { await ctx.reply("Напиши уточняющий вопрос чуть подробнее."); return; }
    if (!u.spread.flowId) u.spread.flowId = randomUUID();
    const flowId = u.spread.flowId;
    const excluded = [...(u.spread.cards || []), ...(u.spread.extraCards || [])];
    const card = drawSpreadCards(u, 1, excluded)[0];
    await ctx.replyWithChatAction("upload_photo");
    try { const cf = spreadCardFile(u, card); if (cf) await ctx.replyWithPhoto(new InputFile(cf)); } catch (_) {}
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_extra_q")) return;
    const profile = spreadDeckProfile(u);
    const ans = await ai.generateSpreadExtra(profile, spreadTopicLabel(u), u.spread.question, spreadCardInfo(u, card), q, (u.spread.cards || []).map((item) => spreadCardInfo(u, item)), spreadSubjectContext(u, false));
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_extra_q")) return;
    const name = spreadCardName(u, card);
    await ctx.reply(`<b>${esc(name)}</b>\n\n${esc(ans || "Карта отвечает мягко, прислушайся к первому чувству.")}`, { parse_mode: "HTML" });
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_extra_q")) return;
    u.spread.extraCards = (u.spread.extraCards || []).concat(card);
    u.spread.extra = (u.spread.extra || 0) + 1; u.step = "sp_reading"; saveUser(u);
    track(ctx.from.id, "spread_extra", { n: u.spread.extra, deck: u.spread.deckId || "classic" });
    await sleep(800);
    if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;
    await showExtraPrompt(ctx);
    return;
  }

  if (u.step === "chat") {
    const FREE = config.limits.aiMessagesPerDay;
    const paid = isPaid(u);
    if (!paid && (u.chatFree || 0) >= FREE) { await showChatPaywall(ctx); return; }
    if (!paid) { u.chatFree = (u.chatFree || 0) + 1; }
    track(ctx.from.id, "chat_msg", {});
    u.chatHistory = (u.chatHistory || []).concat({ role: "user", content: text }).slice(-12); saveUser(u);
    await ctx.replyWithChatAction("typing");
    const matrix = u.birth ? calculatePersonalMatrix(u.birth.day, u.birth.month, u.birth.year) : null;
    let reply = await ai.generateChatReply(u.chatHistory, text, matrix, u.name, u.lang);
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
    { command: "language", description: "Язык / Language" },
  ]); } catch (_) {}
  try { await bot.api.setMyDescription("Бот Надежды: таро, нумерология и личные разборы. Вопросы и техподдержка: " + config.contacts.support); } catch (_) {}
  pay.startResultServer((invId) => console.log("Оплачен счёт", invId));
}
bot.start({ onStart: async (bi) => { botUsername = bi.username; await setup(); console.log("Бот запущен: @" + bi.username); } });
