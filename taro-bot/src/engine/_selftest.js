const { calculatePersonalMatrix } = require("./calculations");
const { getArcana, positionTitles } = require("./arcana");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const paidDecks = require("./paidDecks");
const deck78 = require("./deck78");
const taroCredits = require("./taroCredits");
// проверочные даты
[[7,3,1990],[29,12,1985],[1,1,2000],[31,10,1976]].forEach(([d,m,y]) => {
  const mx = calculatePersonalMatrix(d, m, y);
  console.log(`${d}.${m}.${y} -> positions [${mx.positions.join(", ")}] | код успеха [${mx.successCode.join(", ")}]`);
});
// sanity: все значения в диапазоне 1..22
const bad = [];
for (let d=1; d<=28; d++) for (let m=1; m<=12; m++) {
  const p = calculatePersonalMatrix(d,m,1990).positions;
  if (p.some(v => v<1 || v>22)) bad.push(`${d}.${m}`);
}
console.log("out-of-range dates:", bad.length === 0 ? "НЕТ (ок)" : bad.join(","));
console.log("аркан 7 =", getArcana(7).name, "| позиция 7 =", positionTitles[7]);

// Платные колоды: состав, файлы и базовая маршрутизация запросов.
const expectedDeckSizes = { author: 78, thoth: 78, lenormand: 47, "ludy-lescot": 78, "deviant-moon": 78, "golden-taurus": 78, decameron: 78 };
for (const [deckId, expected] of Object.entries(expectedDeckSizes)) {
  const profile = paidDecks.getDeck(deckId);
  assert.strictEqual(profile.cards.length, expected, `${deckId}: неверное число карт`);
  assert.ok(profile.description && profile.description.length >= 60, `${deckId}: нет понятного описания колоды`);
  assert.strictEqual(new Set(profile.cards.map((card) => card.key)).size, expected, `${deckId}: повтор ключа карты`);
  assert.strictEqual(new Set(profile.cards.map((card) => card.file)).size, expected, `${deckId}: повтор имени файла`);
  const sample = paidDecks.drawCards(deckId, Math.min(10, expected));
  assert.strictEqual(new Set(sample).size, sample.length, `${deckId}: повтор при случайной выдаче`);
}
// Случайная выдача использует системный генератор, возвращает разные карты и не повторяет карты внутри расклада.
for (let i = 0; i < 200; i++) {
  assert.strictEqual(new Set(paidDecks.drawCards("author", 3)).size, 3, "author: повтор карты внутри расклада");
  assert.strictEqual(new Set(deck78.drawCards(3).map((card) => card.key)).size, 3, "free: повтор карты внутри расклада");
}
assert.ok(new Set(Array.from({ length: 200 }, () => paidDecks.drawCards("author", 1)[0])).size > 50, "author: случайная выдача недостаточно разнообразна");

const creditUser = {};
assert.deepStrictEqual(taroCredits.parseGrant("1"), { unlimited: false, count: 1 });
assert.deepStrictEqual(taroCredits.parseGrant("unlimited"), { unlimited: true, count: 0 });
assert.strictEqual(taroCredits.parseGrant("0"), null);
taroCredits.grant(creditUser, "3");
assert.strictEqual(taroCredits.balance(creditUser), "3");
assert.ok(taroCredits.consume(creditUser));
assert.strictEqual(taroCredits.balance(creditUser), "2");
taroCredits.grant(creditUser, "безлимит");
assert.ok(taroCredits.consume(creditUser));
assert.strictEqual(taroCredits.balance(creditUser), "безлимит");
for (const category of paidDecks.CATEGORIES) {
  assert.ok(["♡", "✦", "☾", "✧", "☽", "◇", "⋆", "♢", "✎"].includes(category.emoji), `${category.id}: пёстрый или неизвестный символ темы`);
  for (const intentId of category.intents) assert.ok(paidDecks.getIntent(intentId), `${category.id}: неизвестный intent ${intentId}`);
}
for (const card of paidDecks.getDeck("lenormand").cards) {
  assert.ok(card.number && card.name && card.symbol && card.playing, `lenormand: неполные метаданные ${card.key}`);
  if (card.playing !== "без игрального соответствия") assert.ok(card.playingRank && card.playingSuit, `lenormand: нет масти или достоинства ${card.key}`);
}
const assetProblems = paidDecks.validateAssets();
assert.deepStrictEqual(assetProblems, [], `проблемы файлов колод: ${assetProblems.join("; ")}`);

const routeCases = [
  ["Кто на самом деле мой новый начальник и можно ли ему доверять?", "ludy-lescot"],
  ["Почему партнёр меня избегает и что он скрывает внутри?", "deviant-moon"],
  ["Будет ли встреча и когда он мне напишет?", "lenormand"],
  ["Какие риски у моего бизнеса и как увеличить прибыль?", "golden-taurus"],
  ["Придут ли деньги до пятницы?", "lenormand"],
  ["Есть ли между нами сексуальное притяжение и настоящая химия?", "decameron"],
  ["Почему в нашей интимной жизни пропало желание?", "decameron"],
  ["Что стоит за соблазном и тайной близостью с этим человеком?", "decameron"],
  ["Есть ли третий человек и будет ли у них встреча?", "lenormand"],
  ["Какой вариант выбрать и какой урок я сейчас прохожу?", "thoth"],
];
for (const [question, expected] of routeCases) assert.strictEqual(paidDecks.localRoute(question), expected, question);

// Регрессия меню: подпись кнопки должна перехватываться раньше полей активной цепочки.
const botSource = fs.readFileSync(path.join(__dirname, "..", "bot", "index.js"), "utf8");
const textHandlerAt = botSource.indexOf('bot.on("message:text"');
const menuPriorityAt = botSource.indexOf("if (Object.values(L).includes(text))", textHandlerAt);
const paidInputAt = botSource.indexOf('if (u.step === "sp_subject_name")', textHandlerAt);
assert.ok(textHandlerAt >= 0 && menuPriorityAt > textHandlerAt && menuPriorityAt < paidInputAt, "главное меню обрабатывается после полей расклада");
assert.ok(botSource.includes("function cancelInteractiveFlow(u)"), "нет единого сброса активной цепочки");
assert.ok(botSource.includes('if (!isActivePaidStep(u, "sp_sphere")) return;'), "старые кнопки тем не блокируются");
assert.ok(botSource.includes('if (!isSamePaidFlow(ctx.from.id, flowId, "sp_reading")) return;'), "ответ ИИ может продолжить отменённый расклад");
console.log("платные колоды:", Object.entries(expectedDeckSizes).map(([id, count]) => `${id}=${count}`).join(", "), "| файлы и маршрутизация: ОК");
