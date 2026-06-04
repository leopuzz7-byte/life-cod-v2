// EN/ES translations for pinnacles.ts (pinnacle/challenge descriptions, crisis labels, recommendations).
// The Russian base stays as fallback.

type Pinnacle = { name: string; essence: string; lovePlus: string[]; loveMinus: string[]; businessPlus: string[]; businessMinus: string[] };
type Challenge = { name: string; essence: string; inMinus: string[]; inPlus: string[]; crisisAdvice: string[] };

export const pinnacleEN: Record<string, Partial<Pinnacle>> = {
  1: { name: 'Beginning / Personal power', essence: 'New beginnings, initiative, leadership', lovePlus: ['New relationships', 'Initiative, passion', 'A desire to lead, to take responsibility'], loveMinus: ['Selfishness', "'I'll do it myself, you're in the way'", 'A struggle for leadership'], businessPlus: ['Launching projects', 'Personal brand', 'Entrepreneurship'], businessMinus: ['A solo game', 'Conflict with partners', 'Impulsive decisions'] },
  2: { name: 'Partnership / Connection', essence: 'Money and status come through people, union, team', lovePlus: ['Union, marriage', 'The ability to listen', 'Emotional closeness'], loveMinus: ['Resentments', 'Dependence', 'Manipulation through feelings'], businessPlus: ['Partnership projects', 'Service, clients', 'Negotiations'], businessMinus: ['Fear of conflict', "Dependence on others' opinions", 'Passivity'] },
  3: { name: 'Communication / Society', essence: 'Communication, acquaintances, self-expression', lovePlus: ['Lightness', 'Flirtation', 'The joy of communication'], loveMinus: ['Superficiality', 'Triangles', 'Words without action'], businessPlus: ['Media, blogging', 'Teaching', 'Sales'], businessMinus: ['Scattering', 'Chaos', 'Not following through'] },
  4: { name: 'Structure / Foundation', essence: 'Building, discipline, long-term projects', lovePlus: ['Reliability', 'A shared household', 'Stability'], loveMinus: ['Routine', 'Control', 'Emotional coldness'], businessPlus: ['System', 'Processes', 'Long-term projects'], businessMinus: ['Rigidity', 'Fear of change', 'Micromanagement'] },
  5: { name: 'Freedom / Change', essence: 'Renewal, movement, breaking out of routine', lovePlus: ['Renewal', 'Passion', 'Leaving toxic bonds'], loveMinus: ['Infidelity', 'Escaping responsibility', 'Instability'], businessPlus: ['Growth', 'New markets', 'Flexibility'], businessMinus: ['Recklessness', 'Chaotic decisions', 'Missed deadlines'] },
  6: { name: 'Family / Responsibility', essence: 'Care, home, stability, union', lovePlus: ['Marriage', 'Children', 'Care'], loveMinus: ['Over-control', 'Duty instead of love', 'Manipulation through care'], businessPlus: ['Managing people', 'Service', 'Stable income'], businessMinus: ['Burnout', "'I carry everyone'", 'Inability to delegate'] },
  7: { name: 'Transformation / Growth crisis', essence: 'Reassembly, re-evaluation, resetting the old', lovePlus: ['Awareness', 'Depth', 'Honest conversations'], loveMinus: ['Breakups', 'Distance', 'Loneliness', 'Coldness'], businessPlus: ['Strategy', 'Learning', 'Reassembly'], businessMinus: ['Withdrawal into isolation', 'Doubts', 'Sabotage'] },
  8: { name: 'Power / Money / Control', essence: 'Scale, management, a struggle for resources', lovePlus: ['Protection', 'Strength', 'A mature partner'], loveMinus: ['Abuse', 'Possessiveness', 'Pressure', 'Jealousy'], businessPlus: ['Scale', 'Capital', 'Management'], businessMinus: ['Greed', 'Power for power\'s sake', 'Conflicts'] },
  9: { name: 'Completion / Reset', essence: 'Results, closing cycles, preparing for the new', lovePlus: ['Maturity', 'Parting without war', 'A new stage'], loveMinus: ['Abrupt breakups', 'Emotional abuse', "'I disappeared'"], businessPlus: ['Scale', 'Public visibility', 'Mentorship'], businessMinus: ['Burnout', 'Closing projects', 'Destruction from fatigue'] },
};
export const pinnacleES: Record<string, Partial<Pinnacle>> = {
  1: { name: 'Comienzo / Fuerza personal', essence: 'Nuevos comienzos, iniciativa, liderazgo', lovePlus: ['Nuevas relaciones', 'Iniciativa, pasión', 'Deseo de guiar, de asumir responsabilidad'], loveMinus: ['Egoísmo', "'Lo hago yo, tú estorbas'", 'Lucha por el liderazgo'], businessPlus: ['Lanzar proyectos', 'Marca personal', 'Emprendimiento'], businessMinus: ['Un juego en solitario', 'Conflicto con los socios', 'Decisiones impulsivas'] },
  2: { name: 'Asociación / Vínculo', essence: 'El dinero y el estatus llegan a través de las personas, la unión, el equipo', lovePlus: ['Unión, matrimonio', 'Capacidad de escuchar', 'Cercanía emocional'], loveMinus: ['Rencores', 'Dependencia', 'Manipulación con los sentimientos'], businessPlus: ['Proyectos de asociación', 'Servicio, clientes', 'Negociaciones'], businessMinus: ['Miedo al conflicto', 'Dependencia de la opinión ajena', 'Pasividad'] },
  3: { name: 'Comunicación / Sociedad', essence: 'Comunicación, encuentros, autoexpresión', lovePlus: ['Ligereza', 'Coqueteo', 'La alegría de comunicarse'], loveMinus: ['Superficialidad', 'Triángulos', 'Palabras sin hechos'], businessPlus: ['Medios, blogs', 'Enseñanza', 'Ventas'], businessMinus: ['Dispersión', 'Caos', 'No llevar las cosas hasta el final'] },
  4: { name: 'Estructura / Fundamento', essence: 'Construcción, disciplina, proyectos a largo plazo', lovePlus: ['Fiabilidad', 'Un hogar compartido', 'Estabilidad'], loveMinus: ['Rutina', 'Control', 'Frialdad emocional'], businessPlus: ['Sistema', 'Procesos', 'Proyectos a largo plazo'], businessMinus: ['Rigidez', 'Miedo a los cambios', 'Microgestión'] },
  5: { name: 'Libertad / Cambios', essence: 'Renovación, movimiento, salir de la rutina', lovePlus: ['Renovación', 'Pasión', 'Salir de vínculos tóxicos'], loveMinus: ['Infidelidades', 'Huir de la responsabilidad', 'Inestabilidad'], businessPlus: ['Crecimiento', 'Nuevos mercados', 'Flexibilidad'], businessMinus: ['Aventurerismo', 'Decisiones caóticas', 'Plazos incumplidos'] },
  6: { name: 'Familia / Responsabilidad', essence: 'Cuidado, hogar, estabilidad, unión', lovePlus: ['Matrimonio', 'Hijos', 'Cuidado'], loveMinus: ['Hipercontrol', 'Deber en lugar de amor', 'Manipulación con el cuidado'], businessPlus: ['Gestión de personas', 'Servicio', 'Ingresos estables'], businessMinus: ['Agotamiento', "'Cargo con todos'", 'Incapacidad de delegar'] },
  7: { name: 'Transformación / Crisis de crecimiento', essence: 'Recomposición, reevaluación, puesta a cero de lo viejo', lovePlus: ['Conciencia', 'Profundidad', 'Conversaciones honestas'], loveMinus: ['Rupturas', 'Distancia', 'Soledad', 'Frialdad'], businessPlus: ['Estrategia', 'Aprendizaje', 'Recomposición'], businessMinus: ['Refugio en el aislamiento', 'Dudas', 'Sabotaje'] },
  8: { name: 'Poder / Dinero / Control', essence: 'Escala, gestión, lucha por los recursos', lovePlus: ['Protección', 'Fuerza', 'Una pareja madura'], loveMinus: ['Abuso', 'Posesividad', 'Presión', 'Celos'], businessPlus: ['Escala', 'Capital', 'Gestión'], businessMinus: ['Codicia', 'Poder por el poder', 'Conflictos'] },
  9: { name: 'Cierre / Puesta a cero', essence: 'Balance, cierre de ciclos, preparación para lo nuevo', lovePlus: ['Madurez', 'Despedida sin guerra', 'Una nueva etapa'], loveMinus: ['Separaciones bruscas', 'Maltrato emocional', "'Desaparecí'"], businessPlus: ['Escala', 'Visibilidad pública', 'Mentoría'], businessMinus: ['Agotamiento', 'Cierre de proyectos', 'Destrucción por cansancio'] },
};

export const challengeEN: Record<string, Partial<Challenge>> = {
  0: { name: 'A complex lesson', essence: 'There is no single problem. The trials depend on your choices.', inMinus: ['A sense of chaos', "'I'm thrown from side to side'", 'No anchor'], inPlus: ['High adaptability', 'Strong intuition', 'The ability to get out of any situation'], crisisAdvice: ['Create structure and rituals', "Otherwise life will 'tear you apart'"] },
  1: { name: 'Conflict of Self / World', essence: 'A struggle for the right to be yourself.', inMinus: ['Loneliness', "A sense of 'me against everyone'", 'A struggle for the right to be yourself'], inPlus: ['Leadership', 'The ability to go your own way', 'Inner strength'], crisisAdvice: ["Don't prove yourself", "Don't fight", 'Choose rather than defend'] },
  2: { name: 'Dependence and boundaries', essence: 'Fear of loneliness and dissolving into another.', inMinus: ['Fear of loneliness', 'Dissolving into the partner', 'Manipulation'], inPlus: ['Empathy', 'Partnership', 'The ability to negotiate'], crisisAdvice: ["Learn to say 'no'", "Don't rescue", "Don't sacrifice yourself"] },
  3: { name: 'The word and self-expression', essence: 'Silencing yourself, devaluing yourself.', inMinus: ['Silencing yourself', 'Self-devaluation', 'Psychosomatics'], inPlus: ['A voice', 'Influence', 'Public presence'], crisisAdvice: ['Speak', 'Write', 'Bring your thoughts out'] },
  4: { name: 'Fear of losing control', essence: 'Tension, fear of change.', inMinus: ['Tension', 'Fear of change', 'Rigidity'], inPlus: ['Discipline', 'Resilience', 'Foundation'], crisisAdvice: ["Don't hold on to the old", 'Allow the structure to change'] },
  5: { name: 'Freedom vs Responsibility', essence: 'Escape, addictions, chaos.', inMinus: ['Escape', 'Addictions', 'Chaos'], inPlus: ['Flexibility', 'Growth', 'New opportunities'], crisisAdvice: ["Don't run away", "Change the form, don't destroy everything"] },
  6: { name: 'Victimhood and hyper-responsibility', essence: "'I must', burnout, control.", inMinus: ["'I must'", 'Burnout', 'Control'], inPlus: ['Care', 'Mature responsibility', 'Leadership'], crisisAdvice: ['Delegate', 'Stop rescuing', 'Choose yourself'] },
  7: { name: 'Crisis of meaning', essence: 'Loneliness, depression, abrupt breaks.', inMinus: ['Loneliness', 'Depression', 'Abrupt breaks'], inPlus: ['Transformation', 'Wisdom', 'Growth through awareness'], crisisAdvice: ["Don't make abrupt decisions", "Don't sever ties impulsively", 'Go into the depth'] },
  8: { name: 'Power and control', essence: 'Abuse, pressure, fear of losing power.', inMinus: ['Abuse', 'Pressure', 'Fear of losing power'], inPlus: ['Strength', 'Protection', 'Management'], crisisAdvice: ['Let go of control', "Don't pressure", 'Learn to negotiate'] },
  9: { name: 'Endings and resets', essence: 'Destruction, abrupt breakups.', inMinus: ['Destruction', 'Abrupt breakups', 'Emotional abuse'], inPlus: ['Completion', 'Maturity', 'A new level'], crisisAdvice: ['Close things cleanly', "Don't take revenge", "Don't disappear"] },
};
export const challengeES: Record<string, Partial<Challenge>> = {
  0: { name: 'Una lección compleja', essence: 'No hay un solo problema. Las pruebas dependen de tus elecciones.', inMinus: ['Sensación de caos', "'Me lanzan de un lado a otro'", 'Falta de apoyo'], inPlus: ['Alta adaptabilidad', 'Intuición fuerte', 'Capacidad de salir de cualquier situación'], crisisAdvice: ['Crear estructura y rituales', "De lo contrario la vida te 'desgarrará'"] },
  1: { name: 'Conflicto Yo / Mundo', essence: 'Una lucha por el derecho a ser uno mismo.', inMinus: ['Soledad', "Sensación de 'yo contra todos'", 'Lucha por el derecho a ser uno mismo'], inPlus: ['Liderazgo', 'Capacidad de seguir tu propio camino', 'Fuerza interior'], crisisAdvice: ['No demostrar', 'No luchar', 'Elegir en vez de defenderse'] },
  2: { name: 'Dependencia y límites', essence: 'Miedo a la soledad y disolverse en el otro.', inMinus: ['Miedo a la soledad', 'Disolverse en la pareja', 'Manipulaciones'], inPlus: ['Empatía', 'Asociación', 'Capacidad de negociar'], crisisAdvice: ["Aprender a decir 'no'", 'No rescatar', 'No sacrificarse'] },
  3: { name: 'La palabra y la autoexpresión', essence: 'Callarse, desvalorizarse.', inMinus: ['Callarse', 'Autodesvalorización', 'Psicosomática'], inPlus: ['Una voz', 'Influencia', 'Presencia pública'], crisisAdvice: ['Hablar', 'Escribir', 'Sacar los pensamientos afuera'] },
  4: { name: 'Miedo a perder el control', essence: 'Tensión, miedo a los cambios.', inMinus: ['Tensión', 'Miedo a los cambios', 'Rigidez'], inPlus: ['Disciplina', 'Resiliencia', 'Fundamento'], crisisAdvice: ['No aferrarse a lo viejo', 'Permitir que la estructura cambie'] },
  5: { name: 'Libertad vs Responsabilidad', essence: 'Huida, adicciones, caos.', inMinus: ['Huida', 'Adicciones', 'Caos'], inPlus: ['Flexibilidad', 'Crecimiento', 'Nuevas oportunidades'], crisisAdvice: ['No huir', 'Cambiar la forma, no destruirlo todo'] },
  6: { name: 'Victimismo e hiperresponsabilidad', essence: "'Debo', agotamiento, control.", inMinus: ["'Debo'", 'Agotamiento', 'Control'], inPlus: ['Cuidado', 'Responsabilidad madura', 'Liderazgo'], crisisAdvice: ['Delegar', 'Dejar de rescatar', 'Elegirte a ti'] },
  7: { name: 'Crisis de sentido', essence: 'Soledad, depresión, cortes bruscos.', inMinus: ['Soledad', 'Depresión', 'Cortes bruscos'], inPlus: ['Transformación', 'Sabiduría', 'Crecimiento a través de la conciencia'], crisisAdvice: ['No tomar decisiones bruscas', 'No cortar vínculos de forma impulsiva', 'Ir a la profundidad'] },
  8: { name: 'Poder y control', essence: 'Abuso, presión, miedo a perder el poder.', inMinus: ['Abuso', 'Presión', 'Miedo a perder el poder'], inPlus: ['Fuerza', 'Protección', 'Gestión'], crisisAdvice: ['Soltar el control', 'No presionar', 'Aprender a negociar'] },
  9: { name: 'Finales y puestas a cero', essence: 'Destrucción, rupturas bruscas.', inMinus: ['Destrucción', 'Rupturas bruscas', 'Maltrato emocional'], inPlus: ['Cierre', 'Madurez', 'Un nuevo nivel'], crisisAdvice: ['Cerrar de forma ecológica', 'No vengarse', 'No desaparecer'] },
};

export function getPinnacleSet(lang: string): Record<string, Partial<Pinnacle>> | null {
  if (lang === 'en') return pinnacleEN;
  if (lang === 'es') return pinnacleES;
  return null;
}
export function getChallengeSet(lang: string): Record<string, Partial<Challenge>> | null {
  if (lang === 'en') return challengeEN;
  if (lang === 'es') return challengeES;
  return null;
}

// ----- Crisis labels & descriptions -----
type CrisisKey = 'reset' | 'active' | 'tension' | 'lessonCrisis' | 'innerTension' | 'stable';
const crisisStrings: Record<'en' | 'es', Record<CrisisKey, { label: string; description: string }>> = {
  en: {
    reset: { label: 'RESET', description: 'The finale. If not done consciously — through losses.' },
    active: { label: 'ACTIVE CRISIS', description: 'A turning point, pressure, risk of destruction.' },
    tension: { label: 'TENSION', description: 'The old is cracking, but the person still holds on.' },
    lessonCrisis: { label: 'CRISIS OF THE LESSON', description: 'An inner conflict sharpened by events.' },
    innerTension: { label: 'INNER TENSION', description: 'The lesson makes itself felt.' },
    stable: { label: 'STABLE', description: 'A period of calm development.' },
  },
  es: {
    reset: { label: 'PUESTA A CERO', description: 'El final. Si no es consciente, a través de pérdidas.' },
    active: { label: 'CRISIS ACTIVA', description: 'Un punto de inflexión, presión, riesgo de destrucción.' },
    tension: { label: 'TENSIÓN', description: 'Lo viejo cruje, pero la persona aún aguanta.' },
    lessonCrisis: { label: 'CRISIS DE LA LECCIÓN', description: 'Un conflicto interior agudizado por los acontecimientos.' },
    innerTension: { label: 'TENSIÓN INTERIOR', description: 'La lección se hace sentir.' },
    stable: { label: 'ESTABLE', description: 'Un periodo de desarrollo tranquilo.' },
  },
};
export function getCrisisStrings(lang: string, key: CrisisKey): { label: string; description: string } | null {
  if (lang === 'en' || lang === 'es') return crisisStrings[lang][key];
  return null;
}

// ----- Crisis recommendations -----
type Recs = { level0: string; fallback: string; year9: string; p7: string[]; p8: string[]; p9: string[] };
const recStrings: Record<'en' | 'es', Recs> = {
  en: {
    level0: 'A favorable period for development and new beginnings.',
    fallback: 'Slow down and reduce the load.',
    year9: 'Prepare for a new cycle.',
    p7: ["Don't start new relationships.", "Don't make decisions on emotions.", 'Complete the old gently.'],
    p8: ["Don't pressure.", 'Watch your boundaries.', 'Work with control and money.'],
    p9: ['Complete things.', "Don't return to the past.", 'Let go without revenge.'],
  },
  es: {
    level0: 'Un periodo favorable para el desarrollo y los nuevos comienzos.',
    fallback: 'Frena y reduce la carga.',
    year9: 'Prepárate para un nuevo ciclo.',
    p7: ['No empieces nuevas relaciones.', 'No tomes decisiones desde las emociones.', 'Cierra lo viejo con suavidad.'],
    p8: ['No presiones.', 'Vigila tus límites.', 'Trabaja el control y el dinero.'],
    p9: ['Cierra las cosas.', 'No vuelvas al pasado.', 'Suelta sin venganza.'],
  },
};
export function getRecStrings(lang: string): Recs | null {
  if (lang === 'en' || lang === 'es') return recStrings[lang];
  return null;
}
