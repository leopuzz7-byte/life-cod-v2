const { calculatePersonalMatrix } = require("./calculations");
const { getArcana, positionTitles } = require("./arcana");
const assert = require("assert");
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
const expectedDeckSizes = { author: 78, thoth: 78, lenormand: 47, "ludy-lescot": 78, "deviant-moon": 78, "golden-taurus": 78 };
for (const [deckId, expected] of Object.entries(expectedDeckSizes)) {
  const profile = paidDecks.getDeck(deckId);
  assert.strictEqual(profile.cards.length, expected, `${deckId}: неверное число карт`);
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
  ["Какой вариант выбрать и какой урок я сейчас прохожу?", "thoth"],
];
for (const [question, expected] of routeCases) assert.strictEqual(paidDecks.localRoute(question), expected, question);
console.log("платные колоды:", Object.entries(expectedDeckSizes).map(([id, count]) => `${id}=${count}`).join(", "), "| файлы и маршрутизация: ОК");
