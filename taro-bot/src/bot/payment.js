// Оплата через Robokassa. Логика готова, включается сама, когда в .env
// вписаны ROBOKASSA_LOGIN, PASS1, PASS2. Пока пусто, работает режим заглушки.
//
// Как работает вживую:
// 1) бот формирует ссылку на оплату с подписью md5(login:sum:invId:pass1);
// 2) человек оплачивает на стороне Robokassa;
// 3) Robokassa дёргает наш ResultURL с подписью md5(sum:invId:pass2);
// 4) сервер проверяет подпись, помечает счёт оплаченным и отвечает OK{invId};
// 5) бот открывает купленное.
// ResultURL надо указать в кабинете Robokassa: http://IP_сервера:PORT/robokassa/result
const crypto = require("crypto");
const http = require("http");
const config = require("./config");

const md5 = (s) => crypto.createHash("md5").update(s).digest("hex");

// Ссылка на оплату. Возвращает null, если Robokassa ещё не настроена (заглушка).
function createPaymentLink(invId, sum, description) {
  if (!config.robokassa.enabled) return null;
  const { login, pass1, test } = config.robokassa;
  const out = Number(sum).toFixed(2);
  const sig = md5(`${login}:${out}:${invId}:${pass1}`);
  const p = new URLSearchParams({
    MerchantLogin: login, OutSum: out, InvId: String(invId),
    Description: description || "Оплата", SignatureValue: sig,
  });
  if (test) p.set("IsTest", "1");
  return `https://auth.robokassa.ru/Merchant/Index.aspx?${p.toString()}`;
}

// Проверка колбэка ResultURL от Robokassa.
function verifyResult(query) {
  const { OutSum, InvId, SignatureValue } = query;
  if (!OutSum || !InvId || !SignatureValue) return { ok: false };
  const expect = md5(`${OutSum}:${InvId}:${config.robokassa.pass2}`).toLowerCase();
  const ok = expect === String(SignatureValue).toLowerCase();
  return { ok, invId: Number(InvId), sum: Number(OutSum) };
}

// HTTP-сервер для приёма оплат. onPaid(invId, sum) вызывается при успешной оплате.
// Запускается только если Robokassa настроена.
function startResultServer(onPaid) {
  if (!config.robokassa.enabled) { console.log("Robokassa не настроена, сервер оплат не запущен (режим заглушки)."); return null; }
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, "http://localhost");
    if (u.pathname !== "/robokassa/result") { res.writeHead(404); res.end("not found"); return; }
    const q = Object.fromEntries(u.searchParams.entries());
    const v = verifyResult(q);
    if (v.ok) { try { onPaid && onPaid(v.invId, v.sum); } catch (_) {} res.writeHead(200); res.end("OK" + v.invId); }
    else { res.writeHead(400); res.end("bad sign"); }
  });
  server.listen(config.robokassa.resultPort, () => console.log("Сервер оплат Robokassa на порту " + config.robokassa.resultPort));
  return server;
}

module.exports = { createPaymentLink, verifyResult, startResultServer };
