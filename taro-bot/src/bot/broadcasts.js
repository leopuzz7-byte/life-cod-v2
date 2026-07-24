// Рассылки и реферальная механика.
// Тексты черновые, финальные лучше от Надежды. Тон живой, на «ты», без длинных тире.
// Отправка требует запущенного бота и планировщика (cron). Здесь функции отправки
// и банк вопросов, вызов по расписанию подключается при деплое (см. README).

const { allUsers, saveUser, getUser } = require("./store");
const config = require("./config");

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
  catch { return false; }
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

module.exports = { QUESTION_BANK, sendDailyQuestion, sendWeekly, tomorrowHook, applyReferral, REFERRAL_BONUS };
