// Запуск рассылки из планировщика (cron). Примеры:
//   node src/bot/run-broadcast.js daily    (ежедневный вопрос неплативших)
//   node src/bot/run-broadcast.js weekly   (еженедельный разбор)
// Cron можно поставить на сервере, где крутится бот. Бот при этом может быть запущен отдельно.

const { Bot } = require("grammy");
const config = require("./config");
const { sendDailyQuestion, sendWeekly, sendCardOfDay } = require("./broadcasts");

(async () => {
  const kind = process.argv[2];
  if (!["daily", "weekly", "cardday"].includes(kind)) {
    console.error("Укажи тип: daily, weekly или cardday");
    process.exit(1);
  }
  const bot = new Bot(config.botToken);
  const sent = kind === "daily" ? await sendDailyQuestion(bot) : kind === "weekly" ? await sendWeekly(bot) : await sendCardOfDay(bot);
  console.log(`Рассылка ${kind}: отправлено ${sent}`);
  process.exit(0);
})();
