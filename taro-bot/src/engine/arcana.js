// 22 аркана + описания позиций матрицы.
// Данные скопированы из калькулятора life-cod-v2 (src/lib/arcana.ts) без изменений.

const arcana = {
  1:  { name: "Маг",                     planet: "Меркурий", element: "Воздух" },
  2:  { name: "Жрица",                   planet: "Луна",     element: "Вода" },
  3:  { name: "Императрица",             planet: "Венера",   element: "Земля" },
  4:  { name: "Император",               planet: "Марс",     element: "Огонь" },
  5:  { name: "Жрец (Иерофант)",         planet: "Юпитер",   element: "Земля" },
  6:  { name: "Влюблённые",              planet: "Венера",   element: "Воздух" },
  7:  { name: "Колесница",               planet: "Марс",     element: "Вода" },
  8:  { name: "Сила",                    planet: "Марс",     element: "Огонь" },
  9:  { name: "Отшельник",               planet: "Нептун",   element: "Земля" },
  10: { name: "Фортуна (Колесо Судьбы)", planet: "Юпитер",   element: "Огонь" },
  11: { name: "Правосудие",              planet: "Сатурн",   element: "Воздух" },
  12: { name: "Повешенный",              planet: "Нептун",   element: "Вода" },
  13: { name: "Смерть",                  planet: "Плутон",   element: "Вода" },
  14: { name: "Умеренность",             planet: "Юпитер",   element: "Огонь" },
  15: { name: "Дьявол",                  planet: "Сатурн",   element: "Земля" },
  16: { name: "Башня",                   planet: "Марс",     element: "Огонь" },
  17: { name: "Звезда",                  planet: "Уран",     element: "Воздух" },
  18: { name: "Луна",                    planet: "Луна",     element: "Вода" },
  19: { name: "Солнце",                  planet: "Солнце",   element: "Огонь" },
  20: { name: "Суд",                     planet: "Плутон",   element: "Огонь" },
  21: { name: "Мир",                     planet: "Сатурн",   element: "Земля" },
  22: { name: "Шут",                     planet: "Уран",     element: "Воздух" },
};

// Названия 12 позиций матрицы (из калькулятора).
const positionTitles = {
  1:  "Детство",
  2:  "Внутренняя суть",
  3:  "Таланты и качества",
  4:  "Цель накопления мудрости",
  5:  "Профессиональная ориентация",
  6:  "Точка опоры",
  7:  "Цель жизни",
  8:  "Способ достижения цели",
  9:  "Зона комфорта",
  10: "Невыполненные задачи",
  11: "Ошибки прошлого",
  12: "Главная кармическая задача",
};

function getArcana(n) {
  return arcana[n] || null;
}

module.exports = { arcana, positionTitles, getArcana };
