// EN/ES translations for patterns.ts. Overlays keyed by id/type/key are merged over the
// Russian base; ru is the fallback. Plus localized verdict strings.

import i18n from "@/i18n";

type PatOv = { name: string; essence: string; inMinus: string; inPlus: string; loveContext: string; businessContext: string };
type ConfOv = { conflictType: string; behavior: string[]; outcome: string; redFlag: string };
type RiskOv = { name: string; behaviorPattern: string; partnerFeels: string[]; realLifeSigns: string[]; plusPotential: { strengths: string[]; usefulIn: string[]; safeConditions: string[]; stillDangerousIf: string[] } };
type BizOv = { typeName: string; strengths: string[]; risks: string[]; bestFor: string[] };

// ---------- behavioral patterns (by id) ----------
const patEN: Record<string, PatOv> = {
  '11-2-6-8': { name: 'Control through emotions and resources', essence: 'Uses emotional sensitivity as a tool of influence, controls through money and a sense of duty', inMinus: 'Manipulation, jealousy, financial pressure, devaluation', inPlus: 'A strong manager with awareness and boundaries', loveContext: 'May become a smothering partner controlling through care and money', businessContext: 'An effective manager if there is external control' },
  '1-4-8': { name: 'Power through structure', essence: 'A system-leader, builds empires through rigid control', inMinus: 'Rigid control, suppression of the partner, authoritarianism', inPlus: 'A leader, a builder of systems, a reliable foundation', loveContext: 'Demands submission, tolerates no objections', businessContext: 'Ideal for building structures, dangerous for partners' },
  '2-6-9': { name: 'Emotional dependence', essence: 'Dissolves into the partner, rescues, endures', inMinus: 'Victimhood, rescuing, loss of self', inPlus: 'Deep empathy with personal boundaries', loveContext: 'Codependency, tolerates the toxic to preserve the bond', businessContext: 'Carries everything, unable to delegate' },
  '3-5-7': { name: 'Search for meaning through chaos', essence: 'Restlessness, departures, a search for self through destruction', inMinus: 'Restlessness, departures, resets without explanation', inPlus: 'Creativity, transformations, growth through crises', loveContext: 'Unpredictable, disappears, returns', businessContext: 'Good for the start, holds form poorly' },
  '4-6-8': { name: 'Control disguised as care', essence: "Creates a 'golden cage', controls through providing", inMinus: "Smothering relationships, the partner's financial dependence", inPlus: 'A family strategist with agreed-upon roles', loveContext: 'Material support, but without freedom', businessContext: 'A reliable but controlling partner' },
  '5-9': { name: 'Escape from responsibility', essence: 'Disappears instead of solving problems', inMinus: 'Disappearances, unfinished bonds, irresponsibility', inPlus: 'Closing old cycles, freedom from the past', loveContext: 'Leaves without explanation, leaves you in uncertainty', businessContext: 'Closes projects suddenly' },
  '7-7': { name: 'Mirror transformation', essence: 'Both in reassembly, no contact', inMinus: 'Estrangement, coldness, breakups without dialogue', inPlus: 'Growth only through deep awareness', loveContext: 'A union without closeness, emotional coldness', businessContext: 'Decision paralysis, stagnation' },
  '8-2': { name: 'Pressure through emotions', essence: 'A psychological strategist, manages through feelings', inMinus: 'Manipulation, gaslighting, emotional pressure', inPlus: 'A psychological strategist (dangerous in the minus)', loveContext: 'The partner begins to doubt reality', businessContext: 'Manipulative team management' },
  '6-1': { name: 'A union of family and leader', essence: 'A potentially strong couple with a distribution of roles', inMinus: 'A struggle for power in the couple', inPlus: 'A strong couple with clear roles', loveContext: 'Works if one leads and the other supports', businessContext: 'An excellent manager + operations pairing' },
  '9-1': { name: 'Resetting for the sake of a new start', essence: 'Abrupt breakups for the sake of a relaunch', inMinus: 'Abrupt breakups, leaving without explanation', inPlus: 'A karmic transition, if conscious', loveContext: 'Ends relationships abruptly and for good', businessContext: 'Closes the ineffective, launches the new' },
  '3-6': { name: 'Emotional devaluation', essence: 'Wounds with words under the guise of jokes', inMinus: 'Words wound more than actions, cutting remarks', inPlus: 'Support with mature speech', loveContext: "'I was just joking' — a classic", businessContext: 'May demotivate the team' },
  '12-6': { name: 'Victim in the relationship', essence: 'Endures, stores up grudges, then explodes', inMinus: 'Victimhood, accumulated grudges, explosions', inPlus: 'Deep care with equality', loveContext: 'Endures for a long time, then abruptly leaves or explodes', businessContext: "Overloads, doesn't ask for help" },
  '13-8': { name: 'Manipulator-controller', essence: 'Cold calculation + hidden aggression', inMinus: 'Pressure, calculation, hidden aggression', inPlus: 'A strong business partner with ethics', loveContext: 'A dangerous partner: control + manipulation', businessContext: "Effective, but may 'betray'" },
  '14-6': { name: "Swings of 'closeness–escape'", essence: 'Now close, now far — instability', inMinus: 'Instability, infidelity, departures-and-returns', inPlus: 'Works only with mature agreements', loveContext: 'The partner is in constant uncertainty', businessContext: 'Misses deadlines, changes decisions' },
  '15-8': { name: 'Temptation and dependence', essence: 'Attracts and binds', inMinus: 'Toxic attachments, dependence', inPlus: 'Magnetism, if there is no dependence', loveContext: "Hard to leave, even when it's bad", businessContext: 'May create team dependence' },
  '16-1': { name: 'Destruction of the ego', essence: 'Conflicts leading to transformation or collapse', inMinus: 'Conflicts, collapse of the relationship, a war of egos', inPlus: 'Personal growth after a crisis', loveContext: 'Either transformation or destruction', businessContext: 'Conflicts with partners' },
  '17-6': { name: 'Illusion of stability', essence: 'Material support without emotional closeness', inMinus: "A 'golden cage', control through providing", inPlus: 'Material support (without love)', loveContext: 'There is everything but closeness', businessContext: 'Stable, but without development' },
  '18-2': { name: 'Fear of loss', essence: 'Suspicion, over-thinking, jealousy', inMinus: 'Suspicion, fantasies, accusations', inPlus: 'Intuition with psychological maturity', loveContext: 'The partner tires of making excuses', businessContext: "Doesn't trust the team, double-checks" },
  '19-9': { name: 'Pride and loneliness', essence: 'Destroys connections with their pride', inMinus: 'Self-destruction of bonds, loneliness', inPlus: 'A lone leader, if they accept others', loveContext: 'Ends up alone because of pride', businessContext: "Can't work in a team" },
  '20-6': { name: 'Dependence on approval', essence: 'Adjusts, loses themselves for the sake of acceptance', inMinus: 'Adjusting, loss of self, servility', inPlus: 'Harmony with self-confidence', loveContext: 'Dissolves into the partner', businessContext: "Can't say 'no'" },
  '21-9': { name: 'Chatter without action', essence: 'Many words, few deeds', inMinus: 'Illusions, empty promises, talk instead of action', inPlus: 'Completing cycles through awareness', loveContext: "Promises but doesn't deliver", businessContext: 'Ideas without execution' },
  '22-4': { name: 'Empire builder', essence: 'Long-term building through labor', inMinus: 'Workaholism, coldness, focus only on the work', inPlus: 'Long-term projects, building a business', loveContext: 'Work matters more than the relationship', businessContext: 'Ideal for long-term projects' },
  '23-8': { name: 'Risk for the sake of gain', essence: 'Excitement, ventures, an entrepreneurial spirit', inMinus: 'Excitement, ventures, risky decisions', inPlus: 'Entrepreneurial talent', loveContext: 'Unpredictable, seeks thrills', businessContext: 'Good for startups, dangerous for stable projects' },
  '24-2': { name: 'Dissolving into the partner', essence: 'Total dependence on the other', inMinus: 'Loss of boundaries, dissolving, dependence', inPlus: 'Gentleness and support with maturity', loveContext: "Doesn't exist without the partner", businessContext: "Can't work independently" },
  '25-7': { name: 'Double isolation', essence: 'A complete withdrawal into oneself', inMinus: 'A complete break of contact, isolation', inPlus: 'Deep transformation in solitude', loveContext: 'A union without contact', businessContext: "Doesn't work in a team" },
  '26-6': { name: 'Financial control', essence: 'Money as a tool of power', inMinus: 'Money = power, financial pressure', inPlus: 'Reliability with honest rules', loveContext: 'Controls through money', businessContext: 'A strong financier, but may pressure' },
  '27-9': { name: 'Karmic completion', essence: 'Losses and partings as a lesson', inMinus: 'Losses, partings, the pain of completion', inPlus: 'Closing old scenarios, wisdom', loveContext: 'Often comes after difficult relationships', businessContext: 'Closes old projects' },
  '28-8': { name: 'Power and ambition', essence: 'A strong drive for power and control', inMinus: 'Pressure, authoritarianism, suppression', inPlus: 'A strong leader, if they hear others', loveContext: 'Demands submission', businessContext: 'An effective but harsh manager' },
  '29-2': { name: 'Emotional manipulator', essence: 'Uses intuition for manipulation', inMinus: 'Lies, double games, manipulation', inPlus: 'An intuitive psychologist with honesty', loveContext: "The partner doesn't understand what's happening", businessContext: "Can 'read' anyone" },
  '30-6-9': { name: 'Infantile care', essence: 'Care as an escape from responsibility', inMinus: 'Devaluation, escaping responsibility, immaturity', inPlus: 'A creative mentor, if mature', loveContext: 'Many words about care, few actions', businessContext: "Doesn't take responsibility" },
};
const patES: Record<string, PatOv> = {
  '11-2-6-8': { name: 'Control a través de las emociones y los recursos', essence: 'Usa la sensibilidad emocional como herramienta de influencia, controla a través del dinero y el sentido del deber', inMinus: 'Manipulaciones, celos, presión financiera, desvalorización', inPlus: 'Un gestor fuerte con conciencia y límites', loveContext: 'Puede volverse una pareja asfixiante que controla con el cuidado y el dinero', businessContext: 'Un gestor eficaz si hay control externo' },
  '1-4-8': { name: 'Poder a través de la estructura', essence: 'Un líder-sistematizador, construye imperios mediante el control rígido', inMinus: 'Control rígido, sometimiento de la pareja, autoritarismo', inPlus: 'Un líder, un constructor de sistemas, un fundamento fiable', loveContext: 'Exige sumisión, no tolera objeciones', businessContext: 'Ideal para construir estructuras, peligroso para los socios' },
  '2-6-9': { name: 'Dependencia emocional', essence: 'Se disuelve en la pareja, rescata, aguanta', inMinus: 'Victimismo, rescate, pérdida de uno mismo', inPlus: 'Empatía profunda con límites personales', loveContext: 'Codependencia, tolera lo tóxico para conservar el vínculo', businessContext: 'Carga con todo, no sabe delegar' },
  '3-5-7': { name: 'Búsqueda de sentido a través del caos', essence: 'Idas y venidas, fugas, búsqueda de uno mismo a través de la destrucción', inMinus: 'Idas y venidas, fugas, puestas a cero sin explicación', inPlus: 'Creatividad, transformaciones, crecimiento a través de las crisis', loveContext: 'Impredecible, desaparece, regresa', businessContext: 'Bueno para el arranque, mantiene mal la forma' },
  '4-6-8': { name: 'Control disfrazado de cuidado', essence: "Crea una 'jaula de oro', controla a través de proveer", inMinus: 'Relaciones asfixiantes, dependencia financiera de la pareja', inPlus: 'Un estratega familiar con roles pactados', loveContext: 'Apoyo material, pero sin libertad', businessContext: 'Un socio fiable, pero controlador' },
  '5-9': { name: 'Huida de la responsabilidad', essence: 'Desaparece en vez de resolver los problemas', inMinus: 'Desapariciones, vínculos sin cerrar, irresponsabilidad', inPlus: 'Cerrar viejos ciclos, libertad del pasado', loveContext: 'Se va sin explicación, te deja en la incertidumbre', businessContext: 'Cierra proyectos de repente' },
  '7-7': { name: 'Transformación en espejo', essence: 'Ambos en recomposición, sin contacto', inMinus: 'Distanciamiento, frialdad, rupturas sin diálogo', inPlus: 'Crecimiento solo a través de la conciencia profunda', loveContext: 'Una unión sin cercanía, frialdad emocional', businessContext: 'Parálisis de decisiones, estancamiento' },
  '8-2': { name: 'Presión a través de las emociones', essence: 'Un estratega psicológico, gestiona a través de los sentimientos', inMinus: 'Manipulaciones, luz de gas, presión emocional', inPlus: 'Un estratega psicológico (peligroso en el minus)', loveContext: 'La pareja empieza a dudar de la realidad', businessContext: 'Gestión manipuladora del equipo' },
  '6-1': { name: 'Una unión de familia y líder', essence: 'Una pareja potencialmente fuerte con un reparto de roles', inMinus: 'Una lucha por el poder en la pareja', inPlus: 'Una pareja fuerte con roles claros', loveContext: 'Funciona si uno guía y el otro apoya', businessContext: 'Un dúo excelente de gestor + operativa' },
  '9-1': { name: 'Puesta a cero por un nuevo comienzo', essence: 'Rupturas bruscas en aras de un reinicio', inMinus: 'Rupturas bruscas, marcharse sin explicación', inPlus: 'Una transición kármica, si es consciente', loveContext: 'Cierra las relaciones de forma brusca y para siempre', businessContext: 'Cierra lo ineficaz, lanza lo nuevo' },
  '3-6': { name: 'Desvalorización emocional', essence: 'Hiere con palabras bajo la apariencia de bromas', inMinus: 'Las palabras hieren más que los actos, frases punzantes', inPlus: 'Apoyo con un habla madura', loveContext: "'Solo era una broma' — un clásico", businessContext: 'Puede desmotivar al equipo' },
  '12-6': { name: 'Víctima en la relación', essence: 'Aguanta, acumula rencores, luego estalla', inMinus: 'Victimismo, rencores acumulados, estallidos', inPlus: 'Cuidado profundo con igualdad', loveContext: 'Aguanta mucho, luego se va de golpe o estalla', businessContext: 'Se sobrecarga, no pide ayuda' },
  '13-8': { name: 'Manipulador-controlador', essence: 'Cálculo frío + agresión oculta', inMinus: 'Presión, cálculo, agresión oculta', inPlus: 'Un socio de negocios fuerte con ética', loveContext: 'Una pareja peligrosa: control + manipulación', businessContext: "Eficaz, pero puede 'traicionar'" },
  '14-6': { name: "Vaivenes de 'acercamiento–huida'", essence: 'Ahora cerca, ahora lejos — inestabilidad', inMinus: 'Inestabilidad, infidelidades, idas y vueltas', inPlus: 'Funciona solo con acuerdos maduros', loveContext: 'La pareja en constante incertidumbre', businessContext: 'Incumple plazos, cambia decisiones' },
  '15-8': { name: 'Seducción y dependencia', essence: 'Atrae y ata', inMinus: 'Apegos tóxicos, dependencia', inPlus: 'Magnetismo, si no hay dependencia', loveContext: 'Cuesta irse, incluso cuando va mal', businessContext: 'Puede crear dependencia en el equipo' },
  '16-1': { name: 'Destrucción del ego', essence: 'Conflictos que llevan a la transformación o al colapso', inMinus: 'Conflictos, colapso de la relación, una guerra de egos', inPlus: 'Crecimiento personal tras una crisis', loveContext: 'O transformación, o destrucción', businessContext: 'Conflictos con los socios' },
  '17-6': { name: 'Ilusión de estabilidad', essence: 'Apoyo material sin cercanía emocional', inMinus: "Una 'jaula de oro', control a través de proveer", inPlus: 'Apoyo material (sin amor)', loveContext: 'Hay de todo menos cercanía', businessContext: 'Estable, pero sin desarrollo' },
  '18-2': { name: 'Miedo a la pérdida', essence: 'Suspicacia, suposiciones, celos', inMinus: 'Suspicacia, fantasías, acusaciones', inPlus: 'Intuición con madurez psicológica', loveContext: 'La pareja se cansa de justificarse', businessContext: 'No confía en el equipo, lo revisa todo' },
  '19-9': { name: 'Orgullo y soledad', essence: 'Destruye los vínculos con su orgullo', inMinus: 'Autodestrucción de los vínculos, soledad', inPlus: 'Un líder solitario, si acepta a los demás', loveContext: 'Se queda solo por el orgullo', businessContext: 'No sabe trabajar en equipo' },
  '20-6': { name: 'Dependencia de la aprobación', essence: 'Se adapta, se pierde a sí mismo por ser aceptado', inMinus: 'Adaptación, pérdida de uno mismo, servilismo', inPlus: 'Armonía con confianza en uno mismo', loveContext: 'Se disuelve en la pareja', businessContext: "No puede decir 'no'" },
  '21-9': { name: 'Cháchara sin acción', essence: 'Muchas palabras, pocos hechos', inMinus: 'Ilusiones, promesas vacías, hablar en vez de actuar', inPlus: 'Cerrar ciclos a través de la conciencia', loveContext: 'Promete, pero no cumple', businessContext: 'Ideas sin ejecución' },
  '22-4': { name: 'Constructor de imperios', essence: 'Construcción a largo plazo a través del trabajo', inMinus: 'Adicción al trabajo, frialdad, foco solo en la tarea', inPlus: 'Proyectos a largo plazo, construir un negocio', loveContext: 'El trabajo importa más que la relación', businessContext: 'Ideal para proyectos a largo plazo' },
  '23-8': { name: 'Riesgo por el beneficio', essence: 'Ímpetu, aventuras, espíritu emprendedor', inMinus: 'Ímpetu, aventuras, decisiones arriesgadas', inPlus: 'Talento emprendedor', loveContext: 'Impredecible, busca emociones fuertes', businessContext: 'Bueno para startups, peligroso para proyectos estables' },
  '24-2': { name: 'Disolverse en la pareja', essence: 'Dependencia total del otro', inMinus: 'Pérdida de límites, disolverse, dependencia', inPlus: 'Suavidad y apoyo con madurez', loveContext: 'No existe sin la pareja', businessContext: 'No puede trabajar de forma autónoma' },
  '25-7': { name: 'Doble aislamiento', essence: 'Un repliegue total en uno mismo', inMinus: 'Una ruptura total del contacto, aislamiento', inPlus: 'Transformación profunda en soledad', loveContext: 'Una unión sin contacto', businessContext: 'No trabaja en equipo' },
  '26-6': { name: 'Control financiero', essence: 'El dinero como herramienta de poder', inMinus: 'Dinero = poder, presión financiera', inPlus: 'Fiabilidad con reglas honestas', loveContext: 'Controla a través del dinero', businessContext: 'Un financiero fuerte, pero puede presionar' },
  '27-9': { name: 'Cierre kármico', essence: 'Pérdidas y separaciones como lección', inMinus: 'Pérdidas, separaciones, el dolor del cierre', inPlus: 'Cerrar viejos guiones, sabiduría', loveContext: 'A menudo llega tras relaciones difíciles', businessContext: 'Cierra proyectos antiguos' },
  '28-8': { name: 'Poder y ambición', essence: 'Un fuerte afán de poder y control', inMinus: 'Presión, autoritarismo, sometimiento', inPlus: 'Un líder fuerte, si escucha a los demás', loveContext: 'Exige sumisión', businessContext: 'Un gestor eficaz pero duro' },
  '29-2': { name: 'Manipulador emocional', essence: 'Usa la intuición para manipular', inMinus: 'Mentiras, juegos dobles, manipulaciones', inPlus: 'Un psicólogo intuitivo con honestidad', loveContext: 'La pareja no entiende qué ocurre', businessContext: "Puede 'leer' a cualquiera" },
  '30-6-9': { name: 'Cuidado infantil', essence: 'El cuidado como huida de la responsabilidad', inMinus: 'Desvalorización, huida de la responsabilidad, inmadurez', inPlus: 'Un mentor creativo, si es maduro', loveContext: 'Muchas palabras sobre el cuidado, pocos hechos', businessContext: 'No asume responsabilidad' },
};

// ---------- conflicts (by "a-b" key) ----------
const confEN: Record<string, ConfOv> = {
  '11-2': { conflictType: 'Emotional manipulation', behavior: ['Pressure through feelings', 'Distortion of facts', "'You misunderstood everything'"], outcome: 'Gaslighting, psychological exhaustion', redFlag: 'Hidden abuse' },
  '11-6': { conflictType: 'Control disguised as care', behavior: ["Humiliation 'with good intentions'", 'Interference in personal decisions'], outcome: "Loss of the partner's self-esteem", redFlag: 'Moral abuse' },
  '11-8': { conflictType: 'Power and dominance', behavior: ['Status, money as leverage', 'Demonstration of superiority'], outcome: 'Suppression, fear, dependence', redFlag: 'Tyrant / despot' },
  '2-6': { conflictType: 'Codependency', behavior: ['Dissolving into the partner', 'Fear of being abandoned'], outcome: 'Victim–rescuer', redFlag: 'Emotional dependence' },
  '2-9': { conflictType: 'Fantasies instead of reality', behavior: ['Over-thinking', 'Accusations without facts'], outcome: 'Paranoia, hysterics', redFlag: 'Unstable psyche' },
  '3-6': { conflictType: 'Verbal devaluation', behavior: ['Cutting remarks', "'I was just joking'"], outcome: 'Chronic conflicts', redFlag: 'Verbal abuse' },
  '3-9': { conflictType: 'Escape from responsibility', behavior: ['Talk instead of action', 'Disappearances'], outcome: 'Unfinished relationships', redFlag: 'Immaturity' },
  '4-8': { conflictType: 'Rigid control', behavior: ['Total control', 'Punishment for disobedience'], outcome: "Destruction of the partner's personality", redFlag: 'Dictatorship' },
  '5-5': { conflictType: 'Chaos', behavior: ['Instability', 'Constant changes of decisions'], outcome: 'Swings, infidelity, breakups', redFlag: 'Impossibility of a long-term union' },
  '7-7': { conflictType: 'Emotional coldness', behavior: ['Distance', 'Silent breakups'], outcome: 'Estrangement', redFlag: 'A union without closeness' },
};
const confES: Record<string, ConfOv> = {
  '11-2': { conflictType: 'Manipulación emocional', behavior: ['Presión a través de los sentimientos', 'Distorsión de los hechos', "'Lo entendiste todo mal'"], outcome: 'Luz de gas, agotamiento psicológico', redFlag: 'Abuso oculto' },
  '11-6': { conflictType: 'Control disfrazado de cuidado', behavior: ["Humillación 'con buenas intenciones'", 'Injerencia en las decisiones personales'], outcome: 'Pérdida de la autoestima de la pareja', redFlag: 'Violencia moral' },
  '11-8': { conflictType: 'Poder y dominación', behavior: ['Estatus, dinero como palanca', 'Demostración de superioridad'], outcome: 'Sometimiento, miedo, dependencia', redFlag: 'Tirano / déspota' },
  '2-6': { conflictType: 'Codependencia', behavior: ['Disolverse en la pareja', 'Miedo a ser abandonado'], outcome: 'Víctima–salvador', redFlag: 'Dependencia emocional' },
  '2-9': { conflictType: 'Fantasías en vez de realidad', behavior: ['Suposiciones', 'Acusaciones sin hechos'], outcome: 'Paranoia, histerias', redFlag: 'Psique inestable' },
  '3-6': { conflictType: 'Desvalorización verbal', behavior: ['Frases punzantes', "'Solo era una broma'"], outcome: 'Conflictos crónicos', redFlag: 'Violencia verbal' },
  '3-9': { conflictType: 'Huida de la responsabilidad', behavior: ['Hablar en vez de actuar', 'Desapariciones'], outcome: 'Relaciones sin cerrar', redFlag: 'Inmadurez' },
  '4-8': { conflictType: 'Control rígido', behavior: ['Control total', 'Castigo por la desobediencia'], outcome: 'Destrucción de la personalidad de la pareja', redFlag: 'Dictadura' },
  '5-5': { conflictType: 'Caos', behavior: ['Inestabilidad', 'Cambios constantes de decisión'], outcome: 'Vaivenes, infidelidades, rupturas', redFlag: 'Imposibilidad de una unión a largo plazo' },
  '7-7': { conflictType: 'Frialdad emocional', behavior: ['Distancia', 'Rupturas silenciosas'], outcome: 'Distanciamiento', redFlag: 'Una unión sin cercanía' },
};

// ---------- risk profiles (by type) ----------
const riskEN: Record<string, RiskOv> = {
  ABUSER: { name: 'Abuser', behaviorPattern: 'Distorts reality, humiliates under the guise of care, provokes guilt, devalues', partnerFeels: ['Constant self-doubt', 'Anxiety', 'Emotional exhaustion', 'Dependence'], realLifeSigns: ["'I'm doing this for you'", "'You're too sensitive'", 'Public humiliation', 'Double standards'], plusPotential: { strengths: ['High intelligence', 'Strategic thinking', 'Strong speech'], usefulIn: ['Management', 'Analytics', 'Consulting', 'Negotiations'], safeConditions: ['Clear frameworks of responsibility', 'An equal-strength partner', 'Transparent agreements'], stillDangerousIf: ['There is personal attachment', 'A power imbalance', 'The partner is weaker or dependent'] } },
  MANIPULATOR: { name: 'Manipulator', behaviorPattern: 'Pressures through emotions, plays the victim, shifts responsibility, manages through fear of loss', partnerFeels: ['A sense of duty', "Fear of saying 'no'", 'Constant tension', 'A feeling of being trapped'], realLifeSigns: ["'I can't cope without you'", "'If you leave, I'll be devastated'", 'Tears as a tool'], plusPotential: { strengths: ['A subtle sense of people', 'Empathy', 'The ability to manage the atmosphere'], usefulIn: ['Psychology', 'Coaching', 'HR', 'Team management'], safeConditions: ['Conscious work with boundaries', 'No jealousy', 'Transparency of motives'], stillDangerousIf: ['There is romantic dependence', 'A financial tie', 'Hidden expectations'] } },
  TYRANT: { name: 'Tyrant', behaviorPattern: 'Controls finances, dictates rules, suppresses initiative, tolerates no objections', partnerFeels: ['Fear', 'Submission', 'Loss of will', 'A feeling of a cage'], realLifeSigns: ["'I know better'", "'You're nothing without me'", 'Control of time, money, contacts'], plusPotential: { strengths: ['Rigid structure', 'Responsibility', 'The ability to hold systems together'], usefulIn: ['Business', 'Management', 'Finance', 'Security'], safeConditions: ['Power limited by rules', 'There is external control', 'The partner is not dependent'], stillDangerousIf: ['No limits', 'Emotional or financial dependence'] } },
  CODEPENDENT: { name: 'Codependent', behaviorPattern: 'Dissolves into the partner, endures, rescues, has no boundaries', partnerFeels: ['Pressure through care', 'The impossibility of being themselves', 'Guilt over their own needs'], realLifeSigns: ['Always nearby', 'Tolerates the unacceptable', 'Makes excuses for the partner'], plusPotential: { strengths: ['Deep empathy', 'Care', 'Devotion'], usefulIn: ['Helping professions', 'Service', 'Support'], safeConditions: ['Personal boundaries', 'Equality in the relationship', 'Their own life outside the couple'], stillDangerousIf: ['The partner takes advantage', 'No interests of their own', 'Loss of identity'] } },
  ESCAPER: { name: 'The escaper', behaviorPattern: "Disappears instead of dialogue, doesn't close conversations, leaves you in uncertainty", partnerFeels: ['Uncertainty', 'Waiting', 'Anxiety', 'A feeling of abandonment'], realLifeSigns: ['Disappears without explanation', "Doesn't answer questions", 'Withdraws into themselves'], plusPotential: { strengths: ['The ability to complete stages', "Doesn't hold grudges", "Doesn't destroy openly"], usefulIn: ['Project work', 'Short-term tasks', 'Consultations'], safeConditions: ['No expectations of stability', 'Clear deadlines', 'A fixed format'], stillDangerousIf: ['The partner expects closeness', 'There is emotional involvement'] } },
  CONTROLLER: { name: 'Controller', behaviorPattern: 'Controls through structure, money or care, demands a report', partnerFeels: ['A lack of freedom', 'The need to make excuses', 'Pressure'], realLifeSigns: ['Checks the phone', 'Controls spending', 'Demands a report on time'], plusPotential: { strengths: ['Organization', 'Reliability', 'Responsibility'], usefulIn: ['Management', 'Finance', 'Logistics'], safeConditions: ['Control over processes, not people', 'Respect for boundaries', 'Trust'], stillDangerousIf: ['Control over the partner', 'No trust', 'Jealousy'] } },
  COLD: { name: 'Emotionally cold', behaviorPattern: 'Distance, detachment, a lack of emotional closeness', partnerFeels: ['Loneliness in the couple', 'Being misunderstood', 'Rejection'], realLifeSigns: ["Doesn't express feelings", 'Avoids closeness', 'Stays silent in conflicts'], plusPotential: { strengths: ['Stability', 'Rationality', 'Independence'], usefulIn: ['Analytics', 'Research', 'Individual work'], safeConditions: ["The partner doesn't expect emotionality", 'Respect for space', 'Other sources of emotion'], stillDangerousIf: ['The partner needs closeness', 'Emotional hunger'] } },
  NONE: { name: 'No risks', behaviorPattern: '', partnerFeels: [], realLifeSigns: [], plusPotential: { strengths: [], usefulIn: [], safeConditions: [], stillDangerousIf: [] } },
};
const riskES: Record<string, RiskOv> = {
  ABUSER: { name: 'Abusador', behaviorPattern: 'Distorsiona la realidad, humilla bajo la apariencia de cuidado, provoca culpa, desvaloriza', partnerFeels: ['Duda constante de uno mismo', 'Ansiedad', 'Agotamiento emocional', 'Dependencia'], realLifeSigns: ["'Lo hago por ti'", "'Eres demasiado sensible'", 'Humillaciones públicas', 'Dobles raseros'], plusPotential: { strengths: ['Alta inteligencia', 'Pensamiento estratégico', 'Habla fuerte'], usefulIn: ['Gestión', 'Analítica', 'Consultoría', 'Negociaciones'], safeConditions: ['Marcos claros de responsabilidad', 'Una pareja de igual fuerza', 'Acuerdos transparentes'], stillDangerousIf: ['Hay apego personal', 'Un desequilibrio de poder', 'La pareja es más débil o dependiente'] } },
  MANIPULATOR: { name: 'Manipulador', behaviorPattern: 'Presiona a través de las emociones, hace el papel de víctima, traslada la responsabilidad, gestiona a través del miedo a la pérdida', partnerFeels: ['Sentido del deber', "Miedo a decir 'no'", 'Tensión constante', 'Sensación de trampa'], realLifeSigns: ["'No me las arreglo sin ti'", "'Si te vas, me hundo'", 'Las lágrimas como herramienta'], plusPotential: { strengths: ['Una percepción sutil de las personas', 'Empatía', 'Capacidad de gestionar el ambiente'], usefulIn: ['Psicología', 'Coaching', 'RR. HH.', 'Gestión de equipos'], safeConditions: ['Trabajo consciente con los límites', 'Ausencia de celos', 'Transparencia de motivos'], stillDangerousIf: ['Hay dependencia romántica', 'Un vínculo financiero', 'Expectativas ocultas'] } },
  TYRANT: { name: 'Tirano', behaviorPattern: 'Controla las finanzas, dicta las reglas, somete la iniciativa, no tolera objeciones', partnerFeels: ['Miedo', 'Sumisión', 'Pérdida de voluntad', 'Sensación de jaula'], realLifeSigns: ["'Yo sé mejor'", "'Sin mí no eres nadie'", 'Control del tiempo, el dinero, los contactos'], plusPotential: { strengths: ['Estructura rígida', 'Responsabilidad', 'Capacidad de sostener sistemas'], usefulIn: ['Negocios', 'Gestión', 'Finanzas', 'Seguridad'], safeConditions: ['Poder limitado por reglas', 'Hay control externo', 'La pareja no es dependiente'], stillDangerousIf: ['Sin límites', 'Dependencia emocional o financiera'] } },
  CODEPENDENT: { name: 'Codependiente', behaviorPattern: 'Se disuelve en la pareja, aguanta, rescata, no tiene límites', partnerFeels: ['Presión a través del cuidado', 'La imposibilidad de ser uno mismo', 'Culpa por las propias necesidades'], realLifeSigns: ['Siempre al lado', 'Tolera lo inaceptable', 'Justifica a la pareja'], plusPotential: { strengths: ['Empatía profunda', 'Cuidado', 'Devoción'], usefulIn: ['Profesiones de ayuda', 'Servicio', 'Apoyo'], safeConditions: ['Límites personales', 'Igualdad en la relación', 'Una vida propia fuera de la pareja'], stillDangerousIf: ['La pareja se aprovecha', 'Sin intereses propios', 'Pérdida de identidad'] } },
  ESCAPER: { name: 'El que huye', behaviorPattern: 'Desaparece en vez de dialogar, no cierra las conversaciones, deja en la incertidumbre', partnerFeels: ['Incertidumbre', 'Espera', 'Ansiedad', 'Sensación de abandono'], realLifeSigns: ['Desaparece sin explicación', 'No responde a las preguntas', 'Se repliega en sí mismo'], plusPotential: { strengths: ['Capacidad de cerrar etapas', 'No guarda rencor', 'No destruye abiertamente'], usefulIn: ['Trabajo por proyectos', 'Tareas a corto plazo', 'Consultas'], safeConditions: ['Sin expectativas de estabilidad', 'Plazos claros', 'Un formato fijo'], stillDangerousIf: ['La pareja espera cercanía', 'Hay implicación emocional'] } },
  CONTROLLER: { name: 'Controlador', behaviorPattern: 'Controla a través de la estructura, el dinero o el cuidado, exige cuentas', partnerFeels: ['Falta de libertad', 'La necesidad de justificarse', 'Presión'], realLifeSigns: ['Revisa el teléfono', 'Controla los gastos', 'Exige cuentas del tiempo'], plusPotential: { strengths: ['Organización', 'Fiabilidad', 'Responsabilidad'], usefulIn: ['Gestión', 'Finanzas', 'Logística'], safeConditions: ['Control sobre los procesos, no sobre las personas', 'Respeto por los límites', 'Confianza'], stillDangerousIf: ['Control sobre la pareja', 'Sin confianza', 'Celos'] } },
  COLD: { name: 'Emocionalmente frío', behaviorPattern: 'Distancia, distanciamiento, ausencia de cercanía emocional', partnerFeels: ['Soledad en la pareja', 'Ser incomprendido', 'Rechazo'], realLifeSigns: ['No expresa sentimientos', 'Evita la cercanía', 'Calla en los conflictos'], plusPotential: { strengths: ['Estabilidad', 'Racionalidad', 'Independencia'], usefulIn: ['Analítica', 'Investigación', 'Trabajo individual'], safeConditions: ['La pareja no espera emotividad', 'Respeto por el espacio', 'Otras fuentes de emoción'], stillDangerousIf: ['La pareja necesita cercanía', 'Hambre emocional'] } },
  NONE: { name: 'Sin riesgos', behaviorPattern: '', partnerFeels: [], realLifeSigns: [], plusPotential: { strengths: [], usefulIn: [], safeConditions: [], stillDangerousIf: [] } },
};

// ---------- business types (by "c-a" key) ----------
const bizEN: Record<string, BizOv> = {
  '1-4': { typeName: 'Practical leader', strengths: ['Initiative', 'System'], risks: ['Rigidity'], bestFor: ['Management', 'Operations'] },
  '1-8': { typeName: 'Dictator', strengths: ['Power', 'Control'], risks: ['Suppression', 'Authoritarianism'], bestFor: ['Crisis management'] },
  '3-5': { typeName: 'Ideas person without execution', strengths: ['Ideas', 'Creativity'], risks: ['Missed deadlines', 'Quits'], bestFor: ['Consulting', 'Project start'] },
  '4-4': { typeName: 'Systematic partner', strengths: ['Structure', 'Reliability'], risks: ['Inflexibility'], bestFor: ['Operations', 'Finance'] },
  '5-5': { typeName: 'Chaotic startupper', strengths: ['Risk', 'Speed'], risks: ['Chaos', 'Instability'], bestFor: ['Startups', 'MVP'] },
  '6-6': { typeName: 'The one who carries everything', strengths: ['Responsibility', 'Holding things together'], risks: ['Burnout', 'Resentment'], bestFor: ['Operations', 'Service'] },
  '7-7': { typeName: 'Lone analyst', strengths: ['Analysis', 'Strategy'], risks: ['Withdrawal', 'Paralysis'], bestFor: ['Analytics', 'Research'] },
  '8-4': { typeName: 'Tough manager', strengths: ['Finance', 'Control'], risks: ['Pressure'], bestFor: ['Management', 'Investment'] },
  '9-4': { typeName: 'Strategist', strengths: ['Scale', 'Completion'], risks: ['Detachment'], bestFor: ['Strategy', 'Closing projects'] },
};
const bizES: Record<string, BizOv> = {
  '1-4': { typeName: 'Directivo práctico', strengths: ['Iniciativa', 'Sistema'], risks: ['Rigidez'], bestFor: ['Gestión', 'Operativa'] },
  '1-8': { typeName: 'Dictador', strengths: ['Poder', 'Control'], risks: ['Sometimiento', 'Autoritarismo'], bestFor: ['Gestión de crisis'] },
  '3-5': { typeName: 'Ideólogo sin ejecución', strengths: ['Ideas', 'Creatividad'], risks: ['Incumple plazos', 'Abandona'], bestFor: ['Consultoría', 'Arranque de proyecto'] },
  '4-4': { typeName: 'Socio sistemático', strengths: ['Estructura', 'Fiabilidad'], risks: ['Inflexibilidad'], bestFor: ['Operativa', 'Finanzas'] },
  '5-5': { typeName: 'Emprendedor caótico', strengths: ['Riesgo', 'Velocidad'], risks: ['Caos', 'Inestabilidad'], bestFor: ['Startups', 'MVP'] },
  '6-6': { typeName: 'El que carga con todo', strengths: ['Responsabilidad', 'Sostener'], risks: ['Agotamiento', 'Rencor'], bestFor: ['Operativa', 'Servicio'] },
  '7-7': { typeName: 'Analista solitario', strengths: ['Análisis', 'Estrategia'], risks: ['Hermetismo', 'Parálisis'], bestFor: ['Analítica', 'Investigación'] },
  '8-4': { typeName: 'Gestor duro', strengths: ['Finanzas', 'Control'], risks: ['Presión'], bestFor: ['Gestión', 'Inversión'] },
  '9-4': { typeName: 'Estratega', strengths: ['Escala', 'Cierre'], risks: ['Distanciamiento'], bestFor: ['Estrategia', 'Cierre de proyectos'] },
};

// ---------- critical combinations (by danger string ru → loc) ----------
const criticalEN: Record<string, string> = {
  'Манипулятивный абьюзер': 'Manipulative abuser', 'Холодный контролёр': 'Cold controller', 'Токсичная зависимость': 'Toxic dependence', 'Паранойя': 'Paranoia', 'Война эго': 'War of egos', 'Абьюзер-тиран': 'Abuser-tyrant', 'Созависимая ловушка': 'Codependent trap', '«Золотая клетка»': "'Golden cage'",
};
const criticalES: Record<string, string> = {
  'Манипулятивный абьюзер': 'Abusador manipulador', 'Холодный контролёр': 'Controlador frío', 'Токсичная зависимость': 'Dependencia tóxica', 'Паранойя': 'Paranoia', 'Война эго': 'Guerra de egos', 'Абьюзер-тиран': 'Abusador-tirano', 'Созависимая ловушка': 'Trampa codependiente', '«Золотая клетка»': "'Jaula de oro'",
};

// ---------- verdict strings ----------
type VerdictStrings = {
  statusLabel: { GREEN: string; YELLOW: string; RED: string };
  unifiedFallback: string;
  plusPotential: (strengths: string, usefulIn: string) => string;
  plusPotentialFallback: string;
  partnerInPlus: string[];
  recommendation: { GREEN: { love: string; business: string }; YELLOW: { love: string; business: string }; RED: { love: string; business: string } };
  exitChecklist: string[];
};
const verdictEN: VerdictStrings = {
  statusLabel: { GREEN: 'OK', YELLOW: 'CAUTION', RED: 'RUN' },
  unifiedFallback: 'A standard relationship dynamic without pronounced risks',
  plusPotential: (s, u) => `With awareness: ${s}. Useful in: ${u}.`,
  plusPotentialFallback: 'Potential for a healthy relationship with mutual respect',
  partnerInPlus: ['A sense of support', 'Stability', 'Growth'],
  recommendation: {
    GREEN: { love: 'The union has a healthy potential with mutual respect and boundaries', business: 'The partnership is promising with clear agreements' },
    YELLOW: { love: 'The union is possible, but requires awareness and clear boundaries. Without work on the relationship it goes into the minus', business: 'The partnership is possible with firm agreements, deadlines and checkpoints' },
    RED: { love: 'This pairing carries a destructive scenario. Deepening the relationship increases the damage', business: 'The partnership is extremely risky. Only within strict legal frameworks' },
  },
  exitChecklist: ['Financial autonomy', 'Stopping the discussions', 'Recording the facts', 'Distance', 'This scenario is not cured by talking — only by action'],
};
const verdictES: VerdictStrings = {
  statusLabel: { GREEN: 'SE PUEDE', YELLOW: 'PRECAUCIÓN', RED: 'HUYE' },
  unifiedFallback: 'Una dinámica de relación estándar sin riesgos pronunciados',
  plusPotential: (s, u) => `Con conciencia: ${s}. Útil en: ${u}.`,
  plusPotentialFallback: 'Potencial para una relación sana con respeto mutuo',
  partnerInPlus: ['Sensación de apoyo', 'Estabilidad', 'Desarrollo'],
  recommendation: {
    GREEN: { love: 'La unión tiene un potencial sano con respeto mutuo y límites', business: 'La asociación es prometedora con acuerdos claros' },
    YELLOW: { love: 'La unión es posible, pero requiere conciencia y límites claros. Sin trabajar la relación, cae en el minus', business: 'La asociación es posible con acuerdos firmes, plazos y puntos de control' },
    RED: { love: 'Este dúo lleva un guion destructivo. Profundizar la relación aumenta el daño', business: 'La asociación es muy arriesgada. Solo dentro de marcos legales estrictos' },
  },
  exitChecklist: ['Autonomía financiera', 'Detener las discusiones', 'Registrar los hechos', 'Distancia', 'Este guion no se cura hablando, solo con acción'],
};

// ---------- accessors ----------
const merge = <T extends object>(base: T, ov?: Partial<T>): T => (ov ? { ...base, ...ov } : base);

export function localizePattern<T extends { id: string }>(p: T): T {
  const lang = i18n.language;
  if (lang !== 'en' && lang !== 'es') return p;
  return merge(p, (lang === 'en' ? patEN : patES)[p.id] as Partial<T>);
}
export function localizeConflict<T extends { numbers: [number, number] }>(c: T): T {
  const lang = i18n.language;
  if (lang !== 'en' && lang !== 'es') return c;
  const key = `${c.numbers[0]}-${c.numbers[1]}`;
  return merge(c, (lang === 'en' ? confEN : confES)[key] as Partial<T>);
}
export function localizeRisk<T extends { type: string }>(r: T): T {
  const lang = i18n.language;
  if (lang !== 'en' && lang !== 'es') return r;
  return merge(r, (lang === 'en' ? riskEN : riskES)[r.type] as Partial<T>);
}
export function localizeBusinessType<T extends { consciousness: number; action: number }>(b: T): T {
  const lang = i18n.language;
  if (lang !== 'en' && lang !== 'es') return b;
  return merge(b, (lang === 'en' ? bizEN : bizES)[`${b.consciousness}-${b.action}`] as Partial<T>);
}
export function localizeCritical(danger: string): string {
  const lang = i18n.language;
  if (lang === 'en') return criticalEN[danger] || danger;
  if (lang === 'es') return criticalES[danger] || danger;
  return danger;
}
export function getVerdictStrings(lang: string): VerdictStrings | null {
  if (lang === 'en') return verdictEN;
  if (lang === 'es') return verdictES;
  return null;
}
