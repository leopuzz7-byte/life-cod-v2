import { useState } from "react";
import { numberDescriptions, categoryDescriptions } from "@/lib/numerology";
import { ChevronDown, ChevronUp, Star, Heart, Briefcase, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberCardProps {
  number: number;
  category: "mind" | "action" | "realization" | "total";
  delay?: number;
}

export function NumberCard({ number, category, delay = 0 }: NumberCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const numberInfo = numberDescriptions[number];
  const categoryInfo = categoryDescriptions[category];

  if (!numberInfo) return null;

  const categoryColors = {
    mind: "from-blue-100 to-blue-50 border-blue-200 dark:from-blue-900/30 dark:to-blue-800/20 dark:border-blue-700/30",
    action: "from-green-100 to-green-50 border-green-200 dark:from-green-900/30 dark:to-green-800/20 dark:border-green-700/30",
    realization: "from-orange-100 to-orange-50 border-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 dark:border-orange-700/30",
    total: "from-primary/10 to-accent/10 border-primary/30",
  };

  // Выбираем интерпретацию по категории
  const getInterpretation = () => {
    switch(category) {
      case "mind": return numberInfo.mindInterpretation;
      case "action": return numberInfo.actionInterpretation;
      case "realization": return numberInfo.realizationInterpretation;
      case "total": return numberInfo.totalInterpretation;
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border backdrop-blur-sm transition-all duration-500 animate-fade-in overflow-hidden",
        "bg-gradient-to-br",
        categoryColors[category],
        isExpanded ? "shadow-elevated" : "shadow-card hover:shadow-elevated"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Number Circle */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center border-2 border-primary/50 shadow-glow animate-glow-pulse">
                <span className="text-4xl font-display font-bold text-primary number-glow">
                  {number}
                </span>
              </div>
              <span className="absolute -top-1 -right-1 text-2xl">
                {categoryInfo.icon}
              </span>
            </div>

            {/* Title */}
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {categoryInfo.title}
              </p>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {numberInfo.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {categoryInfo.subtitle}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {numberInfo.planet} • {numberInfo.element}
                </span>
              </div>
            </div>
          </div>

          {/* Expand Button */}
          <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Category Description */}
        <p className="mt-4 text-sm text-muted-foreground">
          {categoryInfo.description}
        </p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 animate-fade-in border-t border-border/50 pt-6">
          {/* Main Description */}
          <div className="space-y-3">
            <h4 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Общая характеристика
            </h4>
            <p className="text-foreground/90 leading-relaxed">
              {numberInfo.detailedDescription}
            </p>
          </div>

          {/* Category-specific Interpretation */}
          <div className="bg-card/50 rounded-xl p-5 border border-border/30">
            <h4 className="text-base font-display font-semibold text-primary mb-3">
              {categoryInfo.icon} {categoryInfo.title}: Ваша интерпретация
            </h4>
            <p className="text-foreground/90 leading-relaxed">
              {getInterpretation()}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Планета</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.planet}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Удачный день</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.day}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Цвет удачи</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.color.split(',')[0]}</p>
            </div>
            <div className="bg-card/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Камень</p>
              <p className="text-sm font-medium text-foreground">{numberInfo.stone.split(',')[0]}</p>
            </div>
          </div>

          {/* Relationships */}
          <div className="space-y-3">
            <h4 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              Отношения и любовь
            </h4>
            <p className="text-foreground/80 leading-relaxed text-sm">
              {numberInfo.relationships}
            </p>
          </div>

          {/* Career */}
          <div className="space-y-3">
            <h4 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              Подходящие профессии
            </h4>
            <div className="flex flex-wrap gap-2">
              {numberInfo.career.map((job) => (
                <span
                  key={job}
                  className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-xs border border-blue-500/20"
                >
                  {job}
                </span>
              ))}
            </div>
          </div>

          {/* Health */}
          <div className="space-y-3">
            <h4 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              Здоровье
            </h4>
            <p className="text-foreground/80 leading-relaxed text-sm">
              {numberInfo.health}
            </p>
          </div>

          {/* Qualities */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">✅ Позитивные качества</p>
              <div className="flex flex-wrap gap-2">
                {numberInfo.positive.map((quality) => (
                  <span
                    key={quality}
                    className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">⚠️ Теневые качества</p>
              <div className="flex flex-wrap gap-2">
                {numberInfo.negative.map((quality) => (
                  <span
                    key={quality}
                    className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-full text-xs border border-red-500/20"
                  >
                    {quality}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20">
            <h4 className="text-base font-display font-semibold text-primary mb-2">
              💡 Совет для развития
            </h4>
            <p className="text-foreground/90 leading-relaxed text-sm">
              {numberInfo.advice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
