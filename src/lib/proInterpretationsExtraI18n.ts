// EN/ES translations for the extra PRO modules: Financial Code, Ancestral programs,
// Contract energy, Daily forecast (proInterpretationsExtra.ts).
// Parallel language path: the Russian base stays untouched and is used as fallback (lang 'ru').
// Arcana names/professions/descriptions come from getArcana() and are already localized;
// here we translate the surrounding template text and localize element/planet names.

import { getArcana } from "@/lib/arcana";
import type { FinancialCodeProData, AncestralProData, ContractProData, DailyProData } from "./proInterpretationsExtra";

type Lang = 'en' | 'es';

const elementMap: Record<Lang, Record<string, string>> = {
  en: { "Огонь": "Fire", "Вода": "Water", "Воздух": "Air", "Земля": "Earth" },
  es: { "Огонь": "Fuego", "Вода": "Agua", "Воздух": "Aire", "Земля": "Tierra" },
};
const planetMapX: Record<Lang, Record<string, string>> = {
  en: { "Венера": "Venus", "Луна": "Moon", "Марс": "Mars", "Меркурий": "Mercury", "Нептун": "Neptune", "Плутон": "Pluto", "Сатурн": "Saturn", "Солнце": "Sun", "Уран": "Uranus", "Юпитер": "Jupiter" },
  es: { "Венера": "Venus", "Луна": "Luna", "Марс": "Marte", "Меркурий": "Mercurio", "Нептун": "Neptuno", "Плутон": "Plutón", "Сатурн": "Saturno", "Солнце": "Sol", "Уран": "Urano", "Юпитер": "Júpiter" },
};
const el = (v: string | undefined, L: Lang) => (v ? elementMap[L][v] || v : '');
const pl = (v: string | undefined, L: Lang) => (v ? planetMapX[L][v] || v : '');

// ==================== FINANCIAL CODE ====================
export function getFinancialCodeProLocalized(talent: number, resource: number, mission: number, block: number, lang: string): FinancialCodeProData | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  const t = getArcana(talent), r = getArcana(resource), m = getArcana(mission), b = getArcana(block);
  const moneyArchetype = ((talent + block - 1) % 22) + 1;

  if (L === 'en') {
    return {
      intro: `Your financial code reveals the deep mechanisms of your relationship with money. Talent (${t?.name || talent}) is your natural way of earning. Resource (${r?.name || resource}) is the energy that sustains the financial flow. Mission (${m?.name || mission}) is the higher goal of your material path. Block (${b?.name || block}) is what unconsciously prevents you from receiving money to the fullest. Understanding these four points is the key to financial freedom.`,
      talentDeep: `Arcana ${talent} (${t?.name}) in the talent position means that your natural way of earning is connected with the energy of ${el(t?.element, L) || 'transformation'}. The planet ${pl(t?.planet, L) || 'of your arcana'} amplifies abilities in the field of: ${t?.professions?.slice(0, 3).join(', ') || 'consulting, management, creativity'}. Your talent shows itself not just in skills but in the energetic attraction of certain opportunities. When you act from this energy, money comes easily and naturally. The key is not to try to earn 'like everyone else', but to find your unique style.`,
      resourceDeep: `Arcana ${resource} (${r?.name}) as your financial resource points to the source of your energy for earning. This is your 'battery' for financial activity. ${r?.personalDescription?.substring(0, 200) || 'This energy supports you in moments of financial difficulty and gives strength for new undertakings.'}. When the resource is depleted, you feel apathy toward money and financial decisions. Restore it through: contact with nature (the element of ${el(r?.element, L) || 'your arcana'}), meditation on abundance, and physical activity.`,
      missionDeep: `Arcana ${mission} (${m?.name}) as your financial mission shows WHY you need money on a deep level. It's not about 'I want a lot of money', but about the higher goal of your material path. ${m?.personalDescription?.substring(0, 200) || 'Your mission is to transform your relationship with money from fear and scarcity into conscious abundance.'}. When you earn in line with your mission, you feel satisfaction not only from the amount but from the process. Money becomes a tool of your realization, not an end in itself.`,
      blockDeep: `Arcana ${block} (${b?.name}) in the block position is your unconscious 'emergency brake' for money. When you approach a certain income level, this arcana 'switches on' and creates situations that disrupt the financial flow. This can show up as: unexpected expenses, the sabotage of important deals, fear of a raise or expansion. ${b?.personalDescription?.substring(0, 200) || 'Awareness of the block is the first step to overcoming it.'}. Working with this block is the key to a breakthrough to a new financial level.`,
      moneyPsychology: `Your money psychology is defined by the pair Talent (${talent}) + Block (${block}). The sum of these arcana (${moneyArchetype}) points to your 'money archetype'. You tend toward ${talent > 11 ? 'strategic thinking and long-term investments' : 'quick decisions and active earning'}. Your block (${b?.name}) creates a characteristic pattern: ${block <= 7 ? 'fear of starting and investing' : block <= 14 ? 'difficulties with retaining and scaling' : 'psychological barriers and self-sabotage'}. Become aware of this pattern — and you'll see how it influences every financial decision.`,
      incomeStrategy: `Based on your code, the optimal income strategy is: ${talent <= 7 ? 'Active earning through personal competencies. Freelancing, consulting, expertise. Your energy is at its maximum with personal involvement.' : talent <= 14 ? 'Systematic income through building structures. Business, management, delegation. Build systems that work without you.' : 'Passive and investment income. Copyrights, royalties, investments. Create something once — receive income continuously.'}. The Resource (${r?.name}) suggests: fuel your financial activity through ${resource <= 11 ? 'social connections and networking' : 'solitary analysis and strategic planning'}.`,
      investmentProfile: `Your investment profile: ${resource <= 7 ? 'Conservative. Suited to you: deposits, bonds, real estate. High-risk assets cause stress.' : resource <= 14 ? 'Balanced. Diversification is optimal: 60% conservative, 40% risky assets.' : 'Aggressive. You can take risks: startups, cryptocurrency, risky projects. But set stop-losses.'}. The Block (${b?.name}) warns: don't make financial decisions in a state of ${block <= 11 ? 'fear and haste' : 'euphoria and excessive optimism'}.`,
      financialRisks: [
        `The block '${b?.name}' may manifest as an unexpected loss of income or a large unforeseen expense`,
        `Ignoring your talent (${t?.name}) and trying to earn in a way that isn't 'yours' leads to burnout`,
        `Depleting the resource (${r?.name}) without replenishing it is a path to financial apathy`,
        `Deviating from the mission (${m?.name}) creates the feeling of 'I earn, but I'm unhappy'`,
        `Copying others' financial strategies instead of following your unique code`,
      ],
      financialOpportunities: [
        `Professions matching your talent (${t?.name}): ${t?.professions?.join(', ') || 'consulting, expertise, creating value'}`,
        `A resourceful environment: surroundings connected with the energy of ${el(r?.element, L) || 'your resource'} strengthen the financial flow`,
        `Partnerships with people whose talent complements your block — they offset your weakness`,
        `Investment in education and skills connected with your mission (${m?.name})`,
        `Creating automatic income sources working in the energy of your talent`,
      ],
      actionPlan: [
        `Make a list of all your current income sources and assess which of them match your talent (${t?.name})`,
        `Identify how your block (${b?.name}) manifests — write down 3 situations when you sabotaged financial growth`,
        `Weekly, replenish your financial resource: ${resource <= 11 ? 'communicating with successful people, networking, collaborations' : 'meditation on abundance, visualization, working with money affirmations'}`,
        `Create a 'financial ritual' — a weekly review of income/expenses in a calm setting`,
        `Invest 10% of your income in developing skills connected with your mission (${m?.name})`,
      ],
      avoidList: [
        `Don't compare your financial path with others' — your code is unique`,
        `Don't make financial decisions out of fear (activation of the block ${b?.name})`,
        `Don't ignore your body's signals under financial stress — it's a sign of resource depletion`,
        `Don't take loans impulsively — ${block <= 11 ? 'the fear of scarcity pushes you into rash borrowing' : "the illusion of 'I'll earn it tomorrow' deceives you"}`,
        `Don't work yourself to the bone — burnout destroys the financial flow for a long time`,
      ],
      conclusion: `Your financial code ${talent}-${resource}-${mission}-${block} is a unique combination that defines your path to material well-being. Talent (${t?.name}) is your natural channel of income. Resource (${r?.name}) is the source of energy for financial activity. Mission (${m?.name}) is the higher meaning of your material path. Block (${b?.name}) is what needs to be recognized and transformed. When all four elements work harmoniously, money stops being a problem and becomes a tool of your realization.`,
      keyThought: `Your path to financial freedom lies through ${t?.name}, not through fighting with ${b?.name}`,
    };
  }

  return {
    intro: `Tu código financiero revela los mecanismos profundos de tu relación con el dinero. El Talento (${t?.name || talent}) es tu manera natural de ganar. El Recurso (${r?.name || resource}) es la energía que sostiene el flujo financiero. La Misión (${m?.name || mission}) es el fin superior de tu camino material. El Bloqueo (${b?.name || block}) es lo que, de forma inconsciente, te impide recibir dinero en plenitud. Comprender estos cuatro puntos es la llave de la libertad financiera.`,
    talentDeep: `El arcano ${talent} (${t?.name}) en la posición del talento significa que tu manera natural de ganar está ligada a la energía de ${el(t?.element, L) || 'la transformación'}. El planeta ${pl(t?.planet, L) || 'de tu arcano'} potencia las capacidades en el ámbito de: ${t?.professions?.slice(0, 3).join(', ') || 'consultoría, gestión, creatividad'}. Tu talento se manifiesta no solo en habilidades, sino en la atracción energética de ciertas oportunidades. Cuando actúas desde esa energía, el dinero llega fácil y natural. La clave es no intentar ganar 'como todos', sino encontrar tu estilo único.`,
    resourceDeep: `El arcano ${resource} (${r?.name}) como tu recurso financiero señala la fuente de tu energía para ganar. Es tu 'batería' para la actividad financiera. ${r?.personalDescription?.substring(0, 200) || 'Esta energía te sostiene en los momentos de dificultad financiera y te da fuerzas para nuevos comienzos.'}. Cuando el recurso se agota, sientes apatía hacia el dinero y las decisiones financieras. Recupéralo a través de: el contacto con la naturaleza (el elemento ${el(r?.element, L) || 'de tu arcano'}), la meditación sobre la abundancia y la actividad física.`,
    missionDeep: `El arcano ${mission} (${m?.name}) como misión financiera muestra PARA QUÉ necesitas el dinero a un nivel profundo. No se trata de 'quiero mucho dinero', sino del fin superior de tu camino material. ${m?.personalDescription?.substring(0, 200) || 'Tu misión es transformar tu relación con el dinero, del miedo y la escasez a la abundancia consciente.'}. Cuando ganas en sintonía con tu misión, sientes satisfacción no solo por la cantidad, sino por el proceso. El dinero se convierte en una herramienta de tu realización, no en un fin en sí mismo.`,
    blockDeep: `El arcano ${block} (${b?.name}) en la posición del bloqueo es tu 'freno de emergencia' inconsciente para el dinero. Cuando te acercas a cierto nivel de ingresos, este arcano se 'activa' y crea situaciones que cortan el flujo financiero. Puede manifestarse como: gastos inesperados, el sabotaje de acuerdos importantes, miedo al ascenso o a la expansión. ${b?.personalDescription?.substring(0, 200) || 'Tomar conciencia del bloqueo es el primer paso para superarlo.'}. Trabajar con este bloqueo es la llave para dar un salto a un nuevo nivel financiero.`,
    moneyPsychology: `Tu psicología del dinero se define por el par Talento (${talent}) + Bloqueo (${block}). La suma de estos arcanos (${moneyArchetype}) señala tu 'arquetipo del dinero'. Tiendes ${talent > 11 ? 'al pensamiento estratégico y a las inversiones a largo plazo' : 'a las decisiones rápidas y al ingreso activo'}. Tu bloqueo (${b?.name}) crea un patrón característico: ${block <= 7 ? 'miedo a empezar e invertir' : block <= 14 ? 'dificultades para retener y escalar' : 'barreras psicológicas y autosabotaje'}. Toma conciencia de este patrón y verás cómo influye en cada decisión financiera.`,
    incomeStrategy: `Según tu código, la estrategia de ingresos óptima es: ${talent <= 7 ? 'Ingreso activo a través de las competencias personales. Trabajo autónomo, consultoría, experiencia. Tu energía es máxima con la implicación personal.' : talent <= 14 ? 'Ingreso sistemático a través de la creación de estructuras. Negocio, gestión, delegación. Construye sistemas que funcionen sin ti.' : 'Ingreso pasivo y de inversión. Derechos de autor, regalías, inversiones. Crea algo una vez y recibe ingresos de forma continua.'}. El Recurso (${r?.name}) sugiere: alimenta tu actividad financiera a través de ${resource <= 11 ? 'los vínculos sociales y el networking' : 'el análisis en soledad y la planificación estratégica'}.`,
    investmentProfile: `Tu perfil de inversión: ${resource <= 7 ? 'Conservador. Te convienen: depósitos, bonos, inmuebles. Los activos de alto riesgo te causan estrés.' : resource <= 14 ? 'Equilibrado. Lo óptimo es la diversificación: 60% de activos conservadores, 40% de riesgo.' : 'Agresivo. Puedes arriesgar: startups, criptomonedas, proyectos de riesgo. Pero pon stop-loss.'}. El Bloqueo (${b?.name}) advierte: no tomes decisiones financieras en un estado de ${block <= 11 ? 'miedo y prisa' : 'euforia y optimismo excesivo'}.`,
    financialRisks: [
      `El bloqueo '${b?.name}' puede manifestarse como una pérdida inesperada de ingresos o un gran gasto imprevisto`,
      `Ignorar tu talento (${t?.name}) e intentar ganar de una forma que no es 'la tuya' lleva al agotamiento`,
      `Agotar el recurso (${r?.name}) sin reponerlo es un camino hacia la apatía financiera`,
      `Desviarte de la misión (${m?.name}) crea la sensación de 'gano, pero soy infeliz'`,
      `Copiar las estrategias financieras ajenas en lugar de seguir tu código único`,
    ],
    financialOpportunities: [
      `Profesiones acordes a tu talento (${t?.name}): ${t?.professions?.join(', ') || 'consultoría, experiencia, creación de valor'}`,
      `Un entorno con recursos: rodearte de la energía de ${el(r?.element, L) || 'tu recurso'} refuerza el flujo financiero`,
      `Asociaciones con personas cuyo talento complementa tu bloqueo: compensan tu debilidad`,
      `Inversión en educación y habilidades ligadas a tu misión (${m?.name})`,
      `Crear fuentes de ingreso automáticas que trabajen en la energía de tu talento`,
    ],
    actionPlan: [
      `Haz una lista de todas tus fuentes de ingreso actuales y evalúa cuáles encajan con tu talento (${t?.name})`,
      `Identifica cómo se manifiesta tu bloqueo (${b?.name}): anota 3 situaciones en que saboteaste tu crecimiento financiero`,
      `Cada semana, repón tu recurso financiero: ${resource <= 11 ? 'trato con personas exitosas, networking, colaboraciones' : 'meditación sobre la abundancia, visualización, trabajo con afirmaciones de dinero'}`,
      `Crea un 'ritual financiero': una revisión semanal de ingresos/gastos en un ambiente tranquilo`,
      `Invierte el 10% de tus ingresos en desarrollar habilidades ligadas a tu misión (${m?.name})`,
    ],
    avoidList: [
      `No compares tu camino financiero con el ajeno: tu código es único`,
      `No tomes decisiones financieras desde el miedo (activación del bloqueo ${b?.name})`,
      `No ignores las señales del cuerpo bajo estrés financiero: es un signo de agotamiento del recurso`,
      `No pidas préstamos de forma impulsiva: ${block <= 11 ? 'el miedo a la escasez empuja a préstamos irreflexivos' : "la ilusión de 'mañana lo gano' te engaña"}`,
      `No trabajes hasta el desgaste: el agotamiento destruye el flujo financiero por mucho tiempo`,
    ],
    conclusion: `Tu código financiero ${talent}-${resource}-${mission}-${block} es una combinación única que define tu camino hacia el bienestar material. El Talento (${t?.name}) es tu canal natural de ingresos. El Recurso (${r?.name}) es la fuente de energía para la actividad financiera. La Misión (${m?.name}) es el sentido superior de tu camino material. El Bloqueo (${b?.name}) es lo que hay que reconocer y transformar. Cuando los cuatro elementos trabajan en armonía, el dinero deja de ser un problema y se convierte en una herramienta de tu realización.`,
    keyThought: `Tu camino hacia la libertad financiera pasa por ${t?.name}, no por luchar contra ${b?.name}`,
  };
}

// ==================== ANCESTRAL PROGRAMS ====================
export function getAncestralProLocalized(
  workingNumbers: { first: number; second: number; third: number; fourth: number },
  starCounts: { twos: number; fours: number; fives: number; sevens: number; eights: number },
  lang: string
): AncestralProData | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  const totalKarmic = starCounts.twos + starCounts.fours + starCounts.eights;
  const totalSpiritual = starCounts.fives + starCounts.sevens;

  if (L === 'en') {
    return {
      intro: `The analysis of your ancestral programs reveals the deep patterns inherited from your ancestors. The working numbers (${workingNumbers.first}, ${workingNumbers.second}, ${workingNumbers.third}, ${workingNumbers.fourth}) show the main energetic lines of the lineage. The karmic star reveals the areas where the ancestral energy is strongest and where work is needed. Understanding these programs is the key to freeing yourself from recurring ancestral scenarios.`,
      lineageOverview: `Your lineage carries ${totalKarmic > 6 ? 'a powerful karmic load' : totalKarmic > 3 ? 'a moderate karmic potential' : 'a relatively light karmic structure'}. ${totalSpiritual > 4 ? 'The spiritual line of the lineage is strong — among your ancestors were people with a gift.' : 'The spiritual line of the lineage needs development — you can become the one who opens this channel.'}. The first working number (${workingNumbers.first}) points to the main task of the lineage, the second (${workingNumbers.second}) to the resource for accomplishing it. The third (${workingNumbers.third}) shows which qualities you must develop, the fourth (${workingNumbers.fourth}) the ultimate goal of the ancestral program.`,
      karmicDebt: `The karmic debt of the lineage is connected with ${starCounts.eights > 2 ? 'matters of justice and law — one of your ancestors disturbed the cosmic balance' : starCounts.fours > 2 ? 'matters of responsibility and structure — the lineage failed to create a stable foundation' : 'matters of love and relationships — unresolved emotional conflicts were passed down from generation to generation'}. ${starCounts.twos > 2 ? 'The female line of the lineage carries a special program — pay attention to the fates of the women in your family.' : ''} This debt does not mean punishment — it is a task that the lineage entrusted precisely to you, because you have the strength to resolve it.`,
      healingPath: `The path of healing begins with awareness. ${totalKarmic > 6 ? 'It is important for you to study the history of your lineage — talk to the elders, gather photographs, reconstruct the family tree.' : 'Your path is through practices of forgiveness and gratitude to your ancestors.'}. Key practices: meditation on the family tree, writing letters to ancestors (not to send — to live through), a ritual of gratitude on days of remembrance. Pay special attention to ${starCounts.fives > 2 ? 'spiritual practices — your ancestors ask for development through you' : 'physical health — the unlived emotions of your ancestors may affect your body'}.`,
      ancestralGifts: [
        `${starCounts.twos > 1 ? 'The gift of intuition and empathy from the female line of the lineage' : 'The potential to develop intuition — the channel is open but needs activation'}`,
        `${starCounts.fours > 1 ? 'The gift of organization and creating structures — your ancestors were builders (literally or metaphorically)' : 'The ability to create the new — the lineage lacked stability but gave you freedom'}`,
        `${starCounts.sevens > 1 ? 'The gift of spiritual vision — psychic abilities along the lineage' : 'Practical wisdom — the lineage passed on the skill of survival and adaptation'}`,
        `${starCounts.eights > 1 ? 'The gift of justice — the ability to see the truth and administer justice' : 'The capacity for flexibility — the lineage learned to get around rigid rules'}`,
        `${starCounts.fives > 1 ? 'The gift of teaching — the ability to pass on knowledge and wisdom' : 'The gift of self-learning — the ability to master the new without mentors'}`,
      ],
      ancestralBlocks: [
        `${starCounts.twos === 0 ? 'A block of feminine energy — difficulties in relationships with the mother, with women' : ''}`,
        `${starCounts.fours === 0 ? 'Instability of the lineage — difficulties in creating a foundation (home, family, career)' : ''}`,
        `${starCounts.eights === 0 ? 'A disruption of justice — a tendency toward self-sacrifice or tyranny' : ''}`,
        `${starCounts.fives === 0 ? 'A lost connection with spirituality — the search for meaning through external attributes' : ''}`,
        `${totalKarmic > 8 ? 'An overload of karmic tasks — the risk of "carrying the whole lineage on yourself"' : ''}`,
      ].filter(Boolean),
      rituals: [
        'Ritual of gratitude to the lineage: light a candle and mentally thank 7 generations of ancestors',
        "Practice of forgiveness: write a letter to the ancestor you're angry with (don't send it — burn it)",
        'Ancestral meditation: visualize yourself at the center of a great tree where each branch is an ancestor',
        `Ritual of healing the ${starCounts.twos > 2 ? 'female' : 'male'} line: on the full moon, place a glass of water and ask for healing for all the ${starCounts.twos > 2 ? 'women' : 'men'} of your lineage`,
        'Build a family tree — each restored ancestor name strengthens your ancestral energy',
        "Visit your lineage's places of power (the ancestral home, the ancestors' graves) — this is the most powerful ritual of reunion",
      ],
      generationalPatterns: `Your lineage has a characteristic pattern: ${workingNumbers.first > 30 ? "A 'Rise–Fall' cycle — success alternates with crises every other generation." : workingNumbers.first > 20 ? "A pattern of 'Gradual growth' — each generation is a little more successful than the previous one." : "A 'Reset' pattern — the lineage periodically starts from scratch."}. The third working number (${workingNumbers.third}) shows that you ${workingNumbers.third > 20 ? 'are completing a large ancestral cycle — you bear the mission of closing old debts' : 'are in the middle of the cycle — your task is to strengthen what your ancestors began'}.`,
      recommendations: [
        'Study the history of your lineage — knowing your ancestors strengthens your energy',
        "Don't repeat your ancestors' mistakes — become aware of the ancestral scenarios and step out of them",
        `Strengthen ${totalSpiritual > totalKarmic ? 'your spiritual practice — your lineage asks for development through you' : 'your material foundation — your lineage needs stability'}`,
        'Maintain a connection with the elder members of the family — they are the carriers of ancestral wisdom',
        'Pass positive ancestral programs on to the next generation',
        'Regularly practice rituals of gratitude to the lineage',
      ],
      avoidList: [
        "Don't blame your ancestors for your difficulties — they gave you the best they could",
        'Do not ignore ancestral signals (recurring situations, dreams of ancestors)',
        "Don't sever the connection with the lineage because of conflicts — it strengthens the karmic debt",
        "Don't take on the karma of the whole lineage — you are resolving your part of the task",
        "Don't idealize your ancestors — see them whole, with light and shadow",
      ],
      conclusion: `Your ancestral programs are not a verdict but a map of the path. The working numbers (${workingNumbers.first}, ${workingNumbers.second}, ${workingNumbers.third}, ${workingNumbers.fourth}) show the task, the resource, the path and the goal. The karmic star highlights the areas that need attention. Remember: you are not a victim of ancestral programs but the one who came to transform them. Every conscious choice changes not only your fate but the fate of the whole lineage — past and future generations.`,
      keyThought: `You came not to carry the ancestral cross, but to become a bridge between the lineage's past and future`,
    };
  }

  return {
    intro: `El análisis de tus programas ancestrales revela los patrones profundos heredados de tus antepasados. Los números de trabajo (${workingNumbers.first}, ${workingNumbers.second}, ${workingNumbers.third}, ${workingNumbers.fourth}) muestran las principales líneas energéticas del linaje. La estrella kármica revela las áreas donde la energía ancestral es más fuerte y donde hace falta trabajo. Comprender estos programas es la llave para liberarte de los guiones ancestrales recurrentes.`,
    lineageOverview: `Tu linaje porta ${totalKarmic > 6 ? 'una poderosa carga kármica' : totalKarmic > 3 ? 'un potencial kármico moderado' : 'una estructura kármica relativamente ligera'}. ${totalSpiritual > 4 ? 'La línea espiritual del linaje es fuerte: entre tus antepasados hubo personas con un don.' : 'La línea espiritual del linaje necesita desarrollo: puedes ser quien abra este canal.'}. El primer número de trabajo (${workingNumbers.first}) señala la tarea principal del linaje; el segundo (${workingNumbers.second}), el recurso para cumplirla. El tercero (${workingNumbers.third}) muestra qué cualidades debes desarrollar; el cuarto (${workingNumbers.fourth}), el objetivo final del programa ancestral.`,
    karmicDebt: `La deuda kármica del linaje está ligada a ${starCounts.eights > 2 ? 'cuestiones de justicia y ley: alguno de tus antepasados rompió el equilibrio cósmico' : starCounts.fours > 2 ? 'cuestiones de responsabilidad y estructura: el linaje no logró crear un fundamento estable' : 'cuestiones de amor y relaciones: conflictos emocionales sin resolver que se transmitieron de generación en generación'}. ${starCounts.twos > 2 ? 'La línea femenina del linaje porta un programa especial: presta atención a los destinos de las mujeres de tu familia.' : ''} Esta deuda no significa un castigo: es una tarea que el linaje te confió precisamente a ti, porque tienes la fuerza para resolverla.`,
    healingPath: `El camino de sanación empieza con la toma de conciencia. ${totalKarmic > 6 ? 'Es importante que estudies la historia del linaje: habla con los mayores, reúne fotografías, reconstruye el árbol genealógico.' : 'Tu camino es a través de las prácticas de perdón y gratitud a los antepasados.'}. Prácticas clave: meditación sobre el árbol genealógico, escribir cartas a los antepasados (no para enviarlas, sino para vivirlas), un ritual de gratitud en los días de memoria. Presta especial atención a ${starCounts.fives > 2 ? 'las prácticas espirituales: tus antepasados piden desarrollo a través de ti' : 'la salud física: las emociones no vividas de tus antepasados pueden influir en tu cuerpo'}.`,
    ancestralGifts: [
      `${starCounts.twos > 1 ? 'El don de la intuición y la empatía de la línea femenina del linaje' : 'El potencial de desarrollar la intuición: el canal está abierto, pero necesita activación'}`,
      `${starCounts.fours > 1 ? 'El don de la organización y la creación de estructuras: los antepasados fueron constructores (literal o metafóricamente)' : 'La capacidad de crear lo nuevo: el linaje no tuvo estabilidad, pero te dio libertad'}`,
      `${starCounts.sevens > 1 ? 'El don de la visión espiritual: capacidades psíquicas por la línea del linaje' : 'Sabiduría práctica: el linaje transmitió la habilidad de sobrevivir y adaptarse'}`,
      `${starCounts.eights > 1 ? 'El don de la justicia: la capacidad de ver la verdad e impartir justicia' : 'La capacidad de flexibilidad: el linaje aprendió a sortear las reglas rígidas'}`,
      `${starCounts.fives > 1 ? 'El don de la enseñanza: la capacidad de transmitir conocimiento y sabiduría' : 'El don del autoaprendizaje: la capacidad de dominar lo nuevo sin mentores'}`,
    ],
    ancestralBlocks: [
      `${starCounts.twos === 0 ? 'Bloqueo de la energía femenina: dificultades en la relación con la madre, con las mujeres' : ''}`,
      `${starCounts.fours === 0 ? 'Inestabilidad del linaje: dificultades para crear un fundamento (hogar, familia, carrera)' : ''}`,
      `${starCounts.eights === 0 ? 'Alteración de la justicia: tendencia al sacrificio o a la tiranía' : ''}`,
      `${starCounts.fives === 0 ? 'Conexión perdida con la espiritualidad: la búsqueda de sentido a través de atributos externos' : ''}`,
      `${totalKarmic > 8 ? 'Sobrecarga de tareas kármicas: el riesgo de "cargar con todo el linaje"' : ''}`,
    ].filter(Boolean),
    rituals: [
      'Ritual de gratitud al linaje: enciende una vela y agradece mentalmente a 7 generaciones de antepasados',
      'Práctica de perdón: escribe una carta al antepasado con quien estás enfadado (no la envíes: quémala)',
      'Meditación ancestral: visualízate en el centro de un gran árbol donde cada rama es un antepasado',
      `Ritual de sanación de la línea ${starCounts.twos > 2 ? 'femenina' : 'masculina'}: en luna llena, pon un vaso de agua y pide sanación para todos los ${starCounts.twos > 2 ? 'mujeres' : 'hombres'} de tu linaje`,
      'Elabora un árbol genealógico: cada nombre de antepasado recuperado refuerza tu energía ancestral',
      'Visita los lugares de poder de tu linaje (la casa familiar, las tumbas de los antepasados): es el ritual de reunión más poderoso',
    ],
    generationalPatterns: `Tu linaje tiene un patrón característico: ${workingNumbers.first > 30 ? "Un ciclo de 'Ascenso-Caída': el éxito se alterna con crisis cada generación." : workingNumbers.first > 20 ? "Un patrón de 'Crecimiento gradual': cada generación es un poco más exitosa que la anterior." : "Un patrón de 'Reinicio': el linaje empieza periódicamente desde cero."}. El tercer número de trabajo (${workingNumbers.third}) muestra que ${workingNumbers.third > 20 ? 'estás cerrando un gran ciclo ancestral: sobre ti recae la misión de saldar las viejas deudas' : 'estás en mitad del ciclo: tu tarea es reforzar lo que empezaron tus antepasados'}.`,
    recommendations: [
      'Estudia la historia de tu linaje: conocer a los antepasados refuerza tu energía',
      'No repitas los errores de tus antepasados: toma conciencia de los guiones ancestrales y sal de ellos',
      `Refuerza ${totalSpiritual > totalKarmic ? 'la práctica espiritual: tu linaje pide desarrollo a través de ti' : 'el fundamento material: tu linaje necesita estabilidad'}`,
      'Mantén el vínculo con los miembros mayores de la familia: son portadores de la sabiduría ancestral',
      'Transmite los programas ancestrales positivos a la siguiente generación',
      'Practica con regularidad los rituales de gratitud al linaje',
    ],
    avoidList: [
      'No culpes a tus antepasados de tus dificultades: te dieron lo mejor que pudieron',
      'No ignores las señales ancestrales (situaciones recurrentes, sueños con antepasados)',
      'No rompas el vínculo con el linaje por conflictos: refuerza la deuda kármica',
      'No cargues con el karma de todo el linaje: resuelves tu parte de la tarea',
      'No idealices a tus antepasados: velos enteros, con luz y sombra',
    ],
    conclusion: `Tus programas ancestrales no son una sentencia, sino un mapa del camino. Los números de trabajo (${workingNumbers.first}, ${workingNumbers.second}, ${workingNumbers.third}, ${workingNumbers.fourth}) muestran la tarea, el recurso, el camino y el objetivo. La estrella kármica ilumina las áreas que requieren atención. Recuerda: no eres una víctima de los programas ancestrales, sino quien vino a transformarlos. Cada elección consciente cambia no solo tu destino, sino el del linaje entero, las generaciones pasadas y futuras.`,
    keyThought: `Viniste no a cargar con la cruz ancestral, sino a ser un puente entre el pasado y el futuro del linaje`,
  };
}

// ==================== CONTRACT ENERGY ====================
export function getContractProLocalized(
  positions: { position: number; arcana: number; description: string }[],
  contractDate: string,
  isGood: boolean,
  lang: string
): ContractProData | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  const pos4 = getArcana(positions[3]?.arcana), pos6 = getArcana(positions[5]?.arcana);
  const pos9 = getArcana(positions[8]?.arcana), pos12 = getArcana(positions[11]?.arcana);

  if (L === 'en') {
    return {
      intro: `The energetic analysis of the contract date reveals the hidden influences that will act throughout the entire term of the agreement. The 12-position matrix shows not only the current energy but the long-term consequences. The date ${contractDate} carries ${isGood ? 'favorable' : 'tense'} energy for concluding agreements.`,
      overallEnergy: `The overall energy of the contract is defined by four key positions: Goal (${pos4?.name || positions[3]?.arcana}), Foundation (${pos6?.name || positions[5]?.arcana}), Outcome (${pos9?.name || positions[8]?.arcana}) and Karmic lesson (${pos12?.name || positions[11]?.arcana}). ${isGood ? 'These energies create a stable basis for long-term cooperation. The contract has the potential to bring significant benefit to both parties.' : 'These energies point to potential difficulties. The contract may require additional guarantees and careful oversight.'} The outcome position (${pos9?.name}) shows what result this cooperation will lead to in the long run.`,
      keyPositionsDeep: `Position 4 (Goal): ${pos4?.name || positions[3]?.arcana} — the energy of ${el(pos4?.element, L) || 'transformation'} defines the true goal of this contract. Position 6 (Foundation): ${pos6?.name || positions[5]?.arcana} — the basis on which the agreement is built. ${positions[5]?.arcana <= 11 ? 'The foundation is solid enough for long-term cooperation.' : 'The foundation needs strengthening — pay attention to the legal aspects.'}. Position 9 (Outcome): ${pos9?.name || positions[8]?.arcana} — ${positions[8]?.arcana <= 11 ? 'the outcome is favorable, the cooperation will bear fruit' : 'the outcome is ambiguous, the result depends on your awareness'}. Position 12 (Karmic lesson): ${pos12?.name || positions[11]?.arcana} — what this contract will teach you on a deep level.`,
      hiddenRisks: `Hidden motives (position 10, arcana ${positions[9]?.arcana}): ${positions[9]?.arcana > 11 ? 'There are unspoken motives that may surface later. Additional vetting of the counterparty is recommended.' : 'The motives of both parties are fairly transparent.'}. External circumstances (position 11, arcana ${positions[10]?.arcana}): ${positions[10]?.arcana > 15 ? 'External factors may significantly affect the contract\'s fulfillment. Provide for force majeure clauses.' : 'The external environment is relatively stable for this agreement.'}.`,
      bestStrategy: `The optimal strategy when concluding this contract: ${isGood ? '1) Act decisively — the energy supports you. 2) Sign in the first half of the day — the energy is stronger. 3) Be sure to include a clause on revising the terms — this preserves flexibility.' : '1) Don\'t rush — request additional time for analysis. 2) Bring in a third party (a lawyer, a mediator). 3) Provide for clear exit conditions. 4) Consider alternative dates for signing.'}`,
      timingAnalysis: `Energetic timing: ${positions[0]?.arcana <= 11 ? 'The start of cooperation will go smoothly — first impressions will be positive.' : 'The start may be difficult — allow time to "settle in".'} ${positions[2]?.arcana <= 11 ? 'The interaction of the parties will be constructive.' : 'There may be disagreements in the process — provide mechanisms for resolving disputes.'}. ${positions[6]?.arcana <= 11 ? "The contract's main task will be accomplished." : 'Accomplishing the main task will require additional effort.'}`,
      recommendations: [
        `${isGood ? 'Use the favorable energy — act' : 'Wait for a more favorable period or strengthen the protective clauses'}`,
        `Pay attention to position ${positions[9]?.arcana > 11 ? '10 (Hidden motives) — carry out additional vetting' : '4 (Goal) — make sure the goals of both parties align'}`,
        'Keep a copy of the matrix — refer to it for key decisions on the contract',
        'Sign the contract in a conscious state — not under pressure and not in haste',
        `Karmic lesson (${pos12?.name}) — keep this lesson in mind while fulfilling the contract`,
      ],
      avoidList: [
        'Don\'t sign in a state of emotional arousal',
        'Don\'t ignore intuitive signals — if "something feels off", check again',
        `${!isGood ? "Don't agree to terms that cause discomfort — the date's energy amplifies hidden risks" : "Don't relax because of the favorable energy — attention to detail is still necessary"}`,
        'Don\'t skip the fine print — that\'s exactly where the main traps hide',
      ],
      conclusion: `The date ${contractDate} ${isGood ? `is favorable for concluding this contract. The energy supports long-term mutually beneficial cooperation. If the recommendations are followed, the outcome (${pos9?.name}) will be maximally positive.` : 'requires caution. The energy doesn\'t forbid the contract, but it points to the need for additional guarantees and protective measures. With a conscious approach the result can be good, but it will require more effort.'}`,
    };
  }

  return {
    intro: `El análisis energético de la fecha del contrato revela las influencias ocultas que actuarán durante todo el plazo del acuerdo. La matriz de 12 posiciones muestra no solo la energía actual, sino las consecuencias a largo plazo. La fecha ${contractDate} porta una energía ${isGood ? 'favorable' : 'tensa'} para cerrar acuerdos.`,
    overallEnergy: `La energía general del contrato se define por cuatro posiciones clave: Objetivo (${pos4?.name || positions[3]?.arcana}), Fundamento (${pos6?.name || positions[5]?.arcana}), Resultado (${pos9?.name || positions[8]?.arcana}) y Lección kármica (${pos12?.name || positions[11]?.arcana}). ${isGood ? 'Estas energías crean una base estable para una cooperación a largo plazo. El contrato tiene el potencial de aportar un beneficio significativo a ambas partes.' : 'Estas energías señalan posibles dificultades. El contrato puede requerir garantías adicionales y un control atento.'} La posición del resultado (${pos9?.name}) muestra a qué resultado llevará esta cooperación a largo plazo.`,
    keyPositionsDeep: `Posición 4 (Objetivo): ${pos4?.name || positions[3]?.arcana} — la energía de ${el(pos4?.element, L) || 'la transformación'} define el verdadero objetivo de este contrato. Posición 6 (Fundamento): ${pos6?.name || positions[5]?.arcana} — la base sobre la que se construye el acuerdo. ${positions[5]?.arcana <= 11 ? 'El fundamento es lo bastante sólido para una cooperación a largo plazo.' : 'El fundamento necesita reforzarse: presta atención a los aspectos legales.'}. Posición 9 (Resultado): ${pos9?.name || positions[8]?.arcana} — ${positions[8]?.arcana <= 11 ? 'el resultado es favorable, la cooperación dará frutos' : 'el resultado es ambiguo, depende de tu conciencia'}. Posición 12 (Lección kármica): ${pos12?.name || positions[11]?.arcana} — lo que este contrato te enseñará a un nivel profundo.`,
    hiddenRisks: `Motivos ocultos (posición 10, arcano ${positions[9]?.arcana}): ${positions[9]?.arcana > 11 ? 'Hay motivos no expresados que pueden aflorar más adelante. Se recomienda una verificación adicional de la contraparte.' : 'Los motivos de ambas partes son bastante transparentes.'}. Circunstancias externas (posición 11, arcano ${positions[10]?.arcana}): ${positions[10]?.arcana > 15 ? 'Los factores externos pueden afectar de forma significativa al cumplimiento del contrato. Prevé cláusulas de fuerza mayor.' : 'El entorno externo es relativamente estable para este acuerdo.'}.`,
    bestStrategy: `La estrategia óptima al cerrar este contrato: ${isGood ? '1) Actúa con decisión: la energía apoya. 2) Firma en la primera mitad del día: la energía es más fuerte. 3) Incluye sin falta una cláusula de revisión de las condiciones: conserva la flexibilidad.' : '1) No te apresures: pide tiempo adicional para el análisis. 2) Involucra a un tercero (abogado, mediador). 3) Prevé condiciones claras de salida del contrato. 4) Considera fechas alternativas para la firma.'}`,
    timingAnalysis: `Tiempos energéticos: ${positions[0]?.arcana <= 11 ? 'El inicio de la cooperación irá sin contratiempos: las primeras impresiones serán positivas.' : 'El inicio puede ser difícil: deja tiempo para el "rodaje".'} ${positions[2]?.arcana <= 11 ? 'La interacción de las partes será constructiva.' : 'Puede haber desacuerdos en el proceso: prevé mecanismos de resolución de disputas.'}. ${positions[6]?.arcana <= 11 ? 'La tarea principal del contrato se cumplirá.' : 'Cumplir la tarea principal requerirá un esfuerzo adicional.'}`,
    recommendations: [
      `${isGood ? 'Aprovecha la energía favorable: actúa' : 'Espera un periodo más favorable o refuerza las cláusulas de protección'}`,
      `Presta atención a la posición ${positions[9]?.arcana > 11 ? '10 (Motivos ocultos): realiza una verificación adicional' : '4 (Objetivo): asegúrate de que los objetivos de ambas partes coinciden'}`,
      'Guarda una copia de la matriz: consúltala en las decisiones clave sobre el contrato',
      'Firma el contrato en un estado consciente: sin presión y sin prisa',
      `Lección kármica (${pos12?.name}): tenla presente al cumplir el contrato`,
    ],
    avoidList: [
      'No firmes en un estado de excitación emocional',
      'No ignores las señales intuitivas: si "algo no encaja", revísalo de nuevo',
      `${!isGood ? 'No aceptes condiciones que te causen incomodidad: la energía de la fecha amplifica los riesgos ocultos' : 'No te relajes por la energía favorable: la atención al detalle sigue siendo necesaria'}`,
      'No te saltes la letra pequeña: ahí es donde se esconden las principales trampas',
    ],
    conclusion: `La fecha ${contractDate} ${isGood ? `es favorable para cerrar este contrato. La energía apoya una cooperación mutuamente beneficiosa a largo plazo. Si se siguen las recomendaciones, el resultado (${pos9?.name}) será lo más positivo posible.` : 'requiere prudencia. La energía no prohíbe el contrato, pero señala la necesidad de garantías adicionales y medidas de protección. Con un enfoque consciente el resultado puede ser bueno, pero requerirá más esfuerzo.'}`,
  };
}

// ==================== DAILY FORECAST ====================
export function getDailyProLocalized(
  positions: { position: number; arcana: number; title: string; description: string }[],
  dateStr: string,
  lang: string
): DailyProData | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  const mainArcana = getArcana(positions[0]?.arcana);
  const goalArcana = getArcana(positions[3]?.arcana);
  const keyHour = Math.min((positions[0]?.arcana || 0) + 8, 20);

  if (L === 'en') {
    return {
      intro: `A detailed energetic analysis of the day ${dateStr}. On this day ${positions.length} energetic positions are active, each influencing a particular aspect. The main energy of the day is ${mainArcana?.name || positions[0]?.arcana} (${positions[0]?.arcana}). This defines the overall tone, mood and potential.`,
      mainEnergy: `${mainArcana?.name || 'Arcana ' + positions[0]?.arcana} sets the backdrop of the whole day. ${mainArcana?.personalDescription?.substring(0, 300) || 'This energy affects all decisions and events.'} The planet ${pl(mainArcana?.planet, L) || 'of the day'} amplifies the ${positions[0]?.arcana <= 11 ? 'active, creative principle — act boldly' : 'reflective, analytical principle — observe and analyze'}.`,
      morningFocus: `The morning is defined by position 1 (${mainArcana?.name}, arcana ${positions[0]?.arcana}). ${positions[0]?.arcana <= 7 ? 'Start the day actively — physical activity, planning, important calls. The morning energy supports initiative.' : positions[0]?.arcana <= 14 ? "The morning calls for a calm start. Meditation, tea, a review of plans. Don't rush — let the energy enter your day gently." : "The morning may be difficult — give yourself time to warm up. Don't plan important matters before 11:00."}`,
      dayStrategy: `The day's strategy is defined by the goal (position 4, arcana ${positions[3]?.arcana} — ${goalArcana?.name}). ${positions[3]?.arcana <= 11 ? 'The day is favorable for active deeds: negotiations, deals, presentations. Act decisively.' : "The day is better devoted to analysis, planning, completing what you started. Don't start anything new — wait for a more active day."}. The key time of the day: ${keyHour}:00 — at this hour the energy is at its peak.`,
      eveningReflection: `The evening (from 18:00) is a time for reflection. Write down 3 events of the day that resonated most strongly. ${positions[positions.length - 1]?.arcana <= 11 ? 'The evening is suited to socializing and light social events.' : 'The evening is better spent in silence — read, meditate, take a bath.'}. Before sleep, thank the day for the experience gained.`,
      spheres: {
        money: `The day's financial energy: ${positions[0]?.arcana <= 7 ? 'Active — a good day for financial decisions, purchases, salary negotiations.' : positions[0]?.arcana <= 14 ? 'Neutral — neither the best nor the worst day for money matters. Follow your plan.' : "Passive — don't make large financial decisions. Wait for a more favorable day."}`,
        career: `Career energy: ${positions[3]?.arcana <= 11 ? 'Favorable for advancement — show initiative, propose an idea, ask for a raise.' : 'A time for behind-the-scenes work — prepare, plan, gather information. Your moment will come.'}`,
        relationships: `Relationship energy: ${positions[1]?.arcana <= 11 ? 'A day for communication and closeness. Say the important words. Plan a date.' : 'A day for inner work on the relationship. Think about what you want to give and receive.'}`,
        health: `Health: pay attention to ${positions[0]?.arcana <= 7 ? "the head and nervous system. Don't overstrain yourself." : positions[0]?.arcana <= 14 ? 'digestion and energy balance. Eat consciously.' : "your emotional state. Don't suppress your feelings."}`,
      },
      risks: [
        `${positions[0]?.arcana > 14 ? 'Risk of emotional instability — watch your reactions' : 'Risk of overwork from high activity'}`,
        `${positions[3]?.arcana > 14 ? "Conflicts are possible — don't enter disputes unnecessarily" : 'You may miss an opportunity due to indecision'}`,
        "Don't make decisions under the influence of emotions",
      ],
      opportunities: [
        `The energy of ${mainArcana?.name} opens a channel for ${positions[0]?.arcana <= 11 ? 'new beginnings and acquaintances' : 'deep self-knowledge and insights'}`,
        `Position 4 (${goalArcana?.name}) points to the possibility of ${positions[3]?.arcana <= 11 ? 'concrete achievements' : 'important realizations'}`,
        'Intuition is heightened — trust your inner voice',
      ],
      practice: `Practice of the day: ${positions[0]?.arcana <= 7 ? 'Morning exercise + planning + 3 priorities for the day. In the evening — a gratitude journal.' : positions[0]?.arcana <= 14 ? 'Morning meditation 10 min + mindful breathing 3 times a day. In the evening — a review of the day\'s lessons.' : 'Morning — recording dreams + an intention for the day. Day — mindful pauses every 2 hours. Evening — a ritual of letting go.'}`,
      keyThought: `Today the energy of ${mainArcana?.name || positions[0]?.arcana} teaches you to ${positions[0]?.arcana <= 11 ? 'act with faith in yourself' : 'accept what is, and see the wisdom in it'}`,
    };
  }

  return {
    intro: `Un análisis energético detallado del día ${dateStr}. Este día están activas ${positions.length} posiciones energéticas, cada una de las cuales influye en un aspecto determinado. La energía principal del día es ${mainArcana?.name || positions[0]?.arcana} (${positions[0]?.arcana}). Esto define el tono general, el ánimo y el potencial.`,
    mainEnergy: `${mainArcana?.name || 'Arcano ' + positions[0]?.arcana} marca el trasfondo de todo el día. ${mainArcana?.personalDescription?.substring(0, 300) || 'Esta energía influye en todas las decisiones y acontecimientos.'} El planeta ${pl(mainArcana?.planet, L) || 'del día'} potencia el ${positions[0]?.arcana <= 11 ? 'principio activo y creador: actúa con audacia' : 'principio reflexivo y analítico: observa y analiza'}.`,
    morningFocus: `La mañana se define por la posición 1 (${mainArcana?.name}, arcano ${positions[0]?.arcana}). ${positions[0]?.arcana <= 7 ? 'Empieza el día con actividad: ejercicio físico, planificación, llamadas importantes. La energía de la mañana apoya la iniciativa.' : positions[0]?.arcana <= 14 ? 'La mañana pide un comienzo tranquilo. Meditación, té, una revisión de los planes. No te apresures: deja que la energía entre con suavidad en tu día.' : 'La mañana puede ser difícil: date tiempo para arrancar. No planifiques asuntos importantes antes de las 11:00.'}`,
    dayStrategy: `La estrategia del día se define por el objetivo (posición 4, arcano ${positions[3]?.arcana} — ${goalArcana?.name}). ${positions[3]?.arcana <= 11 ? 'El día es favorable para la acción: negociaciones, acuerdos, presentaciones. Actúa con decisión.' : 'El día conviene dedicarlo al análisis, la planificación, el cierre de lo empezado. No empieces nada nuevo: espera un día más activo.'}. El momento clave del día: las ${keyHour}:00, cuando la energía está en su pico.`,
    eveningReflection: `La tarde (desde las 18:00) es un tiempo para la reflexión. Anota 3 acontecimientos del día que más resonaron en ti. ${positions[positions.length - 1]?.arcana <= 11 ? 'La tarde es propicia para socializar y para eventos sociales ligeros.' : 'La tarde conviene pasarla en silencio: lee, medita, date un baño.'}. Antes de dormir, agradece al día por la experiencia obtenida.`,
    spheres: {
      money: `Energía financiera del día: ${positions[0]?.arcana <= 7 ? 'Activa: un buen día para decisiones financieras, compras, negociar el salario.' : positions[0]?.arcana <= 14 ? 'Neutral: ni el mejor ni el peor día para asuntos de dinero. Sigue tu plan.' : 'Pasiva: no tomes grandes decisiones financieras. Espera un día más favorable.'}`,
      career: `Energía profesional: ${positions[3]?.arcana <= 11 ? 'Favorable para el avance: muestra iniciativa, propón una idea, pide un aumento.' : 'Un tiempo para el trabajo entre bastidores: prepárate, planifica, reúne información. Tu momento llegará.'}`,
      relationships: `Energía de las relaciones: ${positions[1]?.arcana <= 11 ? 'Un día para la comunicación y la cercanía. Di las palabras importantes. Planifica una cita.' : 'Un día para el trabajo interior sobre la relación. Piensa qué quieres dar y recibir.'}`,
      health: `Salud: presta atención a ${positions[0]?.arcana <= 7 ? 'la cabeza y el sistema nervioso. No te sobrecargues.' : positions[0]?.arcana <= 14 ? 'la digestión y el equilibrio energético. Come con conciencia.' : 'tu estado emocional. No reprimas los sentimientos.'}`,
    },
    risks: [
      `${positions[0]?.arcana > 14 ? 'Riesgo de inestabilidad emocional: vigila tus reacciones' : 'Riesgo de agotamiento por la alta actividad'}`,
      `${positions[3]?.arcana > 14 ? 'Son posibles conflictos: no entres en discusiones sin necesidad' : 'Puedes perder una oportunidad por indecisión'}`,
      'No tomes decisiones bajo la influencia de las emociones',
    ],
    opportunities: [
      `La energía de ${mainArcana?.name} abre un canal para ${positions[0]?.arcana <= 11 ? 'nuevos comienzos y encuentros' : 'el autoconocimiento profundo y las intuiciones'}`,
      `La posición 4 (${goalArcana?.name}) señala la posibilidad de ${positions[3]?.arcana <= 11 ? 'logros concretos' : 'tomas de conciencia importantes'}`,
      'La intuición está reforzada: confía en la voz interior',
    ],
    practice: `Práctica del día: ${positions[0]?.arcana <= 7 ? 'Ejercicio matutino + planificación + 3 prioridades del día. Por la noche, un diario de gratitud.' : positions[0]?.arcana <= 14 ? 'Meditación matutina de 10 min + respiración consciente 3 veces al día. Por la noche, una revisión de las lecciones del día.' : 'Mañana: anotar los sueños + una intención para el día. Día: pausas conscientes cada 2 horas. Tarde: un ritual de soltar.'}`,
    keyThought: `Hoy la energía de ${mainArcana?.name || positions[0]?.arcana} te enseña a ${positions[0]?.arcana <= 11 ? 'actuar con fe en ti mismo' : 'aceptar lo que hay y ver en ello la sabiduría'}`,
  };
}
