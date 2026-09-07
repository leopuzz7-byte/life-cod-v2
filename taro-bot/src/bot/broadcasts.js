// Рассылки и реферальная механика.
// Тексты черновые, финальные лучше от Надежды. Тон живой, на «ты», без длинных тире.
// Отправка требует запущенного бота и планировщика (cron). Здесь функции отправки
// и банк вопросов, вызов по расписанию подключается при деплое (см. README).

const { allUsers, saveUser, getUser } = require("./store");
const config = require("./config");
const fs = require("fs");
const path = require("path");
const ai = require("../ai/reading");
const deck = require("../engine/deck78");

// Банк заботливых вопросов для неплативших (20-30 штук).
const QUESTION_BANK = [
  "Как ты сегодня. Правда, как.",
  "Что сейчас на душе, если честно.",
  "О чём ты думал(а) перед сном вчера.",
  "Что тебя порадовало за последние дни.",
  "Есть что-то, что не отпускает. Расскажи картам.",
  "Чего тебе сейчас не хватает больше всего.",
  "Если бы можно было изменить одно, что бы это было.",
  "Кого ты давно хотел(а) простить.",
  "Что ты откладываешь, хотя пора.",
  "Где ты сейчас, в начале, в середине или на пороге перемен.",
  "Что тебя держит на месте.",
  "О чём мечтаешь, но боишься сказать вслух.",
  "Что бы ты сделал(а), если бы точно знал(а), что получится.",
  "Кто рядом с тобой по-настоящему.",
  "Чего ты ждёшь от этой недели.",
  "Что важное ты сейчас не замечаешь в себе.",
  "Какое решение зреет внутри.",
  "Что тебе подсказывает интуиция в последнее время.",
  "Где ты чувствуешь себя собой.",
  "Что ты готов(а) отпустить.",
  "О чём тебе давно пора поговорить с собой.",
  "Что для тебя сейчас важнее всего.",
  "Чего в тебе больше сейчас, надежды или усталости.",
  "Какой знак ты ждёшь от жизни.",
  "Что бы ты сказал(а) себе год назад.",
];

// Обёртка безопасной отправки (пользователь мог заблокировать бота).
async function safeSend(bot, id, text, extra) {
  try { await bot.api.sendMessage(id, text, extra); return true; }
  catch (e) {
    try { const code = e && (e.error_code || (e.parameters && e.parameters.error_code)); if (code === 403 || String(e).includes("403")) require("./analytics").track(id, "blocked", {}); } catch (_) {}
    return false;
  }
}

// Ежедневный вопрос неплативших (у кого нет активной подписки).
async function sendDailyQuestion(bot) {
  const q = QUESTION_BANK[new Date().getDate() % QUESTION_BANK.length];
  let sent = 0;
  for (const u of allUsers()) {
    if (u.subscribed) continue; // платным/подписанным не досаждаем этим
    const name = u.name ? `${u.name}, ` : "";
    if (await safeSend(bot, u.id, `${name}${q}\n\nНапиши мне, и карты ответят.`)) sent++;
  }
  return sent;
}

// Еженедельный разбор (раз в неделю).
async function sendWeekly(bot) {
  let sent = 0;
  for (const u of allUsers()) {
    const name = u.name ? `${u.name}, ` : "";
    const text = `${name}новая неделя открывается для тебя.\n\n` +
      `Я заглянула в карты недели. Приходи, разложу их на тебя, и мы посмотрим, что она принесёт. ` +
      `А ещё я приготовила для тебя кое-что в канале.`;
    if (await safeSend(bot, u.id, text)) sent++;
  }
  return sent;
}

// Крючок «приходи завтра», можно слать вечером тем, кто был активен сегодня.
function tomorrowHook(name) {
  const n = name ? `${name}, ` : "";
  return `${n}завтра карты откроют для тебя новый день. У меня уже есть предчувствие, что он будет непростым и важным. ` +
    `Загляни утром, я расскажу.`;
}

// Реферальная механика: пригласивший и приглашённый получают +1 сообщение ИИ.
const REFERRAL_BONUS = 1;
function applyReferral(newUserId, refId) {
  if (!refId || String(refId) === String(newUserId)) return false;
  const invitee = getUser(newUserId);
  if (invitee.referredBy) return false; // уже привязан
  const inviter = getUser(refId);
  invitee.referredBy = refId;
  invitee.counters.aiMessages = Math.max(0, invitee.counters.aiMessages - REFERRAL_BONUS); // +1 сообщение
  inviter.referrals = (inviter.referrals || 0) + 1;
  inviter.counters.aiMessages = Math.max(0, inviter.counters.aiMessages - REFERRAL_BONUS);
  saveUser(invitee); saveUser(inviter);
  return true;
}

// Рассылка произвольного текста всем пользователям (для команды владельца).
async function sendAll(bot, text) {
  let sent = 0;
  for (const u of allUsers()) { if (await safeSend(bot, u.id, text)) sent++; }
  return sent;
}

// ---- КАРТА ДНЯ: одна на всех, каждый день новая, утренняя рассылка ----
const DAILY_FILE = path.join(__dirname, "..", "..", "data", "cardofday.json");
const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
function mskNow() { return new Date(Date.now() + 3 * 3600 * 1000); }
function mskDateKey() { const d = mskNow(); return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0"); }
function ruDateLabel() { const d = mskNow(); const wd = WEEKDAYS[d.getUTCDay()]; return wd.charAt(0).toUpperCase() + wd.slice(1) + ", " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()]; }
function readDaily() { try { return JSON.parse(fs.readFileSync(DAILY_FILE, "utf8")); } catch { return {}; } }
function writeDaily(o) { try { fs.mkdirSync(path.dirname(DAILY_FILE), { recursive: true }); fs.writeFileSync(DAILY_FILE, JSON.stringify(o, null, 2)); } catch (_) {} }

function buildCardText(cardName, p) {
  const wish = (p && p.wish) ? String(p.wish).trim() : "Доброе утро. Пусть этот день будет к тебе добр.";
  const head = `🔮 ${ruDateLabel()}. Твоя карта дня: ${cardName}`;
  const block = (label, v, fallback) => `<b>${label}.</b> ${p && v ? String(v).trim() : fallback}`;
  const body = [
    block("В делах", p && p.work, "Сегодня стоит действовать спокойно и без спешки."),
    block("В отношениях", p && p.love, "Хороший день для тёплого и честного разговора."),
    block("Внутри", p && p.inside, "Прислушайся к себе, интуиция сейчас точнее логики."),
    block("Осторожно", p && p.caution, "Не торопи события и не требуй от себя слишком многого."),
    block("Совет дня", p && p.advice, "Позволь себе паузу, самые важные ответы приходят в тишине."),
  ].join("\n\n");
  return `${wish}\n\n${head}\n\n${body}`;
}

// Готовит карту дня: одну на всех, каждый день новую, не повторяя вчерашнюю. Текст кэшируется на сутки.
async function ensureCardOfDay() {
  const today = mskDateKey();
  const state = readDaily();
  if (state.date === today && state.text) return state;
  let card = deck.drawCard();
  for (let i = 0; i < 30 && state.cardKey && card && card.key === state.cardKey; i++) card = deck.drawCard();
  let parts = null;
  try { parts = await ai.generateCardOfDay(card.name); } catch (_) {}
  const text = buildCardText(card.name, parts);
  const next = { date: today, cardKey: card.key, cardName: card.name, text };
  writeDaily(next);
  return next;
}

// Рассылка карты дня всем пользователям.
async function sendCardOfDay(bot) {
  const state = await ensureCardOfDay();
  let sent = 0;
  for (const u of allUsers()) {
    if (await safeSend(bot, u.id, state.text, { parse_mode: "HTML" })) sent++;
  }
  return sent;
}

// Превью карты дня в конкретный чат (для владельца, проверить до рассылки).
async function previewCardOfDay(bot, chatId) {
  const state = await ensureCardOfDay();
  await bot.api.sendMessage(chatId, state.text, { parse_mode: "HTML" });
  return state;
}

module.exports = { QUESTION_BANK, sendAll, sendDailyQuestion, sendWeekly, tomorrowHook, applyReferral, REFERRAL_BONUS, sendCardOfDay, previewCardOfDay, ensureCardOfDay };
