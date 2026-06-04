// EN/ES translations for the extra year-forecast sections (yearForecastExtra.ts).
// Parallel language path: the Russian base stays untouched and is used as fallback (lang 'ru').

import { getArcana } from "@/lib/arcana";
import type { YearExtraSections } from "./yearForecastExtra";

type Lang = 'en' | 'es';
type Exam = { q: string; plus: string[]; minus: string[] };

// ---- Arcana 1 — full hand-written ----
const extra1EN: YearExtraSections = {
  healingThemes: [
    "Healing the fear of starting something new",
    "Overcoming dependence on others' opinions",
    "Drawing up a psychological 'marriage will'",
    "Taking responsibility for past choices without regret",
    "Working through the relationship with the father or a male figure in the family",
  ],
  birthdayRitual: [
    "On your birthday, perform a ritual of closing the old cycle and opening the new one",
    "Make a list of 22 goals for the new 22-year cycle",
    "Light a candle and speak your intentions for the coming year out loud",
    "Spend an hour in complete silence — no phone, music or conversations",
    "Write down the 3 main lessons of the past year and give thanks for them",
  ],
  mainExam: {
    question: "Will you be able to use your energy properly? Will you be able to create rather than destroy?",
    plusAnswers: [
      "Material gain, prosperity, wealth, abundance",
      "Gaining power and social status",
      "A manifestation of health",
      "Living with zest, cheerfulness, positivity, optimism",
      "Reaching a new level",
      "Social activity, charity, patronage",
      "Creating a large-scale project",
      "Your own business, organizational work",
      "Mending relationships with loved ones / someone",
      "Filling life with joy",
    ],
    minusAnswers: [
      "Wastefulness, depression, despondency",
      "Inner overconfidence → relying on chance",
      "Worsening of relationships or a crisis when things come to light",
      "Judging and criticizing everyone and everything",
      "Deceit, fraud, empty promises",
      "Problems with payment tools, business surprises",
      "Missed opportunities",
    ],
  },
  yearTasks: [
    "Not to fall into extremes, but to find balance",
    "To learn to manage reality and reach a state of relaxation and consciousness",
    "To learn to command respect through 'no' and 'yes'",
    "To show growth only from a state of awareness",
    "When you start to doubt your self-knowledge and values — 'pause', write down the questions, stop, observe from the side",
    "To develop spiritually",
    "To pursue money for the soul, without fixating on small surrounding things",
    "To love the masculine and the feminine",
  ],
  lifeSphereThemes: [
    "Joint ventures, gatherings with relatives, communication, family",
    "Shared psychological work as a couple",
    "Building in conscious pauses",
    "Bringing responsibility and tradition into family values",
  ],
};

const extra1ES: YearExtraSections = {
  healingThemes: [
    "Sanar el miedo a empezar algo nuevo",
    "Superar la dependencia de la opinión ajena",
    "Redactar un 'testamento matrimonial' psicológico",
    "Asumir la responsabilidad por las elecciones pasadas, sin lamentarlas",
    "Trabajar la relación con el padre o una figura masculina de la familia",
  ],
  birthdayRitual: [
    "El día de tu cumpleaños, realiza un ritual de cierre del ciclo viejo y apertura del nuevo",
    "Haz una lista de 22 metas para el nuevo ciclo de 22 años",
    "Enciende una vela y pronuncia en voz alta tus intenciones para el año que viene",
    "Pasa una hora en completo silencio: sin teléfono, música ni conversaciones",
    "Anota las 3 lecciones principales del año pasado y agradécelas",
  ],
  mainExam: {
    question: "¿Sabrás gestionar tu energía correctamente? ¿Sabrás crear en lugar de destruir?",
    plusAnswers: [
      "Ganancia material, prosperidad, riqueza, abundancia",
      "Obtención de poder y estatus social",
      "Una manifestación de salud",
      "Vivir con gusto, alegría, positividad, optimismo",
      "Alcanzar un nuevo nivel",
      "Actividad social, beneficencia, mecenazgo",
      "Crear un proyecto a gran escala",
      "Negocio propio, trabajo organizativo",
      "Reconciliar relaciones con seres queridos / con alguien",
      "Llenar la vida de alegría",
    ],
    minusAnswers: [
      "Despilfarro, depresión, desánimo",
      "Exceso de confianza interior → confiar en la suerte",
      "Empeoramiento de relaciones o crisis cuando las cosas salen a la luz",
      "Juzgar y criticar a todos y a todo",
      "Engaño, fraude, promesas vacías",
      "Problemas con instrumentos de pago, sorpresas en los negocios",
      "Oportunidades perdidas",
    ],
  },
  yearTasks: [
    "No caer en extremos, sino encontrar el equilibrio",
    "Aprender a gestionar la realidad y alcanzar un estado de relajación y conciencia",
    "Aprender a hacerse respetar mediante el 'no' y el 'sí'",
    "Mostrar crecimiento solo desde un estado de conciencia",
    "Cuando empieces a dudar de tu autoconocimiento y tus valores, 'haz una pausa', anota las preguntas, detente, observa desde fuera",
    "Desarrollarte espiritualmente",
    "Ir tras el dinero para el alma, sin fijarte en las pequeñas cosas del entorno",
    "Amar lo masculino y lo femenino",
  ],
  lifeSphereThemes: [
    "Empresas conjuntas, reuniones con familiares, comunicación, familia",
    "Trabajo psicológico conjunto en pareja",
    "Incorporar pausas conscientes",
    "Llevar la responsabilidad y la tradición a los valores familiares",
  ],
};

// ---- Healing themes (2–22) ----
const healingEN: Record<number, string[]> = {
  2: ["Healing the bond with the mother and the female line of the lineage", "Accepting your intuitive nature", "Overcoming the fear of loneliness", "Restoring trust in yourself and the world", "Working through suppressed emotions"],
  3: ["Healing the relationship with the body and sexuality", "Accepting your attractiveness and worth", "Overcoming greed or extravagance", "Restoring the creative flow", "Working through the fear of scarcity"],
  4: ["Healing the relationship with the father and authorities", "Overcoming the fear of responsibility", "Working with control and perfectionism", "Restoring the balance between work and life", "Working through rigidity and inflexibility"],
  5: ["Healing the relationship with education and teachers", "Overcoming dogmatism and fanaticism", "Working with guilt over 'wrong' choices", "Restoring the connection with spirituality", "Working through the fear of judgement"],
  6: ["Healing wounds in romantic relationships", "Overcoming indecision and the fear of choice", "Working with dependence on a partner", "Restoring the ability to love unconditionally", "Working through jealousy and possessiveness"],
  7: ["Healing the fear of movement and change", "Overcoming aggression and impatience", "Working with the 'hamster wheel' syndrome", "Restoring the connection of body and mind", "Working through competition and rivalry"],
  8: ["Healing the relationship with justice and the law", "Overcoming resentment and vindictiveness", "Working with karmic debts", "Restoring inner balance", "Working through self-sacrifice"],
  9: ["Healing the fear of loneliness and isolation", "Overcoming depression and apathy", "Working with addictions (alcohol, escaping reality)", "Restoring the connection with the inner sage", "Working through hermitism as escape"],
  10: ["Healing the fear of the unknown and change", "Overcoming dependence on stability", "Working with gambling and risky behavior", "Restoring trust in life", "Working through resignation to fate"],
  11: ["Healing suppressed anger and aggression", "Overcoming a tendency to conflict", "Working with energy and its constructive direction", "Restoring strength through gentleness", "Working through violence (active or passive)"],
  12: ["Healing sacrificial patterns", "Overcoming illusions and self-deception", "Working with a 'suspended' state in life", "Restoring clarity of vision", "Working through a tendency toward reckless ventures"],
  13: ["Healing the fear of death and change", "Overcoming attachment to the past", "Working with grief and loss", "Restoring the ability to let go", "Working through the inability to complete things"],
  14: ["Healing extremes and addictions", "Overcoming fanaticism (diets, sport, work)", "Working with intolerance", "Restoring a sense of measure", "Working through the fear of limitations"],
  15: ["Healing addictions and attachments", "Overcoming toxic relationships", "Working with the shadow side of the personality", "Restoring freedom from fears", "Working through manipulative behavior"],
  16: ["Healing the aftermath of traumas and shocks", "Overcoming the fear of destruction and loss", "Working with pride and false constructs", "Restoring the true foundation", "Working through PTSD"],
  17: ["Healing the loss of hope and faith", "Overcoming disappointment in dreams", "Working with the 'dreamer's' perfectionism", "Restoring the ability to believe in the best", "Working through passivity and waiting for a 'miracle'"],
  18: ["Healing fears and phobias", "Overcoming anxiety and panic attacks", "Working with subconscious programs", "Restoring clarity of consciousness", "Working through a tendency to self-deception"],
  19: ["Healing the relationship with joy and success", "Overcoming impostor syndrome", "Working with the 'firstborn complex'", "Restoring childlike spontaneity", "Working through the fear of being happy"],
  20: ["Healing the relationship with the past and the ancestors", "Overcoming karmic patterns", "Working with guilt toward the lineage", "Restoring the connection with your roots", "Working through the fear of 'judgement'"],
  21: ["Healing the fear of completion and loss", "Overcoming unfinished business", "Working with perfectionism of the 'result'", "Restoring a sense of wholeness", "Working through the fear of 'what's next?'"],
  22: ["Healing the fear of a leap into the unknown", "Overcoming recklessness or hyper-caution", "Working with the 'eternal teenager' syndrome", "Restoring trust in the Universe", "Working through irresponsibility"],
};
const healingFallbackEN = ["Healing inner conflicts", "Overcoming limiting beliefs", "Restoring wholeness", "Working through fears", "Accepting yourself"];

const healingES: Record<number, string[]> = {
  2: ["Sanar el vínculo con la madre y la línea femenina del linaje", "Aceptar tu naturaleza intuitiva", "Superar el miedo a la soledad", "Restaurar la confianza en ti y en el mundo", "Trabajar las emociones reprimidas"],
  3: ["Sanar la relación con el cuerpo y la sexualidad", "Aceptar tu atractivo y tu valor", "Superar la avaricia o el derroche", "Restaurar el flujo creativo", "Trabajar el miedo a la escasez"],
  4: ["Sanar la relación con el padre y las autoridades", "Superar el miedo a la responsabilidad", "Trabajar el control y el perfeccionismo", "Restaurar el equilibrio entre el trabajo y la vida", "Trabajar la dureza y la rigidez"],
  5: ["Sanar la relación con la educación y los maestros", "Superar el dogmatismo y el fanatismo", "Trabajar la culpa por las elecciones 'equivocadas'", "Restaurar la conexión con la espiritualidad", "Trabajar el miedo al juicio ajeno"],
  6: ["Sanar las heridas en las relaciones amorosas", "Superar la indecisión y el miedo a elegir", "Trabajar la dependencia de la pareja", "Restaurar la capacidad de amar de forma incondicional", "Trabajar los celos y la posesividad"],
  7: ["Sanar el miedo al movimiento y al cambio", "Superar la agresión y la impaciencia", "Trabajar el síndrome de la 'rueda del hámster'", "Restaurar la conexión entre el cuerpo y la mente", "Trabajar la competencia y la rivalidad"],
  8: ["Sanar la relación con la justicia y la ley", "Superar el rencor y el afán de venganza", "Trabajar las deudas kármicas", "Restaurar el equilibrio interior", "Trabajar el sacrificio personal"],
  9: ["Sanar el miedo a la soledad y al aislamiento", "Superar la depresión y la apatía", "Trabajar las adicciones (alcohol, huida de la realidad)", "Restaurar la conexión con el sabio interior", "Trabajar el ermitañismo como huida"],
  10: ["Sanar el miedo a lo desconocido y al cambio", "Superar la dependencia de la estabilidad", "Trabajar el juego y el comportamiento arriesgado", "Restaurar la confianza en la vida", "Trabajar la resignación ante el destino"],
  11: ["Sanar la ira y la agresión reprimidas", "Superar la tendencia al conflicto", "Trabajar la energía y su dirección constructiva", "Restaurar la fuerza a través de la suavidad", "Trabajar la violencia (activa o pasiva)"],
  12: ["Sanar los patrones de sacrificio", "Superar las ilusiones y el autoengaño", "Trabajar el estado 'suspendido' en la vida", "Restaurar la claridad de visión", "Trabajar la inclinación a las aventuras temerarias"],
  13: ["Sanar el miedo a la muerte y al cambio", "Superar el apego al pasado", "Trabajar el duelo y las pérdidas", "Restaurar la capacidad de soltar", "Trabajar la incapacidad de cerrar las cosas"],
  14: ["Sanar los extremos y las adicciones", "Superar el fanatismo (dietas, deporte, trabajo)", "Trabajar la intolerancia", "Restaurar el sentido de la medida", "Trabajar el miedo a las limitaciones"],
  15: ["Sanar las adicciones y los apegos", "Superar las relaciones tóxicas", "Trabajar el lado oscuro de la personalidad", "Restaurar la libertad respecto de los miedos", "Trabajar el comportamiento manipulador"],
  16: ["Sanar las secuelas de traumas y shocks", "Superar el miedo a la destrucción y la pérdida", "Trabajar el orgullo y las construcciones falsas", "Restaurar el verdadero fundamento", "Trabajar el TEPT"],
  17: ["Sanar la pérdida de la esperanza y la fe", "Superar la decepción en los sueños", "Trabajar el perfeccionismo del 'soñador'", "Restaurar la capacidad de creer en lo mejor", "Trabajar la pasividad y la espera de un 'milagro'"],
  18: ["Sanar los miedos y las fobias", "Superar la ansiedad y los ataques de pánico", "Trabajar los programas subconscientes", "Restaurar la claridad de conciencia", "Trabajar la tendencia al autoengaño"],
  19: ["Sanar la relación con la alegría y el éxito", "Superar el síndrome del impostor", "Trabajar el 'complejo de primogénito'", "Restaurar la espontaneidad infantil", "Trabajar el miedo a ser feliz"],
  20: ["Sanar la relación con el pasado y los antepasados", "Superar los patrones kármicos", "Trabajar la culpa hacia el linaje", "Restaurar la conexión con las raíces", "Trabajar el miedo al 'juicio'"],
  21: ["Sanar el miedo al cierre y a la pérdida", "Superar los asuntos inacabados", "Trabajar el perfeccionismo del 'resultado'", "Restaurar el sentido de plenitud", "Trabajar el miedo al '¿y ahora qué?'"],
  22: ["Sanar el miedo al salto a lo desconocido", "Superar la temeridad o la hiperprudencia", "Trabajar el síndrome del 'eterno adolescente'", "Restaurar la confianza en el Universo", "Trabajar la irresponsabilidad"],
};
const healingFallbackES = ["Sanar los conflictos internos", "Superar las creencias limitantes", "Restaurar la plenitud", "Trabajar los miedos", "Aceptarte a ti mismo"];

// ---- Main exam (2–22) ----
const mainExamEN: Record<number, Exam> = {
  2: { q: "Will you be able to trust your intuition and not fear silence?", plus: ["Deep self-knowledge", "Developing intuition and psychic abilities", "Wisdom and patience", "Harmonious relationships", "Understanding hidden motives"], minus: ["Isolation and depression", "Suppressing feelings", "Dependence on others' opinions", "Fears and anxiety", "Loss of touch with reality"] },
  3: { q: "Will you be able to accept abundance without losing yourself in pleasures?", plus: ["Material prosperity", "Creative realization", "Beauty and harmony", "Love and attractiveness", "The birth of something new (a child, project, business)"], minus: ["Extravagance and laziness", "Dependence on comfort", "Superficiality", "Jealousy and possessiveness", "Loss of focus"] },
  4: { q: "Will you be able to build without becoming a tyrant?", plus: ["Stability and structure", "Career growth", "Real estate and foundation", "Authority and respect", "Order in all areas"], minus: ["Authoritarianism", "Workaholism", "Control and rigidity", "Suppressing feelings", "Destroying relationships for the sake of a career"] },
  5: { q: "Will you be able to learn without falling into fanaticism?", plus: ["Wisdom and deep knowledge", "Mentorship", "Spiritual growth", "Understanding of true values", "Expertise"], minus: ["Dogmatism", "Moralizing", "Detachment from reality", "Fanatical attachment to a single system", "Pride from knowledge"] },
  6: { q: "Will you be able to choose with the heart without losing your head?", plus: ["Love and harmony in relationships", "The right choice", "Partnership", "Joy and emotional fulfillment", "Unity of reason and feeling"], minus: ["Indecision", "A love triangle", "Dependence on a partner", "Loss of self in the relationship", "The agony of choice"] },
  7: { q: "Will you be able to move forward without losing direction?", plus: ["Fast success and achievement", "Travel and relocation", "Victories and rewards", "Freedom of movement", "Competitive advantage"], minus: ["Burnout", "Running from yourself", "Injuries and accidents", "Loss of focus in the race", "Impatience and aggression"] },
  8: { q: "Will you be able to accept the justice of the Universe, even when it's painful?", plus: ["Karmic reward", "Legal victories", "Fair recognition of your work", "Inner balance", "Honesty and directness"], minus: ["Vindictiveness", "Harshness of judgement (toward yourself and others)", "Karmic debts", "Conflicts with the law", "Resentment at 'injustice'"] },
  9: { q: "Will you be able to find wisdom in silence without running from the world?", plus: ["Deep self-knowledge", "Wisdom", "Scientific discoveries", "Spiritual practice", "Clarity of thought"], minus: ["Depression and isolation", "Alcoholism or addictions", "Loss of connection with people", "Apathy", "Escape from reality"] },
  10: { q: "Will you be able to trust fate, even when the wheel turns against you?", plus: ["Fateful encounters", "New opportunities", "Karmic gifts", "Luck and fortune", "Radical changes for the better"], minus: ["Shock from surprises", "Loss of stability", "Dependence on gambling", "Panic from change", "Losing everything you've 'accumulated'"] },
  11: { q: "Will you be able to direct your strength constructively?", plus: ["Physical and mental strength", "Sporting achievements", "Overcoming obstacles", "Taming chaos", "Leadership through strength of spirit"], minus: ["Aggression and conflicts", "Violence (physical or emotional)", "Burnout from overexertion", "Destruction of relationships", "Fighting for the sake of fighting"] },
  12: { q: "Will you be able to see the world upside down and not lose yourself?", plus: ["Spiritual insight", "A new view of life", "Self-sacrifice for a higher goal", "A deep understanding of suffering", "Wisdom through experience"], minus: ["Self-deception and illusions", "Sacrifice without meaning", "Stagnation and inaction", "Loss of values", "Reckless ventures and deceit"] },
  13: { q: "Will you be able to let go of the old for the sake of the new?", plus: ["Complete transformation", "Freedom from the past", "A new beginning", "Healing through letting go", "Radical renewal"], minus: ["Fear of change", "Clinging to the dead", "Loss and grief", "Illnesses of transformation", "Destruction without creation"] },
  14: { q: "Will you be able to find the golden mean in everything?", plus: ["Harmony and balance", "Healing and restoration", "Moderation as strength", "Patience and wisdom", "Integration of experience"], minus: ["Extremes (asceticism or excess)", "Limitations and deprivations", "Stagnation from excessive caution", "Boredom and routine", "Fear of taking risks"] },
  15: { q: "Will you be able to see your chains and decide to remove them?", plus: ["Freedom from addictions", "Understanding the shadow side", "Transforming fears into strength", "Honesty with yourself", "Material success through awareness"], minus: ["Addictions (substances, relationships, money)", "Manipulation", "Toxic relationships", "Fears and phobias", "Loss of moral compass"] },
  16: { q: "Will you be able to survive destruction and find freedom in it?", plus: ["Freedom from the false", "A breakthrough after a crisis", "A true foundation", "Strength through trials", "A new beginning from the ruins"], minus: ["Shock and trauma", "Loss of property or status", "A breakup", "Physical injuries", "Extreme events"] },
  17: { q: "Will you be able to keep hope and faith, even in the dark?", plus: ["Inspiration and creativity", "Healing through faith", "New dreams", "Help from above", "Harmony with the Universe"], minus: ["Disappointment", "Passively waiting for a miracle", "Naivety", "Unrealistic expectations", "Loss of faith"] },
  18: { q: "Will you be able to pass through your fears without losing your mind?", plus: ["A deep understanding of the subconscious", "Developing intuition", "Overcoming phobias", "Wisdom through the dark night of the soul", "Healing"], minus: ["Panic attacks", "Phobias and obsessions", "Deception and illusions", "Mental disorders", "Loss of orientation"] },
  19: { q: "Will you be able to accept joy without guilt?", plus: ["Success and recognition", "Joy and enthusiasm", "Clarity of thought", "Children and creativity", "Vital energy"], minus: ["Pride from success", "Burnout from an excess of energy", "Egocentrism", "Ignoring the shadow", "Dependence on recognition"] },
  20: { q: "Will you be able to hear the call and answer it?", plus: ["Awakening and awareness", "Forgiveness and healing of the past", "A new calling", "Karmic completion", "Rebirth"], minus: ["Fear of the past", "Guilt", "Inability to forgive", "Getting stuck in karmic loops", "Refusing responsibility"] },
  21: { q: "Will you be able to complete the cycle with gratitude and wisdom?", plus: ["Completion and wholeness", "Wisdom and experience", "Worldwide recognition", "Travel", "Harmony with the Universe"], minus: ["Unfinished business", "Fear of completion", "Perfectionism of the result", "Longing for 'how it used to be'", "Inability to let go"] },
  22: { q: "Will you be able to trust life and leap into the unknown?", plus: ["Absolute freedom", "New horizons", "Childlike spontaneity", "Intuitive breakthroughs", "An adventure that pays off"], minus: ["Recklessness", "Irresponsibility", "Chaos and unpredictability", "Losing everything through foolishness", "Infantilism"] },
};
const examFallbackEN: Exam = { q: "Will you be able to use the year's energy wisely?", plus: ["Growth and development", "New opportunities", "Harmony"], minus: ["Stagnation", "Conflicts", "Losses"] };

const mainExamES: Record<number, Exam> = {
  2: { q: "¿Sabrás confiar en tu intuición y no temer al silencio?", plus: ["Autoconocimiento profundo", "Desarrollo de la intuición y capacidades psíquicas", "Sabiduría y paciencia", "Relaciones armoniosas", "Comprensión de los motivos ocultos"], minus: ["Aislamiento y depresión", "Reprimir los sentimientos", "Dependencia de la opinión ajena", "Miedos y ansiedad", "Pérdida de contacto con la realidad"] },
  3: { q: "¿Sabrás aceptar la abundancia sin perderte en los placeres?", plus: ["Prosperidad material", "Realización creativa", "Belleza y armonía", "Amor y atractivo", "El nacimiento de algo nuevo (un hijo, proyecto, negocio)"], minus: ["Derroche y pereza", "Dependencia del confort", "Superficialidad", "Celos y posesividad", "Pérdida de foco"] },
  4: { q: "¿Sabrás construir sin convertirte en un tirano?", plus: ["Estabilidad y estructura", "Crecimiento profesional", "Inmuebles y cimientos", "Autoridad y respeto", "Orden en todas las áreas"], minus: ["Autoritarismo", "Adicción al trabajo", "Control y rigidez", "Reprimir los sentimientos", "Destruir relaciones por la carrera"] },
  5: { q: "¿Sabrás aprender sin caer en el fanatismo?", plus: ["Sabiduría y conocimiento profundo", "Mentoría", "Crecimiento espiritual", "Comprensión de los verdaderos valores", "Experiencia"], minus: ["Dogmatismo", "Moralismo", "Desconexión de la realidad", "Apego fanático a un solo sistema", "Orgullo por el saber"] },
  6: { q: "¿Sabrás elegir con el corazón sin perder la cabeza?", plus: ["Amor y armonía en las relaciones", "La elección correcta", "Asociación", "Alegría y plenitud emocional", "Unidad de razón y sentimiento"], minus: ["Indecisión", "Un triángulo amoroso", "Dependencia de la pareja", "Perderse en la relación", "El tormento de la elección"] },
  7: { q: "¿Sabrás avanzar sin perder la dirección?", plus: ["Éxito rápido y logros", "Viajes y mudanzas", "Victorias y recompensas", "Libertad de movimiento", "Ventaja competitiva"], minus: ["Agotamiento", "Huir de uno mismo", "Lesiones y accidentes", "Pérdida de foco en la carrera", "Impaciencia y agresión"] },
  8: { q: "¿Sabrás aceptar la justicia del Universo, incluso cuando es dolorosa?", plus: ["Recompensa kármica", "Victorias legales", "Reconocimiento justo del trabajo", "Equilibrio interior", "Honestidad y rectitud"], minus: ["Afán de venganza", "Dureza del juicio (hacia ti y los demás)", "Deudas kármicas", "Conflictos con la ley", "Resentimiento por la 'injusticia'"] },
  9: { q: "¿Sabrás hallar sabiduría en el silencio sin huir del mundo?", plus: ["Autoconocimiento profundo", "Sabiduría", "Descubrimientos científicos", "Práctica espiritual", "Claridad de pensamiento"], minus: ["Depresión y aislamiento", "Alcoholismo o adicciones", "Pérdida de conexión con la gente", "Apatía", "Huida de la realidad"] },
  10: { q: "¿Sabrás confiar en el destino, incluso cuando la rueda gira en tu contra?", plus: ["Encuentros decisivos", "Nuevas oportunidades", "Regalos kármicos", "Suerte y fortuna", "Cambios radicales a mejor"], minus: ["Shock por las sorpresas", "Pérdida de estabilidad", "Dependencia del juego", "Pánico por los cambios", "Perder todo lo 'acumulado'"] },
  11: { q: "¿Sabrás dirigir tu fuerza de forma creativa?", plus: ["Fuerza física y psíquica", "Logros deportivos", "Superación de obstáculos", "Domar el caos", "Liderazgo por la fuerza de espíritu"], minus: ["Agresión y conflictos", "Violencia (física o emocional)", "Agotamiento por sobreesfuerzo", "Destrucción de relaciones", "Luchar por luchar"] },
  12: { q: "¿Sabrás ver el mundo del revés y no perderte?", plus: ["Iluminación espiritual", "Una nueva mirada a la vida", "Sacrificio por un fin superior", "Comprensión profunda del sufrimiento", "Sabiduría a través de la experiencia"], minus: ["Autoengaño e ilusiones", "Sacrificio sin sentido", "Estancamiento e inacción", "Pérdida de valores", "Aventuras y engaño"] },
  13: { q: "¿Sabrás soltar lo viejo en favor de lo nuevo?", plus: ["Transformación total", "Libertad del pasado", "Un nuevo comienzo", "Sanación a través de soltar", "Renovación radical"], minus: ["Miedo al cambio", "Aferrarse a lo muerto", "Pérdida y duelo", "Enfermedades de la transformación", "Destrucción sin creación"] },
  14: { q: "¿Sabrás encontrar el justo medio en todo?", plus: ["Armonía y equilibrio", "Sanación y recuperación", "La moderación como fuerza", "Paciencia y sabiduría", "Integración de la experiencia"], minus: ["Extremos (ascetismo o desenfreno)", "Limitaciones y privaciones", "Estancamiento por exceso de prudencia", "Aburrimiento y rutina", "Miedo a arriesgar"] },
  15: { q: "¿Sabrás ver tus cadenas y decidir quitártelas?", plus: ["Liberación de las adicciones", "Comprensión del lado oscuro", "Transformar los miedos en fuerza", "Honestidad contigo mismo", "Éxito material a través de la conciencia"], minus: ["Adicciones (sustancias, relaciones, dinero)", "Manipulaciones", "Relaciones tóxicas", "Miedos y fobias", "Pérdida de los referentes morales"] },
  16: { q: "¿Sabrás sobrevivir a la destrucción y hallar en ella la libertad?", plus: ["Liberación de lo falso", "Un avance tras la crisis", "Un fundamento verdadero", "Fuerza a través de las pruebas", "Un nuevo comienzo desde las ruinas"], minus: ["Shock y trauma", "Pérdida de bienes o estatus", "Ruptura de relaciones", "Lesiones físicas", "Acontecimientos extremos"] },
  17: { q: "¿Sabrás conservar la esperanza y la fe, incluso en la oscuridad?", plus: ["Inspiración y creatividad", "Sanación a través de la fe", "Nuevos sueños", "Ayuda de lo alto", "Armonía con el Universo"], minus: ["Decepción", "Esperar pasivamente un milagro", "Ingenuidad", "Expectativas poco realistas", "Pérdida de la fe"] },
  18: { q: "¿Sabrás atravesar tus miedos sin perder la razón?", plus: ["Comprensión profunda del subconsciente", "Desarrollo de la intuición", "Superación de las fobias", "Sabiduría a través de la noche oscura del alma", "Sanación"], minus: ["Ataques de pánico", "Fobias y obsesiones", "Engaño e ilusiones", "Trastornos mentales", "Pérdida de orientación"] },
  19: { q: "¿Sabrás aceptar la alegría sin culpa?", plus: ["Éxito y reconocimiento", "Alegría y entusiasmo", "Claridad de pensamiento", "Hijos y creatividad", "Energía vital"], minus: ["Orgullo por el éxito", "Agotamiento por el exceso de energía", "Egocentrismo", "Ignorar la sombra", "Dependencia del reconocimiento"] },
  20: { q: "¿Sabrás oír la llamada y responder a ella?", plus: ["Despertar y toma de conciencia", "Perdón y sanación del pasado", "Una nueva vocación", "Cierre kármico", "Renacimiento"], minus: ["Miedo al pasado", "Sentimiento de culpa", "Incapacidad de perdonar", "Quedarse atascado en bucles kármicos", "Rechazo de la responsabilidad"] },
  21: { q: "¿Sabrás cerrar el ciclo con gratitud y sabiduría?", plus: ["Plenitud y totalidad", "Sabiduría y experiencia", "Reconocimiento mundial", "Viajes", "Armonía con el Universo"], minus: ["Asuntos inacabados", "Miedo al cierre", "Perfeccionismo del resultado", "Añoranza de 'cuando era mejor'", "Incapacidad de soltar"] },
  22: { q: "¿Sabrás confiar en la vida y saltar a lo desconocido?", plus: ["Libertad absoluta", "Nuevos horizontes", "Espontaneidad infantil", "Avances intuitivos", "Una aventura que se rentabiliza"], minus: ["Temeridad", "Irresponsabilidad", "Caos e imprevisibilidad", "Perderlo todo por una tontería", "Infantilismo"] },
};
const examFallbackES: Exam = { q: "¿Sabrás usar la energía del año con sabiduría?", plus: ["Crecimiento y desarrollo", "Nuevas oportunidades", "Armonía"], minus: ["Estancamiento", "Conflictos", "Pérdidas"] };

// ---- Year tasks (2–22) ----
const yearTasksEN: Record<number, string[]> = {
  2: ["Develop intuition", "Learn to hear the inner voice", "Accept your feminine/intuitive nature", "Keep a dream journal", "Meditate daily", "Spend time in silence", "Don't rush events", "Deepen self-knowledge"],
  3: ["Create beauty", "Develop creative potential", "Strengthen your financial base", "Take care of your body", "Accept abundance without guilt", "Enjoy life consciously", "Nurture your 'offspring' (a project, a child)", "Develop femininity/sensuality"],
  4: ["Build a system and order", "Take responsibility for results", "Create a financial foundation", "Put your documents in order", "Strengthen health through discipline", "Develop leadership qualities", "Learn to delegate", "Build a team"],
  5: ["Learn and grow", "Find a mentor", "Pass knowledge on to others", "Define your values", "Deepen your spiritual practice", "Complete training/certification", "Explore different philosophies", "Don't impose your views"],
  6: ["Make a conscious choice", "Strengthen or end a relationship", "Learn to hear both reason and heart", "Take responsibility for your choice", "Develop emotional intelligence", "Learn to say 'no'", "Deepen closeness in the relationship", "Don't fear commitment"],
  7: ["Act and move", "Travel and broaden horizons", "Win and achieve goals", "Control your speed", "Channel energy constructively", "Don't burn out", "Learn to manage emotions", "Compete fairly"],
  8: ["Restore justice", "Pay off debts (financial and karmic)", "Resolve legal matters", "Be honest in everything", "Accept the karmic balance", "Don't take revenge", "Forgive consciously", "Strengthen health (bones, teeth)"],
  9: ["Know yourself in silence", "Find wisdom within", "Don't run from solitude", "Minimize information noise", "Develop expertise", "Practice asceticism consciously", "Travel to places of power", "Keep a reflection journal"],
  10: ["Accept uncertainty", "Trust the flow of life", "Don't cling to stability", "Be flexible", "Use your chances", "Diversify your income", "Build a safety cushion", "Work with anxiety"],
  11: ["Channel strength into sport", "Control aggression", "Tame inner chaos", "Learn patience", "Don't provoke conflicts", "Develop physical endurance", "Direct energy toward goals", "Don't suppress feelings"],
  12: ["Accept the pause consciously", "Re-evaluate priorities", "Don't resist the slowdown", "See the world from a new angle", "Practice 'letting go'", "Help others", "Don't sacrifice yourself thoughtlessly", "Look for meaning in suffering"],
  13: ["Complete everything outdated", "Let go of what doesn't grow", "Accept transformation", "Don't fear change", "Carry out a life audit", "Free yourself from the past", "Start with a clean slate", "Practice detox"],
  14: ["Find the golden mean", "Practice moderation", "Restore your strength", "Integrate experience", "Start a healthy lifestyle", "Don't fall into extremes", "Patiently wait for results", "Practice gratitude"],
  15: ["See your addictions", "Free yourself from toxic ties", "Work with the shadow side", "Don't give in to temptations", "Set healthy boundaries", "Practice awareness", "Probe your fears", "Transform fears into strength"],
  16: ["Accept destruction as liberation", "Don't cling to the false", "Build on a true foundation", "Don't panic", "Seek support", "Work with trauma", "Be flexible", "Believe in recovery"],
  17: ["Dream big", "Visualize the future", "Don't lose hope", "Help others", "Create", "Believe in the best", "Be grateful for the small things", "Practice prayer/meditation"],
  18: ["Work with fears", "Keep a dream journal", "Don't trust first impressions", "Check information", "Don't panic", "Work with the subconscious", "Minimize stress", "Practice lucid dreaming"],
  19: ["Enjoy life", "Share your joy", "Be generous", "Don't get arrogant", "Play and have fun", "Spend time in the sun", "Create with enthusiasm", "Be grateful for success"],
  20: ["Hear the call of your soul", "Forgive the past", "Complete karmic lessons", "Don't run from the past", "Restore connections", "Define your calling", "Practice forgiveness", "Honor your ancestors"],
  21: ["Complete all your affairs", "Take stock", "Travel", "Broaden horizons", "Give thanks", "Feel wholeness", "Share your experience", "Prepare for a new cycle"],
  22: ["Trust your intuition", "Be spontaneous", "Don't fear the new", "Keep a safety cushion", "Laugh and play", "Don't get attached", "Take life as an adventure", "Don't be irresponsible"],
};
const yearTasksFallbackEN = ["Develop consciously", "Practice gratitude", "Find balance", "Trust the process", "Don't rush events", "Learn from experience", "Take care of your health", "Strengthen relationships"];

const yearTasksES: Record<number, string[]> = {
  2: ["Desarrollar la intuición", "Aprender a oír la voz interior", "Aceptar la naturaleza femenina/intuitiva", "Llevar un diario de sueños", "Meditar a diario", "Pasar tiempo en silencio", "No apresurar los acontecimientos", "Profundizar el autoconocimiento"],
  3: ["Crear belleza", "Desarrollar el potencial creativo", "Reforzar la base financiera", "Cuidar el cuerpo", "Aceptar la abundancia sin culpa", "Disfrutar de la vida con conciencia", "Cuidar tu 'criatura' (un proyecto, un hijo)", "Desarrollar la feminidad/sensualidad"],
  4: ["Construir un sistema y orden", "Asumir la responsabilidad por los resultados", "Crear un fundamento financiero", "Poner en orden los documentos", "Reforzar la salud con disciplina", "Desarrollar cualidades de liderazgo", "Aprender a delegar", "Formar un equipo"],
  5: ["Aprender y desarrollarse", "Buscar un mentor", "Transmitir conocimiento a otros", "Definir tus valores", "Profundizar la práctica espiritual", "Completar formación/certificación", "Explorar distintas filosofías", "No imponer tus puntos de vista"],
  6: ["Tomar una elección consciente", "Reforzar o cerrar una relación", "Aprender a oír tanto la razón como el corazón", "Asumir la responsabilidad por tu elección", "Desarrollar la inteligencia emocional", "Aprender a decir 'no'", "Profundizar la intimidad en la relación", "No temer el compromiso"],
  7: ["Actuar y moverse", "Viajar y ampliar horizontes", "Vencer y alcanzar metas", "Controlar la velocidad", "Canalizar la energía de forma constructiva", "No quemarte", "Aprender a gestionar las emociones", "Competir con honestidad"],
  8: ["Restaurar la justicia", "Saldar deudas (financieras y kármicas)", "Resolver asuntos legales", "Ser honesto en todo", "Aceptar el equilibrio kármico", "No vengarte", "Perdonar con conciencia", "Reforzar la salud (huesos, dientes)"],
  9: ["Conocerte en el silencio", "Hallar la sabiduría dentro", "No huir de la soledad", "Minimizar el ruido informativo", "Desarrollar la especialización", "Practicar el ascetismo con conciencia", "Viajar a lugares de poder", "Llevar un diario de reflexión"],
  10: ["Aceptar la incertidumbre", "Confiar en el flujo de la vida", "No aferrarte a la estabilidad", "Ser flexible", "Aprovechar las oportunidades", "Diversificar los ingresos", "Crear un colchón de seguridad", "Trabajar la ansiedad"],
  11: ["Canalizar la fuerza en el deporte", "Controlar la agresión", "Domar el caos interior", "Aprender la paciencia", "No provocar conflictos", "Desarrollar la resistencia física", "Dirigir la energía hacia las metas", "No reprimir los sentimientos"],
  12: ["Aceptar la pausa con conciencia", "Reevaluar las prioridades", "No resistirte a la ralentización", "Ver el mundo desde un nuevo ángulo", "Practicar el 'soltar'", "Ayudar a los demás", "No sacrificarte sin pensar", "Buscar sentido en el sufrimiento"],
  13: ["Cerrar todo lo obsoleto", "Soltar lo que no crece", "Aceptar la transformación", "No temer los cambios", "Hacer una revisión de tu vida", "Liberarte del pasado", "Empezar de cero", "Practicar el detox"],
  14: ["Hallar el justo medio", "Practicar la moderación", "Recuperar fuerzas", "Integrar la experiencia", "Empezar un estilo de vida saludable", "No caer en extremos", "Esperar los resultados con paciencia", "Practicar la gratitud"],
  15: ["Ver tus adicciones", "Liberarte de los vínculos tóxicos", "Trabajar el lado oscuro", "No ceder a las tentaciones", "Establecer límites sanos", "Practicar la conciencia plena", "Sondear tus miedos", "Transformar los miedos en fuerza"],
  16: ["Aceptar la destrucción como liberación", "No aferrarte a lo falso", "Construir sobre un fundamento verdadero", "No entrar en pánico", "Buscar apoyo", "Trabajar el trauma", "Ser flexible", "Creer en la recuperación"],
  17: ["Soñar a lo grande", "Visualizar el futuro", "No perder la esperanza", "Ayudar a los demás", "Crear", "Creer en lo mejor", "Agradecer lo pequeño", "Practicar la oración/meditación"],
  18: ["Trabajar los miedos", "Llevar un diario de sueños", "No fiarte de la primera impresión", "Verificar la información", "No entrar en pánico", "Trabajar con el subconsciente", "Minimizar el estrés", "Practicar los sueños lúcidos"],
  19: ["Disfrutar de la vida", "Compartir la alegría", "Ser generoso", "No envanecerte", "Jugar y divertirte", "Pasar tiempo al sol", "Crear con entusiasmo", "Agradecer el éxito"],
  20: ["Oír la llamada del alma", "Perdonar el pasado", "Cerrar las lecciones kármicas", "No huir del pasado", "Restaurar los vínculos", "Definir la vocación", "Practicar el perdón", "Honrar a los antepasados"],
  21: ["Cerrar todos los asuntos", "Hacer balance", "Viajar", "Ampliar horizontes", "Agradecer", "Sentir la plenitud", "Compartir la experiencia", "Prepararse para un nuevo ciclo"],
  22: ["Confiar en la intuición", "Ser espontáneo", "No temer lo nuevo", "Conservar un colchón de seguridad", "Reír y jugar", "No apegarte", "Tomar la vida como una aventura", "No ser irresponsable"],
};
const yearTasksFallbackES = ["Desarrollarse con conciencia", "Practicar la gratitud", "Hallar el equilibrio", "Confiar en el proceso", "No apresurar los acontecimientos", "Aprender de la experiencia", "Cuidar la salud", "Reforzar las relaciones"];

// ---- Life-sphere themes (2–22) ----
const lifeSphereEN: Record<number, string[]> = {
  2: ["Joint walks, visits with relatives, communication, family", "Praying or meditating together", "Preserving and studying family traditions", "Showing care and warmth to loved ones"],
  3: ["Creating together with loved ones", "Furnishing the home and creating coziness", "Family celebrations and festivities", "Supporting each other's creative undertakings"],
  4: ["Planning the budget together", "Discussing rules and boundaries in the family", "Resolving legal and document matters", "Distributing responsibilities"],
  5: ["Studying or attending events together", "Discussing values and priorities", "Spiritual practices together", "Mentorship and passing on experience"],
  6: ["Romantic dates", "Honest conversations about feelings", "Joint decisions", "Strengthening partnership commitments"],
  7: ["Joint travel", "Active recreation together", "Competitions and games", "Achieving shared goals"],
  8: ["Fair distribution of duties", "Resolving conflicts through dialogue", "The family's legal matters", "Financial transparency"],
  9: ["Respect for personal space", "Joint walks in nature", "Deep conversations about life", "Reading and discussing books"],
  10: ["Accepting change together", "Support during crises", "Celebrating unexpected joys", "Flexibility in plans"],
  11: ["Joint sports activities", "Constructive conflict resolution", "Channeling family energy into creativity", "Protecting the family's boundaries"],
  12: ["Joint charity work", "Discussing life priorities", "Support in hard times", "Practicing forgiveness in the family"],
  13: ["Saying goodbye to the past together", "Renewing family traditions", "Supporting each other through change", "Creating new rituals"],
  14: ["Balancing the family budget", "A healthy lifestyle for the whole family", "Moderation in demands", "Compromises and concessions"],
  15: ["An honest conversation about addictions", "Setting healthy boundaries", "Support in overcoming attachments", "Freeing yourselves from toxic patterns"],
  16: ["Support during crises", "Recovery after upheavals", "Honesty and openness", "Building on a new foundation"],
  17: ["Shared dreams and visualization", "Supporting hope in each other", "Creating together", "Gratitude for the small things"],
  18: ["Discussing fears openly", "Support in dark times", "Not second-guessing your partner", "Practicing trust"],
  19: ["Shared celebrations and joy", "Playing with children", "Creative projects together", "Generosity toward each other"],
  20: ["Discussing family history", "Forgiving old grievances", "Visiting the ancestors' places", "Restoring connections with relatives"],
  21: ["Traveling as a whole family", "Taking stock as a family", "Gratitude for the shared path", "Planning a new stage"],
  22: ["Spontaneous adventures together", "Freedom and trust", "Humor and lightness", "Not fearing the new"],
};
const lifeSphereFallbackEN = ["Strengthening family bonds", "Spending time together", "Open dialogue", "Support and care"];

const lifeSphereES: Record<number, string[]> = {
  2: ["Paseos juntos, visitas con familiares, comunicación, familia", "Rezar o meditar juntos", "Conservar y estudiar las tradiciones familiares", "Mostrar cariño y calidez a los seres queridos"],
  3: ["Crear junto a los seres queridos", "Acondicionar el hogar y crear un ambiente acogedor", "Fiestas y celebraciones familiares", "Apoyar las iniciativas creativas del otro"],
  4: ["Planificar el presupuesto juntos", "Hablar de reglas y límites en la familia", "Resolver asuntos legales y documentales", "Repartir las responsabilidades"],
  5: ["Estudiar o asistir a eventos juntos", "Hablar de valores y prioridades", "Prácticas espirituales juntos", "Mentoría y transmisión de experiencia"],
  6: ["Citas románticas", "Conversaciones honestas sobre los sentimientos", "Decisiones conjuntas", "Reforzar los compromisos de pareja"],
  7: ["Viajes juntos", "Ocio activo en común", "Competiciones y juegos", "Alcanzar metas comunes"],
  8: ["Reparto justo de las obligaciones", "Resolver los conflictos mediante el diálogo", "Los asuntos legales de la familia", "Transparencia financiera"],
  9: ["Respeto por el espacio personal", "Paseos juntos por la naturaleza", "Conversaciones profundas sobre la vida", "Leer y comentar libros"],
  10: ["Aceptar los cambios juntos", "Apoyo en las crisis", "Celebrar las alegrías inesperadas", "Flexibilidad en los planes"],
  11: ["Actividades deportivas conjuntas", "Resolución constructiva de conflictos", "Canalizar la energía familiar en la creatividad", "Proteger los límites de la familia"],
  12: ["Beneficencia conjunta", "Hablar de las prioridades de la vida", "Apoyo en los momentos difíciles", "Practicar el perdón en la familia"],
  13: ["Despedirse juntos del pasado", "Renovar las tradiciones familiares", "Apoyarse mutuamente en los cambios", "Crear nuevos rituales"],
  14: ["Equilibrar el presupuesto familiar", "Un estilo de vida saludable para toda la familia", "Moderación en las exigencias", "Compromisos y concesiones"],
  15: ["Una conversación honesta sobre las adicciones", "Establecer límites sanos", "Apoyo para superar los apegos", "Liberarse de los patrones tóxicos"],
  16: ["Apoyo en las crisis", "Recuperación tras las sacudidas", "Honestidad y franqueza", "Construir sobre un nuevo fundamento"],
  17: ["Sueños y visualización compartidos", "Apoyar la esperanza el uno en el otro", "Crear juntos", "Gratitud por lo pequeño"],
  18: ["Hablar de los miedos abiertamente", "Apoyo en los tiempos oscuros", "No suponer cosas por la pareja", "Practicar la confianza"],
  19: ["Fiestas y alegría compartidas", "Jugar con los niños", "Proyectos creativos juntos", "Generosidad mutua"],
  20: ["Hablar de la historia familiar", "Perdonar viejos rencores", "Visitar los lugares de los antepasados", "Restaurar los vínculos con los familiares"],
  21: ["Viajar en familia", "Hacer balance como familia", "Gratitud por el camino compartido", "Planificar una nueva etapa"],
  22: ["Aventuras espontáneas juntos", "Libertad y confianza", "Humor y ligereza", "No temer lo nuevo"],
};
const lifeSphereFallbackES = ["Reforzar los lazos familiares", "Pasar tiempo juntos", "Diálogo abierto", "Apoyo y cuidado"];

// ---- Birthday ritual (generic, with localized arcana name) ----
function birthdayRitualLoc(arcana: number, lang: Lang): string[] {
  const name = getArcana(arcana)?.name || (lang === 'en' ? `arcana ${arcana}` : `arcano ${arcana}`);
  if (lang === 'en') {
    return [
      "On your birthday, take stock of the past year — write down 3 main lessons",
      "Perform a 'letting go' ritual — write down what you want to leave in the past, and symbolically release it",
      `Formulate 3 main intentions for the new year of life in the energy of ${name}`,
      "Spend an hour in silence — no phone, no communication. Listen to yourself",
      "Light a candle and give thanks for the past year. Each gratitude is a seed for the future",
      "Write down how you want to feel a year from now. Not what to have, but how to feel",
    ];
  }
  return [
    "El día de tu cumpleaños, haz balance del año pasado: anota las 3 lecciones principales",
    "Realiza un ritual de 'soltar': anota lo que quieres dejar en el pasado y libéralo de forma simbólica",
    `Formula 3 intenciones principales para el nuevo año de vida en la energía de ${name}`,
    "Pasa una hora en silencio, sin teléfono ni comunicación. Escúchate",
    "Enciende una vela y agradece el año pasado. Cada agradecimiento es una semilla para el futuro",
    "Anota cómo quieres sentirte dentro de un año. No qué tener, sino cómo sentirte",
  ];
}

export function getYearExtraLocalized(arcana: number, lang: string): YearExtraSections | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  if (arcana === 1) return L === 'en' ? extra1EN : extra1ES;

  const healing = (L === 'en' ? healingEN : healingES)[arcana] || (L === 'en' ? healingFallbackEN : healingFallbackES);
  const exam = (L === 'en' ? mainExamEN : mainExamES)[arcana] || (L === 'en' ? examFallbackEN : examFallbackES);
  const tasks = (L === 'en' ? yearTasksEN : yearTasksES)[arcana] || (L === 'en' ? yearTasksFallbackEN : yearTasksFallbackES);
  const sphere = (L === 'en' ? lifeSphereEN : lifeSphereES)[arcana] || (L === 'en' ? lifeSphereFallbackEN : lifeSphereFallbackES);

  return {
    healingThemes: healing,
    birthdayRitual: birthdayRitualLoc(arcana, L),
    mainExam: { question: exam.q, plusAnswers: exam.plus, minusAnswers: exam.minus },
    yearTasks: tasks,
    lifeSphereThemes: sphere,
  };
}
