// Конфиг pm2. Запуск: pm2 start deploy/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "taro-bot",
      script: "src/bot/index.js",
      cwd: __dirname + "/..",
      autorestart: true,
      max_restarts: 20,
      env: { NODE_ENV: "production" },
    },
  ],
};
