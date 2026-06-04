// EN/ES translations for destinyMatrix.ts description dictionaries and calc-trace labels.
// The base file keeps the Russian dicts and uses these for en/es (ru is the fallback).

type ND = Record<number, { name: string; desc: string }>;
type NS = Record<number, string>;

export type DestinySet = {
  soul: ND; mission: ND; realization: ND; lifeOutcome: ND;
  karmic: NS; shadow: NS; strong: NS;
};
export type DestinyLabels = {
  soul: string; mission: string; realization: string; outcome: string;
  presence: string; karmicTasks: string; none: string;
  soulName: (n: number) => string; missionName: (n: number) => string;
  realizationName: (n: number) => string; outcomeName: (n: number) => string;
};

const EN: DestinySet = {
  soul: {
    1: { name: 'Leader', desc: 'Independence, initiative, the need to lead' },
    2: { name: 'Diplomat', desc: 'Partnership, sensitivity, the need for harmony' },
    3: { name: 'Creator', desc: 'Self-expression, communication, the need to be heard' },
    4: { name: 'Builder', desc: 'Stability, order, the need for structure' },
    5: { name: 'Seeker', desc: 'Freedom, change, the need for new experience' },
    6: { name: 'Mentor', desc: 'Care, responsibility, the need to be needed' },
    7: { name: 'Analyst', desc: 'Depth, introspection, the need to understand the essence' },
    8: { name: 'Manager', desc: 'Power, ambition, the need for material success' },
    9: { name: 'Humanist', desc: 'Completion, wisdom, the need to serve the world' },
  },
  mission: {
    1: { name: 'Mission of leadership', desc: 'To learn to act independently, not to wait for approval' },
    2: { name: 'Mission of partnership', desc: 'To learn to cooperate without losing yourself' },
    3: { name: 'Mission of self-expression', desc: 'To learn to express your inner world without fear' },
    4: { name: 'Mission of order', desc: 'To learn to build a stable foundation in life' },
    5: { name: 'Mission of freedom', desc: 'To learn to manage change rather than run from it' },
    6: { name: 'Mission of responsibility', desc: 'To learn to care without self-sacrifice and control' },
    7: { name: 'Mission of wisdom', desc: 'To learn to trust intuition and share knowledge' },
    8: { name: 'Mission of power', desc: 'To learn to use power ethically and responsibly' },
    9: { name: 'Mission of completion', desc: 'To learn to let go and serve a higher purpose' },
  },
  realization: {
    1: { name: 'Realization through action', desc: 'Your path is through initiative and independent decisions' },
    2: { name: 'Realization through connections', desc: 'Your path is through partnerships and diplomacy' },
    3: { name: 'Realization through creativity', desc: 'Your path is through the word, art, communication' },
    4: { name: 'Realization through system', desc: 'Your path is through discipline, order, method' },
    5: { name: 'Realization through experience', desc: 'Your path is through experiments and variety' },
    6: { name: 'Realization through service', desc: 'Your path is through helping others and mentorship' },
    7: { name: 'Realization through knowledge', desc: 'Your path is through research and deep analysis' },
    8: { name: 'Realization through management', desc: 'Your path is through business, finance and power' },
    9: { name: 'Realization through transformation', desc: 'Your path is through closing cycles and wisdom' },
  },
  lifeOutcome: {
    1: { name: 'Outcome: Independence', desc: 'By the end of life you arrive at full self-sufficiency' },
    2: { name: 'Outcome: Harmony', desc: 'By the end of life you find balance and deep bonds' },
    3: { name: 'Outcome: Legacy', desc: 'By the end of life you leave a creative legacy' },
    4: { name: 'Outcome: Foundation', desc: 'By the end of life you create a solid base for your descendants' },
    5: { name: 'Outcome: Freedom', desc: 'By the end of life you find true inner freedom' },
    6: { name: 'Outcome: Love', desc: 'By the end of life you come to know unconditional love' },
    7: { name: 'Outcome: Enlightenment', desc: 'By the end of life you gain a deep understanding of life' },
    8: { name: 'Outcome: Influence', desc: 'By the end of life you leave a significant mark on the world' },
    9: { name: 'Outcome: Wisdom', desc: 'By the end of life you become a source of wisdom' },
  },
  karmic: {
    1: 'Lesson of leadership — learn to act independently, overcome the fear of loneliness',
    2: 'Lesson of partnership — learn to cooperate without losing yourself',
    3: 'Lesson of self-expression — learn to speak about yourself without fear of judgement',
    4: 'Lesson of discipline — learn to create structure and follow a plan',
    5: 'Lesson of freedom — learn to accept change without panic',
    6: 'Lesson of responsibility — learn to care without burning out',
    7: 'Lesson of depth — learn to trust intuition and solitude',
    8: 'Lesson of power — learn to manage resources ethically',
    9: 'Lesson of completion — learn to let go of the past',
  },
  shadow: {
    1: 'Deficit of 1: fear of loneliness, dependence on approval',
    2: 'Deficit of 2: difficulties in relationships, inability to listen',
    3: 'Deficit of 3: suppressed self-expression, fear of criticism',
    4: 'Deficit of 4: chaos in life, inability to create stability',
    5: 'Deficit of 5: fear of change, getting stuck in the comfort zone',
    6: 'Deficit of 6: avoiding responsibility or over-control',
    7: 'Deficit of 7: superficiality, inability for deep analysis',
    8: 'Deficit of 8: problems with money and power',
    9: 'Deficit of 9: unfinished cycles, inability to let go',
  },
  strong: {
    1: 'Strong 1: powerful will and leadership qualities',
    2: 'Strong 2: developed intuition and diplomacy',
    3: 'Strong 3: a vivid talent for communication',
    4: 'Strong 4: exceptional organization',
    5: 'Strong 5: high adaptability and flexibility',
    6: 'Strong 6: a deep capacity for care',
    7: 'Strong 7: a powerful analytical mind',
    8: 'Strong 8: a natural talent for management',
    9: 'Strong 9: deep wisdom and compassion',
    11: 'Master number 11: intuitive vision and inspiration',
    22: 'Master number 22: the ability to bring great plans to life',
  },
};

const ES: DestinySet = {
  soul: {
    1: { name: 'Líder', desc: 'Autonomía, iniciativa, la necesidad de guiar' },
    2: { name: 'Diplomático', desc: 'Asociación, sensibilidad, la necesidad de armonía' },
    3: { name: 'Creador', desc: 'Autoexpresión, comunicación, la necesidad de ser escuchado' },
    4: { name: 'Constructor', desc: 'Estabilidad, orden, la necesidad de estructura' },
    5: { name: 'Buscador', desc: 'Libertad, cambios, la necesidad de experiencias nuevas' },
    6: { name: 'Mentor', desc: 'Cuidado, responsabilidad, la necesidad de ser necesario' },
    7: { name: 'Analista', desc: 'Profundidad, introspección, la necesidad de comprender la esencia' },
    8: { name: 'Gestor', desc: 'Poder, ambición, la necesidad de éxito material' },
    9: { name: 'Humanista', desc: 'Cierre, sabiduría, la necesidad de servir al mundo' },
  },
  mission: {
    1: { name: 'Misión de liderazgo', desc: 'Aprender a actuar de forma autónoma, sin esperar aprobación' },
    2: { name: 'Misión de asociación', desc: 'Aprender a cooperar sin perderse' },
    3: { name: 'Misión de autoexpresión', desc: 'Aprender a expresar tu mundo interior sin miedo' },
    4: { name: 'Misión del orden', desc: 'Aprender a construir un fundamento estable en la vida' },
    5: { name: 'Misión de la libertad', desc: 'Aprender a gestionar los cambios en vez de huir de ellos' },
    6: { name: 'Misión de la responsabilidad', desc: 'Aprender a cuidar sin sacrificio ni control' },
    7: { name: 'Misión de la sabiduría', desc: 'Aprender a confiar en la intuición y compartir el conocimiento' },
    8: { name: 'Misión de la fuerza', desc: 'Aprender a usar el poder de forma ética y responsable' },
    9: { name: 'Misión del cierre', desc: 'Aprender a soltar y servir a un fin superior' },
  },
  realization: {
    1: { name: 'Realización a través de la acción', desc: 'Tu camino es la iniciativa y las decisiones autónomas' },
    2: { name: 'Realización a través de los vínculos', desc: 'Tu camino son las asociaciones y la diplomacia' },
    3: { name: 'Realización a través de la creatividad', desc: 'Tu camino es la palabra, el arte, la comunicación' },
    4: { name: 'Realización a través del sistema', desc: 'Tu camino es la disciplina, el orden, el método' },
    5: { name: 'Realización a través de la experiencia', desc: 'Tu camino son los experimentos y la variedad' },
    6: { name: 'Realización a través del servicio', desc: 'Tu camino es ayudar a los demás y la mentoría' },
    7: { name: 'Realización a través del conocimiento', desc: 'Tu camino es la investigación y el análisis profundo' },
    8: { name: 'Realización a través de la gestión', desc: 'Tu camino son los negocios, las finanzas y el poder' },
    9: { name: 'Realización a través de la transformación', desc: 'Tu camino es cerrar ciclos y la sabiduría' },
  },
  lifeOutcome: {
    1: { name: 'Resultado: Independencia', desc: 'Al final de la vida llegas a una plena autosuficiencia' },
    2: { name: 'Resultado: Armonía', desc: 'Al final de la vida encuentras equilibrio y vínculos profundos' },
    3: { name: 'Resultado: Legado', desc: 'Al final de la vida dejas un legado creativo' },
    4: { name: 'Resultado: Fundamento', desc: 'Al final de la vida creas una base sólida para tus descendientes' },
    5: { name: 'Resultado: Libertad', desc: 'Al final de la vida encuentras la verdadera libertad interior' },
    6: { name: 'Resultado: Amor', desc: 'Al final de la vida conoces el amor incondicional' },
    7: { name: 'Resultado: Iluminación', desc: 'Al final de la vida obtienes una comprensión profunda de la vida' },
    8: { name: 'Resultado: Influencia', desc: 'Al final de la vida dejas una huella significativa en el mundo' },
    9: { name: 'Resultado: Sabiduría', desc: 'Al final de la vida te conviertes en una fuente de sabiduría' },
  },
  karmic: {
    1: 'Lección de liderazgo — aprender a actuar de forma autónoma, superar el miedo a la soledad',
    2: 'Lección de asociación — aprender a cooperar sin perderse',
    3: 'Lección de autoexpresión — aprender a hablar de uno mismo sin miedo al juicio',
    4: 'Lección de disciplina — aprender a crear estructura y seguir un plan',
    5: 'Lección de libertad — aprender a aceptar los cambios sin pánico',
    6: 'Lección de responsabilidad — aprender a cuidar sin agotarse',
    7: 'Lección de profundidad — aprender a confiar en la intuición y la soledad',
    8: 'Lección de poder — aprender a gestionar los recursos de forma ética',
    9: 'Lección de cierre — aprender a soltar el pasado',
  },
  shadow: {
    1: 'Déficit de 1: miedo a la soledad, dependencia de la aprobación',
    2: 'Déficit de 2: dificultades en las relaciones, incapacidad de escuchar',
    3: 'Déficit de 3: autoexpresión reprimida, miedo a la crítica',
    4: 'Déficit de 4: caos en la vida, incapacidad de crear estabilidad',
    5: 'Déficit de 5: miedo al cambio, estancamiento en la zona de confort',
    6: 'Déficit de 6: evitar la responsabilidad o el hipercontrol',
    7: 'Déficit de 7: superficialidad, incapacidad para el análisis profundo',
    8: 'Déficit de 8: problemas con el dinero y el poder',
    9: 'Déficit de 9: ciclos sin cerrar, incapacidad de soltar',
  },
  strong: {
    1: 'Fuerte 1: una voluntad poderosa y cualidades de liderazgo',
    2: 'Fuerte 2: intuición desarrollada y diplomacia',
    3: 'Fuerte 3: un talento vívido para la comunicación',
    4: 'Fuerte 4: una organización excepcional',
    5: 'Fuerte 5: alta adaptabilidad y flexibilidad',
    6: 'Fuerte 6: una profunda capacidad de cuidado',
    7: 'Fuerte 7: una poderosa mente analítica',
    8: 'Fuerte 8: un talento natural para la gestión',
    9: 'Fuerte 9: profunda sabiduría y compasión',
    11: 'Número maestro 11: visión intuitiva e inspiración',
    22: 'Número maestro 22: la capacidad de materializar grandes planes',
  },
};

export function getDestinySet(lang: string): DestinySet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}

export function getDestinyLabels(lang: string): DestinyLabels {
  if (lang === 'en') {
    return {
      soul: 'Soul', mission: 'Mission', realization: 'Realization', outcome: 'Outcome',
      presence: 'Presence', karmicTasks: 'Karmic tasks', none: 'none',
      soulName: (n) => `Soul ${n}`, missionName: (n) => `Mission ${n}`,
      realizationName: (n) => `Realization ${n}`, outcomeName: (n) => `Outcome ${n}`,
    };
  }
  if (lang === 'es') {
    return {
      soul: 'Alma', mission: 'Misión', realization: 'Realización', outcome: 'Resultado',
      presence: 'Presencia', karmicTasks: 'Tareas kármicas', none: 'ninguna',
      soulName: (n) => `Alma ${n}`, missionName: (n) => `Misión ${n}`,
      realizationName: (n) => `Realización ${n}`, outcomeName: (n) => `Resultado ${n}`,
    };
  }
  return {
    soul: 'Душа', mission: 'Миссия', realization: 'Реализация', outcome: 'Итог',
    presence: 'Присутствие', karmicTasks: 'Кармические задачи', none: 'нет',
    soulName: (n) => `Душа ${n}`, missionName: (n) => `Миссия ${n}`,
    realizationName: (n) => `Реализация ${n}`, outcomeName: (n) => `Итог ${n}`,
  };
}
