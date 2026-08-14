// ============================================================
// Бэкенд Life COD. Заменяет Supabase: авторизация, данные, Робокасса.
// Один файл с понятными разделами. Node плюс Express плюс MySQL.
// ============================================================
import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { q, pool } from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "127.0.0.1";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// CORS: пускаем только наши адреса (Vercel сейчас, потом домен Beget)
const ORIGINS = (process.env.FRONTEND_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, cb) {
    if (!origin || ORIGINS.length === 0 || ORIGINS.includes(origin)) return cb(null, true);
    try {
      const host = new URL(origin).hostname;
      if (host.endsWith(".vercel.app") || host === "lifecod.app" || host.endsWith(".lifecod.app")) {
        return cb(null, true);
      }
    } catch {}
    cb(new Error("Origin not allowed"));
  },
  credentials: true,
}));

// JSON для нашего API. Отдельно form-urlencoded для колбэка Робокассы.
app.use("/api", express.json({ limit: "2mb" }));

// ── помощники ───────────────────────────────────────────
const md5 = (text) => crypto.createHash("md5").update(text, "utf8").digest("hex");
const uuid = () => crypto.randomUUID();
const signToken = (userId) => jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });

function requireAuth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Не авторизован" });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).sub;
    next();
  } catch {
    return res.status(401).json({ error: "Сессия истекла" });
  }
}

const one = (rows) => (rows && rows.length ? rows[0] : null);

// ============================================================
// АВТОРИЗАЦИЯ
// ============================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, birth_day, birth_month, birth_year } = req.body || {};
    if (!email || !password || !name) return res.status(400).json({ error: "Заполните почту, пароль и имя" });
    if (String(password).length < 6) return res.status(400).json({ error: "Пароль минимум 6 символов" });

    const exists = one(await q("SELECT id FROM users WHERE email = ?", [email]));
    if (exists) return res.status(409).json({ error: "Такая почта уже зарегистрирована" });

    const id = uuid();
    const hash = await bcrypt.hash(String(password), 10);
    await q("INSERT INTO users (id, email, password_hash, email_confirmed) VALUES (?, ?, ?, 1)", [id, email, hash]);
    await q(
      "INSERT INTO profiles (id, email, name, birth_day, birth_month, birth_year) VALUES (?, ?, ?, ?, ?, ?)",
      [id, email, name, birth_day || 1, birth_month || 1, birth_year || 2000]
    );
    res.json({ token: signToken(id), user: { id, email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = one(await q("SELECT id, email, password_hash FROM users WHERE email = ?", [email]));
    if (!user) return res.status(401).json({ error: "Неверная почта или пароль" });
    const ok = await bcrypt.compare(String(password || ""), user.password_hash);
    if (!ok) return res.status(401).json({ error: "Неверная почта или пароль" });
    res.json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = one(await q("SELECT id, email FROM users WHERE id = ?", [req.userId]));
    if (!user) return res.status(404).json({ error: "Не найден" });
    const profile = one(await q("SELECT id, email, name, birth_day, birth_month, birth_year FROM profiles WHERE id = ?", [req.userId]));
    res.json({ user, profile });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Запрос сброса пароля: создаём токен на 1 час. Письмо через SMTP добавим позже,
// пока ссылку логируем на сервере (в консоль).
app.post("/api/auth/request-reset", async (req, res) => {
  try {
    const { email } = req.body || {};
    const user = one(await q("SELECT id FROM users WHERE email = ?", [email]));
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 19).replace("T", " ");
      await q("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?", [token, expires, user.id]);
      const link = `${process.env.SITE_URL || ""}/reset-password?token=${token}`;
      console.log("[reset] ссылка для", email, ":", link); // TODO SMTP
    }
    res.json({ ok: true }); // не раскрываем, есть ли почта
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/auth/reset", async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: "Нет токена или пароля" });
    const user = one(await q("SELECT id FROM users WHERE reset_token = ? AND reset_expires > UTC_TIMESTAMP()", [token]));
    if (!user) return res.status(400).json({ error: "Ссылка недействительна или истекла" });
    const hash = await bcrypt.hash(String(password), 10);
    await q("UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?", [hash, user.id]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Смена пароля залогиненным пользователем (страница Профиль).
app.post("/api/auth/change-password", requireAuth, async (req, res) => {
  try {
    const { new_password } = req.body || {};
    if (!new_password || String(new_password).length < 6) return res.status(400).json({ error: "Пароль минимум 6 символов" });
    const hash = await bcrypt.hash(String(new_password), 10);
    await q("UPDATE users SET password_hash = ? WHERE id = ?", [hash, req.userId]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
// ПРОФИЛЬ И РАЗБОРЫ (замена RLS: везде проверяем владельца по токену)
// ============================================================

app.get("/api/profile", requireAuth, async (req, res) => {
  const p = one(await q("SELECT id, email, name, birth_day, birth_month, birth_year FROM profiles WHERE id = ?", [req.userId]));
  res.json(p);
});

app.put("/api/profile", requireAuth, async (req, res) => {
  try {
    const { name, birth_day, birth_month, birth_year, email } = req.body || {};
    await q(
      `INSERT INTO profiles (id, email, name, birth_day, birth_month, birth_year)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), birth_day = VALUES(birth_day),
         birth_month = VALUES(birth_month), birth_year = VALUES(birth_year)`,
      [req.userId, email || "", name || "", birth_day || 1, birth_month || 1, birth_year || 2000]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/analyses", requireAuth, async (req, res) => {
  const rows = await q(
    "SELECT id, method_id, methodology, tier, result_type, title, created_at FROM analyses WHERE user_id = ? ORDER BY created_at DESC",
    [req.userId]
  );
  res.json(rows);
});

app.post("/api/analyses", requireAuth, async (req, res) => {
  try {
    const { method_id, methodology, tier, result_type, input, result, title } = req.body || {};
    const id = uuid();
    await q(
      `INSERT INTO analyses (id, user_id, method_id, methodology, tier, result_type, input, result, title)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.userId, method_id, methodology, tier, result_type, JSON.stringify(input ?? {}), JSON.stringify(result ?? {}), title || null]
    );
    res.json({ id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/analyses/:id", requireAuth, async (req, res) => {
  const row = one(await q("SELECT * FROM analyses WHERE id = ? AND user_id = ?", [req.params.id, req.userId]));
  if (!row) return res.status(404).json({ error: "Не найдено" });
  res.json(row);
});

app.delete("/api/analyses/:id", requireAuth, async (req, res) => {
  await q("DELETE FROM analyses WHERE id = ? AND user_id = ?", [req.params.id, req.userId]);
  res.json({ ok: true });
});

// Цены методик читаются публично (нужны на витрине), но менять их может только БД.
app.get("/api/prices", async (_req, res) => {
  const rows = await q("SELECT method_id, title, price_basic, price_pro, is_active FROM method_prices WHERE is_active = 1");
  res.json(rows);
});

app.get("/api/prices/:methodId", async (req, res) => {
  const row = one(await q("SELECT method_id, title, price_basic, price_pro, is_active FROM method_prices WHERE method_id = ?", [req.params.methodId]));
  res.json(row);
});

// ============================================================
// РОБОКАССА (перенос логики из edge-функций один в один)
// ============================================================

// Создание платежа. Цену берём из БД на сервере, с фронта её не принимаем.
app.post("/api/payment/create", requireAuth, async (req, res) => {
  try {
    const { method_id, tier } = req.body || {};
    if (!method_id) return res.status(400).json({ error: "Не указан method_id" });
    const isPro = !tier || tier === "professional";

    const price = one(await q("SELECT title, price_basic, price_pro, is_active FROM method_prices WHERE method_id = ?", [method_id]));
    if (!price) return res.status(404).json({ error: "Методика не найдена" });
    if (!price.is_active) return res.status(400).json({ error: "Методика недоступна" });

    const amount = Number(isPro ? price.price_pro : price.price_basic);
    if (amount === 0) return res.json({ free: true, order_id: null });

    const isTest = (process.env.ROBOKASSA_IS_TEST ?? "true") === "true";
    const id = uuid();

    // inv_id выдаст AUTO_INCREMENT, читаем его из insertId
    const [ins] = await pool.execute(
      `INSERT INTO orders (id, user_id, method_id, tier, amount_rub, status, is_test, payment_provider)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, 'robokassa')`,
      [id, req.userId, method_id, isPro ? "professional" : "basic", amount, isTest ? 1 : 0]
    );
    const invId = Number(ins.insertId);

    const login = process.env.ROBOKASSA_LOGIN;
    const pass1 = isTest ? process.env.ROBOKASSA_PASS1_TEST : process.env.ROBOKASSA_PASS1;
    const outSum = amount.toFixed(2);
    const signature = md5(`${login}:${outSum}:${invId}:${pass1}`);

    const params = new URLSearchParams({
      MerchantLogin: login,
      OutSum: outSum,
      InvId: String(invId),
      Description: `${price.title} (${isPro ? "Профессиональный" : "Базовый"})`,
      SignatureValue: signature,
      Culture: "ru",
      Encoding: "utf-8",
    });
    if (isTest) params.set("IsTest", "1");

    res.json({ payment_url: "https://auth.robokassa.ru/Merchant/Index.aspx?" + params.toString(), order_id: id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Колбэк Робокассы (ResultURL). Зовёт сервер Робокассы, не пользователь.
// Проверяем подпись паролем 2, сверяем сумму, помечаем оплаченным.
app.all("/api/payment/robokassa-result", express.urlencoded({ extended: false }), async (req, res) => {
  try {
    const src = req.method === "POST" ? req.body : req.query;
    const outSum = String(src.OutSum ?? "");
    const invId = String(src.InvId ?? "");
    const signature = String(src.SignatureValue ?? "").toLowerCase();
    if (!outSum || !invId || !signature) return res.status(400).send("bad request");

    const order = one(await q("SELECT id, amount_rub, status, is_test FROM orders WHERE inv_id = ?", [Number(invId)]));
    if (!order) return res.status(404).send("order not found");

    const pass2 = order.is_test ? process.env.ROBOKASSA_PASS2_TEST : process.env.ROBOKASSA_PASS2;
    const expected = md5(`${outSum}:${invId}:${pass2}`).toLowerCase();
    if (expected !== signature) return res.status(400).send("bad signature");
    if (Number(outSum) !== Number(order.amount_rub)) return res.status(400).send("amount mismatch");

    if (order.status !== "paid") {
      await q("UPDATE orders SET status = 'paid', paid_at = UTC_TIMESTAMP() WHERE id = ?", [order.id]);
    }
    res.send(`OK${invId}`);
  } catch (e) {
    res.status(500).send("error: " + e.message);
  }
});

// Фронт спрашивает статус заказа после возврата с оплаты.
app.get("/api/payment/status/:orderId", requireAuth, async (req, res) => {
  const order = one(await q("SELECT id, status, method_id, tier FROM orders WHERE id = ? AND user_id = ?", [req.params.orderId, req.userId]));
  if (!order) return res.status(404).json({ error: "Заказ не найден" });
  res.json(order);
});

// ============================================================
// ОПЛАТА ДЛЯ TELEGRAM-БОТА (заказы без веб-аккаунта, по telegram_id)
// Заказы падают в ту же таблицу orders, Робокасса подтверждает их
// тем же /api/payment/robokassa-result. Защита общим секретом (опционально).
// ============================================================
const BOT_SECRET = process.env.BOT_SHARED_SECRET || "";
const BOT_PRODUCTS = ["bot_sub_week", "bot_sub_month", "bot_sub_year", "bot_taro"];
function botAuth(req, res, next) {
  if (BOT_SECRET && (req.headers["x-bot-secret"] || "") !== BOT_SECRET) return res.status(403).json({ error: "forbidden" });
  next();
}
async function seedBotProducts() {
  const rows = [
    ["bot_sub_week", "Подписка неделя (бот)", 20],
    ["bot_sub_month", "Подписка месяц (бот)", 790],
    ["bot_sub_year", "Подписка год (бот)", 2990],
    ["bot_taro", "Таро расклад (бот)", 2990],
  ];
  for (const [mid, title, price] of rows) {
    await q(
      `INSERT INTO method_prices (method_id, title, price_rub, price_basic, price_pro, is_active)
       VALUES (?, ?, ?, 0, ?, 1)
       ON DUPLICATE KEY UPDATE title = VALUES(title), price_rub = VALUES(price_rub), price_pro = VALUES(price_pro), is_active = 1`,
      [mid, title, price, price]
    );
  }
}

app.post("/api/bot/payment/create", botAuth, async (req, res) => {
  try {
    const { telegram_id, product } = req.body || {};
    if (!telegram_id || !product) return res.status(400).json({ error: "telegram_id and product required" });
    if (!BOT_PRODUCTS.includes(product)) return res.status(400).json({ error: "unknown product" });
    const price = one(await q("SELECT title, price_pro, is_active FROM method_prices WHERE method_id = ?", [product]));
    if (!price || !price.is_active) return res.status(404).json({ error: "product not found" });
    const amount = Number(price.price_pro);
    if (!(amount > 0)) return res.status(400).json({ error: "zero price" });
    const isTest = (process.env.ROBOKASSA_IS_TEST ?? "true") === "true";
    const id = uuid();
    const [ins] = await pool.execute(
      `INSERT INTO orders (id, user_id, method_id, tier, amount_rub, status, is_test, payment_provider, telegram_id)
       VALUES (?, NULL, ?, 'professional', ?, 'pending', ?, 'robokassa', ?)`,
      [id, product, amount, isTest ? 1 : 0, String(telegram_id)]
    );
    const invId = Number(ins.insertId);
    const login = process.env.ROBOKASSA_LOGIN;
    const pass1 = isTest ? process.env.ROBOKASSA_PASS1_TEST : process.env.ROBOKASSA_PASS1;
    const outSum = amount.toFixed(2);
    const signature = md5(`${login}:${outSum}:${invId}:${pass1}`);
    const params = new URLSearchParams({
      MerchantLogin: login, OutSum: outSum, InvId: String(invId),
      Description: price.title, SignatureValue: signature, Culture: "ru", Encoding: "utf-8",
    });
    if (isTest) params.set("IsTest", "1");
    res.json({ payment_url: "https://auth.robokassa.ru/Merchant/Index.aspx?" + params.toString(), inv_id: invId, is_test: isTest });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/bot/payment/status", botAuth, async (req, res) => {
  try {
    const { telegram_id, inv_id } = req.body || {};
    if (!telegram_id || !inv_id) return res.status(400).json({ error: "telegram_id and inv_id required" });
    const order = one(await q("SELECT status, method_id, amount_rub, telegram_id FROM orders WHERE inv_id = ?", [Number(inv_id)]));
    if (!order) return res.status(404).json({ error: "order not found" });
    if (String(order.telegram_id) !== String(telegram_id)) return res.status(403).json({ error: "foreign order" });
    res.json({ status: order.status, method_id: order.method_id, amount_rub: order.amount_rub });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── здоровье ────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

seedBotProducts().catch((e) => console.error("seedBotProducts:", e.message));
app.listen(PORT, HOST, () => console.log(`Life COD server on http://${HOST}:${PORT}`));
