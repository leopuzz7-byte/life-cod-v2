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
  social: {
    instaTaro: process.env.SOCIAL_INSTA_TARO || "https://www.instagram.com/taronadezhdi",
    instaNumer: process.env.SOCIAL_INSTA_NUMER || "https://www.instagram.com/lifecode.numerology",
    youtubeTaro: process.env.SOCIAL_YT_TARO || "https://www.youtube.com/@taronadezhdi",
    youtubeNumer: process.env.SOCIAL_YT_NUMER || "https://www.youtube.com/@lifecod.numerology",
    tiktok: process.env.SOCIAL_TIKTOK || "https://tiktok.com/@taronadezhdi1235",
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
  // Оплата бота идёт через Supabase (та же платёжка, что у калькулятора).
  supabase: {
    fnUrl: process.env.SUPABASE_FN_URL || "https://thjyvcjzurjbufvthlvb.supabase.co/functions/v1",
    anonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoanl2Y2p6dXJqYnVmdnRobHZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNTY1NzIsImV4cCI6MjA5NDczMjU3Mn0.pKNH-Z7N0t8EJeei08ZxU8bfkVMk10DD1ePLNHZu3j0",
    botSecret: process.env.BOT_SHARED_SECRET || "",
  },
  // Оплата бота теперь через серверный бэкенд (MySQL, Робокасса на сервере).
  server: {
    baseUrl: process.env.SERVER_API_URL || "http://127.0.0.1:8080",
    botSecret: process.env.BOT_SHARED_SECRET || "",
  },
  plans: {
    week:  { product: "bot_sub_week",  price: 20,   old: 290,  discount: 93, days: 7,   label: "неделя, тест" },
    month: { product: "bot_sub_month", price: 790,  old: 1590, discount: 50, days: 30,  label: "месяц" },
    year:  { product: "bot_sub_year",  price: 2990, old: 9990, discount: 70, days: 365, label: "год" },
  },
  taro: { product: "bot_taro", price: 2990, old: 9990, discount: 70 },
};

if (!config.botToken) { console.error("Нет BOT_TOKEN в .env"); process.exit(1); }
module.exports = config;
