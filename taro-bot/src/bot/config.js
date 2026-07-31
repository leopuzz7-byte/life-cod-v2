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
  contacts: {
    buyCards: process.env.BUY_CARDS_CONTACT || "@leonpuz",
    support: process.env.SUPPORT_CONTACT || "@leonpuz",
    consultPhone: process.env.CONSULT_PHONE || "79111232557",
  },
  prices: {
    tarot: process.env.PRICE_TAROT || "",
    consult: process.env.PRICE_CONSULT || "5000",
  },
  robokassa: {
    login: process.env.ROBOKASSA_LOGIN || "",
    pass1: process.env.ROBOKASSA_PASS1 || "",
    pass2: process.env.ROBOKASSA_PASS2 || "",
    test: process.env.ROBOKASSA_TEST === "1",
    resultPort: parseInt(process.env.ROBOKASSA_RESULT_PORT || "8080", 10),
    get enabled() { return !!(this.login && this.pass1 && this.pass2); },
  },
  ownerId: process.env.OWNER_ID || "",
  limits: { aiMessagesPerDay: 3 },
};

if (!config.botToken) { console.error("Нет BOT_TOKEN в .env"); process.exit(1); }
module.exports = config;
