import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Check, AlertTriangle, FileText, Code, Database, Layers, Palette, Globe, Shield, CreditCard, Brain, Compass } from "lucide-react";
import { useState } from "react";

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-3 w-full p-4 rounded-xl bg-card border border-border hover:bg-accent/50 transition-colors text-left">
        <Icon className="w-5 h-5 text-primary flex-shrink-0" />
        <span className="font-display font-semibold text-foreground flex-1">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 pl-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function StatusBadge({ status }: { status: 'done' | 'partial' | 'todo' }) {
  if (status === 'done') return <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30">✅ Готово</Badge>;
  if (status === 'partial') return <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">⚠️ Частично</Badge>;
  return <Badge className="bg-red-500/20 text-red-700 border-red-500/30">❌ TODO</Badge>;
}

export default function DevReport() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">📋 Отчёт для разработчика</h1>
          <p className="text-muted-foreground">Полная документация проекта Life C⚙D — архитектура, модули, статус реализации</p>
          <p className="text-xs text-muted-foreground mt-1">Последнее обновление: Апрель 2026</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="overview" className="text-xs">Обзор</TabsTrigger>
            <TabsTrigger value="architecture" className="text-xs">Архитектура</TabsTrigger>
            <TabsTrigger value="modules" className="text-xs">Модули</TabsTrigger>
            <TabsTrigger value="data" className="text-xs">Данные</TabsTrigger>
            <TabsTrigger value="tiers" className="text-xs">Тарифы</TabsTrigger>
            <TabsTrigger value="backend" className="text-xs">Backend</TabsTrigger>
            <TabsTrigger value="i18n" className="text-xs">i18n</TabsTrigger>
            <TabsTrigger value="todo" className="text-xs">TODO</TabsTrigger>
          </TabsList>

          {/* === ОБЗОР === */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" /> Общее описание проекта</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Life C⚙D</strong> — веб-приложение нумерологических расчётов и анализов, построенное на двух методологиях:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Методология 1 — «22 Аркана»:</strong> 9 типов анализа (Предназначение, Совместимость, Прогнозы год/месяц/день, Родовые программы, Энергия договора, Энергия названия, Финансовый код)</li>
                  <li><strong className="text-foreground">Методология 2 — «Life C⚙D / Классическая»:</strong> Единый «Полный разбор» с 10 вкладками (личная аналитика, пиннакли, прогноз, совместимость, финансовый код, психопрофиль, энергокарта, матрица судьбы, план действий)</li>
                </ul>
                <p>Каждый анализ имеет два тарифа: <strong className="text-foreground">Базовый</strong> (бесплатный, сокращённый контент) и <strong className="text-foreground">Профессиональный</strong> (платный, 15+ страниц глубокого разбора).</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Технологический стек</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    { label: "React", detail: "18.x + TypeScript 5" },
                    { label: "Vite", detail: "5.x (сборка)" },
                    { label: "Tailwind CSS", detail: "v3 + shadcn/ui" },
                    { label: "React Router", detail: "v6 (маршрутизация)" },
                    { label: "React Query", detail: "TanStack Query" },
                    { label: "i18next", detail: "RU / EN / ES" },
                    { label: "jsPDF", detail: "Генерация PDF" },
                    { label: "Supabase", detail: "Backend (Lovable Cloud)" },
                    { label: "Radix UI", detail: "Примитивы компонентов" },
                    { label: "Lucide Icons", detail: "Иконки" },
                    { label: "Framer Motion", detail: "Анимации (частично)" },
                    { label: "date-fns", detail: "Работа с датами" },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="font-medium text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === АРХИТЕКТУРА === */}
          <TabsContent value="architecture" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="w-5 h-5" /> Структура файлов</CardTitle>
              </CardHeader>
              <CardContent className="text-sm font-mono space-y-2 text-muted-foreground">
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-xs leading-relaxed">{`src/
├── pages/                    # Страницы приложения
│   ├── Index.tsx             # Главная (выбор методологии + анализов)
│   ├── Calendar.tsx          # Нумерологический календарь
│   ├── Crisis.tsx            # Антикризисный разбор
│   ├── Products.tsx          # Страница тарифов
│   ├── Support.tsx           # Поддержка
│   └── DevReport.tsx         # Эта страница
│
├── components/
│   ├── Header.tsx            # Навигация
│   ├── MethodologySelector   # Переключатель методологий (1/2)
│   ├── TierSelector.tsx      # Выбор тарифа (Базовый/Проф)
│   ├── PaymentScreen.tsx     # Экран оплаты
│   ├── PaidBlock.tsx         # Блюр для платного контента
│   ├── DateInput.tsx         # Ввод даты рождения
│   ├── CompatibilityDateInput# Ввод двух дат
│   ├── OnboardingFlow.tsx    # Пошаговый онбординг
│   │
│   ├── PersonalMatrixResult  # Матрица судьбы (12 позиций)
│   ├── YearForecastResult    # Прогноз на год
│   ├── MonthForecastResult   # Прогноз на месяц
│   ├── DailyForecastResult   # Прогноз на день
│   ├── CompatibilityResult   # Совместимость
│   ├── AncestralResult       # Родовые программы
│   ├── FinancialCodeResult   # Финансовый код
│   ├── ContractEnergyResult  # Энергия договора
│   ├── NameEnergyResult      # Энергия названия
│   ├── KeyToResult.tsx       # Ключ к (доп. расчёт)
│   │
│   ├── ArcanaCard.tsx        # Карточка аркана (базовая)
│   ├── ProArcanaCard.tsx     # Карточка аркана (про)
│   ├── ProSectionBlock.tsx   # Блок про-секции
│   ├── KarmicStar.tsx        # SVG кармической звезды
│   ├── PDFDownloadButton.tsx # Кнопка скачивания PDF
│   │
│   ├── lifecod/              # Компоненты методологии 2
│   │   ├── LifeCodInputForm  # Форма ввода
│   │   ├── LifeCodResult     # Результат совместимости
│   │   ├── UnifiedPersonalResult # Личный разбор (10 вкладок)
│   │   ├── LifeCodPersonalResult # Персональный результат
│   │   ├── CompatibilityMetrics
│   │   ├── ForecastTimeline
│   │   ├── OverallVerdict
│   │   ├── PersonAnalysisCard
│   │   └── RelationTypeSelector
│   │
│   └── ui/                   # shadcn/ui компоненты
│
├── lib/                      # Логика расчётов
│   ├── calculations.ts       # Ядро: матрица, совместимость
│   ├── arcana.ts             # Данные 22 арканов
│   ├── arcanaCompatibilityData # Данные совместимости
│   ├── arcanaForecastData.ts # Данные прогнозов
│   ├── dailyForecast.ts      # Расчёт дня
│   ├── financialCode.ts      # Финансовый код
│   ├── ancestral.ts          # Родовые программы
│   ├── keyto.ts              # Ключ к
│   ├── nameEnergy.ts         # Энергия названия
│   ├── matrixInterpretation  # Интерпретации матрицы
│   ├── numerology.ts         # Базовая нумерология
│   │
│   ├── proInterpretations.ts # PRO: глубокие интерпретации
│   ├── proInterpretationsExtra# PRO: финкод, родовые, договор
│   ├── proMonthForecast.ts   # PRO: месячный прогноз
│   ├── yearForecastDetailed  # PRO: детальный годовой
│   ├── yearForecastExtra.ts  # PRO: исцеление, ритуалы
│   │
│   ├── analysisConfig.ts     # Конфиг всех 9 анализов
│   ├── accessControl.ts      # Управление доступом
│   ├── pdfGenerator.ts       # Генерация PDF
│   │
│   └── lifecod/              # Методология 2 (логика)
│       ├── types.ts          # Типы
│       ├── data.ts           # Данные чисел
│       ├── calculations.ts   # Расчёты
│       ├── patterns.ts       # Паттерны
│       ├── pinnacles.ts      # Пиннакли
│       ├── personalAnalysis  # Личный анализ
│       ├── personalForecast  # Персональный прогноз
│       ├── destinyMatrix.ts  # Матрица судьбы
│       ├── financialCodeLC   # Финкод (методология 2)
│       ├── psychProfile.ts   # Психопрофиль
│       ├── energyMap.ts      # Энергокарта
│       ├── actionPlan.ts     # План действий
│       ├── monthlyForecast   # Месячный прогноз
│       ├── pairYearLinks.ts  # Годовые связи пары
│       └── pdfExport.ts      # PDF экспорт
│
├── i18n/                     # Локализация
│   ├── index.ts
│   └── locales/
│       ├── ru.json
│       ├── en.json
│       └── es.json
│
└── integrations/
    └── supabase/             # Автогенерация (НЕ РЕДАКТИРОВАТЬ)
        ├── client.ts
        └── types.ts`}</pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Маршрутизация (React Router)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Путь</TableHead>
                      <TableHead>Компонент</TableHead>
                      <TableHead>Описание</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["/", "Index", "Главная — выбор методологии и анализа"],
                      ["/calendar", "Calendar", "Нумерологический календарь"],
                      ["/crisis", "Crisis", "Антикризисный разбор"],
                      ["/products", "Products", "Тарифы и пакеты"],
                      ["/support", "Support", "Страница поддержки"],
                      ["/dev-report", "DevReport", "Документация для разработчика"],
                      ["*", "NotFound", "404 страница"],
                    ].map(([path, comp, desc]) => (
                      <TableRow key={path}>
                        <TableCell className="font-mono text-xs">{path}</TableCell>
                        <TableCell className="font-medium">{comp}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ключевые паттерны</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p><strong className="text-foreground">1. Методологии:</strong> Пользователь выбирает Методологию 1 (22 Аркана) или 2 (Life C⚙D). Переключатель — <code className="bg-muted px-1 rounded">MethodologySelector</code>.</p>
                  <p><strong className="text-foreground">2. Карточки сценариев:</strong> Каждый тип анализа — карточка в <code className="bg-muted px-1 rounded">Index.tsx</code>. При клике открывается онбординг → ввод данных → результат.</p>
                  <p><strong className="text-foreground">3. Тарифная система:</strong> <code className="bg-muted px-1 rounded">TierSelector</code> показывает базовый/проф. <code className="bg-muted px-1 rounded">PaidBlock</code> скрывает платный контент блюром.</p>
                  <p><strong className="text-foreground">4. Контекст доступа:</strong> <code className="bg-muted px-1 rounded">AccessProvider</code> + <code className="bg-muted px-1 rounded">useAccess()</code> управляют состоянием (locked/preview/payment_pending/unlocked). Dev-мод через localStorage.</p>
                  <p><strong className="text-foreground">5. Расчёты:</strong> Вся логика в <code className="bg-muted px-1 rounded">src/lib/</code>. Компоненты получают результат и рендерят. Чистое разделение data/view.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === МОДУЛИ === */}
          <TabsContent value="modules" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Все 10 аналитических модулей проекта с описанием логики и текущего статуса.</p>
            
            <Section title="1. Предназначение (Матрица Судьбы)" icon={Compass} defaultOpen>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">calculations.ts → calculatePersonalMatrix()</Badge>
                </div>
                <p>12 позиций матрицы на основе даты рождения. Базовый — 6 позиций. PRO — все 12 + карма + код успеха + периоды.</p>
                <p><strong className="text-foreground">Файлы:</strong> PersonalMatrixResult.tsx, calculations.ts, matrixInterpretation.ts, proInterpretations.ts</p>
                <p><strong className="text-foreground">PRO контент:</strong> 7 вкладок (Главное, Цели, Периоды, Карма, Код успеха, Связи, Итоги). Каждая позиция — аркан с положительным/отрицательным проявлением.</p>
              </div>
            </Section>

            <Section title="2. Совместимость" icon={Brain}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">calculations.ts → calculateCompatibility()</Badge>
                </div>
                <p>Анализ пары по двум датам. Базовый: %, аркан, выводы. PRO: динамика пары, зоны конфликтов, сексуальная химия, финансы, 3 сценария.</p>
                <p><strong className="text-foreground">Файлы:</strong> CompatibilityResult.tsx, arcanaCompatibilityData.ts</p>
              </div>
            </Section>

            <Section title="3. Прогноз на год" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">calculations.ts → calculateYearForecast()</Badge>
                </div>
                <p>Аркан года + энергия. PRO: 12 месяцев (по абзацу), 4 квартала, ресурсы/утечки, исцеляющие темы, ритуал дня рождения, главный экзамен года, задачи года.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> yearForecastDetailed.ts, yearForecastExtra.ts, arcanaForecastData.ts</p>
              </div>
            </Section>

            <Section title="4. Прогноз на месяц" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">calculations.ts → calculateMonthForecast()</Badge>
                </div>
                <p>Треугольник месяца (3 аркана). PRO: анализ синергии/конфликтов, жизненные сферы (деньги, карьера, отношения, здоровье), понедельный разбор, дневные практики.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> proMonthForecast.ts</p>
              </div>
            </Section>

            <Section title="5. Прогноз на день" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">dailyForecast.ts → calculateDailyForecast()</Badge>
                </div>
                <p>12 позиций дня. PRO: почасовые стратегии (утро/день/вечер), сферы жизни, ритуалы дня.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> proInterpretationsExtra.ts → getDailyProData()</p>
              </div>
            </Section>

            <Section title="6. Родовые программы" icon={Brain}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">ancestral.ts → calculateAncestralPrograms()</Badge>
                </div>
                <p>Кармическая звезда, рабочие числа, родовые роли. PRO: кармические долги, пути исцеления, дары/блоки рода, поколенные паттерны.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> proInterpretationsExtra.ts → getAncestralProData()</p>
              </div>
            </Section>

            <Section title="7. Энергия договора" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">Использует calculatePersonalMatrix()</Badge>
                </div>
                <p>Анализ даты подписания договора. PRO: оценка рисков, оптимальная стратегия подписания, анализ тайминга.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> proInterpretationsExtra.ts → getContractProData()</p>
              </div>
            </Section>

            <Section title="8. Энергия названия" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">nameEnergy.ts → calculateNameEnergy()</Badge>
                </div>
                <p>Нумерологический анализ имени или бренда. Только базовый тариф (без PRO).</p>
              </div>
            </Section>

            <Section title="9. Финансовый код" icon={Layers}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">financialCode.ts → calculateFinancialCode()</Badge>
                </div>
                <p>4-значный код. PRO: психология денег, стратегии дохода, инвестиционный профиль, план действий.</p>
                <p><strong className="text-foreground">Доп. файлы:</strong> proInterpretationsExtra.ts → getFinancialCodeProData()</p>
              </div>
            </Section>

            <Section title="10. Полный разбор (Методология 2)" icon={FileText}>
              <div className="p-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-2 flex-wrap">
                  <StatusBadge status="done" />
                  <Badge variant="outline">lifecod/* (16 файлов)</Badge>
                </div>
                <p>Единый разбор с 10 вкладками: Обзор, Личность, Пиннакли, Прогноз, Совместимость, Финансовый код, Психопрофиль, Энергокарта, Матрица судьбы, План действий.</p>
                <p><strong className="text-foreground">Компоненты:</strong> UnifiedPersonalResult, LifeCodResult, LifeCodPersonalResult + 6 вспомогательных</p>
              </div>
            </Section>
          </TabsContent>

          {/* === ДАННЫЕ === */}
          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Источники данных</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Все интерпретации хранятся в статических файлах <code className="bg-muted px-1 rounded">src/lib/</code>. База данных используется только для покупок.</p>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Файл</TableHead>
                      <TableHead>Содержит</TableHead>
                      <TableHead>Арканы</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["arcana.ts", "Базовые данные 22 арканов (имя, ключевые слова, описание)", "1-22"],
                      ["arcanaCompatibilityData.ts", "Таблица совместимости пар арканов", "1-22 × 1-22"],
                      ["arcanaForecastData.ts", "Годовые прогнозы по арканам", "1-22"],
                      ["proInterpretations.ts", "PRO интерпретации (матрица, совместимость, год)", "1-22"],
                      ["proInterpretationsExtra.ts", "PRO: финкод, родовые, договор, день", "1-22"],
                      ["proMonthForecast.ts", "PRO месячный: сферы, недели, практики", "1-22"],
                      ["yearForecastDetailed.ts", "PRO годовой: 12 месяцев, кварталы", "1-22"],
                      ["yearForecastExtra.ts", "PRO: исцеление, ритуалы, экзамен года", "1-22"],
                      ["matrixInterpretation.ts", "Интерпретации позиций матрицы", "1-22"],
                      ["lifecod/data.ts", "Данные чисел методологии 2", "1-9"],
                    ].map(([file, desc, arcana]) => (
                      <TableRow key={file}>
                        <TableCell className="font-mono text-xs">{file}</TableCell>
                        <TableCell className="text-xs">{desc}</TableCell>
                        <TableCell className="text-xs">{arcana}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Алгоритм расчётов (22 Аркана)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Приведение к аркану:</strong> Сумма цифр → если &gt; 22, вычитаем 22. Если 0 → 22.</p>
                <p><strong className="text-foreground">Матрица (12 позиций):</strong></p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>A = день → аркан</li>
                  <li>B = месяц → аркан</li>
                  <li>C = год → аркан</li>
                  <li>D = A+B+C → аркан</li>
                  <li>E = A+B → аркан</li>
                  <li>F = B+C → аркан</li>
                  <li>Позиции 7-12: дополнительные комбинации и диагональ</li>
                </ol>
                <p><strong className="text-foreground">Прогноз на год:</strong> Аркан = (день + месяц + цифры_года) → приведение</p>
                <p><strong className="text-foreground">Прогноз на месяц:</strong> Треугольник = аркан_года + число_месяца → приведение</p>
                <p><strong className="text-foreground">Финансовый код:</strong> 4 числа из даты → каждое → аркан</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === ТАРИФЫ === */}
          <TabsContent value="tiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Система тарифов</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Модуль</TableHead>
                      <TableHead>Базовый (бесплатный)</TableHead>
                      <TableHead>PRO (платный)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["Предназначение", "6 позиций, 1 вкладка", "12 позиций, 7 вкладок, карма"],
                      ["Совместимость", "%, аркан, выводы", "Динамика, конфликты, 3 сценария"],
                      ["Год", "Аркан, краткое описание", "12 месяцев, кварталы, ритуалы"],
                      ["Месяц", "Треугольник, основной аркан", "Сферы, недели, практики"],
                      ["День", "Ключевые позиции", "Часовые стратегии, ритуалы"],
                      ["Родовые", "Звезда, роли", "Долги, исцеление, паттерны"],
                      ["Договор", "Вердикт, 4 позиции", "Риски, стратегия, тайминг"],
                      ["Название", "Аркан, рекомендация", "— (нет PRO)"],
                      ["Финкод", "Талант + ресурс", "Психология денег, инвестиции"],
                      ["Полный (М2)", "Краткий профиль", "10 вкладок, полный отчёт"],
                    ].map(([mod, basic, pro]) => (
                      <TableRow key={mod}>
                        <TableCell className="font-medium text-foreground text-xs">{mod}</TableCell>
                        <TableCell className="text-xs">{basic}</TableCell>
                        <TableCell className="text-xs">{pro}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Стандарт PRO-отчёта (9 блоков)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong className="text-foreground">Введение</strong> — общий вектор энергии</li>
                  <li><strong className="text-foreground">Глубокий анализ</strong> — сильные/слабые стороны, проявления</li>
                  <li><strong className="text-foreground">Жизненные сферы</strong> — деньги, карьера, отношения, здоровье, внутренний мир</li>
                  <li><strong className="text-foreground">Связи</strong> — синергия и конфликты между позициями</li>
                  <li><strong className="text-foreground">Специфика методологии</strong> — уникальные данные модуля</li>
                  <li><strong className="text-foreground">Риски</strong> — повторяющиеся паттерны, ловушки</li>
                  <li><strong className="text-foreground">Возможности</strong> — точки роста</li>
                  <li><strong className="text-foreground">Рекомендации</strong> — конкретные «делай / не делай»</li>
                  <li><strong className="text-foreground">Итоги</strong> — ключевая мысль, главный вектор</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Механика доступа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p><strong className="text-foreground">AccessProvider</strong> (контекст React) управляет состояниями:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code className="bg-muted px-1 rounded">locked</code> — PRO контент скрыт за блюром</li>
                  <li><code className="bg-muted px-1 rounded">preview</code> — показ превью</li>
                  <li><code className="bg-muted px-1 rounded">payment_pending</code> — экран оплаты</li>
                  <li><code className="bg-muted px-1 rounded">unlocked</code> — полный доступ</li>
                </ul>
                <p><strong className="text-foreground">Dev-мод:</strong> localStorage <code className="bg-muted px-1 rounded">lifecod-dev-mode</code> = true разблокирует всё для тестирования.</p>
                <p><strong className="text-foreground">PaidBlock:</strong> Оборачивает платный контент, при locked показывает размытый превью + кнопку «Разблокировать».</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === BACKEND === */}
          <TabsContent value="backend" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> База данных (Lovable Cloud)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Backend работает через Lovable Cloud (Supabase). Три основные таблицы:</p>

                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">analysis_packages</h4>
                    <p className="text-xs mb-2">Пакеты анализов (товары для покупки)</p>
                    <div className="font-mono text-xs space-y-0.5">
                      <div>id: uuid (PK)</div>
                      <div>name: string</div>
                      <div>description: string?</div>
                      <div>price_rub: number</div>
                      <div>price_usd: number?</div>
                      <div>credits: number (default 1)</div>
                      <div>is_active: boolean</div>
                      <div>stripe_price_id: string?</div>
                      <div>prodamus_product_id: string?</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">purchases</h4>
                    <p className="text-xs mb-2">Покупки пользователей</p>
                    <div className="font-mono text-xs space-y-0.5">
                      <div>id: uuid (PK)</div>
                      <div>email: string</div>
                      <div>access_token: string (unique)</div>
                      <div>package_id: uuid → analysis_packages</div>
                      <div>credits_remaining: number</div>
                      <div>provider: enum (stripe | prodamus)</div>
                      <div>provider_payment_id: string?</div>
                      <div>status: enum (pending | completed | failed | refunded)</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="font-medium text-foreground mb-2">analysis_results</h4>
                    <p className="text-xs mb-2">Сохранённые результаты анализов</p>
                    <div className="font-mono text-xs space-y-0.5">
                      <div>id: uuid (PK)</div>
                      <div>purchase_id: uuid → purchases</div>
                      <div>analysis_type: string</div>
                      <div>input_data: json</div>
                      <div>result_data: json</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs"><strong className="text-amber-700">⚠️ Важно:</strong> Файлы <code className="bg-muted px-1 rounded">src/integrations/supabase/client.ts</code> и <code className="bg-muted px-1 rounded">types.ts</code> автогенерируются. НЕ РЕДАКТИРОВАТЬ вручную.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Платёжные провайдеры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Поддерживаются два провайдера (enum <code className="bg-muted px-1 rounded">payment_provider</code>):</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Stripe</strong> — международные платежи (USD)</li>
                  <li><strong className="text-foreground">Prodamus</strong> — платежи для РФ (RUB)</li>
                </ul>
                <p className="text-xs text-amber-600">⚠️ Интеграция с провайдерами реализована на уровне БД. Webhook-обработчики и edge-функции для подтверждения оплаты ещё не реализованы полностью.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === i18n === */}
          <TabsContent value="i18n" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Локализация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Используется <strong className="text-foreground">i18next</strong> + <strong className="text-foreground">react-i18next</strong>. Три языка:</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <div className="text-lg mb-1">🇷🇺</div>
                    <div className="font-medium text-foreground">Русский</div>
                    <div className="text-xs">Основной</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <div className="text-lg mb-1">🇬🇧</div>
                    <div className="font-medium text-foreground">English</div>
                    <div className="text-xs">Перевод</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                    <div className="text-lg mb-1">🇪🇸</div>
                    <div className="font-medium text-foreground">Español</div>
                    <div className="text-xs">Перевод</div>
                  </div>
                </div>
                <p className="text-xs text-amber-600">⚠️ Переводы покрывают навигацию и базовые элементы UI. Контент анализов (интерпретации арканов) — только на русском.</p>
                <p><strong className="text-foreground">Переключатель:</strong> <code className="bg-muted px-1 rounded">LanguageSelector</code> в хедере.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === TODO === */}
          <TabsContent value="todo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Что ещё нужно сделать</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  { priority: "🔴 Высокий", items: [
                    "Подключить реальные платёжные провайдеры (Stripe webhook, Prodamus callback)",
                    "Реализовать edge-функции для верификации оплаты и выдачи access_token",
                    "Добавить email-уведомления при покупке (отправка токена доступа)",
                    "Уникальный авторский контент для всех 22 арканов (сейчас часть генерируется динамически)",
                  ]},
                  { priority: "🟡 Средний", items: [
                    "PDF экспорт для PRO разборов со всеми новыми секциями",
                    "Перевод контента интерпретаций на EN/ES",
                    "Мобильная оптимизация сложных таблиц и графиков",
                    "SEO оптимизация (мета-теги, JSON-LD, sitemap)",
                    "Аналитика (отслеживание конверсий, популярных разборов)",
                  ]},
                  { priority: "🟢 Низкий", items: [
                    "Dark/Light тема (сейчас только тёмная)",
                    "PWA (offline доступ к уже купленным разборам)",
                    "Интеграция с Telegram Bot для уведомлений",
                    "A/B тестирование цен и текстов",
                    "Реферальная программа",
                  ]},
                ].map(group => (
                  <div key={group.priority} className="space-y-2">
                    <h4 className="font-medium text-foreground">{group.priority}</h4>
                    <ul className="space-y-1.5 pl-1">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-muted-foreground/50 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Известные ограничения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Аутентификация пользователей не реализована — доступ по access_token из покупки</li>
                  <li>Все расчёты клиентские — нет серверной валидации</li>
                  <li>Контент интерпретаций зашит в код (не CMS)</li>
                  <li>PDF генерация использует PT Sans — кириллический шрифт загружается асинхронно</li>
                  <li>Dev-мод через localStorage — не защищено (только для разработки)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
