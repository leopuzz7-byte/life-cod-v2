// EN/ES translations for the detailed monthly year forecast (yearForecastDetailed.ts).
// Parallel language path: the Russian base stays untouched and is used as fallback (lang 'ru').

import type { YearPeriod, YearResources } from './yearForecastDetailed';

type MonthTheme = { theme: string; desc: string; attention: string; rec: string };
type Lang = 'en' | 'es';

// ---- Month names ----
export const monthNamesI18n: Record<Lang, string[]> = {
  en: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
};

// ---- Planet names (map from the Russian base names) ----
const planetMap: Record<Lang, Record<string, string>> = {
  en: { "Сатурн": "Saturn", "Уран": "Uranus", "Нептун": "Neptune", "Марс": "Mars", "Венера": "Venus", "Меркурий": "Mercury", "Луна": "Moon", "Солнце": "Sun", "Плутон": "Pluto", "Юпитер": "Jupiter" },
  es: { "Сатурн": "Saturno", "Уран": "Urano", "Нептун": "Neptuno", "Марс": "Marte", "Венера": "Venus", "Меркурий": "Mercurio", "Луна": "Luna", "Солнце": "Sol", "Плутон": "Plutón", "Юпитер": "Júpiter" },
};

export function getPlanetLocalized(ruPlanet: string, lang: string): string {
  if (lang === 'en' || lang === 'es') return planetMap[lang][ruPlanet] || ruPlanet;
  return ruPlanet;
}

// ---- Month-arcana themes (1–22) ----
const arcanaThemesEN: Record<number, MonthTheme> = {
  1: {
    theme: "A new beginning",
    desc: `This month carries the energy of the Magician — the archetype of initiative and beginnings. You'll feel a surge of strength and a desire to start something new. Ideas will come one after another, and it's important not to scatter yourself but to choose one key idea and direct all your energy to it.\n\nThe Magician gives you the ability to persuade and inspire. Your words gain special power in this period — use this for negotiations, presentations, important conversations. People will listen to you.\n\nHowever, be careful with impulsive decisions. The Magician's energy can be deceptive — it seems everything will come easily, but without a plan and structure the result will be fragile. Start, but don't forget the foundation.`,
    attention: "Watch out not to scatter yourself across many projects at once. Impulsive financial decisions in this period are especially dangerous. Check information before acting — the Magician's energy also attracts fraudsters.",
    rec: "Make a list of goals for the month. Choose one main goal and focus on it. Start the morning with the affirmation: 'I create my reality consciously'. Invest in learning and tools.",
  },
  2: {
    theme: "Silence and intuition",
    desc: `The High Priestess's energy slows the pace and turns you inward. This is not a time for active deeds — it's a time for observation, analysis and intuitive understanding. Trust dreams, coincidences and your inner voice.\n\nThis month information will come not through logic but through feeling. You may 'know' something without understanding where the knowledge comes from. Don't dismiss it — write it down.\n\nRelationships with those around you may become quieter but also deeper. Superficial communication will be tiring. Look for people you can talk to about what matters.`,
    attention: "Don't make big decisions in a hurry. This month's silence is not stagnation but ripening. If you force events, the result may disappoint. Let the processes unfold naturally.",
    rec: "Keep a journal of observations and dreams. Meditate at least 10 minutes a day. Spend time in silence — without music, podcasts, social media. Turn to a psychologist or mentor.",
  },
  3: {
    theme: "Abundance and creativity",
    desc: `A month under the Empress's energy — one of the most favorable periods. Money, love, beauty, creativity — all of it blossoms. You attract resources and people. The world is generous to you.\n\nCreative energy is at its peak. If you work in art, design, music — this is your month. But even if not, a creative approach to any task will bring results.\n\nRelationships fill with warmth and sensuality. For couples — a time of renewed feelings. For singles — a period when attractiveness is at its peak.\n\nFinancially, money comes more easily than usual. But be careful with extravagance: the Empress can tempt you into unnecessary purchases 'for beauty'.`,
    attention: "Don't give in to laziness — abundance relaxes you. Control your spending — the urge to 'treat yourself' can get out of hand. Don't put off important matters for the sake of pleasures.",
    rec: "Plan a creative project. Update your wardrobe or interior (within reason). Spend time in nature. Enjoy life, but don't forget discipline.",
  },
  4: {
    theme: "Structure and order",
    desc: `The Emperor's energy demands organization and discipline from you. The chaos of past months must take form. Create systems, put things in order, plan.\n\nThis is a month for serious decisions: buying real estate, signing contracts, handling paperwork. Anything connected with the foundation works in your favor.\n\nAt work you may be noticed as a leader or organizer. A promotion or expanded duties is possible. Take responsibility, but don't forget to delegate.\n\nIn relationships — a time for concrete steps: shared housing, a joint budget, planning the future.`,
    attention: "Don't be too rigid — with yourself or others. The Emperor's energy can turn into tyranny. Control the urge to manage everything. Allow people to make mistakes.",
    rec: "Make a plan for the coming quarter. Put your documents and finances in order. Delegate what you can. Do sport — the body needs discipline.",
  },
  5: {
    theme: "Wisdom and learning",
    desc: `The Hierophant's month — a time for learning, the search for meaning and passing on knowledge. You'll be drawn to philosophy, psychology, spiritual practices. Teachers and mentors play a key role.\n\nIf you're an expert yourself — it's time to share your knowledge. Launch courses, write articles, give consultations. The world is ready to listen.\n\nRelationships are tested by values. You begin to see whether your life principles align with your partner's. If not — it will become a source of discomfort.\n\nFinances: income through expertise and knowledge. Investment in education will pay off many times over.`,
    attention: "Don't fall into moralizing. Don't impose your views on others. Beware of fanatical attachment to a single teaching or system. Balance between tradition and the new.",
    rec: "Enroll in a course or workshop. Read a book that's long been sitting on the shelf. Find a mentor. If you can — start teaching or mentoring.",
  },
  6: {
    theme: "Choice and responsibility",
    desc: `The Lovers' energy puts you before a choice. It may be a choice between two people, two projects, two paths. There's no 'right' answer — there's only your answer.\n\nLove energy is at its peak. New acquaintances, romantic encounters, renewed feelings in existing relationships. But the Lovers is not only about romance — it's about responsibility for your choice.\n\nFinancially, a choice between investments, projects, directions. Don't try to sit on two chairs. Make a decision and follow it to the end.\n\nInner state: a struggle between 'want' and 'should', between reason and heart. Learn to hear both voices and find a balance.`,
    attention: "Don't postpone the choice indefinitely. Indecision in this period is costly. But don't make decisions under pressure either. Give yourself time — but not too much.",
    rec: "Write out all the options and their consequences. Talk to a trusted person. Listen to your heart, but check with the facts. Make a decision — and don't look back.",
  },
  7: {
    theme: "Movement and victory",
    desc: `The Chariot carries the energy of movement, speed and achievement. This is a month for active deeds: launching projects, moving, traveling, competing. If you've been standing still — it's time to move.\n\nYou may feel an inner drive and a desire to 'storm' any goal. That's good if it's directed — and dangerous if it's chaotic. The Chariot's energy requires control and direction.\n\nFinancially, active income growth through action. Premiums, bonuses, rewards for effort. Money comes through speed and competition.\n\nHealth: adrenaline sports are good, but watch out for the risk of injury. The muscular system is under load.`,
    attention: "Don't burn out. The Chariot's energy can lead to burnout if you don't keep balance. Watch your health — especially muscles and joints. Don't rush decisions involving money.",
    rec: "Make a clear plan of action. Move fast, but according to plan. Do sport — the body needs an outlet for energy. Travel if you have the chance.",
  },
  8: {
    theme: "Strength and endurance",
    desc: `The month of the Strength arcana — a time of testing for resilience. You'll have to handle challenges through patience and an inner core, not through aggression or control.\n\nTrue strength is not to 'break' but to 'endure'. This month you'll discover how strong your character is. Conflicts are resolved not by shouting but by calm confidence.\n\nRelationships: a test of strength. Which of the partners is ready to yield without losing dignity? The struggle for leadership may intensify.\n\nFinances: stable income through persistent labor. Don't expect easy money — work methodically. Legal matters are resolved in your favor with due patience.`,
    attention: "Don't snap. Control anger and irritation — they'll destroy what you're building. Physical health needs attention: teeth, bones, muscles. Don't store up stress.",
    rec: "Practice patience as a skill. Strength training will help channel energy. Resolve legal matters. Strengthen your health.",
  },
  9: {
    theme: "Solitude and wisdom",
    desc: `The Hermit's energy turns you inward. This is a month for self-analysis, solitude and finding answers in silence. Noisy company and superficial communication will be tiring.\n\nThe Hermit carries light — but an inner light. You may gain important insights about your life that change your direction. Don't dismiss them.\n\nFinancially, minimalism works better than expansion. Cut expenses, review your budget. Money comes through deep expertise, not through volume.\n\nHealth: the nervous system needs rest. Walks in nature, silence, meditation. Minimize stimulants.`,
    attention: "Don't confuse solitude with isolation. The Hermit seeks wisdom, doesn't run from the world. If you feel depression — seek help. The silence should be conscious, not forced.",
    rec: "Set aside time for solitude. Read, meditate, walk in nature. Minimize information noise. Keep a reflection journal.",
  },
  10: {
    theme: "The wheel of change",
    desc: `The Wheel of Fortune is turning — and this month brings unexpected turns. Both positive and negative. Prepare for surprises.\n\nEvents may develop rapidly: what seemed stable yesterday can change in a single day. But new opportunities will also appear out of nowhere.\n\nFinances: unpredictable — there may be both unexpected income and unexpected expenses. Have a financial cushion.\n\nRelationships: karmic meetings, people returning from the past. Someone may appear or disappear from your life suddenly.\n\nInner state: an emotional 'rollercoaster'. Learn to accept uncertainty as the norm, not as a threat.`,
    attention: "Don't cling to stability — this month it's illusory. Diversify your financial flows. Be flexible in your plans. The wheel is turning — and your position may change.",
    rec: "Build a financial reserve. Be open to change. Practice acceptance: 'I accept what comes and let go of what leaves'. Don't resist the current.",
  },
  11: {
    theme: "Justice and balance",
    desc: `The Justice arcana brings karmic balance. This month you'll get exactly what you've earned — both the good and the hard. It's the Universe's honest reckoning.\n\nLegal matters get resolved — court cases, contracts, division of property. Honesty is rewarded, dishonesty is punished.\n\nRelationships: a fair resolution of conflicts. If you were right — it will become obvious. If you were at fault — you'll have to admit it.\n\nFinances: a balance of income and expenses. Not a time for risks — stick to fair prices and honest deals.\n\nInner state: an 'inner court' — you assess your past decisions and their consequences. Be fair to yourself.`,
    attention: "Don't try to cheat the system — this month the karmic account is precise. Don't drag out legal matters. Be honest in financial matters. Don't judge others too harshly.",
    rec: "Sort out legal matters. Pay off debts — financial and emotional. Practice honesty in all areas. A meditation on balance.",
  },
  12: {
    theme: "Sacrifice and transformation",
    desc: `The Hanged Man is one of the most challenging arcana. This month requires you to 'flip' your usual view of things. What seemed important may turn out to be an illusion. And what you ignored may be the key to the answer.\n\nThe month's energy slows everything down: projects, relationships, finances. It's a forced pause, and resisting it will only increase the discomfort.\n\nSacrifice is the key theme. You may need to give up something familiar for the sake of something new. It's painful, but necessary.\n\nHealth: the lymphatic system, stagnation. Movement and cleansing are essential.`,
    attention: "Don't resist the pause. Don't try to force events — they'll come in their own time. Accept the 'suspended' state as part of the process. Don't sacrifice yourself thoughtlessly.",
    rec: "Accept the pause consciously. Take up cleansing — of the body, the space, the mind. Volunteering and helping others is a powerful resource. Re-evaluate your priorities.",
  },
  13: {
    theme: "Transformation and renewal",
    desc: `The Death arcana is not an end but a radical transformation. This month completes what has outlived itself and frees space for the new. Don't hold on to the dead.\n\nOld habits, relationships, projects may end. It's painful, but necessary. What doesn't grow — decays. Better to let go consciously than to be forced to.\n\nFinancially: old income sources may dry up. Don't panic — new ones will open, but not right away. The transition period requires patience and a financial cushion.\n\nInner state: fear of change and at the same time its inevitability. Let the old die so the new can be born.`,
    attention: "Don't cling to what's leaving. Don't confuse fear of change with intuition — sometimes you just need to step into the unknown. Watch your immunity — the body reacts to transformation.",
    rec: "Carry out a 'life audit': what no longer works? Let go consciously. A detox — physical and mental. Work with fear through therapy or practices.",
  },
  14: {
    theme: "Balance and moderation",
    desc: `Temperance brings harmony and balance after the turbulence of previous months. It's a time for integrating experience, restoring strength and finding the golden mean.\n\nEverything this month works through moderation: moderate loads, moderate spending, moderate emotions. Extremes are punished, balance is rewarded.\n\nHealth: metabolism, hormonal balance. The ideal time to start a healthy regimen — without fanaticism, but consistently.\n\nRelationships: compromises and mutual concessions. If you're used to pulling the blanket your way — this month will teach you to give and receive in equal measure.`,
    attention: "Don't fall into extremes — neither strictness nor permissiveness. Balance is your main tool. Don't ignore the body's signals of overwork.",
    rec: "Start a healthy regimen. Balance work and rest. Practice the 'golden mean' in everything. Yoga and meditation are especially helpful.",
  },
  15: {
    theme: "Temptation and the shadow side",
    desc: `The Devil is the arcana of temptations, addictions and working with the shadow side of the personality. This month may bring seductions: financial, sexual, emotional.\n\nPassion and desire are at their peak. It's a powerful energy that can be both destructive and creative. Your choice determines where it goes.\n\nFinancially: great earning potential, but also a great risk of losses. Risky schemes and 'easy money' are tempting — be careful.\n\nRelationships: sexual energy is intense. But check — is this genuine closeness or dependence? Toxic patterns intensify.\n\nInner state: a meeting with your own shadow. What you suppress comes to the surface. Don't run — face it head-on.`,
    attention: "Be careful with addictions — alcohol, food, social media, shopping, sex. Don't give in to 'easy' offers. Check your motives: do you want this — or are you dependent on it?",
    rec: "Work with the shadow — through therapy or a journal. Set clear boundaries. Channel passion into creativity or sport. Become aware of your addictions.",
  },
  16: {
    theme: "Destruction and renewal",
    desc: `The Tower is the arcana of sudden events and the destruction of old structures. This month may bring shock: unexpected news, crises, abrupt changes.\n\nThe Tower destroys only what was built on a false foundation. If your structures are solid — you'll stand. If not — better to rebuild now than to collapse later.\n\nFinances: upheavals are possible. Have a financial cushion. Don't take large loans. Old business models may collapse.\n\nRelationships: the truth comes out. If the relationship was based on lies — it will become obvious. Shock therapy can save or end the union.\n\nInner state: shock and at the same time liberation. Everything inauthentic collapses, so that only the genuine remains.`,
    attention: "Don't panic. The Tower cleanses — and after destruction comes clarity. Protect your finances. Don't make irreversible decisions in a state of shock. Give yourself time to digest.",
    rec: "Accept the situation, whatever it may be. Reach out for support. Work with a psychologist if the shock is strong. Remember: after the Tower the Star always comes.",
  },
  17: {
    theme: "Hope and inspiration",
    desc: `The Star is one of the brightest arcana. After the possible upheavals of the previous period come hope, inspiration and a new vision of the future.\n\nCreative energy is on the rise. If you work in art, technology, innovation — this is your month. Ideas come pure and clear.\n\nRelationships: lightness and freshness. A new infatuation or renewed feelings in the couple. You see your partner with new eyes.\n\nFinances: money through creativity and innovation. Social projects, crowdfunding, creative ideas bring income.\n\nInner state: the rebirth of hope. A feeling of a 'new life'. Faith in yourself and the world is restored.`,
    attention: "Don't stay only in dreams — ground your ideas in concrete actions. The Star inspires, but without action inspiration remains just a dream.",
    rec: "Dream big and write down your ideas. Start a creative project. Help others — that's your resource in this period. Be grateful for what you have.",
  },
  18: {
    theme: "Illusions and the depths of the subconscious",
    desc: `The Moon is the arcana of fears, illusions and working with the subconscious. This month may be foggy: not everything that seems is true. Not everything that frightens is danger.\n\nDreams become vivid and meaningful. Write them down — they hide messages from your subconscious. Intuition sharpens, but may confuse truth and fantasy.\n\nFinances: caution is essential. Don't believe promises, check documents. Fraud and deception are the main risks of this period.\n\nRelationships: illusions and disappointments. You may see your partner in a new, not always pleasant light. Or — create an illusion yourself, avoiding the truth.\n\nHealth: mental health is in focus. Anxiety, insomnia, phobias. Work with fears through therapy, not suppression.`,
    attention: "Don't make important decisions in the Moon's fog. Check all information. Don't give in to fears — most of them aren't real. Be careful with alcohol and substances.",
    rec: "Keep a dream journal. Work with anxiety through breathing practices. Minimize news consumption. Turn to a psychologist to work with fears.",
  },
  19: {
    theme: "Joy and success",
    desc: `The Sun is the brightest arcana. This month brings joy, success, recognition and fullness of life. Everything you've done begins to bear fruit.\n\nPublic visibility and recognition are your tools. Speak, publish, show results. The world is ready to see you and applaud.\n\nFinances: one of the best financial periods. Money comes easily and joyfully. The Universe's generosity is at its peak.\n\nRelationships: warmth, joy, harmony. For couples — renewed feelings, for singles — vivid encounters. The birth of children or important projects is possible.\n\nInner state: happiness and fullness of life. A feeling that 'it was all worth it'. Energy and vitality at their peak.`,
    attention: "Don't get arrogant. The Sun shines on everyone — be generous and grateful. Don't ignore those who helped you reach success.",
    rec: "Enjoy it! This is your time. Share your joy with others. Record your successes — they'll come in handy in hard times. Allow yourself to be happy.",
  },
  20: {
    theme: "Judgement and taking stock",
    desc: `The Judgement arcana — a time for taking stock and karmic reckoning. What have you done this cycle? What lessons did you learn? Which did you ignore?\n\nEverything returns: both good and bad. Karmic relationships end or move to a new level. People from the past may return — to complete the unfinished.\n\nFinances: you'll get what you deserve. If you worked honestly — there will be reward. If not — there will be a lesson.\n\nRelationships with the lineage are in focus. Parental programs, family scenarios come to the surface.\n\nInner state: a deep re-evaluation of your whole life. Forgiveness is the key practice of this month.`,
    attention: "Don't run from karmic lessons — they'll catch up anyway. Don't condemn yourself — learn. Forgive those who need to be forgiven. Let go of the past.",
    rec: "Practice forgiveness — of yourself and others. Sort out family scenarios. Take stock and record the lessons. Gratitude is your key to the next stage.",
  },
  21: {
    theme: "Completion and fullness",
    desc: `The World is the arcana of completing the cycle and fullness. This month brings a sense of wholeness: you see the whole picture, understand your path and feel satisfaction.\n\nInternational contacts, travel, large projects — the World's energy expands boundaries. You go beyond the familiar.\n\nFinances: an abundant period. Large deals, international projects, recognition. Everything earned bears fruit.\n\nRelationships: fullness and harmony. Traveling together. A sense of completion and gratitude for the shared path.\n\nInner state: peace and calm. You accept yourself as you are. This is not an end — it's the completion of a chapter before the start of a new one.`,
    attention: "Don't fear completion — every end is followed by a beginning. Don't cling to what's leaving. Give thanks and let go.",
    rec: "Travel — physically or mentally. Complete unfinished projects. Thank everyone who was on your path. Prepare for a new cycle.",
  },
  22: {
    theme: "Freedom and a leap into the unknown",
    desc: `The Fool is the zero arcana, the beginning and the end at once. This month carries the energy of absolute freedom and readiness for adventure. The rules are suspended.\n\nYou may feel a desire to drop everything and start over. That's normal — the Fool isn't afraid of the unknown. But make sure it's a move forward, not an escape.\n\nFinances: unpredictable. Money comes by unconventional paths. Don't plan — improvise (but with a safety cushion).\n\nRelationships: lightness, freedom, no obligations. New acquaintances are vivid but may be fleeting.\n\nInner state: childlike joy and at the same time the anxiety of the unknown. Learn to trust life.`,
    attention: "Don't confuse freedom with irresponsibility. The Fool can be a genius or a fool — the difference is awareness. Have a plan B.",
    rec: "Allow yourself spontaneity. Try something you've never done. Travel. Laugh. But keep a financial cushion for the unforeseen.",
  },
};

const arcanaThemesES: Record<number, MonthTheme> = {
  1: {
    theme: "Un nuevo comienzo",
    desc: `Este mes porta la energía del Mago, el arquetipo de la iniciativa y los comienzos. Sentirás un impulso de fuerza y ganas de empezar algo nuevo. Las ideas llegarán una tras otra, y es importante no dispersarse, sino elegir una clave y dirigir hacia ella toda tu energía.\n\nEl Mago te da la capacidad de convencer e inspirar. Tus palabras adquieren en este periodo una fuerza especial: úsalas para negociaciones, presentaciones, conversaciones importantes. La gente te escuchará.\n\nSin embargo, ten cuidado con las decisiones impulsivas. La energía del Mago puede ser engañosa: parece que todo saldrá fácil, pero sin plan ni estructura el resultado será frágil. Empieza, pero no olvides los cimientos.`,
    attention: "Cuida de no dispersarte en muchos proyectos a la vez. Las decisiones financieras impulsivas en este periodo son especialmente peligrosas. Verifica la información antes de actuar: la energía del Mago también atrae a los estafadores.",
    rec: "Haz una lista de metas para el mes. Elige una principal y concéntrate. Empieza la mañana con la afirmación: 'Creo mi realidad con conciencia'. Invierte en formación y herramientas.",
  },
  2: {
    theme: "Silencio e intuición",
    desc: `La energía de la Sacerdotisa frena el ritmo y te dirige hacia dentro. No es momento de acciones activas: es momento de observación, análisis y comprensión intuitiva. Confía en los sueños, las coincidencias y la voz interior.\n\nEste mes la información llegará no por la lógica, sino por el sentir. Puedes 'saber' algo sin entender de dónde viene ese saber. No lo descartes: anótalo.\n\nLas relaciones con quienes te rodean pueden volverse más silenciosas, pero también más profundas. La comunicación superficial cansará. Busca personas con quienes hablar de lo importante.`,
    attention: "No tomes grandes decisiones con prisa. El silencio de este mes no es estancamiento, sino maduración. Si fuerzas los acontecimientos, el resultado puede decepcionar. Deja que los procesos sigan su curso natural.",
    rec: "Lleva un diario de observaciones y sueños. Medita al menos 10 minutos al día. Pasa tiempo en silencio, sin música, pódcast ni redes sociales. Acude a un psicólogo o mentor.",
  },
  3: {
    theme: "Abundancia y creatividad",
    desc: `Un mes bajo la energía de la Emperatriz, uno de los periodos más favorables. Dinero, amor, belleza, creatividad: todo florece. Atraes recursos y personas. El mundo es generoso contigo.\n\nLa energía creativa está al máximo. Si te dedicas al arte, el diseño, la música, este es tu mes. Pero aunque no sea así, un enfoque creativo de cualquier tarea dará resultados.\n\nLas relaciones se llenan de calidez y sensualidad. Para las parejas, es un tiempo de renovación de los sentimientos. Para los solteros, un periodo en que el atractivo está al máximo.\n\nEn lo financiero, el dinero llega más fácil de lo habitual. Pero cuidado con el derroche: la Emperatriz puede tentarte a compras innecesarias 'por belleza'.`,
    attention: "No cedas a la pereza: la abundancia relaja. Controla los gastos: el deseo de 'darte un capricho' puede descontrolarse. No pospongas asuntos importantes por los placeres.",
    rec: "Planifica un proyecto creativo. Renueva tu armario o tu interior (con moderación). Pasa tiempo en la naturaleza. Disfruta de la vida, pero no olvides la disciplina.",
  },
  4: {
    theme: "Estructura y orden",
    desc: `La energía del Emperador te exige organización y disciplina. El caos de los meses anteriores debe tomar forma. Crea sistemas, pon orden, planifica.\n\nEs un mes para decisiones serias: comprar un inmueble, firmar contratos, tramitar documentos. Todo lo ligado a los cimientos trabaja a tu favor.\n\nEn el trabajo pueden notarte como líder u organizador. Es posible un ascenso o una ampliación de responsabilidades. Asume la responsabilidad, pero no olvides delegar.\n\nEn las relaciones, momento de pasos concretos: vivienda compartida, presupuesto común, planificación del futuro.`,
    attention: "No seas demasiado rígido, ni contigo ni con los demás. La energía imperial puede convertirse en tiranía. Controla el deseo de gestionarlo todo. Permite que la gente se equivoque.",
    rec: "Haz un plan para el próximo trimestre. Pon orden en tus documentos y finanzas. Delega lo que puedas. Haz deporte: el cuerpo necesita disciplina.",
  },
  5: {
    theme: "Sabiduría y aprendizaje",
    desc: `El mes del Sumo Sacerdote: tiempo de aprender, de buscar sentido y de transmitir conocimiento. Te sentirás atraído por la filosofía, la psicología, las prácticas espirituales. Los maestros y mentores juegan un papel clave.\n\nSi tú mismo eres un experto, es momento de compartir tu conocimiento. Lanza cursos, escribe artículos, da consultas. El mundo está dispuesto a escuchar.\n\nLas relaciones pasan la prueba de los valores. Empiezas a ver si tus principios de vida coinciden con los de tu pareja. Si no, será fuente de incomodidad.\n\nFinanzas: ingresos a través de la experiencia y el conocimiento. La inversión en educación se amortizará muchas veces.`,
    attention: "No caigas en el moralismo. No impongas tus puntos de vista a los demás. Desconfía del apego fanático a una sola enseñanza o sistema. Equilibrio entre tradición y novedad.",
    rec: "Apúntate a un curso o taller. Lee un libro que lleva tiempo en la estantería. Busca un mentor. Si puedes, empieza a enseñar o a guiar.",
  },
  6: {
    theme: "Elección y responsabilidad",
    desc: `La energía de los Enamorados te pone ante una elección. Puede ser entre dos personas, dos proyectos, dos caminos. No hay una respuesta 'correcta': solo está tu respuesta.\n\nLa energía amorosa está al máximo. Nuevos encuentros, citas románticas, renovación de los sentimientos en las relaciones existentes. Pero los Enamorados no van solo de romance, sino de responsabilidad por tu elección.\n\nEn lo financiero, una elección entre inversiones, proyectos, direcciones. No intentes estar en dos sitios a la vez. Toma una decisión y ve hasta el final.\n\nEstado interior: una lucha entre el 'quiero' y el 'debo', entre la razón y el corazón. Aprende a escuchar ambas voces y a hallar el equilibrio.`,
    attention: "No pospongas la elección indefinidamente. La indecisión en este periodo sale cara. Pero tampoco decidas bajo presión. Date tiempo, pero no demasiado.",
    rec: "Anota todas las opciones y sus consecuencias. Habla con alguien de confianza. Escucha el corazón, pero verifica con los hechos. Toma una decisión y no mires atrás.",
  },
  7: {
    theme: "Movimiento y victoria",
    desc: `El Carro porta la energía del movimiento, la velocidad y los logros. Es un mes para la acción: lanzar proyectos, mudanzas, viajes, competiciones. Si estabas parado, es hora de moverte.\n\nPuedes sentir un impulso interior y ganas de 'tomar por asalto' cualquier meta. Eso es bueno si está dirigido, y peligroso si es caótico. La energía del Carro requiere control y dirección.\n\nFinanzas: crecimiento activo de ingresos a través de la acción. Primas, bonificaciones, recompensas por el esfuerzo. El dinero llega por la velocidad y la competencia.\n\nSalud: los deportes de adrenalina son buenos, pero cuidado con el riesgo de lesiones. El sistema muscular está bajo carga.`,
    attention: "No te quemes. La energía del Carro puede llevar al agotamiento si no se mantiene el equilibrio. Cuida tu salud, sobre todo músculos y articulaciones. No te apresures en las decisiones de dinero.",
    rec: "Haz un plan de acción claro. Muévete rápido, pero según el plan. Haz deporte: el cuerpo necesita una salida para la energía. Viaja si tienes la oportunidad.",
  },
  8: {
    theme: "Fuerza y resistencia",
    desc: `El mes del arcano de la Fuerza: tiempo de prueba de resistencia. Tendrás que afrontar los desafíos con paciencia y un eje interior, no con agresión ni control.\n\nLa verdadera fuerza no es 'romper', sino 'aguantar'. Este mes descubrirás cuán firme es tu carácter. Los conflictos se resuelven no a gritos, sino con serena seguridad.\n\nRelaciones: una prueba de solidez. ¿Quién de los miembros está dispuesto a ceder sin perder la dignidad? La lucha por el liderazgo puede agudizarse.\n\nFinanzas: ingresos estables a través del trabajo tenaz. No esperes dinero fácil: trabaja con método. Los asuntos legales se resuelven a tu favor con la debida paciencia.`,
    attention: "No estalles. Controla la ira y la irritación: destruirán lo que construyes. La salud física requiere atención: dientes, huesos, músculos. No acumules estrés.",
    rec: "Practica la paciencia como una habilidad. El entrenamiento de fuerza ayudará a canalizar la energía. Resuelve los asuntos legales. Fortalece tu salud.",
  },
  9: {
    theme: "Soledad y sabiduría",
    desc: `La energía del Ermitaño te dirige hacia dentro. Es un mes para el autoanálisis, la soledad y la búsqueda de respuestas en el silencio. Las compañías ruidosas y la comunicación superficial cansarán.\n\nEl Ermitaño porta luz, pero una luz interior. Puedes obtener intuiciones importantes sobre tu vida que cambien tu rumbo. No las descartes.\n\nFinancieramente, el minimalismo funciona mejor que la expansión. Reduce gastos, revisa el presupuesto. El dinero llega por la experiencia profunda, no por el volumen.\n\nSalud: el sistema nervioso necesita descanso. Paseos por la naturaleza, silencio, meditación. Minimiza los estimulantes.`,
    attention: "No confundas la soledad con el aislamiento. El Ermitaño busca sabiduría, no huye del mundo. Si sientes depresión, pide ayuda. El silencio debe ser consciente, no forzado.",
    rec: "Reserva tiempo para la soledad. Lee, medita, pasea por la naturaleza. Minimiza el ruido informativo. Lleva un diario de reflexiones.",
  },
  10: {
    theme: "La rueda de los cambios",
    desc: `La Rueda de la Fortuna gira, y este mes trae giros inesperados. Tanto positivos como negativos. Prepárate para las sorpresas.\n\nLos acontecimientos pueden desarrollarse con rapidez: lo que ayer parecía estable puede cambiar en un solo día. Pero también surgirán nuevas oportunidades de la nada.\n\nFinanzas: impredecibles; puede haber tanto ingresos inesperados como gastos inesperados. Ten un colchón financiero.\n\nRelaciones: encuentros kármicos, personas que regresan del pasado. Alguien puede aparecer o desaparecer de tu vida de repente.\n\nEstado interior: una 'montaña rusa' de emociones. Aprende a aceptar la incertidumbre como norma, no como amenaza.`,
    attention: "No te aferres a la estabilidad: este mes es ilusoria. Diversifica tus flujos financieros. Sé flexible en los planes. La rueda gira, y tu posición puede cambiar.",
    rec: "Crea una reserva financiera. Ábrete a los cambios. Practica la aceptación: 'Acepto lo que llega y suelto lo que se va'. No te resistas a la corriente.",
  },
  11: {
    theme: "Justicia y equilibrio",
    desc: `El arcano de la Justicia trae equilibrio kármico. Este mes recibirás exactamente lo que has merecido, tanto lo bueno como lo difícil. Es el ajuste de cuentas honesto del universo.\n\nLos asuntos legales se resuelven: pleitos, contratos, repartos de bienes. La honestidad se recompensa, la deshonestidad se castiga.\n\nRelaciones: una resolución justa de los conflictos. Si tenías razón, se hará evidente. Si tenías la culpa, tendrás que reconocerlo.\n\nFinanzas: equilibrio de ingresos y gastos. No es momento de riesgos: aténte a precios justos y tratos honestos.\n\nEstado interior: un 'tribunal interior'; evalúas tus decisiones pasadas y sus consecuencias. Sé justo contigo mismo.`,
    attention: "No intentes engañar al sistema: este mes la cuenta kármica es precisa. No alargues los asuntos legales. Sé honesto en las cuestiones financieras. No juzgues a los demás con demasiada dureza.",
    rec: "Resuelve los asuntos legales. Salda las deudas, financieras y emocionales. Practica la honestidad en todas las áreas. Una meditación sobre el equilibrio.",
  },
  12: {
    theme: "Sacrificio y transformación",
    desc: `El Colgado es uno de los arcanos más complejos. Este mes te exige 'dar la vuelta' a tu visión habitual de las cosas. Lo que parecía importante puede resultar una ilusión. Y lo que ignorabas, la clave de la respuesta.\n\nLa energía del mes lo ralentiza todo: proyectos, relaciones, finanzas. Es una pausa forzosa, y resistirse a ella solo aumentará el malestar.\n\nEl sacrificio es el tema clave. Puede que necesites renunciar a algo habitual por algo nuevo. Es doloroso, pero necesario.\n\nSalud: el sistema linfático, los estancamientos. El movimiento y la purificación son obligatorios.`,
    attention: "No te resistas a la pausa. No intentes forzar los acontecimientos: llegarán a su tiempo. Acepta el estado 'suspendido' como parte del proceso. No te sacrifiques sin pensar.",
    rec: "Acepta la pausa con conciencia. Dedícate a la purificación: del cuerpo, del espacio, de los pensamientos. El voluntariado y ayudar a otros es un recurso poderoso. Reevalúa tus prioridades.",
  },
  13: {
    theme: "Transformación y renovación",
    desc: `El arcano de la Muerte no es un final, sino una transformación radical. Este mes cierra lo que se ha agotado y libera espacio para lo nuevo. No te aferres a lo muerto.\n\nViejos hábitos, relaciones, proyectos pueden terminar. Es doloroso, pero necesario. Lo que no crece, se descompone. Mejor soltar con conciencia que verse obligado.\n\nFinancieramente: las viejas fuentes de ingresos pueden agotarse. No entres en pánico: las nuevas se abrirán, pero no de inmediato. El periodo de transición requiere paciencia y un colchón financiero.\n\nEstado interior: miedo al cambio y, a la vez, su inevitabilidad. Deja morir lo viejo para que nazca lo nuevo.`,
    attention: "No te aferres a lo que se va. No confundas el miedo al cambio con la intuición: a veces hay que dar un paso a lo desconocido sin más. Cuida la inmunidad: el cuerpo reacciona a la transformación.",
    rec: "Haz una 'revisión de tu vida': ¿qué ya no funciona? Suelta con conciencia. Un detox, físico y mental. Trabaja el miedo con terapia o prácticas.",
  },
  14: {
    theme: "Equilibrio y moderación",
    desc: `La Templanza trae armonía y equilibrio tras la turbulencia de los meses anteriores. Es un tiempo para integrar la experiencia, recuperar fuerzas y hallar el justo medio.\n\nTodo este mes funciona a través de la moderación: cargas moderadas, gastos moderados, emociones moderadas. Los extremos se castigan, el equilibrio se recompensa.\n\nSalud: metabolismo, equilibrio hormonal. El momento ideal para empezar un régimen saludable, sin fanatismo pero con constancia.\n\nRelaciones: compromisos y concesiones mutuas. Si estás acostumbrado a arrimar el ascua a tu sardina, el mes te enseñará a dar y recibir por igual.`,
    attention: "No caigas en extremos, ni en la rigidez ni en la permisividad. El equilibrio es tu principal herramienta. No ignores las señales del cuerpo de sobrecarga.",
    rec: "Empieza un régimen saludable. Equilibra trabajo y descanso. Practica el 'justo medio' en todo. El yoga y la meditación son especialmente útiles.",
  },
  15: {
    theme: "Tentación y el lado oscuro",
    desc: `El Diablo es el arcano de las tentaciones, las adicciones y el trabajo con el lado oscuro de la personalidad. Este mes puede traer seducciones: financieras, sexuales, emocionales.\n\nLa pasión y el deseo están al máximo. Es una energía poderosa que puede ser tanto destructiva como creativa. Tu elección determina hacia dónde va.\n\nFinancieramente: gran potencial de ganancia, pero también gran riesgo de pérdidas. Los esquemas arriesgados y el 'dinero fácil' atraen: ten cuidado.\n\nRelaciones: la energía sexual es intensa. Pero comprueba: ¿es intimidad genuina o dependencia? Los patrones tóxicos se agudizan.\n\nEstado interior: un encuentro con tu propia sombra. Lo que reprimes sale a la superficie. No huyas: enfréntalo cara a cara.`,
    attention: "Cuidado con las adicciones: alcohol, comida, redes sociales, compras, sexo. No cedas a las ofertas 'fáciles'. Verifica tus motivos: ¿lo quieres o dependes de ello?",
    rec: "Trabaja con la sombra, mediante terapia o un diario. Establece límites claros. Canaliza la pasión hacia la creatividad o el deporte. Toma conciencia de tus adicciones.",
  },
  16: {
    theme: "Destrucción y renovación",
    desc: `La Torre es el arcano de los acontecimientos repentinos y la destrucción de las viejas estructuras. Este mes puede traer un shock: noticias inesperadas, crisis, cambios bruscos.\n\nLa Torre destruye solo lo que se construyó sobre un cimiento falso. Si tus estructuras son sólidas, resistirás. Si no, mejor reconstruir ahora que derrumbarse después.\n\nFinanzas: son posibles sacudidas. Ten un colchón financiero. No pidas grandes préstamos. Los viejos modelos de negocio pueden derrumbarse.\n\nRelaciones: la verdad sale a la luz. Si la relación se basaba en la mentira, se hará evidente. La terapia de choque puede salvar o terminar la unión.\n\nEstado interior: shock y, a la vez, liberación. Todo lo inauténtico se derrumba para que quede solo lo genuino.`,
    attention: "No entres en pánico. La Torre purifica, y tras la destrucción llega la claridad. Protege tus finanzas. No tomes decisiones irreversibles en estado de shock. Date tiempo para asimilar.",
    rec: "Acepta la situación, sea cual sea. Busca apoyo. Trabaja con un psicólogo si el golpe es fuerte. Recuerda: tras la Torre siempre llega la Estrella.",
  },
  17: {
    theme: "Esperanza e inspiración",
    desc: `La Estrella es uno de los arcanos más luminosos. Tras las posibles sacudidas del periodo anterior llegan la esperanza, la inspiración y una nueva visión del futuro.\n\nLa energía creativa está en alza. Si te dedicas al arte, la tecnología, la innovación, este es tu mes. Las ideas llegan puras y claras.\n\nRelaciones: ligereza y frescura. Un nuevo enamoramiento o la renovación de los sentimientos en la pareja. Miras a tu pareja con ojos nuevos.\n\nFinanzas: dinero a través de la creatividad y la innovación. Los proyectos sociales, el crowdfunding y las ideas creativas dan ingresos.\n\nEstado interior: el renacer de la esperanza. La sensación de una 'nueva vida'. Se restaura la fe en ti y en el mundo.`,
    attention: "No te quedes solo en los sueños: aterriza las ideas en acciones concretas. La Estrella inspira, pero sin acción la inspiración sigue siendo solo un sueño.",
    rec: "Sueña a lo grande y anota tus ideas. Empieza un proyecto creativo. Ayuda a los demás: es tu recurso en este periodo. Agradece lo que tienes.",
  },
  18: {
    theme: "Ilusiones y las profundidades del subconsciente",
    desc: `La Luna es el arcano de los miedos, las ilusiones y el trabajo con el subconsciente. Este mes puede ser brumoso: no todo lo que parece es verdad. No todo lo que asusta es peligro.\n\nLos sueños se vuelven vívidos y significativos. Anótalos: esconden mensajes de tu subconsciente. La intuición se agudiza, pero puede confundir la verdad con la fantasía.\n\nFinanzas: la prudencia es obligatoria. No creas en las promesas, verifica los documentos. El fraude y el engaño son los principales riesgos de este periodo.\n\nRelaciones: ilusiones y decepciones. Puedes ver a tu pareja bajo una luz nueva, no siempre agradable. O crear tú mismo una ilusión, evitando la verdad.\n\nSalud: la salud mental está en foco. Ansiedad, insomnio, fobias. Trabaja los miedos con terapia, no con la represión.`,
    attention: "No tomes decisiones importantes en la bruma de la Luna. Verifica toda la información. No cedas a los miedos: la mayoría no son reales. Cuidado con el alcohol y las sustancias.",
    rec: "Lleva un diario de sueños. Trabaja la ansiedad con prácticas de respiración. Minimiza el consumo de noticias. Acude a un psicólogo para trabajar los miedos.",
  },
  19: {
    theme: "Alegría y éxito",
    desc: `El Sol es el arcano más luminoso. Este mes trae alegría, éxito, reconocimiento y plenitud de vida. Todo lo que has hecho empieza a dar frutos.\n\nLa visibilidad pública y el reconocimiento son tus herramientas. Habla, publica, muestra resultados. El mundo está dispuesto a verte y a aplaudirte.\n\nFinanzas: uno de los mejores periodos financieros. El dinero llega fácil y con alegría. La generosidad del universo está al máximo.\n\nRelaciones: calidez, alegría, armonía. Para las parejas, renovación de los sentimientos; para los solteros, encuentros vívidos. Es posible el nacimiento de hijos o de proyectos importantes.\n\nEstado interior: felicidad y plenitud de vida. La sensación de que 'todo valió la pena'. Energía y vitalidad al máximo.`,
    attention: "No te envanezcas. El Sol brilla para todos: sé generoso y agradecido. No ignores a quienes te ayudaron a llegar al éxito.",
    rec: "¡Disfruta! Es tu momento. Comparte la alegría con los demás. Registra tus éxitos: te servirán en los periodos difíciles. Permítete ser feliz.",
  },
  20: {
    theme: "Juicio y balance",
    desc: `El arcano del Juicio: tiempo de hacer balance y de ajuste de cuentas kármico. ¿Qué has hecho en este ciclo? ¿Qué lecciones aprendiste? ¿Cuáles ignoraste?\n\nTodo vuelve: el bien y el mal. Las relaciones kármicas se cierran o pasan a un nuevo nivel. La gente del pasado puede regresar, para cerrar lo inconcluso.\n\nFinanzas: recibirás lo que mereces. Si trabajaste con honestidad, habrá recompensa. Si no, habrá una lección.\n\nLa relación con el linaje está en foco. Los programas parentales y los guiones familiares salen a la superficie.\n\nEstado interior: una reevaluación profunda de toda tu vida. El perdón es la práctica clave de este mes.`,
    attention: "No huyas de las lecciones kármicas: te alcanzarán de todos modos. No te condenes: aprende. Perdona a quien debas perdonar. Suelta el pasado.",
    rec: "Practica el perdón, hacia ti y hacia los demás. Resuelve los guiones familiares. Haz balance y registra las lecciones. La gratitud es tu llave a la siguiente etapa.",
  },
  21: {
    theme: "Cierre y plenitud",
    desc: `El Mundo es el arcano del cierre del ciclo y de la plenitud. Este mes trae una sensación de totalidad: ves el cuadro completo, comprendes tu camino y sientes satisfacción.\n\nContactos internacionales, viajes, grandes proyectos: la energía del Mundo amplía las fronteras. Vas más allá de lo habitual.\n\nFinanzas: un periodo abundante. Grandes acuerdos, proyectos internacionales, reconocimiento. Todo lo ganado da frutos.\n\nRelaciones: plenitud y armonía. Viajar en pareja. Una sensación de plenitud y gratitud por el camino compartido.\n\nEstado interior: paz y sosiego. Te aceptas tal como eres. No es un final: es el cierre de un capítulo antes del comienzo de otro.`,
    attention: "No temas el cierre: a cada final le sigue un comienzo. No te aferres a lo que se va. Agradece y suelta.",
    rec: "Viaja, física o mentalmente. Cierra los proyectos inacabados. Agradece a todos los que estuvieron en tu camino. Prepárate para un nuevo ciclo.",
  },
  22: {
    theme: "Libertad y salto a lo desconocido",
    desc: `El Loco es el arcano cero, el comienzo y el final a la vez. Este mes porta la energía de la libertad absoluta y de la disposición a la aventura. Las reglas quedan suspendidas.\n\nPuedes sentir ganas de dejarlo todo y empezar de nuevo. Es normal: el Loco no teme lo desconocido. Pero asegúrate de que es un avance, no una huida.\n\nFinanzas: impredecibles. El dinero llega por caminos poco convencionales. No planifiques: improvisa (pero con un colchón de seguridad).\n\nRelaciones: ligereza, libertad, falta de compromiso. Los nuevos encuentros son vívidos, pero pueden ser fugaces.\n\nEstado interior: alegría infantil y, a la vez, la inquietud de lo desconocido. Aprende a confiar en la vida.`,
    attention: "No confundas la libertad con la irresponsabilidad. El Loco puede ser un genio o un necio: la diferencia está en la conciencia. Ten un plan B.",
    rec: "Permítete la espontaneidad. Prueba algo que nunca hayas hecho. Viaja. Ríe. Pero conserva un colchón financiero por si surge lo imprevisto.",
  },
};

export function getMonthThemeLocalized(monthArcana: number, lang: string): MonthTheme | null {
  if (lang === 'en') return arcanaThemesEN[monthArcana] || arcanaThemesEN[1];
  if (lang === 'es') return arcanaThemesES[monthArcana] || arcanaThemesES[1];
  return null;
}

// ---- Year periods ----
export function getPeriodsLocalized(yearArcana: number, targetYear: number, lang: string): YearPeriod[] | null {
  if (lang === 'en') {
    return [
      {
        title: "Period I: Launch and tuning",
        dateRange: `01.01.${targetYear} – 31.03.${targetYear}`,
        description: `The first quarter of the year sets the overall tone and direction. In the energy of arcana ${yearArcana} this is a time for formulating intentions, launching key initiatives and tuning your inner compass. Everything you lay down in these three months will define the dynamics of the rest of the year. Don't rush large-scale projects — first make sure the foundation is solid.\n\nJanuary is a month of inner tuning. February — the first steps. March — checking the direction. If by the end of March you don't feel clarity — that's a signal to adjust.`,
        risks: "Too fast a start without a plan. Impulsive decisions in January that will have to be reversed in March. Ignoring inner signals for the sake of 'I must act'.",
        opportunities: "Laying the foundation for the whole year. Forming key habits. Launching projects that will work all year. Establishing new connections and contacts.",
      },
      {
        title: "Period II: Growth and expansion",
        dateRange: `01.04.${targetYear} – 30.06.${targetYear}`,
        description: `The second quarter is a time of active growth. What was sown in the first quarter begins to sprout. The energy of arcana ${yearArcana} intensifies and demands expansion from you: new contacts, new projects, new horizons.\n\nApril is a time to structure processes. May — expansion. June — harmonization and balance. If you're overloaded — June will help set priorities.\n\nImportant: don't try to grow in all directions at once. Choose 1–2 key directions and invest your energy there.`,
        risks: "Overload from too many projects. Financial overstretch. Neglecting health for the sake of 'growth'. Conflicts due to the fast pace.",
        opportunities: "Scaling successful initiatives. New partnerships. Financial growth. Public recognition. Teamwork.",
      },
      {
        title: "Period III: Review and adjustment",
        dateRange: `01.07.${targetYear} – 30.09.${targetYear}`,
        description: `The third quarter is the 'midpoint', when you need to stop and honestly assess: is what you're doing working? The energy of arcana ${yearArcana} becomes more reflective in this period.\n\nJuly — a deep analysis of the first half-year. August — course correction. September — preparing for the final push.\n\nIf by this point you don't see results — don't panic, but honestly assess the reasons. Perhaps you need to change the approach, not the goal.`,
        risks: "Disappointment from slow progress. The urge to quit what you started. Comparing yourself with others. Physical fatigue by mid-year.",
        opportunities: "Adjusting the strategy based on real experience. Optimizing processes. Deepening relationships. Ending ineffective projects.",
      },
      {
        title: "Period IV: Completion and taking stock",
        dateRange: `01.10.${targetYear} – 31.12.${targetYear}`,
        description: `The last quarter of the year is a time for completion, taking stock and preparing for the next stage. The energy of arcana ${yearArcana} reaches maturity: you see the results of your work and understand what worked and what didn't.\n\nOctober — consolidating results. November — deep work and completion. December — gratitude, rest and tuning into the next year.\n\nImportant: don't start anything fundamentally new in this period. Complete, optimize, give thanks. The new will begin next year.`,
        risks: "Burnout from the year's load. Trying to 'get everything done' at the last moment. Disappointment over unfulfilled plans. Financial overstretch before the holidays.",
        opportunities: "Capturing successes. Taking stock. Gratitude. Preparing a strategy for the next year. Rest and recovery.",
      },
    ];
  }
  if (lang === 'es') {
    return [
      {
        title: "Periodo I: Arranque y ajuste",
        dateRange: `01.01.${targetYear} – 31.03.${targetYear}`,
        description: `El primer trimestre del año marca el tono y la dirección generales. En la energía del arcano ${yearArcana} es momento de formular intenciones, lanzar las iniciativas clave y calibrar la brújula interior. Todo lo que asientes en estos tres meses definirá la dinámica del resto del año. No te apresures con proyectos a gran escala: primero asegúrate de que los cimientos son sólidos.\n\nEnero es un mes de ajuste interior. Febrero, los primeros pasos. Marzo, la comprobación de la dirección. Si a finales de marzo no sientes claridad, es una señal para corregir.`,
        risks: "Un arranque demasiado rápido sin plan. Decisiones impulsivas en enero que habrá que deshacer en marzo. Ignorar las señales internas por el 'hay que actuar'.",
        opportunities: "Asentar los cimientos de todo el año. Formar hábitos clave. Lanzar proyectos que funcionen todo el año. Establecer nuevos vínculos y contactos.",
      },
      {
        title: "Periodo II: Crecimiento y expansión",
        dateRange: `01.04.${targetYear} – 30.06.${targetYear}`,
        description: `El segundo trimestre es un tiempo de crecimiento activo. Lo que se sembró en el primer trimestre empieza a germinar. La energía del arcano ${yearArcana} se intensifica y te exige expansión: nuevos contactos, nuevos proyectos, nuevos horizontes.\n\nAbril es momento de estructurar procesos. Mayo, expansión. Junio, armonización y equilibrio. Si estás sobrecargado, junio te ayudará a establecer prioridades.\n\nImportante: no intentes crecer en todas las direcciones a la vez. Elige 1–2 direcciones clave e invierte ahí tu energía.`,
        risks: "Sobrecarga por demasiados proyectos. Sobreesfuerzo financiero. Descuidar la salud por el 'crecimiento'. Conflictos por el ritmo rápido.",
        opportunities: "Escalar las iniciativas exitosas. Nuevas asociaciones. Crecimiento financiero. Reconocimiento público. Trabajo en equipo.",
      },
      {
        title: "Periodo III: Revisión y corrección",
        dateRange: `01.07.${targetYear} – 30.09.${targetYear}`,
        description: `El tercer trimestre es la 'mitad del camino', cuando hay que parar y evaluar con honestidad: ¿funciona lo que estás haciendo? La energía del arcano ${yearArcana} se vuelve más reflexiva en este periodo.\n\nJulio, un análisis profundo del primer semestre. Agosto, corrección del rumbo. Septiembre, preparación para el empujón final.\n\nSi a estas alturas no ves resultados, no entres en pánico, pero evalúa con honestidad las causas. Quizá haya que cambiar el enfoque, no la meta.`,
        risks: "Decepción por el progreso lento. Ganas de abandonar lo empezado. Compararse con los demás. Cansancio físico a mitad de año.",
        opportunities: "Ajustar la estrategia con la experiencia real. Optimizar procesos. Profundizar las relaciones. Cerrar los proyectos ineficaces.",
      },
      {
        title: "Periodo IV: Cierre y balance",
        dateRange: `01.10.${targetYear} – 31.12.${targetYear}`,
        description: `El último trimestre del año es momento de cierre, balance y preparación de la siguiente etapa. La energía del arcano ${yearArcana} alcanza la madurez: ves los resultados de tu trabajo y comprendes qué salió bien y qué no.\n\nOctubre, consolidar resultados. Noviembre, trabajo profundo y cierre. Diciembre, gratitud, descanso y sintonía con el año siguiente.\n\nImportante: no empieces nada radicalmente nuevo en este periodo. Cierra, optimiza, agradece. Lo nuevo empezará el año que viene.`,
        risks: "Agotamiento por la carga del año. Intentar 'hacerlo todo' en el último momento. Decepción por los planes incumplidos. Sobreesfuerzo financiero antes de las fiestas.",
        opportunities: "Fijar los éxitos. Hacer balance. Gratitud. Preparar la estrategia del año siguiente. Descanso y recuperación.",
      },
    ];
  }
  return null;
}

// ---- Year resources ----
const resourcesEN: Record<number, YearResources> = {
  1: {
    givesEnergy: ["New beginnings and first steps", "Learning new skills", "Communicating with inspiring people", "Physical activity, especially in the morning", "Working with affirmations and intentions", "Keeping an ideas journal", "Networking and new acquaintances", "Traveling to new places"],
    takesEnergy: ["Routine and repetition", "Waiting for the 'perfect moment'", "Others' opinions and the doubts of those around you", "Unfinished business from the past", "Toxic relationships", "Procrastination", "Comparing yourself with others", "Information noise"],
    talents: ["Public speaking and persuasion", "Entrepreneurship and launching projects", "Innovative thinking", "Leadership and initiative", "Fast adaptation to the new", "Unconventional problem-solving"],
  },
  2: {
    givesEnergy: ["Silence and solitude", "Meditation and mindful practices", "Water procedures", "Working with intuition and dreams", "Walks in nature, especially by water", "Reading and deep study", "Creative activity without a goal", "Lunar rituals and cycles"],
    takesEnergy: ["Noise and bustle", "Social media and the information stream", "Aggressive or energetically heavy people", "Attempts to force events", "Public speaking without preparation", "Physical overwork", "Conflict situations", "Tight deadlines"],
    talents: ["Intuitive knowing", "Depth of analysis and perception", "Healing and helping others", "Psychological insight", "Patience and wisdom", "Working with the subconscious"],
  },
  3: {
    givesEnergy: ["Creativity in all forms", "Beautiful things and spaces", "Communicating with pleasant people", "Nature and fresh air", "Tasty, healthy food", "Body care — massage, spa", "Gardening and working with the earth", "Music and art"],
    takesEnergy: ["An ugly environment", "Rude and aggressive people", "A strict diet or fasting", "Isolation from people", "Routine, monotonous work", "Criticism of appearance or abilities", "A lack of beauty and aesthetics", "Suppressing feelings"],
    talents: ["Creating beauty and comfort", "Attracting resources and people", "Creative realization", "Financial intuition", "Care and creating coziness", "Emotional intelligence"],
  },
};

const resourcesES: Record<number, YearResources> = {
  1: {
    givesEnergy: ["Nuevos comienzos y primeros pasos", "Aprender nuevas habilidades", "Tratar con personas que inspiran", "Actividad física, sobre todo matutina", "Trabajar con afirmaciones e intenciones", "Llevar un diario de ideas", "Hacer contactos y conocer gente", "Viajar a lugares nuevos"],
    takesEnergy: ["La rutina y la repetición", "Esperar el 'momento perfecto'", "La opinión ajena y las dudas de quienes te rodean", "Asuntos pendientes del pasado", "Relaciones tóxicas", "La procrastinación", "Compararte con los demás", "El ruido informativo"],
    talents: ["Oratoria y persuasión", "Emprendimiento y lanzamiento de proyectos", "Pensamiento innovador", "Liderazgo e iniciativa", "Adaptación rápida a lo nuevo", "Resolución de problemas poco convencional"],
  },
  2: {
    givesEnergy: ["Silencio y soledad", "Meditación y prácticas conscientes", "Tratamientos con agua", "Trabajar con la intuición y los sueños", "Paseos por la naturaleza, sobre todo junto al agua", "Lectura y estudio profundo", "Actividad creativa sin un objetivo", "Rituales y ciclos lunares"],
    takesEnergy: ["El ruido y el ajetreo", "Las redes sociales y el flujo de información", "Personas agresivas o energéticamente pesadas", "Los intentos de forzar los acontecimientos", "Hablar en público sin preparación", "El agotamiento físico", "Las situaciones de conflicto", "Los plazos ajustados"],
    talents: ["Conocimiento intuitivo", "Profundidad de análisis y percepción", "Sanación y ayuda a los demás", "Perspicacia psicológica", "Paciencia y sabiduría", "Trabajo con el subconsciente"],
  },
  3: {
    givesEnergy: ["La creatividad en todas sus formas", "Cosas y espacios bellos", "Tratar con personas agradables", "La naturaleza y el aire fresco", "Comida sabrosa y sana", "El cuidado del cuerpo: masaje, spa", "La jardinería y el trabajo con la tierra", "La música y el arte"],
    takesEnergy: ["Un entorno feo", "Personas groseras y agresivas", "Una dieta estricta o el ayuno", "El aislamiento de la gente", "El trabajo rutinario y monótono", "La crítica del aspecto o de las capacidades", "La falta de belleza y estética", "Reprimir los sentimientos"],
    talents: ["Crear belleza y comodidad", "Atraer recursos y personas", "Realización creativa", "Intuición financiera", "El cuidado y la creación de un ambiente acogedor", "Inteligencia emocional"],
  },
};

const fallbackEN: YearResources = {
  givesEnergy: ["Physical activity and movement", "Communicating with supportive people", "Creative self-expression", "Time in nature", "Learning and developing skills", "A regular sleep schedule", "Meditation and mindful practices", "Journaling and reflection"],
  takesEnergy: ["Toxic relationships and conflicts", "Information overload (social media, news)", "Procrastination and unfinished business", "An irregular schedule and lack of sleep", "Comparing yourself with others", "Suppressing emotions and feelings", "Addictions (alcohol, sugar, gadgets)", "Working without rest and breaks"],
  talents: ["The ability to adapt to change", "Problem-solving skills", "Communication abilities", "Strategic thinking", "Emotional resilience", "Creative potential"],
};

const fallbackES: YearResources = {
  givesEnergy: ["Actividad física y movimiento", "Tratar con personas que apoyan", "Expresión creativa de uno mismo", "Tiempo en la naturaleza", "Aprender y desarrollar habilidades", "Un horario de sueño regular", "Meditación y prácticas conscientes", "Llevar un diario y reflexionar"],
  takesEnergy: ["Relaciones tóxicas y conflictos", "Sobrecarga de información (redes sociales, noticias)", "Procrastinación y asuntos pendientes", "Un horario irregular y la falta de sueño", "Compararte con los demás", "Reprimir emociones y sentimientos", "Adicciones (alcohol, azúcar, dispositivos)", "Trabajar sin descanso ni pausas"],
  talents: ["La capacidad de adaptarse a los cambios", "Habilidades para resolver problemas", "Capacidad de comunicación", "Pensamiento estratégico", "Resiliencia emocional", "Potencial creativo"],
};

export function getResourcesLocalized(yearArcana: number, lang: string): YearResources | null {
  if (lang === 'en') return resourcesEN[yearArcana] || fallbackEN;
  if (lang === 'es') return resourcesES[yearArcana] || fallbackES;
  return null;
}
