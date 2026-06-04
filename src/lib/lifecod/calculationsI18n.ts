// EN/ES strings for calculations.ts (compatibility verdict text). ru is the fallback.

export type CalcStrings = {
  yearRisks: Record<number, string[]>;
  entryAllowed: string;
  entryNotRecommended: string;
  pair: { best: string; ok: string; temp: string; no: string; critical: string };
  interactionDefaultLove: (a: number, b: number) => string;
  interactionDefaultBiz: (a: number, b: number) => string;
  forecast: { stable: string; breakdown: string; crisis: string; recovery: string; manageable: string; newUnion: string };
  consDefault: (a: number, b: number) => string;
  consInterp: Record<'COMPATIBLE' | 'TENSE' | 'CONFLICT', { love: string; business: string }>;
  riskMap: Record<string, string>;
  recommendation: { highLove: string; highBiz: string; okLove: string; okBiz: string; noLove: string; noBiz: string };
};

const EN: CalcStrings = {
  yearRisks: {
    1: ['Ego', 'The partner is secondary', 'Focus on yourself'],
    3: ['Flirtation', 'Superficiality', 'Little consolidation'],
    4: ['If there is no readiness, it breaks'],
    5: ['Chaos', 'Triangles', 'Instability'],
    7: ['Reassembly', 'Swings', 'Detachment'],
    8: ['Pressure', 'Control', 'A toxic scenario'],
    9: ['The past must be closed'],
  },
  entryAllowed: 'Entry is allowed',
  entryNotRecommended: 'Entry is not recommended',
  pair: {
    best: 'Mutual readiness for a union',
    ok: 'Entry is possible with conditions',
    temp: 'One partner is not ready. A temporary union',
    no: 'Both partners are in unsuitable years',
    critical: 'Critically incompatible years',
  },
  interactionDefaultLove: (a, b) => `The combination of years ${a} and ${b} needs attention`,
  interactionDefaultBiz: (a, b) => `The combination of years ${a} and ${b} in business needs balance`,
  forecast: {
    stable: 'A stable period',
    breakdown: 'A high probability of a breakup',
    crisis: 'A year of crisis and testing of the union',
    recovery: 'A year of recovery and rethinking',
    manageable: 'An unstable but manageable period',
    newUnion: 'Readiness for new relationships',
  },
  consDefault: (a, b) => `Consciousnesses ${a} and ${b} require adaptation`,
  consInterp: {
    COMPATIBLE: { love: 'On the level of thinking the union is harmonious. The partners understand each other', business: 'A good understanding of business goals and approaches' },
    TENSE: { love: 'Tension in understanding. Conscious work on the relationship is needed', business: 'Different approaches to business. Clear agreements are needed' },
    CONFLICT: { love: 'A conflict of worldviews. Without deep work the union is unstable', business: 'A high risk of conflicts and a struggle for influence' },
  },
  riskMap: {
    '7_REBUILD': 'Reassembly of the personality',
    '8_CONTROL': 'Pressure and control',
    '5_CHAOS': 'Instability and chaos',
    '3_FLIRT': 'Superficiality',
    '1_EGO': 'Egocentrism',
  },
  recommendation: {
    highLove: 'The union has high potential. Developing the relationship is recommended',
    highBiz: 'The partnership is promising. The cooperation can be scaled',
    okLove: 'The union is possible with conditions. It is important to work on communication',
    okBiz: 'The partnership requires clear agreements and a distribution of roles',
    noLove: 'Right now is not the best time for a serious relationship. Waiting is recommended',
    noBiz: 'The partnership is risky. Postponing or reconsidering the terms is recommended',
  },
};

const ES: CalcStrings = {
  yearRisks: {
    1: ['Ego', 'La pareja es secundaria', 'Foco en uno mismo'],
    3: ['Coqueteo', 'Superficialidad', 'Poca consolidación'],
    4: ['Si no hay disposición, se rompe'],
    5: ['Caos', 'Triángulos', 'Inestabilidad'],
    7: ['Recomposición', 'Vaivenes', 'Distanciamiento'],
    8: ['Presión', 'Control', 'Un guion tóxico'],
    9: ['El pasado debe estar cerrado'],
  },
  entryAllowed: 'La entrada está permitida',
  entryNotRecommended: 'No se recomienda la entrada',
  pair: {
    best: 'Disposición mutua para una unión',
    ok: 'La entrada es posible con condiciones',
    temp: 'Un miembro no está listo. Una unión temporal',
    no: 'Ambos miembros están en años inadecuados',
    critical: 'Años críticamente incompatibles',
  },
  interactionDefaultLove: (a, b) => `La combinación de los años ${a} y ${b} requiere atención`,
  interactionDefaultBiz: (a, b) => `La combinación de los años ${a} y ${b} en los negocios requiere equilibrio`,
  forecast: {
    stable: 'Un periodo estable',
    breakdown: 'Una alta probabilidad de ruptura',
    crisis: 'Un año de crisis y prueba de la unión',
    recovery: 'Un año de recuperación y replanteamiento',
    manageable: 'Un periodo inestable pero manejable',
    newUnion: 'Disposición para nuevas relaciones',
  },
  consDefault: (a, b) => `Las conciencias ${a} y ${b} requieren adaptación`,
  consInterp: {
    COMPATIBLE: { love: 'A nivel del pensamiento la unión es armoniosa. Los miembros se entienden', business: 'Una buena comprensión de los objetivos y enfoques de negocio' },
    TENSE: { love: 'Tensión en la comprensión. Se requiere un trabajo consciente sobre la relación', business: 'Enfoques distintos hacia los negocios. Hacen falta acuerdos claros' },
    CONFLICT: { love: 'Un conflicto de cosmovisiones. Sin un trabajo profundo la unión es inestable', business: 'Un alto riesgo de conflictos y de lucha por la influencia' },
  },
  riskMap: {
    '7_REBUILD': 'Recomposición de la personalidad',
    '8_CONTROL': 'Presión y control',
    '5_CHAOS': 'Inestabilidad y caos',
    '3_FLIRT': 'Superficialidad',
    '1_EGO': 'Egocentrismo',
  },
  recommendation: {
    highLove: 'La unión tiene un alto potencial. Se recomienda desarrollar la relación',
    highBiz: 'La asociación es prometedora. Se puede escalar la cooperación',
    okLove: 'La unión es posible con condiciones. Es importante trabajar la comunicación',
    okBiz: 'La asociación requiere acuerdos claros y un reparto de roles',
    noLove: 'Ahora no es el mejor momento para una relación seria. Se recomienda esperar',
    noBiz: 'La asociación es arriesgada. Se recomienda posponerla o revisar las condiciones',
  },
};

export function getCalcStrings(lang: string): CalcStrings | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
