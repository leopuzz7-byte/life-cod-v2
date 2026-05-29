import { useState, useEffect } from "react";

// Фразы по умолчанию (общие)
const DEFAULT_PHRASES = [
  "Складываем цифры вашей судьбы…",
  "Приводим числа к арканам…",
  "Тасуем 22 аркана…",
  "Ищем ваш аркан предназначения…",
  "Сверяемся со Вселенной…",
  "Звёзды выстраиваются в ряд…",
];

// Фразы под конкретные методики — передавай methodId, подберётся набор
const PHRASES_BY_METHOD: Record<string, string[]> = {
  purpose: [
    "Раскладываем матрицу из 12 позиций…",
    "Ищем ваш аркан предназначения…",
    "Считываем код вашей даты…",
    "Звёзды выстраиваются в ряд…",
  ],
  compatibility: [
    "Сводим две судьбы воедино…",
    "Считаем аркан вашего союза…",
    "Ищем точки притяжения…",
    "Вселенная сверяет ваши коды…",
  ],
  "lifecod-compatibility": [
    "Сводим две судьбы воедино…",
    "Считаем аркан вашего союза…",
    "Ищем точки притяжения…",
  ],
  finance: [
    "Считаем ваш денежный код…",
    "Ищем аркан изобилия…",
    "Раскрываем финансовый поток…",
  ],
  ancestral: [
    "Поднимаем родовую память…",
    "Читаем кармическую звезду…",
    "Считаем родовые программы…",
  ],
  year: [
    "Заглядываем в ваш год…",
    "Считаем аркан периода…",
    "Сверяемся со звёздами года…",
  ],
  month: ["Считаем аркан месяца…", "Заглядываем в ваш месяц…"],
  day: ["Считаем энергию дня…", "Сверяемся со звёздами…"],
  name: ["Переводим название в числа…", "Считаем энергию имени…"],
  contract: ["Читаем энергию договора…", "Считаем аркан соглашения…"],
};

interface LoadingScreenProps {
  /** id методики — подберёт тематические фразы. Необязательно. */
  methodId?: string;
  /** свои фразы — перекрывают всё остальное */
  phrases?: string[];
}

export function LoadingScreen({ methodId, phrases }: LoadingScreenProps) {
  const list =
    phrases ??
    (methodId && PHRASES_BY_METHOD[methodId]) ??
    DEFAULT_PHRASES;

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % list.length);
        setVisible(true);
      }, 350);
    }, 2000);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 sm:gap-8 px-6 py-12">
      {/* Созвездие: дышащая звезда + расходящиеся кольца */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
        {/* расходящиеся кольца */}
        <span className="absolute inset-0 rounded-full border border-accent/40 animate-[ringPulse_2.4s_ease-out_infinite]" />
        <span className="absolute inset-0 rounded-full border border-accent/40 animate-[ringPulse_2.4s_ease-out_infinite_1.2s]" />
        {/* центральная звезда */}
        <span
          className="text-3xl sm:text-4xl animate-[starBreathe_2.4s_ease-in-out_infinite]"
          style={{ color: "hsl(var(--gold))" }}
        >
          ✶
        </span>
      </div>

      {/* Крутящиеся фразы */}
      <p
        className="text-center text-muted-foreground text-sm sm:text-base font-display max-w-xs leading-relaxed transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, minHeight: "2.5rem" }}
      >
        {list[index]}
      </p>

      <style>{`
        @keyframes ringPulse {
          0%   { transform: scale(0.55); opacity: 0.8; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @keyframes starBreathe {
          0%, 100% { transform: scale(0.85) rotate(0deg); opacity: 0.65; }
          50%      { transform: scale(1.15) rotate(180deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
