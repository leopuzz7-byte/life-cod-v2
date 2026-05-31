// EN/ES translations for monthlyForecast.ts (month names, digit traits, red flags, recommendations).

type Trait = { plus: string[]; minus: string[] };

export type MonthlySet = {
  monthNames: string[];
  traits: Record<number, Trait>;
  redFlags: { d7: string; d8: string; d9: string; overload1: string };
  recs: { risk7: string; risk8: string; riskOverload1: string; riskDefault: string; neutral: string; resource: string };
};

const EN: MonthlySet = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  traits: {
    0: { plus: ['Pause, reboot'], minus: ['Reset, loss of direction'] },
    1: { plus: ['Leadership, initiative, decisions'], minus: ['Ego, pressure, conflict-proneness'] },
    2: { plus: ['Dialogue, partnership, empathy'], minus: ['Resentments, dependence, manipulation'] },
    3: { plus: ['Communication, presentations, creativity'], minus: ['Chatter, scattering, promises without action'] },
    4: { plus: ['Structure, discipline, order'], minus: ['Control, greed, stubbornness'] },
    5: { plus: ['Movement, opportunities, creativity'], minus: ['Instability, impulses, swings'] },
    6: { plus: ['Responsibility, stability, family'], minus: ["Burnout, holding grudges, 'I carry it all'"] },
    7: { plus: ['Insights, re-evaluation, strategy'], minus: ['Reserve, resets, breakups'] },
    8: { plus: ['Money, career, management'], minus: ['Pressure, control, jealousy'] },
    9: { plus: ['Completion, maturity, results'], minus: ['Resentments, pressure, abrupt partings'] },
  },
  redFlags: { d7: 'Risk of abrupt resets', d8: 'Risk of pressure and control', d9: 'Risk of abrupt partings', overload1: "Overload of 'I', conflict-proneness" },
  recs: {
    risk7: "Don't decide anything fateful on impulse. A month for a 'quiet reassembly'.",
    risk8: 'Power — only through rules and agreement.',
    riskOverload1: 'Sleep, sport, discipline of speech. Toxicity intensifies.',
    riskDefault: "Slow down, don't make abrupt decisions.",
    neutral: 'Control impulses, work according to plan.',
    resource: 'A resourceful month. You can start the new and make agreements.',
  },
};

const ES: MonthlySet = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  traits: {
    0: { plus: ['Pausa, reinicio'], minus: ['Puesta a cero, pérdida de dirección'] },
    1: { plus: ['Liderazgo, iniciativa, decisiones'], minus: ['Ego, presión, conflictividad'] },
    2: { plus: ['Diálogo, asociación, empatía'], minus: ['Rencores, dependencia, manipulaciones'] },
    3: { plus: ['Comunicación, presentaciones, creatividad'], minus: ['Cháchara, dispersión, promesas sin hechos'] },
    4: { plus: ['Estructura, disciplina, orden'], minus: ['Control, codicia, terquedad'] },
    5: { plus: ['Movimiento, oportunidades, creatividad'], minus: ['Inestabilidad, impulsos, vaivenes'] },
    6: { plus: ['Responsabilidad, estabilidad, familia'], minus: ["Agotamiento, rencor, 'cargo con todo'"] },
    7: { plus: ['Intuiciones, reevaluación, estrategia'], minus: ['Hermetismo, puestas a cero, rupturas'] },
    8: { plus: ['Dinero, carrera, gestión'], minus: ['Presión, control, celos'] },
    9: { plus: ['Cierre, madurez, balance'], minus: ['Rencores, presión, separaciones bruscas'] },
  },
  redFlags: { d7: 'Riesgo de puestas a cero bruscas', d8: 'Riesgo de presión y control', d9: 'Riesgo de separaciones bruscas', overload1: "Sobrecarga del 'Yo', conflictividad" },
  recs: {
    risk7: "No decidas nada decisivo por impulso. Un mes para una 'recomposición silenciosa'.",
    risk8: 'El poder, solo a través de reglas y acuerdos.',
    riskOverload1: 'Sueño, deporte, disciplina del habla. La toxicidad se intensifica.',
    riskDefault: 'Frena, no tomes decisiones bruscas.',
    neutral: 'Controla los impulsos, trabaja según el plan.',
    resource: 'Un mes con recursos. Puedes empezar lo nuevo y llegar a acuerdos.',
  },
};

export function getMonthlySet(lang: string): MonthlySet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
