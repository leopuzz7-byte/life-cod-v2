// EN/ES translations for psychProfile.ts.

type Psy = { name: string; desc: string };

export type PsychSet = {
  psychotypes: Record<string, Psy>;
  reactions: Record<number, string>;
  fears: Record<number, string>;
  scenarios: Record<number, string>;
  cycles: Record<number, string>;
};
export type PsychLabels = {
  consciousness: string; action: string; psychotype: string;
  fears: string; scenarios: string; none: string;
  fallbackName: (c: number, a: number) => string; fallbackDesc: string;
};

const EN: PsychSet = {
  psychotypes: {
    '1-1': { name: 'Lone wolf', desc: 'Acts alone, makes decisions without looking back' },
    '1-2': { name: 'Strategist-diplomat', desc: 'A leader who knows how to negotiate' },
    '1-3': { name: 'Idea generator', desc: 'An initiator with a talent for communication' },
    '1-4': { name: 'Empire builder', desc: 'A leader with discipline and order' },
    '1-5': { name: 'Adventurer', desc: 'A leader seeking new horizons' },
    '1-6': { name: 'Patron', desc: 'A leader who takes care of the team' },
    '1-7': { name: 'Strategist-analyst', desc: 'A leader with deep thinking' },
    '1-8': { name: 'Magnate', desc: 'A leader with a thirst for power and scale' },
    '1-9': { name: 'Visionary', desc: 'A leader with global thinking' },
    '2-1': { name: 'Power behind the throne', desc: 'Influences through connections, acts through a leader' },
    '2-2': { name: 'Mirror', desc: 'Reflects people, deep empathy' },
    '2-3': { name: 'Communicator', desc: 'Builds bridges between people' },
    '2-4': { name: 'Reliable backbone', desc: 'A partner who creates stability' },
    '2-5': { name: 'Adaptive partner', desc: 'Flexible in relationships, adjusts' },
    '2-6': { name: 'Keeper of the hearth', desc: 'Caring, family-oriented, self-sacrificing' },
    '2-7': { name: 'Wise advisor', desc: 'An intuitive and deep observer' },
    '2-8': { name: 'Business partner', desc: 'Knows how to work with strong people' },
    '2-9': { name: 'Healer', desc: "Understands others' pain, helps them transform" },
  },
  reactions: {
    1: "Dominates, takes control. Needs a partner who doesn't break, but doesn't fight either.",
    2: 'Adjusts, loses themselves. Needs a partner who gives space.',
    3: 'Turns conflict into a joke. Needs a partner who accepts lightness.',
    4: 'Closes off, withdraws into silence. Needs a patient partner.',
    5: 'Runs away or switches. Needs a partner who gives freedom.',
    6: "Takes responsibility for everything. Needs a partner who doesn't take advantage of it.",
    7: "Analyzes, detaches. Needs a partner who doesn't pressure with emotions.",
    8: 'Pressures, insists on their way. Needs a partner who can hold their ground.',
    9: 'Cuts off abruptly. Needs a partner who helps to end things gently.',
  },
  fears: {
    1: 'Fear of loneliness and rejection',
    2: 'Fear of betrayal and dependence',
    3: 'Fear of being misunderstood and ridiculed',
    4: 'Fear of chaos and loss of control',
    5: 'Fear of limitations and routine',
    6: 'Fear of being unneeded and rejected by family',
    7: 'Fear of meaninglessness and not knowing',
    8: 'Fear of poverty and powerlessness',
    9: 'Fear of loss and irreversibility',
  },
  scenarios: {
    1: "The 'I do it all myself' scenario — does everything alone, burns out",
    2: "The 'they can't manage without me' scenario — dissolves into others",
    3: "The 'eternal student' scenario — studies instead of acting",
    4: "The 'everything under control' scenario — neurosis from the impossibility of control",
    5: "The 'eternal traveler' scenario — runs from commitments",
    6: "The 'victim' scenario — carries everyone on their back",
    7: "The 'hermit' scenario — withdraws from people",
    8: "The 'tyrant' scenario — pressures for the sake of results",
    9: "The 'bridge burner' scenario — destroys connections",
  },
  cycles: {
    1: 'Cycle of lonely decisions — every 9 years the need to start everything over returns',
    2: "Cycle of dependence — every 9 years seeks a new 'rescuer'",
    3: "Cycle of incompletion — every 9 years starts but doesn't finish",
    4: 'Cycle of getting stuck — every 9 years runs into the system',
    5: 'Cycle of escape — every 9 years runs from routine',
    6: 'Cycle of burnout — every 9 years burns out from hyper-responsibility',
    7: 'Cycle of isolation — every 9 years withdraws into themselves',
    8: 'Cycle of struggle — every 9 years enters a conflict over resources',
    9: 'Cycle of resetting — every 9 years loses what they built',
  },
};

const ES: PsychSet = {
  psychotypes: {
    '1-1': { name: 'Lobo solitario', desc: 'Actúa solo, toma decisiones sin mirar atrás' },
    '1-2': { name: 'Estratega-diplomático', desc: 'Un líder que sabe negociar' },
    '1-3': { name: 'Generador de ideas', desc: 'Un iniciador con talento para la comunicación' },
    '1-4': { name: 'Constructor de imperios', desc: 'Un líder con disciplina y orden' },
    '1-5': { name: 'Aventurero', desc: 'Un líder que busca nuevos horizontes' },
    '1-6': { name: 'Protector', desc: 'Un líder que cuida del equipo' },
    '1-7': { name: 'Estratega-analista', desc: 'Un líder de pensamiento profundo' },
    '1-8': { name: 'Magnate', desc: 'Un líder con sed de poder y escala' },
    '1-9': { name: 'Visionario', desc: 'Un líder con pensamiento global' },
    '2-1': { name: 'Eminencia gris', desc: 'Influye a través de los vínculos, actúa a través de un líder' },
    '2-2': { name: 'Espejo', desc: 'Refleja a las personas, empatía profunda' },
    '2-3': { name: 'Comunicador', desc: 'Construye puentes entre las personas' },
    '2-4': { name: 'Retaguardia fiable', desc: 'Una pareja que crea estabilidad' },
    '2-5': { name: 'Pareja adaptativa', desc: 'Flexible en las relaciones, se adapta' },
    '2-6': { name: 'Guardián del hogar', desc: 'Cuidador, familiar, abnegado' },
    '2-7': { name: 'Consejero sabio', desc: 'Un observador intuitivo y profundo' },
    '2-8': { name: 'Socio de negocios', desc: 'Sabe trabajar con personas fuertes' },
    '2-9': { name: 'Sanador', desc: 'Comprende el dolor ajeno, ayuda a transformarse' },
  },
  reactions: {
    1: 'Domina, toma el control. Necesita una pareja que no se rompa, pero que tampoco luche.',
    2: 'Se adapta, se pierde a sí mismo. Necesita una pareja que dé espacio.',
    3: 'Convierte el conflicto en una broma. Necesita una pareja que acepte la ligereza.',
    4: 'Se cierra, se refugia en el silencio. Necesita una pareja paciente.',
    5: 'Huye o cambia de tema. Necesita una pareja que dé libertad.',
    6: 'Asume la responsabilidad de todo. Necesita una pareja que no abuse de ello.',
    7: 'Analiza, se distancia. Necesita una pareja que no presione con las emociones.',
    8: 'Presiona, insiste en lo suyo. Necesita una pareja que sepa mantenerse firme.',
    9: 'Corta de forma brusca. Necesita una pareja que ayude a cerrar con suavidad.',
  },
  fears: {
    1: 'Miedo a la soledad y al rechazo',
    2: 'Miedo a la traición y a la dependencia',
    3: 'Miedo a ser malinterpretado y ridiculizado',
    4: 'Miedo al caos y a la pérdida de control',
    5: 'Miedo a las limitaciones y a la rutina',
    6: 'Miedo a no ser necesario y a ser rechazado por la familia',
    7: 'Miedo a la falta de sentido y a la ignorancia',
    8: 'Miedo a la pobreza y a la falta de poder',
    9: 'Miedo a la pérdida y a lo irreversible',
  },
  scenarios: {
    1: "Guion 'lo hago yo solo' — lo hace todo solo, se agota",
    2: "Guion 'no se las arreglan sin mí' — se disuelve en los demás",
    3: "Guion 'eterno estudiante' — estudia en vez de actuar",
    4: "Guion 'todo bajo control' — neurosis por la imposibilidad de controlar",
    5: "Guion 'eterno viajero' — huye de los compromisos",
    6: "Guion 'víctima' — carga con todos a sus espaldas",
    7: "Guion 'ermitaño' — se aleja de la gente",
    8: "Guion 'tirano' — presiona por los resultados",
    9: "Guion 'quemador de puentes' — destruye los vínculos",
  },
  cycles: {
    1: 'Ciclo de decisiones solitarias — cada 9 años vuelve la necesidad de empezarlo todo de nuevo',
    2: "Ciclo de dependencia — cada 9 años busca un nuevo 'salvador'",
    3: 'Ciclo de lo inconcluso — cada 9 años empieza, pero no termina',
    4: 'Ciclo de estancamiento — cada 9 años choca con el sistema',
    5: 'Ciclo de huida — cada 9 años huye de la rutina',
    6: 'Ciclo de agotamiento — cada 9 años se quema por la hiperresponsabilidad',
    7: 'Ciclo de aislamiento — cada 9 años se refugia en sí mismo',
    8: 'Ciclo de lucha — cada 9 años entra en un conflicto por los recursos',
    9: 'Ciclo de puesta a cero — cada 9 años pierde lo que construyó',
  },
};

export function getPsychSet(lang: string): PsychSet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
export function getPsychLabels(lang: string): PsychLabels {
  if (lang === 'en') {
    return { consciousness: 'Consciousness', action: 'Actions', psychotype: 'Psychotype', fears: 'Fears (by deficits)', scenarios: 'Scenarios (by dominants)', none: 'none', fallbackName: (c, a) => `Type ${c}-${a}`, fallbackDesc: 'A unique combination of energies' };
  }
  if (lang === 'es') {
    return { consciousness: 'Conciencia', action: 'Acciones', psychotype: 'Psicotipo', fears: 'Miedos (por déficits)', scenarios: 'Guiones (por dominantes)', none: 'ninguno', fallbackName: (c, a) => `Tipo ${c}-${a}`, fallbackDesc: 'Una combinación única de energías' };
  }
  return { consciousness: 'Сознание', action: 'Действия', psychotype: 'Психотип', fears: 'Страхи (по дефицитам)', scenarios: 'Сценарии (по доминантам)', none: 'нет', fallbackName: (c, a) => `Тип ${c}-${a}`, fallbackDesc: 'Уникальная комбинация энергий' };
}
