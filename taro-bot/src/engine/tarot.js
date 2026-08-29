// Таро-ветка: темы вопроса и вытягивание карты.
// Карта всегда случайная: любое из чисел 1-5 крутит рандом из 22 арканов.
const { randomInt } = require("crypto");
const { getArcana } = require("./arcana");

const THEMES = [
  { id: "love", label: "Любовь и отношения", emoji: "💗" },
  { id: "money", label: "Деньги и работа", emoji: "💰" },
  { id: "choice", label: "Важный выбор", emoji: "🔀" },
  { id: "future", label: "Что меня ждёт", emoji: "🌱" },
];
function themeById(id) { return THEMES.find((t) => t.id === id); }
function today() { return new Date().toISOString().slice(0, 10); }

// Всегда случайный аркан 1..22 (на каждое нажатие новый).
function drawArcana() { return randomInt(1, 23); }

function fallbackReveal(arcanaNum) {
  const a = getArcana(arcanaNum);
  return `Тебе выпал ${arcanaNum} Аркан «${a.name}». Эта карта пришла не случайно, в ней ключ к тому, о чём сейчас думаешь. Сила уже внутри, осталось разрешить себе её увидеть.`;
}
module.exports = { THEMES, themeById, drawArcana, fallbackReveal, today };
