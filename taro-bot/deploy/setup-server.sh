#!/usr/bin/env bash
# Базовая установка сервера под бота и сайты. Запускать под root на свежей Ubuntu 24.04.
set -e
echo ">>> Обновляю систему"
apt update && apt -y upgrade

echo ">>> Ставлю Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo ">>> Ставлю nginx, git, сборочные инструменты, certbot"
apt install -y nginx git build-essential certbot python3-certbot-nginx ufw

echo ">>> Ставлю pm2 (менеджер процессов для бота)"
npm install -g pm2

echo ">>> Базовый файрвол: пускаем SSH, HTTP, HTTPS"
ufw allow OpenSSH || true
ufw allow 80 || true
ufw allow 443 || true
yes | ufw enable || true

echo ">>> Готово. Версии:"
node -v; npm -v; nginx -v; pm2 -v
echo ">>> Дальше: залить код бота и создать .env"
