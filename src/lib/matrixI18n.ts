// Переводы контента матрицы предназначения (EN, ES). Накладываются поверх русской базы.
// Непереведённые поля показываются по-русски (fallback).

export type DeepMeaning = { lifeContext: string; earnContext: string; loseContext: string };
export type Traits = { strengths: string[]; weaknesses: string[]; recommendations: string[] };

// ===== Заголовки позиций =====
export const positionTitleOverlays: Record<string, Record<number, string>> = {
  en: {
    1: "Childhood",
    2: "Inner essence",
    3: "Talents and qualities",
    4: "Goal of accumulating wisdom",
    5: "Professional orientation",
    6: "Point of support",
    7: "Life goal",
    8: "Way to achieve the goal",
    9: "Comfort zone",
    10: "Unfulfilled tasks",
    11: "Mistakes of the past",
    12: "Main karmic task",
  },
  es: {
    1: "Infancia",
    2: "Esencia interior",
    3: "Talentos y cualidades",
    4: "Meta de acumular sabiduría",
    5: "Orientación profesional",
    6: "Punto de apoyo",
    7: "Meta de vida",
    8: "Forma de alcanzar la meta",
    9: "Zona de confort",
    10: "Tareas no cumplidas",
    11: "Errores del pasado",
    12: "Tarea kármica principal",
  },
};

// ===== Глубокие трактовки позиций =====
const deepEn: Record<number, DeepMeaning> = {
  1: {
    lifeContext: "This energy sets the backdrop of all of childhood and youth. It determines how the person perceived the world at an early age, what attitudes were laid down, what traumas or resources were formed.",
    earnContext: "Using childhood patterns as a resource: adaptation skills, early independence, the ability to find a way out of difficult situations.",
    loseContext: "Getting stuck in childhood scripts, repeating parental mistakes, infantilism in decision-making.",
  },
  2: {
    lifeContext: "The inner essence is the core of the personality, which doesn't change with age. It's how the person feels when alone with themselves, their deepest motivation and values.",
    earnContext: "Accepting yourself as you are. Using inner qualities as a foundation for professional and personal growth.",
    loseContext: "Ignoring your nature, trying to be someone else, an inner conflict between 'I want' and 'I must'.",
  },
  3: {
    lifeContext: "Social realization — how a person manifests themselves in society. This energy is activated when interacting with others and determines the style of communication and self-presentation.",
    earnContext: "Developing social skills, networking, the ability to sell your ideas and talents. Public activity.",
    loseContext: "Social anxiety, an inability to promote yourself, dependence on others' opinions, a toxic environment.",
  },
  4: {
    lifeContext: "The goal of accumulating wisdom is the vector of long-term development. By age 50, this energy becomes leading and determines what the person will devote their mature years to.",
    earnContext: "Strategic thinking, mentorship, passing on experience. Long-term investment in education and development.",
    loseContext: "Refusing to develop after a certain age, rigidity of thinking, unreadiness for change.",
  },
  5: {
    lifeContext: "Professional orientation indicates the field in which a person can achieve maximum results. It's not a specific profession, but a type of activity.",
    earnContext: "Following your professional calling, choosing work you love, monetizing your talents.",
    loseContext: "Working against your calling, chasing money at the expense of self-realization, professional burnout.",
  },
  6: {
    lifeContext: "The point of support is the zone of greatest comfort and at the same time a trap. Here it's easiest for the person, but it's precisely this pattern they need to gradually move away from.",
    earnContext: "Using accumulated experience as a springboard for the new. The ability to lean on the proven, but keep moving forward.",
    loseContext: "Fixation on the familiar, fear of the new, stagnation in the comfort zone, refusal to grow.",
  },
  7: {
    lifeContext: "The life goal is the main reference point that switches on by age 35. It's precisely toward this energy that a person moves their whole life, consciously or not.",
    earnContext: "Conscious movement toward the goal, setting ambitious tasks, going beyond the usual.",
    loseContext: "Ignoring your purpose, living 'on autopilot', a lack of meaning and direction.",
  },
  8: {
    lifeContext: "The instrument of achieving the goal — the specific method or energy through which the life goal of position 7 is realized.",
    earnContext: "Purposefully developing skills related to this energy. This is the 'how' you achieve your 'why'.",
    loseContext: "Using unsuitable methods, copying others' strategies, ignoring your unique instruments.",
  },
  9: {
    lifeContext: "The comfort zone is a state of maximum relaxation and resource. It's the energy a person returns to in order to recover.",
    earnContext: "Consciously using the resourceful state for recovery and recharging. A balance between activity and rest.",
    loseContext: "Retreating into comfort as a way to avoid reality, laziness, procrastination, stagnation.",
  },
  10: {
    lifeContext: "Unfulfilled karmic tasks are what was 'inherited' from the past. Energies that require working through and transformation in this life.",
    earnContext: "Awareness and acceptance of karmic tasks. Turning weak spots into points of strength through conscious work.",
    loseContext: "Ignoring recurring problems, blaming circumstances, refusing inner work.",
  },
  11: {
    lifeContext: "Mistakes of the past are patterns that repeat until they're recognized. These are automatic reactions and scripts that run 'by default'.",
    earnContext: "Recognizing and transforming destructive patterns. Conscious choice instead of automatic reactions.",
    loseContext: "Repeating the same mistakes, 'stepping on the same rake', an unwillingness to change.",
  },
  12: {
    lifeContext: "The main karmic task is the single key task of the whole life. If it's solved, the other karmic knots untie automatically.",
    earnContext: "Focus on solving the main task. This is the key to everything: when this task is solved, life changes dramatically.",
    loseContext: "Scattering on the secondary, avoiding the key challenge, replacing the main thing with busyness.",
  },
};

const deepEs: Record<number, DeepMeaning> = {
  1: {
    lifeContext: "Esta energía marca el trasfondo de toda la infancia y la juventud. Determina cómo percibía la persona el mundo a temprana edad, qué creencias se asentaron, qué traumas o recursos se formaron.",
    earnContext: "Usar los patrones de la infancia como recurso: habilidades de adaptación, independencia temprana, capacidad de hallar salida a situaciones difíciles.",
    loseContext: "Quedarse atascado en guiones infantiles, repetir los errores de los padres, infantilismo en la toma de decisiones.",
  },
  2: {
    lifeContext: "La esencia interior es el núcleo de la personalidad, que no cambia con la edad. Es cómo se siente la persona a solas consigo misma, su motivación y sus valores más profundos.",
    earnContext: "Aceptarse tal como uno es. Usar las cualidades internas como base para el crecimiento profesional y personal.",
    loseContext: "Ignorar la propia naturaleza, intentar ser otro, un conflicto interno entre el 'quiero' y el 'debo'.",
  },
  3: {
    lifeContext: "La realización social — cómo se manifiesta la persona en la sociedad. Esta energía se activa al interactuar con otros y determina el estilo de comunicación y autopresentación.",
    earnContext: "Desarrollar habilidades sociales, networking, la capacidad de vender tus ideas y talentos. Actividad pública.",
    loseContext: "Ansiedad social, incapacidad de promocionarse, dependencia de la opinión ajena, un entorno tóxico.",
  },
  4: {
    lifeContext: "La meta de acumular sabiduría es el vector del desarrollo a largo plazo. Hacia los 50 años esta energía se vuelve dominante y determina a qué dedicará la persona sus años de madurez.",
    earnContext: "Pensamiento estratégico, mentoría, transmitir experiencia. Inversión a largo plazo en educación y desarrollo.",
    loseContext: "Renunciar al desarrollo a partir de cierta edad, rigidez de pensamiento, falta de disposición al cambio.",
  },
  5: {
    lifeContext: "La orientación profesional indica el campo en el que una persona puede lograr los máximos resultados. No es una profesión concreta, sino un tipo de actividad.",
    earnContext: "Seguir tu vocación profesional, elegir un trabajo que ames, monetizar tus talentos.",
    loseContext: "Trabajar en contra de tu vocación, perseguir el dinero a costa de la autorrealización, el desgaste profesional.",
  },
  6: {
    lifeContext: "El punto de apoyo es la zona de mayor confort y, a la vez, una trampa. Aquí es donde más fácil le resulta a la persona, pero es precisamente este patrón del que debe alejarse poco a poco.",
    earnContext: "Usar la experiencia acumulada como trampolín hacia lo nuevo. La capacidad de apoyarse en lo probado, pero seguir avanzando.",
    loseContext: "Fijación en lo habitual, miedo a lo nuevo, estancamiento en la zona de confort, renuncia a crecer.",
  },
  7: {
    lifeContext: "La meta de vida es el punto de referencia principal que se activa hacia los 35 años. Es precisamente hacia esta energía hacia la que la persona se mueve toda su vida, consciente o no.",
    earnContext: "Movimiento consciente hacia la meta, plantearse tareas ambiciosas, ir más allá de lo habitual.",
    loseContext: "Ignorar tu propósito, vivir 'en piloto automático', falta de sentido y dirección.",
  },
  8: {
    lifeContext: "El instrumento para alcanzar la meta — el método o la energía concreta a través de la cual se realiza la meta de vida de la posición 7.",
    earnContext: "Desarrollar a propósito las habilidades ligadas a esta energía. Es el 'cómo' alcanzas tu 'para qué'.",
    loseContext: "Usar métodos inadecuados, copiar estrategias ajenas, ignorar tus instrumentos únicos.",
  },
  9: {
    lifeContext: "La zona de confort es un estado de máxima relajación y recurso. Es la energía a la que la persona regresa para recuperarse.",
    earnContext: "Usar conscientemente el estado de recurso para recuperarse y recargarse. Un equilibrio entre actividad y descanso.",
    loseContext: "Refugiarse en el confort como forma de evitar la realidad, pereza, procrastinación, estancamiento.",
  },
  10: {
    lifeContext: "Las tareas kármicas no cumplidas son lo que se 'heredó' del pasado. Energías que requieren ser trabajadas y transformadas en esta vida.",
    earnContext: "Tomar conciencia y aceptar las tareas kármicas. Convertir los puntos débiles en puntos de fuerza mediante el trabajo consciente.",
    loseContext: "Ignorar los problemas recurrentes, culpar a las circunstancias, rechazar el trabajo interior.",
  },
  11: {
    lifeContext: "Los errores del pasado son patrones que se repiten hasta ser reconocidos. Son reacciones automáticas y guiones que funcionan 'por defecto'.",
    earnContext: "Reconocer y transformar los patrones destructivos. Elección consciente en lugar de reacciones automáticas.",
    loseContext: "Repetir los mismos errores, 'tropezar con la misma piedra', falta de voluntad para cambiar.",
  },
  12: {
    lifeContext: "La tarea kármica principal es la única tarea clave de toda la vida. Si se resuelve, los demás nudos kármicos se desatan automáticamente.",
    earnContext: "Centrarse en resolver la tarea principal. Es la clave de todo: cuando se resuelve, la vida cambia radicalmente.",
    loseContext: "Dispersarse en lo secundario, evitar el reto clave, sustituir lo principal por el ajetreo.",
  },
};

// ===== Черты арканов (сильные/слабые стороны, рекомендации) =====
const traitsEn: Record<number, Traits> = {
  1: { strengths: ["Oratory talent", "Resourcefulness", "Ability to start from scratch", "Versatility", "Gift of persuasion"], weaknesses: ["Superficiality", "Scatteredness", "Unfinished affairs", "Manipulativeness"], recommendations: ["Choose one main direction and go deeper", "Develop speech and writing", "Start acting without waiting for perfect conditions"] },
  2: { strengths: ["Strong intuition", "Empathy", "Wisdom", "Patience", "Energetic sensitivity"], weaknesses: ["Indecisiveness", "Passivity", "Retreat into illusions", "Dependence on others' opinions"], recommendations: ["Trust intuition, but check the facts", "Develop independence in decision-making", "Practice meditation"] },
  3: { strengths: ["Ability to earn", "Creative approach", "Attractiveness", "Practicality", "Domesticity"], weaknesses: ["Materialism", "Fixation on appearance", "Jealousy", "Wastefulness"], recommendations: ["Create beauty around you", "Invest in comfort, but not in luxury for status", "Develop parental qualities"] },
  4: { strengths: ["Leadership", "Organizational skills", "Responsibility", "Systemic thinking", "Determination"], weaknesses: ["Authoritarianism", "Excessive control", "Rigidity", "Inability to relax"], recommendations: ["Learn to delegate", "Develop flexibility", "Balance between control and trust"] },
  5: { strengths: ["Wisdom", "Morality", "Ability to teach", "Deep knowledge", "Following traditions"], weaknesses: ["Moralizing", "Dogmatism", "Inflexibility", "Judging others"], recommendations: ["Share knowledge without imposing", "Be open to the new", "Learn from your students"] },
  6: { strengths: ["Charm", "Ability to choose", "Sense of beauty", "Romanticism", "Diplomacy"], weaknesses: ["Indecisiveness in choice", "Dependence on relationships", "Superficial feelings", "Inconstancy"], recommendations: ["Learn to make the final choice", "Don't confuse love with attachment", "Develop self-sufficiency"] },
  7: { strengths: ["Determination", "Success in movement", "Energy", "Ability to win", "Charisma"], weaknesses: ["Impatience", "Aggressiveness", "Inability to stop", "Burnout"], recommendations: ["Move toward the goal, but take breaks", "Choose your battles consciously", "Control aggression"] },
  8: { strengths: ["Justice", "Analytical mind", "Balance", "Objectivity", "A sense for the law"], weaknesses: ["Excessive criticism", "Coldness", "Perfectionism", "A tendency to judge"], recommendations: ["Apply justice to yourself too", "Don't be too strict", "Develop emotional intelligence"] },
  9: { strengths: ["The wisdom of solitude", "Depth", "Research spirit", "Spirituality", "Self-sufficiency"], weaknesses: ["Withdrawal", "Fear of intimacy", "Depressiveness", "Misanthropy"], recommendations: ["Accept periods of solitude as a resource", "Don't isolate from the world", "Find a balance between solitude and communication"] },
  10: { strengths: ["Luck", "Ability to use chances", "Optimism", "Adaptability", "Cyclicity"], weaknesses: ["Inconstancy", "Recklessness", "Dependence on luck", "Irresponsibility"], recommendations: ["Use luck, but don't rely on it alone", "Create backup plans", "Learn to see cycles"] },
  11: { strengths: ["Inner strength", "Resilience", "Endurance", "Bravery", "Ability to overcome"], weaknesses: ["Brute force instead of wisdom", "Stubbornness", "Inability to ask for help", "Exhaustion"], recommendations: ["Use gentle strength", "Accept help", "Restore your resources regularly"] },
  12: { strengths: ["Self-sacrifice", "Deep understanding of suffering", "Spiritual transformation", "Mercy"], weaknesses: ["Self-sacrifice as a habit", "Codependency", "Self-flagellation", "Passivity"], recommendations: ["Distinguish self-sacrifice from sacrifice", "Set boundaries", "Transform pain into wisdom"] },
  13: { strengths: ["Transformation", "Ability to let go", "Renewal", "Depth of change", "Cleansing"], weaknesses: ["Fear of change", "Destructiveness", "Tendency to destroy the good", "Fixation on the past"], recommendations: ["Accept natural endings", "Don't cling to the outlived", "Every ending is a new beginning"] },
  14: { strengths: ["Temperance", "Balance", "Patience", "Harmony", "Healing"], weaknesses: ["Excessive caution", "Indecisiveness", "Boredom", "Avoiding extremes"], recommendations: ["Seek the golden mean, but don't fear risk", "Develop patience as strength", "Harmonize all areas of life"] },
  15: { strengths: ["Magnetism", "Sexuality", "Financial talent", "Power over matter", "Charisma"], weaknesses: ["Addictions", "Manipulation", "Greed", "Obsession with power"], recommendations: ["Use charisma ethically", "Watch out for addictions", "Material success is a tool, not a goal"] },
  16: { strengths: ["Capacity for radical change", "Stress resistance", "Rebuilding from scratch", "Honesty"], weaknesses: ["Catastrophic thinking", "Self-sabotage", "Destroying stability", "Conflict-proneness"], recommendations: ["Build on a solid foundation", "Don't destroy for the sake of destruction", "Accept crises as growth points"] },
  17: { strengths: ["Hope", "Inspiration", "Creativity", "Openness to the universe", "Healing energy"], weaknesses: ["Naivety", "Detachment from reality", "Fragility", "Dependence on inspiration"], recommendations: ["Keep hope, but act practically", "Develop creative talents", "Be a beacon for others"] },
  18: { strengths: ["Deep intuition", "Connection with the unconscious", "Creative imagination", "Sensitivity"], weaknesses: ["Fears", "Phobias", "Deception", "Illusions", "Anxiety"], recommendations: ["Work with fears consciously", "Distinguish intuition from anxiety", "Use imagination in creativity"] },
  19: { strengths: ["Joyfulness", "Success", "Vitality", "Generosity", "Leadership through inspiration"], weaknesses: ["Egocentrism", "Burnout from excessive activity", "Need for admiration", "Pride"], recommendations: ["Shine, but don't blind", "Share energy with others", "Stay humble in success"] },
  20: { strengths: ["Reevaluation of values", "Spiritual awakening", "Family karma", "Healing the lineage"], weaknesses: ["Fixation on the past", "Guilt", "Family pressure", "Unwillingness to change"], recommendations: ["Heal the relationship with your lineage", "Take responsibility for your life", "Let go of others' expectations"] },
  21: { strengths: ["Completeness", "Success", "Wholeness", "Worldview", "Achieving the highest goal"], weaknesses: ["Stagnation after achievement", "Loss of motivation", "Arrogance", "Closedness to the new"], recommendations: ["Every achievement is a step to the next", "Share your success", "Stay open to growth"] },
  22: { strengths: ["Freedom", "Unconventional thinking", "Creative genius", "Unpredictability as strength"], weaknesses: ["Irresponsibility", "Chaos", "Infantilism", "Inability to commit"], recommendations: ["Turn chaos into creativity", "Learn to finish what you start", "Freedom is responsibility"] },
};

const traitsEs: Record<number, Traits> = {
  1: { strengths: ["Talento para la oratoria", "Ingenio", "Capacidad de empezar de cero", "Versatilidad", "Don de persuasión"], weaknesses: ["Superficialidad", "Dispersión", "Asuntos sin terminar", "Tendencia a manipular"], recommendations: ["Elige una dirección principal y profundiza", "Desarrolla el habla y la escritura", "Empieza a actuar sin esperar condiciones perfectas"] },
  2: { strengths: ["Fuerte intuición", "Empatía", "Sabiduría", "Paciencia", "Sensibilidad energética"], weaknesses: ["Indecisión", "Pasividad", "Refugiarse en ilusiones", "Dependencia de la opinión ajena"], recommendations: ["Confía en la intuición, pero comprueba los hechos", "Desarrolla la autonomía al decidir", "Practica la meditación"] },
  3: { strengths: ["Capacidad de ganar dinero", "Enfoque creativo", "Atractivo", "Practicidad", "Sentido del hogar"], weaknesses: ["Materialismo", "Fijación en la apariencia", "Celos", "Despilfarro"], recommendations: ["Crea belleza a tu alrededor", "Invierte en confort, no en lujo por estatus", "Desarrolla cualidades parentales"] },
  4: { strengths: ["Liderazgo", "Capacidad organizativa", "Responsabilidad", "Pensamiento sistémico", "Determinación"], weaknesses: ["Autoritarismo", "Control excesivo", "Rigidez", "Incapacidad de relajarse"], recommendations: ["Aprende a delegar", "Desarrolla la flexibilidad", "Equilibrio entre control y confianza"] },
  5: { strengths: ["Sabiduría", "Moralidad", "Capacidad de enseñar", "Conocimiento profundo", "Seguir las tradiciones"], weaknesses: ["Moralismo", "Dogmatismo", "Inflexibilidad", "Juzgar a los demás"], recommendations: ["Comparte el conocimiento sin imponer", "Mantente abierto a lo nuevo", "Aprende de tus alumnos"] },
  6: { strengths: ["Encanto", "Capacidad de elegir", "Sentido de la belleza", "Romanticismo", "Diplomacia"], weaknesses: ["Indecisión al elegir", "Dependencia de las relaciones", "Sentimientos superficiales", "Inconstancia"], recommendations: ["Aprende a tomar la decisión final", "No confundas amor con apego", "Desarrolla la autosuficiencia"] },
  7: { strengths: ["Determinación", "Éxito en el movimiento", "Energía", "Capacidad de vencer", "Carisma"], weaknesses: ["Impaciencia", "Agresividad", "Incapacidad de detenerse", "Desgaste"], recommendations: ["Avanza hacia la meta, pero haz pausas", "Elige tus batallas conscientemente", "Controla la agresividad"] },
  8: { strengths: ["Justicia", "Mente analítica", "Equilibrio", "Objetividad", "Olfato jurídico"], weaknesses: ["Crítica excesiva", "Frialdad", "Perfeccionismo", "Tendencia a juzgar"], recommendations: ["Aplica la justicia también a ti", "No seas demasiado estricto", "Desarrolla la inteligencia emocional"] },
  9: { strengths: ["La sabiduría de la soledad", "Profundidad", "Espíritu investigador", "Espiritualidad", "Autosuficiencia"], weaknesses: ["Aislamiento", "Miedo a la intimidad", "Tendencia depresiva", "Misantropía"], recommendations: ["Acepta los periodos de soledad como recurso", "No te aísles del mundo", "Halla un equilibrio entre soledad y compañía"] },
  10: { strengths: ["Buena suerte", "Capacidad de aprovechar oportunidades", "Optimismo", "Adaptabilidad", "Ciclicidad"], weaknesses: ["Inconstancia", "Carácter arriesgado", "Dependencia de la suerte", "Irresponsabilidad"], recommendations: ["Usa la suerte, pero no dependas solo de ella", "Crea planes de reserva", "Aprende a ver los ciclos"] },
  11: { strengths: ["Fuerza interior", "Entereza", "Resistencia", "Valentía", "Capacidad de superación"], weaknesses: ["Fuerza bruta en vez de sabiduría", "Terquedad", "Incapacidad de pedir ayuda", "Agotamiento"], recommendations: ["Usa la fuerza suave", "Acepta ayuda", "Recupera tus recursos con regularidad"] },
  12: { strengths: ["Sacrificio", "Comprensión profunda del sufrimiento", "Transformación espiritual", "Misericordia"], weaknesses: ["El sacrificio como hábito", "Codependencia", "Autoflagelación", "Pasividad"], recommendations: ["Distingue el sacrificio del autosacrificio", "Establece límites", "Transforma el dolor en sabiduría"] },
  13: { strengths: ["Transformación", "Capacidad de soltar", "Renovación", "Profundidad del cambio", "Purificación"], weaknesses: ["Miedo al cambio", "Destructividad", "Tendencia a destruir lo bueno", "Fijación en el pasado"], recommendations: ["Acepta los finales naturales", "No te aferres a lo caduco", "Cada final es un nuevo comienzo"] },
  14: { strengths: ["Templanza", "Equilibrio", "Paciencia", "Armonía", "Sanación"], weaknesses: ["Cautela excesiva", "Indecisión", "Aburrimiento", "Evitar los extremos"], recommendations: ["Busca el término medio, pero no temas el riesgo", "Desarrolla la paciencia como fuerza", "Armoniza todas las áreas de la vida"] },
  15: { strengths: ["Magnetismo", "Sexualidad", "Talento financiero", "Poder sobre la materia", "Carisma"], weaknesses: ["Adicciones", "Manipulación", "Avaricia", "Obsesión con el poder"], recommendations: ["Usa el carisma con ética", "Vigila las adicciones", "El éxito material es una herramienta, no una meta"] },
  16: { strengths: ["Capacidad de cambio radical", "Resistencia al estrés", "Reconstruir de nuevo", "Honestidad"], weaknesses: ["Pensamiento catastrófico", "Autosabotaje", "Destruir la estabilidad", "Conflictividad"], recommendations: ["Construye sobre un fundamento sólido", "No destruyas por destruir", "Acepta las crisis como puntos de crecimiento"] },
  17: { strengths: ["Esperanza", "Inspiración", "Creatividad", "Apertura al universo", "Energía sanadora"], weaknesses: ["Ingenuidad", "Desconexión de la realidad", "Fragilidad", "Dependencia de la inspiración"], recommendations: ["Mantén la esperanza, pero actúa con practicidad", "Desarrolla los talentos creativos", "Sé un faro para los demás"] },
  18: { strengths: ["Intuición profunda", "Conexión con el inconsciente", "Imaginación creativa", "Sensibilidad"], weaknesses: ["Miedos", "Fobias", "Engaño", "Ilusiones", "Ansiedad"], recommendations: ["Trabaja los miedos conscientemente", "Distingue la intuición de la ansiedad", "Usa la imaginación en la creatividad"] },
  19: { strengths: ["Alegría de vivir", "Éxito", "Vitalidad", "Generosidad", "Liderazgo por inspiración"], weaknesses: ["Egocentrismo", "Desgaste por actividad excesiva", "Necesidad de admiración", "Soberbia"], recommendations: ["Brilla, pero no deslumbres", "Comparte la energía con los demás", "Mantente humilde en el éxito"] },
  20: { strengths: ["Reevaluación de los valores", "Despertar espiritual", "Karma familiar", "Sanación del linaje"], weaknesses: ["Fijación en el pasado", "Culpa", "Presión de la familia", "Falta de voluntad para cambiar"], recommendations: ["Sana la relación con tu linaje", "Asume la responsabilidad de tu vida", "Suelta las expectativas ajenas"] },
  21: { strengths: ["Plenitud", "Éxito", "Integridad", "Cosmovisión", "Alcanzar la meta más alta"], weaknesses: ["Estancamiento tras el logro", "Pérdida de motivación", "Arrogancia", "Cerrazón a lo nuevo"], recommendations: ["Cada logro es un peldaño hacia el siguiente", "Comparte tu éxito", "Mantente abierto al crecimiento"] },
  22: { strengths: ["Libertad", "Pensamiento no convencional", "Genio creativo", "La imprevisibilidad como fuerza"], weaknesses: ["Irresponsabilidad", "Caos", "Infantilismo", "Incapacidad de comprometerse"], recommendations: ["Convierte el caos en creatividad", "Aprende a terminar lo que empiezas", "La libertad es responsabilidad"] },
};

export const matrixDeepOverlays: Record<string, Record<number, DeepMeaning>> = { en: deepEn, es: deepEs };
export const matrixTraitsOverlays: Record<string, Record<number, Traits>> = { en: traitsEn, es: traitsEs };
