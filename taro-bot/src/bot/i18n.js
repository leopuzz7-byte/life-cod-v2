// Двуязычные тексты бота. Английский при отсутствии ключа откатывается на русский,
// поэтому бот работает на любом промежуточном этапе перевода.
const STR = {
  ru: {
    greeting: "Здравствуй{name}.\n\nМеня зовут Надежда. Я цифровой психолог и нумеролог. Здесь можно найти инструменты, которые помогут глубже понять себя, увидеть скрытые причины происходящего и принять решения, меняющие жизнь.\n\nИногда ответы приходят через карты. Иногда через язык чисел.\n\n<i>Выбери, с чего хочешь начать.</i>",
    btn_tarot: "🔮 Таро",
    btn_numer: "🔢 Нумерология",

    tarot_intro: "<i>В картах нет случайностей.</i> Сегодня выпадет именно та карта, которую важно увидеть.\n\nНо карты отвечают точнее, когда есть настоящий вопрос, тот, что правда не отпускает.",
    tarot_pick_theme: "Выбери, что откликается, или напиши свой вопрос колоде. 🌙",
    theme_love: "💗 Любовь и отношения",
    theme_money: "💰 Деньги и работа",
    theme_choice: "🔀 Важный выбор",
    theme_future: "🌱 Что меня ждёт",
    tarot_custom_btn: "✍️ Написать свой вопрос",
    tarot_custom_prompt: "Напиши вопрос одним сообщением, своими словами. Спрашивай как есть.",
    tarot_deck_caption: "Держи вопрос в сердце и не отпускай. Перед тобой пять карт. Выбери одну, ту, к которой тянет.",
    tarot_card_label: "Твоя карта",
    tarot_reveal_fallback: "{name} пришла не случайно. В ней ключ к тому, о чём сейчас думаешь. Сила уже внутри, осталось разрешить себе её увидеть.",
    tarot_reveal_hook_fallback: "Но одна карта показывает лишь верхний слой. Что привело к этому и чем закончится, откроет полный расклад.",
    tarot_subgate: "Чтобы раскрыть глубже, что стоит за этим и чем всё закончится, загляни в мой канал. 🌙\n\nПодпишись, и полный разбор откроется.",
    restart_hint: "Напиши /start, чтобы начать заново.",

    numer_ask_name: "Хорошо. Числа расскажут о тебе многое.\n\nКак мне к тебе обращаться?",
    numer_ask_date: "Приятно познакомиться, {name}. А когда ты родился(-ась)?\n\nВведи дату в формате ДД.ММ.ГГГГ, например 01.02.1991.",
    numer_date_error: "Что-то не так с датой. Напиши в формате ДД.ММ.ГГГГ, например 01.02.1991.",
    numer_cards_caption: "Вот они, три твои карты. Смотри.",
    numer_theme_prompt: "Скажи, что откликается сильнее. С чего начнём?",
    sphere_love: "💗 Отношения",
    sphere_money: "💰 Деньги и дело",
    sphere_path: "🌟 Путь и сила",

    sub_btn: "Подписаться на канал",
    sub_check_btn: "Я подписался, открой разбор",
    check_sub_notyet: "Пока не вижу тебя в канале. Загляни, и разбор откроется.",
    deep_menu_intro: "А теперь идём дальше. Спроси о чём угодно в чате со мной, или выбери в меню.",
    menu_open: "Что откликается сейчас. Выбирай.",
    menu_hint: "Меню с кнопками открылось внизу. Если кнопок не видно, нажми на значок с квадратиками справа от поля ввода.",
    menu_placeholder: "Меню с кнопками внизу 👇",

    menu_arkan: "🃏 Аркан-код",
    menu_numer: "🔢 Нумерология",
    menu_tarot: "🔮 Таро расклад",
    menu_shop: "🛍 Магазин",
    menu_invite: "👥 Пригласить друга",
    menu_academy: "🎓 Академия",
    menu_consult: "🕊 Консультация",
    menu_chat: "💬 Чат с Надеждой (ИИ)",
    menu_support: "🛟 Техподдержка",
    menu_social: "🌐 Соцсети Надежды",
    menu_club: "🔒 Закрытый клуб",
    btn_calc: "🧮 Калькулятор",
    welcome_back: "Ты уже со мной. Выбирай, что дальше.",
    question_accepted: "Приняла вопрос. Теперь сосредоточься на нём.",
    numer_concern_prompt: "{sphere}. А что именно сейчас откликается?",
    numer_subgate: "Услышала. По теме «{sphere}» в твоих картах есть глубокий узор.\n\nЧтобы раскрыть его целиком, загляни в канал. Подпишись, и разбор откроется.",
  },
  en: {
    greeting: "Hello{name}.\n\nMy name is Nadezhda. I am a digital psychologist and numerologist. Here you will find tools to understand yourself more deeply, to see the hidden reasons behind what is happening, and to make decisions that change your life.\n\nSometimes the answers come through cards. Sometimes through the language of numbers.\n\n<i>Choose where you would like to begin.</i>",
    btn_tarot: "🔮 Tarot",
    btn_numer: "🔢 Numerology",

    tarot_intro: "<i>There are no accidents in the cards.</i> Today the very card you need to see will come up.\n\nBut the cards answer more clearly when there is a real question, the one that truly will not let you go.",
    tarot_pick_theme: "Choose what resonates, or write your own question to the deck. 🌙",
    theme_love: "💗 Love and relationships",
    theme_money: "💰 Money and work",
    theme_choice: "🔀 An important choice",
    theme_future: "🌱 What lies ahead",
    tarot_custom_btn: "✍️ Write my own question",
    tarot_custom_prompt: "Write your question in one message, in your own words. Just ask as it is.",
    tarot_deck_caption: "Hold your question in your heart and do not let go. In front of you are five cards. Choose one, the one that draws you.",
    tarot_card_label: "Your card",
    tarot_reveal_fallback: "{name} did not come by chance. In it is the key to what is on your mind now. The strength is already within you, all that is left is to let yourself see it.",
    tarot_reveal_hook_fallback: "But a single card shows only the top layer. What led to this and how it ends will be revealed by a full reading.",
    tarot_subgate: "To open this deeper, to see what stands behind it and how it all ends, look into my channel. 🌙\n\nSubscribe, and the full reading will open.",
    restart_hint: "Type /start to begin again.",

    numer_ask_name: "Good. Numbers will tell a lot about you.\n\nWhat should I call you?",
    numer_ask_date: "Nice to meet you, {name}. When were you born?\n\nEnter the date as DD.MM.YYYY, for example 01.02.1991.",
    numer_date_error: "Something is off with the date. Write it as DD.MM.YYYY, for example 01.02.1991.",
    numer_cards_caption: "Here they are, your three cards. Take a look.",
    numer_theme_prompt: "Tell me what resonates more. Where shall we start?",
    sphere_love: "💗 Relationships",
    sphere_money: "💰 Money and work",
    sphere_path: "🌟 Path and strength",

    sub_btn: "Subscribe to the channel",
    sub_check_btn: "I subscribed, open the reading",
    check_sub_notyet: "I do not see you in the channel yet. Take a look, and the reading will open.",
    deep_menu_intro: "And now we go on. Ask me anything in our chat, or choose from the menu.",
    menu_open: "What resonates right now? Choose.",
    menu_hint: "The button menu opened below. If you do not see the buttons, tap the icon with small squares to the right of the message field.",
    menu_placeholder: "Button menu is below 👇",

    menu_arkan: "🃏 Arcanum code",
    menu_numer: "🔢 Numerology",
    menu_tarot: "🔮 Tarot spread",
    menu_shop: "🛍 Shop",
    menu_invite: "👥 Invite a friend",
    menu_academy: "🎓 Academy",
    menu_consult: "🕊 Consultation",
    menu_chat: "💬 Chat with Nadezhda (AI)",
    menu_support: "🛟 Support",
    menu_social: "🌐 Nadezhda's socials",
    menu_club: "🔒 Private club",
    btn_calc: "🧮 Calculator",
    welcome_back: "You are already with me. Choose what is next.",
    question_accepted: "Got your question. Now focus on it.",
    numer_concern_prompt: "And what exactly resonates right now?",
    numer_subgate: "I hear you. On this theme your cards hold a deep pattern.\n\nTo reveal it fully, look into the channel. Subscribe, and the reading will open.",
  },
};

function t(lang, key, vars) {
  const table = lang === "en" ? STR.en : STR.ru;
  let s = table[key];
  if (s == null) s = STR.ru[key];
  if (s == null) s = key;
  if (vars) for (const k of Object.keys(vars)) s = s.split("{" + k + "}").join(vars[k]);
  return s;
}

// Ключи пунктов меню в порядке для сопоставления подписи с ключом.
const MENU_KEYS = ["arkan", "numer", "tarot", "shop", "invite", "academy", "consult", "chat", "support", "social", "club"];

// По подписи кнопки (на любом языке) вернуть ключ пункта меню, иначе null.
function menuKey(text) {
  for (const lang of ["ru", "en"]) {
    for (const k of MENU_KEYS) {
      if (t(lang, "menu_" + k) === text) return k;
    }
  }
  return null;
}

module.exports = { t, menuKey, MENU_KEYS };
