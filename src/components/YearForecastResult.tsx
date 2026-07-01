import { useTranslation } from "react-i18next";
import { YearForecast, formatBirthDate, yearToArcana } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import { ForecastCard } from "./ForecastCard";
import { ChapterBlock } from "./ChapterBlock";
import { ProTextBlock } from "./ProSectionBlock";
import { LoadingScreen } from "./LoadingScreen";
import { YearCoreBlocks } from "./YearCoreBlocks";
import { YearAnalysisBlocks } from "./YearAnalysisBlocks";
import { YearMonthsSection } from "./YearMonthsSection";
import { YearExtendedBlocks } from "./YearExtendedBlocks";
import { NadezhdaSignature } from "./NadezhdaSignature";
import { useYearForecastAI } from "@/hooks/useYearForecastAI";

interface YearForecastResultProps {
  forecast: YearForecast;
  name: string;
  onReset: () => void;
  tier?: string;
}

export function YearForecastResult({ forecast, name, onReset }: YearForecastResultProps) {
  const { t } = useTranslation();
  const formattedDate = formatBirthDate(forecast.birthDate.day, forecast.birthDate.month, forecast.birthDate.year);
  const { reading } = useYearForecastAI(forecast, name);

  const birthYearArcana = yearToArcana(forecast.birthDate.year);
  const targetYearArcana = yearToArcana(forecast.targetYear);
  const bA = getArcana(birthYearArcana);
  const tA = getArcana(targetYearArcana);
  const a = getArcana(forecast.arcana);

  const base = {
    day: forecast.birthDate.day,
    month: forecast.birthDate.month,
    year: forecast.birthDate.year,
    targetYear: forecast.targetYear,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-2">
          Прогноз на год — {forecast.targetYear}
        </h1>
        {name && <p className="text-lg text-foreground mb-1">{name}</p>}
        <p className="text-muted-foreground text-sm">{t("results.birthDate")}: {formattedDate}</p>
      </div>

      {/* Расчёт + аркан года */}
      <ChapterBlock icon={Sparkles} title="Ваш аркан года" subtitle={a ? `${forecast.arcana} ${a.name} · ${a.planet} · ${a.element}` : undefined}>
        <div className="rounded-xl bg-muted/30 p-4 mb-4 text-center text-sm text-muted-foreground leading-relaxed">
          Аркан года рождения <span className="text-foreground font-medium">{birthYearArcana} {bA?.name}</span>
          {" + "}Аркан {forecast.targetYear} года <span className="text-foreground font-medium">{targetYearArcana} {tA?.name}</span>
          {" = "}<span className="text-primary font-medium">{forecast.arcana} {a?.name}</span>
        </div>
        <ForecastCard value={forecast.arcana} contextText={a?.yearForecast} highlight />
      </ChapterBlock>

      {reading ? (
        <>
          {/* Полная трактовка аркана года */}
          <ChapterBlock icon={BookOpen} title="Полная трактовка аркана года">
            <ProTextBlock text={reading.arcanaOverview} />
          </ChapterBlock>

          {/* Введение, энергия, глубокий разбор, сферы */}
          <YearCoreBlocks reading={reading} loading={false} />

          {/* Возможности, риски, плюс/минус, рекомендации, итог */}
          <YearAnalysisBlocks reading={reading} loading={false} />

          {/* 12 месяцев */}
          <YearMonthsSection base={base} name={name} />

          {/* Расширенный VIP-анализ + пожелание (в конце) */}
          <YearExtendedBlocks reading={reading} loading={false} />
        </>
      ) : (
        <LoadingScreen methodId="year" />
      )}

      <NadezhdaSignature />
    </div>
  );
}
