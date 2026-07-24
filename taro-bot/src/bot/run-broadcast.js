// Запуск рассылки из планировщика (cron). Примеры:
//   node src/bot/run-broadcast.js daily    (ежедневный вопрос неплативших)
//   node src/bot/run-broadcast.js weekly   (еженедельный разбор)
// Cron можно поставить на сервере, где крутится бот. Бот при этом может быть запущен отдельно.

const { Bot } = require("grammy");
const config = require("./config");
const { sendDailyQuestion, sendWeekly } = require("./broadcasts");

(async () => {
  const kind = process.argv[2];
  if (!["daily", "weekly"].includes(kind)) {
    console.error("Укажи тип: daily или weekly");
    process.exit(1);
  }
  const bot = new Bot(config.botToken);
  const sent = kind === "daily" ? await sendDailyQuestion(bot) : await sendWeekly(bot);
  console.log(`Рассылка ${kind}: отправлено ${sent}`);
  process.exit(0);
})();
