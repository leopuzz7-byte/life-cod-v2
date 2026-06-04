// EN/ES overlays for lifecod/data.ts dictionaries.
// makeLocalized wraps a Russian base dict in a Proxy: on key access it merges the
// language overlay (en/es) over the Russian base, so untranslated fields fall back
// to Russian and consumers keep using `dict[key]` unchanged.

import i18n from "@/i18n";

export function makeLocalized<T extends object>(
  ru: Record<string, T>,
  en: Record<string, Partial<T>>,
  es: Record<string, Partial<T>>
): Record<string, T> {
  return new Proxy(ru, {
    get(target, prop: string | symbol) {
      const base = (target as Record<string | symbol, unknown>)[prop];
      const lang = i18n.language;
      if ((lang !== "en" && lang !== "es") || typeof base !== "object" || base === null) {
        return base;
      }
      const overlay = (lang === "en" ? en : es)[prop as string];
      return overlay ? { ...(base as object), ...(overlay as object) } : base;
    },
  }) as Record<string, T>;
}

// ============= CONSCIOUSNESS (1-9) =============
type Cons = { name: string; core: string; inPlus: string; inMinus: string; inRelationships: string; inBusiness: string };
export const consciousnessEN: Record<string, Partial<Cons>> = {
  1: { name: "Initiator", core: "'I myself', independence, leadership", inPlus: "Leadership, independence, decision-making", inMinus: "Stubbornness, self-centeredness, inability to hear others", inRelationships: "Wants to run the process, copes poorly with outside pressure", inBusiness: "Launches projects, keeps discipline, a good operational manager" },
  2: { name: "Partner", core: "Sensitivity, dialogue, dependence on a partner", inPlus: "Flexibility, the ability to listen, diplomacy", inMinus: "Dependence, indecision, fear of loss", inRelationships: "Needs a couple, oriented toward 'we', sensitive", inBusiness: "A good negotiator, a team player" },
  3: { name: "Communicator", core: "Emotions, the word, communication", inPlus: "The ability to express thoughts, creativity, optimism", inMinus: "Promises but doesn't deliver; superficiality", inRelationships: "Talks a lot, analyzes, discusses — 'let's talk'", inBusiness: "Ideas, presentations, client service" },
  4: { name: "Support", core: "Control, logic, structure", inPlus: "Method, responsibility, reliability", inMinus: "Rigidity, tension, anxiety, pressure", inRelationships: "Keeps the household, structure, stability — 'it has to be this way'", inBusiness: "Process management, financial control, order" },
  5: { name: "The Free One", core: "Freedom, change, experience", inPlus: "Adaptability, courage, love of experiments", inMinus: "Escape, instability, irresponsibility", inRelationships: "Enters easily, loves movement, can't stand limits — 'don't restrict me'", inBusiness: "Startups, crisis management, but holds routine poorly" },
  6: { name: "The Family One", core: "Care, family, responsibility for loved ones", inPlus: "Caring, empathy, loyalty", inMinus: "Control disguised as care, holding grudges, expecting gratitude", inRelationships: "Oriented toward home, care, duty — 'I do it for us'", inBusiness: "A reliable executor, holds the team together, stabilizes processes" },
  7: { name: "The Closed One", core: "Reserve, analysis, transformation", inPlus: "Deep analysis, strategic thinking, self-sufficiency", inMinus: "Coldness, isolation, distrust", inRelationships: "Takes a long time to size you up, doesn't let you in right away — 'I need time'", inBusiness: "An analyst, a strategist, but works poorly in a team" },
  8: { name: "The Controller", core: "Power, pressure, resources", inPlus: "A strategist, knows how to manage people and money", inMinus: "Pressure, devaluing feelings, 'it'll be as I said'", inRelationships: "Manages, sets the rules, checks — 'it'll be my way'", inBusiness: "A strong manager, financial control, not sentimental" },
  9: { name: "The Finisher", core: "Completion, the bottom line, wisdom", inPlus: "Knows how to finish, doesn't cling to the dead, principled", inMinus: "Abrupt breakups, emotional burnout, cynicism", inRelationships: "Enters after crises, carries experience — 'I've already been through a lot'", inBusiness: "Closes unprofitable areas, doesn't hold on to dead projects" },
};
export const consciousnessES: Record<string, Partial<Cons>> = {
  1: { name: "Iniciador", core: "'Yo mismo', autonomía, liderazgo", inPlus: "Liderazgo, autonomía, toma de decisiones", inMinus: "Terquedad, egocentrismo, incapacidad de escuchar a los demás", inRelationships: "Quiere dirigir el proceso, lleva mal la presión externa", inBusiness: "Lanza proyectos, mantiene la disciplina, buen gestor operativo" },
  2: { name: "Compañero", core: "Sensibilidad, diálogo, dependencia de la pareja", inPlus: "Flexibilidad, capacidad de escuchar, diplomacia", inMinus: "Dependencia, indecisión, miedo a la pérdida", inRelationships: "Necesita una pareja, orientado al 'nosotros', sensible", inBusiness: "Buen negociador, jugador de equipo" },
  3: { name: "Comunicador", core: "Emociones, la palabra, la comunicación", inPlus: "Capacidad de expresar ideas, creatividad, optimismo", inMinus: "Promete, pero no cumple; superficialidad", inRelationships: "Habla mucho, analiza, discute — 'hablemos'", inBusiness: "Ideas, presentaciones, atención al cliente" },
  4: { name: "Sostén", core: "Control, lógica, estructura", inPlus: "Método, responsabilidad, fiabilidad", inMinus: "Rigidez, tensión, ansiedad, presión", inRelationships: "Mantiene el hogar, la estructura, la estabilidad — 'tiene que ser así'", inBusiness: "Gestión de procesos, control financiero, orden" },
  5: { name: "El Libre", core: "Libertad, cambios, experiencia", inPlus: "Adaptabilidad, valentía, amor por los experimentos", inMinus: "Huida, inestabilidad, irresponsabilidad", inRelationships: "Entra con facilidad, ama el movimiento, no tolera los límites — 'no me restrinjas'", inBusiness: "Startups, gestión de crisis, pero lleva mal la rutina" },
  6: { name: "El Familiar", core: "Cuidado, familia, responsabilidad por los seres queridos", inPlus: "Solicitud, empatía, lealtad", inMinus: "Control disfrazado de cuidado, rencor, esperar gratitud", inRelationships: "Orientado al hogar, el cuidado, el deber — 'lo hago por nosotros'", inBusiness: "Ejecutor fiable, mantiene unido al equipo, estabiliza los procesos" },
  7: { name: "El Cerrado", core: "Hermetismo, análisis, transformación", inPlus: "Análisis profundo, pensamiento estratégico, autosuficiencia", inMinus: "Frialdad, aislamiento, desconfianza", inRelationships: "Tarda en evaluarte, no te deja entrar enseguida — 'necesito tiempo'", inBusiness: "Analista, estratega, pero trabaja mal en equipo" },
  8: { name: "El Controlador", core: "Poder, presión, recursos", inPlus: "Estratega, sabe gestionar personas y dinero", inMinus: "Presión, desvalorizar los sentimientos, 'será como yo diga'", inRelationships: "Gestiona, marca las reglas, comprueba — 'será a mi manera'", inBusiness: "Un gestor fuerte, control financiero, poco sentimental" },
  9: { name: "El que Cierra", core: "Cierre, balance, sabiduría", inPlus: "Sabe cerrar, no se aferra a lo muerto, con principios", inMinus: "Rupturas bruscas, agotamiento emocional, cinismo", inRelationships: "Entra tras las crisis, trae experiencia — 'ya he pasado por mucho'", inBusiness: "Cierra las áreas no rentables, no se aferra a los proyectos muertos" },
};

// ============= ACTIONS (0-9) =============
type Act = { name: string; core: string; inPlus: string; inMinus: string; riskScenarios: string[]; inRelationships: string; inBusiness: string };
export const actionEN: Record<string, Partial<Act>> = {
  0: { name: "The Adaptive", core: "Emptiness of form, flexibility, mirroring", inPlus: "Learning ability, adaptation, the ability to fit in", inMinus: "Loss of self, dependence, copying others' scripts", riskScenarios: ["Victim — lives by others' goals", "Adaptive lying — says what people want to hear", "Lives someone else's life"], inRelationships: "Adapts to the partner, but may dissolve and lose boundaries", inBusiness: "Depends on the environment and partners, shaped by external conditions" },
  1: { name: "The Leader", core: "'I myself', impulse, initiative", inPlus: "Leadership, quick decisions", inMinus: "Ego, pressure, rigid control", riskScenarios: ["Authoritarianism", "Inability to delegate"], inRelationships: "Leads the relationship, but the partner may feel secondary", inBusiness: "Good at the start of a project, delegates poorly" },
  2: { name: "The Diplomat", core: "Dialogue, cooperation, compromise", inPlus: "Agreements, teamwork", inMinus: "Dependence, over-patience, inability to say 'no'", riskScenarios: ["Codependency", "Self-sacrifice"], inRelationships: "Seeks harmony, but may tolerate the toxic for the sake of peace", inBusiness: "A good negotiator, but may yield on their own interests" },
  3: { name: "The Expresser", core: "The word, promises, agreements", inPlus: "The ability to negotiate, creativity", inMinus: "Manipulation, lies, promises without action", riskScenarios: ["Psychological fraud", "Double meanings", "'I said it — you misunderstood'"], inRelationships: "Talks a lot, but may not back words with action", inBusiness: "Sales, PR, but risk of unfulfilled commitments" },
  4: { name: "The Builder", core: "Control, frameworks, order, system", inPlus: "Reliability, sees things through to a result", inMinus: "Pressure, rigidity, coldness", riskScenarios: ["Victim scenario — carries everything alone, then breaks the system", "Rigid control"], inRelationships: "Acts rather than talks; holds the household, the support, the money", inBusiness: "A strategic builder, takes responsibility" },
  5: { name: "The Seeker", core: "Change, movement, experiment", inPlus: "Flexibility, the ability to break out of routine", inMinus: "Chaos, breaking commitments, escape", riskScenarios: ["Instability", "Infidelity", "Quits halfway"], inRelationships: "Needs freedom, can't stand routine", inBusiness: "Good in a crisis, holds form poorly" },
  6: { name: "The Caretaker", core: "Care, responsibility, protection", inPlus: "A reliable executor, holds the team together", inMinus: "Doesn't finish things, can't delegate, burnout", riskScenarios: ["Escaping into indulgences as compensation", "Holding grudges", "Victim scenario — 'I did everything for you, and you...'"], inRelationships: "Carries the day-to-day operations, takes care, but may store up resentments", inBusiness: "Takes on a lot, but spreads thin and burns out" },
  7: { name: "The Analyst", core: "Distrust, control, strategy", inPlus: "Deep analysis, strategic thinking", inMinus: "Withdrawal into isolation, coldness, reserve", riskScenarios: ["Analysis paralysis", "Detachment"], inRelationships: "Takes a long time to assess, doesn't trust, may suddenly leave", inBusiness: "An analyst, but makes decisions poorly in a team" },
  8: { name: "The Ruler", core: "Power, money, results", inPlus: "Knows how to manage, builds empires", inMinus: "Suppression, rigid control, a 'one-way game'", riskScenarios: ["Abuse", "Power struggles", "Toxic subordination"], inRelationships: "Pressures, sets the rules, and breaks everything when trust is lost", inBusiness: "A strong manager, but risk of an authoritarian style" },
  9: { name: "The Terminator", core: "Completion, resetting, departure", inPlus: "Knows how to cut the excess, close cycles", inMinus: "Abrupt breakups, disappearing without explanation, coldness after pain", riskScenarios: ["A sudden exit", "Leaves the partner to deal with the consequences"], inRelationships: "If they love — they give fully; if they've decided 'not for me' — they leave for good", inBusiness: "Closes projects without discussion, acts silently" },
};
export const actionES: Record<string, Partial<Act>> = {
  0: { name: "El Adaptativo", core: "Vacío de forma, flexibilidad, reflejo", inPlus: "Capacidad de aprendizaje, adaptación, capacidad de integrarse", inMinus: "Pérdida de uno mismo, dependencia, copiar los guiones ajenos", riskScenarios: ["Víctima: vive según las metas ajenas", "Mentira adaptativa: dice lo que quieren oír", "Vive la vida de otro"], inRelationships: "Se adapta a la pareja, pero puede disolverse y perder los límites", inBusiness: "Depende del entorno y de los socios, se moldea por las condiciones externas" },
  1: { name: "El Líder", core: "'Yo mismo', impulso, iniciativa", inPlus: "Liderazgo, decisiones rápidas", inMinus: "Ego, presión, control rígido", riskScenarios: ["Autoritarismo", "Incapacidad de delegar"], inRelationships: "Lidera la relación, pero la pareja puede sentirse secundaria", inBusiness: "Bueno al inicio de un proyecto, delega mal" },
  2: { name: "El Diplomático", core: "Diálogo, cooperación, compromiso", inPlus: "Acuerdos, trabajo en equipo", inMinus: "Dependencia, exceso de paciencia, incapacidad de decir 'no'", riskScenarios: ["Codependencia", "Sacrificio personal"], inRelationships: "Busca la armonía, pero puede tolerar lo tóxico por la paz", inBusiness: "Buen negociador, pero puede ceder en sus propios intereses" },
  3: { name: "El Expresivo", core: "La palabra, las promesas, los acuerdos", inPlus: "Capacidad de negociar, creatividad", inMinus: "Manipulación, mentiras, promesas sin acción", riskScenarios: ["Fraude psicológico", "Dobles sentidos", "'Lo dije — tú lo entendiste mal'"], inRelationships: "Habla mucho, pero puede no respaldar las palabras con hechos", inBusiness: "Ventas, relaciones públicas, pero riesgo de compromisos incumplidos" },
  4: { name: "El Constructor", core: "Control, marcos, orden, sistema", inPlus: "Fiabilidad, lleva las cosas hasta el resultado", inMinus: "Presión, rigidez, frialdad", riskScenarios: ["Guion de víctima: carga con todo solo y luego rompe el sistema", "Control rígido"], inRelationships: "Hace, no habla; sostiene el hogar, el apoyo, el dinero", inBusiness: "Un constructor estratégico, asume la responsabilidad" },
  5: { name: "El Buscador", core: "Cambios, movimiento, experimento", inPlus: "Flexibilidad, capacidad de salir de la rutina", inMinus: "Caos, ruptura de compromisos, huida", riskScenarios: ["Inestabilidad", "Infidelidades", "Abandona a medio camino"], inRelationships: "Necesita libertad, no tolera la rutina", inBusiness: "Bueno en crisis, mantiene mal la forma" },
  6: { name: "El Protector", core: "Cuidado, responsabilidad, protección", inPlus: "Ejecutor fiable, mantiene unido al equipo", inMinus: "No termina las cosas, no sabe delegar, agotamiento", riskScenarios: ["Refugiarse en los placeres como compensación", "Rencor", "Guion de víctima: 'lo hice todo por vosotros, y vosotros...'"], inRelationships: "Lleva la operativa, cuida, pero puede acumular rencores", inBusiness: "Asume mucho, pero se dispersa y se agota" },
  7: { name: "El Analista", core: "Desconfianza, control, estrategia", inPlus: "Análisis profundo, pensamiento estratégico", inMinus: "Refugio en el aislamiento, frialdad, hermetismo", riskScenarios: ["Parálisis por análisis", "Distanciamiento"], inRelationships: "Evalúa largo tiempo, no confía, puede irse de repente", inBusiness: "Analista, pero toma mal las decisiones en equipo" },
  8: { name: "El Soberano", core: "Poder, dinero, resultado", inPlus: "Sabe gestionar, construye imperios", inMinus: "Sometimiento, control rígido, un juego 'de una sola portería'", riskScenarios: ["Abuso", "Lucha de poder", "Sumisión tóxica"], inRelationships: "Presiona, marca las reglas y, al perder la confianza, lo rompe todo", inBusiness: "Un gestor fuerte, pero riesgo de un estilo autoritario" },
  9: { name: "El Finalizador", core: "Cierre, puesta a cero, marcha", inPlus: "Sabe cortar lo superfluo, cerrar ciclos", inMinus: "Rupturas bruscas, desaparición sin explicaciones, frialdad tras el dolor", riskScenarios: ["Una salida repentina", "Deja a la pareja lidiando con las consecuencias"], inRelationships: "Si ama, se entrega del todo; si entiende que 'no es lo suyo', se va para siempre", inBusiness: "Cierra proyectos sin discutir, actúa en silencio" },
};

// ============= PERSONAL YEARS (1-9) =============
type PYear = { name: string; theme: string; forRelationships: string; forBusiness: string; entryCondition?: string };
export const personalYearEN: Record<string, Partial<PYear>> = {
  1: { name: "Year of the Self", theme: "Start of the cycle, focus on yourself, ego", forRelationships: "The partner will be secondary. Entry is possible, but only as a 'temporary visit'", forBusiness: "Good for personal projects, bad for partnerships" },
  2: { name: "Year of Partnership", theme: "Dialogue, union, readiness for a couple", forRelationships: "Meeting and getting closer come more easily. The best year for a union", forBusiness: "Agreements, joint projects" },
  3: { name: "Year of Emotions", theme: "Communication, temptations, flirtation", forRelationships: "A lot of communication, little consolidation. Risk of superficial bonds", forBusiness: "Creativity, PR, but bad for serious decisions" },
  4: { name: "Year of Form", theme: "Structure, contract, formality", forRelationships: "Either you formalize it, or it breaks. A year of consolidation", forBusiness: "Scaling, fixing shares, expansion", entryCondition: "Only if there is readiness for form" },
  5: { name: "Year of Change", theme: "Leaving the old, chaos, movement", forRelationships: "Entry is possible, but order is needed. Risk of love triangles", forBusiness: "Relaunch, coming out of a crisis", entryCondition: "If there's no chaos and no triangles" },
  6: { name: "Year of Family", theme: "Care, home, stability", forRelationships: "You crave stability and closeness. The best year for family", forBusiness: "A reliable union, a family business" },
  7: { name: "Year of Reassembly", theme: "Closure, swings, transformation", forRelationships: "Relationships often don't withstand the swings. A 'I don't know what I want' year", forBusiness: "A pause, an absence of decisions, breakdown of communication" },
  8: { name: "Year of Pressure", theme: "Power, money, control", forRelationships: "Risk of control, conflicts, dependence. A toxic entry", forBusiness: "A struggle for power, financial disputes" },
  9: { name: "Year of Completion", theme: "Closing the past, taking stock, readiness for the new", forRelationships: "Entry is possible only after closing the past", forBusiness: "Completing projects, taking stock", entryCondition: "If the past is truly closed" },
};
export const personalYearES: Record<string, Partial<PYear>> = {
  1: { name: "Año del Yo", theme: "Inicio del ciclo, foco en uno mismo, ego", forRelationships: "La pareja será secundaria. La entrada es posible, pero como una 'visita temporal'", forBusiness: "Bueno para proyectos personales, malo para asociaciones" },
  2: { name: "Año de la Asociación", theme: "Diálogo, unión, disposición para la pareja", forRelationships: "Conocerse y acercarse resulta más fácil. El mejor año para una unión", forBusiness: "Acuerdos, proyectos conjuntos" },
  3: { name: "Año de las Emociones", theme: "Comunicación, tentaciones, coqueteo", forRelationships: "Mucha comunicación, poca consolidación. Riesgo de vínculos superficiales", forBusiness: "Creatividad, relaciones públicas, pero malo para decisiones serias" },
  4: { name: "Año de la Forma", theme: "Estructura, contrato, formalidad", forRelationships: "O lo formalizas, o se rompe. Un año de consolidación", forBusiness: "Escalar, fijar participaciones, expansión", entryCondition: "Solo si hay disposición para la forma" },
  5: { name: "Año de los Cambios", theme: "Salir de lo viejo, caos, movimiento", forRelationships: "La entrada es posible, pero hace falta orden. Riesgo de triángulos", forBusiness: "Reinicio, salida de una crisis", entryCondition: "Si no hay caos ni triángulos" },
  6: { name: "Año de la Familia", theme: "Cuidado, hogar, estabilidad", forRelationships: "Anhelas estabilidad y cercanía. El mejor año para la familia", forBusiness: "Una unión fiable, un negocio familiar" },
  7: { name: "Año de la Recomposición", theme: "Cierre, vaivenes, transformación", forRelationships: "Las relaciones a menudo no resisten los vaivenes. Un año de 'no sé qué quiero'", forBusiness: "Una pausa, ausencia de decisiones, ruptura de la comunicación" },
  8: { name: "Año de la Presión", theme: "Poder, dinero, control", forRelationships: "Riesgo de control, conflictos, dependencia. Una entrada tóxica", forBusiness: "Lucha por el poder, disputas financieras" },
  9: { name: "Año del Cierre", theme: "Cerrar el pasado, balance, disposición para lo nuevo", forRelationships: "La entrada es posible solo tras cerrar el pasado", forBusiness: "Cierre de proyectos, hacer balance", entryCondition: "Si el pasado está realmente cerrado" },
};

// ============= INTERACTION MATRIX =============
type Inter = { loveMeaning: string; businessMeaning: string };
const interEN_raw: Record<string, Inter> = {
  '6-4': { loveMeaning: 'Home + support, marriage', businessMeaning: 'Management + order' },
  '6-1': { loveMeaning: 'Care + leader', businessMeaning: 'Support for the start' },
  '4-2': { loveMeaning: 'Security', businessMeaning: 'Agreements' },
  '3-6': { loveMeaning: 'Warmth, joy', businessMeaning: 'Client service' },
  '6-6': { loveMeaning: 'Family, long term', businessMeaning: 'A reliable union' },
  '5-6': { loveMeaning: 'Swings, but it holds', businessMeaning: 'Growth under tight deadlines' },
  '5-4': { loveMeaning: 'Rebellion against the rules', businessMeaning: 'Conflict of chaos and regulation' },
  '9-4': { loveMeaning: 'Parting without drama', businessMeaning: 'Closing a project correctly' },
  '2-8': { loveMeaning: 'Dependence', businessMeaning: 'Pressure in the hierarchy' },
  '3-4': { loveMeaning: 'Emotions vs control', businessMeaning: 'Creativity under pressure' },
  '7-4': { loveMeaning: 'Reserve held by structure', businessMeaning: 'Analysis + system' },
  '8-6': { loveMeaning: 'Strength softened by care', businessMeaning: 'Management + support' },
  '7-7': { loveMeaning: 'Emotional coldness, no contact', businessMeaning: 'Decision paralysis' },
  '8-8': { loveMeaning: 'War, abuse', businessMeaning: 'A struggle for power' },
  '5-5': { loveMeaning: 'Came together, broke apart', businessMeaning: 'Chaos, missed deadlines' },
  '1-1': { loveMeaning: 'Rivalry', businessMeaning: 'Conflict of leaders' },
  '7-2': { loveMeaning: 'One left, the other waits', businessMeaning: 'Breakdown of communication' },
  '8-1': { loveMeaning: 'Suppression of the personality', businessMeaning: 'An authoritarian style' },
  '3-8': { loveMeaning: 'Humiliation of feelings', businessMeaning: 'Team burnout' },
  '9-9': { loveMeaning: 'A mutual end, emptiness', businessMeaning: 'Ending the cooperation' },
  '9-7': { loveMeaning: 'Leaving without explanation', businessMeaning: 'An abrupt exit' },
  '9-8': { loveMeaning: 'A breakup through conflict', businessMeaning: 'A financial scandal' },
};
const interES_raw: Record<string, Inter> = {
  '6-4': { loveMeaning: 'Hogar + apoyo, matrimonio', businessMeaning: 'Gestión + orden' },
  '6-1': { loveMeaning: 'Cuidado + líder', businessMeaning: 'Apoyo al arranque' },
  '4-2': { loveMeaning: 'Seguridad', businessMeaning: 'Acuerdos' },
  '3-6': { loveMeaning: 'Calidez, alegría', businessMeaning: 'Atención al cliente' },
  '6-6': { loveMeaning: 'Familia, largo plazo', businessMeaning: 'Una unión fiable' },
  '5-6': { loveMeaning: 'Vaivenes, pero se sostiene', businessMeaning: 'Crecimiento con plazos ajustados' },
  '5-4': { loveMeaning: 'Rebelión contra las reglas', businessMeaning: 'Conflicto entre caos y reglamento' },
  '9-4': { loveMeaning: 'Separación sin drama', businessMeaning: 'Cerrar un proyecto correctamente' },
  '2-8': { loveMeaning: 'Dependencia', businessMeaning: 'Presión en la jerarquía' },
  '3-4': { loveMeaning: 'Emociones vs control', businessMeaning: 'Creatividad bajo presión' },
  '7-4': { loveMeaning: 'El hermetismo sostenido por la estructura', businessMeaning: 'Análisis + sistema' },
  '8-6': { loveMeaning: 'La fuerza suavizada por el cuidado', businessMeaning: 'Gestión + apoyo' },
  '7-7': { loveMeaning: 'Frialdad emocional, sin contacto', businessMeaning: 'Parálisis de decisiones' },
  '8-8': { loveMeaning: 'Guerra, abuso', businessMeaning: 'Lucha por el poder' },
  '5-5': { loveMeaning: 'Se juntaron, se separaron', businessMeaning: 'Caos, plazos incumplidos' },
  '1-1': { loveMeaning: 'Rivalidad', businessMeaning: 'Conflicto de líderes' },
  '7-2': { loveMeaning: 'Uno se fue, el otro espera', businessMeaning: 'Ruptura de la comunicación' },
  '8-1': { loveMeaning: 'Sometimiento de la personalidad', businessMeaning: 'Un estilo autoritario' },
  '3-8': { loveMeaning: 'Humillación de los sentimientos', businessMeaning: 'Agotamiento del equipo' },
  '9-9': { loveMeaning: 'Un final mutuo, vacío', businessMeaning: 'Fin de la cooperación' },
  '9-7': { loveMeaning: 'Marcharse sin explicación', businessMeaning: 'Una salida brusca' },
  '9-8': { loveMeaning: 'Una ruptura por conflicto', businessMeaning: 'Un escándalo financiero' },
};
// mirror symmetric pairs (a-b == b-a)
function mirror(src: Record<string, Inter>): Record<string, Inter> {
  const out: Record<string, Inter> = { ...src };
  for (const k of Object.keys(src)) {
    const [a, b] = k.split('-');
    const rev = `${b}-${a}`;
    if (!out[rev]) out[rev] = src[k];
  }
  return out;
}
export const interactionEN = mirror(interEN_raw);
export const interactionES = mirror(interES_raw);

// ============= CONSCIOUSNESS COMPATIBILITY =============
type CCompat = { description: string };
export const consCompatEN: Record<string, Partial<CCompat>> = {
  '6-1': { description: 'Balance — care + leadership' }, '1-6': { description: 'Balance — care + leadership' },
  '4-2': { description: 'Security — structure + dialogue' }, '2-4': { description: 'Security — structure + dialogue' },
  '3-6': { description: 'Warmth — emotions + family' }, '6-3': { description: 'Warmth — emotions + family' },
  '7-4': { description: 'Holding — analysis + form' }, '4-7': { description: 'Holding — analysis + form' },
  '5-6': { description: 'Stabilization — freedom + care' }, '6-5': { description: 'Stabilization — freedom + care' },
  '7-7': { description: 'Coldness — both are closed off' },
  '8-8': { description: 'War — a struggle for power' },
  '5-5': { description: 'Swings — double instability' },
  '1-1': { description: 'Competition — two egos' },
  '9-9': { description: 'Burnout — a double completion' },
  '8-2': { description: 'Pressure — control vs dependence' }, '2-8': { description: 'Pressure — control vs dependence' },
  '7-2': { description: 'Waiting — one is closed, the other waits' }, '2-7': { description: 'Waiting — one is closed, the other waits' },
};
export const consCompatES: Record<string, Partial<CCompat>> = {
  '6-1': { description: 'Equilibrio — cuidado + liderazgo' }, '1-6': { description: 'Equilibrio — cuidado + liderazgo' },
  '4-2': { description: 'Seguridad — estructura + diálogo' }, '2-4': { description: 'Seguridad — estructura + diálogo' },
  '3-6': { description: 'Calidez — emociones + familia' }, '6-3': { description: 'Calidez — emociones + familia' },
  '7-4': { description: 'Sostén — análisis + forma' }, '4-7': { description: 'Sostén — análisis + forma' },
  '5-6': { description: 'Estabilización — libertad + cuidado' }, '6-5': { description: 'Estabilización — libertad + cuidado' },
  '7-7': { description: 'Frialdad — ambos cerrados' },
  '8-8': { description: 'Guerra — lucha por el poder' },
  '5-5': { description: 'Vaivenes — doble inestabilidad' },
  '1-1': { description: 'Competencia — dos egos' },
  '9-9': { description: 'Agotamiento — un doble cierre' },
  '8-2': { description: 'Presión — control vs dependencia' }, '2-8': { description: 'Presión — control vs dependencia' },
  '7-2': { description: 'Espera — uno está cerrado, el otro espera' }, '2-7': { description: 'Espera — uno está cerrado, el otro espera' },
};

// ============= PARTNER FILTERS (1-9) — only `reason` is text =============
type PFilter = { reason: string };
export const partnerFiltersEN: Record<string, Partial<PFilter>> = {
  1: { reason: 'A leader needs a partner with care and structure, otherwise it becomes competition' },
  2: { reason: 'A partner needs support and protection, otherwise dependence' },
  3: { reason: 'A communicator needs stability, otherwise superficiality' },
  4: { reason: 'Support needs gentleness and dialogue, otherwise pressure' },
  5: { reason: 'The free one needs form, otherwise chaos and escape' },
  6: { reason: 'The family one needs a leader or order, otherwise burnout' },
  7: { reason: 'The closed one needs support, otherwise loneliness and coldness' },
  8: { reason: 'The controller needs acceptance and gentleness, otherwise abuse' },
  9: { reason: 'The finisher needs structure, otherwise cold breakups' },
};
export const partnerFiltersES: Record<string, Partial<PFilter>> = {
  1: { reason: 'Un líder necesita una pareja con cuidado y estructura, si no, hay competencia' },
  2: { reason: 'Un compañero necesita apoyo y protección, si no, dependencia' },
  3: { reason: 'Un comunicador necesita estabilidad, si no, superficialidad' },
  4: { reason: 'El sostén necesita suavidad y diálogo, si no, presión' },
  5: { reason: 'El libre necesita forma, si no, caos y huida' },
  6: { reason: 'El familiar necesita un líder u orden, si no, agotamiento' },
  7: { reason: 'El cerrado necesita un sostén, si no, soledad y frialdad' },
  8: { reason: 'El controlador necesita aceptación y suavidad, si no, abuso' },
  9: { reason: 'El que cierra necesita estructura, si no, rupturas frías' },
};
