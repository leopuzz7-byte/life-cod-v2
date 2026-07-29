// Таро-ветка: темы вопроса и вытягивание карты.
// Карта детерминированно зависит от пользователя, даты и выбранной позиции,
// поэтому фиксируется на день и не «перебивается» повторным выбором.
const crypto = require("crypto");
const { getArcana } = require("./arcana");

const THEMES = [
  { id: "love", label: "Любовь и отношения", emoji: "💗" },
  { id: "money", label: "Деньги и работа", emoji: "💰" },
  { id: "choice", label: "Важный выбор", emoji: "🔀" },
  { id: "future", label: "Что меня ждёт", emoji: "🌱" },
];

function themeById(id) { return THEMES.find((t) => t.id === id); }

function today() { return new Date().toISOString().slice(0, 10); }

// Детерминированный аркан 1..22 из userId + дата + позиция карты.
function drawArcana(userId, position, dateStr) {
  const h = crypto.createHash("sha256").update(`${userId}:${dateStr || today()}:${position}`).digest();
  return (h[0] % 22) + 1;
}

// Короткое запасное толкование, если ИИ недоступен.
function fallbackReveal(arcanaNum) {
  const a = getArcana(arcanaNum);
  return `Тебе выпал ${arcanaNum} Аркан «${a.name}». Эта карта пришла не случайно, в ней ключ к тому, о чём сейчас думаешь. Она говорит, что сила уже внутри, осталось разрешить себе её увидеть.`;
}

module.exports = { THEMES, themeById, drawArcana, fallbackReveal, today };
