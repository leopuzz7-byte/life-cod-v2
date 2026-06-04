// EN/ES strings for personalAnalysis.ts (aggregator). ru is the fallback.

type GA = { behavior: string[]; minus: string[]; stop: string[]; whatToDo: string[] };

export type PAStrings = {
  ga: Record<number, GA>;
  warnings: Record<number, string>;
  intensity: Record<'SOFT' | 'TRANSFORM' | 'PRESSURE' | 'OVERHEAT', { label: string; interpretation: string }>;
  levels: Record<'LOW' | 'MEDIUM' | 'HIGH', string>;
  factors: {
    crisisYear: (py: number) => string;
    tenseYear: (py: number) => string;
    crisisPinnacle: (v: number) => string;
    hardLesson: (c: number) => string;
    tenseConsciousness: (c: number) => string;
    tenseActions: (a: number) => string;
    overheatSum: (s: number) => string;
    pressureSum: (s: number) => string;
    doubleCrisis: string;
  };
  recs: {
    year7: string; year8: string; year9: string; year5: string; year6: string;
    crisisPinnacle: string; hardLesson: string; overheat: string; doubleCrisis: string; favorable: string;
  };
  pinnacleCrisisRisks: string[];
  labels: {
    date: string; year: string; personalYear: string; chain: string; day: string; month: string;
    consciousness: string; actions: string; yearInActions: string; consciousnessNumber: string;
    actionsNumber: string; pinnacles: string; p1border: string; riskScore: string;
    nameYear: (n: number) => string; nameConsciousness: (n: number) => string;
    nameAction: (n: number) => string; namePinnacle: (n: number) => string;
    bond: (chain: string, core: string) => string;
  };
};

const EN: PAStrings = {
  ga: {
    1: { behavior: ['Acts independently', 'Makes decisions alone', 'Focuses on themselves'], minus: ["Ignores others' opinions", 'Pressures those around them'], stop: ['Stubbornness for principle', 'Refusing help'], whatToDo: ['Channel leadership constructively', "Take others' opinions into account"] },
    2: { behavior: ['Seeks partnership', 'Negotiates', 'Acts through dialogue'], minus: ["Dependence on others' opinions", 'Indecision'], stop: ['Submission for the sake of peace', 'Loss of one\'s own position'], whatToDo: ['Keep your own position', "Learn to say 'no'"] },
    3: { behavior: ['Communicates, presents', 'Builds connections', 'Expresses ideas'], minus: ['Many words — few deeds', 'Scatters themselves'], stop: ['Promises without fulfillment', 'Superficiality in action'], whatToDo: ['Record agreements in writing', 'Finish what you started'] },
    4: { behavior: ['Structures processes', 'Builds a foundation', 'Takes responsibility'], minus: ['Tenses up', 'Controls everything'], stop: ['Perfectionism to the point of paralysis', 'Rigidity without flexibility'], whatToDo: ['Delegate', 'Let the process run without control'] },
    5: { behavior: ['Experiments', 'Changes approach', 'Seeks the new'], minus: ['Chaos in action', 'Incompletion'], stop: ['Escaping responsibility', 'Changing direction every week'], whatToDo: ['Choose one direction', 'See it through to a result'] },
    6: { behavior: ['Cares for people', 'Takes on commitments', 'Stabilizes'], minus: ['Carries everything alone', 'Burns out'], stop: ['Self-sacrifice', 'Control through care'], whatToDo: ['Ask for help', "Don't forget about yourself"] },
    7: { behavior: ['Analyzes', 'Reviews strategy', 'Withdraws into themselves'], minus: ['Isolation', 'Distrust of others'], stop: ['Decision paralysis', 'Withdrawal from contacts'], whatToDo: ["Don't make abrupt decisions", 'Practice awareness'] },
    8: { behavior: ['Manages resources', 'Makes tough decisions', 'Focuses on the result'], minus: ['Pressure', 'Rigidity without empathy'], stop: ['Authoritarianism', 'Suppressing others for the goal'], whatToDo: ['Listen to feedback', 'Balance control and trust'] },
    9: { behavior: ['Completes cycles', 'Lets go of the old', 'Takes stock'], minus: ['Abrupt breakups', 'Emotional burnout'], stop: ['Leaving without explanation', 'Resetting without a plan'], whatToDo: ['Complete things gently', 'Prepare the ground for a new cycle'] },
  },
  warnings: {
    1: 'A tendency toward isolation when lived unconsciously',
    2: 'Risk of codependency and losing yourself in the partner',
    3: 'Risk of superficiality and unfulfilled promises',
    4: 'Risk of over-control and emotional blocking',
    5: 'Risk of chaos, scattering and unfinished business',
    6: 'Risk of hyper-responsibility and a sacrificial scenario',
    7: 'Risk of reserve, distrust and emotional coldness',
    8: 'Risk of authoritarianism and pressuring others',
    9: 'Risk of abrupt breaks and self-destructive behavior',
  },
  intensity: {
    SOFT: { label: 'Soft', interpretation: 'A period of calm development. The energies are harmonious, the pressure is minimal.' },
    TRANSFORM: { label: 'Transformation', interpretation: 'A period of active change. Old scenarios break down, the new takes shape.' },
    PRESSURE: { label: 'Pressure', interpretation: 'A high load. External pressure, the need to make decisions.' },
    OVERHEAT: { label: 'Overheat', interpretation: 'A system overload. The load must be reduced, otherwise — failures and crises.' },
  },
  levels: { LOW: 'Low risk', MEDIUM: 'Medium risk', HIGH: 'High risk' },
  factors: {
    crisisYear: (py) => `A crisis personal year (${py})`,
    tenseYear: (py) => `A tense year (${py})`,
    crisisPinnacle: (v) => `A crisis pinnacle (${v})`,
    hardLesson: (c) => `A hard lesson (Challenge = ${c})`,
    tenseConsciousness: (c) => `Tense consciousness (${c})`,
    tenseActions: (a) => `Tense actions (${a})`,
    overheatSum: (s) => `Overheat of the summary numbers (${s})`,
    pressureSum: (s) => `Pressure of the summary numbers (${s})`,
    doubleCrisis: 'Double crisis: year + pinnacle',
  },
  recs: {
    year7: "Don't start new projects. Analyze.",
    year8: "Control your finances. Don't pressure.",
    year9: "Complete the old. Don't return to the past.",
    year5: "Don't drop what you started. See it through to a result.",
    year6: "Delegate. Don't carry everything alone.",
    crisisPinnacle: "A crisis period of life — slow down, don't destroy.",
    hardLesson: 'The inner conflict is heightened — work with a psychologist.',
    overheat: 'Reduce the load. Prioritize.',
    doubleCrisis: '⚠️ An especially dangerous period. Minimum of changes.',
    favorable: 'A favorable period for development and new beginnings.',
  },
  pinnacleCrisisRisks: ['A crisis period', 'A high probability of transformation'],
  labels: {
    date: 'Date', year: 'Year', personalYear: 'Personal year', chain: 'Chain', day: 'Day', month: 'Month',
    consciousness: 'Consciousness', actions: 'Actions', yearInActions: 'Year in actions', consciousnessNumber: 'Consciousness number',
    actionsNumber: 'Actions number', pinnacles: 'Pinnacles', p1border: 'P1 boundary', riskScore: 'Risk Score',
    nameYear: (n) => `Year ${n}`, nameConsciousness: (n) => `Consciousness ${n}`,
    nameAction: (n) => `Action ${n}`, namePinnacle: (n) => `Pinnacle ${n}`,
    bond: (chain, core) => `Bond ${chain}: ${core}`,
  },
};

const ES: PAStrings = {
  ga: {
    1: { behavior: ['Actúa de forma autónoma', 'Toma decisiones solo', 'Se centra en sí mismo'], minus: ['Ignora la opinión ajena', 'Presiona a quienes le rodean'], stop: ['Terquedad por principio', 'Rechazo de la ayuda'], whatToDo: ['Canalizar el liderazgo de forma constructiva', 'Tener en cuenta la opinión ajena'] },
    2: { behavior: ['Busca la asociación', 'Negocia', 'Actúa a través del diálogo'], minus: ['Dependencia de la opinión ajena', 'Indecisión'], stop: ['Sumisión por la paz', 'Pérdida de la propia posición'], whatToDo: ['Mantener tu posición', "Aprender a decir 'no'"] },
    3: { behavior: ['Se comunica, presenta', 'Crea vínculos', 'Expresa ideas'], minus: ['Muchas palabras, pocos hechos', 'Se dispersa'], stop: ['Promesas sin cumplir', 'Superficialidad en la acción'], whatToDo: ['Registrar los acuerdos por escrito', 'Terminar lo empezado'] },
    4: { behavior: ['Estructura los procesos', 'Construye un fundamento', 'Asume responsabilidad'], minus: ['Se tensa', 'Lo controla todo'], stop: ['Perfeccionismo hasta la parálisis', 'Rigidez sin flexibilidad'], whatToDo: ['Delegar', 'Dejar que el proceso fluya sin control'] },
    5: { behavior: ['Experimenta', 'Cambia de enfoque', 'Busca lo nuevo'], minus: ['Caos en la acción', 'Lo inconcluso'], stop: ['Huir de la responsabilidad', 'Cambiar de dirección cada semana'], whatToDo: ['Elegir una dirección', 'Llevarla hasta el resultado'] },
    6: { behavior: ['Cuida de la gente', 'Asume compromisos', 'Estabiliza'], minus: ['Carga con todo', 'Se agota'], stop: ['Sacrificio', 'Control a través del cuidado'], whatToDo: ['Pedir ayuda', 'No olvidarse de uno mismo'] },
    7: { behavior: ['Analiza', 'Revisa la estrategia', 'Se repliega en sí mismo'], minus: ['Aislamiento', 'Desconfianza de los demás'], stop: ['Parálisis de decisiones', 'Alejamiento de los contactos'], whatToDo: ['No tomar decisiones bruscas', 'Practicar la conciencia plena'] },
    8: { behavior: ['Gestiona recursos', 'Toma decisiones duras', 'Se centra en el resultado'], minus: ['Presión', 'Rigidez sin empatía'], stop: ['Autoritarismo', 'Someter a otros por el objetivo'], whatToDo: ['Escuchar la retroalimentación', 'Equilibrar el control y la confianza'] },
    9: { behavior: ['Cierra ciclos', 'Suelta lo viejo', 'Hace balance'], minus: ['Rupturas bruscas', 'Agotamiento emocional'], stop: ['Marcharse sin explicación', 'Puesta a cero sin plan'], whatToDo: ['Cerrar con suavidad', 'Preparar el terreno para un nuevo ciclo'] },
  },
  warnings: {
    1: 'Tendencia al aislamiento si se vive de forma inconsciente',
    2: 'Riesgo de codependencia y de perderse en la pareja',
    3: 'Riesgo de superficialidad y de promesas incumplidas',
    4: 'Riesgo de hipercontrol y de bloqueo emocional',
    5: 'Riesgo de caos, dispersión y asuntos sin terminar',
    6: 'Riesgo de hiperresponsabilidad y de un guion de sacrificio',
    7: 'Riesgo de hermetismo, desconfianza y frialdad emocional',
    8: 'Riesgo de autoritarismo y de presionar a los demás',
    9: 'Riesgo de cortes bruscos y de comportamiento autodestructivo',
  },
  intensity: {
    SOFT: { label: 'Suave', interpretation: 'Un periodo de desarrollo tranquilo. Las energías son armoniosas, la presión es mínima.' },
    TRANSFORM: { label: 'Transformación', interpretation: 'Un periodo de cambios activos. Los viejos guiones se rompen, se forma lo nuevo.' },
    PRESSURE: { label: 'Presión', interpretation: 'Una carga alta. Presión externa, la necesidad de tomar decisiones.' },
    OVERHEAT: { label: 'Sobrecalentamiento', interpretation: 'Una sobrecarga del sistema. Hay que reducir la carga, de lo contrario: fallos y crisis.' },
  },
  levels: { LOW: 'Riesgo bajo', MEDIUM: 'Riesgo medio', HIGH: 'Riesgo alto' },
  factors: {
    crisisYear: (py) => `Un año personal de crisis (${py})`,
    tenseYear: (py) => `Un año tenso (${py})`,
    crisisPinnacle: (v) => `Un pináculo de crisis (${v})`,
    hardLesson: (c) => `Una lección difícil (Challenge = ${c})`,
    tenseConsciousness: (c) => `Conciencia tensa (${c})`,
    tenseActions: (a) => `Acciones tensas (${a})`,
    overheatSum: (s) => `Sobrecalentamiento de los números sumarios (${s})`,
    pressureSum: (s) => `Presión de los números sumarios (${s})`,
    doubleCrisis: 'Doble crisis: año + pináculo',
  },
  recs: {
    year7: 'No empieces nuevos proyectos. Analiza.',
    year8: 'Controla las finanzas. No presiones.',
    year9: 'Cierra lo viejo. No vuelvas al pasado.',
    year5: 'No abandones lo empezado. Llévalo hasta el resultado.',
    year6: 'Delega. No cargues con todo.',
    crisisPinnacle: 'Un periodo de crisis vital: frena, no destruyas.',
    hardLesson: 'El conflicto interior está agudizado: trabaja con un psicólogo.',
    overheat: 'Reduce la carga. Prioriza.',
    doubleCrisis: '⚠️ Un periodo especialmente peligroso. Mínimo de cambios.',
    favorable: 'Un periodo favorable para el desarrollo y los nuevos comienzos.',
  },
  pinnacleCrisisRisks: ['Un periodo de crisis', 'Una alta probabilidad de transformación'],
  labels: {
    date: 'Fecha', year: 'Año', personalYear: 'Año personal', chain: 'Cadena', day: 'Día', month: 'Mes',
    consciousness: 'Conciencia', actions: 'Acciones', yearInActions: 'Año en acciones', consciousnessNumber: 'Número de conciencia',
    actionsNumber: 'Número de acciones', pinnacles: 'Pináculos', p1border: 'Límite de P1', riskScore: 'Risk Score',
    nameYear: (n) => `Año ${n}`, nameConsciousness: (n) => `Conciencia ${n}`,
    nameAction: (n) => `Acción ${n}`, namePinnacle: (n) => `Pináculo ${n}`,
    bond: (chain, core) => `Vínculo ${chain}: ${core}`,
  },
};

export function getPAStrings(lang: string): PAStrings | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
