// Конфиг бота. Секреты из .env (файл в .gitignore).
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const config = {
  botToken: process.env.BOT_TOKEN,
  channel: process.env.CHANNEL || "@taro_lifecod",
  channelUrl: process.env.CHANNEL_URL || "https://t.me/taro_lifecod",
  calcUrl: process.env.CALC_URL || "https://life-cod-v2.vercel.app/",
  ai: {
    key: process.env.AI_API_KEY,
    url: process.env.AI_API_URL || "https://api.proxyapi.ru/openai/v1/chat/completions",
    model: process.env.AI_MODEL || "gpt-4o-mini",
  },
  robokassa: {
    login: process.env.ROBOKASSA_LOGIN || "",
    pass1: process.env.ROBOKASSA_PASS1 || "",
    pass2: process.env.ROBOKASSA_PASS2 || "",
    test: process.env.ROBOKASSA_TEST === "1",
  },
  limits: {
    aiMessagesPerDay: 3,     // чат с ИИ-тарологом бесплатно
    dayReadingPerDay: 1,     // разбор дня бесплатно
    compatFree: 1,           // совместимость бесплатно (всего)
  },
};

if (!config.botToken) {
  console.error("Нет BOT_TOKEN в .env. Скопируй .env.example в .env и впиши токен.");
  process.exit(1);
}

module.exports = config;
