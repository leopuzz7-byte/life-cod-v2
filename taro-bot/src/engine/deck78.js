// Полная колода 78 карт (новые изображения в assets/deck).
// Старшие арканы 0-21 и четыре масти по 14. Используется в Таро-раскладах:
// бесплатный крючок на одну карту и платный расклад на трёх картах.
// Нумерология-матрица нумерует арканы по своему (Шут = 22), для неё есть
// отдельный маппер majorFileByMatrixNum. Строго без длинных тире и стрелок.
const path = require("path");

const DECK_DIR = path.join(__dirname, "..", "..", "assets", "deck");

// Масти: имя, стихия, о чём масть (для ИИ-разбора).
const SUIT = {
  wands:     { gen: "Жезлов",    name: "Жезлы",    element: "Огонь",  theme: "воля, энергия, действие, страсть, начинания" },
  cups:      { gen: "Кубков",    name: "Кубки",    element: "Вода",   theme: "чувства, любовь, отношения, интуиция" },
  swords:    { gen: "Мечей",     name: "Мечи",     element: "Воздух", theme: "мысли, слова, ясность, конфликты, решения" },
  pentacles: { gen: "Пентаклей", name: "Пентакли", element: "Земля",  theme: "деньги, работа, тело, быт, стабильность" },
};
const SUIT_ORDER = ["wands", "cups", "swords", "pentacles"];

// Старшие арканы 0-21: имя, римская цифра для показа, файл, планета, стихия.
const MAJORS = [
  { n: 0,  roman: "0",     name: "Шут",            file: "arcana-00-shut.webp",          planet: "Уран",     element: "Воздух" },
  { n: 1,  roman: "I",     name: "Маг",            file: "arcana-01-mag.webp",           planet: "Меркурий", element: "Воздух" },
  { n: 2,  roman: "II",    name: "Жрица",          file: "arcana-02-zhrica.webp",        planet: "Луна",     element: "Вода" },
  { n: 3,  roman: "III",   name: "Императрица",    file: "arcana-03-imperatrica.webp",   planet: "Венера",   element: "Земля" },
  { n: 4,  roman: "IV",    name: "Император",      file: "arcana-04-imperator.webp",     planet: "Марс",     element: "Огонь" },
  { n: 5,  roman: "V",     name: "Иерофант",       file: "arcana-05-ierofant.webp",      planet: "Юпитер",   element: "Земля" },
  { n: 6,  roman: "VI",    name: "Влюблённые",     file: "arcana-06-vlyublyonnye.webp",  planet: "Венера",   element: "Воздух" },
  { n: 7,  roman: "VII",   name: "Колесница",      file: "arcana-07-kolesnica.webp",     planet: "Марс",     element: "Вода" },
  { n: 8,  roman: "VIII",  name: "Сила",           file: "arcana-08-sila.webp",          planet: "Марс",     element: "Огонь" },
  { n: 9,  roman: "IX",    name: "Отшельник",      file: "arcana-09-otshelnik.webp",     planet: "Нептун",   element: "Земля" },
  { n: 10, roman: "X",     name: "Колесо Фортуны", file: "arcana-10-koleso.webp",        planet: "Юпитер",   element: "Огонь" },
  { n: 11, roman: "XI",    name: "Справедливость", file: "arcana-11-spravedlivost.webp", planet: "Сатурн",   element: "Воздух" },
  { n: 12, roman: "XII",   name: "Повешенный",     file: "arcana-12-poveshennyy.webp",   planet: "Нептун",   element: "Вода" },
  { n: 13, roman: "XIII",  name: "Смерть",         file: "arcana-13-smert.webp",         planet: "Плутон",   element: "Вода" },
  { n: 14, roman: "XIV",   name: "Умеренность",    file: "arcana-14-umerennost.webp",    planet: "Юпитер",   element: "Огонь" },
  { n: 15, roman: "XV",    name: "Дьявол",         file: "arcana-15-dyavol.webp",        planet: "Сатурн",   element: "Земля" },
  { n: 16, roman: "XVI",   name: "Башня",          file: "arcana-16-bashnya.webp",       planet: "Марс",     element: "Огонь" },
  { n: 17, roman: "XVII",  name: "Звезда",         file: "arcana-17-zvezda.webp",        planet: "Уран",     element: "Воздух" },
  { n: 18, roman: "XVIII", name: "Луна",           file: "arcana-18-luna.webp",          planet: "Луна",     element: "Вода" },
  { n: 19, roman: "XIX",   name: "Солнце",         file: "arcana-19-solnce.webp",        planet: "Солнце",   element: "Огонь" },
  { n: 20, roman: "XX",    name: "Суд",            file: "arcana-20-sud.webp",           planet: "Плутон",   element: "Огонь" },
  { n: 21, roman: "XXI",   name: "Мир",            file: "arcana-21-mir.webp",           planet: "Сатурн",   element: "Земля" },
];

// Ранги младших: значение, имя для показа, кусок имени файла.
const RANKS = [
  { r: 1,  word: "Туз",       part: "01-tuz" },
  { r: 2,  word: "Двойка",    part: "02" },
  { r: 3,  word: "Тройка",    part: "03" },
  { r: 4,  word: "Четвёрка",  part: "04" },
  { r: 5,  word: "Пятёрка",   part: "05" },
  { r: 6,  word: "Шестёрка",  part: "06" },
  { r: 7,  word: "Семёрка",   part: "07" },
  { r: 8,  word: "Восьмёрка", part: "08" },
  { r: 9,  word: "Девятка",   part: "09" },
  { r: 10, word: "Десятка",   part: "10" },
  { r: 11, word: "Паж",       part: "11-pazh" },
  { r: 12, word: "Рыцарь",    part: "12-rycar" },
  { r: 13, word: "Королева",  part: "13-koroleva" },
  { r: 14, word: "Король",    part: "14-korol" },
];

function buildDeck() {
  const deck = [];
  for (const m of MAJORS) {
    deck.push({ key: m.file.replace(/\.webp$/, ""), group: "major", n: m.n, roman: m.roman, name: m.name, file: m.file, planet: m.planet, element: m.element });
  }
  for (const s of SUIT_ORDER) {
    for (const rk of RANKS) {
      const file = `${s}-${rk.part}.webp`;
      deck.push({ key: file.replace(/\.webp$/, ""), group: "minor", suit: s, suitName: SUIT[s].name, rank: rk.r, name: `${rk.word} ${SUIT[s].gen}`, file, element: SUIT[s].element });
    }
  }
  return deck;
}
const DECK = buildDeck();

function cardByKey(key) { return DECK.find((c) => c.key === key) || null; }
function resolve(card) {
  if (card && typeof card === "object") return card;
  if (typeof card === "string") return cardByKey(card);
  return null;
}

// Случайная карта из 78 (на каждое нажатие новая).
function drawCard() { return DECK[Math.floor(Math.random() * DECK.length)]; }
// n разных карт.
function drawCards(n) {
  const idx = new Set();
  while (idx.size < n) idx.add(Math.floor(Math.random() * DECK.length));
  return [...idx].map((i) => DECK[i]);
}

// Имя карты для показа человеку.
function cardName(card) {
  const c = resolve(card);
  return c && c.name ? c.name : "Твоя карта";
}

// Описание карты для ИИ (строка с мастью, планетой, стихией).
function cardInfo(card) {
  const c = resolve(card);
  if (!c) return "выпавшая карта";
  if (c.group === "major") return `Старший аркан «${c.name}» (планета ${c.planet}, стихия ${c.element})`;
  const s = SUIT[c.suit];
  return `Младший аркан «${c.name}», масть ${s.name} (стихия ${s.element}, о теме: ${s.theme})`;
}

// Полный путь к картинке карты, либо null.
function cardFile(card) {
  const c = resolve(card);
  return c && c.file ? path.join(DECK_DIR, c.file) : null;
}

// Матрица нумерологии нумерует арканы 1..22, где Шут = 22.
// Возвращает имя файла новой картинки старшего аркана для номера матрицы.
function majorFileByMatrixNum(n) {
  const num = Number(n) === 22 ? 0 : Number(n);
  const m = MAJORS.find((x) => x.n === num);
  return m ? m.file : null;
}

module.exports = { DECK, DECK_DIR, drawCard, drawCards, cardByKey, cardName, cardInfo, cardFile, majorFileByMatrixNum };
