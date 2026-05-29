// Переводы классической нумерологии (числа 1-9). Накладываются поверх русской базы.
// Непереведённые поля показываются по-русски (fallback).

export type KeyToText = {
  name: string;
  planet: string;
  luckyDay: string;
  luckyStone: string;
  luckyColor: string;
  karmicTask: string;
  positiveQualities: string[];
  negativeQualities: string[];
  professions: string[];
  description: string;
};

const en: Record<number, Partial<KeyToText>> = {
  1: {
    name: "The Leader", planet: "Sun", luckyDay: "Sunday", luckyStone: "Ruby", luckyColor: "Red",
    karmicTask: "Self-knowledge and finding yourself",
    positiveQualities: ["Organization", "Independence", "Will", "Determination", "Self-sufficiency", "Self-confidence", "Productivity", "Honesty", "Creativity"],
    negativeQualities: ["Egocentrism", "Vanity", "Arrogance", "Sharpness", "Irritability", "Authoritarianism", "Capriciousness"],
    professions: ["Own business", "Doctor", "Manager", "Director", "Designer", "Banker", "Actor", "Speaker", "Writer", "Executive", "Investor", "Lawyer"],
    description: "You are a leader with a strong will. You don't doubt your goals and tasks. Your main strength is energy, pioneering, and leadership. Freedom matters to you: in relationships, in work, in movement. You are able to create grand projects and lead people.",
  },
  2: {
    name: "The Diplomat", planet: "Moon", luckyDay: "Monday", luckyStone: "Pearl", luckyColor: "White",
    karmicTask: "Gaining a kind inner friend",
    positiveQualities: ["Beauty", "Femininity", "Sexuality", "Sensuality", "Attractiveness", "Tenderness", "Conscience", "Mercy", "Compassion", "Friendliness", "Politeness"],
    negativeQualities: ["Changeability", "Difficulty choosing", "Scattered thoughts", "Inconstancy", "Touchiness", "Indecisiveness", "Uncertainty"],
    professions: ["Teacher", "Mass service sector", "Agriculture", "Writer", "Audit", "Chef", "Psychologist", "Medicine", "Hotels and restaurants", "Chemist", "Import/Export", "Massage therapist", "Advertising", "Journalism"],
    description: "You are an emotional and sensitive person. You have an innate ability to feel others and find compromises. Your mind is tuned to building strong bonds and creating balance. You are a reliable partner one can lean on.",
  },
  3: {
    name: "The Creator", planet: "Jupiter", luckyDay: "Thursday", luckyStone: "Yellow sapphire", luckyColor: "Yellow",
    karmicTask: "Passing on knowledge and developing spirituality",
    positiveQualities: ["Determination", "Education", "Generosity", "Optimism", "Self-confidence", "Independence", "Activity", "Initiative", "Friendliness", "Sociability", "Cheerfulness"],
    negativeQualities: ["Intolerance", "Overconfidence", "Inattention", "Wastefulness", "Desire to argue", "Reluctance to see details", "Irresponsibility", "Boastfulness"],
    professions: ["Own business", "Architect", "Finance and accounting", "Scientist", "Lawyer", "Engineer", "Tourism", "Philosopher", "Jeweler", "Top manager", "Teacher", "Writer", "Doctor", "Designer"],
    description: "You love studying and analyzing information. You can be a person of passion, so you need to learn self-control. You carry the energy of cunning and the temptation of guile, which it's important to channel positively. Through passing on knowledge, you become even smarter and more successful.",
  },
  4: {
    name: "The Innovator", planet: "Rahu (Saturn)", luckyDay: "Saturday", luckyStone: "Hessonite (gomed)", luckyColor: "Brown",
    karmicTask: "Achieving a balance between the material and the spiritual",
    positiveQualities: ["Analysis", "Stability", "Endurance", "Persistence", "Constructiveness", "Loyalty", "Reliability", "Analytical ability", "Love of conclusions and results"],
    negativeQualities: ["Living in illusions", "Insensitivity", "Cruelty", "Fears", "Distrust", "Stubbornness", "Rudeness", "Insolence", "Sarcasm", "Treachery", "A tendency to deceive"],
    professions: ["IT and programming", "Lawyer", "Anesthesiologist", "Radio and television", "Internet", "Electrical work", "Media", "Science", "New technologies", "Detective", "Esoterics", "Secret services", "Chemistry", "Casino"],
    description: "You came into this world to create the new. Your mind is realized through creativity. You're inspired by novelty of ideas, which you love to bring to life. It's important to pay attention to those matters and situations where you can manifest as an innovator. Creativity and creating the new are your main driving force.",
  },
  5: {
    name: "The Communicator", planet: "Mercury", luckyDay: "Wednesday", luckyStone: "Emerald", luckyColor: "Green",
    karmicTask: "Communication and contacts",
    positiveQualities: ["Education", "Inventiveness", "Intellect", "Attractiveness", "Love of freedom", "Progressiveness", "Versatility", "Adaptability", "Variety", "Love of travel", "Curiosity", "Ability to use a chance"],
    negativeQualities: ["Doubts", "Coldness", "Calculation", "Impatience", "Superficiality", "Restlessness", "Reluctance to grow up and take responsibility", "Mercenariness", "Touchiness"],
    professions: ["Import-export", "Scientist, teacher", "New technologies", "Businessperson", "Numerologist, astrologer", "Accountant, financier", "Secretary", "Sales, cashier", "Administrator", "Tour guide", "Manager", "Courier", "Mathematician", "Broker", "Forex", "Writer, editor", "Programmer", "Media", "Logistics"],
    description: "You are a pragmatist, you like consistent action so you can calmly get your bearings in a situation. Success accompanies you in business, in sales, and in expanding contacts. You have a subtle emotional body, so you'll be a person who's aware of everything.",
  },
  6: {
    name: "The Harmonizer", planet: "Venus", luckyDay: "Friday", luckyStone: "Diamond", luckyColor: "White",
    karmicTask: "Fighting temptations and developing love",
    positiveQualities: ["Attractiveness", "Sexuality", "Creativity", "Friendship", "Artistry", "Sensuality", "Passion", "Attentiveness", "Politeness"],
    negativeQualities: ["Passivity", "Laziness", "Low moral standards", "Selfishness", "Tendency toward dependence", "Indulging weaknesses"],
    professions: ["Fashion", "Art", "Music", "Dance", "Beauty salon", "Beauty industry", "Massage therapist", "Cosmetologist", "Hairdresser", "Designer", "Artist", "Engraver", "Craftsman", "Jeweler", "Performer", "Leisure industry"],
    description: "You came into this world as a friend at hand. Your mind is directed toward true relationships and beauty, which makes your life harmonious. You influence the people around you. It's you who can be the most important teacher in your close circles without great effort.",
  },
  7: {
    name: "The Seeker", planet: "Ketu", luckyDay: "Sunday, Monday, Wednesday", luckyStone: "Cat's eye", luckyColor: "Gray",
    karmicTask: "A balance between the spiritual and the material",
    positiveQualities: ["A striving for spirituality", "Wisdom", "Ability to distinguish bad from good", "Paranormal abilities", "Sensitivity", "Contemplativeness", "Ability to heal", "Creativity"],
    negativeQualities: ["Insecurity", "Fixation on problems", "Ghostliness", "Indifference to the material world", "Disorganization", "Irresponsibility", "Dependence on people", "Substance addiction", "Indecisiveness", "Introversion", "Detachment"],
    professions: ["Sports", "Philosophy", "Spiritual practices", "Medicine", "Psychology", "Yoga", "Healing", "Esoterics", "Music", "Art", "Literature", "Research"],
    description: "You are the kind of person valued for wisdom and depth. If you don't engage in planning, sports, and discipline, chaos reigns in your life. You need to release grievances (sauna, breathwork, or through yoga) to live without creating karma for yourself.",
  },
  8: {
    name: "The Administrator", planet: "Saturn", luckyDay: "Saturday", luckyStone: "Blue sapphire", luckyColor: "Dark blue",
    karmicTask: "Responsibility and service",
    positiveQualities: ["Responsibility", "Diligence", "Practicality", "Organization", "Determination", "Endurance", "Justice", "Discipline", "Ambition"],
    negativeQualities: ["Stubbornness", "Rigidity", "Pessimism", "Stinginess", "Domineering", "Withdrawal", "Criticism", "Conservatism"],
    professions: ["Management", "Banking", "Real estate", "Construction", "Manufacturing", "Politics", "Law", "Finance", "Administration", "Civil service"],
    description: "You came into this world to achieve great goals through hard work. Your mind is tuned to responsibility and discipline. You are able to manage large projects and people. Your path is a gradual ascent to the peaks through overcoming obstacles.",
  },
  9: {
    name: "The Humanist", planet: "Mars", luckyDay: "Tuesday", luckyStone: "Coral", luckyColor: "Red",
    karmicTask: "Serving humanity and completing cycles",
    positiveQualities: ["Compassion", "Altruism", "Wisdom", "Spirituality", "Creativity", "Energy", "Courage", "Magnanimity", "Romanticism"],
    negativeQualities: ["Emotional instability", "Aggressiveness", "Impulsiveness", "Impatience", "Selfishness", "Absent-mindedness", "Conflict-proneness"],
    professions: ["Charity", "Medicine", "Psychology", "Social work", "Art", "Music", "Theater", "Sports", "Military affairs", "Politics", "Teaching", "Spiritual mentorship"],
    description: "You complete the cycle of numbers and carry within you the energy of all the previous ones. Your purpose is to serve other people and humanity as a whole. You are able to inspire and lead. Your wisdom comes through experience and spiritual development.",
  },
};

const es: Record<number, Partial<KeyToText>> = {
  1: {
    name: "El Líder", planet: "Sol", luckyDay: "Domingo", luckyStone: "Rubí", luckyColor: "Rojo",
    karmicTask: "Autoconocimiento y encontrarse a uno mismo",
    positiveQualities: ["Organización", "Independencia", "Voluntad", "Determinación", "Autosuficiencia", "Confianza en uno mismo", "Productividad", "Honestidad", "Creatividad"],
    negativeQualities: ["Egocentrismo", "Vanidad", "Arrogancia", "Brusquedad", "Irritabilidad", "Autoritarismo", "Capricho"],
    professions: ["Negocio propio", "Médico", "Gerente", "Director", "Diseñador", "Banquero", "Actor", "Orador", "Escritor", "Directivo", "Inversor", "Abogado"],
    description: "Eres un líder con gran voluntad. No dudas de tus metas y tareas. Tu fuerza principal es la energía, la iniciativa pionera y el liderazgo. Te importa la libertad: en las relaciones, en el trabajo, en los desplazamientos. Eres capaz de crear proyectos grandiosos y guiar a la gente.",
  },
  2: {
    name: "El Diplomático", planet: "Luna", luckyDay: "Lunes", luckyStone: "Perla", luckyColor: "Blanco",
    karmicTask: "Encontrar un buen amigo interior",
    positiveQualities: ["Belleza", "Feminidad", "Sexualidad", "Sensualidad", "Atractivo", "Ternura", "Conciencia", "Clemencia", "Compasión", "Amabilidad", "Cortesía"],
    negativeQualities: ["Variabilidad", "Problema de elección", "Pensamientos dispersos", "Inconstancia", "Susceptibilidad", "Indecisión", "Incertidumbre"],
    professions: ["Educador", "Sector de servicios masivos", "Agricultura", "Escritor", "Auditoría", "Cocinero", "Psicólogo", "Medicina", "Hoteles y restaurantes", "Químico", "Importación/Exportación", "Masajista", "Publicidad", "Periodismo"],
    description: "Eres una persona emocional y sensible. Posees una capacidad innata para sentir a los demás y hallar compromisos. Tu mente está orientada a construir vínculos fuertes y crear equilibrio. Eres una pareja fiable en quien apoyarse.",
  },
  3: {
    name: "El Creador", planet: "Júpiter", luckyDay: "Jueves", luckyStone: "Zafiro amarillo", luckyColor: "Amarillo",
    karmicTask: "Transmitir conocimiento y desarrollar la espiritualidad",
    positiveQualities: ["Determinación", "Educación", "Generosidad", "Optimismo", "Confianza en uno mismo", "Independencia", "Actividad", "Iniciativa", "Amabilidad", "Sociabilidad", "Alegría de vivir"],
    negativeQualities: ["Intolerancia", "Exceso de confianza", "Falta de atención", "Despilfarro", "Ganas de discutir", "No querer ver los detalles", "Irresponsabilidad", "Fanfarronería"],
    professions: ["Negocio propio", "Arquitecto", "Finanzas y contabilidad", "Científico", "Abogado", "Ingeniero", "Turismo", "Filósofo", "Joyero", "Alto directivo", "Profesor", "Escritor", "Médico", "Diseñador"],
    description: "Te gusta estudiar y analizar la información. Puedes ser una persona apasionada, por eso necesitas aprender el autocontrol. Llevas en ti la energía de la astucia y la tentación del engaño, que es importante encauzar de forma positiva. Al transmitir conocimiento te vuelves aún más sabio y exitoso.",
  },
  4: {
    name: "El Innovador", planet: "Rahu (Saturno)", luckyDay: "Sábado", luckyStone: "Hessonita (gomed)", luckyColor: "Marrón",
    karmicTask: "Lograr el equilibrio entre lo material y lo espiritual",
    positiveQualities: ["Análisis", "Estabilidad", "Resistencia", "Perseverancia", "Constructividad", "Lealtad", "Fiabilidad", "Capacidad de análisis", "Amor por las conclusiones y los resultados"],
    negativeQualities: ["Vivir en ilusiones", "Insensibilidad", "Crueldad", "Miedos", "Desconfianza", "Terquedad", "Grosería", "Insolencia", "Sarcasmo", "Perfidia", "Tendencia al engaño"],
    professions: ["TI y programación", "Abogado", "Anestesiólogo", "Radio y televisión", "Internet", "Electricidad", "Medios", "Ciencia", "Nuevas tecnologías", "Detective", "Esoterismo", "Servicios secretos", "Química", "Casino"],
    description: "Viniste a este mundo para crear lo nuevo. Tu mente se realiza a través de lo creativo. Te inspira la novedad de las ideas, que te encanta materializar. Es importante prestar atención a los asuntos y situaciones donde puedes manifestarte como innovador. La creatividad y crear lo nuevo son tu principal motor.",
  },
  5: {
    name: "El Comunicador", planet: "Mercurio", luckyDay: "Miércoles", luckyStone: "Esmeralda", luckyColor: "Verde",
    karmicTask: "Comunicación y contactos",
    positiveQualities: ["Educación", "Ingenio", "Intelecto", "Atractivo", "Amor por la libertad", "Progresismo", "Versatilidad", "Capacidad de adaptación", "Variedad", "Amor por los viajes", "Curiosidad", "Capacidad de aprovechar la ocasión"],
    negativeQualities: ["Dudas", "Frialdad", "Cálculo", "Impaciencia", "Superficialidad", "Inquietud", "No querer madurar ni asumir responsabilidad", "Mercantilismo", "Susceptibilidad"],
    professions: ["Importación-exportación", "Científico, maestro", "Nuevas tecnologías", "Empresario", "Numerólogo, astrólogo", "Contable, financiero", "Secretario", "Ventas, cajero", "Administrador", "Guía turístico", "Gerente", "Mensajero", "Matemático", "Bróker", "Forex", "Escritor, editor", "Programador", "Medios", "Logística"],
    description: "Eres una persona pragmática, te gusta la acción consecuente para orientarte con calma en cada situación. El éxito te acompaña en los negocios, en las ventas y en la ampliación de contactos. Tienes un cuerpo emocional sutil, por eso serás alguien que está al tanto de todo.",
  },
  6: {
    name: "El Armonizador", planet: "Venus", luckyDay: "Viernes", luckyStone: "Diamante", luckyColor: "Blanco",
    karmicTask: "Luchar contra las tentaciones y desarrollar el amor",
    positiveQualities: ["Atractivo", "Sexualidad", "Creatividad", "Amistad", "Talento artístico", "Sensualidad", "Pasión", "Atención", "Cortesía"],
    negativeQualities: ["Pasividad", "Pereza", "Bajos principios morales", "Egoísmo", "Tendencia a la dependencia", "Ceder a las debilidades"],
    professions: ["Moda", "Arte", "Música", "Danza", "Salón de belleza", "Sector de la belleza", "Masajista", "Cosmetólogo", "Peluquero", "Diseñador", "Pintor", "Grabador", "Artesano", "Joyero", "Artista", "Sector del ocio"],
    description: "Viniste a este mundo como un amigo a mano. Tu mente está orientada hacia las relaciones verdaderas y la belleza, lo que hace tu vida armoniosa. Influyes en las personas que te rodean. Eres tú quien puede ser el maestro más importante en tus círculos cercanos sin gran esfuerzo.",
  },
  7: {
    name: "El Buscador", planet: "Ketu", luckyDay: "Domingo, lunes, miércoles", luckyStone: "Ojo de gato", luckyColor: "Gris",
    karmicTask: "Equilibrio entre lo espiritual y lo material",
    positiveQualities: ["Afán de espiritualidad", "Sabiduría", "Capacidad de distinguir lo malo de lo bueno", "Capacidades paranormales", "Sensibilidad", "Contemplación", "Capacidad de sanar", "Creatividad"],
    negativeQualities: ["Inseguridad", "Fijación en los problemas", "Carácter fantasmal", "Indiferencia hacia el mundo material", "Desorganización", "Irresponsabilidad", "Dependencia de la gente", "Adicción a sustancias", "Indecisión", "Introversión", "Distanciamiento"],
    professions: ["Deporte", "Filosofía", "Prácticas espirituales", "Medicina", "Psicología", "Yoga", "Sanación", "Esoterismo", "Música", "Arte", "Literatura", "Investigación"],
    description: "Eres esa persona a quien valoran por su sabiduría y profundidad. Si no te dedicas a la planificación, el deporte y la disciplina, el caos reina en tu vida. Necesitas soltar los rencores (sauna, respiración o mediante el yoga) para vivir sin crearte karma.",
  },
  8: {
    name: "El Gestor", planet: "Saturno", luckyDay: "Sábado", luckyStone: "Zafiro azul", luckyColor: "Azul oscuro",
    karmicTask: "Responsabilidad y servicio",
    positiveQualities: ["Responsabilidad", "Laboriosidad", "Practicidad", "Organización", "Determinación", "Resistencia", "Justicia", "Disciplina", "Ambición"],
    negativeQualities: ["Terquedad", "Rigidez", "Pesimismo", "Tacañería", "Autoritarismo", "Aislamiento", "Carácter crítico", "Conservadurismo"],
    professions: ["Gestión", "Banca", "Inmobiliaria", "Construcción", "Producción", "Política", "Derecho", "Finanzas", "Administración", "Servicio público"],
    description: "Viniste a este mundo para lograr grandes metas mediante el trabajo tenaz. Tu mente está orientada a la responsabilidad y la disciplina. Eres capaz de dirigir grandes proyectos y personas. Tu camino es un ascenso gradual a las cumbres superando obstáculos.",
  },
  9: {
    name: "El Humanista", planet: "Marte", luckyDay: "Martes", luckyStone: "Coral", luckyColor: "Rojo",
    karmicTask: "Servir a la humanidad y cerrar ciclos",
    positiveQualities: ["Compasión", "Altruismo", "Sabiduría", "Espiritualidad", "Creatividad", "Energía", "Valentía", "Magnanimidad", "Romanticismo"],
    negativeQualities: ["Inestabilidad emocional", "Agresividad", "Impulsividad", "Impaciencia", "Egoísmo", "Distracción", "Conflictividad"],
    professions: ["Beneficencia", "Medicina", "Psicología", "Trabajo social", "Arte", "Música", "Teatro", "Deporte", "Asuntos militares", "Política", "Docencia", "Mentoría espiritual"],
    description: "Cierras el ciclo de los números y llevas en ti la energía de todos los anteriores. Tu propósito es servir a otras personas y a la humanidad en su conjunto. Eres capaz de inspirar y guiar. Tu sabiduría llega a través de la experiencia y el desarrollo espiritual.",
  },
};

export const keytoOverlays: Record<string, Record<number, Partial<KeyToText>>> = { en, es };
