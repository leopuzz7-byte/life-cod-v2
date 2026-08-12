// Файловое хранилище пользователей (без внешней БД).
const fs = require("fs");
const path = require("path");
const DIR = path.join(__dirname, "..", "..", "data");
const FILE = path.join(DIR, "users.json");

function ensure() { if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true }); if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}"); }
function readAll() { ensure(); try { return JSON.parse(fs.readFileSync(FILE, "utf8") || "{}"); } catch { return {}; } }
function writeAll(o) { ensure(); fs.writeFileSync(FILE, JSON.stringify(o, null, 2)); }
function today() { return new Date().toISOString().slice(0, 10); }

function getUser(id) {
  const all = readAll();
  const u = all[id] || {
    id, step: "idle", branch: null,
    name: "", birth: null, subscribed: false,
    tarotQuestion: "", tarotTheme: null, tarotCard: null,
    theme: null, concern: null,
    chatHistory: [],
    counters: { date: today(), aiMessages: 0 },
    referredBy: null, referrals: 0, createdAt: Date.now(), lastActive: Date.now(),
  };
  if (!u.counters) u.counters = { date: today(), aiMessages: 0 };
  if (u.counters.date !== today()) u.counters = { date: today(), aiMessages: 0 };
  return u;
}
function saveUser(u) { const all = readAll(); u.lastActive = Date.now(); all[u.id] = u; writeAll(all); return u; }
function allUsers() { return Object.values(readAll()); }

// ---- кружки (видео-заметки): file_id по слотам welcome/arkan/numer ----
const CFILE = path.join(DIR, "circles.json");
function getCircles() { ensure(); try { return JSON.parse(fs.readFileSync(CFILE, "utf8") || "{}"); } catch { return {}; } }
function setCircle(slot, fileId) { const all = getCircles(); all[slot] = fileId; ensure(); fs.writeFileSync(CFILE, JSON.stringify(all, null, 2)); return all; }

module.exports = { getUser, saveUser, allUsers, today, getCircles, setCircle };
