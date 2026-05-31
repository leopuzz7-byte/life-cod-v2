// EN/ES translations for the PRO year interpretation (proInterpretations.ts).
// Parallel language path: the Russian base in proInterpretations.ts stays untouched.
// getYearProInterpretation() calls getYearProLocalized() first; if it returns null
// (language === 'ru' or unknown), the original Russian logic runs as before.
//
// Arcana 1–5 have full hand-written content; arcana 6–22 use short per-arcana themes
// plus generic templates — mirroring the structure of generateFullYear() in the base file.
// monthlyFocus is intentionally left empty: it is not rendered anywhere in the UI.

import type { YearProInterpretation, CompatibilityProInterpretation } from './proInterpretations';

const NO_MONTHS: Record<number, string> = {};

type Theme = { focus: string; money: string; rel: string; career: string; health: string; inner: string };

// ============================================================
// EN — full arcana 1–5
// ============================================================
const yearFullEN: Record<number, YearProInterpretation> = {
  1: {
    intro: "You are entering the Year of the Magician — the first year of a new 22-year life cycle. This is the point of absolute beginning. Everything that happened before stays in the previous cycle. Right now you stand at the threshold of a completely new stage, and the direction of the next 22 years depends on the decisions you make this year.",
    mainEnergy: "The energy of initiative, will, beginning. The archetype of the Magician is a person who takes responsibility for their life and starts creating reality according to their own design.",
    overview: "The Year of the Magician is the start of a new 22-year cycle. The Universe gives you carte blanche to create something new. You are the point of reference, and everything you launch now will have long-term consequences. The energy of this year demands decisiveness and initiative from you. This is not a year of waiting — it is a year of action. Every project launched, every decision made lays the foundation for years ahead.",
    deepMeaning: "The Magician arcana symbolizes the power of intention. This year your word, your thought, your decision carry heightened materializing force. Be careful with what you say and think — all of it becomes reality faster than usual. The Magician is the link between idea and matter, between 'I want' and 'I do'.",
    strengths: [
      "Incredible launch energy — you can start what you previously lacked the strength for",
      "A gift for speaking and persuasion — people listen to you",
      "Resourcefulness and the ability to get out of any situation in an unconventional way",
      "Heightened intuition for opportunities — you see chances others miss",
      "Magnetism — you attract the right people and resources",
    ],
    weaknesses: [
      "Impulsiveness — the urge to start everything at once without a plan",
      "Superficiality — many projects started, few finished",
      "A tendency to manipulate — the temptation to use your influence dishonestly",
      "Overestimating your strength — trying to do too much in a short time",
      "Impatience — expecting instant results",
    ],
    distortions: "The distortion of the Magician is the 'illusionist': a person who creates the appearance of activity but produces nothing real. The second distortion is the 'manipulator': using influence to control others instead of creating something new. If you feel you talk more than you do — that is a signal of distortion.",
    lifeExamples: "Typical manifestations of this year: a sudden urge to change jobs, launch your own project, move, start learning something new. You may feel that your 'old life' no longer fits you. That is normal — you really are starting over.",
    money: "The financial flow opens through new projects and ideas. Old income sources may dry up — this is not a loss but the freeing of space for the new. Invest in yourself and your skills. Don't expect results right away: this year is the sowing, the harvest comes later. The best financial strategy is investing in learning, tools and networking.",
    moneyRisks: "Large debts for unrealistic projects. Spending money on 'showing off' instead of investing in skills. Fraud — in the Year of the Magician the risk of meeting dishonest people is heightened.",
    moneyOpportunities: "Launching a new business or direction. Monetizing a unique skill. Receiving a grant or investment. Earning through teaching or consulting.",
    moneyRecommendations: "Make a financial plan for the year. Set aside an 'untouchable reserve'. Invest 10–20% in learning. Don't take loans for unproven ideas.",
    career: "Time to launch what you've long been thinking about. A change of job, of direction, starting your own venture — all of this is supported by the year's energy. The key to success: act on your own, don't wait for permission. A leadership position is natural for you. If you're employed — take the initiative on a new project. If you've been thinking of leaving — this year is ideal for a start.",
    careerRisks: "Conflict with management over your drive for independence. Quitting 'into nowhere' without a plan. Disappointment from a slow start.",
    careerOpportunities: "Creating your own brand or business. Moving into a new field. Getting a leadership position. International contacts.",
    careerRecommendations: "Start small, but start for sure. Create a minimum viable product. Find a mentor in the new field. Don't burn bridges — make a smooth transition.",
    relationships: "A year of individuality. Relationships may be tested: you are changing, and your partner needs time to accept the new you. New acquaintances will be meaningful — every person who comes into your life in the Year of the Magician plays an important role in the next cycle. Single people may meet someone who becomes a key figure.",
    relationshipsRisks: "A breakup because the partner doesn't accept your changes. Loneliness from hyper-focusing on projects. Trying to control the partner.",
    relationshipsOpportunities: "Meeting a like-minded person. Renewing an existing relationship. A business partnership through personal connections.",
    relationshipsRecommendations: "Share your plans with your partner. Don't shut yourself away in projects. Leave time for closeness. Be open to new acquaintances, but don't scatter yourself.",
    health: "Pay attention to the head and nervous system. High mental load can lead to overwork. Meditation and mindful practices will be especially helpful. Start a new diet or sport regimen — anything begun in the Year of the Magician has a long-term effect.",
    healthRisks: "Headaches, migraines, insomnia from over-excitement. Exhaustion of the nervous system. Ignoring the body for the sake of mental work.",
    healthRecommendations: "Set a sleep schedule. Start meditating — even 10 minutes a day. Sport focused on the body (yoga, swimming). Minimize stimulants (coffee, social media).",
    innerState: "Two states may struggle inside you: euphoria from new opportunities and fear of the unknown. That is normal. The Magician stands between worlds — between the old and the new. Accept this duality. Don't suppress either the joy or the fear. Use both as fuel.",
    innerStateRecommendations: "Keep an observation journal. Write down ideas — they are valuable. Work with affirmations: 'I begin the new with confidence and clarity'. Find a mentor or a support group.",
    energyInteractions: "The Magician's energy intensifies in months whose digits sum to 1 (January, October). Conflicting energy comes in months with a vibration of 4 and 8 (April, August) — here you need more structure and patience. The greatest potential for realization is in May (vibration 5 — expansion) and September (vibration 9 — completing the preparatory stage).",
    additionalInsight: "In Kapustin's system, the Year of the Magician is the 'year of conception'. Everything conceived in this year will unfold over the next 3–4 years. That is why it is critically important to: 1) clearly define your goals; 2) write them down; 3) take the first steps, even if they seem small. The Magician does not wait — he acts.",
    risks: [
      "Impulsive decisions without a plan — 'I'll just start and figure it out later'",
      "Trying to control everything around you — micromanagement",
      "Overestimating your strength at the start — taking on too many commitments",
      "Conflicts from wanting to do everything your own way — ignoring advice",
      "Loss of focus — too many ideas, none seen through to the end",
      "Financial recklessness — spending money on unrealistic projects",
    ],
    repeatingPatterns: "If you didn't finish what you started in the previous cycle, this pattern may repeat. A Magician without discipline is just an illusionist. Note this: if you feel the urge to 'start all over' for no reason — it may be escape, not growth.",
    opportunities: [
      "Creating a new business or project from scratch",
      "Meeting a mentor or a key partner",
      "Developing a unique skill that becomes your 'trump card'",
      "A move or a radical change of lifestyle",
      "Launching a personal brand or media presence",
      "Gaining new knowledge and certifications",
    ],
    recommendations: [
      "Start small, but start for sure — take at least one step every day",
      "Write down all ideas — you'll need them in the coming years",
      "Don't be afraid to be first — the year's energy supports pioneers",
      "Trust intuition, but check the facts — the Magician works with both hemispheres",
      "Minimize the influence of others' opinions on your decisions",
      "Find a mentor — even the Magician needs a wise advisor",
      "Create a 'map of the year' — visualize your goals",
      "Invest in yourself — learning, health, skills",
    ],
    whatToAvoid: [
      "Don't scatter yourself — choose 1–2 key projects",
      "Don't manipulate people for the sake of results",
      "Don't ignore your health for 'great goals'",
      "Don't take on large debts for unproven ideas",
      "Don't burn bridges — old connections will still come in handy",
    ],
    conclusion: "The Year of the Magician is the year you lay the foundation of the next 22 years. Don't rush, but don't dawdle either. Act consciously, trust yourself, and be ready for the world to respond to your requests faster than usual. You are the creator. Act like a creator.",
    keyThought: "Everything begun in the Year of the Magician will grow and develop. Choose your seeds consciously.",
    mainVector: "Initiation of a new cycle → conscious choice of direction → first actions → laying a 22-year foundation",
    monthlyFocus: NO_MONTHS,
  },
  2: {
    intro: "You are entering the Year of the High Priestess — the second year of the 22-year cycle. If the Year of the Magician was about action and launching, the Year of the High Priestess is about silence, depth and inner work. The Universe slows you down so you can see what is hidden from view.",
    mainEnergy: "The energy of intuition, silence, inner knowing. The archetype of the High Priestess is the keeper of secrets, who knows more than she says.",
    overview: "The Year of the High Priestess is a time of silence, intuition and inner work. The Universe slows you down so you can see the hidden. This is not a year of active deeds but a year of observation, analysis and preparation. Trust signs and coincidences. Everything you sowed last year is now sprouting underground — you don't see the results, but they are forming.",
    deepMeaning: "The High Priestess is the keeper of knowledge and secrets. This year the hidden motives of people, the true causes of events, the secret mechanisms of your life will reveal themselves to you. Don't rush the process. Information comes in silence. Dreams, coincidences, 'random' encounters — all of these are messages.",
    strengths: [
      "Heightened intuition — you feel lies and truth on a deep level",
      "The ability to see the hidden — people's true motives become obvious",
      "Depth of understanding — what was unclear before now becomes clear",
      "Patience and wisdom — you stop rushing events",
      "Healing energy — you can help others simply by your presence",
    ],
    weaknesses: [
      "Passivity — waiting instead of acting when action is needed",
      "Dependence on others' opinions — the inner voice is drowned out by outer noise",
      "Suppressing emotions — the 'good girl/boy' instead of authenticity",
      "Ignoring intuitive signals — the rational mind blocks feeling",
      "Isolation — withdrawing from the world instead of conscious silence",
    ],
    distortions: "The distortion of the High Priestess is the 'frozen Priestess': a person who withdraws so far into herself that she loses touch with reality. The second distortion is the 'false prophetess': passing off fantasies as intuition. The third is the 'victim of silence': the inability to express one's feelings and needs.",
    lifeExamples: "Typical manifestations: a need for solitude, prophetic dreams, the 'accidental' discovery of important information, the feeling 'I knew this beforehand'. You may become interested in psychology, esoterics, meditation. Those around you may consider you 'strange' — that is normal.",
    money: "Money comes not through aggressive action but through patience and the right connections. Unexpected income through women or partnership is possible. Not a time for risky investments — preserve what you have. Financial wisdom lies in moderation.",
    moneyRisks: "Financial stagnation from indecision. Missed opportunities from 'waiting for the perfect moment'. Fraud — in silence it's easier to be deceived.",
    moneyOpportunities: "Income through consulting and mentoring. Passive income from previously created projects. Partnership projects with trusted people.",
    moneyRecommendations: "Don't rush financial decisions. Build a safety cushion. Invest in knowledge, not in risky projects. Trust intuition in finances, but verify.",
    career: "Time to learn and accumulate knowledge. Career breakthroughs are unlikely, but preparation for them is in full swing. Good for research work, psychology, creativity. Avoid public conflicts. If you feel that 'nothing is happening' — that is deceptive. You are preparing for a leap that will happen next year.",
    careerRisks: "Stagnation and a sense of meaninglessness. Conflict with aggressive management. Burnout from routine.",
    careerOpportunities: "Deep study and certification. Mentorship. Creating expert content. Research projects.",
    careerRecommendations: "Study. Read. Research. Write down ideas and insights. Don't force career growth — it will come. Find a mentor or an interest group.",
    relationships: "Deep work on relationships. You'll begin to understand your partner on a new level. Secrets may come out — be ready. For singles, a meeting is possible through intuition: you'll simply 'feel' the right person. The year is favorable for working with a couples' psychologist.",
    relationshipsRisks: "Hushing up problems. Withdrawing into yourself instead of dialogue. Projecting past relationships onto the current one.",
    relationshipsOpportunities: "Deepening closeness. A new level of trust. Healing old wounds. Meeting a 'karmic' partner.",
    relationshipsRecommendations: "Talk about your feelings, even if it's hard. Listen to your partner without judgment. Spend time together in silence. Work with a couples' therapist.",
    health: "Reproductive system, hormonal balance, psychosomatics. Attention to emotional health. Water procedures, relaxation practices, working with the subconscious through dreams are helpful. The lymphatic system needs attention.",
    healthRisks: "Depression from isolation. Psychosomatic problems — the body reacts to suppressed emotions. Hormonal disorders.",
    healthRecommendations: "Water procedures — pool, sauna, baths. Body work — gentle yoga, qigong. Psychotherapy or work with a psychologist. A dream journal.",
    innerState: "Inside — a sense of the calm before the storm. It may seem that nothing is happening, but on a deep level powerful work of the subconscious is underway. Dreams become vivid and prophetic. Intuition sharpens to the limit. Trust this state — it is preparing you for the next stage.",
    innerStateRecommendations: "Meditate daily. Keep a dream journal. Pay attention to coincidences. Don't fill the silence with noise — answers are born in silence.",
    energyInteractions: "The High Priestess's energy intensifies in February, June and November. Conflicting energy comes in July (the need for analysis can clash with summer's active energy). The deepest insights come at night and during the waning moon.",
    additionalInsight: "In Kapustin's system, the Year of the High Priestess is the 'year of ripening'. The seeds sown in the Year of the Magician are sprouting. But you see only the top. The root system forms unseen. Your task is not to interfere with the process, not to pull up the sprouts too early. Patience is your main tool.",
    risks: [
      "Passivity and indecision — 'I'll wait for a sign'",
      "Dependence on others' opinions — 'what will others say?'",
      "Suppressing emotions — 'I'm not allowed to be angry/sad'",
      "Ignoring intuitive signals — 'it's just my imagination'",
      "Isolation instead of conscious silence",
      "Depressive states because of outer 'stillness'",
    ],
    repeatingPatterns: "If you tend toward codependency, this year may amplify the pattern 'I'll help everyone, forgetting myself'. The High Priestess teaches: first fill yourself, then give. If situations where you aren't heard keep repeating — learn to speak louder.",
    opportunities: [
      "Developing intuition and deep perception",
      "Deep study and professional certification",
      "Building a strategic partnership",
      "Healing through self-knowledge and therapy",
      "Creating an intellectual product (a book, a course)",
      "Working with subconscious blocks",
    ],
    recommendations: [
      "Keep a journal of dreams and observations — record every insight",
      "Don't rush events — your time will come next year",
      "Surround yourself with silence and nature — that is your resource",
      "Learn to listen, not to speak — information is coming to you",
      "Develop feminine energy regardless of gender — receptivity",
      "Work with a psychologist or mentor",
      "Trust dreams — record and analyze them",
      "Minimize information noise — social media, news",
    ],
    whatToAvoid: [
      "Don't force events — this is not the year for aggressive strategies",
      "Don't ignore intuition for the sake of 'logic'",
      "Don't withdraw into total isolation — silence ≠ loneliness",
      "Don't suppress emotions — give them an outlet in a safe environment",
      "Don't make large financial decisions impulsively",
    ],
    conclusion: "The Year of the High Priestess is a year of inner wisdom and patience. You are laying an invisible but powerful foundation for the coming leap. Everything you now understand about yourself will become your tool next year. Don't rush. Observe. Feel. Trust the process.",
    keyThought: "The most powerful decisions are born in silence. Don't fear the pause — fear busyness without meaning.",
    mainVector: "Slowing down → inner work → developing intuition → preparing for the next stage",
    monthlyFocus: NO_MONTHS,
  },
  3: {
    intro: "You are entering the Year of the Empress — the third year of the cycle, a year of blossoming and abundance. Everything that was sown in the Year of the Magician and ripened in the Year of the High Priestess now begins to bear fruit. This is one of the most favorable years for material results.",
    mainEnergy: "The energy of abundance, beauty, creativity and motherhood. The archetype of the Empress is the generous mother-earth who both gives and receives.",
    overview: "The Year of the Empress is blossoming, abundance, creativity. Everything you sowed earlier begins to bear fruit. This is a year of beauty, love and material prosperity. The Universe is generous to you — accept with gratitude. The year's energy literally creates conditions for flourishing in all areas.",
    deepMeaning: "The Empress symbolizes fertility on all levels: physical (money, things, health), emotional (love, joy), creative (projects, works). This year teaches you to receive — not only to give. Many people with a strong Empress don't know how to receive. This year heals that block.",
    strengths: [
      "Magnetic attractiveness — people are drawn to you",
      "Financial luck — money comes from unexpected sources",
      "A creative surge — ideas are easily realized",
      "Emotional fullness — you feel life more vividly",
      "The ability to create beauty and comfort around you",
    ],
    weaknesses: [
      "Extravagance — 'I can afford it' turns into 'I spend without measure'",
      "Laziness — abundance relaxes you and lowers motivation",
      "Jealousy and possessiveness — fear of losing what you've achieved",
      "Fixation on appearance — beauty becomes an obsession",
      "Neglect of discipline — 'everything's fine as it is'",
    ],
    distortions: "The distortion of the Empress is the 'toxic mother': suffocating care, control through love. The second is the 'hedonist': chasing pleasures without growth. The third is the 'envious one': the inability to rejoice in others' success, comparing yourself to others.",
    lifeExamples: "Typical manifestations: unexpected gifts, a pay raise, a creative breakthrough, pregnancy (literal or metaphorical — the 'birth' of a project), improved appearance, buying a house or car.",
    money: "One of the best financial years of the cycle. Money comes through creativity, beauty, communication. Gifts, inheritance, unexpected bonuses are possible. Investments in real estate and comfort will pay off. Monetizing what you love to do.",
    moneyRisks: "Extravagance. Emotional purchases. Loans for the 'beautiful life'. Dependence on someone else's money.",
    moneyOpportunities: "Launching a profitable creative project. Buying real estate. Investing in beauty and wellness. Passive income from what you created earlier.",
    moneyRecommendations: "Enjoy the abundance, but set aside 20%. Invest in real estate or long-term assets. Don't lend large sums. Be grateful for every inflow.",
    career: "Creative professions are at their peak. If you work with people, beauty, art — this is your year. Advancement through personal charm and networking. Public visibility and social media work for you. A promotion or a significant bonus is possible.",
    careerRisks: "Relaxation. Loss of discipline. Conflicts from colleagues' jealousy.",
    careerOpportunities: "Launching a creative project. Monetizing a hobby. Growing popularity. Partnership projects.",
    careerRecommendations: "Use your charm. Be visible — speak, publish. Don't be afraid to monetize what you love. Work beautifully.",
    relationships: "A time of love and romance. Relationships fill with warmth and passion. For singles — a high chance of meeting a partner. Pregnancy is possible. Family bonds strengthen. This is a year when you want to love and be loved.",
    relationshipsRisks: "Jealousy. Idealizing the partner. Codependency. Infidelity against a backdrop of 'everything's fine'.",
    relationshipsOpportunities: "A wedding. Moving in together. The birth of a child. Traveling together. A new level of closeness.",
    relationshipsRecommendations: "Pamper your partner, but don't forget yourself. Spend quality time together. Create beauty in your space. Don't confuse love with dependency.",
    health: "Good vitality. Risk of weight gain — watch your diet. Attention to the throat and thyroid. Treat yourself to spa procedures. Dancing or yoga are especially beneficial. Women's health is in focus.",
    healthRisks: "Weight gain. Thyroid problems. Overeating from emotional abundance.",
    healthRecommendations: "Balanced nutrition. Dancing, yoga, swimming. Spa and massage. Skin and body care. Regular check-ups.",
    innerState: "Inside — a sense of fullness and gratitude. The world seems beautiful. But behind this may hide an unwillingness to see problems. Accept both the joy and the shadows — the Empress teaches you to love reality as a whole, not only the beautiful parts.",
    innerStateRecommendations: "Practice gratitude. Share your joy. But don't close your eyes to problems — solve them from a place of resource.",
    energyInteractions: "The Empress's energy intensifies in spring (March–May) — the time of literal blossoming. The summer months give maximum social activity. Autumn is the harvest. Winter is a time for reflection and preparing for the next year.",
    additionalInsight: "In Kapustin's system, the Year of the Empress is the 'year of harvesting the first sowing'. Everything conceived 2 years ago gives visible results. If there are no results — the sowing was of poor quality. Don't blame yourself, but draw the lesson: in the next cycle you need to sow more consciously.",
    risks: [
      "Extravagance and living beyond your means",
      "Laziness and unwillingness to develop — 'it's fine as it is'",
      "Jealousy and possessiveness in relationships",
      "Neglect of discipline and routine",
      "Codependency — dissolving into another person",
      "Idealization — unwillingness to see reality",
    ],
    repeatingPatterns: "If you're used to 'earning' love and money, this year may cause discomfort: you're given things just like that. Learn to receive without guilt.",
    opportunities: [
      "Launching a creative project",
      "Monetizing hobbies and talents",
      "Growing popularity and social influence",
      "A material acquisition — a house, a car, works of art",
      "Improving health and appearance",
      "Strengthening family bonds",
    ],
    recommendations: [
      "Enjoy life, but don't forget about the future",
      "Invest 20% of your income — the harvest must be preserved",
      "Develop aesthetic taste — beauty heals",
      "Be generous — it will return many times over",
      "Give attention to your body and appearance",
      "Create coziness at home — it affects all areas of life",
      "Learn to receive — gifts, compliments, help",
      "Give thanks — every evening write down 3 things you're grateful for",
    ],
    whatToAvoid: [
      "Don't spend more than you earn",
      "Don't eat away your emotions — look for the cause",
      "Don't compare yourself to others — your path is unique",
      "Don't smother your partner with care — leave them space",
      "Don't avoid discipline — even in a year of abundance you need structure",
    ],
    conclusion: "The Year of the Empress is a gift of the cycle. Receive it with gratitude and wisdom. Enjoy the abundance, but keep your awareness. This year teaches the main thing: you are worthy of good things just because, without conditions.",
    keyThought: "Abundance is a natural state. Learn to receive, not only to give.",
    mainVector: "Blossoming → material results → creative realization → gratitude",
    monthlyFocus: NO_MONTHS,
  },
  4: {
    intro: "You are entering the Year of the Emperor — the fourth year of the cycle, a year of structure, order and foundation. After the blossoming of the Empress, it is time to consolidate results, build a system and put order into every area of life.",
    mainEnergy: "The energy of structure, discipline, responsibility and power. The archetype of the Emperor is the empire-builder who creates order out of chaos.",
    overview: "The Year of the Emperor demands a systematic approach. The chaotic actions of past years must take form. Create processes, document, organize. This year rewards those who work by a plan and punishes those who rely on luck.",
    deepMeaning: "The Emperor is the founding father. He doesn't invent — he builds. Your task now is not to seek the new but to strengthen the existing. Every process, every habit, every rule you establish this year will work for you for years to come.",
    strengths: ["A talent for organization", "Leadership through action", "The ability to create order", "Responsibility and reliability", "Strategic thinking"],
    weaknesses: ["Authoritarianism", "Excessive control", "Rigidity and inflexibility", "Workaholism", "Suppressing feelings for the sake of 'the work'"],
    distortions: "The distortion of the Emperor is the 'tyrant': control for control's sake, suppressing dissent. The second is the 'irresponsible leader': demanding from others but not from himself.",
    lifeExamples: "Typical manifestations: buying real estate, opening a business, building a team, legal matters, paperwork, renovation, creating a long-term plan.",
    money: "Stable income through system and organization. Time for business plans and financial strategy. Money comes through structure, not luck. Real estate is the best investment of the year.",
    moneyRisks: "Excessive rigidity in finances. Refusing necessary spending. Conflicts over money in the family.",
    moneyOpportunities: "Buying real estate. Creating a financial strategy. Structuring a business. Systematic income growth.",
    moneyRecommendations: "Make a 3-year financial plan. Automate savings. Sort out taxes and legal matters.",
    career: "Leadership, management. You're noticed as a leader. A promotion or expanded responsibility is possible. Time to systematize work processes. If you're a manager — you're building a team.",
    careerRisks: "Conflict with management. Overload of duties. An authoritarian style pushes colleagues away.",
    careerOpportunities: "Promotion to a leadership position. Structuring business processes. Building a team. Scaling.",
    careerRecommendations: "Learn to delegate. Create systems instead of doing everything yourself. Invest in your team.",
    relationships: "Stability in relationships. Masculine energy dominates (regardless of gender). Formalization: marriage, shared housing, a joint budget. But it's important not to pressure your partner with authority.",
    relationshipsRisks: "Controlling and suppressing the partner. Coldness. Prioritizing work over the relationship.",
    relationshipsOpportunities: "Buying a home together. Marriage. Creating family traditions. Strengthening the foundation of the union.",
    relationshipsRecommendations: "Balance between structure and warmth. Don't control your partner. Set aside time for the relationship.",
    health: "Spine, knees, joints — the musculoskeletal system. Stress from responsibility. Important: regular movement, don't sit at a desk for 12 hours.",
    healthRisks: "Back pain. Joint problems. Stress and hypertension.",
    healthRecommendations: "Sport focused on strength and endurance. Massage. Regular breaks. Stress management.",
    innerState: "Inside — a need for control and predictability. It may seem the world is chaotic and only you can fix everything. This is the illusion of control. Learn to trust the process and other people.",
    innerStateRecommendations: "Practice delegation — both at work and at home. Allow others to make mistakes. Don't carry the world on your shoulders.",
    energyInteractions: "The Emperor's energy intensifies in April (his 'home' month). Conflicting energy comes in December (fatigue from responsibility). The best quarter for strategic decisions is Q1.",
    additionalInsight: "In Kapustin's system, the Year of the Emperor is the 'year of the foundation'. Everything you build and consolidate now becomes the basis for the next 5–7 years. To skimp on the foundation means to pay later.",
    risks: ["Authoritarianism and control", "Workaholism to the point of burnout", "Suppressing emotions", "Inflexibility — 'only my way is right'", "Conflicts with loved ones over 'I know better'"],
    patterns: "If you're used to controlling everything and everyone — this year will amplify the pattern. A test: if you can't let go of control even for a day — that's a problem.",
    opportunities: ["Buying or building real estate", "Creating a business or systematizing an existing one", "Promotion to a leadership role", "Creating long-term strategies", "Legally formalizing important matters"],
    recommendations: ["Build a system, don't grab at everything", "Delegate — you can't do everything yourself", "Invest in the foundation — health, home, relationships", "Be strict but fair", "Make a plan for at least 3 years ahead"],
    avoid: ["Don't pressure people — lead, don't command", "Don't forget about rest — an Emperor without energy is a tyrant", "Don't ignore feelings for the sake of 'the work'", "Don't take on others' responsibility"],
    conclusion: "The Year of the Emperor is the year you build your fortress. Every brick, every process, every rule is an investment in your future. Build solidly, but don't forget that a fortress without warmth is a prison.",
    keyThought: "Structure without soul is a prison. Soul without structure is chaos. Your task is to unite both.",
    mainVector: "Systematization → building the foundation → strengthening positions → long-term planning",
    monthlyFocus: NO_MONTHS,
  },
  5: {
    intro: "The Year of the Hierophant — the fifth year of the cycle. A year of traditions, learning and the search for meaning. After building structure (the Emperor) comes the time to fill it with content.",
    mainEnergy: "The energy of wisdom, traditions, teaching and spiritual searching.",
    overview: "The Year of the Hierophant is a time of deep learning and passing on knowledge. You either learn or teach — often both at once. Traditions, rituals, spiritual practices take on special meaning.",
    deepMeaning: "The Hierophant is a bridge between the earthly and the sacred. This year you'll be drawn to deep knowledge: philosophy, psychology, spiritual traditions. Don't resist. This is the year when answers come through teachers, books and practices.",
    strengths: ["Wisdom and depth of understanding", "The ability to teach and inspire", "A connection with tradition and culture", "A moral compass", "Patience and method"],
    weaknesses: ["Moralizing", "Dogmatism", "Inflexibility of thought", "Judging the 'wrong ones'", "Avoiding the new"],
    distortions: "The distortion of the Hierophant is the 'Pharisee': preaching without practice, rules for others but not for himself. The second is the 'cultist': fanatical attachment to a single system of knowledge.",
    lifeExamples: "Typical manifestations: enrolling in courses, earning a degree, meeting a teacher, starting a spiritual practice, working with a psychologist, studying philosophy.",
    money: "Income through teaching, consulting, mentorship, expert work. Money comes through knowledge and authority, not through aggressive sales.",
    moneyRisks: "Low income because 'spirituality doesn't sell'. Refusal to monetize knowledge. Financial dependence on an institution.",
    moneyOpportunities: "Creating a course or a book. Consulting. Certification. Teaching. Expert talks.",
    moneyRecommendations: "Monetize your knowledge — it's not a sin. Create an expert product. Invest in education.",
    career: "Academic environment, mentorship, expertise. Formalizing skills through certifications. If you're an expert — it's time to share your knowledge publicly.",
    careerRisks: "Getting stuck in theory without practice. A clash of values with the employer. Perfectionism in preparation.",
    careerOpportunities: "Launching an educational project. Speaking at conferences. Mentorship. Writing a book.",
    careerRecommendations: "Learn and teach. Systematize your knowledge. Find a mentor. Become a mentor for someone.",
    relationships: "Formalizing the relationship: marriage, official steps, shared values. Relationships are tested for compatibility of values. If values differ — it will become obvious.",
    relationshipsRisks: "Moralizing in the relationship. Imposing your views on your partner. Boredom and routine.",
    relationshipsOpportunities: "Deepening through shared values. Learning together. A spiritual practice as a couple. A wedding.",
    relationshipsRecommendations: "Discuss values with your partner. Find a common interest to study. Don't impose your views.",
    health: "Throat, ears, respiratory system. Psychosomatics from suppressed words. Voice practices, singing, reading aloud.",
    healthRisks: "Throat problems (you're not speaking your truth). Allergies. Chronic stress from perfectionism.",
    healthRecommendations: "Speak the truth — your throat will say 'thank you'. Breathing practices. Singing. Regular check-ups.",
    innerState: "A search for meaning and purpose. Questions of 'why am I here?' and 'what is my lesson?'. A deep inner process that may be uncomfortable but is necessary.",
    innerStateRecommendations: "Meditation. Philosophical reading. Working with a mentor. A reflection journal. Don't fear difficult questions.",
    energyInteractions: "The Hierophant's energy intensifies in May and September. Conflicting energy comes in November. The best time to study is Q1 and Q3.",
    additionalInsight: "In Kapustin's system, the Year of the Hierophant is the 'year of filling with meaning'. The structure built earlier receives a philosophical basis. Without meaning, any system is bureaucracy.",
    risks: ["Dogmatism — 'there is only one right path'", "Moralizing — 'I know how it should be'", "Avoiding new experience", "Perfectionism in learning — 'I'm not ready yet'", "Financial losses from 'free' expert labor"],
    patterns: "If you're used to learning endlessly but not applying knowledge — this year will amplify the pattern. A test: if you've taken 10 courses but earned nothing from the knowledge — that's a problem.",
    opportunities: ["Creating an educational product", "Earning a degree or certification", "Meeting a mentor", "Publishing a book or course", "Spiritual transformation"],
    recommendations: ["Learn, but apply — knowledge without practice is dead", "Share your knowledge — that is your mission this year", "Find a balance between tradition and innovation", "Monetize your expertise — it's honest", "Be open to others' experience"],
    avoid: ["Don't impose your views", "Don't learn endlessly without applying", "Don't ignore practice for the sake of theory", "Don't close yourself off from the new"],
    conclusion: "The Year of the Hierophant is a year of wisdom. You learn and teach, find meaning and share it. The main thing is not to get stuck in theory but to apply knowledge in life.",
    keyThought: "Wisdom is knowledge applied in life. Without application, it's just information.",
    mainVector: "Learning → searching for meaning → passing on knowledge → spiritual growth",
    monthlyFocus: NO_MONTHS,
  },
};

// ============================================================
// ES — full arcana 1–5
// ============================================================
const yearFullES: Record<number, YearProInterpretation> = {
  1: {
    intro: "Entras en el Año del Mago, el primer año de un nuevo ciclo vital de 22 años. Es el punto del comienzo absoluto. Todo lo que ocurrió antes se queda en el ciclo anterior. Ahora estás en el umbral de una etapa completamente nueva, y la dirección de los próximos 22 años depende de las decisiones que tomes este año.",
    mainEnergy: "La energía de la iniciativa, la voluntad, el comienzo. El arquetipo del Mago es la persona que asume la responsabilidad de su vida y empieza a crear la realidad según su propio designio.",
    overview: "El Año del Mago es el inicio de un nuevo ciclo de 22 años. El Universo te da carta blanca para crear algo nuevo. Tú eres el punto de partida, y todo lo que pongas en marcha ahora tendrá consecuencias a largo plazo. La energía de este año exige decisión e iniciativa. No es un año de espera, es un año de acción. Cada proyecto lanzado, cada decisión tomada, asienta los cimientos de los años venideros.",
    deepMeaning: "El arcano del Mago simboliza el poder de la intención. Este año tu palabra, tu pensamiento, tu decisión tienen una fuerza materializadora aumentada. Ten cuidado con lo que dices y piensas: todo se hace realidad más rápido de lo habitual. El Mago es el eslabón entre la idea y la materia, entre el 'quiero' y el 'hago'.",
    strengths: [
      "Una increíble energía de arranque: puedes empezar aquello para lo que antes te faltaban fuerzas",
      "Talento para hablar y convencer: la gente te escucha",
      "Ingenio y capacidad de salir de cualquier situación de forma poco convencional",
      "Intuición aguda para las oportunidades: ves ocasiones que otros pasan por alto",
      "Magnetismo: atraes a las personas y los recursos adecuados",
    ],
    weaknesses: [
      "Impulsividad: el deseo de empezarlo todo a la vez sin un plan",
      "Superficialidad: muchos proyectos iniciados, pocos terminados",
      "Tendencia a la manipulación: la tentación de usar tu influencia de forma deshonesta",
      "Sobrestimar tus fuerzas: intentar hacer demasiado en poco tiempo",
      "Impaciencia: esperar resultados instantáneos",
    ],
    distortions: "La distorsión del Mago es el 'ilusionista': alguien que crea la apariencia de actividad pero no produce nada real. La segunda distorsión es el 'manipulador': usar la influencia para controlar a los demás en lugar de crear algo nuevo. Si sientes que hablas más de lo que haces, es una señal de distorsión.",
    lifeExamples: "Manifestaciones típicas de este año: un deseo repentino de cambiar de trabajo, lanzar tu propio proyecto, mudarte, empezar a aprender algo nuevo. Puedes sentir que tu 'vida antigua' ya no encaja contigo. Es normal: de verdad estás empezando de nuevo.",
    money: "El flujo financiero se abre a través de nuevos proyectos e ideas. Las viejas fuentes de ingresos pueden agotarse: no es una pérdida, sino la liberación de espacio para lo nuevo. Invierte en ti y en tus habilidades. No esperes resultados de inmediato: este año es la siembra, la cosecha llega después. La mejor estrategia financiera es invertir en formación, herramientas y contactos.",
    moneyRisks: "Grandes deudas por proyectos poco realistas. Gastar dinero en 'aparentar' en lugar de invertir en habilidades. Fraude: en el Año del Mago aumenta el riesgo de toparse con gente deshonesta.",
    moneyOpportunities: "Lanzar un nuevo negocio o dirección. Monetizar una habilidad única. Conseguir una subvención o inversión. Ganar a través de la enseñanza o la consultoría.",
    moneyRecommendations: "Haz un plan financiero para el año. Aparta una 'reserva intocable'. Invierte un 10–20% en formación. No pidas préstamos para ideas no probadas.",
    career: "Tiempo de lanzar aquello en lo que llevas tiempo pensando. Un cambio de trabajo, de dirección, montar tu propio negocio: todo eso lo respalda la energía del año. La clave del éxito: actuar por tu cuenta, no esperar permiso. Una posición de liderazgo te resulta natural. Si trabajas por cuenta ajena, toma la iniciativa en un nuevo proyecto. Si pensabas en marcharte, este año es ideal para empezar.",
    careerRisks: "Conflicto con la dirección por tu afán de independencia. Renunciar 'hacia la nada' sin un plan. Decepción por un arranque lento.",
    careerOpportunities: "Crear tu propia marca o negocio. Pasar a un nuevo sector. Conseguir un puesto directivo. Contactos internacionales.",
    careerRecommendations: "Empieza poco a poco, pero empieza sin falta. Crea un producto mínimo viable. Busca un mentor en el nuevo campo. No quemes las naves: haz una transición gradual.",
    relationships: "Un año de individualidad. Las relaciones pueden ponerse a prueba: estás cambiando y tu pareja necesita tiempo para aceptar al nuevo tú. Los nuevos encuentros serán significativos: cada persona que entra en tu vida en el Año del Mago juega un papel importante en el próximo ciclo. Quien esté soltero puede conocer a alguien que se convierta en una figura clave.",
    relationshipsRisks: "Una ruptura porque la pareja no acepta tus cambios. Soledad por hiperconcentrarte en los proyectos. Intentar controlar a la pareja.",
    relationshipsOpportunities: "Conocer a una persona afín. Renovar una relación existente. Una sociedad de negocios a través de vínculos personales.",
    relationshipsRecommendations: "Comparte tus planes con tu pareja. No te encierres en los proyectos. Reserva tiempo para la intimidad. Ábrete a nuevos encuentros, pero no te disperses.",
    health: "Presta atención a la cabeza y al sistema nervioso. Una alta carga mental puede llevar al agotamiento. La meditación y las prácticas conscientes serán especialmente útiles. Empieza un nuevo régimen de alimentación o deporte: todo lo iniciado en el Año del Mago tiene un efecto a largo plazo.",
    healthRisks: "Dolores de cabeza, migrañas, insomnio por sobreexcitación. Agotamiento del sistema nervioso. Ignorar el cuerpo por el trabajo mental.",
    healthRecommendations: "Establece un horario de sueño. Empieza a meditar, aunque sean 10 minutos al día. Deporte centrado en el cuerpo (yoga, natación). Minimiza los estimulantes (café, redes sociales).",
    innerState: "Dentro de ti pueden luchar dos estados: la euforia por las nuevas oportunidades y el miedo a lo desconocido. Es normal. El Mago está entre mundos, entre lo viejo y lo nuevo. Acepta esa dualidad. No reprimas ni la alegría ni el miedo. Usa ambos como combustible.",
    innerStateRecommendations: "Lleva un diario de observaciones. Anota tus ideas: son valiosas. Trabaja con afirmaciones: 'Comienzo lo nuevo con confianza y claridad'. Busca un mentor o un grupo de apoyo.",
    energyInteractions: "La energía del Mago se intensifica en los meses cuyas cifras suman 1 (enero, octubre). La energía conflictiva llega en los meses con vibración 4 y 8 (abril, agosto): aquí hace falta más estructura y paciencia. El mayor potencial de realización está en mayo (vibración 5, expansión) y septiembre (vibración 9, cierre de la etapa preparatoria).",
    additionalInsight: "Según el sistema de Kapustin, el Año del Mago es el 'año de la concepción'. Todo lo concebido este año se irá desplegando durante los próximos 3–4 años. Por eso es crucial: 1) definir con claridad tus metas; 2) escribirlas; 3) dar los primeros pasos, aunque parezcan pequeños. El Mago no espera: actúa.",
    risks: [
      "Decisiones impulsivas sin plan: 'empiezo y ya veré'",
      "Intentar controlar todo a tu alrededor: microgestión",
      "Sobrestimar tus fuerzas al inicio: asumir demasiados compromisos",
      "Conflictos por querer hacerlo todo a tu manera: ignorar consejos",
      "Pérdida de foco: demasiadas ideas, ninguna llevada a término",
      "Imprudencia financiera: gastar dinero en proyectos poco realistas",
    ],
    repeatingPatterns: "Si en el ciclo anterior no terminaste lo que empezaste, ese patrón puede repetirse. Un Mago sin disciplina es solo un ilusionista. Atención: si sientes el impulso de 'empezar todo de nuevo' sin motivo, puede ser huida, no desarrollo.",
    opportunities: [
      "Crear un nuevo negocio o proyecto desde cero",
      "Conocer a un mentor o a un socio clave",
      "Desarrollar una habilidad única que se convierta en tu 'as'",
      "Una mudanza o un cambio radical de estilo de vida",
      "Lanzar una marca personal o presencia mediática",
      "Adquirir nuevos conocimientos y certificaciones",
    ],
    recommendations: [
      "Empieza poco a poco, pero empieza sin falta: da al menos un paso cada día",
      "Anota todas las ideas: te servirán en los próximos años",
      "No temas ser el primero: la energía del año apoya a los pioneros",
      "Confía en la intuición, pero verifica los hechos: el Mago usa ambos hemisferios",
      "Minimiza la influencia de la opinión ajena en tus decisiones",
      "Busca un mentor: incluso el Mago necesita un sabio consejero",
      "Crea un 'mapa del año': visualiza tus metas",
      "Invierte en ti: formación, salud, habilidades",
    ],
    whatToAvoid: [
      "No te disperses: elige 1–2 proyectos clave",
      "No manipules a las personas por los resultados",
      "No ignores tu salud por 'grandes metas'",
      "No asumas grandes deudas por ideas no probadas",
      "No quemes las naves: los viejos vínculos aún serán útiles",
    ],
    conclusion: "El Año del Mago es el año en que asientas los cimientos de los próximos 22 años. No te apresures, pero tampoco te demores. Actúa con conciencia, confía en ti y prepárate para que el mundo responda a tus peticiones más rápido de lo habitual. Eres el creador. Actúa como un creador.",
    keyThought: "Todo lo que empieces en el Año del Mago crecerá y se desarrollará. Elige tus semillas con conciencia.",
    mainVector: "Iniciación de un nuevo ciclo → elección consciente de dirección → primeras acciones → asentar cimientos para 22 años",
    monthlyFocus: NO_MONTHS,
  },
  2: {
    intro: "Entras en el Año de la Sacerdotisa, el segundo año del ciclo de 22 años. Si el Año del Mago iba de acción y arranque, el Año de la Sacerdotisa va de silencio, profundidad y trabajo interior. El Universo te frena para que puedas ver lo que está oculto a la vista.",
    mainEnergy: "La energía de la intuición, el silencio, el conocimiento interior. El arquetipo de la Sacerdotisa es la guardiana de los secretos, que sabe más de lo que dice.",
    overview: "El Año de la Sacerdotisa es un tiempo de silencio, intuición y trabajo interior. El Universo te frena para que puedas ver lo oculto. No es un año de actos activos, sino de observación, análisis y preparación. Confía en las señales y las coincidencias. Todo lo que sembraste el año pasado germina ahora bajo tierra: no ves los resultados, pero se están formando.",
    deepMeaning: "La Sacerdotisa es la guardiana del conocimiento y los secretos. Este año se te revelarán los motivos ocultos de las personas, las verdaderas causas de los hechos, los mecanismos secretos de tu vida. No apresures el proceso. La información llega en el silencio. Los sueños, las coincidencias, los encuentros 'casuales': todo son mensajes.",
    strengths: [
      "Intuición aguda: sientes la mentira y la verdad a un nivel profundo",
      "La capacidad de ver lo oculto: los verdaderos motivos de la gente se hacen evidentes",
      "Profundidad de comprensión: lo que antes era confuso ahora se aclara",
      "Paciencia y sabiduría: dejas de apresurar los acontecimientos",
      "Energía sanadora: puedes ayudar a otros con tu sola presencia",
    ],
    weaknesses: [
      "Pasividad: esperar en lugar de actuar cuando hace falta acción",
      "Dependencia de la opinión ajena: la voz interior queda ahogada por el ruido externo",
      "Reprimir las emociones: ser el 'niño/a bueno/a' en lugar de auténtico",
      "Ignorar las señales intuitivas: la mente racional bloquea el sentir",
      "Aislamiento: retirarse del mundo en lugar de un silencio consciente",
    ],
    distortions: "La distorsión de la Sacerdotisa es la 'Sacerdotisa congelada': alguien que se retira tanto en sí mismo que pierde el contacto con la realidad. La segunda es la 'falsa profetisa': hacer pasar las fantasías por intuición. La tercera es la 'víctima del silencio': la incapacidad de expresar los propios sentimientos y necesidades.",
    lifeExamples: "Manifestaciones típicas: necesidad de soledad, sueños proféticos, el descubrimiento 'casual' de información importante, la sensación de 'lo sabía de antemano'. Puedes interesarte por la psicología, el esoterismo, la meditación. Quienes te rodean pueden considerarte 'raro/a': es normal.",
    money: "El dinero llega no por la acción agresiva, sino por la paciencia y los vínculos adecuados. Son posibles ingresos inesperados a través de mujeres o de una asociación. No es momento de inversiones arriesgadas: conserva lo que tienes. La sabiduría financiera está en la moderación.",
    moneyRisks: "Estancamiento financiero por indecisión. Oportunidades perdidas por 'esperar el momento perfecto'. Fraude: en el silencio es más fácil ser engañado.",
    moneyOpportunities: "Ingresos por consultoría y mentoría. Ingresos pasivos de proyectos creados antes. Proyectos de asociación con personas de confianza.",
    moneyRecommendations: "No apresures las decisiones financieras. Crea un colchón de seguridad. Invierte en conocimiento, no en proyectos arriesgados. Confía en la intuición en las finanzas, pero verifica.",
    career: "Tiempo de aprender y acumular conocimiento. Los avances profesionales son improbables, pero la preparación para ellos avanza a pleno ritmo. Bueno para el trabajo de investigación, la psicología, la creatividad. Evita los conflictos públicos. Si sientes que 'no pasa nada', es engañoso. Te preparas para un salto que ocurrirá el año que viene.",
    careerRisks: "Estancamiento y sensación de falta de sentido. Conflicto con una dirección agresiva. Agotamiento por la rutina.",
    careerOpportunities: "Estudio profundo y certificación. Mentoría. Crear contenido experto. Proyectos de investigación.",
    careerRecommendations: "Estudia. Lee. Investiga. Anota ideas e intuiciones. No fuerces el crecimiento profesional: llegará. Busca un mentor o un grupo de interés.",
    relationships: "Trabajo profundo sobre la relación. Empezarás a entender a tu pareja a un nuevo nivel. Pueden salir secretos a la luz: prepárate. Para los solteros, un encuentro es posible a través de la intuición: simplemente 'sentirás' a la persona adecuada. El año es favorable para trabajar con un psicólogo de pareja.",
    relationshipsRisks: "Callar los problemas. Encerrarte en ti en lugar de dialogar. Proyectar relaciones pasadas sobre la actual.",
    relationshipsOpportunities: "Profundizar la intimidad. Un nuevo nivel de confianza. Sanar viejas heridas. Conocer a una pareja 'kármica'.",
    relationshipsRecommendations: "Habla de tus sentimientos, aunque cueste. Escucha a tu pareja sin juzgar. Pasad tiempo juntos en silencio. Trabajad con un terapeuta de pareja.",
    health: "Sistema reproductivo, equilibrio hormonal, psicosomática. Atención a la salud emocional. Son útiles los tratamientos con agua, las prácticas de relajación, el trabajo con el subconsciente a través de los sueños. El sistema linfático requiere atención.",
    healthRisks: "Depresión por aislamiento. Problemas psicosomáticos: el cuerpo reacciona a las emociones reprimidas. Trastornos hormonales.",
    healthRecommendations: "Tratamientos con agua: piscina, sauna, baños. Trabajo corporal: yoga suave, qigong. Psicoterapia o trabajo con un psicólogo. Un diario de sueños.",
    innerState: "Dentro, una sensación de calma antes de la tormenta. Puede parecer que no pasa nada, pero en lo profundo hay un poderoso trabajo del subconsciente. Los sueños se vuelven vívidos y proféticos. La intuición se agudiza al máximo. Confía en ese estado: te prepara para la siguiente etapa.",
    innerStateRecommendations: "Medita a diario. Lleva un diario de sueños. Presta atención a las coincidencias. No llenes el silencio de ruido: en el silencio nacen las respuestas.",
    energyInteractions: "La energía de la Sacerdotisa se intensifica en febrero, junio y noviembre. La energía conflictiva llega en julio (la necesidad de análisis puede chocar con la energía activa del verano). Las intuiciones más profundas llegan de noche y en la luna menguante.",
    additionalInsight: "Según el sistema de Kapustin, el Año de la Sacerdotisa es el 'año de la maduración'. Las semillas sembradas en el Año del Mago germinan. Pero solo ves la parte superior. El sistema de raíces se forma sin que se vea. Tu tarea es no interferir en el proceso, no arrancar los brotes antes de tiempo. La paciencia es tu principal herramienta.",
    risks: [
      "Pasividad e indecisión: 'esperaré una señal'",
      "Dependencia de la opinión ajena: '¿qué dirán los demás?'",
      "Reprimir las emociones: 'no puedo enfadarme/entristecerme'",
      "Ignorar las señales intuitivas: 'son solo imaginaciones mías'",
      "Aislamiento en lugar de un silencio consciente",
      "Estados depresivos por la 'inmovilidad' exterior",
    ],
    repeatingPatterns: "Si tiendes a la codependencia, este año puede reforzar el patrón de 'ayudaré a todos olvidándome de mí'. La Sacerdotisa enseña: primero llénate, luego da. Si se repiten situaciones en las que no te escuchan, aprende a hablar más alto.",
    opportunities: [
      "Desarrollar la intuición y la percepción profunda",
      "Estudio profundo y certificación profesional",
      "Construir una asociación estratégica",
      "Sanar a través del autoconocimiento y la terapia",
      "Crear un producto intelectual (un libro, un curso)",
      "Trabajar con bloqueos del subconsciente",
    ],
    recommendations: [
      "Lleva un diario de sueños y observaciones: registra cada intuición",
      "No apresures los acontecimientos: tu momento llegará el año que viene",
      "Rodéate de silencio y naturaleza: ese es tu recurso",
      "Aprende a escuchar, no a hablar: la información viene hacia ti",
      "Desarrolla la energía femenina, sin importar el género: la receptividad",
      "Trabaja con un psicólogo o mentor",
      "Confía en los sueños: regístralos y analízalos",
      "Minimiza el ruido informativo: redes sociales, noticias",
    ],
    whatToAvoid: [
      "No fuerces los acontecimientos: no es el año de estrategias agresivas",
      "No ignores la intuición en favor de la 'lógica'",
      "No te retires al aislamiento total: silencio ≠ soledad",
      "No reprimas las emociones: dales salida en un entorno seguro",
      "No tomes grandes decisiones financieras de forma impulsiva",
    ],
    conclusion: "El Año de la Sacerdotisa es un año de sabiduría interior y paciencia. Asientas unos cimientos invisibles pero poderosos para el salto que viene. Todo lo que ahora comprendas sobre ti se convertirá en tu herramienta el año próximo. No te apresures. Observa. Siente. Confía en el proceso.",
    keyThought: "Las decisiones más poderosas nacen en el silencio. No temas la pausa: teme el ajetreo sin sentido.",
    mainVector: "Desaceleración → trabajo interior → desarrollo de la intuición → preparación para la siguiente etapa",
    monthlyFocus: NO_MONTHS,
  },
  3: {
    intro: "Entras en el Año de la Emperatriz, el tercer año del ciclo, un año de florecimiento y abundancia. Todo lo que se sembró en el Año del Mago y maduró en el Año de la Sacerdotisa empieza ahora a dar fruto. Es uno de los años más favorables para los resultados materiales.",
    mainEnergy: "La energía de la abundancia, la belleza, la creatividad y la maternidad. El arquetipo de la Emperatriz es la generosa madre-tierra que da y recibe.",
    overview: "El Año de la Emperatriz es florecimiento, abundancia, creatividad. Todo lo que sembraste antes empieza a dar fruto. Es un año de belleza, amor y prosperidad material. El Universo es generoso contigo: acepta con gratitud. La energía del año crea, literalmente, las condiciones para prosperar en todas las áreas.",
    deepMeaning: "La Emperatriz simboliza la fertilidad en todos los niveles: físico (dinero, cosas, salud), emocional (amor, alegría), creativo (proyectos, obras). Este año te enseña a recibir, no solo a dar. Muchas personas con una Emperatriz fuerte no saben recibir. Este año sana ese bloqueo.",
    strengths: [
      "Atractivo magnético: la gente se siente atraída hacia ti",
      "Suerte financiera: el dinero llega de fuentes inesperadas",
      "Un impulso creativo: las ideas se materializan con facilidad",
      "Plenitud emocional: sientes la vida con más intensidad",
      "La capacidad de crear belleza y comodidad a tu alrededor",
    ],
    weaknesses: [
      "Derroche: el 'puedo permitírmelo' se convierte en 'gasto sin medida'",
      "Pereza: la abundancia relaja y baja la motivación",
      "Celos y posesividad: miedo a perder lo conseguido",
      "Obsesión con la apariencia: la belleza se vuelve una idea fija",
      "Descuido de la disciplina: 'ya está todo bien'",
    ],
    distortions: "La distorsión de la Emperatriz es la 'madre tóxica': cuidado asfixiante, control a través del amor. La segunda es la 'hedonista': perseguir placeres sin crecimiento. La tercera es la 'envidiosa': la incapacidad de alegrarse del éxito ajeno, compararse con los demás.",
    lifeExamples: "Manifestaciones típicas: regalos inesperados, una subida de sueldo, un avance creativo, un embarazo (literal o metafórico, el 'nacimiento' de un proyecto), mejora de la apariencia, la compra de una casa o un coche.",
    money: "Uno de los mejores años financieros del ciclo. El dinero llega a través de la creatividad, la belleza, la comunicación. Son posibles regalos, herencias, bonificaciones inesperadas. Las inversiones en inmuebles y comodidad se justificarán. Monetizar lo que te gusta hacer.",
    moneyRisks: "Derroche. Compras emocionales. Préstamos para la 'vida bonita'. Dependencia del dinero ajeno.",
    moneyOpportunities: "Lanzar un proyecto creativo rentable. Comprar un inmueble. Invertir en belleza y bienestar. Ingresos pasivos de lo creado antes.",
    moneyRecommendations: "Disfruta de la abundancia, pero aparta un 20%. Invierte en inmuebles o activos a largo plazo. No prestes grandes sumas. Agradece cada ingreso.",
    career: "Las profesiones creativas en su punto álgido. Si trabajas con personas, belleza o arte, este es tu año. Avance a través del encanto personal y los contactos. La visibilidad pública y las redes sociales trabajan para ti. Es posible un ascenso o una bonificación importante.",
    careerRisks: "Relajación. Pérdida de disciplina. Conflictos por los celos de los colegas.",
    careerOpportunities: "Lanzar un proyecto creativo. Monetizar una afición. Crecimiento de la popularidad. Proyectos de asociación.",
    careerRecommendations: "Usa tu encanto. Hazte visible: habla, publica. No temas monetizar lo que amas. Trabaja con belleza.",
    relationships: "Un tiempo de amor y romanticismo. Las relaciones se llenan de calidez y pasión. Para los solteros, alta probabilidad de conocer pareja. Es posible un embarazo. Los lazos familiares se fortalecen. Es un año en el que quieres amar y ser amado.",
    relationshipsRisks: "Celos. Idealizar a la pareja. Codependencia. Infidelidad sobre un fondo de 'todo va bien'.",
    relationshipsOpportunities: "Una boda. Mudarse juntos. El nacimiento de un hijo. Viajar en pareja. Un nuevo nivel de intimidad.",
    relationshipsRecommendations: "Mima a tu pareja, pero no te olvides de ti. Pasad tiempo de calidad juntos. Crea belleza en tu espacio. No confundas el amor con la dependencia.",
    health: "Buena vitalidad. Riesgo de ganar peso: cuida la alimentación. Atención a la garganta y la tiroides. Date algún tratamiento de spa. El baile o el yoga son especialmente beneficiosos. La salud femenina está en foco.",
    healthRisks: "Aumento de peso. Problemas de tiroides. Comer en exceso por la abundancia emocional.",
    healthRecommendations: "Alimentación equilibrada. Baile, yoga, natación. Spa y masaje. Cuidado de la piel y el cuerpo. Revisiones periódicas.",
    innerState: "Dentro, una sensación de plenitud y gratitud. El mundo parece hermoso. Pero tras esto puede esconderse una resistencia a ver los problemas. Acepta tanto la alegría como las sombras: la Emperatriz te enseña a amar la realidad entera, no solo las partes bonitas.",
    innerStateRecommendations: "Practica la gratitud. Comparte tu alegría. Pero no cierres los ojos ante los problemas: resuélvelos desde un estado de recurso.",
    energyInteractions: "La energía de la Emperatriz se intensifica en primavera (marzo–mayo), el tiempo del florecimiento literal. Los meses de verano dan el máximo de actividad social. El otoño es la cosecha. El invierno es tiempo de reflexión y de preparar el año siguiente.",
    additionalInsight: "Según el sistema de Kapustin, el Año de la Emperatriz es el 'año de la cosecha de la primera siembra'. Todo lo concebido hace 2 años da resultados visibles. Si no hay resultados, la siembra fue de mala calidad. No te culpes, pero extrae la lección: en el próximo ciclo hay que sembrar con más conciencia.",
    risks: [
      "Derroche y vivir por encima de tus posibilidades",
      "Pereza y resistencia a desarrollarte: 'ya está bien así'",
      "Celos y posesividad en las relaciones",
      "Descuido de la disciplina y la rutina",
      "Codependencia: disolverte en otra persona",
      "Idealización: resistencia a ver la realidad",
    ],
    repeatingPatterns: "Si estás acostumbrado a 'merecer' el amor y el dinero, este año puede causar incomodidad: te dan cosas porque sí. Aprende a recibir sin culpa.",
    opportunities: [
      "Lanzar un proyecto creativo",
      "Monetizar aficiones y talentos",
      "Crecimiento de la popularidad y la influencia social",
      "Una adquisición material: una casa, un coche, obras de arte",
      "Mejorar la salud y la apariencia",
      "Fortalecer los lazos familiares",
    ],
    recommendations: [
      "Disfruta de la vida, pero no olvides el futuro",
      "Invierte el 20% de tus ingresos: la cosecha hay que conservarla",
      "Desarrolla el gusto estético: la belleza sana",
      "Sé generoso: volverá multiplicado",
      "Dedica atención a tu cuerpo y tu apariencia",
      "Crea un hogar acogedor: influye en todas las áreas de la vida",
      "Aprende a recibir: regalos, cumplidos, ayuda",
      "Agradece: cada noche anota 3 cosas por las que estés agradecido",
    ],
    whatToAvoid: [
      "No gastes más de lo que ganas",
      "No comas para tapar emociones: busca la causa",
      "No te compares con los demás: tu camino es único",
      "No asfixies a tu pareja con cuidados: déjale espacio",
      "No evites la disciplina: incluso en un año de abundancia hace falta estructura",
    ],
    conclusion: "El Año de la Emperatriz es un regalo del ciclo. Recíbelo con gratitud y sabiduría. Disfruta de la abundancia, pero mantén tu conciencia. Este año enseña lo esencial: eres digno de cosas buenas porque sí, sin condiciones.",
    keyThought: "La abundancia es un estado natural. Aprende a recibir, no solo a dar.",
    mainVector: "Florecimiento → resultados materiales → realización creativa → gratitud",
    monthlyFocus: NO_MONTHS,
  },
  4: {
    intro: "Entras en el Año del Emperador, el cuarto año del ciclo, un año de estructura, orden y cimientos. Tras el florecimiento de la Emperatriz, es hora de consolidar resultados, construir un sistema y poner orden en cada área de la vida.",
    mainEnergy: "La energía de la estructura, la disciplina, la responsabilidad y el poder. El arquetipo del Emperador es el constructor de imperios que crea orden a partir del caos.",
    overview: "El Año del Emperador exige un enfoque sistemático. Las acciones caóticas de años anteriores deben tomar forma. Crea procesos, documenta, organiza. Este año recompensa a quienes trabajan con un plan y castiga a quienes confían en la suerte.",
    deepMeaning: "El Emperador es el padre fundador. No inventa: construye. Tu tarea ahora no es buscar lo nuevo, sino fortalecer lo existente. Cada proceso, cada hábito, cada regla que establezcas este año trabajará para ti durante años.",
    strengths: ["Talento organizativo", "Liderazgo a través de la acción", "La capacidad de crear orden", "Responsabilidad y fiabilidad", "Pensamiento estratégico"],
    weaknesses: ["Autoritarismo", "Control excesivo", "Rigidez e inflexibilidad", "Adicción al trabajo", "Reprimir los sentimientos por 'el trabajo'"],
    distortions: "La distorsión del Emperador es el 'tirano': control por el control, supresión de la disidencia. La segunda es el 'líder irresponsable': exige a los demás pero no a sí mismo.",
    lifeExamples: "Manifestaciones típicas: comprar un inmueble, abrir un negocio, formar un equipo, asuntos legales, trámites, reformas, crear un plan a largo plazo.",
    money: "Ingresos estables a través del sistema y la organización. Tiempo para planes de negocio y estrategia financiera. El dinero llega por la estructura, no por la suerte. Los inmuebles son la mejor inversión del año.",
    moneyRisks: "Rigidez excesiva en las finanzas. Renunciar a gastos necesarios. Conflictos por dinero en la familia.",
    moneyOpportunities: "Comprar un inmueble. Crear una estrategia financiera. Estructurar un negocio. Crecimiento sistemático de los ingresos.",
    moneyRecommendations: "Haz un plan financiero a 3 años. Automatiza el ahorro. Resuelve los impuestos y los asuntos legales.",
    career: "Dirección, gestión. Te notan como líder. Es posible un ascenso o una ampliación de responsabilidades. Tiempo de sistematizar los procesos de trabajo. Si eres directivo, estás formando un equipo.",
    careerRisks: "Conflicto con la dirección. Sobrecarga de obligaciones. Un estilo autoritario aleja a los colegas.",
    careerOpportunities: "Ascenso a un puesto directivo. Estructurar procesos de negocio. Formar un equipo. Escalar.",
    careerRecommendations: "Aprende a delegar. Crea sistemas en lugar de hacerlo todo tú. Invierte en tu equipo.",
    relationships: "Estabilidad en las relaciones. La energía masculina domina (sin importar el género). Formalización: matrimonio, vivienda compartida, presupuesto común. Pero es importante no presionar a la pareja con la autoridad.",
    relationshipsRisks: "Controlar y reprimir a la pareja. Frialdad. Priorizar el trabajo sobre la relación.",
    relationshipsOpportunities: "Comprar una vivienda juntos. Matrimonio. Crear tradiciones familiares. Fortalecer los cimientos de la unión.",
    relationshipsRecommendations: "Equilibrio entre estructura y calidez. No controles a tu pareja. Reserva tiempo para la relación.",
    health: "Columna, rodillas, articulaciones: el sistema musculoesquelético. Estrés por la responsabilidad. Importante: movimiento regular, no estar 12 horas sentado a la mesa.",
    healthRisks: "Dolor de espalda. Problemas articulares. Estrés e hipertensión.",
    healthRecommendations: "Deporte centrado en la fuerza y la resistencia. Masaje. Descansos regulares. Gestión del estrés.",
    innerState: "Dentro, una necesidad de control y previsibilidad. Puede parecer que el mundo es caótico y que solo tú puedes arreglarlo todo. Es la ilusión del control. Aprende a confiar en el proceso y en los demás.",
    innerStateRecommendations: "Practica la delegación, tanto en el trabajo como en casa. Permite que otros se equivoquen. No cargues el mundo sobre tus hombros.",
    energyInteractions: "La energía del Emperador se intensifica en abril (su mes 'natal'). La energía conflictiva llega en diciembre (cansancio por la responsabilidad). El mejor trimestre para decisiones estratégicas es el Q1.",
    additionalInsight: "Según el sistema de Kapustin, el Año del Emperador es el 'año de los cimientos'. Todo lo que construyas y consolides ahora se convierte en la base de los próximos 5–7 años. Ahorrar en los cimientos significa pagarlo después.",
    risks: ["Autoritarismo y control", "Adicción al trabajo hasta el agotamiento", "Reprimir las emociones", "Inflexibilidad: 'solo mi camino es el correcto'", "Conflictos con los seres queridos por 'yo sé más'"],
    patterns: "Si estás acostumbrado a controlarlo todo y a todos, este año reforzará el patrón. Una prueba: si no puedes soltar el control ni un día, eso es un problema.",
    opportunities: ["Comprar o construir un inmueble", "Crear un negocio o sistematizar uno existente", "Ascenso a un puesto de dirección", "Crear estrategias a largo plazo", "Formalizar legalmente asuntos importantes"],
    recommendations: ["Construye un sistema, no te agarres a todo", "Delega: no puedes hacerlo todo tú", "Invierte en los cimientos: salud, hogar, relaciones", "Sé estricto pero justo", "Haz un plan de al menos 3 años por delante"],
    avoid: ["No presiones a la gente: lidera, no des órdenes", "No olvides el descanso: un Emperador sin energía es un tirano", "No ignores los sentimientos por 'el trabajo'", "No asumas la responsabilidad ajena"],
    conclusion: "El Año del Emperador es el año en que construyes tu fortaleza. Cada ladrillo, cada proceso, cada regla es una inversión en tu futuro. Construye con solidez, pero no olvides que una fortaleza sin calidez es una prisión.",
    keyThought: "La estructura sin alma es una prisión. El alma sin estructura es caos. Tu tarea es unir ambas.",
    mainVector: "Sistematización → construcción de cimientos → fortalecimiento de posiciones → planificación a largo plazo",
    monthlyFocus: NO_MONTHS,
  },
  5: {
    intro: "El Año del Sumo Sacerdote, el quinto año del ciclo. Un año de tradiciones, aprendizaje y búsqueda de sentido. Tras construir la estructura (el Emperador) llega el momento de llenarla de contenido.",
    mainEnergy: "La energía de la sabiduría, las tradiciones, la enseñanza y la búsqueda espiritual.",
    overview: "El Año del Sumo Sacerdote es un tiempo de aprendizaje profundo y de transmisión de conocimiento. O aprendes o enseñas, a menudo ambas cosas a la vez. Las tradiciones, los rituales y las prácticas espirituales cobran un significado especial.",
    deepMeaning: "El Sumo Sacerdote es un puente entre lo terrenal y lo sagrado. Este año te sentirás atraído por el conocimiento profundo: filosofía, psicología, tradiciones espirituales. No te resistas. Es el año en que las respuestas llegan a través de maestros, libros y prácticas.",
    strengths: ["Sabiduría y profundidad de comprensión", "La capacidad de enseñar e inspirar", "Conexión con la tradición y la cultura", "Una brújula moral", "Paciencia y método"],
    weaknesses: ["Moralizar", "Dogmatismo", "Inflexibilidad de pensamiento", "Juzgar a los 'equivocados'", "Evitar lo nuevo"],
    distortions: "La distorsión del Sumo Sacerdote es el 'fariseo': predicar sin practicar, reglas para los demás pero no para sí mismo. La segunda es el 'sectario': apego fanático a un único sistema de conocimiento.",
    lifeExamples: "Manifestaciones típicas: matricularte en cursos, obtener un título, conocer a un maestro, iniciar una práctica espiritual, trabajar con un psicólogo, estudiar filosofía.",
    money: "Ingresos a través de la enseñanza, la consultoría, la mentoría, el trabajo experto. El dinero llega por el conocimiento y la autoridad, no por las ventas agresivas.",
    moneyRisks: "Ingresos bajos porque 'la espiritualidad no se vende'. Negarse a monetizar el conocimiento. Dependencia financiera de una institución.",
    moneyOpportunities: "Crear un curso o un libro. Consultoría. Certificación. Enseñanza. Charlas como experto.",
    moneyRecommendations: "Monetiza tu conocimiento: no es un pecado. Crea un producto experto. Invierte en educación.",
    career: "Entorno académico, mentoría, especialización. Formalizar habilidades mediante certificaciones. Si eres un experto, es hora de compartir tu conocimiento en público.",
    careerRisks: "Quedarse atascado en la teoría sin práctica. Choque de valores con el empleador. Perfeccionismo en la preparación.",
    careerOpportunities: "Lanzar un proyecto educativo. Hablar en conferencias. Mentoría. Escribir un libro.",
    careerRecommendations: "Aprende y enseña. Sistematiza tu conocimiento. Busca un mentor. Conviértete en mentor de alguien.",
    relationships: "Formalización de la relación: matrimonio, pasos oficiales, valores compartidos. Las relaciones se ponen a prueba en cuanto a la compatibilidad de valores. Si los valores difieren, se hará evidente.",
    relationshipsRisks: "Moralizar en la relación. Imponer tus puntos de vista a la pareja. Aburrimiento y rutina.",
    relationshipsOpportunities: "Profundizar a través de valores compartidos. Aprender juntos. Una práctica espiritual en pareja. Una boda.",
    relationshipsRecommendations: "Habla de los valores con tu pareja. Buscad un interés común para estudiar. No impongas tus puntos de vista.",
    health: "Garganta, oídos, sistema respiratorio. Psicosomática por palabras reprimidas. Prácticas de voz, canto, lectura en voz alta.",
    healthRisks: "Problemas de garganta (no dices tu verdad). Alergias. Estrés crónico por el perfeccionismo.",
    healthRecommendations: "Di la verdad: tu garganta te lo agradecerá. Prácticas de respiración. Canto. Revisiones periódicas.",
    innerState: "Una búsqueda de sentido y propósito. Preguntas como '¿por qué estoy aquí?' y '¿cuál es mi lección?'. Un proceso interior profundo que puede ser incómodo pero necesario.",
    innerStateRecommendations: "Meditación. Lectura filosófica. Trabajo con un mentor. Un diario de reflexiones. No temas las preguntas difíciles.",
    energyInteractions: "La energía del Sumo Sacerdote se intensifica en mayo y septiembre. La energía conflictiva llega en noviembre. El mejor momento para estudiar es el Q1 y el Q3.",
    additionalInsight: "Según el sistema de Kapustin, el Año del Sumo Sacerdote es el 'año de llenar de sentido'. La estructura construida antes recibe una base filosófica. Sin sentido, cualquier sistema es burocracia.",
    risks: ["Dogmatismo: 'solo hay un camino correcto'", "Moralizar: 'yo sé cómo debe ser'", "Evitar la experiencia nueva", "Perfeccionismo en el aprendizaje: 'aún no estoy listo'", "Pérdidas financieras por el trabajo experto 'gratis'"],
    patterns: "Si estás acostumbrado a aprender sin fin pero sin aplicar el conocimiento, este año reforzará el patrón. Una prueba: si has hecho 10 cursos pero no has ganado nada con el conocimiento, eso es un problema.",
    opportunities: ["Crear un producto educativo", "Obtener un título o certificación", "Conocer a un mentor", "Publicar un libro o curso", "Transformación espiritual"],
    recommendations: ["Aprende, pero aplica: el conocimiento sin práctica está muerto", "Comparte tu conocimiento: esa es tu misión este año", "Encuentra un equilibrio entre tradición e innovación", "Monetiza tu experiencia: es honesto", "Ábrete a la experiencia ajena"],
    avoid: ["No impongas tus puntos de vista", "No aprendas sin fin sin aplicar", "No ignores la práctica por la teoría", "No te cierres a lo nuevo"],
    conclusion: "El Año del Sumo Sacerdote es un año de sabiduría. Aprendes y enseñas, encuentras sentido y lo compartes. Lo esencial es no quedarse atascado en la teoría, sino aplicar el conocimiento en la vida.",
    keyThought: "La sabiduría es conocimiento aplicado en la vida. Sin aplicación, es solo información.",
    mainVector: "Aprendizaje → búsqueda de sentido → transmisión de conocimiento → crecimiento espiritual",
    monthlyFocus: NO_MONTHS,
  },
};

// ============================================================
// Themes for arcana 6–22 (short per-arcana blocks)
// ============================================================
const themesEN: Record<number, Theme> = {
  6: { focus: "choice, love and responsibility for decisions", money: "Financial decisions at a crossroads. It's important to choose one direction and commit fully. Scattering funds across 2–3 projects will bring losses.", rel: "A key year for relationships: deciding to be together or to part. Choosing a partner or conscious solitude. There is no middle ground.", career: "A choice between two paths. Partnership projects. Working with people. The need to settle on a direction.", health: "Cardiovascular system. Emotional overload. Breathing practices.", inner: "An inner struggle between 'want' and 'should', between two options. Learn to choose with the heart but check with the mind." },
  7: { focus: "movement, victory and achievement", money: "Active income growth. Money comes through action, speed and competition. Rewards for effort. Bonuses and premiums.", rel: "Dynamic relationships. Joint travel and adventure. The partner must share your rhythm.", career: "Ambitious goals are attainable. Rapid advancement. Competition works for you. Time to claim rewards.", health: "Muscular system. Adrenaline. Injuries from haste. Sport is a must, but without fanaticism.", inner: "A feeling of speed and flow. Adrenaline. It's important not to lose yourself in the race for results." },
  8: { focus: "strength, endurance and an inner core", money: "Stable income through persistent, methodical work. Not through luck, but through sweat and patience. Legal matters in finances.", rel: "A test of the relationship's strength. Whoever is stronger in the couple sets the tone. A struggle for leadership.", career: "Endurance and patience lead to success. Legal professions, HR, security forces.", health: "Muscular system, teeth, bones. Stress from overexertion. Strength training.", inner: "An inner struggle with yourself. Overcoming. Tempering character through hardship." },
  9: { focus: "solitude, wisdom and the search for life's meaning", money: "Cutting expenses. Minimalism as a financial strategy. Money through research, analysis, deep expertise.", rel: "A need for solitude. Silence in the relationship. The partner needs to accept your need for space.", career: "Research, analysis, inner work. Withdrawal from the public eye. Deep expertise.", health: "Nervous system. Depressive states. Walks in nature. Minimal stimulants.", inner: "A deep search for meaning. Existential questions. A need for solitude to find answers." },
  10: { focus: "change, luck and karmic turns", money: "Unexpected financial turns — both luck and losses. Wins and losses. Diversification is a must.", rel: "Karmic meetings. People returning from the past. Fateful acquaintances. Everything can change in a single day.", career: "Sharp changes — be ready for the unexpected. New opportunities out of nowhere. Dismissals and promotions.", health: "Nervous system from unpredictability. Adaptability. Grounding practices.", inner: "A 'rollercoaster' feeling. Learn to accept uncertainty as the norm." },
  11: { focus: "justice, balance and karmic reckoning", money: "You'll get exactly what you've earned. Karmic reckoning. Debts come back — in both directions.", rel: "A fair resolution of conflicts. Legal matters in the relationship. Divorce or reconciliation — by fairness.", career: "Law, HR, mediation. Honesty is rewarded. Dishonesty is punished.", health: "Kidneys, lower back. Balance. Autonomic nervous system.", inner: "An inner court — you assess your past decisions. It's important to be fair to yourself too." },
  12: { focus: "sacrifice, pause and a deep transformation of consciousness", money: "Financial stagnation. Not a time for active investment. Preserve and minimize spending. Money through service.", rel: "Sacrifice in the relationship. Learn to let go. Someone may leave — and that is necessary.", career: "A forced pause. Time to rethink the whole path. Volunteering. Helping professions.", health: "Lymphatic system. Swelling. Stagnation. Movement and cleansing.", inner: "A feeling of being 'suspended' — the old world is collapsing, the new hasn't arrived. Accepting the pause." },
  13: { focus: "transformation, completion and radical rebirth", money: "Old income sources close. New ones haven't opened yet. Financial transformation. Let go — the new will come.", rel: "A deep transformation or the ending of the relationship. Don't hold on to the dead. Letting go is an act of love.", career: "A cardinal change of direction. Dismissal or closing a business. But after death — resurrection.", health: "Immune system. Cleansing. Detox. Hidden illnesses come to the surface.", inner: "Fear of change and at the same time its inevitability. The death of the ego — the birth of the true Self." },
  14: { focus: "balance, patience and the harmonizing of all processes", money: "Moderate but stable income. The golden mean. Not a time for extremes in finances.", rel: "Time to harmonize the relationship. Compromises. Balancing 'give and take'. Calm and stability.", career: "Medicine, healing, balancing processes. Working with people. Mediation.", health: "Metabolism. Hormonal balance. Moderation in food and exercise.", inner: "A search for harmony between extremes. Learn to find the middle without sacrifices." },
  15: { focus: "temptations, addictions and the shadow side of the personality", money: "Money through risky schemes — beware of greed. Great earning potential, but also a great risk of losses.", rel: "Passion and dependence. Toxic patterns. Sexual energy at its peak. A test of codependency.", career: "Marketing, sales, finance, influence. Don't cross the ethical line. Big money = big responsibility.", health: "Addictions — alcohol, food, sex, social media. Liver. Reproductive system.", inner: "A meeting with the shadow side. Temptations and seductions. Your choice defines the coming years." },
  16: { focus: "the destruction of the old, unexpected events and total renewal", money: "Financial upheavals. The collapse of familiar structures. But after the destruction — a clean site for the new.", rel: "Shocking events in the relationship. Breaking patterns. The truth comes out. Either renewal or a breakup.", career: "Dismissal, bankruptcy — but also a chance for total renewal. Crisis as opportunity.", health: "Injuries. Shock states. Adrenal glands. Nervous system. Working with a psychologist is a must.", inner: "Shock and liberation at once. Everything inauthentic collapses, so that only the genuine remains." },
  17: { focus: "hope, inspiration and a new vision of the future", money: "Money through creativity and innovation. Inspiration = income. Crowdfunding, social projects.", rel: "Lightness and freshness in the relationship. A new infatuation. Hope for a future together.", career: "Innovation, technology, art. Time to dream big and bring dreams to life.", health: "The nervous system recovers after the 'Tower'. Lungs. Circulation.", inner: "The rebirth of hope after a crisis. A feeling of a 'new life'. Faith in yourself and the world." },
  18: { focus: "illusions, fears and working with the subconscious", money: "Financial uncertainty. Don't believe promises. Check everything twice. Be careful with investments.", rel: "Illusions and disappointments in the relationship. Check your intuition against facts. Secrets and mysteries.", career: "Psychology, esoterics, creativity. Working with the subconscious. Beware of deception and fraud.", health: "Mental health. Insomnia. Anxiety. Phobias. Working with fears.", inner: "Immersion in the subconscious. Fears come to the surface. Working with the shadow through therapy." },
  19: { focus: "joy, success and full self-realization", money: "One of the best financial years. The generosity of the Universe. Money comes easily and joyfully.", rel: "Joy, harmony, warmth. The birth of children. Relationships fill with light and happiness.", career: "Public visibility, recognition, success. Everything works out. Time to be on stage and shine.", health: "Excellent vitality. Heart. Solar plexus. Energy at its peak.", inner: "A feeling of happiness and fullness of life. It was all worth it. The joy of being." },
  20: { focus: "judgement, taking stock and transformation through awareness", money: "A karmic tally. You'll get what you deserve — both the good and the bad. An honest financial reckoning.", rel: "Karmic relationships end or move to a new level. Relationships with the lineage are in focus.", career: "Assessment of results. Promotion or dismissal based on outcomes. A re-evaluation of the whole career path.", health: "Hearing. Voice. Throat. Karmic illnesses. Healing through forgiveness.", inner: "A deep re-evaluation of your whole life. What was done right? What wasn't? Forgiveness and acceptance." },
  21: { focus: "the completion of the cycle, fullness and achievement", money: "An abundant year. Everything earned bears fruit. International finances. Large deals.", rel: "Fullness of the relationship. Traveling together. A sense of completion and harmony.", career: "International projects. Recognition. Completing a major undertaking. The peak of the career cycle.", health: "Overall vitality is high. Legs, circulation. Dancing, travel.", inner: "A feeling of completion and wholeness. But behind the fullness may hide a fear of a new beginning." },
  22: { focus: "freedom, beginning and a leap into the unknown", money: "Unpredictable finances. Prepare for adventures. Money through unconventional paths.", rel: "Freedom and lightness. Unusual acquaintances. Reluctance to commit. Free relationships.", career: "Startups, travel, unconventional solutions. Freedom from the system. Freelancing.", health: "Nervous system from uncertainty. Feet, ankles. Movement and freedom of the body.", inner: "A feeling of freedom and at the same time chaos. Fear of the unknown and joy from discoveries." },
};

const themesES: Record<number, Theme> = {
  6: { focus: "la elección, el amor y la responsabilidad por las decisiones", money: "Decisiones financieras en una encrucijada. Es importante elegir una dirección y comprometerse del todo. Dispersar fondos en 2–3 proyectos traerá pérdidas.", rel: "Un año clave para las relaciones: decidir estar juntos o separarse. Elegir pareja o una soledad consciente. No hay término medio.", career: "Una elección entre dos caminos. Proyectos de asociación. Trabajo con personas. La necesidad de decidir una dirección.", health: "Sistema cardiovascular. Sobrecarga emocional. Prácticas de respiración.", inner: "Una lucha interior entre el 'quiero' y el 'debo', entre dos opciones. Aprende a elegir con el corazón pero a verificar con la mente." },
  7: { focus: "el movimiento, la victoria y los logros", money: "Crecimiento activo de ingresos. El dinero llega por la acción, la velocidad y la competencia. Recompensas por el esfuerzo. Bonificaciones y primas.", rel: "Relaciones dinámicas. Viajes y aventuras conjuntas. La pareja debe compartir tu ritmo.", career: "Las metas ambiciosas son alcanzables. Avance rápido. La competencia trabaja a tu favor. Tiempo de recoger recompensas.", health: "Sistema muscular. Adrenalina. Lesiones por las prisas. El deporte es obligatorio, pero sin fanatismo.", inner: "Una sensación de velocidad y de flujo. Adrenalina. Es importante no perderte en la carrera por los resultados." },
  8: { focus: "la fuerza, la resistencia y un eje interior", money: "Ingresos estables a través del trabajo constante y metódico. No por suerte, sino por sudor y paciencia. Asuntos legales en las finanzas.", rel: "Una prueba de la solidez de la relación. Quien es más fuerte en la pareja marca el tono. Una lucha por el liderazgo.", career: "La resistencia y la paciencia llevan al éxito. Profesiones jurídicas, RR. HH., cuerpos de seguridad.", health: "Sistema muscular, dientes, huesos. Estrés por sobreesfuerzo. Entrenamiento de fuerza.", inner: "Una lucha interior contigo mismo. Superación. Templar el carácter a través de las dificultades." },
  9: { focus: "la soledad, la sabiduría y la búsqueda del sentido de la vida", money: "Reducir gastos. El minimalismo como estrategia financiera. Dinero a través de la investigación, el análisis, la experiencia profunda.", rel: "Necesidad de soledad. Silencio en la relación. La pareja necesita aceptar tu necesidad de espacio.", career: "Investigación, análisis, trabajo interior. Alejamiento de la vida pública. Experiencia profunda.", health: "Sistema nervioso. Estados depresivos. Paseos por la naturaleza. Mínimo de estimulantes.", inner: "Una búsqueda profunda de sentido. Preguntas existenciales. Necesidad de soledad para hallar respuestas." },
  10: { focus: "el cambio, la suerte y los giros kármicos", money: "Giros financieros inesperados, tanto suerte como pérdidas. Ganancias y pérdidas. La diversificación es obligatoria.", rel: "Encuentros kármicos. Personas que regresan del pasado. Conocidos decisivos. Todo puede cambiar en un solo día.", career: "Cambios bruscos: prepárate para lo inesperado. Nuevas oportunidades de la nada. Despidos y ascensos.", health: "Sistema nervioso por la imprevisibilidad. Adaptabilidad. Prácticas de enraizamiento.", inner: "Una sensación de 'montaña rusa'. Aprende a aceptar la incertidumbre como norma." },
  11: { focus: "la justicia, el equilibrio y el ajuste de cuentas kármico", money: "Recibirás exactamente lo que has merecido. Ajuste de cuentas kármico. Las deudas vuelven, en ambos sentidos.", rel: "Una resolución justa de los conflictos. Asuntos legales en la relación. Divorcio o reconciliación, según la justicia.", career: "Derecho, RR. HH., mediación. La honestidad se recompensa. La deshonestidad se castiga.", health: "Riñones, zona lumbar. Equilibrio. Sistema nervioso autónomo.", inner: "Un tribunal interior: evalúas tus decisiones pasadas. Es importante ser justo también contigo mismo." },
  12: { focus: "el sacrificio, la pausa y una profunda transformación de la conciencia", money: "Estancamiento financiero. No es momento de inversiones activas. Conserva y minimiza gastos. Dinero a través del servicio.", rel: "Sacrificio en la relación. Aprende a soltar. Alguien puede marcharse, y eso es necesario.", career: "Una pausa forzosa. Tiempo de repensar todo el camino. Voluntariado. Profesiones de ayuda.", health: "Sistema linfático. Edemas. Estancamientos. Movimiento y purificación.", inner: "La sensación de estar 'suspendido': el viejo mundo se derrumba, el nuevo no ha llegado. Aceptar la pausa." },
  13: { focus: "la transformación, el cierre y un renacimiento radical", money: "Las viejas fuentes de ingresos se cierran. Las nuevas aún no se han abierto. Transformación financiera. Suelta y llegará lo nuevo.", rel: "Una transformación profunda o el final de la relación. No te aferres a lo muerto. Soltar es un acto de amor.", career: "Un cambio cardinal de dirección. Despido o cierre de un negocio. Pero tras la muerte, la resurrección.", health: "Sistema inmunitario. Purificación. Detox. Las enfermedades ocultas salen a la superficie.", inner: "Miedo al cambio y, a la vez, su inevitabilidad. La muerte del ego, el nacimiento del verdadero Yo." },
  14: { focus: "el equilibrio, la paciencia y la armonización de todos los procesos", money: "Ingresos moderados pero estables. El justo medio. No es momento de extremos en las finanzas.", rel: "Tiempo de armonizar la relación. Compromisos. Equilibrar el 'dar y recibir'. Calma y estabilidad.", career: "Medicina, sanación, equilibrio de procesos. Trabajo con personas. Mediación.", health: "Metabolismo. Equilibrio hormonal. Moderación en la comida y el ejercicio.", inner: "Una búsqueda de armonía entre los extremos. Aprende a hallar el medio sin sacrificios." },
  15: { focus: "las tentaciones, las adicciones y el lado oscuro de la personalidad", money: "Dinero a través de esquemas arriesgados: cuidado con la codicia. Gran potencial de ganancia, pero también gran riesgo de pérdidas.", rel: "Pasión y dependencia. Patrones tóxicos. Energía sexual al máximo. Una prueba de codependencia.", career: "Marketing, ventas, finanzas, influencia. No cruces la línea ética. Mucho dinero = mucha responsabilidad.", health: "Adicciones: alcohol, comida, sexo, redes sociales. Hígado. Sistema reproductivo.", inner: "Un encuentro con el lado oscuro. Tentaciones y seducciones. Tu elección define los próximos años." },
  16: { focus: "la destrucción de lo viejo, los acontecimientos inesperados y la renovación total", money: "Sacudidas financieras. El derrumbe de las estructuras habituales. Pero tras la destrucción, un terreno limpio para lo nuevo.", rel: "Acontecimientos impactantes en la relación. Ruptura de patrones. La verdad sale a la luz. O renovación o ruptura.", career: "Despido, quiebra, pero también una oportunidad de renovación total. La crisis como oportunidad.", health: "Lesiones. Estados de shock. Glándulas suprarrenales. Sistema nervioso. El trabajo con un psicólogo es obligatorio.", inner: "Shock y liberación a la vez. Todo lo inauténtico se derrumba para que quede solo lo genuino." },
  17: { focus: "la esperanza, la inspiración y una nueva visión del futuro", money: "Dinero a través de la creatividad y la innovación. Inspiración = ingresos. Crowdfunding, proyectos sociales.", rel: "Ligereza y frescura en la relación. Un nuevo enamoramiento. Esperanza en un futuro juntos.", career: "Innovación, tecnología, arte. Tiempo de soñar a lo grande y materializar los sueños.", health: "El sistema nervioso se recupera tras la 'Torre'. Pulmones. Circulación.", inner: "El renacer de la esperanza tras una crisis. La sensación de una 'nueva vida'. Fe en ti y en el mundo." },
  18: { focus: "las ilusiones, los miedos y el trabajo con el subconsciente", money: "Incertidumbre financiera. No creas en las promesas. Verifícalo todo dos veces. Cuidado con las inversiones.", rel: "Ilusiones y decepciones en la relación. Contrasta tu intuición con los hechos. Secretos y misterios.", career: "Psicología, esoterismo, creatividad. Trabajo con el subconsciente. Cuidado con el engaño y el fraude.", health: "Salud mental. Insomnio. Ansiedad. Fobias. Trabajo con los miedos.", inner: "Inmersión en el subconsciente. Los miedos salen a la superficie. Trabajo con la sombra a través de la terapia." },
  19: { focus: "la alegría, el éxito y la plena autorrealización", money: "Uno de los mejores años financieros. La generosidad del Universo. El dinero llega fácil y con alegría.", rel: "Alegría, armonía, calidez. El nacimiento de hijos. Las relaciones se llenan de luz y felicidad.", career: "Visibilidad pública, reconocimiento, éxito. Todo sale bien. Tiempo de estar en el escenario y brillar.", health: "Excelente vitalidad. Corazón. Plexo solar. La energía al máximo.", inner: "Una sensación de felicidad y plenitud de vida. Todo valió la pena. La alegría de existir." },
  20: { focus: "el juicio, el balance y la transformación a través de la toma de conciencia", money: "Un recuento kármico. Recibirás lo que mereces, lo bueno y lo malo. Un balance financiero honesto.", rel: "Las relaciones kármicas terminan o pasan a un nuevo nivel. La relación con el linaje está en foco.", career: "Evaluación de resultados. Ascenso o despido según los resultados. Una reevaluación de toda la trayectoria profesional.", health: "Oído. Voz. Garganta. Enfermedades kármicas. Sanación a través del perdón.", inner: "Una reevaluación profunda de toda tu vida. ¿Qué se hizo bien? ¿Qué no? Perdón y aceptación." },
  21: { focus: "el cierre del ciclo, la plenitud y el logro", money: "Un año abundante. Todo lo ganado da frutos. Finanzas internacionales. Grandes acuerdos.", rel: "Plenitud de la relación. Viajar juntos. Una sensación de plenitud y armonía.", career: "Proyectos internacionales. Reconocimiento. El cierre de un gran asunto. La cima del ciclo profesional.", health: "La vitalidad general es alta. Piernas, circulación. Baile, viajes.", inner: "Una sensación de plenitud y totalidad. Pero tras la plenitud puede esconderse el miedo a un nuevo comienzo." },
  22: { focus: "la libertad, el comienzo y un salto a lo desconocido", money: "Finanzas impredecibles. Prepárate para las aventuras. Dinero por caminos poco convencionales.", rel: "Libertad y ligereza. Encuentros inusuales. Rechazo a los compromisos. Relaciones libres.", career: "Startups, viajes, soluciones poco convencionales. Libertad del sistema. Trabajo autónomo.", health: "Sistema nervioso por la incertidumbre. Pies, tobillos. Movimiento y libertad del cuerpo.", inner: "Una sensación de libertad y, a la vez, de caos. Miedo a lo desconocido y alegría por los descubrimientos." },
};

const DEFAULT_THEME_EN: Theme = { focus: "a new stage and transformation", money: "Attention to financial planning.", rel: "Time to work on the relationship.", career: "Developing professional skills.", health: "Attention to overall health.", inner: "Time for self-knowledge." };
const DEFAULT_THEME_ES: Theme = { focus: "una nueva etapa y transformación", money: "Atención a la planificación financiera.", rel: "Tiempo de trabajar la relación.", career: "Desarrollo de habilidades profesionales.", health: "Atención a la salud general.", inner: "Tiempo para el autoconocimiento." };

// ============================================================
// Arcana names (this file's numbering: 8 = Strength, 11 = Justice)
// ============================================================
const namesEN: Record<number, string> = {
  4: "the Emperor", 5: "the Hierophant", 6: "the Lovers", 7: "the Chariot",
  8: "Strength", 9: "the Hermit", 10: "the Wheel of Fortune", 11: "Justice",
  12: "the Hanged Man", 13: "Death", 14: "Temperance", 15: "the Devil",
  16: "the Tower", 17: "the Star", 18: "the Moon", 19: "the Sun",
  20: "Judgement", 21: "the World", 22: "the Fool",
};
const namesES: Record<number, string> = {
  4: "el Emperador", 5: "el Sumo Sacerdote", 6: "los Enamorados", 7: "el Carro",
  8: "la Fuerza", 9: "el Ermitaño", 10: "la Rueda de la Fortuna", 11: "la Justicia",
  12: "el Colgado", 13: "la Muerte", 14: "la Templanza", 15: "el Diablo",
  16: "la Torre", 17: "la Estrella", 18: "la Luna", 19: "el Sol",
  20: "el Juicio", 21: "el Mundo", 22: "el Loco",
};

// ============================================================
// Generic builders for arcana 6–22 (mirror generateFullYear fallback)
// ============================================================
function genericEN(arcana: number, name: string, t: Theme): YearProInterpretation {
  return {
    intro: `You are entering the Year of ${name} — the ${arcana}th year of your 22-year cycle. This is a period of ${t.focus}. The energy of this arcana defines the key themes, challenges and opportunities of the whole year.`,
    mainEnergy: `The energy of the ${name} archetype. Every event of this year carries its imprint — learn to recognize these patterns.`,
    overview: `The Year of ${name} is a period of ${t.focus}. The energy of this arcana shapes the key themes and challenges of the year. Pay attention to the signs and events that resonate with the ${name} archetype. Everything that happens is not random but part of the larger plan of your cycle.`,
    deepMeaning: `The arcana ${name} (${arcana}) carries a deep archetypal meaning. Throughout the year you'll face situations directly connected with the theme of this archetype. Pay attention to recurring motifs — they point to the main lesson of the year.`,
    strengths: [
      `Resonance with the energy of ${name} — you are in the flow`,
      "Heightened awareness within the year's theme",
      "An opportunity to work deeply on the key theme",
      "Synchronization with cyclical energies",
      "Access to the archetype's resources",
    ],
    weaknesses: [
      "Resistance to the year's energy — trying to go 'against the current'",
      "Unconsciously living out the archetype's themes",
      "Projecting the archetype's shadow onto others",
      "Avoiding the year's key lesson",
      "Getting stuck in the archetype's negative manifestations",
    ],
    distortions: `The distortion of ${name} appears when you resist the natural flow of the year's energy or use it destructively. Watch the patterns: if the same problem keeps repeating — you are in distortion.`,
    lifeExamples: `Typical manifestations of the Year of ${name}: situations connected with the theme of ${t.focus}. You'll meet people, events and circumstances directly linked to this archetype.`,
    money: t.money,
    moneyRisks: "Financial carelessness. Impulsive spending. Ignoring long-term planning.",
    moneyOpportunities: `Working with the energy of ${name} to attract resources. Using the year's cyclical energy for financial growth.`,
    moneyRecommendations: "Make a financial plan. Track your expenses. Invest consciously. Build a safety cushion.",
    career: t.career,
    careerRisks: "Loss of motivation. Conflict with your current direction. Resistance to change.",
    careerOpportunities: `Development through the theme of the ${name} arcana. New skills. Expanding your expertise.`,
    careerRecommendations: "Determine how the year's theme relates to your career. Use this connection for growth.",
    relationships: t.rel,
    relationshipsRisks: "Misunderstanding with your partner. Projections. Unspoken expectations.",
    relationshipsOpportunities: "Deepening through living the year's theme together. A new level of closeness.",
    relationshipsRecommendations: "Share your experiences with your partner. Be open. Learn together.",
    health: t.health || "Pay attention to your overall well-being. Prevention is better than cure. Maintain a balance between work and rest.",
    healthRisks: "Ignoring the body's signals. Stress. A disrupted routine.",
    healthRecommendations: "Regular sport. Healthy nutrition. Quality sleep. Preventive check-ups.",
    innerState: t.inner || "A period of inner transformation. Pay attention to your feelings and thoughts — they carry important messages.",
    innerStateRecommendations: "Meditation. Journaling. Working with a psychologist. Mindfulness in everyday life.",
    energyInteractions: `The energy of arcana ${arcana} (${name}) interacts with the monthly vibrations. The most harmonious periods are when the month's number forms a synergistic pair with the year's number. Conflicting periods require heightened awareness.`,
    additionalInsight: `In Kapustin's system, the Year of ${name} is ${arcana <= 11 ? "an active" : "a transformational"} phase of the cycle. ${arcana <= 7 ? "The first 7 arcana are a period of building and growth." : arcana <= 14 ? "Arcana 8–14 are a period of inner work and transformation." : "Arcana 15–22 are a period of completion, cleansing and preparation for a new cycle."}`,
    risks: [
      "Ignoring the year's key theme",
      "Resisting the natural flow of energies",
      "Repeating old mistakes without awareness",
      "Unwillingness to accept change",
      "Avoiding inner work",
      "Projecting your problems onto others",
    ],
    repeatingPatterns: `Pay attention to recurring situations — they point to an unfinished lesson. If in the previous cycle you didn't work through the theme of arcana ${arcana}, it will return with double force.`,
    opportunities: [
      `Deep work on the ${name} archetype`,
      "Developing the key quality of the year",
      "Using cyclical energy for a breakthrough",
      "Deepening self-knowledge through the year's theme",
      "Transforming weaknesses into strength",
      "Reaching a new level of awareness",
    ],
    recommendations: [
      `Study the symbolism of the ${name} arcana — understanding helps integration`,
      "Keep a journal of observations of events and signs",
      "Work with the shadow — it shows the zone of growth",
      "Trust the process, even when it's uncomfortable",
      "Find a mentor or a support group",
      "Practice mindfulness in everyday life",
      "Create a ritual to begin and end each month",
      "Don't compare your path with others'",
    ],
    whatToAvoid: [
      "Don't ignore recurring signs — they matter",
      "Don't force events — everything in its time",
      "Don't suppress emotions — they carry information",
      "Don't live someone else's life — your path is unique",
      "Don't run from discomfort — there is growth in it",
    ],
    conclusion: `The Year of ${name} is an important stage of your 22-year cycle. Every year carries a unique lesson and opportunities. Accept the energy of this year as an ally, not an obstacle. Work with it consciously, and it will open new horizons for you.`,
    keyThought: `The energy of ${name} is your teacher this year. Listen, learn, apply.`,
    mainVector: "Awareness of the theme → working it through → integration → reaching a new level",
    monthlyFocus: NO_MONTHS,
  };
}

function genericES(arcana: number, name: string, t: Theme): YearProInterpretation {
  return {
    intro: `Entras en el Año de ${name} — el año ${arcana} de tu ciclo de 22 años. Es un periodo de ${t.focus}. La energía de este arcano define los temas clave, los desafíos y las oportunidades de todo el año.`,
    mainEnergy: `La energía del arquetipo de ${name}. Cada acontecimiento de este año lleva su huella: aprende a reconocer estos patrones.`,
    overview: `El Año de ${name} es un periodo de ${t.focus}. La energía de este arcano da forma a los temas clave y a los desafíos del año. Presta atención a las señales y los acontecimientos que resuenan con el arquetipo de ${name}. Todo lo que ocurre no es casual, sino parte del gran plan de tu ciclo.`,
    deepMeaning: `El arcano ${name} (${arcana}) lleva en sí un profundo sentido arquetípico. A lo largo del año te enfrentarás a situaciones directamente ligadas al tema de este arquetipo. Presta atención a los motivos recurrentes: señalan la lección principal del año.`,
    strengths: [
      `Resonancia con la energía de ${name}: estás en el flujo`,
      "Mayor conciencia dentro del tema del año",
      "La posibilidad de trabajar a fondo el tema clave",
      "Sincronización con las energías cíclicas",
      "Acceso a los recursos del arquetipo",
    ],
    weaknesses: [
      "Resistencia a la energía del año: intentar ir 'contra corriente'",
      "Vivir los temas del arquetipo de forma inconsciente",
      "Proyectar la sombra del arquetipo sobre los demás",
      "Evitar la lección clave del año",
      "Quedarse atascado en las manifestaciones negativas del arquetipo",
    ],
    distortions: `La distorsión de ${name} aparece cuando te resistes al flujo natural de la energía del año o la usas de forma destructiva. Observa los patrones: si el mismo problema se repite, estás en distorsión.`,
    lifeExamples: `Manifestaciones típicas del Año de ${name}: situaciones ligadas al tema de ${t.focus}. Te encontrarás con personas, acontecimientos y circunstancias directamente vinculados a este arquetipo.`,
    money: t.money,
    moneyRisks: "Descuido financiero. Gastos impulsivos. Ignorar la planificación a largo plazo.",
    moneyOpportunities: `Trabajar con la energía de ${name} para atraer recursos. Usar la energía cíclica del año para el crecimiento financiero.`,
    moneyRecommendations: "Haz un plan financiero. Controla tus gastos. Invierte con conciencia. Crea un colchón de seguridad.",
    career: t.career,
    careerRisks: "Pérdida de motivación. Conflicto con tu dirección actual. Resistencia al cambio.",
    careerOpportunities: `Desarrollo a través del tema del arcano ${name}. Nuevas habilidades. Ampliación de tu experiencia.`,
    careerRecommendations: "Determina cómo se relaciona el tema del año con tu carrera. Usa esa conexión para crecer.",
    relationships: t.rel,
    relationshipsRisks: "Malentendidos con tu pareja. Proyecciones. Expectativas no expresadas.",
    relationshipsOpportunities: "Profundizar viviendo juntos el tema del año. Un nuevo nivel de intimidad.",
    relationshipsRecommendations: "Comparte tus vivencias con tu pareja. Sé abierto. Aprended juntos.",
    health: t.health || "Presta atención a tu bienestar general. Prevenir es mejor que curar. Mantén el equilibrio entre trabajo y descanso.",
    healthRisks: "Ignorar las señales del cuerpo. Estrés. Alteración de la rutina.",
    healthRecommendations: "Deporte regular. Alimentación sana. Sueño de calidad. Revisiones preventivas.",
    innerState: t.inner || "Un periodo de transformación interior. Presta atención a tus sentimientos y pensamientos: llevan mensajes importantes.",
    innerStateRecommendations: "Meditación. Diario. Trabajo con un psicólogo. Conciencia plena en lo cotidiano.",
    energyInteractions: `La energía del arcano ${arcana} (${name}) interactúa con las vibraciones mensuales. Los periodos más armoniosos son aquellos en que el número del mes forma un par sinérgico con el número del año. Los periodos conflictivos requieren mayor conciencia.`,
    additionalInsight: `Según el sistema de Kapustin, el Año de ${name} es una fase ${arcana <= 11 ? "activa" : "transformadora"} del ciclo. ${arcana <= 7 ? "Los primeros 7 arcanos son un periodo de construcción y crecimiento." : arcana <= 14 ? "Los arcanos 8–14 son un periodo de trabajo interior y transformación." : "Los arcanos 15–22 son un periodo de cierre, purificación y preparación para un nuevo ciclo."}`,
    risks: [
      "Ignorar el tema clave del año",
      "Resistirse al flujo natural de las energías",
      "Repetir viejos errores sin tomar conciencia",
      "Resistencia a aceptar los cambios",
      "Evitar el trabajo interior",
      "Proyectar tus problemas sobre los demás",
    ],
    repeatingPatterns: `Presta atención a las situaciones recurrentes: señalan una lección inacabada. Si en el ciclo anterior no trabajaste el tema del arcano ${arcana}, volverá con el doble de fuerza.`,
    opportunities: [
      `Trabajo profundo con el arquetipo de ${name}`,
      "Desarrollar la cualidad clave del año",
      "Usar la energía cíclica para un avance",
      "Profundizar el autoconocimiento a través del tema del año",
      "Transformar las debilidades en fuerza",
      "Alcanzar un nuevo nivel de conciencia",
    ],
    recommendations: [
      `Estudia el simbolismo del arcano ${name}: comprenderlo ayuda a la integración`,
      "Lleva un diario de observación de acontecimientos y señales",
      "Trabaja con la sombra: muestra la zona de crecimiento",
      "Confía en el proceso, aunque sea incómodo",
      "Busca un mentor o un grupo de apoyo",
      "Practica la conciencia plena en la vida cotidiana",
      "Crea un ritual de inicio y cierre de cada mes",
      "No compares tu camino con el de los demás",
    ],
    whatToAvoid: [
      "No ignores las señales recurrentes: importan",
      "No fuerces los acontecimientos: todo a su tiempo",
      "No reprimas las emociones: llevan información",
      "No vivas la vida de otro: tu camino es único",
      "No huyas de la incomodidad: en ella hay crecimiento",
    ],
    conclusion: `El Año de ${name} es una etapa importante de tu ciclo de 22 años. Cada año lleva una lección y oportunidades únicas. Acepta la energía de este año como un aliado, no como un obstáculo. Trabaja con ella de forma consciente y te abrirá nuevos horizontes.`,
    keyThought: `La energía de ${name} es tu maestra este año. Escucha, aprende, aplica.`,
    mainVector: "Toma de conciencia del tema → elaboración → integración → alcanzar un nuevo nivel",
    monthlyFocus: NO_MONTHS,
  };
}

// ============================================================
// Public entry point
// ============================================================
export function getYearProLocalized(arcana: number, lang: string): YearProInterpretation | null {
  if (lang === 'en') {
    if (yearFullEN[arcana]) return yearFullEN[arcana];
    const theme = themesEN[arcana] || DEFAULT_THEME_EN;
    return genericEN(arcana, namesEN[arcana] || `Arcana ${arcana}`, theme);
  }
  if (lang === 'es') {
    if (yearFullES[arcana]) return yearFullES[arcana];
    const theme = themesES[arcana] || DEFAULT_THEME_ES;
    return genericES(arcana, namesES[arcana] || `Arcano ${arcana}`, theme);
  }
  return null;
}

// ============================================================
// COMPATIBILITY — parallel EN/ES of getCompatibilityProInterpretation
// ============================================================
function compatEN(unionArcana: number, harmonyArcana: number, karmaArcana: number, percent: number): CompatibilityProInterpretation {
  const intensity = percent >= 70 ? "high" : percent >= 50 ? "medium" : "low";
  const unionType = unionArcana <= 7 ? "personal" : unionArcana <= 14 ? "mature" : "transformational";
  return {
    intro: `Before you is a full professional compatibility analysis based on the system of 22 arcana. Your couple's compatibility is ${percent}% (${intensity}). This is not a verdict or a guarantee — it is a map of the territory of your relationship. How you walk it depends on both of you.`,
    pairEnergy: `Your couple carries ${unionType} energy (union arcana ${unionArcana}). ${
      unionArcana <= 7 ? "This is a partnership with strong individual energy. Each of you strives to express yourself, which creates dynamism and tension at the same time. You need to learn to be a team while keeping your individuality." :
      unionArcana <= 14 ? "This is a mature union where both are ready to work on themselves and the relationship. Depth and awareness are your main tools." :
      "This is a transformational partnership that changes both of you on a deep level. You won't be the same after this relationship — and that's good, if you're ready for change."
    }`,
    pairDynamics: `Your couple's dynamic is defined by three key arcana: Union (${unionArcana}), Harmony (${harmonyArcana}) and Karma (${karmaArcana}). Each of them affects a particular layer of the relationship. Union is how you look on the outside and what energy you radiate as a couple. Harmony is your emotional and sexual bond. Karma is the lesson you came to work through together. Understanding these three layers gives the full picture.`,
    unionDeepMeaning: `Union arcana ${unionArcana} shows the core of your relationship — the main theme around which your shared life is built. ${
      unionArcana <= 5 ? "Your union is built on individuality and mutual respect. The main thing is not to suppress each other but to complement." :
      unionArcana <= 10 ? "Your union seeks a balance between freedom and responsibility. You teach each other through shared experience." :
      unionArcana <= 16 ? "Your union carries transformational energy. You will both change through this relationship — sometimes painfully, but always genuinely." :
      "Your union has a karmic nature. You didn't meet by chance — there's a shared lesson that can only be worked through together."
    } This arcana also defines how others perceive your couple and what situations you attract into your shared life.`,
    harmonyDeepMeaning: `Harmony arcana ${harmonyArcana} reveals your emotional and physical bond. ${
      harmonyArcana <= 7 ? "There's a strong, vivid energy between you. Emotions are lived intensely — both joy and conflict. Your task is to learn to manage this intensity rather than suppress it." :
      harmonyArcana <= 14 ? "Your bond is mature and deep. You may not 'burn' with passion 24/7, but your closeness is based on trust and acceptance. Over time it only grows stronger." :
      "There's a transformational bond between you. Every touch, every conversation changes you both. It's powerful, sometimes frightening, but always authentic."
    } This arcana shows how you sense each other without words and at what depth your interaction takes place.`,
    karmaDeepMeaning: `Karma arcana ${karmaArcana} is the lesson you came to work through together. ${
      karmaArcana <= 7 ? "Your karmic lesson is about individuality within the couple: learning to be yourself next to another person, without losing yourself or suppressing your partner." :
      karmaArcana <= 14 ? "Your karmic lesson is balance. You learn to give and receive in equal measure, without falling into self-sacrifice or selfishness." :
      "Your karmic lesson is deep transformation. This relationship destroys false notions of love and builds genuine ones."
    } If the lesson is learned — the relationship becomes a powerful resource. If the lesson is ignored — recurring conflicts are inevitable.`,
    financialDynamics: `The couple's financial dynamic (arcana ${unionArcana}): ${
      unionArcana <= 7 ? "Both tend toward independence in finances. The model 'a common pot + personal money for each' works better. A joint budget is possible but requires clear agreements." :
      unionArcana <= 14 ? "You can successfully run a joint budget. One of you is the strategist, the other the executor. It's important to define the roles and not change them without discussion." :
      "Money in your couple is a zone of deep work. Different values and approaches to finances can create friction. But it's precisely through resolving financial matters together that you grow as a couple."
    }`,
    financialRisks: `The couple's main financial risks: ${
      percent < 50 ? "different spending priorities, hidden debts, manipulation through money, unequal contribution" :
      percent < 70 ? "disagreements over large purchases, different attitudes to risk, the 'save vs spend' conflict" :
      "complacency from abundance, lack of financial discipline, excessive shared spending"
    }.`,
    financialRecommendations: "Create a joint financial plan. Define shared goals (housing, travel, a safety cushion). Each of you should have personal money. Discuss large purchases in advance. Once a month — a financial 'council' of the couple.",
    careerDynamics: `Career compatibility: ${
      unionArcana <= 7 ? "Both are ambitious. It's important not to compete but to support. A joint business is possible if roles are clearly distributed." :
      unionArcana <= 14 ? "One of you is the engine, the other the stabilizer. Use this difference as an advantage." :
      "Career paths may differ radically. That's normal. The main thing is to respect each other's choices."
    }`,
    careerRecommendations: "Discuss each other's career plans. Support, don't compete. If you're planning a joint business — clearly define roles and areas of responsibility.",
    sexualChemistry: `Sexual compatibility (harmony arcana ${harmonyArcana}): ${
      harmonyArcana <= 7 ? "There's a strong physical attraction between you, especially at the start of the relationship. Passion can be destructive if not channeled constructively. It's important to keep the fire alive through novelty, experimentation and emotional closeness. For you, sex is a way of communicating, not just a physical act." :
      harmonyArcana <= 14 ? "Your closeness is about trust and depth, not outward passion. Over time the physical bond only strengthens, if you work on emotional closeness. Routine is your main enemy. Create rituals of intimacy: special evenings, trips together, unexpected signs of attention." :
      "There's transformational energy between you. Intimacy changes you both on a deep level. It's powerful, but can be frightening. Don't avoid the depth — that's exactly where your couple's potential is hidden."
    }`,
    sexualRecommendations: "Talk about your desires and boundaries. Create rituals of intimacy. Experiment together. Don't use sex as a tool of manipulation. Quality matters more than quantity.",
    emotionalDynamics: `Emotional bond: ${
      harmonyArcana <= 7 ? "Intense emotions on both sides. Conflicts are vivid, and so are reconciliations. You need to learn to manage the emotional swings without suppressing them." :
      harmonyArcana <= 14 ? "A calm, stable emotional bond. You understand each other without words. But routine can dull the feelings — create emotional 'shake-ups' consciously." :
      "A deep emotional bond that sometimes frightens with its intensity. You literally feel each other's states. Learn to distinguish your own emotions from your partner's."
    }`,
    emotionalRecommendations: "Express feelings in words, don't hope your partner 'already knows'. Create a safe space for difficult conversations. Don't store up resentments. Praise each other daily.",
    conflictZones: [
      karmaArcana <= 5 ? "A struggle for leadership — both want to control the situation, which leads to clashes of will" : "Different life values — what matters to one seems insignificant to the other",
      percent < 60 ? "A different life tempo — one rushes events, the other prefers to wait, which creates constant tension" : "The habit of taking each other for granted — the fading of gratitude and attention",
      unionArcana % 2 === 0 ? "Emotional distance — it's hard to open up and show vulnerability, which builds a wall between you" : "Excessive emotionality — frequent quarrels over trifles, the inability to stop in time",
      "Financial disagreements — different attitudes to money, spending and saving",
      karmaArcana > 15 ? "Karmic patterns — the unconscious reproduction of scenarios from past relationships" : "Childhood traumas — unresolved issues with parents are projected onto the partner",
      "Different standards of order and household — what's 'normal' for one is chaos or nitpicking for the other",
    ],
    growthAreas: [
      "Developing the skill of active listening — hearing not only the words but the feelings behind them",
      "Setting goals together for 1-3-5 years — a shared vision of the future strengthens the union",
      harmonyArcana <= 11 ? "Creating rituals of intimacy — shared dinners without phones, walks, 'dates'" : "Respecting personal space — giving each other freedom without jealousy and control",
      "Working with projections — learning to see the real person, not your expectations and fantasies",
      "Practicing gratitude — daily acknowledgment of your partner's contribution to your life",
      "Learning together — courses, books, travel — anything that broadens your shared horizon",
    ],
    synergyPoints: [
      `Union arcana ${unionArcana} creates powerful shared energy in the area of ${unionArcana <= 7 ? "action and achievement" : unionArcana <= 14 ? "wisdom and depth" : "transformation and renewal"}`,
      `Harmony arcana ${harmonyArcana} gives you ${harmonyArcana <= 7 ? "a vivid emotional and physical bond" : harmonyArcana <= 14 ? "a stable emotional base" : "a deep understanding of each other"}`,
      "Your differences are not a weakness but a strength. Where one is weak, the other is strong",
      "A shared karmic lesson makes you stronger as a couple",
    ],
    scenarios: [
      {
        title: "✦ Optimistic scenario",
        description: `With conscious work on the relationship, your union can become ${
          percent >= 70 ? "one of the strongest and most inspiring of your life. You have all the resources for a deep, mature, supportive partnership that enriches both of you" :
          percent >= 50 ? "a stable and growing partnership that only strengthens over time. Your differences become a source of growth, not of conflict" :
          "an important lesson that makes you both stronger, wiser and more honest"
        }. Key conditions: honest dialogue, willingness to change, respect for differences, shared goals and a daily practice of gratitude.`,
      },
      {
        title: "○ Realistic scenario",
        description: `Your couple will go through cycles of coming together and drifting apart — that's normal dynamics for arcana ${unionArcana}. Crises are inevitable roughly once every ${Math.max(1, Math.floor(22 / unionArcana))} years. It's important to understand: a crisis is not the end but an opportunity to move to a new level. Average relationships don't survive without work. Good ones require daily attention. Great ones require both.`,
      },
      {
        title: "⚠ Difficult scenario",
        description: `If the karmic lesson of arcana ${karmaArcana} is ignored, the relationship may become ${
          karmaArcana > 12 ? "destructive and toxic — manipulation, gaslighting, emotional abuse. In that case the best choice is to leave" : "formal and empty — you live side by side but not together. Boredom, apathy, 'parallel lives'"
        }. Signs: constant criticism without suggestions, the absence of physical closeness for more than 3 months, avoiding serious conversations, a feeling of loneliness next to your partner. If you recognized your situation — that's a signal to act.`,
      },
    ],
    risks: [
      "Ignoring conflicts — 'it'll sort itself out' doesn't work",
      "Trying to change your partner — instead of acceptance and support",
      "Comparing with 'perfect couples' from social media — the illusion of others' happiness",
      "Manipulation through guilt — 'if you loved me...'",
      "Emotional blackmail — threats to leave as a means of control",
      "Loss of individuality — dissolving into your partner",
    ],
    repeatingPatterns: `Note this: if the same conflicts keep repeating in your relationship — that's the karmic lesson of arcana ${karmaArcana}. Until the lesson is learned, the situation will keep returning. The key is not to change your partner but to change your way of reacting.`,
    opportunities: [
      "Mutual growth — the relationship as a training ground for development",
      "Healing childhood traumas through a safe relationship",
      "Creating a joint project or business",
      "Deepening closeness to the level of 'we are a team'",
      "Developing communication skills useful in all areas",
      "Starting a family / strengthening an existing one",
    ],
    dailyLifeTips: [
      "Every morning — 5 minutes without phones, just for each other. A hug, words of gratitude, the plan for the day",
      "Once a week — a 'date' outside the home, even if you've been together 20 years. A new place, a new experience",
      "The 'don't fall asleep in a quarrel' rule — talk conflicts through to the end, but without shouting",
      "A shared financial plan + personal 'untouchable' money for each — this is not distrust but health",
      "Once a month — a frank conversation: 'what do I need from us?' Without accusations, only needs",
      "Praise each other in front of others — it strengthens the bond and raises both of your self-esteem",
      "Physical contact — at least 8 touches a day. Hugs, kisses, just a hand on the shoulder",
      "Create a 'jar of happiness' — write down good moments and reread them in hard times",
    ],
    whatToAvoid: [
      "Criticism without suggestions — 'you always/never' — a destructive formula",
      "The silent treatment — that's emotional abuse, not 'letting things cool down'",
      "Bringing in third parties (parents, friends) to resolve a couple's conflicts",
      "Comparing with exes — 'well, my ex used to...' — a forbidden move",
      "Using children as an argument in a dispute",
      "Expecting your partner to 'guess' — telepathy doesn't work",
    ],
    longTermOutlook: `Long-term forecast for your couple: ${
      percent >= 80 ? "Excellent. You have all the resources to create a strong, deep and inspiring union. Your task is not to stop developing and not to take the good for granted. A relationship is a living organism that needs care even when everything is fine." :
      percent >= 60 ? "Good, provided you work consciously. Your differences are not an obstacle but a tool for growth. There will be crises, but they'll make you stronger if you go through them together. Invest in the relationship the way you invest in a career — and the result won't keep you waiting." :
      percent >= 40 ? "Ambiguous. You'll have to work harder than other couples, but the result can be worth it. The key question: are you both ready to invest? If yes — the chances rise significantly. If only one — the forecast worsens." :
      "Difficult. This union requires serious effort from both and, perhaps, professional help (a couples' therapist). Ask yourself an honest question: does this union make me better or worse? The answer will show the direction."
    }`,
    conclusion: "Your compatibility is not a verdict or a guarantee. It's a map of your relationship that shows the resources, lessons and zones of growth. Use this information as a navigator, not as a limitation. The best relationships are those in which both partners grow together.",
    keyThought: "Compatibility is not a given but the result of the daily choice to be together consciously.",
  };
}

function compatES(unionArcana: number, harmonyArcana: number, karmaArcana: number, percent: number): CompatibilityProInterpretation {
  const intensity = percent >= 70 ? "alta" : percent >= 50 ? "media" : "baja";
  const unionType = unionArcana <= 7 ? "personal" : unionArcana <= 14 ? "madura" : "transformadora";
  return {
    intro: `Tienes ante ti un análisis profesional completo de compatibilidad, basado en el sistema de los 22 arcanos. La compatibilidad de vuestra pareja es del ${percent}% (${intensity}). No es una sentencia ni una garantía: es un mapa del territorio de vuestra relación. Cómo lo recorráis depende de los dos.`,
    pairEnergy: `Vuestra pareja porta una energía ${unionType} (arcano de la unión ${unionArcana}). ${
      unionArcana <= 7 ? "Es una asociación con una fuerte energía individual. Cada uno busca expresarse, lo que crea dinamismo y tensión a la vez. Necesitáis aprender a ser un equipo conservando la individualidad." :
      unionArcana <= 14 ? "Es una unión madura, donde ambos están dispuestos a trabajar en sí mismos y en la relación. La profundidad y la conciencia son vuestras principales herramientas." :
      "Es una asociación transformadora que os cambia a ambos a un nivel profundo. No seréis los mismos después de esta relación, y eso es bueno si estáis preparados para el cambio."
    }`,
    pairDynamics: `La dinámica de vuestra pareja se define por tres arcanos clave: Unión (${unionArcana}), Armonía (${harmonyArcana}) y Karma (${karmaArcana}). Cada uno influye en una capa determinada de la relación. La Unión es cómo os veis por fuera y qué energía irradiáis como pareja. La Armonía es vuestro vínculo emocional y sexual. El Karma es la lección que vinisteis a trabajar juntos. Comprender estas tres capas da la imagen completa.`,
    unionDeepMeaning: `El arcano de la unión ${unionArcana} muestra el eje de vuestra relación, el tema principal en torno al cual se construye vuestra vida en común. ${
      unionArcana <= 5 ? "Vuestra unión se construye sobre la individualidad y el respeto mutuo. Lo importante es no reprimirse, sino complementarse." :
      unionArcana <= 10 ? "Vuestra unión busca un equilibrio entre libertad y responsabilidad. Os enseñáis mutuamente a través de la experiencia compartida." :
      unionArcana <= 16 ? "Vuestra unión porta una energía transformadora. Ambos cambiaréis a través de esta relación, a veces de forma dolorosa, pero siempre genuina." :
      "Vuestra unión tiene una naturaleza kármica. No os conocisteis por casualidad: hay una lección común que solo se puede pasar juntos."
    } Este arcano también define cómo perciben vuestra pareja los demás y qué situaciones atraéis a vuestra vida en común.`,
    harmonyDeepMeaning: `El arcano de la armonía ${harmonyArcana} revela vuestro vínculo emocional y físico. ${
      harmonyArcana <= 7 ? "Entre vosotros hay una energía fuerte y vívida. Las emociones se viven con intensidad, tanto la alegría como los conflictos. Vuestra tarea es aprender a gestionar esa intensidad en lugar de reprimirla." :
      harmonyArcana <= 14 ? "Vuestro vínculo es maduro y profundo. Puede que no 'ardáis' de pasión 24/7, pero vuestra intimidad se basa en la confianza y la aceptación. Con el tiempo solo se fortalece." :
      "Entre vosotros hay un vínculo transformador. Cada caricia, cada conversación os cambia a ambos. Es poderoso, a veces aterrador, pero siempre auténtico."
    } Este arcano muestra cómo os sentís sin palabras y a qué profundidad ocurre vuestra interacción.`,
    karmaDeepMeaning: `El arcano del karma ${karmaArcana} es la lección que vinisteis a trabajar juntos. ${
      karmaArcana <= 7 ? "Vuestra lección kármica tiene que ver con la individualidad en la pareja: aprender a ser uno mismo junto a otra persona, sin perderse ni reprimir al otro." :
      karmaArcana <= 14 ? "Vuestra lección kármica es el equilibrio. Aprendéis a dar y a recibir por igual, sin caer en el sacrificio ni en el egoísmo." :
      "Vuestra lección kármica es una transformación profunda. Esta relación destruye las falsas ideas sobre el amor y construye las verdaderas."
    } Si la lección se aprende, la relación se convierte en un poderoso recurso. Si la lección se ignora, los conflictos recurrentes son inevitables.`,
    financialDynamics: `La dinámica financiera de la pareja (arcano ${unionArcana}): ${
      unionArcana <= 7 ? "Ambos tienden a la independencia en las finanzas. Funciona mejor el modelo de 'fondo común + dinero personal para cada uno'. Un presupuesto conjunto es posible, pero requiere acuerdos claros." :
      unionArcana <= 14 ? "Podéis llevar con éxito un presupuesto conjunto. Uno de vosotros es el estratega, el otro el ejecutor. Es importante definir los roles y no cambiarlos sin discutirlo." :
      "El dinero en vuestra pareja es una zona de trabajo profundo. Valores y enfoques distintos hacia las finanzas pueden crear roces. Pero es precisamente resolviendo juntos las cuestiones financieras como crecéis como pareja."
    }`,
    financialRisks: `Los principales riesgos financieros de la pareja: ${
      percent < 50 ? "prioridades de gasto distintas, deudas ocultas, manipulación a través del dinero, aportación desigual" :
      percent < 70 ? "desacuerdos en grandes compras, distinta actitud ante el riesgo, el conflicto 'ahorrar vs gastar'" :
      "relajación por la abundancia, falta de disciplina financiera, gastos comunes excesivos"
    }.`,
    financialRecommendations: "Cread un plan financiero conjunto. Definid metas comunes (vivienda, viajes, un colchón). Cada uno debe tener dinero personal. Hablad de las grandes compras por adelantado. Una vez al mes, un 'consejo' financiero de la pareja.",
    careerDynamics: `Compatibilidad profesional: ${
      unionArcana <= 7 ? "Ambos sois ambiciosos. Es importante no competir, sino apoyaros. Un negocio conjunto es posible si los roles están claramente repartidos." :
      unionArcana <= 14 ? "Uno de vosotros es el motor, el otro el estabilizador. Usad esa diferencia como ventaja." :
      "Los caminos profesionales pueden diferir radicalmente. Es normal. Lo importante es respetar la elección del otro."
    }`,
    careerRecommendations: "Hablad de los planes profesionales del otro. Apoyaos, no compitáis. Si planeáis un negocio conjunto, definid con claridad los roles y las áreas de responsabilidad.",
    sexualChemistry: `Compatibilidad sexual (arcano de la armonía ${harmonyArcana}): ${
      harmonyArcana <= 7 ? "Entre vosotros hay una fuerte atracción física, sobre todo al inicio de la relación. La pasión puede ser destructiva si no se canaliza de forma creativa. Es importante mantener el fuego mediante la novedad, la experimentación y la cercanía emocional. Para vosotros, el sexo es una forma de comunicación, no solo un acto físico." :
      harmonyArcana <= 14 ? "Vuestra intimidad va de confianza y profundidad, no de pasión externa. Con el tiempo el vínculo físico solo se intensifica, si trabajáis la cercanía emocional. La rutina es vuestro mayor enemigo. Cread rituales de intimidad: noches especiales, viajes en pareja, gestos de atención inesperados." :
      "Entre vosotros hay una energía transformadora. La intimidad os cambia a ambos a un nivel profundo. Es poderoso, pero puede dar miedo. No evitéis la profundidad: ahí se esconde el potencial de vuestra pareja."
    }`,
    sexualRecommendations: "Hablad de vuestros deseos y límites. Cread rituales de intimidad. Experimentad juntos. No uséis el sexo como herramienta de manipulación. La calidad importa más que la cantidad.",
    emotionalDynamics: `Vínculo emocional: ${
      harmonyArcana <= 7 ? "Emociones intensas por ambas partes. Los conflictos son vívidos, y las reconciliaciones también. Tenéis que aprender a gestionar el vaivén emocional sin reprimirlo." :
      harmonyArcana <= 14 ? "Un vínculo emocional tranquilo y estable. Os entendéis sin palabras. Pero la rutina puede embotar los sentimientos: cread 'sacudidas' emocionales de forma consciente." :
      "Un vínculo emocional profundo que a veces asusta por su intensidad. Sentís literalmente el estado del otro. Aprended a distinguir vuestras emociones de las de la pareja."
    }`,
    emotionalRecommendations: "Expresad los sentimientos con palabras, no esperéis que la pareja 'ya lo sepa'. Cread un espacio seguro para las conversaciones difíciles. No acumuléis rencores. Elogiaos cada día.",
    conflictZones: [
      karmaArcana <= 5 ? "Una lucha por el liderazgo: ambos quieren controlar la situación, lo que lleva a choques de voluntad" : "Valores de vida distintos: lo que importa a uno le parece insignificante al otro",
      percent < 60 ? "Un ritmo de vida distinto: uno apresura los acontecimientos, el otro prefiere esperar, lo que crea tensión constante" : "La costumbre de dar al otro por sentado: el desvanecimiento de la gratitud y la atención",
      unionArcana % 2 === 0 ? "Distancia emocional: cuesta abrirse y mostrar vulnerabilidad, lo que levanta un muro entre vosotros" : "Emotividad excesiva: peleas frecuentes por nimiedades, la incapacidad de parar a tiempo",
      "Desacuerdos financieros: distinta actitud hacia el dinero, el gasto y el ahorro",
      karmaArcana > 15 ? "Patrones kármicos: la reproducción inconsciente de guiones de relaciones pasadas" : "Traumas de la infancia: problemas no resueltos con los padres que se proyectan sobre la pareja",
      "Distintos estándares de orden y de hogar: lo que para uno es 'normal', para el otro es caos o pesadez",
    ],
    growthAreas: [
      "Desarrollar la escucha activa: oír no solo las palabras, sino los sentimientos detrás de ellas",
      "Fijar metas juntos a 1-3-5 años: una visión común del futuro fortalece la unión",
      harmonyArcana <= 11 ? "Crear rituales de intimidad: cenas juntos sin teléfonos, paseos, 'citas'" : "Respetar el espacio personal: daros libertad sin celos ni control",
      "Trabajar las proyecciones: aprender a ver a la persona real, no vuestras expectativas y fantasías",
      "Practicar la gratitud: reconocer a diario la aportación de la pareja a vuestra vida",
      "Aprender juntos: cursos, libros, viajes; todo lo que amplía el horizonte común",
    ],
    synergyPoints: [
      `El arcano de la unión ${unionArcana} crea una poderosa energía común en el ámbito de ${unionArcana <= 7 ? "la acción y los logros" : unionArcana <= 14 ? "la sabiduría y la profundidad" : "la transformación y la renovación"}`,
      `El arcano de la armonía ${harmonyArcana} os da ${harmonyArcana <= 7 ? "un vínculo emocional y físico vívido" : harmonyArcana <= 14 ? "una base emocional estable" : "una comprensión profunda del otro"}`,
      "Vuestras diferencias no son una debilidad, sino una fuerza. Donde uno es débil, el otro es fuerte",
      "Una lección kármica compartida os hace más fuertes como pareja",
    ],
    scenarios: [
      {
        title: "✦ Escenario optimista",
        description: `Con un trabajo consciente sobre la relación, vuestra unión puede convertirse en ${
          percent >= 70 ? "una de las más sólidas e inspiradoras de vuestra vida. Tenéis todos los recursos para una asociación profunda, madura y de apoyo que enriquece a ambos" :
          percent >= 50 ? "una asociación estable y en crecimiento que solo se fortalece con el tiempo. Vuestras diferencias se vuelven fuente de crecimiento, no de conflicto" :
          "una lección importante que os hace a ambos más fuertes, sabios y honestos"
        }. Condiciones clave: diálogo honesto, disposición a cambiar, respeto por las diferencias, metas comunes y una práctica diaria de gratitud.`,
      },
      {
        title: "○ Escenario realista",
        description: `Vuestra pareja pasará por ciclos de acercamiento y distanciamiento: es una dinámica normal para el arcano ${unionArcana}. Las crisis son inevitables aproximadamente una vez cada ${Math.max(1, Math.floor(22 / unionArcana))} años. Es importante entender: una crisis no es el final, sino una oportunidad de pasar a un nuevo nivel. Las relaciones medias no sobreviven sin trabajo. Las buenas requieren atención diaria. Las grandes requieren ambas cosas.`,
      },
      {
        title: "⚠ Escenario difícil",
        description: `Si se ignora la lección kármica del arcano ${karmaArcana}, la relación puede volverse ${
          karmaArcana > 12 ? "destructiva y tóxica: manipulación, luz de gas, maltrato emocional. En ese caso, la mejor elección es marcharse" : "formal y vacía: vivís uno al lado del otro, pero no juntos. Aburrimiento, apatía, 'vidas paralelas'"
        }. Señales: crítica constante sin propuestas, ausencia de cercanía física durante más de 3 meses, evitar las conversaciones serias, sensación de soledad junto a la pareja. Si has reconocido tu situación, es una señal para actuar.`,
      },
    ],
    risks: [
      "Ignorar los conflictos: el 'ya se arreglará solo' no funciona",
      "Intentar cambiar a la pareja en lugar de aceptarla y apoyarla",
      "Compararse con las 'parejas perfectas' de las redes sociales: la ilusión de la felicidad ajena",
      "Manipulación a través de la culpa: 'si me quisieras...'",
      "Chantaje emocional: amenazas de marcharse como medio de control",
      "Pérdida de individualidad: disolverse en la pareja",
    ],
    repeatingPatterns: `Fíjate: si en vuestra relación se repiten los mismos conflictos, esa es la lección kármica del arcano ${karmaArcana}. Hasta que la lección no se aprenda, la situación seguirá volviendo. La clave no es cambiar a la pareja, sino cambiar tu forma de reaccionar.`,
    opportunities: [
      "Crecimiento mutuo: la relación como gimnasio para el desarrollo",
      "Sanar traumas de la infancia a través de una relación segura",
      "Crear un proyecto o negocio conjunto",
      "Profundizar la cercanía hasta el nivel de 'somos un equipo'",
      "Desarrollar habilidades de comunicación útiles en todas las áreas",
      "Formar una familia / fortalecer la existente",
    ],
    dailyLifeTips: [
      "Cada mañana, 5 minutos sin teléfonos, solo el uno para el otro. Un abrazo, palabras de gratitud, el plan del día",
      "Una vez por semana, una 'cita' fuera de casa, aunque llevéis 20 años juntos. Un lugar nuevo, una experiencia nueva",
      "La regla de 'no te duermas enfadado': hablad los conflictos hasta el final, pero sin gritos",
      "Un plan financiero común + dinero personal 'intocable' para cada uno: no es desconfianza, es salud",
      "Una vez al mes, una conversación franca: '¿qué necesito de nosotros?' Sin reproches, solo necesidades",
      "Elogiaos delante de otras personas: fortalece el vínculo y eleva la autoestima de ambos",
      "Contacto físico: al menos 8 caricias al día. Abrazos, besos, una simple mano en el hombro",
      "Cread un 'frasco de la felicidad': anotad los buenos momentos y releedlos en los momentos difíciles",
    ],
    whatToAvoid: [
      "Crítica sin propuestas: 'tú siempre/nunca', una fórmula destructiva",
      "El boicot silencioso: es maltrato emocional, no 'dejar que se enfríe'",
      "Recurrir a terceros (padres, amigos) para resolver los conflictos de pareja",
      "Comparar con los ex: 'pues mi ex...', una jugada prohibida",
      "Usar a los hijos como argumento en una discusión",
      "Esperar que la pareja 'adivine': la telepatía no funciona",
    ],
    longTermOutlook: `Pronóstico a largo plazo de vuestra pareja: ${
      percent >= 80 ? "Excelente. Tenéis todos los recursos para crear una unión sólida, profunda e inspiradora. Vuestra tarea es no dejar de desarrollaros y no dar lo bueno por sentado. Una relación es un organismo vivo que necesita cuidado incluso cuando todo va bien." :
      percent >= 60 ? "Bueno, a condición de trabajar conscientemente. Vuestras diferencias no son un obstáculo, sino una herramienta de crecimiento. Habrá crisis, pero os harán más fuertes si las atravesáis juntos. Invertid en la relación como invertís en una carrera, y el resultado no se hará esperar." :
      percent >= 40 ? "Ambiguo. Tendréis que trabajar más que otras parejas, pero el resultado puede valer la pena. La pregunta clave: ¿estáis dispuestos ambos a invertir? Si es así, las posibilidades aumentan mucho. Si solo uno, el pronóstico empeora." :
      "Difícil. Esta unión requiere un esfuerzo serio de ambos y, quizá, la ayuda de un profesional (un terapeuta de pareja). Hazte una pregunta honesta: ¿esta unión me hace mejor o peor? La respuesta mostrará la dirección."
    }`,
    conclusion: "Vuestra compatibilidad no es una sentencia ni una garantía. Es un mapa de vuestra relación que muestra los recursos, las lecciones y las zonas de crecimiento. Usad esta información como un navegador, no como una limitación. Las mejores relaciones son aquellas en las que ambos miembros crecen juntos.",
    keyThought: "La compatibilidad no es algo dado, sino el resultado de la elección diaria de estar juntos con conciencia.",
  };
}

export function getCompatibilityProLocalized(
  unionArcana: number,
  harmonyArcana: number,
  karmaArcana: number,
  percent: number,
  lang: string
): CompatibilityProInterpretation | null {
  if (lang === 'en') return compatEN(unionArcana, harmonyArcana, karmaArcana, percent);
  if (lang === 'es') return compatES(unionArcana, harmonyArcana, karmaArcana, percent);
  return null;
}
