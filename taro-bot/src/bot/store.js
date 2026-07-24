// Простое файловое хранилище пользователей (без внешней БД, чтобы бот сразу запускался).
// Хранит: имя, дату рождения, статус подписки, дневные счётчики лимитов, рефералов.
// Для продакшена позже можно заменить на Supabase, интерфейс оставлен узким.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "..", "data");
const FILE = path.join(DIR, "users.json");

function ensure() {
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}");
}
function readAll() {
  ensure();
  try { return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}"); } catch { return {}; }
}
function writeAll(obj) {
  ensure();
  fs.writeFileSync(FILE, JSON.stringify(obj, null, 2));
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

function getUser(id) {
  const all = readAll();
  const u = all[id] || {
    id, name: "", birth: null, subscribed: false,
    counters: { date: today(), dayReading: 0, aiMessages: 0 },
    compatUsed: 0, referredBy: null, referrals: 0, createdAt: Date.now(),
    lastActive: Date.now(), step: "idle",
  };
  // сброс дневных счётчиков в новый день
  if (u.counters.date !== today()) u.counters = { date: today(), dayReading: 0, aiMessages: 0 };
  return u;
}
function saveUser(u) {
  const all = readAll();
  u.lastActive = Date.now();
  all[u.id] = u;
  writeAll(all);
  return u;
}
function allUsers() {
  return Object.values(readAll());
}

module.exports = { getUser, saveUser, allUsers, today };
