// Аналитика: единая лента событий (data/events.jsonl) и текстовая сводка для владельца.
// Храним только Telegram id и действия, без лишних персональных данных.
const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "..", "..", "data");
const FILE = path.join(DIR, "events.jsonl");

// Карта кодов источников в человекочитаемые имена. Дополняй по мере запуска ссылок.
const SOURCE_NAMES = {
  direct: "Напрямую",
  ig: "Instagram",
  yt: "YouTube",
  tt: "TikTok",
  tg: "Telegram",
};
function sourceName(code) { return SOURCE_NAMES[code] || code || "Напрямую"; }

// Все пункты меню в порядке показа (для полной статистики нажатий).
const MENU_BUTTONS = [
  "🃏 Аркан-код",
  "🔢 Нумерология",
  "🔮 Таро расклад",
  "🛍 Магазин",
  "👥 Пригласить друга",
  "🎓 Академия",
  "🕊 Консультация",
  "💬 Чат с Надеждой",
  "🛟 Техподдержка",
  "🌐 Соцсети Надежды",
];

function ensure() { try { if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true }); } catch (_) {} }

// Записать событие. Никогда не роняет бота.
function track(userId, event, props) {
  try {
    ensure();
    const row = Object.assign({ ts: Date.now(), userId: String(userId || ""), event }, props || {});
    fs.appendFileSync(FILE, JSON.stringify(row) + "\n");
  } catch (_) {}
}

function readEvents() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return fs.readFileSync(FILE, "utf8").split("\n").filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

function pct(a, b) { return b > 0 ? Math.round((a / b) * 100) : 0; }
function uniqUsers(ev, name) { const s = new Set(); for (const e of ev) if (e.event === name) s.add(e.userId); return s; }

// Текстовая сводка за период (days=0 значит за всё время).
function summary(days) {
  const all = readEvents();
  const from = days ? Date.now() - days * 86400000 : 0;
  const ev = all.filter((e) => e.ts >= from);
  if (!ev.length) return "Пока нет данных за этот период.";

  const period = days ? `за последние ${days} дн.` : "за всё время";
  const out = [];
  out.push("Сводка " + period);
  out.push("Всего людей: " + new Set(ev.map((e) => e.userId)).size);

  // Воронка по уникальным людям
  const steps = [
    ["Старт", "start"],
    ["Выбор ветки", "branch"],
    ["Выбор темы", "theme"],
    ["Выбор карты", "pick"],
    ["Крючок показан", "reveal"],
    ["Гейт подписки", "subgate"],
    ["Подписался", "subscribed"],
    ["Глубокий разбор", "deep"],
    ["Ответ в опроснике", "feedback"],
    ["Клик в меню", "menu_click"],
    ["Клик оплаты", "pay_click"],
  ];
  const startN = uniqUsers(ev, "start").size || new Set(ev.map((e) => e.userId)).size;
  out.push("");
  out.push("Воронка (уник. люди):");
  let prev = null;
  for (const [label, name] of steps) {
    const n = uniqUsers(ev, name).size;
    const ofStart = pct(n, startN);
    const ofPrev = prev == null ? 100 : pct(n, prev);
    out.push(label + ": " + n + " (" + ofStart + "% от старта, " + ofPrev + "% от пред.)");
    prev = n;
  }

  // Ветки
  const brT = new Set(ev.filter((e) => e.event === "branch" && e.value === "tarot").map((e) => e.userId)).size;
  const brN = new Set(ev.filter((e) => e.event === "branch" && e.value === "numer").map((e) => e.userId)).size;
  out.push("");
  out.push("Ветки: таро " + brT + ", нумерология " + brN);

  // Опросник: сколько выбрали каждый вариант, по веткам и всего
  function fbRows(branch) {
    const f = ev.filter((e) => e.event === "feedback" && (branch ? e.branch === branch : true));
    const t = f.length;
    if (!t) return ["нет ответов"];
    const hit = f.filter((e) => e.value === "hit").length;
    const part = f.filter((e) => e.value === "part").length;
    const miss = f.filter((e) => e.value === "miss").length;
    return [
      "Да, про меня: " + hit + " (" + pct(hit, t) + "%)",
      "Кое-что да: " + part + " (" + pct(part, t) + "%)",
      "Не откликнулось: " + miss + " (" + pct(miss, t) + "%)",
      "Всего ответов: " + t,
    ];
  }
  out.push("");
  out.push("Опросник, таро:");
  for (const r of fbRows("tarot")) out.push(r);
  out.push("");
  out.push("Опросник, нумерология:");
  for (const r of fbRows("numer")) out.push(r);
  out.push("");
  out.push("Опросник, всего:");
  for (const r of fbRows(null)) out.push(r);

  // Кнопки меню: все пункты с числом нажатий (включая нулевые)
  const btn = {};
  for (const e of ev) if (e.event === "menu_click" && e.button) btn[e.button] = (btn[e.button] || 0) + 1;
  out.push("");
  out.push("Кнопки меню (нажатий):");
  for (const b of MENU_BUTTONS) out.push(b + ": " + (btn[b] || 0));
  for (const b of Object.keys(btn)) if (!MENU_BUTTONS.includes(b)) out.push(b + ": " + btn[b]);

  // Источники: пришло / подписались
  const bySource = {};
  for (const e of ev) if (e.event === "start") { const s = e.source || "direct"; (bySource[s] = bySource[s] || new Set()).add(e.userId); }
  const subs = uniqUsers(ev, "subscribed");
  const srcRows = Object.entries(bySource).map(([s, set]) => {
    let sub = 0; for (const id of set) if (subs.has(id)) sub++;
    return [s, set.size, sub];
  }).sort((a, b) => b[1] - a[1]);
  if (srcRows.length) {
    out.push("");
    out.push("Источники (пришло / подписались):");
    for (const [s, n, sub] of srcRows.slice(0, 12)) out.push(sourceName(s) + ": " + n + " / " + sub + " (" + pct(sub, n) + "%)");
  }

  // Заблокировали бота
  const blocked = uniqUsers(ev, "blocked").size;
  if (blocked) { out.push(""); out.push("Заблокировали бота: " + blocked); }

  return out.join("\n");
}

module.exports = { track, readEvents, summary, sourceName, SOURCE_NAMES };
