import { useTranslation } from "react-i18next";
import { KeyToResult as KeyToResultType, getKeyToNumberData } from "@/lib/keyto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Brain, Zap, Target, Award, Star, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF } from "@/lib/pdfGenerator";
interface KeyToResultProps {
  result: KeyToResultType;
  name: string;
  onReset: () => void;
}

function NumberCard({ 
  number, 
  title, 
  icon: Icon,
  colorClass 
}: { 
  number: number; 
  title: string; 
  icon: React.ElementType;
  colorClass: string;
}) {
  const { t } = useTranslation();
  const data = getKeyToNumberData(number);
  
  return (
    <Card className={cn("gradient-card border-border hover:border-primary/30 transition-all", colorClass)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-display">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{data?.name || `${t("keyto.number")} ${number}`}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary">
            <span className="text-4xl font-display text-primary">{number}</span>
          </div>
        </div>
        
        {data && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                🌍 {data.planet}
              </span>
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                📅 {data.luckyDay}
              </span>
              <span className="px-2 py-1 bg-secondary rounded-full text-xs">
                💎 {data.luckyStone}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center line-clamp-3">
              {data.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailedSection({ 
  number, 
  title 
}: { 
  number: number; 
  title: string;
}) {
  const { t } = useTranslation();
  const data = getKeyToNumberData(number);
  if (!data) return null;

  return (
    <Card className="gradient-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-display">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-display text-primary">{number}</span>
          </div>
          {title}: {data.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-foreground leading-relaxed">
          {data.description}
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Star className="w-4 h-4" /> {t("keyto.positiveQualities")}
            </h4>
            <div className="flex flex-wrap gap-1">
              {data.positiveQualities.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-xs">
                  {q}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-destructive flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {t("keyto.negativeQualities")}
            </h4>
            <div className="flex flex-wrap gap-1">
              {data.negativeQualities.map((q, i) => (
                <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">🎯 {t("keyto.karmicTask")}</h4>
          <p className="text-muted-foreground bg-secondary/50 p-3 rounded-lg">
            {data.karmicTask}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">💼 {t("keyto.suitableProfessions")}</h4>
          <div className="flex flex-wrap gap-2">
            {data.professions.slice(0, 12).map((p, i) => (
              <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{t("keyto.planet")}</p>
            <p className="font-medium text-foreground">{data.planet}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{t("keyto.luckyDay")}</p>
            <p className="font-medium text-foreground">{data.luckyDay}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{t("keyto.stone")}</p>
            <p className="font-medium text-foreground">{data.luckyStone}</p>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <p className="text-xs text-muted-foreground">{t("keyto.color")}</p>
            <p className="font-medium text-foreground">{data.luckyColor}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KeyToResultComponent({ result, name, onReset }: KeyToResultProps) {
  const { t } = useTranslation();


  const handleDownloadPDF = async () => {
    const numbers = [
      { num: result.mindNumber, title: t("keyto.mindNumber") },
      { num: result.actionNumber, title: t("keyto.actionNumber") },
      { num: result.realizationNumber, title: t("keyto.realizationNumber") },
      { num: result.outcomeNumber, title: t("keyto.outcomeNumber") },
    ];
    
    const sections = numbers.map(({ num, title }) => {
      const data = getKeyToNumberData(num);
      return {
        title: `${title}: ${num} - ${data?.name || ""}`,
        content: [
          data?.description || "",
          "",
          `${t("keyto.planet")}: ${data?.planet || "-"}`,
          `${t("keyto.luckyDay")}: ${data?.luckyDay || "-"}`,
          `${t("keyto.stone")}: ${data?.luckyStone || "-"}`,
          "",
          `${t("keyto.positiveQualities")}: ${data?.positiveQualities.join(", ") || "-"}`,
          `${t("keyto.negativeQualities")}: ${data?.negativeQualities.join(", ") || "-"}`,
          "",
          `${t("keyto.karmicTask")}: ${data?.karmicTask || "-"}`,
        ],
      };
    });
    
    await generatePDF({
      title: t("keyto.yourCalculationDefault"),
      subtitle: t("keyto.methodology1Classic"),
      birthDate: result.birthDate,
      name: name || undefined,
      sections,
    });
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-display text-primary">
          {name ? `${name}, ${t("keyto.yourCalculation")}` : t("keyto.yourCalculationDefault")}
        </h1>
        <p className="text-muted-foreground">
          {t("results.birthDate")}: {result.birthDate}
        </p>
        <p className="text-sm text-muted-foreground/70">
          {t("keyto.methodology1Classic")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <NumberCard
          number={result.mindNumber}
          title={t("keyto.mindNumber")}
          icon={Brain}
          colorClass=""
        />
        <NumberCard
          number={result.actionNumber}
          title={t("keyto.actionNumber")}
          icon={Zap}
          colorClass=""
        />
        <NumberCard
          number={result.realizationNumber}
          title={t("keyto.realizationNumber")}
          icon={Target}
          colorClass=""
        />
        <NumberCard
          number={result.outcomeNumber}
          title={t("keyto.outcomeNumber")}
          icon={Award}
          colorClass=""
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-display text-center text-foreground">
          {t("keyto.detailedAnalysis")}
        </h2>
        
        <DetailedSection number={result.mindNumber} title={t("keyto.mindNumber")} />
        <DetailedSection number={result.actionNumber} title={t("keyto.actionNumber")} />
        <DetailedSection number={result.realizationNumber} title={t("keyto.realizationNumber")} />
        <DetailedSection number={result.outcomeNumber} title={t("keyto.outcomeNumber")} />
      </div>

      <Card className="gradient-card border-primary/20">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-display text-foreground">
            {t("keyto.wantDeeperAnalysis")}
          </h3>
          <p className="text-muted-foreground">
            {t("keyto.tryMethodology2")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onReset}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              {t("keyto.tryMethodology2Btn")}
            </Button>
            <Button
              onClick={onReset}
              className="bg-primary text-primary-foreground"
            >
              {t("keyto.consultSpecialist")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}