// Три сферы жизни и их привязка к позициям матрицы + варианты боли.
// Отношения -> позиция 2 (внутренняя суть в близости)
// Деньги и дело -> позиция 5 (профориентация, реализация)
// Путь и сила -> позиция 7 (цель жизни)
const { getArcana } = require("./arcana");

const SPHERES = {
  love: {
    key: "love", pos: 2, label: "Отношения", emoji: "💗",
    concerns: [
      { id: "lonely", text: "Одиночество, нет близкого" },
      { id: "partner", text: "Сложно с партнёром" },
      { id: "past", text: "Не отпускаю прошлое" },
      { id: "curious", text: "Просто интересно" },
    ],
  },
  money: {
    key: "money", pos: 5, label: "Деньги и дело", emoji: "✨",
    concerns: [
      { id: "lack", text: "Денег не хватает" },
      { id: "wrongjob", text: "Работа не моя" },
      { id: "fearstart", text: "Боюсь начать своё" },
      { id: "curious", text: "Просто интересно" },
    ],
  },
  path: {
    key: "path", pos: 7, label: "Путь и сила", emoji: "🌙",
    concerns: [
      { id: "lost", text: "Не понимаю, чего хочу" },
      { id: "noenergy", text: "Нет сил и энергии" },
      { id: "anxiety", text: "Тревога за будущее" },
      { id: "curious", text: "Просто интересно" },
    ],
  },
};

const SPHERE_ORDER = ["love", "money", "path"];

// Три карты сфер из матрицы: [{ key, pos, n, name, label, emoji }]
function sphereCards(matrix) {
  return SPHERE_ORDER.map((k) => {
    const s = SPHERES[k];
    const n = matrix.positions[s.pos - 1];
    const a = getArcana(n);
    return { key: k, pos: s.pos, n, name: a ? a.name : String(n), label: s.label, emoji: s.emoji };
  });
}

function concernText(sphereKey, concernId) {
  const s = SPHERES[sphereKey];
  const c = s && s.concerns.find((x) => x.id === concernId);
  return c ? c.text : "";
}

module.exports = { SPHERES, SPHERE_ORDER, sphereCards, concernText };
