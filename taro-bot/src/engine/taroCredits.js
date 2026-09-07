const UNLIMITED_ALIASES = new Set(["unlimited", "infinite", "forever", "безлимит", "безлим", "∞"]);

function parseGrant(raw) {
  const value = String(raw || "1").trim().toLowerCase();
  if (UNLIMITED_ALIASES.has(value)) return { unlimited: true, count: 0 };
  if (!/^\d+$/.test(value)) return null;
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 1) return null;
  return { unlimited: false, count };
}

function grant(user, raw) {
  const parsed = parseGrant(raw);
  if (!parsed) return null;
  if (parsed.unlimited) user.taroUnlimited = true;
  else user.taroFree = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Number(user.taroFree) || 0) + parsed.count);
  return parsed;
}

function hasCredit(user) {
  return !!(user && (user.taroUnlimited || (Number(user.taroFree) || 0) > 0));
}

function consume(user) {
  if (!hasCredit(user)) return false;
  if (!user.taroUnlimited) user.taroFree = Math.max(0, (Number(user.taroFree) || 0) - 1);
  return true;
}

function balance(user) {
  return user && user.taroUnlimited ? "безлимит" : String(Math.max(0, Number(user && user.taroFree) || 0));
}

// Снятие доступа. Без raw, "all" или "0" — полный сброс (снимает безлимит и обнуляет счёт).
// Положительное целое N — списывает N раскладов, но не ниже нуля.
function revoke(user, raw) {
  const value = String(raw == null ? "all" : raw).trim().toLowerCase();
  if (value === "" || value === "all" || value === "0" || UNLIMITED_ALIASES.has(value)) {
    user.taroUnlimited = false;
    user.taroFree = 0;
    return { cleared: true };
  }
  if (!/^\d+$/.test(value)) return null;
  const count = Number(value);
  if (!Number.isSafeInteger(count) || count < 1) return null;
  user.taroFree = Math.max(0, (Number(user.taroFree) || 0) - count);
  return { cleared: false, count };
}

module.exports = { parseGrant, grant, revoke, hasCredit, consume, balance };
