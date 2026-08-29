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

module.exports = { parseGrant, grant, hasCredit, consume, balance };
