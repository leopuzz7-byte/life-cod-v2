// Переводы классической нумерологии (numberDescriptions, categoryDescriptions).
// Накладываются поверх русской базы в numerology.ts. Fallback на русский.

export type NumberText = {
  title: string; planet: string; day: string; color: string; element: string; stone: string;
  positive: string[]; negative: string[];
  description: string; detailedDescription: string;
  mindInterpretation: string; actionInterpretation: string; realizationInterpretation: string; totalInterpretation: string;
  relationships: string; career: string[]; health: string; advice: string;
};
export type CategoryText = { title: string; subtitle: string; description: string };

const numbersEn: Record<number, Partial<NumberText>> = {
  1: {
    title: "The Leader", planet: "Sun", day: "Sunday", color: "Red, gold, orange", element: "Fire", stone: "Ruby, garnet",
    positive: ["Independence", "Ambition", "Creativity", "Confidence", "Decisiveness", "Initiative", "Originality"],
    negative: ["Egocentrism", "Vanity", "Arrogance", "Irritability", "Stubbornness", "Impatience"],
    description: "You are a leader with great willpower. You don't doubt your goals and tasks. Your main strength is energy, primacy, and leadership.",
    detailedDescription: "Number 1 is the number of beginnings, the pioneer and the creator. People with this number have an innate ability to lead others; they are full of energy and determination. You are used to relying only on yourself and achieving everything through your own efforts. Your mind is set on achieving goals, and you rarely stop halfway. The Sun, which rules this number, gives you charisma, strength of spirit, and the ability to light the way for others.",
    mindInterpretation: "Your mind works quickly and decisively. You think on a large scale and aren't afraid to take on difficult tasks. You have a natural talent for finding unconventional solutions. However, it's important to learn to listen to others and consider their opinion — this will strengthen your leadership position.",
    actionInterpretation: "In action you are swift and decisive. You prefer to act on your own, without waiting for help. Your energy is aimed at achieving primacy in everything. It's important to learn to delegate tasks and work in a team.",
    realizationInterpretation: "Your realization is connected with leadership positions. You'll achieve success where you can take initiative, create something new, or lead a project. Avoid subordinate roles — they won't reveal your potential.",
    totalInterpretation: "Your life task is to learn to be a true leader: to lead others, to inspire, while keeping respect for those around you. Develop confidence without arrogance.",
    relationships: "In relationships you strive for dominance, which can create conflicts. You need a partner who respects your independence yet can gently point out your mistakes. Learn to compromise and listen to loved ones.",
    career: ["Own business", "Top management", "Director", "Entrepreneur", "Politician", "Inventor", "Athlete", "Military leader"],
    health: "Pay attention to the cardiovascular system and blood pressure. It's important not to overstrain and to find time for rest. Sunbathing is beneficial, but in moderation.",
    advice: "Develop patience and learn to listen to others. Your strength lies in the ability to lead, but a true leader cares for those who follow.",
  },
  2: {
    title: "The Diplomat", planet: "Moon", day: "Monday", color: "White, silver, cream", element: "Water", stone: "Pearl, moonstone",
    positive: ["Sensitivity", "Friendliness", "Cooperation", "Intuition", "Tact", "Patience", "Romanticism"],
    negative: ["Indecisiveness", "Changeability", "Dependence", "Touchiness", "Suspiciousness", "Passivity"],
    description: "You are a born diplomat and peacemaker. You have the ability to feel others and find compromises.",
    detailedDescription: "Number 2 is the number of partnership, harmony, and balance. The Moon has endowed you with deep intuition and the ability to understand other people's emotions. You are the link between people, able to smooth over conflicts and create an atmosphere of cooperation. Your strength is in softness and the ability to adapt. You sense the energy of those around you and can use this to create harmonious relationships.",
    mindInterpretation: "Your mind is tuned to perceiving nuances and subtexts. You intuitively understand what others think and feel. This makes you an excellent advisor and psychologist. However, avoid over-analysis — trust your intuition.",
    actionInterpretation: "In action you prefer a gentle approach. You don't like conflict and try to reach goals through cooperation. Your strength is in the ability to unite people and find compromises.",
    realizationInterpretation: "You realize yourself through partnership and teamwork. A solo career is not your path. Look for fields where you can help people and work in tandem with like-minded ones.",
    totalInterpretation: "Your life task is to learn balance between serving others and caring for yourself. Develop inner confidence and learn to say 'no' when necessary.",
    relationships: "Relationships are a central theme of your life. You strive for a deep emotional connection and can be a very devoted partner. However, avoid codependency and keep your individuality.",
    career: ["Psychologist", "Diplomat", "HR manager", "Mediator", "Designer", "Musician", "Healer", "Consultant"],
    health: "Pay attention to the nervous system and emotional state. A sleep routine and contact with water — swimming, walks by bodies of water — are beneficial for you.",
    advice: "Learn to value yourself and your needs as highly as the needs of others. Your intuition is your gift — trust it.",
  },
  3: {
    title: "The Creator", planet: "Jupiter", day: "Thursday", color: "Yellow, gold, orange", element: "Fire/Ether", stone: "Yellow sapphire, topaz",
    positive: ["Optimism", "Creativity", "Sociability", "Inspiration", "Eloquence", "Artistry", "Cheerfulness"],
    negative: ["Superficiality", "Wastefulness", "Boastfulness", "Impatience", "Absent-mindedness", "A tendency to gossip"],
    description: "You are endowed with a sharp mind and creative potential. You love to analyze and explore the world around you.",
    detailedDescription: "Number 3 is the number of self-expression, creativity, and the joy of life. Jupiter endows you with optimism, wisdom, and the ability to see the big picture. You have a gift for words and can influence people through communication. Your energy attracts those around you; you know how to make a celebration out of an ordinary day. Creativity for you is not a hobby but a way of knowing the world.",
    mindInterpretation: "Your mind is quick and multifaceted. You grasp information on the fly and can synthesize knowledge from different fields. However, it's important to learn concentration — don't scatter yourself across many projects at once.",
    actionInterpretation: "In action you are expressive and vivid. You prefer a creative approach to any task. Routine depresses you — look for ways to add an element of play to everyday life.",
    realizationInterpretation: "You realize yourself through creativity, communication, and teaching others. The fields of art, media, and teaching are your path to success. Share knowledge and inspire.",
    totalInterpretation: "Your life task is to learn to express yourself authentically and bring joy into the world. Develop discipline to bring your talents to mastery.",
    relationships: "In relationships you are sparkling and generous. You need a partner who shares your love of life and won't restrict your freedom. Avoid superficial connections — seek depth.",
    career: ["Writer", "Actor", "Teacher", "Marketer", "Designer", "Musician", "Blogger", "Speaker", "Coach"],
    health: "Watch your liver and nervous system. Avoid overeating and excessive merrymaking. Creative hobbies are the best therapy for you.",
    advice: "Focus on one thing and see it through to the end. Your talent is enormous, but without discipline it scatters. Learn depth.",
  },
  4: {
    title: "The Builder", planet: "Rahu (Uranus)", day: "Saturday", color: "Blue, gray, dark green", element: "Earth", stone: "Hessonite, sapphire",
    positive: ["Practicality", "Reliability", "Patience", "Organization", "Diligence", "Methodicalness", "Honesty"],
    negative: ["Stubbornness", "Conservatism", "Slowness", "Narrow-mindedness", "Rigidity", "Pessimism"],
    description: "You are a reliable and practical person. You know how to build a solid foundation for achieving your goals.",
    detailedDescription: "Number 4 is the number of order, stability, and the material world. Rahu gives you an unusual view of familiar things and the ability to see what others miss. You are a builder in every sense: of physical structures, systems, organizations. Your strength is in constancy and the ability to create structures that will stand for centuries. You are a support for those around you.",
    mindInterpretation: "Your mind is analytical and practical. You don't believe in castles in the air — only in what can be touched and measured. This gives you an advantage in material matters, but it's important to stay open to new ideas.",
    actionInterpretation: "In action you are methodical and consistent. You don't rush, but you do everything with quality. Your strength is in patience and the ability to see things through to the end.",
    realizationInterpretation: "You realize yourself by creating something tangible and lasting. Construction, finance, engineering, architecture are the fields of your success. Build to last.",
    totalInterpretation: "Your life task is to create a solid foundation for yourself and others. Learn flexibility and don't fear change — it can strengthen your structures.",
    relationships: "In relationships you are faithful and reliable. You need a partner who values stability and is ready to build a future together. Work on expressing emotions — not everyone understands your reserve.",
    career: ["Architect", "Engineer", "Financier", "Accountant", "Project manager", "Builder", "Programmer", "Lawyer"],
    health: "Pay attention to bones, joints, and the spine. Physical activity and good posture matter. Avoid stagnation.",
    advice: "Be open to change — it won't destroy your foundation but strengthen it. Develop flexibility of thinking and emotional openness.",
  },
  5: {
    title: "The Seeker", planet: "Mercury", day: "Wednesday", color: "Green, turquoise", element: "Air/Ether", stone: "Emerald, peridot",
    positive: ["Love of freedom", "Adaptability", "Curiosity", "Versatility", "Charm", "Communicativeness", "Wit"],
    negative: ["Inconstancy", "Impulsiveness", "Irresponsibility", "Absent-mindedness", "Nervousness", "Superficiality"],
    description: "You are a seeker of adventure and new knowledge. You crave freedom and variety in life.",
    detailedDescription: "Number 5 is the number of freedom, change, and adventure. Mercury endows you with a sharp mind, eloquence, and the ability to adapt to any circumstances. You are an eternal student of life who seeks new experiences and knowledge. Routine is the worst punishment for you. Your strength is in flexibility and the ability to find a way out of any situation.",
    mindInterpretation: "Your mind is quick as lightning. You instantly analyze information and find connections between unrelated phenomena. However, it's important to develop depth — don't glide over the surface of knowledge.",
    actionInterpretation: "In action you are spontaneous and varied. You easily change plans and adapt to new conditions. This is your strength, but it's important to finish what you started before taking on something new.",
    realizationInterpretation: "You realize yourself through communication, travel, and the exchange of information. Trade, journalism, translation, tourism are your fields of success. Movement is your engine.",
    totalInterpretation: "Your life task is to find inner freedom while keeping responsibility. Learn to balance the thirst for the new with completing what you started.",
    relationships: "In relationships you need freedom and intellectual stimulation. A partner should be a friend and like-minded person. Avoid routine — add variety to the union.",
    career: ["Journalist", "Traveler", "Translator", "Sales", "Blogger", "Entrepreneur", "Guide", "Advertiser", "Trader"],
    health: "Watch your nervous system and lungs. Movement and fresh air matter to you. Avoid overstrain and find time to relax.",
    advice: "Develop depth and constancy. Freedom is not the absence of obligations but a conscious choice. Finish what you started.",
  },
  6: {
    title: "The Harmonizer", planet: "Venus", day: "Friday", color: "Pink, light blue, pastel tones", element: "Water/Earth", stone: "Diamond, turquoise",
    positive: ["Care", "Responsibility", "Harmony", "Love", "Beauty", "Devotion", "Creativity"],
    negative: ["Self-sacrifice", "Intrusiveness", "Anxiety", "Perfectionism", "Control", "Jealousy"],
    description: "You are made for love and care. You strive for harmony in relationships and beauty in everything.",
    detailedDescription: "Number 6 is the number of love, harmony, and responsibility. Venus endows you with a sense of beauty, the ability to love and create coziness. You are the keeper of the family hearth and the protector of loved ones. Your strength is the ability to create beauty and harmony around you. You naturally attract people with your warmth and care.",
    mindInterpretation: "Your mind is oriented toward harmony and aesthetics. You intuitively sense what is beautiful and right. This gives you an advantage in creative and social spheres.",
    actionInterpretation: "In action you are guided by love and care. You are ready to do a lot for loved ones, but it's important not to forget yourself. Your strength is in creating a harmonious space.",
    realizationInterpretation: "You realize yourself through service, creativity, and beauty. Design, medicine, education, social work are your paths to success. Help and create.",
    totalInterpretation: "Your life task is to learn to love unconditionally, asking nothing in return, while also caring for yourself. Balance between giving and receiving is your lesson.",
    relationships: "Relationships are the center of your universe. You are made for family and deep connection. However, avoid self-sacrifice and control — let loved ones be themselves.",
    career: ["Designer", "Doctor", "Psychotherapist", "Teacher", "Cosmetologist", "Restaurateur", "Social worker", "Artist"],
    health: "Pay attention to the throat, kidneys, and reproductive system. The beauty and harmony of your surroundings directly affect your health. Avoid stress.",
    advice: "Learn to love yourself as much as you love others. Your care is a gift, but don't let it turn into sacrifice. You deserve to receive.",
  },
  7: {
    title: "The Thinker", planet: "Ketu (Neptune)", day: "Monday", color: "Violet, gray, white", element: "Water/Ether", stone: "Cat's eye, amethyst",
    positive: ["Wisdom", "Intuition", "Analytical ability", "Spirituality", "Insight", "Depth", "Independence of thought"],
    negative: ["Withdrawal", "Skepticism", "Detachment", "Criticism", "Coldness", "Pessimism"],
    description: "You are a deep thinker and philosopher. You strive to know the truth and for spiritual development.",
    detailedDescription: "Number 7 is the number of wisdom, spiritual search, and deep analysis. Ketu gives you access to the subtle planes of being and the ability to see beyond the material world. You are a seeker of truth who isn't satisfied with superficial answers. Your strength is in the depth of understanding and the ability to comprehend the hidden laws of the Universe.",
    mindInterpretation: "Your mind penetrates to the very essence of things. You are a born researcher and analyst, able to see what is hidden from others. Develop intuition — it's your main tool.",
    actionInterpretation: "In action you prefer solitude and deep immersion. You don't like fuss and superficial communication. Your strength is in focused work and meditation.",
    realizationInterpretation: "You realize yourself through research, spiritual practices, and deep analysis. Science, psychology, esoterics, programming are your fields of success. Seek depth.",
    totalInterpretation: "Your life task is to find balance between the spiritual and material worlds. Share your wisdom with others without withdrawing into yourself.",
    relationships: "In relationships you need space for solitude. A partner must respect your need for silence. Learn to open up emotionally — it's not a weakness.",
    career: ["Scientist", "Researcher", "Psychologist", "Philosopher", "Programmer", "Analyst", "Writer", "Spiritual mentor"],
    health: "Pay attention to the nervous system and sleep. Meditation and solitude in nature are your best medicines. Avoid information noise.",
    advice: "Don't withdraw into yourself. Your wisdom is needed by the world, but for that you need to learn to communicate and share. Balance of inner and outer is your path.",
  },
  8: {
    title: "The Ruler", planet: "Saturn", day: "Saturday", color: "Black, dark blue, brown", element: "Earth", stone: "Blue sapphire, amethyst",
    positive: ["Ambition", "Authority", "Determination", "Success", "Practicality", "Discipline", "Endurance"],
    negative: ["Lust for power", "Rigidity", "Materialism", "Intolerance", "Coldness", "Workaholism"],
    description: "You were born to achieve material success and power. You have business acumen and ambition.",
    detailedDescription: "Number 8 is the number of material success, power, and karmic balance. Saturn gives you the strength to overcome obstacles and reach the heights through work and discipline. You understand the laws of the material world and know how to use them. But remember: with great power comes great responsibility. Your path is through trials to greatness.",
    mindInterpretation: "Your mind is strategic and practical. You think big and for the long term. Finance, business, management are natural areas of your intellect.",
    actionInterpretation: "In action you are persistent and tireless. Obstacles only strengthen your resolve. Your strength is in the ability to work hard and achieve results.",
    realizationInterpretation: "You realize yourself through business, finance, and management. Career growth, building an empire, investments are your paths to success. Aim for the heights.",
    totalInterpretation: "Your life task is to learn to balance material success and spiritual development. Power is a tool for helping others — don't forget that.",
    relationships: "In relationships you can be demanding and reserved. A partner must understand your ambitions and support them. Learn to show tenderness and be vulnerable.",
    career: ["Entrepreneur", "Financier", "Banker", "Investor", "CEO", "Politician", "Lawyer", "Manager"],
    health: "Pay attention to bones, teeth, and chronic illnesses. Routine and discipline in health care matter. Don't neglect rest.",
    advice: "Remember: money and power are means, not the goal. Use your achievements to help others. True greatness lies in generosity of spirit.",
  },
  9: {
    title: "The Sage", planet: "Mars", day: "Tuesday", color: "Red, coral, burgundy", element: "Fire", stone: "Red coral, ruby",
    positive: ["Compassion", "Wisdom", "Idealism", "Service", "Completeness", "Bravery", "Magnanimity"],
    negative: ["Self-sacrifice", "Emotionality", "Absent-mindedness", "Impracticality", "Aggression", "Impulsiveness"],
    description: "You are a sage completing a cycle. You are called to serve humanity and bring spiritual knowledge into the world.",
    detailedDescription: "Number 9 is the number of completion, wisdom, and service. Mars gives you the energy to fight for higher ideals and protect the weak. You carry within you the experience of all the previous numbers and are able to see the whole picture. Your mission is to share accumulated wisdom and help others on their path. You are a completer of cycles and a guide to a new beginning.",
    mindInterpretation: "Your mind embraces the big picture. You are able to synthesize knowledge and see connections between seemingly unrelated phenomena. This makes you a wise advisor.",
    actionInterpretation: "In action you are guided by higher ideals. You are ready to fight for justice and help those in need. Your strength is in the ability to inspire and lead.",
    realizationInterpretation: "You realize yourself through service, teaching, and creativity. Charity, medicine, art, spiritual practices are your paths to success and self-realization.",
    totalInterpretation: "Your life task is to complete karmic lessons and help others on their path. Learn to let go and accept endings as new beginnings.",
    relationships: "In relationships you are magnanimous and idealistic. You need a partner who shares your higher aspirations. Learn to accept imperfection — both yours and your partner's.",
    career: ["Doctor", "Teacher", "Social worker", "Artist", "Actor", "Philanthropist", "Spiritual leader", "Therapist"],
    health: "Pay attention to blood, muscles, and energy levels. It's important to channel Mars energy constructively. Sports and activity are your allies.",
    advice: "Learn to let go and not attach to results. Your task is to sow seeds, not control the harvest. Serve with an open heart.",
  },
};

const categoriesEn: Record<string, CategoryText> = {
  mind: { title: "Mind Number", subtitle: "Your mental energy", description: "Indicates how you think, your desires, and the basic characteristics of your personality. It's your inner nature, the way you perceive the world and make decisions." },
  action: { title: "Action Number", subtitle: "Your way of expression", description: "Shows how you act in various situations and what your main abilities are. It's your outer energy and way of interacting with the world." },
  realization: { title: "Realization Number", subtitle: "The path to success", description: "Indicates the areas in which you'll achieve real success, through which energy you realize yourself in the material world and profession." },
  total: { title: "Outcome Number", subtitle: "Your life mission", description: "What you should ultimately come to, what qualities you should develop throughout your life. It's your karmic lesson and the main goal of this incarnation." },
};

const numbersEs: Record<number, Partial<NumberText>> = {};
const categoriesEs: Record<string, CategoryText> = {};

export const numberOverlays: Record<string, Record<number, Partial<NumberText>>> = { en: numbersEn, es: numbersEs };
export const categoryOverlays: Record<string, Record<string, CategoryText>> = { en: categoriesEn, es: categoriesEs };
