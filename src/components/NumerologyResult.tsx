import { NumerologyResult as Result, numberDescriptions } from "@/lib/numerology";
import { NumberCard } from "./NumberCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF } from "@/lib/pdfGenerator";
import { InlinePaywall } from "./PaidBlock";

interface NumerologyResultProps {
  result: Result;
  name: string;
  onReset: () => void;
}

export function NumerologyResult({ result, name, onReset }: NumerologyResultProps) {
  const formattedDate = format(result.birthDate, "d MMMM yyyy", { locale: ru });


  const handleDownloadPDF = async () => {
    const numbers = [
      { num: result.mindNumber, title: "Ум", key: "mindInterpretation" as const },
      { num: result.actionNumber, title: "Действие", key: "actionInterpretation" as const },
      { num: result.realizationNumber, title: "Реализация", key: "realizationInterpretation" as const },
      { num: result.totalNumber, title: "Итог", key: "totalInterpretation" as const },
    ];
    
    const sections = numbers.map(({ num, title, key }) => {
      const data = numberDescriptions[num];
      return {
        title: `${title}: ${num} - ${data?.title || ""}`,
        content: data?.[key] || data?.description || "",
      };
    });
    
    await generatePDF({
      title: name ? `${name}, ваша нумерология` : "Ваша нумерология",
      subtitle: "Классическая нумерология",
      birthDate: formattedDate,
      name: name || undefined,
      sections,
    });
  };
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Новый расчёт
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center space-y-4">
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            {name ? `${name}, ваша нумерология` : "Ваша нумерология"}
          </h2>
          <p className="text-muted-foreground">
            Дата рождения: <span className="text-primary font-medium">{formattedDate}</span>
          </p>

          {/* Summary Numbers */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: "Ум", value: result.mindNumber, icon: "💭" },
              { label: "Действие", value: result.actionNumber, icon: "⚡" },
              { label: "Реализация", value: result.realizationNumber, icon: "🎯" },
              { label: "Итог", value: result.totalNumber, icon: "✨" },
            ].map((item, i) => (
              <div key={item.label} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2 animate-scale-in relative"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className="text-2xl font-display font-bold text-primary number-glow">
                    {item.value}
                  </span>
                  <span className="absolute -top-1 -right-1 text-sm">{item.icon}</span>
                </div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Number Cards */}
      <div className="space-y-6">
        <NumberCard number={result.mindNumber} category="mind" delay={0} />
        <NumberCard number={result.actionNumber} category="action" delay={100} />
        <NumberCard number={result.realizationNumber} category="realization" delay={200} />
        <NumberCard number={result.totalNumber} category="total" delay={300} />
      </div>

      {/* Inline Paywall */}
      <InlinePaywall
        title="Профессиональный нумерологический разбор"
        description="Глубокий анализ всех аспектов вашей личности, кармических задач и жизненного пути"
        features={[
          "Полный анализ всех 22 энергий",
          "Прогноз на год по месяцам",
          "Совместимость с партнёром",
          "Персональные рекомендации",
        ]}
      />
    </div>
  );
}
