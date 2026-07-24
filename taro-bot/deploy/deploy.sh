#!/usr/bin/env bash
# Обновить бота одной командой: git pull, зависимости, перезапуск.
# Запускать из папки taro-bot: bash deploy/deploy.sh
set -e
cd "$(dirname "$0")/.."
echo ">>> Тяну изменения из git"
git pull
echo ">>> Ставлю зависимости"
npm install --omit=dev
echo ">>> Перезапускаю бота"
pm2 restart taro-bot
echo ">>> Готово"
