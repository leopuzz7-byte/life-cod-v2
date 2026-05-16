// Банк паттернов связок и детектор рисков для Life C⚙D

// ============= ТИПЫ =============

export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';
export type RiskType = 'ABUSER' | 'MANIPULATOR' | 'TYRANT' | 'CODEPENDENT' | 'ESCAPER' | 'CONTROLLER' | 'COLD' | 'NONE';

export interface BehavioralPattern {
  id: string;
  numbers: number[];
  name: string;
  essence: string;
  inMinus: string;
  inPlus: string;
  loveContext: string;
  businessContext: string;
  riskLevel: RiskLevel;
  riskTypes: RiskType[];
}

export interface ConflictCombination {
  numbers: [number, number];
  conflictType: string;
  behavior: string[];
  outcome: string;
  redFlag: string;
  severity: 'HIGH' | 'CRITICAL';
}

export interface RiskProfile {
  type: RiskType;
  name: string;
  triggers: number[];
  behaviorPattern: string;
  partnerFeels: string[];
  realLifeSigns: string[];
  plusPotential: {
    strengths: string[];
    usefulIn: string[];
    safeConditions: string[];
    stillDangerousIf: string[];
  };
}

export interface VerdictResult {
  status: RiskLevel;
  statusLabel: string;
  mainRisks: RiskType[];
  patterns: BehavioralPattern[];
  conflicts: ConflictCombination[];
  unifiedPattern: string;
  plusPotential: string;
  partnerEffect: {
    inPlus: string[];
    inMinus: string[];
  };
  recommendation: string;
  exitChecklist?: string[];
}

// ============= БИЗНЕС-ТИПЫ =============

export interface BusinessType {
  consciousness: number;
  action: number;
  typeName: string;
  role: 'LEADER' | 'PARTNER' | 'EXECUTOR' | 'CONSULTANT' | 'STARTER' | 'ANALYST';
  strengths: string[];
  risks: string[];
  bestFor: string[];
}

export const businessTypes: BusinessType[] = [
  { consciousness: 1, action: 4, typeName: 'Руководитель-практик', role: 'LEADER', strengths: ['Инициатива', 'Система'], risks: ['Жёсткость'], bestFor: ['Управление', 'Операционка'] },
  { consciousness: 1, action: 8, typeName: 'Диктатор', role: 'LEADER', strengths: ['Власть', 'Контроль'], risks: ['Подавление', 'Авторитаризм'], bestFor: ['Кризис-менеджмент'] },
  { consciousness: 3, action: 5, typeName: 'Идейник без реализации', role: 'CONSULTANT', strengths: ['Идеи', 'Креатив'], risks: ['Срыв сроков', 'Бросает'], bestFor: ['Консалтинг', 'Старт проекта'] },
  { consciousness: 4, action: 4, typeName: 'Системный партнёр', role: 'PARTNER', strengths: ['Структура', 'Надёжность'], risks: ['Негибкость'], bestFor: ['Операционка', 'Финансы'] },
  { consciousness: 5, action: 5, typeName: 'Стартапер-хаотик', role: 'STARTER', strengths: ['Риск', 'Скорость'], risks: ['Хаос', 'Нестабильность'], bestFor: ['Стартапы', 'MVP'] },
  { consciousness: 6, action: 6, typeName: 'Тянущий всё', role: 'EXECUTOR', strengths: ['Ответственность', 'Удержание'], risks: ['Выгорание', 'Обида'], bestFor: ['Операционка', 'Сервис'] },
  { consciousness: 7, action: 7, typeName: 'Аналитик-одиночка', role: 'ANALYST', strengths: ['Анализ', 'Стратегия'], risks: ['Замкнутость', 'Паралич'], bestFor: ['Аналитика', 'Исследования'] },
  { consciousness: 8, action: 4, typeName: 'Жёсткий управленец', role: 'LEADER', strengths: ['Финансы', 'Контроль'], risks: ['Давление'], bestFor: ['Управление', 'Инвестиции'] },
  { consciousness: 9, action: 4, typeName: 'Стратег', role: 'CONSULTANT', strengths: ['Масштаб', 'Завершение'], risks: ['Отстранённость'], bestFor: ['Стратегия', 'Закрытие проектов'] },
];

// ============= 30 КЛЮЧЕВЫХ ПАТТЕРНОВ =============

export const behavioralPatterns: BehavioralPattern[] = [
  {
    id: '11-2-6-8',
    numbers: [11, 2, 6, 8],
    name: 'Контроль через эмоции и ресурсы',
    essence: 'Использует эмоциональную чувствительность как инструмент влияния, контролирует через деньги и чувство долга',
    inMinus: 'Манипуляции, ревность, финансовое давление, обесценивание',
    inPlus: 'Сильный управленец при осознанности и границах',
    loveContext: 'Может стать душащим партнёром, контролирующим через заботу и деньги',
    businessContext: 'Эффективный управленец, если есть внешний контроль',
    riskLevel: 'RED',
    riskTypes: ['ABUSER', 'MANIPULATOR', 'CONTROLLER'],
  },
  {
    id: '1-4-8',
    numbers: [1, 4, 8],
    name: 'Власть через структуру',
    essence: 'Лидер-системщик, строит империи через жёсткий контроль',
    inMinus: 'Жёсткий контроль, подавление партнёра, авторитаризм',
    inPlus: 'Лидер, строитель систем, надёжный фундамент',
    loveContext: 'Требует подчинения, не терпит возражений',
    businessContext: 'Идеален для построения структур, опасен для партнёров',
    riskLevel: 'YELLOW',
    riskTypes: ['TYRANT', 'CONTROLLER'],
  },
  {
    id: '2-6-9',
    numbers: [2, 6, 9],
    name: 'Эмоциональная зависимость',
    essence: 'Растворяется в партнёре, спасает, терпит',
    inMinus: 'Жертва, спасательство, потеря себя',
    inPlus: 'Глубокая эмпатия при личных границах',
    loveContext: 'Созависимость, терпит токсичное ради сохранения',
    businessContext: 'Тянет на себе, не умеет делегировать',
    riskLevel: 'YELLOW',
    riskTypes: ['CODEPENDENT'],
  },
  {
    id: '3-5-7',
    numbers: [3, 5, 7],
    name: 'Поиск смысла через хаос',
    essence: 'Метания, уходы, поиск себя через разрушение',
    inMinus: 'Метания, уходы, обнуления без объяснений',
    inPlus: 'Креатив, трансформации, рост через кризисы',
    loveContext: 'Непредсказуем, исчезает, возвращается',
    businessContext: 'Хорош для старта, плохо держит форму',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '4-6-8',
    numbers: [4, 6, 8],
    name: 'Контроль под видом заботы',
    essence: 'Создаёт «золотую клетку», контролирует через обеспечение',
    inMinus: 'Удушающие отношения, финансовая зависимость партнёра',
    inPlus: 'Семейный стратег при проговорённых ролях',
    loveContext: 'Материальная опора, но без свободы',
    businessContext: 'Надёжный, но контролирующий партнёр',
    riskLevel: 'RED',
    riskTypes: ['CONTROLLER', 'TYRANT'],
  },
  {
    id: '5-9',
    numbers: [5, 9],
    name: 'Бегство от ответственности',
    essence: 'Исчезает вместо решения проблем',
    inMinus: 'Исчезновения, незавершённые связи, безответственность',
    inPlus: 'Закрытие старых циклов, свобода от прошлого',
    loveContext: 'Уходит без объяснений, оставляет в неопределённости',
    businessContext: 'Закрывает проекты внезапно',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '7-7',
    numbers: [7, 7],
    name: 'Зеркальная трансформация',
    essence: 'Оба в пересборке, нет контакта',
    inMinus: 'Отчуждение, холод, разрывы без диалога',
    inPlus: 'Рост только через глубокую осознанность',
    loveContext: 'Союз без близости, эмоциональный холод',
    businessContext: 'Паралич решений, застой',
    riskLevel: 'RED',
    riskTypes: ['COLD'],
  },
  {
    id: '8-2',
    numbers: [8, 2],
    name: 'Давление через эмоции',
    essence: 'Психологический стратег, управляет через чувства',
    inMinus: 'Манипуляции, газлайтинг, эмоциональное давление',
    inPlus: 'Психологический стратег (опасен в минусе)',
    loveContext: 'Партнёр начинает сомневаться в реальности',
    businessContext: 'Манипулятивное управление командой',
    riskLevel: 'RED',
    riskTypes: ['MANIPULATOR', 'ABUSER'],
  },
  {
    id: '6-1',
    numbers: [6, 1],
    name: 'Союз семьи и лидера',
    essence: 'Потенциально сильная пара при распределении ролей',
    inMinus: 'Борьба за власть в паре',
    inPlus: 'Сильная пара при чётких ролях',
    loveContext: 'Работает, если один ведёт, другой поддерживает',
    businessContext: 'Отличная связка управленец + операционка',
    riskLevel: 'GREEN',
    riskTypes: ['NONE'],
  },
  {
    id: '9-1',
    numbers: [9, 1],
    name: 'Обнуление ради нового начала',
    essence: 'Резкие разрывы ради перезапуска',
    inMinus: 'Резкие разрывы, уход без объяснений',
    inPlus: 'Кармический переход, если осознан',
    loveContext: 'Закрывает отношения резко и навсегда',
    businessContext: 'Закрывает неэффективное, запускает новое',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '3-6',
    numbers: [3, 6],
    name: 'Эмоциональное обесценивание',
    essence: 'Ранит словами под видом шуток',
    inMinus: 'Слова ранят сильнее действий, колкие фразы',
    inPlus: 'Поддержка при зрелости речи',
    loveContext: '«Я просто пошутил(а)» — классика',
    businessContext: 'Может демотивировать команду',
    riskLevel: 'YELLOW',
    riskTypes: ['ABUSER'],
  },
  {
    id: '12-6',
    numbers: [12, 6],
    name: 'Жертва в отношениях',
    essence: 'Терпит, копит обиды, потом взрывается',
    inMinus: 'Жертвенность, накопленные обиды, взрывы',
    inPlus: 'Глубокая забота при равенстве',
    loveContext: 'Долго терпит, потом резко уходит или взрывается',
    businessContext: 'Перегружается, не просит помощи',
    riskLevel: 'YELLOW',
    riskTypes: ['CODEPENDENT'],
  },
  {
    id: '13-8',
    numbers: [13, 8],
    name: 'Манипулятор-контролёр',
    essence: 'Холодный расчёт + скрытая агрессия',
    inMinus: 'Давление, расчёт, скрытая агрессия',
    inPlus: 'Сильный бизнес-партнёр при этике',
    loveContext: 'Опасный партнёр: контроль + манипуляции',
    businessContext: 'Эффективен, но может «кинуть»',
    riskLevel: 'RED',
    riskTypes: ['MANIPULATOR', 'CONTROLLER'],
  },
  {
    id: '14-6',
    numbers: [14, 6],
    name: 'Качели «сближение–побег»',
    essence: 'То близко, то далеко — нестабильность',
    inMinus: 'Нестабильность, измены, уходы-возвраты',
    inPlus: 'Работает только при зрелых договорённостях',
    loveContext: 'Партнёр в постоянной неопределённости',
    businessContext: 'Срывает сроки, меняет решения',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '15-8',
    numbers: [15, 8],
    name: 'Соблазн и зависимость',
    essence: 'Притягивает и привязывает',
    inMinus: 'Токсичные привязки, зависимость',
    inPlus: 'Магнетизм, если нет зависимости',
    loveContext: 'Трудно уйти, даже когда плохо',
    businessContext: 'Может создать зависимость команды',
    riskLevel: 'RED',
    riskTypes: ['MANIPULATOR'],
  },
  {
    id: '16-1',
    numbers: [16, 1],
    name: 'Разрушение эго',
    essence: 'Конфликты, ведущие к трансформации или краху',
    inMinus: 'Конфликты, крах отношений, война эго',
    inPlus: 'Личностный рост после кризиса',
    loveContext: 'Либо трансформация, либо разрушение',
    businessContext: 'Конфликты с партнёрами',
    riskLevel: 'YELLOW',
    riskTypes: ['CONTROLLER'],
  },
  {
    id: '17-6',
    numbers: [17, 6],
    name: 'Иллюзия стабильности',
    essence: 'Материальная опора без эмоциональной близости',
    inMinus: '«Золотая клетка», контроль через обеспечение',
    inPlus: 'Материальная опора (без любви)',
    loveContext: 'Есть всё, кроме близости',
    businessContext: 'Стабильно, но без развития',
    riskLevel: 'YELLOW',
    riskTypes: ['CONTROLLER'],
  },
  {
    id: '18-2',
    numbers: [18, 2],
    name: 'Страх потери',
    essence: 'Подозрительность, додумывание, ревность',
    inMinus: 'Подозрительность, фантазии, обвинения',
    inPlus: 'Интуиция при психологической зрелости',
    loveContext: 'Партнёр устаёт оправдываться',
    businessContext: 'Не доверяет команде, перепроверяет',
    riskLevel: 'YELLOW',
    riskTypes: ['MANIPULATOR'],
  },
  {
    id: '19-9',
    numbers: [19, 9],
    name: 'Гордыня и одиночество',
    essence: 'Разрушает связи своей гордостью',
    inMinus: 'Саморазрушение связей, одиночество',
    inPlus: 'Лидер-одиночка, если принимает других',
    loveContext: 'Остаётся один из-за гордости',
    businessContext: 'Не умеет работать в команде',
    riskLevel: 'YELLOW',
    riskTypes: ['COLD'],
  },
  {
    id: '20-6',
    numbers: [20, 6],
    name: 'Зависимость от одобрения',
    essence: 'Подстраивается, теряет себя ради принятия',
    inMinus: 'Подстройка, потеря себя, угодничество',
    inPlus: 'Гармония при уверенности в себе',
    loveContext: 'Растворяется в партнёре',
    businessContext: 'Не может сказать «нет»',
    riskLevel: 'YELLOW',
    riskTypes: ['CODEPENDENT'],
  },
  {
    id: '21-9',
    numbers: [21, 9],
    name: 'Болтовня без действий',
    essence: 'Много слов, мало дел',
    inMinus: 'Иллюзии, пустые обещания, разговоры вместо действий',
    inPlus: 'Завершение циклов через осознание',
    loveContext: 'Обещает, но не делает',
    businessContext: 'Идеи без реализации',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '22-4',
    numbers: [22, 4],
    name: 'Строитель империй',
    essence: 'Долгосрочное строительство через труд',
    inMinus: 'Трудоголизм, холод, фокус только на деле',
    inPlus: 'Долгосрочные проекты, строительство бизнеса',
    loveContext: 'Работа важнее отношений',
    businessContext: 'Идеален для долгосрочных проектов',
    riskLevel: 'GREEN',
    riskTypes: ['NONE'],
  },
  {
    id: '23-8',
    numbers: [23, 8],
    name: 'Риск ради выгоды',
    essence: 'Азарт, авантюры, предпринимательский дух',
    inMinus: 'Азарт, авантюры, рискованные решения',
    inPlus: 'Предпринимательский талант',
    loveContext: 'Непредсказуем, ищет острых ощущений',
    businessContext: 'Хорош для стартапов, опасен для стабильных проектов',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '24-2',
    numbers: [24, 2],
    name: 'Растворение в партнёре',
    essence: 'Полная зависимость от другого',
    inMinus: 'Потеря границ, растворение, зависимость',
    inPlus: 'Мягкость и поддержка при зрелости',
    loveContext: 'Не существует без партнёра',
    businessContext: 'Не может работать самостоятельно',
    riskLevel: 'YELLOW',
    riskTypes: ['CODEPENDENT'],
  },
  {
    id: '25-7',
    numbers: [25, 7],
    name: 'Двойная изоляция',
    essence: 'Полный уход в себя',
    inMinus: 'Полный разрыв контакта, изоляция',
    inPlus: 'Глубокая трансформация в одиночестве',
    loveContext: 'Союз без контакта',
    businessContext: 'Не работает в команде',
    riskLevel: 'RED',
    riskTypes: ['COLD'],
  },
  {
    id: '26-6',
    numbers: [26, 6],
    name: 'Финансовый контроль',
    essence: 'Деньги как инструмент власти',
    inMinus: 'Деньги = власть, финансовое давление',
    inPlus: 'Надёжность при честных правилах',
    loveContext: 'Контролирует через деньги',
    businessContext: 'Сильный финансист, но может давить',
    riskLevel: 'YELLOW',
    riskTypes: ['CONTROLLER'],
  },
  {
    id: '27-9',
    numbers: [27, 9],
    name: 'Кармическое завершение',
    essence: 'Потери и расставания как урок',
    inMinus: 'Потери, расставания, боль завершения',
    inPlus: 'Закрытие старых сценариев, мудрость',
    loveContext: 'Часто приходит после сложных отношений',
    businessContext: 'Закрывает старые проекты',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
  {
    id: '28-8',
    numbers: [28, 8],
    name: 'Власть и амбиции',
    essence: 'Сильное стремление к власти и контролю',
    inMinus: 'Давление, авторитарность, подавление',
    inPlus: 'Сильный лидер, если слышит других',
    loveContext: 'Требует подчинения',
    businessContext: 'Эффективный, но жёсткий руководитель',
    riskLevel: 'YELLOW',
    riskTypes: ['TYRANT'],
  },
  {
    id: '29-2',
    numbers: [29, 2],
    name: 'Эмоциональный манипулятор',
    essence: 'Использует интуицию для манипуляций',
    inMinus: 'Ложь, двойные игры, манипуляции',
    inPlus: 'Интуитивный психолог при честности',
    loveContext: 'Партнёр не понимает, что происходит',
    businessContext: 'Может «прочитать» любого',
    riskLevel: 'RED',
    riskTypes: ['MANIPULATOR'],
  },
  {
    id: '30-6-9',
    numbers: [30, 6, 9],
    name: 'Инфантильная забота',
    essence: 'Забота как уход от ответственности',
    inMinus: 'Обесценивание, уход от ответственности, инфантильность',
    inPlus: 'Творческий наставник, если зрел',
    loveContext: 'Много слов о заботе, мало действий',
    businessContext: 'Не берёт ответственность',
    riskLevel: 'YELLOW',
    riskTypes: ['ESCAPER'],
  },
];

// ============= КОНФЛИКТНЫЕ СОЧЕТАНИЯ =============

export const conflictCombinations: ConflictCombination[] = [
  {
    numbers: [11, 2],
    conflictType: 'Эмоциональная манипуляция',
    behavior: ['Давление через чувства', 'Искажение фактов', '«Ты всё неправильно понял(а)»'],
    outcome: 'Газлайтинг, психологическое истощение',
    redFlag: 'Скрытый абьюз',
    severity: 'CRITICAL',
  },
  {
    numbers: [11, 6],
    conflictType: 'Контроль под видом заботы',
    behavior: ['Унижение «из лучших побуждений»', 'Вмешательство в личные решения'],
    outcome: 'Потеря самооценки партнёра',
    redFlag: 'Моральное насилие',
    severity: 'CRITICAL',
  },
  {
    numbers: [11, 8],
    conflictType: 'Власть и доминирование',
    behavior: ['Статус, деньги как рычаг', 'Демонстрация превосходства'],
    outcome: 'Подавление, страх, зависимость',
    redFlag: 'Тиран / деспот',
    severity: 'CRITICAL',
  },
  {
    numbers: [2, 6],
    conflictType: 'Созависимость',
    behavior: ['Растворение в партнёре', 'Страх быть брошенным'],
    outcome: 'Жертва–спасатель',
    redFlag: 'Эмоциональная зависимость',
    severity: 'HIGH',
  },
  {
    numbers: [2, 9],
    conflictType: 'Фантазии вместо реальности',
    behavior: ['Додумывание', 'Обвинения без фактов'],
    outcome: 'Паранойя, истерики',
    redFlag: 'Нестабильная психика',
    severity: 'HIGH',
  },
  {
    numbers: [3, 6],
    conflictType: 'Словесное обесценивание',
    behavior: ['Колкие фразы', '«Я просто пошутил(а)»'],
    outcome: 'Хронические конфликты',
    redFlag: 'Вербальное насилие',
    severity: 'HIGH',
  },
  {
    numbers: [3, 9],
    conflictType: 'Уход от ответственности',
    behavior: ['Разговоры вместо действий', 'Исчезновения'],
    outcome: 'Незавершённые отношения',
    redFlag: 'Инфантильность',
    severity: 'HIGH',
  },
  {
    numbers: [4, 8],
    conflictType: 'Жёсткий контроль',
    behavior: ['Тотальный контроль', 'Наказание за непослушание'],
    outcome: 'Разрушение личности партнёра',
    redFlag: 'Диктатура',
    severity: 'CRITICAL',
  },
  {
    numbers: [5, 5],
    conflictType: 'Хаос',
    behavior: ['Нестабильность', 'Постоянные смены решений'],
    outcome: 'Качели, измены, разрывы',
    redFlag: 'Невозможность долгосрочного союза',
    severity: 'HIGH',
  },
  {
    numbers: [7, 7],
    conflictType: 'Эмоциональный холод',
    behavior: ['Дистанция', 'Молчаливые разрывы'],
    outcome: 'Отчуждение',
    redFlag: 'Союз без близости',
    severity: 'HIGH',
  },
];

// ============= ПРОФИЛИ РИСКОВ =============

export const riskProfiles: Record<RiskType, RiskProfile> = {
  ABUSER: {
    type: 'ABUSER',
    name: 'Абьюзер',
    triggers: [11, 2, 6, 3],
    behaviorPattern: 'Искажает реальность, унижает под видом заботы, провоцирует чувство вины, обесценивает',
    partnerFeels: ['Постоянное сомнение в себе', 'Тревожность', 'Эмоциональное истощение', 'Зависимость'],
    realLifeSigns: ['«Я же для тебя стараюсь»', '«Ты слишком чувствительная»', 'Публичные унижения', 'Двойные стандарты'],
    plusPotential: {
      strengths: ['Высокий интеллект', 'Стратегическое мышление', 'Сильная речь'],
      usefulIn: ['Управление', 'Аналитика', 'Консалтинг', 'Переговоры'],
      safeConditions: ['Чёткие рамки ответственности', 'Равный по силе партнёр', 'Прозрачные договорённости'],
      stillDangerousIf: ['Есть личная привязанность', 'Дисбаланс власти', 'Партнёр слабее или зависим'],
    },
  },
  MANIPULATOR: {
    type: 'MANIPULATOR',
    name: 'Манипулятор',
    triggers: [2, 8, 11, 3],
    behaviorPattern: 'Давит через эмоции, играет роль жертвы, перекладывает ответственность, управляет через страх потери',
    partnerFeels: ['Чувство долга', 'Страх сказать «нет»', 'Постоянное напряжение', 'Ощущение ловушки'],
    realLifeSigns: ['«Я без тебя не справлюсь»', '«Если ты уйдёшь — мне будет плохо»', 'Слёзы как инструмент'],
    plusPotential: {
      strengths: ['Тонкое чувствование людей', 'Эмпатия', 'Умение управлять атмосферой'],
      usefulIn: ['Психология', 'Коучинг', 'HR', 'Управление командами'],
      safeConditions: ['Осознанная работа с границами', 'Отсутствие ревности', 'Прозрачность мотивов'],
      stillDangerousIf: ['Есть романтическая зависимость', 'Финансовая привязка', 'Тайные ожидания'],
    },
  },
  TYRANT: {
    type: 'TYRANT',
    name: 'Тиран',
    triggers: [8, 11, 4],
    behaviorPattern: 'Контролирует финансы, диктует правила, подавляет инициативу, не терпит возражений',
    partnerFeels: ['Страх', 'Подчинение', 'Потеря воли', 'Ощущение клетки'],
    realLifeSigns: ['«Я лучше знаю»', '«Без меня ты никто»', 'Контроль времени, денег, контактов'],
    plusPotential: {
      strengths: ['Жёсткая структура', 'Ответственность', 'Способность удерживать системы'],
      usefulIn: ['Бизнес', 'Управление', 'Финансы', 'Безопасность'],
      safeConditions: ['Власть ограничена правилами', 'Есть внешний контроль', 'Партнёр не зависим'],
      stillDangerousIf: ['Нет ограничений', 'Эмоциональная или финансовая зависимость'],
    },
  },
  CODEPENDENT: {
    type: 'CODEPENDENT',
    name: 'Созависимый',
    triggers: [2, 6, 12],
    behaviorPattern: 'Растворяется в партнёре, терпит, спасает, не имеет границ',
    partnerFeels: ['Давление заботой', 'Невозможность быть собой', 'Чувство вины за свои потребности'],
    realLifeSigns: ['Всегда рядом', 'Терпит недопустимое', 'Оправдывает партнёра'],
    plusPotential: {
      strengths: ['Глубокая эмпатия', 'Забота', 'Преданность'],
      usefulIn: ['Помогающие профессии', 'Сервис', 'Поддержка'],
      safeConditions: ['Личные границы', 'Равенство в отношениях', 'Своя жизнь вне пары'],
      stillDangerousIf: ['Партнёр использует', 'Нет своих интересов', 'Потеря идентичности'],
    },
  },
  ESCAPER: {
    type: 'ESCAPER',
    name: 'Уходящий',
    triggers: [5, 9, 7],
    behaviorPattern: 'Исчезает вместо диалога, не закрывает разговоры, оставляет в неопределённости',
    partnerFeels: ['Неопределённость', 'Ожидание', 'Тревога', 'Ощущение брошенности'],
    realLifeSigns: ['Исчезает без объяснений', 'Не отвечает на вопросы', 'Уходит в себя'],
    plusPotential: {
      strengths: ['Умение завершать этапы', 'Не держит зла', 'Не разрушает открыто'],
      usefulIn: ['Проектная работа', 'Краткосрочные задачи', 'Консультации'],
      safeConditions: ['Нет ожиданий стабильности', 'Чёткие сроки', 'Фиксированный формат'],
      stillDangerousIf: ['Партнёр ждёт близости', 'Есть эмоциональная вовлечённость'],
    },
  },
  CONTROLLER: {
    type: 'CONTROLLER',
    name: 'Контролёр',
    triggers: [4, 8, 6],
    behaviorPattern: 'Контролирует через структуру, деньги или заботу, требует отчёта',
    partnerFeels: ['Отсутствие свободы', 'Необходимость оправдываться', 'Давление'],
    realLifeSigns: ['Проверяет телефон', 'Контролирует траты', 'Требует отчёта о времени'],
    plusPotential: {
      strengths: ['Организованность', 'Надёжность', 'Ответственность'],
      usefulIn: ['Управление', 'Финансы', 'Логистика'],
      safeConditions: ['Контроль над процессами, не людьми', 'Уважение к границам', 'Доверие'],
      stillDangerousIf: ['Контроль над партнёром', 'Нет доверия', 'Ревность'],
    },
  },
  COLD: {
    type: 'COLD',
    name: 'Эмоционально холодный',
    triggers: [7, 9],
    behaviorPattern: 'Дистанция, отстранённость, отсутствие эмоциональной близости',
    partnerFeels: ['Одиночество в паре', 'Непонятость', 'Отвержение'],
    realLifeSigns: ['Не выражает чувства', 'Избегает близости', 'Молчит в конфликтах'],
    plusPotential: {
      strengths: ['Стабильность', 'Рациональность', 'Независимость'],
      usefulIn: ['Аналитика', 'Исследования', 'Индивидуальная работа'],
      safeConditions: ['Партнёр не ждёт эмоциональности', 'Уважение к пространству', 'Другие источники эмоций'],
      stillDangerousIf: ['Партнёр нуждается в близости', 'Эмоциональный голод'],
    },
  },
  NONE: {
    type: 'NONE',
    name: 'Нет рисков',
    triggers: [],
    behaviorPattern: '',
    partnerFeels: [],
    realLifeSigns: [],
    plusPotential: {
      strengths: [],
      usefulIn: [],
      safeConditions: [],
      stillDangerousIf: [],
    },
  },
};

// ============= ОСОБО ОПАСНЫЕ СВЯЗКИ =============

export const criticalCombinations: { numbers: number[], danger: string }[] = [
  { numbers: [11, 2, 6], danger: 'Манипулятивный абьюзер' },
  { numbers: [13, 8], danger: 'Холодный контролёр' },
  { numbers: [15, 8], danger: 'Токсичная зависимость' },
  { numbers: [18, 2], danger: 'Паранойя' },
  { numbers: [11, 11], danger: 'Война эго' },
  { numbers: [11, 2, 6, 8], danger: 'Абьюзер-тиран' },
  { numbers: [2, 6, 8], danger: 'Созависимая ловушка' },
  { numbers: [6, 8], danger: '«Золотая клетка»' },
];

// ============= ФУНКЦИЯ АНАЛИЗА ПАТТЕРНОВ =============

export function analyzePatterns(numbers: number[]): {
  matchedPatterns: BehavioralPattern[];
  matchedConflicts: ConflictCombination[];
  criticalMatches: string[];
  detectedRisks: RiskType[];
} {
  const matchedPatterns: BehavioralPattern[] = [];
  const matchedConflicts: ConflictCombination[] = [];
  const criticalMatches: string[] = [];
  const detectedRisks = new Set<RiskType>();
  
  // Проверяем паттерны
  for (const pattern of behavioralPatterns) {
    const matchCount = pattern.numbers.filter(n => numbers.includes(n)).length;
    if (matchCount >= 2 || (pattern.numbers.length <= 2 && matchCount === pattern.numbers.length)) {
      matchedPatterns.push(pattern);
      pattern.riskTypes.forEach(r => detectedRisks.add(r));
    }
  }
  
  // Проверяем конфликтные сочетания
  for (const conflict of conflictCombinations) {
    if (conflict.numbers.every(n => numbers.includes(n))) {
      matchedConflicts.push(conflict);
    }
  }
  
  // Проверяем критические комбинации
  for (const critical of criticalCombinations) {
    const matchCount = critical.numbers.filter(n => numbers.includes(n)).length;
    if (matchCount >= 2) {
      criticalMatches.push(critical.danger);
    }
  }
  
  return {
    matchedPatterns,
    matchedConflicts,
    criticalMatches,
    detectedRisks: Array.from(detectedRisks),
  };
}

// ============= ФУНКЦИЯ ВЕРДИКТА =============

export function calculateVerdict(
  consciousness1: number, action1: number,
  consciousness2: number, action2: number,
  relationType: 'love' | 'business'
): VerdictResult {
  // Собираем все числа
  const allNumbers = [consciousness1, action1, consciousness2, action2];
  
  // Добавляем промежуточные числа если есть
  const expandedNumbers = [...allNumbers];
  if (consciousness1 > 9) expandedNumbers.push(consciousness1);
  if (action1 > 9) expandedNumbers.push(action1);
  if (consciousness2 > 9) expandedNumbers.push(consciousness2);
  if (action2 > 9) expandedNumbers.push(action2);
  
  // Анализируем паттерны
  const analysis = analyzePatterns(expandedNumbers);
  
  // Определяем уровень риска
  let status: RiskLevel = 'GREEN';
  let statusLabel = 'МОЖНО';
  
  const criticalRisks: RiskType[] = ['ABUSER', 'TYRANT'];
  const mediumRisks: RiskType[] = ['MANIPULATOR', 'CONTROLLER'];
  
  const hasCritical = analysis.detectedRisks.some(r => criticalRisks.includes(r));
  const hasMedium = analysis.detectedRisks.some(r => mediumRisks.includes(r));
  const hasCriticalConflicts = analysis.matchedConflicts.some(c => c.severity === 'CRITICAL');
  
  if (hasCritical || hasCriticalConflicts || analysis.criticalMatches.length >= 2) {
    status = 'RED';
    statusLabel = 'БЕГИ';
  } else if (hasMedium || analysis.matchedConflicts.length > 0 || analysis.criticalMatches.length > 0) {
    status = 'YELLOW';
    statusLabel = 'ОСТОРОЖНО';
  }
  
  // Формируем единый паттерн
  let unifiedPattern = '';
  if (analysis.matchedPatterns.length > 0) {
    const mainPattern = analysis.matchedPatterns[0];
    unifiedPattern = mainPattern.essence;
  } else {
    unifiedPattern = 'Стандартная динамика отношений без выраженных рисков';
  }
  
  // Формируем плюсовой потенциал
  let plusPotential = '';
  if (analysis.detectedRisks.length > 0 && analysis.detectedRisks[0] !== 'NONE') {
    const mainRisk = riskProfiles[analysis.detectedRisks[0]];
    plusPotential = `При осознанности: ${mainRisk.plusPotential.strengths.join(', ')}. Полезно в: ${mainRisk.plusPotential.usefulIn.join(', ')}.`;
  } else {
    plusPotential = 'Потенциал для здоровых отношений при взаимном уважении';
  }
  
  // Эффект на партнёра
  const partnerEffect = {
    inPlus: ['Ощущение поддержки', 'Стабильность', 'Развитие'],
    inMinus: [] as string[],
  };
  
  analysis.detectedRisks.forEach(risk => {
    if (risk !== 'NONE') {
      partnerEffect.inMinus.push(...riskProfiles[risk].partnerFeels.slice(0, 2));
    }
  });
  
  // Рекомендация
  let recommendation = '';
  if (status === 'GREEN') {
    recommendation = relationType === 'love'
      ? 'Союз имеет здоровый потенциал при взаимном уважении и границах'
      : 'Партнёрство перспективно при чётких договорённостях';
  } else if (status === 'YELLOW') {
    recommendation = relationType === 'love'
      ? 'Союз возможен, но требует осознанности и чётких границ. Без работы над отношениями уходит в минус'
      : 'Партнёрство возможно при жёстких договорённостях, дедлайнах и контроле точек';
  } else {
    recommendation = relationType === 'love'
      ? 'Связка несёт разрушительный сценарий. Углубление отношений усиливает ущерб'
      : 'Партнёрство крайне рискованно. Только при жёстких юридических рамках';
  }
  
  // Чек-лист выхода для RED
  let exitChecklist: string[] | undefined;
  if (status === 'RED') {
    exitChecklist = [
      'Финансовая автономия',
      'Прекращение обсуждений',
      'Фиксация фактов',
      'Дистанция',
      'Этот сценарий не лечится разговорами — только действием',
    ];
  }
  
  return {
    status,
    statusLabel,
    mainRisks: analysis.detectedRisks,
    patterns: analysis.matchedPatterns,
    conflicts: analysis.matchedConflicts,
    unifiedPattern,
    plusPotential,
    partnerEffect,
    recommendation,
    exitChecklist,
  };
}
