// EN/ES translations for financialCodeLC.ts (channel/block/activation dicts + calc-trace labels).

type Channel = { name: string; desc: string; spheres: string[] };
type Block = { name: string; desc: string; mistakes: string[] };
type Activation = { name: string; desc: string };

export type FinLCSet = { channel: Record<number, Channel>; block: Record<number, Block>; activation: Record<number, Activation> };
export type FinLCLabels = { channel: string; block: string; activation: string };

const EN: FinLCSet = {
  channel: {
    1: { name: 'Channel of leadership', desc: 'Money through independent projects, entrepreneurship', spheres: ['Startups', 'Consulting', 'Personal brand', 'Management'] },
    2: { name: 'Channel of partnership', desc: 'Money through cooperation, mediation', spheres: ['Partnership business', 'Mediation', 'HR', 'Diplomacy'] },
    3: { name: 'Channel of creativity', desc: 'Money through communication and self-expression', spheres: ['Marketing', 'Content', 'Teaching', 'Art'] },
    4: { name: 'Channel of system', desc: 'Money through structure, order, discipline', spheres: ['Finance', 'Accounting', 'Real estate', 'Manufacturing'] },
    5: { name: 'Channel of freedom', desc: 'Money through change, travel, adaptation', spheres: ['Sales', 'Travel', 'Freelancing', 'Innovation'] },
    6: { name: 'Channel of care', desc: 'Money through helping and serving others', spheres: ['Medicine', 'Education', 'Social work', 'Restaurant business'] },
    7: { name: 'Channel of knowledge', desc: 'Money through expertise, research, analysis', spheres: ['IT', 'Science', 'Analytics', 'Psychology'] },
    8: { name: 'Channel of power', desc: 'Money through managing resources and scale', spheres: ['Investment', 'Corporations', 'Banking', 'Big business'] },
    9: { name: 'Channel of transformation', desc: 'Money through closing cycles and global projects', spheres: ['Charity', 'International business', 'Ecology', 'Spiritual practices'] },
  },
  block: {
    0: { name: 'No block', desc: 'The financial flow is open', mistakes: [] },
    1: { name: 'Block of fear', desc: 'Fear of starting, waiting for the perfect moment', mistakes: ['Postponing the start', "Waiting for others' permission"] },
    2: { name: 'Block of dependence', desc: 'Financial dependence on a partner', mistakes: ['Handing money control to another', "Not knowing how to count your own money"] },
    3: { name: 'Block of chatter', desc: 'Lots of plans — little action', mistakes: ['Discussing plans instead of executing', 'Spending on pleasures'] },
    4: { name: 'Block of rigidity', desc: "Money doesn't flow because of over-control", mistakes: ['Stinginess for its own sake', 'Refusing to invest'] },
    5: { name: 'Block of chaos', desc: 'Money comes and goes chaotically', mistakes: ['Impulsive spending', 'No financial plan'] },
    6: { name: 'Block of self-sacrifice', desc: 'You give money to others, nothing to yourself', mistakes: ['Working for free', 'Inability to set a price'] },
    7: { name: 'Block of perfectionism', desc: "You postpone earning until 'perfect knowledge'", mistakes: ['Endless learning instead of earning', 'Devaluing your knowledge'] },
    8: { name: 'Block of pressure', desc: 'You earn by forcing yourself', mistakes: ['Burnout for the sake of money', 'Harsh earning methods'] },
    9: { name: 'Block of letting go', desc: 'You hold on to old income sources', mistakes: ['Returning to models that no longer work', 'Fear of losing what you have'] },
  },
  activation: {
    1: { name: 'Activation through action', desc: 'Start doing — the money will follow you' },
    2: { name: 'Activation through people', desc: 'Find a partner or a mentor' },
    3: { name: 'Activation through your voice', desc: 'Make yourself known publicly' },
    4: { name: 'Activation through a plan', desc: 'Make a 12-month financial plan' },
    5: { name: 'Activation through change', desc: 'Change your approach to earning' },
    6: { name: 'Activation through value', desc: 'Show people your usefulness' },
    7: { name: 'Activation through expertise', desc: 'Monetize your knowledge' },
    8: { name: 'Activation through scale', desc: 'Increase your average check and volumes' },
    9: { name: 'Activation through mission', desc: 'Connect money with a higher purpose' },
  },
};

const ES: FinLCSet = {
  channel: {
    1: { name: 'Canal de liderazgo', desc: 'Dinero a través de proyectos autónomos, emprendimiento', spheres: ['Startups', 'Consultoría', 'Marca personal', 'Gestión'] },
    2: { name: 'Canal de asociación', desc: 'Dinero a través de la cooperación, la intermediación', spheres: ['Negocio en sociedad', 'Mediación', 'RR. HH.', 'Diplomacia'] },
    3: { name: 'Canal de la creatividad', desc: 'Dinero a través de la comunicación y la autoexpresión', spheres: ['Marketing', 'Contenido', 'Enseñanza', 'Arte'] },
    4: { name: 'Canal del sistema', desc: 'Dinero a través de la estructura, el orden, la disciplina', spheres: ['Finanzas', 'Contabilidad', 'Inmuebles', 'Producción'] },
    5: { name: 'Canal de la libertad', desc: 'Dinero a través de los cambios, los viajes, la adaptación', spheres: ['Ventas', 'Viajes', 'Trabajo autónomo', 'Innovación'] },
    6: { name: 'Canal del cuidado', desc: 'Dinero a través de ayudar y servir a los demás', spheres: ['Medicina', 'Educación', 'Ámbito social', 'Restauración'] },
    7: { name: 'Canal del conocimiento', desc: 'Dinero a través de la especialización, la investigación, el análisis', spheres: ['Informática', 'Ciencia', 'Analítica', 'Psicología'] },
    8: { name: 'Canal del poder', desc: 'Dinero a través de la gestión de recursos y la escala', spheres: ['Inversión', 'Corporaciones', 'Banca', 'Gran empresa'] },
    9: { name: 'Canal de la transformación', desc: 'Dinero a través del cierre de ciclos y proyectos globales', spheres: ['Beneficencia', 'Negocio internacional', 'Ecología', 'Prácticas espirituales'] },
  },
  block: {
    0: { name: 'Sin bloqueo', desc: 'El flujo financiero está abierto', mistakes: [] },
    1: { name: 'Bloqueo del miedo', desc: 'Miedo a empezar, esperas el momento perfecto', mistakes: ['Aplazar el arranque', 'Esperar el permiso de los demás'] },
    2: { name: 'Bloqueo de la dependencia', desc: 'Dependencia financiera de la pareja', mistakes: ['Ceder el control del dinero a otro', 'No saber contar tu propio dinero'] },
    3: { name: 'Bloqueo de la cháchara', desc: 'Muchos planes, poca acción', mistakes: ['Discutir planes en vez de ejecutarlos', 'Gastar en placeres'] },
    4: { name: 'Bloqueo de la rigidez', desc: 'El dinero no fluye por el hipercontrol', mistakes: ['Tacañería por tacañería', 'Negarse a invertir'] },
    5: { name: 'Bloqueo del caos', desc: 'El dinero llega y se va de forma caótica', mistakes: ['Gastos impulsivos', 'Falta de plan financiero'] },
    6: { name: 'Bloqueo del sacrificio', desc: 'Repartes dinero a los demás y a ti nada', mistakes: ['Trabajar gratis', 'Incapacidad de poner un precio'] },
    7: { name: 'Bloqueo del perfeccionismo', desc: "Aplazas ganar hasta el 'conocimiento perfecto'", mistakes: ['Aprender sin fin en vez de ganar', 'Desvalorizar tus conocimientos'] },
    8: { name: 'Bloqueo de la presión', desc: 'Ganas forzándote a ti mismo', mistakes: ['Agotamiento por el dinero', 'Métodos duros de ganar'] },
    9: { name: 'Bloqueo del soltar', desc: 'Te aferras a las viejas fuentes de ingresos', mistakes: ['Volver a modelos que ya no funcionan', 'Miedo a perder lo conseguido'] },
  },
  activation: {
    1: { name: 'Activación a través de la acción', desc: 'Empieza a hacer: el dinero te seguirá' },
    2: { name: 'Activación a través de las personas', desc: 'Busca un socio o un mentor' },
    3: { name: 'Activación a través de tu voz', desc: 'Date a conocer en público' },
    4: { name: 'Activación a través de un plan', desc: 'Haz un plan financiero a 12 meses' },
    5: { name: 'Activación a través del cambio', desc: 'Cambia tu enfoque para ganar' },
    6: { name: 'Activación a través del valor', desc: 'Muestra a la gente tu utilidad' },
    7: { name: 'Activación a través de la especialización', desc: 'Monetiza tus conocimientos' },
    8: { name: 'Activación a través de la escala', desc: 'Aumenta tu ticket medio y los volúmenes' },
    9: { name: 'Activación a través de la misión', desc: 'Conecta el dinero con un fin superior' },
  },
};

export function getFinLCSet(lang: string): FinLCSet | null {
  if (lang === 'en') return EN;
  if (lang === 'es') return ES;
  return null;
}
export function getFinLCLabels(lang: string): FinLCLabels {
  if (lang === 'en') return { channel: 'Channel', block: 'Block', activation: 'Activation' };
  if (lang === 'es') return { channel: 'Canal', block: 'Bloqueo', activation: 'Activación' };
  return { channel: 'Канал', block: 'Блок', activation: 'Активация' };
}
