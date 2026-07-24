// Вспомогательные функции: три карты жизненных периодов и факты по дате
// (день недели, сезон) для барнум-фразы.

const { getArcana } = require("./arcana");

// Три карты жизненных периодов методики 1:
//   позиция 1  -> до 25 лет (юность, начало пути)
//   позиция 5  -> 25-50 лет (зрелость, реализация)
//   позиция 4  -> после 50 (мудрость, включается около 50)
// Возвращает [{ pos, n, name, label }].
const PERIODS = [
  { pos: 1, label: "До 25 лет" },
  { pos: 5, label: "25-50 лет" },
  { pos: 4, label: "После 50" },
];

function lifePeriodCards(matrix) {
  return PERIODS.map(({ pos, label }) => {
    const n = matrix.positions[pos - 1];
    const a = getArcana(n);
    return { pos, n, name: a ? a.name : String(n), label };
  });
}

const WEEKDAYS = ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"];
const WEEKDAY_NOM = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];

function weekday(day, month, year) {
  const d = new Date(Date.UTC(year, month - 1, day));
  return { acc: WEEKDAYS[d.getUTCDay()], nom: WEEKDAY_NOM[d.getUTCDay()], idx: d.getUTCDay() };
}

function season(month) {
  if (month === 12 || month <= 2) return "зимой";
  if (month <= 5) return "весной";
  if (month <= 8) return "летом";
  return "осенью";
}

// Готовая строка-факт для барнум-фразы: "рождённые в пятницу, осенью"
function birthFacts(birth) {
  const w = weekday(birth.day, birth.month, birth.year);
  return { weekdayAcc: w.acc, weekdayNom: w.nom, season: season(birth.month), phrase: `рождённые ${birth.day > 0 ? "в " + w.acc : ""}, ${season(birth.month)}` };
}

module.exports = { lifePeriodCards, birthFacts, weekday, season, PERIODS };
