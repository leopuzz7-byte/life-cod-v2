# Life COD — нумерологический калькулятор

Веб-приложение для нумерологических разборов по двум методикам:

- **Методика 1** — 22 Аркана (матрица судьбы / Life COD)
- **Методика 2** — классическая нумерология (числа 1–9)

## Стек

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Supabase

## Локальная разработка

```bash
npm install
cp .env.example .env   # заполните Supabase ключи
npm run dev            # запускается на http://localhost:8080
```

## Сборка

```bash
npm run build    # собирает в dist/
npm run preview  # локальный предпросмотр продакшен-сборки
```

## Деплой на Vercel

1. Импортируйте репозиторий в [vercel.com](https://vercel.com/new)
2. Vercel автоматически определит конфигурацию из `vercel.json`
3. Добавьте переменные окружения из `.env.example`
4. Жмите Deploy

Автоматический деплой при каждом пуше в `main`.

## Структура

- `src/pages/Index.tsx` — главная страница с выбором методик и форм
- `src/lib/analysisConfig.ts` — конфигурация разделов и тарифов
- `src/lib/calculations.ts` — расчёты для Методики 1 (Аркана)
- `src/lib/keyto.ts`, `src/lib/lifecod/` — расчёты для Методики 2 (Классика)
- `src/components/` — UI-компоненты результатов и форм
