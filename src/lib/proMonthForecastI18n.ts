// EN/ES translations for the PRO month forecast (proMonthForecast.ts).
// Parallel language path: the Russian base stays untouched and is used as fallback (lang 'ru').

import { getArcana } from "@/lib/arcana";
import type { MonthProInterpretation } from "./proMonthForecast";

type MonthDeep = { energy: string; sphere: { money: string; career: string; rel: string; health: string; inner: string }; practice: string };
type Lang = 'en' | 'es';

const deepEN: Record<number, MonthDeep> = {
  1: {
    energy: "The Magician's energy brings a powerful impulse to start something new this month. You feel you can influence reality through your decisions and actions. Intellectual energy is at its peak — use it for planning, negotiations, learning. The Magician gives a sense of 'I can do anything', but it's important not to scatter yourself. Choose one main direction and pour all your power of intention into it. Your words gain a special materializing force in this period — be careful with negative attitudes and complaints.",
    sphere: {
      money: "The financial flow opens through new ideas and projects. Old income sources may weaken — that's normal, it frees space for the new. Invest in learning and tools. Don't expect instant returns — this month is about sowing.",
      career: "Time to show initiative. Propose a new project, take on responsibility. Management will notice your activity. If you've long thought about changing jobs — now is a good moment for the first steps.",
      rel: "Relationships come alive, but may be tense — you're changing, and your partner needs time to accept it. New acquaintances are meaningful. Be open, but not pushy.",
      health: "The head and nervous system need attention. High mental load can lead to migraines. Meditation and breathing practices are your resource.",
      inner: "Euphoria from opportunities and fear of the unknown may struggle inside you. Accept this duality. Keep an ideas journal — they'll come in handy.",
    },
    practice: "Morning affirmation: 'I create my reality consciously'. 10 minutes of visualizing goals. An evening ideas journal.",
  },
  2: {
    energy: "The High Priestess's energy slows the month's pace and turns you inward. This is not a time for aggressive action — it's a time for observation, analysis and intuitive understanding. Trust dreams, signs and your inner voice. Information comes not through logic but through feeling. You may 'know' something without understanding where it comes from. Write down your insights. Feminine energy intensifies — for women it's a time of realizing their depth, for men a time of meeting the anima and developing intuition.",
    sphere: {
      money: "Not a time for big financial decisions. Money comes quietly, through intuitive hints and 'random' coincidences. Review your budget. Hidden expenses are possible — check your bills.",
      career: "Career decisions are better postponed. Observe, gather information, analyze. What you see in the silence will help you make the right decision later.",
      rel: "Relationships become deeper but quieter. Superficial communication is tiring. Look for those you can talk to about what matters. Secrets or the revealing of secrets are possible.",
      health: "The lymphatic system, water balance, hormonal background. More water, fewer stimulants. Sleep is your medicine.",
      inner: "Heightened sensitivity. You absorb the emotions of those around you like a sponge. Protect your space. Silence is your resource.",
    },
    practice: "A dream journal every morning. 15 minutes of meditation in silence. A walk by the water. Minimal social media.",
  },
  3: {
    energy: "The Empress fills the month with the energy of abundance, beauty and creativity. Everything blossoms — relationships, finances, the body. You attract resources and people. The world is generous to you. Creative energy is at its peak — even routine tasks turn into art. Sexuality and magnetism intensify. For women — a time of feminine power and attractiveness. For men — a time to meet a muse or strengthen the relationship with a partner. Nature and beauty recharge you.",
    sphere: {
      money: "Money comes more easily than usual. Gifts, bonuses, unexpected income are possible. But control your spending — the Empress tempts you into 'beautiful' purchases.",
      career: "Creative projects flourish. Design, marketing, PR are your strengths this month. Beauty and aesthetics bring money.",
      rel: "Romance and sensuality are at their peak. For couples — renewed feelings. For singles — heightened attractiveness and new acquaintances.",
      health: "The body responds to care. Massage, spa, skin care. Don't overdo it with food — the Empress loves to indulge, but the body has limits.",
      inner: "A sense of the fullness of life. Gratitude toward the world. But laziness is possible — abundance relaxes you. Don't lose focus.",
    },
    practice: "Start your morning with gratitude (5 things). Spend time in nature. Do something creative. Pamper your body.",
  },
  4: {
    energy: "The Emperor brings structure, order and discipline. Chaos must take form. Create systems, put things in order, plan. This is a month for serious decisions: buying real estate, signing contracts, handling paperwork. Anything connected with the foundation works. At work you may be noticed as a leader. Take responsibility, but delegate. In relationships — a time for concrete steps.",
    sphere: {
      money: "Stability through system. Make a budget, plan your spending. Real estate is a good investment. Money comes through organization.",
      career: "A promotion or expanded duties. A leadership position. Creating a business plan. Legal matters get resolved.",
      rel: "Concrete steps: shared housing, a joint budget, plans for the future. But don't be a tyrant — control destroys closeness.",
      health: "Spine, bones, joints. Structural training (Pilates, yoga). A regular routine is your medicine.",
      inner: "A need for control and order. But excessive control is a path to anxiety. Learn to trust the process.",
    },
    practice: "Make a plan for the month. Put your documents in order. 30 minutes of physical activity. Delegate one task.",
  },
  5: {
    energy: "The Hierophant brings wisdom and learning. This is a month for gaining knowledge, searching for meaning and passing on experience. Teachers and mentors play a key role. Relationships are tested by values. Traditions and spirituality come to the fore. Important exams, certifications, professional development are possible.",
    sphere: {
      money: "Income through expertise and knowledge. Investment in education pays off. Consulting and teaching are sources of income.",
      career: "Learning, courses, mentorship. If you're an expert — share your knowledge. Launch courses, write articles.",
      rel: "A test of values: do your principles align with your partner's? Deep conversations about the meaning of life.",
      health: "Throat, thyroid. Sing, speak the truth, express yourself. Herbal teas.",
      inner: "A search for meaning. Spiritual practices. But don't fall into fanaticism — a balance between tradition and the new.",
    },
    practice: "Read a book that's long been waiting. Find a mentor. Enroll in a course. Share knowledge with someone.",
  },
  6: {
    energy: "The Lovers put you before a choice. Love energy is at its peak. New acquaintances, romantic encounters, renewed feelings. But the Lovers is not only about romance — it's about responsibility for your choice. Every decision this month has long-term consequences. Don't postpone the choice, but don't rush under pressure either.",
    sphere: {
      money: "A choice between investments, projects. Don't try to sit on two chairs. A partnership business can be successful.",
      career: "A choice of direction. Offers from competitors. Decisions about joint projects. Trust your heart, but check with the facts.",
      rel: "The peak of romantic energy. New love or the renewal of an existing relationship. A love triangle is possible.",
      health: "Heart and blood vessels. Cardio in moderate doses. Emotional health matters more than physical.",
      inner: "A struggle between 'want' and 'should'. Learn to hear both voices. A choice is not a loss but a gain.",
    },
    practice: "Write out all the options and their consequences. Talk to a trusted person. Make a decision — and don't look back.",
  },
  7: {
    energy: "The Chariot carries movement and speed. An active month for action: relocations, travel, launches. Drive and the desire to 'storm' any goal. The energy requires control and direction. Without a plan, speed turns into chaos. With a plan — into victory.",
    sphere: {
      money: "Active income growth. Premiums, bonuses. Money through speed and competition. Don't burn out.",
      career: "Fast results. Competition is your motivator. Advancement through action. But watch the quality.",
      rel: "Dynamics in the relationship. Joint trips strengthen the bond. There may be impatience and irritability.",
      health: "The muscular system, adrenaline. Sport is a must — the body needs an outlet for energy. Risk of injury is heightened.",
      inner: "Excitement and drive. But in the speed you can lose the meaning. Once a week, stop and ask: 'Why am I running?'",
    },
    practice: "A clear plan of action. Sport every day. A trip or journey. In the evening — 10 minutes of silence.",
  },
  8: {
    energy: "Justice/Strength brings karmic balance. You get exactly what you've earned. Legal matters get resolved. Honesty is rewarded. A month of testing for resilience — through patience, not aggression. Documents and contracts are in focus.",
    sphere: {
      money: "A balance of income and expenses. Pay off debts. Honest deals bring profit. Dishonest ones are punished.",
      career: "Legal matters in your career. Defending your rights. Fair recognition of your work. Contracts and agreements.",
      rel: "A fair resolution of conflicts. Karmic relationships — lessons of the past. Honesty in feelings.",
      health: "Teeth, bones, joints. Legal stress can hit your health. Control your anger.",
      inner: "An inner court — assessing past decisions. Be fair to yourself. Forgiveness is a powerful resource.",
    },
    practice: "Sort out legal matters. Pay off debts. The practice of forgiveness. Strength training.",
  },
  9: {
    energy: "The Hermit turns you inward. A month of self-analysis and solitude. Noise is tiring. Information comes in silence. Important insights about life that may change your direction. Minimalism works better than expansion.",
    sphere: {
      money: "Cut expenses, review your budget. Income through deep expertise, not volume. One-on-one consulting.",
      career: "Don't start anything new. Deepen the current. Analysis and reflection. Scientific or research work.",
      rel: "A need for solitude. Your partner may take offense. Explain that it's not rejection but a need for silence.",
      health: "The nervous system. Walks in nature. Meditation. Minimal stimulants.",
      inner: "Deep self-analysis. Questions of 'who am I?' and 'where am I going?'. Silence gives answers you won't find in the noise.",
    },
    practice: "Set aside time for solitude. Read. Meditate. Keep a reflection journal. Walks in nature.",
  },
  10: {
    energy: "The Wheel of Fortune is turning. Unexpected turns — both good and difficult. Prepare for surprises. Events develop rapidly. Karmic meetings, people returning from the past.",
    sphere: {
      money: "Unpredictable finances. Unexpected income and expenses. Have a safety cushion.",
      career: "Sudden changes: promotion or dismissal. A change of direction. New opportunities out of nowhere.",
      rel: "Karmic meetings. People returning from the past. Fateful acquaintances. Prepare for surprises.",
      health: "Stress from uncertainty. Adaptogens, breathing techniques. Don't cling to control.",
      inner: "An emotional rollercoaster. Learn to accept uncertainty. Trust the process.",
    },
    practice: "A financial reserve. Flexibility in plans. Affirmation: 'I accept what comes'. Don't resist the current.",
  },
  11: {
    energy: "Justice and balance. A karmic month — you get exactly what you've earned. Legal matters get resolved. Honesty is the only strategy. Inner balance through moderation.",
    sphere: {
      money: "Balancing the budget. Debts come back (both to you and from you). Fair pay for work.",
      career: "Assessment of results. Promotion or adjustment of position. Legal aspects of work.",
      rel: "An honest conversation about needs. Who's right and who's wrong — it will become clear. Accept the truth.",
      health: "Hormonal balance. Symmetrical loads. Posture and spine.",
      inner: "A search for inner balance. What outweighs — work or life? Time to adjust.",
    },
    practice: "Pay off all debts. An honest conversation with loved ones. A balance of work and rest. Yoga.",
  },
  12: {
    energy: "The Hanged Man flips your usual view. A month of sacrifice and transformation. The familiar may turn out to be an illusion. The energy slows everything down. A forced pause — don't resist it.",
    sphere: {
      money: "Stagnation in finances. Don't force it. Re-evaluate your priorities. What are you ready to give for the new?",
      career: "A pause in your career. Projects may stall. This is not the end — it's a rethinking. Use the time for reflection.",
      rel: "Sacrifice in the relationship. But don't sacrifice yourself thoughtlessly. Check: is this love or dependence?",
      health: "The lymphatic system. Fluid stagnation. Movement and cleansing are essential.",
      inner: "The world has 'turned upside down'. Old values are being reconsidered. Accept the 'suspended' state — it's temporary.",
    },
    practice: "Accept the pause. Cleansing of the body and space. Volunteering. Re-evaluating priorities.",
  },
  13: {
    energy: "Death — a radical transformation. The completion of what has outlived itself. Don't hold on to the dead. Old habits, relationships, projects come to an end. Painful, but necessary.",
    sphere: {
      money: "Old income sources may dry up. Don't panic — new ones will open. A transition period.",
      career: "Dismissal, a change of direction, closing a project. This is not a loss — it's liberation.",
      rel: "The ending of a relationship or its radical transformation. Let go of what doesn't grow.",
      health: "Immunity. Detox. The body reacts to transformation. A gentle cleanse.",
      inner: "Fear of change. But change is inevitable. Let the old die so the new can be born.",
    },
    practice: "A life audit: what doesn't work? Let go consciously. Detox. Working with fear.",
  },
  14: {
    energy: "Temperance brings balance and harmony. After the turbulence — the integration of experience. Extremes are punished, balance is rewarded. The golden mean in everything.",
    sphere: {
      money: "Moderate spending, moderate income. Stability through balance. Don't take risks — save.",
      career: "A steady pace. Don't rush forward, but don't stop either. Optimizing processes.",
      rel: "Compromises and concessions. Balance in the couple. Don't pull the blanket your way.",
      health: "Metabolism. Start a healthy regimen — without fanaticism, but consistently.",
      inner: "Calm after the storm. The integration of experience. Gratitude for what you've been through.",
    },
    practice: "Start a healthy regimen. A meditation on balance. A compromise in one conflict. Moderation in food.",
  },
  15: {
    energy: "The Devil exposes addictions, fears and shadow sides. A month of temptations and tests. Seductions at every step. Your task is to see your chains and decide whether you're ready to remove them.",
    sphere: {
      money: "The temptation of fast money. Gambling, risky deals. Check everything twice. Fraudsters are active.",
      career: "Toxic colleagues or management. Manipulation at work. Don't give in. Hold your boundaries.",
      rel: "Passion and dependence. Toxic relationships intensify. Honestly ask: is this love or attachment?",
      health: "Addictions: alcohol, food, gadgets. Become aware and limit them. Adrenal glands and stress hormones.",
      inner: "A meeting with the shadow. Fears come to the surface. This is not punishment — it's an opportunity for healing.",
    },
    practice: "Give up one addiction for a month. An honest look at your fears. Therapy or a support group.",
  },
  16: {
    energy: "The Tower destroys everything inauthentic. Sudden changes, crises, shock. But only what stood on a false foundation is destroyed. The true endures. It's painful, but it liberates.",
    sphere: {
      money: "Financial upheavals. Unexpected expenses. The collapse of a project. But the new grows from the ruins.",
      career: "Dismissal, conflict, the breakdown of a project. Don't cling. The new will be better.",
      rel: "A breakup or crisis. The truth comes out. Lies are destroyed. If the relationship is real — it will endure.",
      health: "Stress, adrenaline, injuries. Take care of yourself. Don't make decisions in panic.",
      inner: "Shock and confusion. But behind the destruction — freedom. Accept what's happening. Later you'll understand why.",
    },
    practice: "Build a safety cushion. Don't make decisions in the first 48 hours after a shock. Breathe. Support from loved ones.",
  },
  17: {
    energy: "The Star brings hope and inspiration. After the destruction of the Tower — light at the end of the tunnel. A month of dreaming, visualization and faith in the best. The Universe supports your dreams.",
    sphere: {
      money: "Money through creativity and inspiration. Unexpected help. Charity returns a hundredfold.",
      career: "New inspiration. Creative ideas. Work that follows your calling. Don't be afraid to dream big.",
      rel: "Hope in the relationship. Healing after a crisis. New acquaintances through inspiration.",
      health: "Immunity strengthens. Water procedures. Nature. Astrology and alternative practices.",
      inner: "Faith and hope. Dreams take shape. Visualization works. Gratitude toward the world.",
    },
    practice: "Visualization of a dream (15 minutes). A gratitude journal. Time by the water. Help someone.",
  },
  18: {
    energy: "The Moon immerses you in the world of the subconscious, illusions and fears. A month of vagueness, when reality mixes with fantasy. Don't trust first impressions. Check everything twice. Dreams are especially significant.",
    sphere: {
      money: "Financial illusions. Don't invest in what's 'too good to be true'. Fraud.",
      career: "Vagueness at work. Intrigues and rumors. Don't take part. Wait for the fog to clear.",
      rel: "Mysteries, secrets, jealousy. Fears in the relationship. Don't second-guess — ask.",
      health: "The psyche, sleep, phobias. Sleepwalking. Panic attacks. Working with the subconscious through therapy.",
      inner: "Fears and anxiety. The subconscious speaks louder than usual. Listen, but don't give in to panic.",
    },
    practice: "A dream journal. Minimal decisions. Check information. Therapy for fears. Lunar rituals.",
  },
  19: {
    energy: "The Sun illuminates everything. A month of joy, success and clarity. Energy at its peak. Everything is visible, everything is clear. A time for action with an open visor. Childlike joy and play. The best month for important steps.",
    sphere: {
      money: "Financial success. Generosity is rewarded. Money comes through joy and enthusiasm.",
      career: "Recognition, awards, advancement. You're in the spotlight. Make the most of it.",
      rel: "Joy in the relationship. Playfulness and lightness. Children (a birth or important events with children).",
      health: "Vitamin D. The sun. Energy through movement and joy. The best health of the year.",
      inner: "The joy of life. Clarity of thought. Optimism. Share your joy — it multiplies.",
    },
    practice: "Spend time in the sun. Do what brings you joy. Play. Be generous.",
  },
  20: {
    energy: "Judgement calls for re-evaluation. This is a month of awakening, when the past returns for final resolution. Karma manifests. Forgiveness and letting go are the key themes.",
    sphere: {
      money: "Karmic debts — give and receive. Old affairs come to a close. An inheritance or the return of debts.",
      career: "A return to a past project. A second chance. An assessment of the path traveled. A new calling.",
      rel: "People returning from the past. Forgiving old grievances. Restoring connections. Karmic lessons.",
      health: "Hereditary illnesses. Prevention. A health check. Genetic tests.",
      inner: "Awakening. A 'call' to change. A feeling that it's time to change something radically.",
    },
    practice: "Write a letter of forgiveness (don't send it). Check your health. Complete one old matter. A meditation on forgiveness.",
  },
  21: {
    energy: "The World completes the cycle. A month of taking stock, gratitude and completion. Everything falls into place. Harmony and wholeness. Ideal for travel and broadening horizons.",
    sphere: {
      money: "The completion of financial affairs. Balance. International projects. Travel as an investment.",
      career: "The completion of a major project. International recognition. Expansion. Results.",
      rel: "Harmony and wholeness. Accepting your partner fully. The feeling of 'we are one whole'.",
      health: "Holistic health. The balance of all systems. Travel heals.",
      inner: "A sense of completion. Peace of mind. Gratitude for the path traveled.",
    },
    practice: "Take stock. Give thanks. Travel. Complete the incomplete. Celebrate.",
  },
  22: {
    energy: "The Fool opens everything anew. A month of unpredictability, spontaneity and leaps into the unknown. No rules, no plan — only trust in the Universe. It can be brilliant or reckless.",
    sphere: {
      money: "Unpredictable finances. A risk may pay off, or it may not. Don't stake your last.",
      career: "Unexpected turns. A change of direction. A gamble can become a breakthrough.",
      rel: "Spontaneity and unpredictability. Flirtation and lightness. But serious commitments — not now.",
      health: "Injuries from carelessness. Allergies. The nervous system. Be attentive.",
      inner: "Childlike spontaneity. Freedom from conventions. But don't confuse freedom with irresponsibility.",
    },
    practice: "Do something for the first time. Be spontaneous. But have a safety cushion. Laugh more.",
  },
};

const deepES: Record<number, MonthDeep> = {
  1: {
    energy: "La energía del Mago trae este mes un poderoso impulso para empezar algo nuevo. Sientes que puedes influir en la realidad con tus decisiones y acciones. La energía intelectual está al máximo: úsala para planificar, negociar, aprender. El Mago da la sensación de 'puedo con todo', pero es importante no dispersarse. Elige una dirección principal y vuelca en ella toda tu fuerza de intención. Tus palabras adquieren en este periodo una fuerza materializadora especial: ten cuidado con las actitudes negativas y las quejas.",
    sphere: {
      money: "El flujo financiero se abre a través de nuevas ideas y proyectos. Las viejas fuentes de ingresos pueden debilitarse: es normal, se libera espacio para lo nuevo. Invierte en formación y herramientas. No esperes un retorno inmediato: este mes va de sembrar.",
      career: "Momento de mostrar iniciativa. Propón un nuevo proyecto, asume responsabilidad. La dirección notará tu actividad. Si llevas tiempo pensando en cambiar de trabajo, es un buen momento para los primeros pasos.",
      rel: "Las relaciones cobran vida, pero pueden estar tensas: estás cambiando y tu pareja necesita tiempo para aceptarlo. Los nuevos encuentros son significativos. Sé abierto, pero no insistente.",
      health: "La cabeza y el sistema nervioso requieren atención. Una alta carga mental puede provocar migrañas. La meditación y las prácticas de respiración son tu recurso.",
      inner: "Dentro de ti pueden luchar la euforia por las oportunidades y el miedo a lo desconocido. Acepta esa dualidad. Lleva un diario de ideas: te serán útiles.",
    },
    practice: "Afirmación matutina: 'Creo mi realidad con conciencia'. 10 minutos de visualización de metas. Un diario de ideas por la noche.",
  },
  2: {
    energy: "La energía de la Sacerdotisa frena el ritmo del mes y te dirige hacia dentro. No es momento de acciones agresivas: es momento de observación, análisis y comprensión intuitiva. Confía en los sueños, las señales y la voz interior. La información llega no por la lógica, sino por el sentir. Puedes 'saber' algo sin entender de dónde viene. Anota tus intuiciones. La energía femenina se intensifica: para las mujeres es un tiempo de tomar conciencia de su profundidad; para los hombres, de encontrarse con el ánima y desarrollar la intuición.",
    sphere: {
      money: "No es momento de grandes decisiones financieras. El dinero llega en silencio, a través de pistas intuitivas y coincidencias 'casuales'. Revisa el presupuesto. Son posibles gastos ocultos: revisa las cuentas.",
      career: "Mejor posponer las decisiones profesionales. Observa, reúne información, analiza. Lo que veas en el silencio te ayudará a decidir bien más adelante.",
      rel: "Las relaciones se vuelven más profundas, pero más silenciosas. La comunicación superficial cansa. Busca a quienes puedas hablar de lo importante. Son posibles secretos o la revelación de secretos.",
      health: "El sistema linfático, el equilibrio hídrico, el plano hormonal. Más agua, menos estimulantes. El sueño es tu medicina.",
      inner: "Sensibilidad agudizada. Absorbes las emociones de quienes te rodean como una esponja. Protege tu espacio. El silencio es tu recurso.",
    },
    practice: "Un diario de sueños cada mañana. 15 minutos de meditación en silencio. Un paseo junto al agua. Mínimo de redes sociales.",
  },
  3: {
    energy: "La Emperatriz llena el mes de energía de abundancia, belleza y creatividad. Todo florece: las relaciones, las finanzas, el cuerpo. Atraes recursos y personas. El mundo es generoso contigo. La energía creativa está al máximo: hasta las tareas rutinarias se convierten en arte. La sexualidad y el magnetismo se intensifican. Para las mujeres, un tiempo de poder femenino y atractivo. Para los hombres, un tiempo de encontrar una musa o fortalecer la relación con la pareja. La naturaleza y la belleza te recargan.",
    sphere: {
      money: "El dinero llega más fácil de lo habitual. Son posibles regalos, bonificaciones, ingresos inesperados. Pero controla los gastos: la Emperatriz tienta con compras 'bonitas'.",
      career: "Los proyectos creativos prosperan. Diseño, marketing, relaciones públicas son tus fuertes este mes. La belleza y la estética dan dinero.",
      rel: "El romance y la sensualidad están al máximo. Para las parejas, renovación de los sentimientos. Para los solteros, mayor atractivo y nuevos encuentros.",
      health: "El cuerpo responde al cuidado. Masaje, spa, cuidado de la piel. No te excedas con la comida: a la Emperatriz le gusta disfrutar, pero el cuerpo tiene límites.",
      inner: "Una sensación de plenitud de vida. Gratitud hacia el mundo. Pero es posible la pereza: la abundancia relaja. No pierdas el foco.",
    },
    practice: "Empieza la mañana con gratitud (5 cosas). Pasa tiempo en la naturaleza. Haz algo creativo. Mima tu cuerpo.",
  },
  4: {
    energy: "El Emperador trae estructura, orden y disciplina. El caos debe tomar forma. Crea sistemas, pon orden, planifica. Es un mes para decisiones serias: comprar un inmueble, firmar contratos, tramitar documentos. Todo lo ligado a los cimientos funciona. En el trabajo pueden notarte como líder. Asume la responsabilidad, pero delega. En las relaciones, momento de pasos concretos.",
    sphere: {
      money: "Estabilidad a través del sistema. Haz un presupuesto, planifica los gastos. Los inmuebles son una buena inversión. El dinero llega por la organización.",
      career: "Un ascenso o una ampliación de obligaciones. Una posición directiva. Crear un plan de negocio. Los asuntos legales se resuelven.",
      rel: "Pasos concretos: vivienda compartida, presupuesto común, planes de futuro. Pero no seas un tirano: el control destruye la cercanía.",
      health: "Columna, huesos, articulaciones. Entrenamientos estructurales (pilates, yoga). Una rutina regular es tu medicina.",
      inner: "Una necesidad de control y orden. Pero el control excesivo es un camino hacia la ansiedad. Aprende a confiar en el proceso.",
    },
    practice: "Haz un plan para el mes. Pon orden en tus documentos. 30 minutos de actividad física. Delega una tarea.",
  },
  5: {
    energy: "El Sumo Sacerdote trae sabiduría y aprendizaje. Es un mes para adquirir conocimiento, buscar sentido y transmitir experiencia. Los maestros y mentores juegan un papel clave. Las relaciones se ponen a prueba por los valores. Las tradiciones y la espiritualidad pasan a primer plano. Son posibles exámenes importantes, certificaciones, formación.",
    sphere: {
      money: "Ingresos a través de la experiencia y el conocimiento. La inversión en educación se amortiza. La consultoría y la enseñanza son fuentes de ingresos.",
      career: "Aprendizaje, cursos, mentoría. Si eres un experto, comparte tu conocimiento. Lanza cursos, escribe artículos.",
      rel: "Una prueba de valores: ¿coinciden tus principios con los de tu pareja? Conversaciones profundas sobre el sentido de la vida.",
      health: "Garganta, tiroides. Canta, di la verdad, exprésate. Infusiones de hierbas.",
      inner: "Una búsqueda de sentido. Prácticas espirituales. Pero no caigas en el fanatismo: equilibrio entre tradición y novedad.",
    },
    practice: "Lee un libro que lleva tiempo esperando. Busca un mentor. Apúntate a un curso. Comparte conocimiento con alguien.",
  },
  6: {
    energy: "Los Enamorados te ponen ante una elección. La energía amorosa está al máximo. Nuevos encuentros, citas románticas, renovación de los sentimientos. Pero los Enamorados no van solo de romance, sino de responsabilidad por tu elección. Cada decisión de este mes tiene consecuencias a largo plazo. No pospongas la elección, pero tampoco te apresures bajo presión.",
    sphere: {
      money: "Una elección entre inversiones, proyectos. No intentes estar en dos sitios a la vez. Un negocio en sociedad puede tener éxito.",
      career: "Una elección de dirección. Ofertas de la competencia. Decisiones sobre proyectos conjuntos. Confía en el corazón, pero verifica con los hechos.",
      rel: "El pico de la energía romántica. Un nuevo amor o la renovación de una relación existente. Es posible un triángulo amoroso.",
      health: "Corazón y vasos sanguíneos. Cardio en dosis moderadas. La salud emocional importa más que la física.",
      inner: "Una lucha entre el 'quiero' y el 'debo'. Aprende a oír ambas voces. Una elección no es una pérdida, sino una conquista.",
    },
    practice: "Anota todas las opciones y sus consecuencias. Habla con alguien de confianza. Toma una decisión y no mires atrás.",
  },
  7: {
    energy: "El Carro porta movimiento y velocidad. Un mes activo para la acción: mudanzas, viajes, lanzamientos. Brío y ganas de 'tomar por asalto' cualquier meta. La energía requiere control y dirección. Sin plan, la velocidad se convierte en caos. Con plan, en victoria.",
    sphere: {
      money: "Crecimiento activo de ingresos. Primas, bonificaciones. Dinero por la velocidad y la competencia. No te quemes.",
      career: "Resultados rápidos. La competencia es tu motivador. Avance a través de la acción. Pero cuida la calidad.",
      rel: "Dinamismo en la relación. Los viajes juntos fortalecen el vínculo. Puede haber impaciencia e irritabilidad.",
      health: "El sistema muscular, la adrenalina. El deporte es obligatorio: el cuerpo necesita una salida para la energía. El riesgo de lesiones es mayor.",
      inner: "Emoción y brío. Pero en la velocidad puedes perder el sentido. Una vez por semana, detente y pregúntate: '¿Por qué corro?'",
    },
    practice: "Un plan de acción claro. Deporte cada día. Un viaje o una salida. Por la noche, 10 minutos de silencio.",
  },
  8: {
    energy: "La Justicia/la Fuerza trae equilibrio kármico. Recibes exactamente lo que has merecido. Los asuntos legales se resuelven. La honestidad se recompensa. Un mes de prueba de resistencia: con paciencia, no con agresión. Los documentos y contratos están en foco.",
    sphere: {
      money: "Un equilibrio de ingresos y gastos. Salda las deudas. Los tratos honestos dan beneficio. Los deshonestos se castigan.",
      career: "Asuntos legales en la carrera. Defensa de tus derechos. Reconocimiento justo de tu trabajo. Contratos y acuerdos.",
      rel: "Una resolución justa de los conflictos. Relaciones kármicas: lecciones del pasado. Honestidad en los sentimientos.",
      health: "Dientes, huesos, articulaciones. El estrés legal puede afectar la salud. Controla la ira.",
      inner: "Un tribunal interior: la evaluación de las decisiones pasadas. Sé justo contigo mismo. El perdón es un recurso poderoso.",
    },
    practice: "Resuelve los asuntos legales. Salda las deudas. La práctica del perdón. Entrenamiento de fuerza.",
  },
  9: {
    energy: "El Ermitaño te dirige hacia dentro. Un mes de autoanálisis y soledad. El ruido cansa. La información llega en el silencio. Intuiciones importantes sobre la vida que pueden cambiar tu rumbo. El minimalismo funciona mejor que la expansión.",
    sphere: {
      money: "Reduce los gastos, revisa el presupuesto. Ingresos por la experiencia profunda, no por el volumen. Consultoría individual.",
      career: "No empieces nada nuevo. Profundiza lo actual. Análisis y reflexión. Trabajo científico o de investigación.",
      rel: "Necesidad de soledad. La pareja puede ofenderse. Explica que no es rechazo, sino una necesidad de silencio.",
      health: "El sistema nervioso. Paseos por la naturaleza. Meditación. Mínimo de estimulantes.",
      inner: "Autoanálisis profundo. Preguntas como '¿quién soy?' y '¿adónde voy?'. El silencio da respuestas que no se hallan en el ruido.",
    },
    practice: "Reserva tiempo para la soledad. Lee. Medita. Lleva un diario de reflexiones. Paseos por la naturaleza.",
  },
  10: {
    energy: "La Rueda de la Fortuna gira. Giros inesperados, tanto buenos como difíciles. Prepárate para las sorpresas. Los acontecimientos se desarrollan con rapidez. Encuentros kármicos, personas que regresan del pasado.",
    sphere: {
      money: "Finanzas impredecibles. Ingresos y gastos inesperados. Ten un colchón de seguridad.",
      career: "Cambios repentinos: ascenso o despido. Un cambio de dirección. Nuevas oportunidades de la nada.",
      rel: "Encuentros kármicos. Personas que regresan del pasado. Conocidos decisivos. Prepárate para las sorpresas.",
      health: "Estrés por la incertidumbre. Adaptógenos, técnicas de respiración. No te aferres al control.",
      inner: "Una montaña rusa de emociones. Aprende a aceptar la incertidumbre. Confía en el proceso.",
    },
    practice: "Una reserva financiera. Flexibilidad en los planes. Afirmación: 'Acepto lo que llega'. No te resistas a la corriente.",
  },
  11: {
    energy: "Justicia y equilibrio. Un mes kármico: recibes exactamente lo que has merecido. Los asuntos legales se resuelven. La honestidad es la única estrategia. Equilibrio interior a través de la moderación.",
    sphere: {
      money: "Equilibrio del presupuesto. Las deudas vuelven (a ti y de ti). Pago justo por el trabajo.",
      career: "Evaluación de resultados. Ascenso o ajuste de la posición. Aspectos legales del trabajo.",
      rel: "Una conversación honesta sobre las necesidades. Quién tiene razón y quién no, se aclarará. Acepta la verdad.",
      health: "Equilibrio hormonal. Cargas simétricas. Postura y columna.",
      inner: "Una búsqueda del equilibrio interior. ¿Qué pesa más, el trabajo o la vida? Momento de corregir.",
    },
    practice: "Salda todas las deudas. Una conversación honesta con los seres queridos. Equilibrio entre trabajo y descanso. Yoga.",
  },
  12: {
    energy: "El Colgado da la vuelta a tu mirada habitual. Un mes de sacrificio y transformación. Lo habitual puede resultar una ilusión. La energía lo ralentiza todo. Una pausa forzosa: no te resistas.",
    sphere: {
      money: "Estancamiento en las finanzas. No fuerces. Reconsidera las prioridades. ¿Qué estás dispuesto a entregar por lo nuevo?",
      career: "Una pausa en la carrera. Los proyectos pueden estancarse. No es el final: es un replanteamiento. Aprovecha el tiempo para reflexionar.",
      rel: "Sacrificio en la relación. Pero no te sacrifiques sin pensar. Comprueba: ¿es amor o dependencia?",
      health: "El sistema linfático. Estancamiento de líquidos. El movimiento y la purificación son obligatorios.",
      inner: "El mundo se ha 'puesto del revés'. Los viejos valores se reconsideran. Acepta el estado 'suspendido': es temporal.",
    },
    practice: "Acepta la pausa. Purificación del cuerpo y del espacio. Voluntariado. Reevaluación de prioridades.",
  },
  13: {
    energy: "La Muerte: una transformación radical. El cierre de lo que se ha agotado. No te aferres a lo muerto. Viejos hábitos, relaciones, proyectos llegan a su fin. Doloroso, pero necesario.",
    sphere: {
      money: "Las viejas fuentes de ingresos pueden agotarse. No entres en pánico: se abrirán nuevas. Un periodo de transición.",
      career: "Despido, cambio de dirección, cierre de un proyecto. No es una pérdida: es una liberación.",
      rel: "El final de una relación o su transformación radical. Suelta lo que no crece.",
      health: "Inmunidad. Detox. El cuerpo reacciona a la transformación. Una limpieza suave.",
      inner: "Miedo al cambio. Pero el cambio es inevitable. Deja morir lo viejo para que nazca lo nuevo.",
    },
    practice: "Una revisión de tu vida: ¿qué no funciona? Suelta con conciencia. Detox. Trabajo con el miedo.",
  },
  14: {
    energy: "La Templanza trae equilibrio y armonía. Tras la turbulencia, la integración de la experiencia. Los extremos se castigan, el equilibrio se recompensa. El justo medio en todo.",
    sphere: {
      money: "Gastos moderados, ingresos moderados. Estabilidad a través del equilibrio. No te arriesgues: ahorra.",
      career: "Un ritmo uniforme. No te lances hacia delante, pero tampoco te detengas. Optimización de procesos.",
      rel: "Compromisos y concesiones. Equilibrio en la pareja. No arrimes el ascua a tu sardina.",
      health: "Metabolismo. Empieza un régimen saludable, sin fanatismo pero con constancia.",
      inner: "Calma tras la tormenta. La integración de la experiencia. Gratitud por lo vivido.",
    },
    practice: "Empieza un régimen saludable. Una meditación sobre el equilibrio. Un compromiso en un conflicto. Moderación en la comida.",
  },
  15: {
    energy: "El Diablo desnuda las adicciones, los miedos y los lados oscuros. Un mes de tentaciones y pruebas. Seducciones a cada paso. Tu tarea es ver tus cadenas y decidir si estás dispuesto a quitártelas.",
    sphere: {
      money: "La tentación del dinero fácil. Juegos de azar, tratos arriesgados. Verifícalo todo dos veces. Los estafadores están activos.",
      career: "Colegas o jefes tóxicos. Manipulaciones en el trabajo. No cedas. Mantén los límites.",
      rel: "Pasión y dependencia. Las relaciones tóxicas se agudizan. Pregúntate con honestidad: ¿es amor o apego?",
      health: "Adicciones: alcohol, comida, dispositivos. Toma conciencia y limítalas. Glándulas suprarrenales y hormonas del estrés.",
      inner: "Un encuentro con la sombra. Los miedos salen a la superficie. No es un castigo: es una oportunidad de sanación.",
    },
    practice: "Renuncia a una adicción durante un mes. Una mirada honesta a tus miedos. Terapia o grupo de apoyo.",
  },
  16: {
    energy: "La Torre destruye todo lo inauténtico. Cambios repentinos, crisis, shock. Pero solo se destruye lo que se apoyaba en un cimiento falso. Lo verdadero resiste. Es doloroso, pero libera.",
    sphere: {
      money: "Sacudidas financieras. Gastos inesperados. El colapso de un proyecto. Pero de las ruinas crece lo nuevo.",
      career: "Despido, conflicto, desmoronamiento de un proyecto. No te aferres. Lo nuevo será mejor.",
      rel: "Una ruptura o crisis. La verdad sale a la luz. La mentira se destruye. Si la relación es real, resistirá.",
      health: "Estrés, adrenalina, lesiones. Cuídate. No tomes decisiones en pánico.",
      inner: "Shock y desconcierto. Pero tras la destrucción está la libertad. Acepta lo que ocurre. Después entenderás por qué.",
    },
    practice: "Crea un colchón de seguridad. No tomes decisiones en las primeras 48 horas tras un shock. Respira. El apoyo de los seres queridos.",
  },
  17: {
    energy: "La Estrella trae esperanza e inspiración. Tras la destrucción de la Torre, luz al final del túnel. Un mes de soñar, visualizar y creer en lo mejor. El Universo apoya tus sueños.",
    sphere: {
      money: "Dinero a través de la creatividad y la inspiración. Ayuda inesperada. La beneficencia vuelve con creces.",
      career: "Nueva inspiración. Ideas creativas. Trabajo según tu vocación. No temas soñar a lo grande.",
      rel: "Esperanza en la relación. Sanación tras una crisis. Nuevos encuentros por inspiración.",
      health: "La inmunidad se fortalece. Tratamientos con agua. La naturaleza. Astrología y prácticas alternativas.",
      inner: "Fe y esperanza. Los sueños toman forma. La visualización funciona. Gratitud hacia el mundo.",
    },
    practice: "Visualización de un sueño (15 minutos). Un diario de gratitud. Tiempo junto al agua. Ayuda a alguien.",
  },
  18: {
    energy: "La Luna te sumerge en el mundo del subconsciente, las ilusiones y los miedos. Un mes de imprecisión, en que la realidad se mezcla con la fantasía. No te fíes de la primera impresión. Verifícalo todo dos veces. Los sueños son especialmente significativos.",
    sphere: {
      money: "Ilusiones financieras. No inviertas en lo que es 'demasiado bueno para ser verdad'. Fraude.",
      career: "Imprecisión en el trabajo. Intrigas y rumores. No participes. Espera a que se disipe la niebla.",
      rel: "Misterios, secretos, celos. Miedos en la relación. No supongas: pregunta.",
      health: "La psique, el sueño, las fobias. Sonambulismo. Ataques de pánico. Trabajo con el subconsciente mediante terapia.",
      inner: "Miedos y ansiedad. El subconsciente habla más alto de lo habitual. Escucha, pero no cedas al pánico.",
    },
    practice: "Un diario de sueños. Mínimo de decisiones. Verifica la información. Terapia para los miedos. Rituales lunares.",
  },
  19: {
    energy: "El Sol lo ilumina todo. Un mes de alegría, éxito y claridad. La energía está al máximo. Todo se ve, todo se entiende. Un tiempo para actuar a cara descubierta. Alegría infantil y juego. El mejor mes para pasos importantes.",
    sphere: {
      money: "Éxito financiero. La generosidad se recompensa. El dinero llega a través de la alegría y el entusiasmo.",
      career: "Reconocimiento, premios, avance. Estás en el centro de atención. Aprovéchalo al máximo.",
      rel: "Alegría en la relación. Picardía y ligereza. Hijos (un nacimiento o acontecimientos importantes con los hijos).",
      health: "Vitamina D. El sol. Energía a través del movimiento y la alegría. La mejor salud del año.",
      inner: "La alegría de vivir. Claridad de pensamiento. Optimismo. Comparte tu alegría: se multiplica.",
    },
    practice: "Pasa tiempo al sol. Haz lo que te da alegría. Juega. Sé generoso.",
  },
  20: {
    energy: "El Juicio llama a la reevaluación. Es un mes de despertar, en que el pasado regresa para su resolución definitiva. El karma se manifiesta. El perdón y el soltar son los temas clave.",
    sphere: {
      money: "Deudas kármicas: da y recibe. Los viejos asuntos se cierran. Una herencia o la devolución de deudas.",
      career: "Un regreso a un proyecto pasado. Una segunda oportunidad. La evaluación del camino recorrido. Una nueva vocación.",
      rel: "El regreso de personas del pasado. Perdonar viejos rencores. Restaurar vínculos. Lecciones kármicas.",
      health: "Enfermedades hereditarias. Prevención. Una revisión de salud. Pruebas genéticas.",
      inner: "Despertar. Una 'llamada' al cambio. La sensación de que es hora de cambiar algo radicalmente.",
    },
    practice: "Escribe una carta de perdón (no la envíes). Revisa tu salud. Cierra un asunto antiguo. Una meditación sobre el perdón.",
  },
  21: {
    energy: "El Mundo cierra el ciclo. Un mes de balance, gratitud y cierre. Todo se pone en su sitio. Armonía y plenitud. Ideal para viajar y ampliar horizontes.",
    sphere: {
      money: "El cierre de los asuntos financieros. Equilibrio. Proyectos internacionales. Los viajes como inversión.",
      career: "El cierre de un gran proyecto. Reconocimiento internacional. Expansión. Resultados.",
      rel: "Armonía y plenitud. Aceptar a la pareja por completo. La sensación de 'somos un solo todo'.",
      health: "Salud integral. El equilibrio de todos los sistemas. Los viajes sanan.",
      inner: "Una sensación de plenitud. Paz en el alma. Gratitud por el camino recorrido.",
    },
    practice: "Haz balance. Agradece. Viaja. Cierra lo inacabado. Celebra.",
  },
  22: {
    energy: "El Loco lo abre todo de nuevo. Un mes de imprevisibilidad, espontaneidad y saltos a lo desconocido. Sin reglas, sin plan: solo confianza en el Universo. Puede ser genial o temerario.",
    sphere: {
      money: "Finanzas impredecibles. Un riesgo puede rentabilizarse, o no. No te juegues lo último.",
      career: "Giros inesperados. Un cambio de dirección. Una aventura puede convertirse en un avance.",
      rel: "Espontaneidad e imprevisibilidad. Coqueteo y ligereza. Pero los compromisos serios, ahora no.",
      health: "Lesiones por descuido. Alergias. El sistema nervioso. Mantente atento.",
      inner: "Espontaneidad infantil. Libertad de las convenciones. Pero no confundas la libertad con la irresponsabilidad.",
    },
    practice: "Haz algo por primera vez. Sé espontáneo. Pero ten un colchón de seguridad. Ríe más.",
  },
};

export function getMonthProLocalized(
  yearArcana: number,
  monthArcana: number,
  resultArcana: number,
  monthName: string,
  targetYear: number,
  lang: string
): MonthProInterpretation | null {
  if (lang !== 'en' && lang !== 'es') return null;
  const L = lang as Lang;
  const deep = L === 'en' ? deepEN : deepES;
  const yearData = deep[yearArcana] || deep[1];
  const monthData = deep[monthArcana] || deep[1];
  const resultData = deep[resultArcana] || deep[1];

  const fallbackName = (n: number) => (L === 'en' ? `Arcana ${n}` : `Arcano ${n}`);
  const yearArcanaName = getArcana(yearArcana)?.name || fallbackName(yearArcana);
  const monthArcanaName = getArcana(monthArcana)?.name || fallbackName(monthArcana);
  const resultArcanaName = getArcana(resultArcana)?.name || fallbackName(resultArcana);

  const isHarmonious = Math.abs(yearArcana - monthArcana) <= 5 || Math.abs(yearArcana - monthArcana) >= 17;

  if (L === 'en') {
    return {
      yearEnergyAnalysis: `Background energy of the year — ${yearArcanaName} (${yearArcana}). ${yearData.energy}`,
      monthEnergyAnalysis: `Energy of ${monthName} — ${monthArcanaName} (${monthArcana}). ${monthData.energy}`,
      resultEnergyAnalysis: `Resulting energy of the month — ${resultArcanaName} (${resultArcana}). ${resultData.energy}`,
      synergy: isHarmonious
        ? `The energies of the year (${yearArcanaName}) and the month (${monthArcanaName}) harmoniously complement each other. The result (${resultArcanaName}) reinforces both energies. This is a favorable month, when the background and current energies work in the same direction. Use this harmony to advance key projects.`
        : `The energies of the year (${yearArcanaName}) and the month (${monthArcanaName}) create tension. The result (${resultArcanaName}) is a compromise between two opposing forces. You'll need to find a balance between the background energy of the year and the current energy of the month. This requires flexibility and awareness.`,
      conflicts: isHarmonious
        ? `The main conflict of this month is the risk of relaxing because of the apparent ease. When everything fits harmoniously, it's easy to miss important details or postpone serious decisions. Don't let comfort become a trap.`
        : `The main conflict is between what the year's energy requires and what the month's energy dictates. ${yearArcanaName} pulls one way, ${monthArcanaName} another. Your task is not to choose one side but to find integration. The resulting ${resultArcanaName} suggests the path.`,
      money: resultData.sphere.money,
      career: resultData.sphere.career,
      relationships: resultData.sphere.rel,
      health: resultData.sphere.health,
      innerState: resultData.sphere.inner,
      firstWeek: `First week of ${monthName}: Adapting to the new energy. The energy of ${monthArcanaName} begins to manifest, but is still weak. Use this time for planning and tuning. Don't make big decisions — let yourself 'enter' the month.`,
      secondWeek: `Second week: The main energy of ${monthArcanaName} gathers strength. This is a time for active deeds in the key areas. ${resultData.sphere.career.split('.')[0]}. Focus on your priorities.`,
      thirdWeek: `Third week: The peak of the month's energy. The resulting energy of ${resultArcanaName} manifests at its fullest. The best time for important negotiations, deals, decisions. Everything you do now has maximum effect.`,
      fourthWeek: `Fourth week: Completion and preparation for the transition. The energy of ${monthArcanaName} weakens. Complete what you started, take stock. Don't start anything new — leave it for the next month.`,
      toDo: [
        `Tune into the energy of ${resultArcanaName} — it defines your strategy for the month`,
        resultData.practice,
        `Pay attention to the area of ${isHarmonious ? 'your career — the harmony of energies gives a chance for a breakthrough' : 'your health — the conflict of energies can hit your well-being'}`,
        `Keep an observation journal — note how the energy of ${resultArcanaName} manifests`,
        `Practice awareness: every evening note 3 manifestations of the day's energy`,
        `Strengthen your relationships — ${resultData.sphere.rel.split('.')[0]}`,
      ],
      toAvoid: [
        `Don't ignore the body's signals — the energy of ${resultArcanaName} can overload you`,
        `Don't make decisions in the first 3 days of the month — let the energy settle`,
        `Don't quarrel with loved ones in the third week — the energy is at its peak and conflicts escalate`,
        `Don't plan large purchases in the last week — the energy is already waning`,
        `Don't resist the natural flow — if the month slows down, accept the pause`,
      ],
      dailyPractice: resultData.practice,
      mainMessage: `This month is ${isHarmonious ? 'an opportunity for growth and blossoming' : 'a challenge and a lesson'}. The energy of ${resultArcanaName} teaches you to ${isHarmonious ? 'use the tailwind to maximum effect' : 'find strength in difficulties and wisdom in conflicts'}. Remember: every month is a micro-cycle within the larger annual cycle. What you live through now will affect all the remaining time of the year.`,
      keyDays: `Key days of the month: ${monthName} 1–3 (tuning), ${monthName} ${Math.min(resultArcana, 28)} (energy peak), the last 2 days (completion and reflection). Special attention — the ${resultArcana}th: on this day the arcana's energy manifests at its fullest.`,
    };
  }

  // ES
  return {
    yearEnergyAnalysis: `Energía de fondo del año: ${yearArcanaName} (${yearArcana}). ${yearData.energy}`,
    monthEnergyAnalysis: `Energía de ${monthName}: ${monthArcanaName} (${monthArcana}). ${monthData.energy}`,
    resultEnergyAnalysis: `Energía resultante del mes: ${resultArcanaName} (${resultArcana}). ${resultData.energy}`,
    synergy: isHarmonious
      ? `Las energías del año (${yearArcanaName}) y del mes (${monthArcanaName}) se complementan en armonía. El resultado (${resultArcanaName}) refuerza ambas energías. Es un mes favorable, en el que la energía de fondo y la actual trabajan en la misma dirección. Aprovecha esta armonía para impulsar los proyectos clave.`
      : `Las energías del año (${yearArcanaName}) y del mes (${monthArcanaName}) crean tensión. El resultado (${resultArcanaName}) es un compromiso entre dos fuerzas opuestas. Tendrás que hallar un equilibrio entre la energía de fondo del año y la energía actual del mes. Esto requiere flexibilidad y conciencia.`,
    conflicts: isHarmonious
      ? `El principal conflicto de este mes es el riesgo de relajarte por la aparente facilidad. Cuando todo encaja en armonía, es fácil pasar por alto detalles importantes o posponer decisiones serias. No dejes que la comodidad se convierta en una trampa.`
      : `El principal conflicto es entre lo que exige la energía del año y lo que dicta la energía del mes. ${yearArcanaName} tira hacia un lado, ${monthArcanaName} hacia otro. Tu tarea no es elegir un bando, sino hallar la integración. El resultante ${resultArcanaName} sugiere el camino.`,
    money: resultData.sphere.money,
    career: resultData.sphere.career,
    relationships: resultData.sphere.rel,
    health: resultData.sphere.health,
    innerState: resultData.sphere.inner,
    firstWeek: `Primera semana de ${monthName}: Adaptación a la nueva energía. La energía de ${monthArcanaName} empieza a manifestarse, pero aún es débil. Usa este tiempo para planificar y calibrar. No tomes grandes decisiones: deja que 'entres' en el mes.`,
    secondWeek: `Segunda semana: La energía principal de ${monthArcanaName} cobra fuerza. Es un tiempo para la acción en las áreas clave. ${resultData.sphere.career.split('.')[0]}. Concéntrate en tus prioridades.`,
    thirdWeek: `Tercera semana: El pico de la energía del mes. La energía resultante de ${resultArcanaName} se manifiesta al máximo. El mejor momento para negociaciones, acuerdos y decisiones importantes. Todo lo que hagas ahora tiene el máximo efecto.`,
    fourthWeek: `Cuarta semana: Cierre y preparación para la transición. La energía de ${monthArcanaName} se debilita. Cierra lo empezado, haz balance. No empieces nada nuevo: déjalo para el mes siguiente.`,
    toDo: [
      `Sintoniza con la energía de ${resultArcanaName}: define tu estrategia para el mes`,
      resultData.practice,
      `Presta atención al área de ${isHarmonious ? 'la carrera: la armonía de las energías da una oportunidad de avance' : 'la salud: el conflicto de las energías puede afectar tu bienestar'}`,
      `Lleva un diario de observación: anota cómo se manifiesta la energía de ${resultArcanaName}`,
      `Practica la conciencia: cada noche anota 3 manifestaciones de la energía del día`,
      `Refuerza tus relaciones: ${resultData.sphere.rel.split('.')[0]}`,
    ],
    toAvoid: [
      `No ignores las señales del cuerpo: la energía de ${resultArcanaName} puede sobrecargarte`,
      `No tomes decisiones en los primeros 3 días del mes: deja que la energía se asiente`,
      `No discutas con tus seres queridos en la tercera semana: la energía está en su pico y los conflictos se intensifican`,
      `No planifiques grandes compras en la última semana: la energía ya está bajando`,
      `No te resistas al flujo natural: si el mes se ralentiza, acepta la pausa`,
    ],
    dailyPractice: resultData.practice,
    mainMessage: `Este mes es ${isHarmonious ? 'una oportunidad de crecimiento y florecimiento' : 'un desafío y una lección'}. La energía de ${resultArcanaName} te enseña a ${isHarmonious ? 'aprovechar el viento a favor al máximo' : 'hallar fuerza en las dificultades y sabiduría en los conflictos'}. Recuerda: cada mes es un microciclo dentro del gran ciclo anual. Lo que vivas ahora influirá en todo el tiempo restante del año.`,
    keyDays: `Días clave del mes: ${monthName} 1–3 (ajuste), ${monthName} ${Math.min(resultArcana, 28)} (pico energético), los últimos 2 días (cierre y reflexión). Atención especial al día ${resultArcana}: ese día la energía del arcano se manifiesta al máximo.`,
  };
}
