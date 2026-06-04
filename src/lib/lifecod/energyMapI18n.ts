// EN/ES translations for energyMap.ts.

export type EnergySet = {
  names: Record<number, string>;
  descriptions: Record<number, Record<string, string>>;
  leaks: Record<number, string>;
  strengths: Record<number, string>;
};
export type EnergyLabels = {
  status: { deficit: string; normal: string; strong: string; excess: string };
  balance: (b: number) => string;
  presence: string; balanceWord: string; deficits: string; strong: string; none: string;
  centerFallback: (n: number) => string;
};

const EN: EnergySet = {
  names: {
    1: 'Will and Ego', 2: 'Emotions and Intuition', 3: 'Communication and Creativity',
    4: 'Stability and Order', 5: 'Freedom and Adaptation', 6: 'Responsibility and Care',
    7: 'Wisdom and Analysis', 8: 'Power and Resources', 9: 'Transformation and Completion',
  },
  descriptions: {
    1: { deficit: "Weak will, dependence on others' opinions", normal: 'Healthy independence', strong: 'Powerful ego, leadership', excess: 'Selfishness, suppressing others' },
    2: { deficit: 'Emotional deafness, difficulties with empathy', normal: 'Developed emotionality', strong: 'Deep intuition', excess: 'Over-sensitivity, vulnerability' },
    3: { deficit: 'Difficulties with self-expression', normal: 'Good communication skills', strong: 'A talent for the word and creativity', excess: 'Talkativeness, superficiality' },
    4: { deficit: 'Chaos, lack of structure', normal: 'Organization', strong: 'Reliability, method', excess: 'Rigidity, control' },
    5: { deficit: 'Fear of change, getting stuck', normal: 'Flexibility', strong: 'High adaptability', excess: 'Inconstancy, chaos' },
    6: { deficit: 'Irresponsibility or avoidance', normal: 'Healthy responsibility', strong: 'Devotion and care', excess: 'Self-sacrifice, burnout' },
    7: { deficit: 'Superficial thinking', normal: 'An analytical mind', strong: 'Deep understanding', excess: 'Reserve, paranoia' },
    8: { deficit: 'Problems with money', normal: 'A healthy attitude to resources', strong: 'Managerial talent', excess: 'Greed, pressure' },
    9: { deficit: 'Inability to let go', normal: 'The ability to complete', strong: 'The wisdom of transformation', excess: 'Destructiveness' },
  },
  leaks: {
    1: "Leak through insecurity — you don't start, you don't decide",
    2: 'Leak through emotions — you spend energy on worrying',
    3: 'Leak through empty talk — many words, little action',
    4: 'Leak through chaos — no system, energy dissipates',
    5: "Leak through inconstancy — you can't focus",
    6: 'Leak through others — you give everything, get nothing',
    7: 'Leak through isolation — you close off from the world',
    8: 'Leak through struggle — you fight instead of building',
    9: "Leak through the past — you hold on to what should be let go",
  },
  strengths: {
    1: 'Strength of personality — natural leadership and will',
    2: 'Strength of feeling — developed intuition and empathy',
    3: 'Strength of the word — influence through communication',
    4: 'Strength of order — the ability to create a system',
    5: 'Strength of adaptation — flexibility in any situation',
    6: 'Strength of care — attracts people through reliability',
    7: 'Strength of mind — deep analysis and understanding',
    8: 'Strength of management — a talent for large-scale projects',
    9: 'Strength of wisdom — seeing the full picture',
  },
};

const ES: EnergySet = {
  names: {
    1: 'Voluntad y Ego', 2: 'Emociones e Intuición', 3: 'Comunicación y Creatividad',
    4: 'Estabilidad y Orden', 5: 'Libertad y Adaptación', 6: 'Responsabilidad y Cuidado',
    7: 'Sabiduría y Análisis', 8: 'Poder y Recursos', 9: 'Transformación y Cierre',
  },
  descriptions: {
    1: { deficit: 'Voluntad débil, dependencia de la opinión ajena', normal: 'Autonomía sana', strong: 'Ego poderoso, liderazgo', excess: 'Egoísmo, someter a los demás' },
    2: { deficit: 'Sordera emocional, dificultades con la empatía', normal: 'Emotividad desarrollada', strong: 'Intuición profunda', excess: 'Hipersensibilidad, vulnerabilidad' },
    3: { deficit: 'Dificultades con la autoexpresión', normal: 'Buenas habilidades de comunicación', strong: 'Talento para la palabra y la creatividad', excess: 'Locuacidad, superficialidad' },
    4: { deficit: 'Caos, falta de estructura', normal: 'Organización', strong: 'Fiabilidad, método', excess: 'Rigidez, control' },
    5: { deficit: 'Miedo al cambio, estancamiento', normal: 'Flexibilidad', strong: 'Alta adaptabilidad', excess: 'Inconstancia, caos' },
    6: { deficit: 'Irresponsabilidad o evitación', normal: 'Responsabilidad sana', strong: 'Devoción y cuidado', excess: 'Sacrificio, agotamiento' },
    7: { deficit: 'Pensamiento superficial', normal: 'Una mente analítica', strong: 'Comprensión profunda', excess: 'Hermetismo, paranoia' },
    8: { deficit: 'Problemas con el dinero', normal: 'Una relación sana con los recursos', strong: 'Talento de gestión', excess: 'Codicia, presión' },
    9: { deficit: 'Incapacidad de soltar', normal: 'La capacidad de cerrar', strong: 'La sabiduría de la transformación', excess: 'Carácter destructivo' },
  },
  leaks: {
    1: 'Fuga por la inseguridad: no empiezas, no decides',
    2: 'Fuga por las emociones: gastas energía en preocuparte',
    3: 'Fuga por la charla vacía: muchas palabras, pocos hechos',
    4: 'Fuga por el caos: sin sistema, la energía se dispersa',
    5: 'Fuga por la inconstancia: no logras concentrarte',
    6: 'Fuga por los demás: lo das todo y no recibes nada',
    7: 'Fuga por el aislamiento: te cierras al mundo',
    8: 'Fuga por la lucha: peleas en vez de construir',
    9: 'Fuga por el pasado: te aferras a lo que toca soltar',
  },
  strengths: {
    1: 'Fuerza de la personalidad: liderazgo y voluntad naturales',
    2: 'Fuerza del sentir: intuición y empatía desarrolladas',
    3: 'Fuerza de la palabra: influencia a través de la comunicación',
    4: 'Fuerza del orden: la capacidad de crear un sistema',
    5: 'Fuerza de la adaptación: flexibilidad en cualquier situación',
    6: 'Fuerza del cuidado: atrae a la gente por su fiabilidad',
    7: 'Fuerza de la mente: análisis y comprensión profundos',
    8: 'Fuerza de la gestión: talento para proyectos a gran escala',
    9: 'Fuerza de la sabiduría: ver el cuadro completo',
  },
};

export function getEnergySet(lang: string): EnergySet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
export function getEnergyLabels(lang: string): EnergyLabels {
  if (lang === 'en') {
    return {
      status: { deficit: 'Deficit', normal: 'Normal', strong: 'Strong', excess: 'Excess' },
      balance: (b) => (b >= 75 ? 'Harmonious' : b >= 50 ? 'Moderate' : b >= 25 ? 'Unbalanced' : 'Critical imbalance'),
      presence: 'Number presence', balanceWord: 'Balance', deficits: 'Deficits', strong: 'Strong', none: 'none',
      centerFallback: (n) => `Center ${n}`,
    };
  }
  if (lang === 'es') {
    return {
      status: { deficit: 'Déficit', normal: 'Normal', strong: 'Fuerte', excess: 'Exceso' },
      balance: (b) => (b >= 75 ? 'Armonioso' : b >= 50 ? 'Moderado' : b >= 25 ? 'Desequilibrado' : 'Desequilibrio crítico'),
      presence: 'Presencia de números', balanceWord: 'Equilibrio', deficits: 'Déficits', strong: 'Fuertes', none: 'ninguno',
      centerFallback: (n) => `Centro ${n}`,
    };
  }
  return {
    status: { deficit: 'Дефицит', normal: 'Норма', strong: 'Сильная', excess: 'Избыток' },
    balance: (b) => (b >= 75 ? 'Гармоничный' : b >= 50 ? 'Умеренный' : b >= 25 ? 'Несбалансированный' : 'Критический дисбаланс'),
    presence: 'Присутствие чисел', balanceWord: 'Баланс', deficits: 'Дефициты', strong: 'Сильные', none: 'нет',
    centerFallback: (n) => `Центр ${n}`,
  };
}
