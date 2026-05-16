// База данных трактовок для Life C⚙D

// ============= МЕТОДИКА 1: СОЗНАНИЕ (1-9) =============
export const consciousnessDescriptions: Record<number, {
  name: string;
  core: string;
  inPlus: string;
  inMinus: string;
  inRelationships: string;
  inBusiness: string;
}> = {
  1: {
    name: "Инициатор",
    core: "«Я сам», самостоятельность, лидерство",
    inPlus: "Лидерство, самостоятельность, принятие решений",
    inMinus: "Упрямство, эгоцентризм, неспособность слышать других",
    inRelationships: "Хочет рулить процессом, плохо переносит давление извне",
    inBusiness: "Запускает проекты, держит дисциплину, хороший операционный руководитель"
  },
  2: {
    name: "Партнёр",
    core: "Чувствительность, диалог, зависимость от партнёра",
    inPlus: "Гибкость, умение слушать, дипломатия",
    inMinus: "Зависимость, нерешительность, страх потери",
    inRelationships: "Нуждается в паре, ориентирован на «мы», чувствителен",
    inBusiness: "Хороший переговорщик, командный игрок"
  },
  3: {
    name: "Коммуникатор",
    core: "Эмоции, слово, общение",
    inPlus: "Умение выражать мысли, креативность, оптимизм",
    inMinus: "Обещает, но не делает; поверхностность",
    inRelationships: "Много говорит, анализирует, обсуждает — «давай поговорим»",
    inBusiness: "Идеи, презентации, клиентский сервис"
  },
  4: {
    name: "Опора",
    core: "Контроль, логика, структура",
    inPlus: "Системность, ответственность, надёжность",
    inMinus: "Жёсткость, зажим, тревожность, давление",
    inRelationships: "Держит быт, структуру, стабильность — «надо так»",
    inBusiness: "Управление процессами, финансовый контроль, порядок"
  },
  5: {
    name: "Свободный",
    core: "Свобода, перемены, опыт",
    inPlus: "Адаптивность, смелость, любовь к экспериментам",
    inMinus: "Бегство, нестабильность, безответственность",
    inRelationships: "Заходит легко, любит движение, не терпит рамок — «не ограничивай меня»",
    inBusiness: "Стартапы, кризис-менеджмент, но плохо держит рутину"
  },
  6: {
    name: "Семейный",
    core: "Забота, семья, ответственность за близких",
    inPlus: "Заботливость, эмпатия, верность",
    inMinus: "Контроль под видом заботы, злопамятность, ожидания благодарности",
    inRelationships: "Ориентирован на дом, заботу, долг — «я делаю для нас»",
    inBusiness: "Надёжный исполнитель, держит команду, стабилизирует процессы"
  },
  7: {
    name: "Закрытый",
    core: "Закрытость, анализ, трансформация",
    inPlus: "Глубокий анализ, стратегическое мышление, самодостаточность",
    inMinus: "Холод, изоляция, недоверие",
    inRelationships: "Долго присматривается, не пускает сразу — «мне нужно время»",
    inBusiness: "Аналитик, стратег, но плохо работает в команде"
  },
  8: {
    name: "Контролёр",
    core: "Власть, давление, ресурсы",
    inPlus: "Стратег, умеет управлять людьми и деньгами",
    inMinus: "Давление, обесценивание чувств, «будет так, как я сказал»",
    inRelationships: "Управляет, задаёт правила, проверяет — «будет по-моему»",
    inBusiness: "Сильный управленец, финансовый контроль, не сентиментален"
  },
  9: {
    name: "Завершающий",
    core: "Завершение, итог, мудрость",
    inPlus: "Умеет завершать, не цепляется за мёртвое, принципиальность",
    inMinus: "Резкие разрывы, эмоциональное выгорание, цинизм",
    inRelationships: "Входит после кризисов, несёт опыт — «я многое уже прошёл»",
    inBusiness: "Закрывает убыточные направления, не держится за мёртвые проекты"
  }
};

// ============= МЕТОДИКА 7: ДЕЙСТВИЯ (0-9) =============
export const actionDescriptions: Record<number, {
  name: string;
  core: string;
  inPlus: string;
  inMinus: string;
  riskScenarios: string[];
  inRelationships: string;
  inBusiness: string;
}> = {
  0: {
    name: "Адаптивный",
    core: "Пустота формы, гибкость, зеркальность",
    inPlus: "Обучаемость, адаптация, умение встраиваться",
    inMinus: "Потеря себя, зависимость, копирование чужих сценариев",
    riskScenarios: ["Жертва — живёт чужими целями", "Адаптивная ложь — говорит то, что хотят услышать", "Проживает чужую жизнь"],
    inRelationships: "Подстраивается под пару, но может раствориться и потерять границы",
    inBusiness: "Зависит от среды и партнёров, формируется внешними условиями"
  },
  1: {
    name: "Лидер",
    core: "«Я сам», импульс, инициатива",
    inPlus: "Лидерство, быстрые решения",
    inMinus: "Эго, давление, жёсткий контроль",
    riskScenarios: ["Авторитаризм", "Неспособность делегировать"],
    inRelationships: "Ведёт отношения, но партнёр может чувствовать себя вторичным",
    inBusiness: "Хорош на старте проекта, плохо делегирует"
  },
  2: {
    name: "Дипломат",
    core: "Диалог, сотрудничество, компромисс",
    inPlus: "Договорённости, командная работа",
    inMinus: "Зависимость, терпение, неспособность сказать «нет»",
    riskScenarios: ["Созависимость", "Жертвенность"],
    inRelationships: "Ищет гармонию, но может терпеть токсичное ради мира",
    inBusiness: "Хороший переговорщик, но может уступать в своих интересах"
  },
  3: {
    name: "Выразитель",
    core: "Слово, обещания, договоры",
    inPlus: "Умение договариваться, креативность",
    inMinus: "Манипуляции, ложь, обещания без действий",
    riskScenarios: ["Психологическое мошенничество", "Двойные смыслы", "«Я говорил — ты не так понял»"],
    inRelationships: "Много говорит, но может не подкреплять словами действия",
    inBusiness: "Продажи, PR, но риск невыполненных обязательств"
  },
  4: {
    name: "Строитель",
    core: "Контроль, рамки, порядок, система",
    inPlus: "Надёжность, доводит до результата",
    inMinus: "Давление, жёсткость, холод",
    riskScenarios: ["Сценарий жертвы — тянет всё сам, потом ломает систему", "Жёсткий контроль"],
    inRelationships: "Делает, а не говорит; держит быт, опору, деньги",
    inBusiness: "Стратегический строитель, берёт ответственность"
  },
  5: {
    name: "Искатель",
    core: "Перемены, движение, эксперимент",
    inPlus: "Гибкость, способность выходить из рутины",
    inMinus: "Хаос, срыв обязательств, бегство",
    riskScenarios: ["Нестабильность", "Измены", "Бросает на полпути"],
    inRelationships: "Нуждается в свободе, не терпит рутины",
    inBusiness: "Хорош в кризис, плохо держит форму"
  },
  6: {
    name: "Опекун",
    core: "Забота, ответственность, защита",
    inPlus: "Надёжный исполнитель, держит команду",
    inMinus: "Не доводит дела до конца, не умеет делегировать, выгорание",
    riskScenarios: ["Уход в кайфы как компенсация", "Злопамятность", "Сценарий жертвы — «я всё делал для вас, а вы...»"],
    inRelationships: "Тащит операционку, заботится, но может копить обиды",
    inBusiness: "Берёт на себя много, но распыляется и выгорает"
  },
  7: {
    name: "Аналитик",
    core: "Недоверие, контроль, стратегия",
    inPlus: "Глубокий анализ, стратегическое мышление",
    inMinus: "Уход в изоляцию, холод, закрытость",
    riskScenarios: ["Паралич анализа", "Отстранённость"],
    inRelationships: "Долго оценивает, не доверяет, может внезапно уйти",
    inBusiness: "Аналитик, но плохо принимает решения в команде"
  },
  8: {
    name: "Властитель",
    core: "Власть, деньги, результат",
    inPlus: "Умеет управлять, строит империи",
    inMinus: "Подавление, жёсткий контроль, игра «в одни ворота»",
    riskScenarios: ["Абьюз", "Передел власти", "Токсичное подчинение"],
    inRelationships: "Давит, задаёт правила, при утрате доверия ломает всё",
    inBusiness: "Сильный управленец, но риск авторитарного стиля"
  },
  9: {
    name: "Завершитель",
    core: "Завершение, обнуление, уход",
    inPlus: "Умеет резать лишнее, закрывать циклы",
    inMinus: "Резкие разрывы, исчезновение без объяснений, холодность после боли",
    riskScenarios: ["Внезапный выход", "Оставляет партнёра разбираться с последствиями"],
    inRelationships: "Если любит — отдаётся полностью; если понял «не его» — уходит навсегда",
    inBusiness: "Закрывает проекты без обсуждения, действует молча"
  }
};

// ============= МЕТОДИКА 3: ЛИЧНЫЕ ГОДА =============
export const personalYearDescriptions: Record<number, {
  name: string;
  theme: string;
  forRelationships: string;
  forBusiness: string;
  entryAllowed: boolean;
  entryCondition?: string;
}> = {
  1: {
    name: "Год Себя",
    theme: "Старт цикла, фокус на себя, эго",
    forRelationships: "Партнёр будет вторичным. Вход возможен, но как «временный заход»",
    forBusiness: "Хорош для личных проектов, плохо для партнёрств",
    entryAllowed: false
  },
  2: {
    name: "Год Партнёрства",
    theme: "Диалог, союз, готовность к паре",
    forRelationships: "Знакомства и сближение идут легче. Лучший год для союза",
    forBusiness: "Договорённости, совместные проекты",
    entryAllowed: true
  },
  3: {
    name: "Год Эмоций",
    theme: "Общение, искушения, флирт",
    forRelationships: "Много общения, мало закрепления. Риск поверхностных связей",
    forBusiness: "Креатив, PR, но плохо для серьёзных решений",
    entryAllowed: false
  },
  4: {
    name: "Год Формы",
    theme: "Структура, договор, официальность",
    forRelationships: "Либо оформляете, либо ломается. Год закрепления",
    forBusiness: "Масштабирование, фиксация долей, расширение",
    entryAllowed: true,
    entryCondition: "Только если есть готовность к форме"
  },
  5: {
    name: "Год Перемен",
    theme: "Выход из старого, хаос, движение",
    forRelationships: "Вход возможен, но нужен порядок. Риск треугольников",
    forBusiness: "Перезапуск, выход из кризиса",
    entryAllowed: true,
    entryCondition: "Если нет хаоса и треугольников"
  },
  6: {
    name: "Год Семьи",
    theme: "Забота, дом, стабильность",
    forRelationships: "Хочется стабильности и близости. Лучший год для семьи",
    forBusiness: "Надёжный союз, семейный бизнес",
    entryAllowed: true
  },
  7: {
    name: "Год Пересборки",
    theme: "Закрытие, качели, трансформация",
    forRelationships: "Отношения часто не выдерживают качелей. Год «не знаю чего хочу»",
    forBusiness: "Пауза, отсутствие решений, срыв коммуникаций",
    entryAllowed: false
  },
  8: {
    name: "Год Давления",
    theme: "Власть, деньги, контроль",
    forRelationships: "Риск контроля, конфликтов, зависимости. Токсичный вход",
    forBusiness: "Борьба за власть, финансовые споры",
    entryAllowed: false
  },
  9: {
    name: "Год Завершения",
    theme: "Закрытие прошлого, итоги, готовность к новому",
    forRelationships: "Вход возможен только после закрытия прошлого",
    forBusiness: "Завершение проектов, подведение итогов",
    entryAllowed: true,
    entryCondition: "Если прошлое реально закрыто"
  }
};

// ============= МЕТОДИКА 6: МАТРИЦА ВЗАИМОДЕЙСТВИЯ =============
export const interactionMatrix: Record<string, {
  category: 'STABLE' | 'UNSTABLE' | 'CRISIS' | 'BREAKDOWN';
  loveMeaning: string;
  businessMeaning: string;
}> = {
  // Стабильные
  '6-4': { category: 'STABLE', loveMeaning: 'Дом + опора, брак', businessMeaning: 'Управление + порядок' },
  '4-6': { category: 'STABLE', loveMeaning: 'Дом + опора, брак', businessMeaning: 'Управление + порядок' },
  '6-1': { category: 'STABLE', loveMeaning: 'Забота + лидер', businessMeaning: 'Поддержка старта' },
  '1-6': { category: 'STABLE', loveMeaning: 'Забота + лидер', businessMeaning: 'Поддержка старта' },
  '4-2': { category: 'STABLE', loveMeaning: 'Безопасность', businessMeaning: 'Договорённости' },
  '2-4': { category: 'STABLE', loveMeaning: 'Безопасность', businessMeaning: 'Договорённости' },
  '3-6': { category: 'STABLE', loveMeaning: 'Тепло, радость', businessMeaning: 'Клиентский сервис' },
  '6-3': { category: 'STABLE', loveMeaning: 'Тепло, радость', businessMeaning: 'Клиентский сервис' },
  '6-6': { category: 'STABLE', loveMeaning: 'Семья, долгосрок', businessMeaning: 'Надёжный союз' },
  
  // Нестабильные (зависят от стабилизатора)
  '5-6': { category: 'UNSTABLE', loveMeaning: 'Качели, но держится', businessMeaning: 'Рост при жёстких сроках' },
  '6-5': { category: 'UNSTABLE', loveMeaning: 'Качели, но держится', businessMeaning: 'Рост при жёстких сроках' },
  '5-4': { category: 'UNSTABLE', loveMeaning: 'Бунт против правил', businessMeaning: 'Конфликт хаоса и регламента' },
  '4-5': { category: 'UNSTABLE', loveMeaning: 'Бунт против правил', businessMeaning: 'Конфликт хаоса и регламента' },
  '9-4': { category: 'UNSTABLE', loveMeaning: 'Расставание без драмы', businessMeaning: 'Закрытие проекта корректно' },
  '4-9': { category: 'UNSTABLE', loveMeaning: 'Расставание без драмы', businessMeaning: 'Закрытие проекта корректно' },
  '2-8': { category: 'UNSTABLE', loveMeaning: 'Зависимость', businessMeaning: 'Давление в иерархии' },
  '8-2': { category: 'UNSTABLE', loveMeaning: 'Зависимость', businessMeaning: 'Давление в иерархии' },
  '3-4': { category: 'UNSTABLE', loveMeaning: 'Эмоции vs контроль', businessMeaning: 'Креатив под прессингом' },
  '4-3': { category: 'UNSTABLE', loveMeaning: 'Эмоции vs контроль', businessMeaning: 'Креатив под прессингом' },
  '7-4': { category: 'UNSTABLE', loveMeaning: 'Закрытость удерживается структурой', businessMeaning: 'Анализ + система' },
  '4-7': { category: 'UNSTABLE', loveMeaning: 'Закрытость удерживается структурой', businessMeaning: 'Анализ + система' },
  '8-6': { category: 'UNSTABLE', loveMeaning: 'Сила смягчается заботой', businessMeaning: 'Управление + поддержка' },
  '6-8': { category: 'UNSTABLE', loveMeaning: 'Сила смягчается заботой', businessMeaning: 'Управление + поддержка' },
  
  // Кризисные
  '7-7': { category: 'CRISIS', loveMeaning: 'Эмоциональный холод, нет контакта', businessMeaning: 'Паралич решений' },
  '8-8': { category: 'CRISIS', loveMeaning: 'Война, абьюз', businessMeaning: 'Борьба за власть' },
  '5-5': { category: 'CRISIS', loveMeaning: 'Сошлись-разошлись', businessMeaning: 'Хаос, срывы сроков' },
  '1-1': { category: 'CRISIS', loveMeaning: 'Соперничество', businessMeaning: 'Конфликт лидеров' },
  '7-2': { category: 'CRISIS', loveMeaning: 'Один ушёл, другой ждёт', businessMeaning: 'Срыв коммуникаций' },
  '2-7': { category: 'CRISIS', loveMeaning: 'Один ушёл, другой ждёт', businessMeaning: 'Срыв коммуникаций' },
  '8-1': { category: 'CRISIS', loveMeaning: 'Подавление личности', businessMeaning: 'Авторитарный стиль' },
  '1-8': { category: 'CRISIS', loveMeaning: 'Подавление личности', businessMeaning: 'Авторитарный стиль' },
  '3-8': { category: 'CRISIS', loveMeaning: 'Унижение чувств', businessMeaning: 'Выгорание команды' },
  '8-3': { category: 'CRISIS', loveMeaning: 'Унижение чувств', businessMeaning: 'Выгорание команды' },
  
  // Разрушающие
  '9-9': { category: 'BREAKDOWN', loveMeaning: 'Обоюдный конец, пустота', businessMeaning: 'Завершение сотрудничества' },
  '9-7': { category: 'BREAKDOWN', loveMeaning: 'Уход без объяснений', businessMeaning: 'Резкий выход' },
  '7-9': { category: 'BREAKDOWN', loveMeaning: 'Уход без объяснений', businessMeaning: 'Резкий выход' },
  '9-8': { category: 'BREAKDOWN', loveMeaning: 'Разрыв через конфликт', businessMeaning: 'Финансовый скандал' },
  '8-9': { category: 'BREAKDOWN', loveMeaning: 'Разрыв через конфликт', businessMeaning: 'Финансовый скандал' },
};

// ============= СОВМЕСТИМОСТЬ СОЗНАНИЙ =============
export const consciousnessCompatibility: Record<string, {
  status: 'COMPATIBLE' | 'TENSE' | 'CONFLICT';
  description: string;
}> = {
  '6-1': { status: 'COMPATIBLE', description: 'Баланс — забота + лидерство' },
  '1-6': { status: 'COMPATIBLE', description: 'Баланс — забота + лидерство' },
  '4-2': { status: 'COMPATIBLE', description: 'Безопасность — структура + диалог' },
  '2-4': { status: 'COMPATIBLE', description: 'Безопасность — структура + диалог' },
  '3-6': { status: 'COMPATIBLE', description: 'Тепло — эмоции + семья' },
  '6-3': { status: 'COMPATIBLE', description: 'Тепло — эмоции + семья' },
  '7-4': { status: 'COMPATIBLE', description: 'Удержание — анализ + форма' },
  '4-7': { status: 'COMPATIBLE', description: 'Удержание — анализ + форма' },
  '5-6': { status: 'COMPATIBLE', description: 'Стабилизация — свобода + забота' },
  '6-5': { status: 'COMPATIBLE', description: 'Стабилизация — свобода + забота' },
  
  '7-7': { status: 'CONFLICT', description: 'Холод — оба закрыты' },
  '8-8': { status: 'CONFLICT', description: 'Война — борьба за власть' },
  '5-5': { status: 'CONFLICT', description: 'Качели — двойная нестабильность' },
  '1-1': { status: 'CONFLICT', description: 'Конкуренция — два эго' },
  '9-9': { status: 'CONFLICT', description: 'Выгорание — двойное завершение' },
  
  '8-2': { status: 'TENSE', description: 'Давление — контроль vs зависимость' },
  '2-8': { status: 'TENSE', description: 'Давление — контроль vs зависимость' },
  '7-2': { status: 'TENSE', description: 'Ожидание — один закрыт, другой ждёт' },
  '2-7': { status: 'TENSE', description: 'Ожидание — один закрыт, другой ждёт' },
};

// ============= ТИПОВЫЕ СЦЕНАРИИ СВЯЗОК =============
export const typicalScenarios: Record<string, {
  type: 'working' | 'conflict' | 'conditional';
  loveDescription: string;
  businessDescription: string;
  redFlags: string[];
}> = {
  '6-9': { 
    type: 'conditional',
    loveDescription: 'Связка «тащит — обнуляет». 6 тащит, 9 может внезапно уйти',
    businessDescription: '6 тащит операционку, 9 может закрыть проект без обсуждения',
    redFlags: ['Риск перекоса ответственности', 'Внезапный выход 9', '6 остаётся с последствиями']
  },
  '9-6': { 
    type: 'conditional',
    loveDescription: 'Связка «тащит — обнуляет». 6 тащит, 9 может внезапно уйти',
    businessDescription: '6 тащит операционку, 9 может закрыть проект без обсуждения',
    redFlags: ['Риск перекоса ответственности', 'Внезапный выход 9', '6 остаётся с последствиями']
  },
  '1-8': {
    type: 'conflict',
    loveDescription: 'Борьба за лидерство. Оба хотят контролировать',
    businessDescription: 'Постоянный конфликт «кто главный». Нужна чёткая иерархия',
    redFlags: ['Борьба за контроль', 'Конфликт эго', 'Передел власти']
  },
  '8-1': {
    type: 'conflict',
    loveDescription: 'Борьба за лидерство. Оба хотят контролировать',
    businessDescription: 'Постоянный конфликт «кто главный». Нужна чёткая иерархия',
    redFlags: ['Борьба за контроль', 'Конфликт эго', 'Передел власти']
  },
  '4-6': {
    type: 'working',
    loveDescription: 'Отличная база. Форма + забота = устойчивый союз',
    businessDescription: 'Управление + поддержка. Стабильное партнёрство',
    redFlags: []
  },
  '6-4': {
    type: 'working',
    loveDescription: 'Отличная база. Форма + забота = устойчивый союз',
    businessDescription: 'Управление + поддержка. Стабильное партнёрство',
    redFlags: []
  },
};

// ============= МЕТОДИКА 8: ФИЛЬТРЫ ПОДБОРА ПАРТНЁРА =============
export const partnerFilters: Record<number, {
  suitableConsciousness: number[];
  suitableActions: number[];
  bestMonths: number[];
  conflictMonths: number[];
  notRecommended: number[];
  reason: string;
}> = {
  1: { 
    suitableConsciousness: [6, 4, 2], 
    suitableActions: [4, 6, 2],
    bestMonths: [4, 6], 
    conflictMonths: [1, 8],
    notRecommended: [1, 8],
    reason: 'Лидеру нужен партнёр с заботой и структурой, иначе конкуренция'
  },
  2: { 
    suitableConsciousness: [4, 6, 1], 
    suitableActions: [4, 6],
    bestMonths: [4, 6, 2], 
    conflictMonths: [7, 8],
    notRecommended: [7, 8],
    reason: 'Партнёру нужна опора и защита, иначе зависимость'
  },
  3: { 
    suitableConsciousness: [6, 4], 
    suitableActions: [4, 6],
    bestMonths: [4, 6], 
    conflictMonths: [3, 8],
    notRecommended: [3, 8],
    reason: 'Коммуникатору нужна стабильность, иначе поверхностность'
  },
  4: { 
    suitableConsciousness: [2, 6, 3], 
    suitableActions: [2, 6],
    bestMonths: [2, 6], 
    conflictMonths: [5, 8],
    notRecommended: [5, 8],
    reason: 'Опоре нужна мягкость и диалог, иначе давление'
  },
  5: { 
    suitableConsciousness: [6, 4], 
    suitableActions: [4, 6],
    bestMonths: [4, 6], 
    conflictMonths: [5, 7],
    notRecommended: [5, 7],
    reason: 'Свободному нужна форма, иначе хаос и бегство'
  },
  6: { 
    suitableConsciousness: [1, 4, 2], 
    suitableActions: [1, 4],
    bestMonths: [1, 4], 
    conflictMonths: [9, 7],
    notRecommended: [9, 7],
    reason: 'Семейному нужен лидер или порядок, иначе выгорание'
  },
  7: { 
    suitableConsciousness: [4, 6], 
    suitableActions: [4, 6],
    bestMonths: [4, 6], 
    conflictMonths: [7, 8],
    notRecommended: [7, 8, 9],
    reason: 'Закрытому нужна опора, иначе одиночество и холод'
  },
  8: { 
    suitableConsciousness: [2, 6], 
    suitableActions: [2, 6],
    bestMonths: [2, 6], 
    conflictMonths: [1, 8],
    notRecommended: [1, 8],
    reason: 'Контролёру нужно принятие и мягкость, иначе абьюз'
  },
  9: { 
    suitableConsciousness: [4, 6], 
    suitableActions: [4],
    bestMonths: [4, 6], 
    conflictMonths: [7, 9],
    notRecommended: [7, 8, 9],
    reason: 'Завершающему нужна структура, иначе холодные разрывы'
  },
};
