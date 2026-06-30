Правила работы с HTML-файлами и Git (проект Надежды)

Никогда не обрезай файл. Перед любым редактированием nadezhda-site/index.html или nadezhda.html — проверяй конец файла: tail -5 <путь> && wc -l <путь>. Файл должен заканчиваться на </body></html>. Если обрезан — восстанавливай целиком через bash heredoc (cat > file << 'EOF' ... EOF), а не через Write/Edit (они обрезают большие файлы).
Писать большие файлы только через bash heredoc. Write tool и cp обрезают файлы >150 строк на этой машине. Использовать: cat > /sessions/.../mnt/life-cod-v2/nadezhda-site/index.html << 'HTMLEOF' ... HTMLEOF
После записи всегда проверять: tail -3 <файл> && wc -l <файл> — должно быть </html> в конце.
Git push — только одной командой для пользователя (сам не могу из-за блокировки .git на Windows). Давать команду для PowerShell:
---

# Правила для life-cod-v2 (React/TypeScript/Vite)

## Редактирование файлов

- Никогда не использовать Write/Edit tools на файлах >150 строк — только Python str.replace() через bash
- После каждого Python replace: `tail -3 <файл> && wc -l <файл>` — файл не должен быть обрезан
- assert old in content ПЕРЕД replace, assert new in content ПОСЛЕ

## Проп-дриллинг (самая частая причина крашей)

Когда добавляешь новый проп в дочерний компонент — ОБЯЗАТЕЛЬНО:
1. grep всех вызовов этого компонента в файле: `grep -n "<ComponentName" file.tsx`
2. Убедиться что каждый вызов либо передаёт проп, либо у пропа есть безопасный default
3. Проверить всю цепочку: Root → Parent → Child → GrandChild

Пример цепочки в CompatibilityResult.tsx:
`CompatibilityResultComponent → UnionTab/PartnerTab → TriangleSection → CompatCard → CompCard`

## Пост-редакционная проверка (запускать всегда)

```bash
# 1. Проверить что новый проп объявлен И передаётся везде
grep -n "NEW_PROP" src/components/CompatibilityResult.tsx

# 2. Нет ли функций, которые используют переменную не из своего скопа
# Для каждой функции: все JSX {variable} должны быть в destructure или объявлены внутри функции
```

## Vite не проверяет TypeScript при сборке

Vite транспилирует TS без type-checking — билд может быть READY, а runtime крашнет с ReferenceError.
Всегда вручную проверять: если в JSX написано `{someVar}` — убедиться что `someVar` объявлен в области видимости функции.

## ErrorBoundary

В App.tsx нет ErrorBoundary — любой runtime error = белая страница. TODO: обернуть Routes в ErrorBoundary.
До его добавления: любое изменение в компонентах результата = ручная проверка всех JSX-переменных.

## Паттерны этого проекта

- AI хуки: `useAIReading(result, isPro)` и `usePersonalReading(result, person, isPro)`
- Кеш localStorage: `ai_reading_v5_*` (union), `ai_personal_v2_*` (personal)
- isPro = tier === 'professional' | isOwner (leo.puzz7@gmail.com, nadiakoval76@gmail.com)
- Скелетон: `aiLoading && !aiText` → показывать `animate-pulse` блоки вместо статики
- API: proxyapi.ru, модель gpt-4o-mini, токены 6000/7000

## Git

- Не пушить из sandbox — давать команду пользователю для cmd (не MinGW):
  `cd C:\Users\галина\Documents\life-cod-v2 && del /f .git\HEAD.lock 2>nul & git add <files> && git commit -m "<msg>" && git push origin main`
- Проверять деплой через Vercel MCP: projectId=prj_mzIOx2jm531koNV6253cuGFaF5N1, teamId=team_ZnihLEK3CKxqb1vhhwjAbvVw
