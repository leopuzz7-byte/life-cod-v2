import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Heart, Briefcase, Wallet, Compass, Sparkles, AlertTriangle, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculatePersonalMatrix, PersonalMatrix } from "@/lib/calculations";
import { getArcana } from "@/lib/arcana";

type CrisisArea = "relationships" | "career" | "finances" | "purpose" | "general";

interface CrisisStep {
  step: number;
  area?: CrisisArea;
  birthData?: { day: number; month: number; year: number };
}

const CrisisPage = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<CrisisStep>({ step: 1 });
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState<PersonalMatrix | null>(null);

  const crisisAreas = [
    {
      id: "relationships" as CrisisArea,
      icon: Heart,
      title: t("crisis.areas.relationships.title"),
      color: "text-pink-500",
    },
    {
      id: "career" as CrisisArea,
      icon: Briefcase,
      title: t("crisis.areas.career.title"),
      color: "text-blue-500",
    },
    {
      id: "finances" as CrisisArea,
      icon: Wallet,
      title: t("crisis.areas.finances.title"),
      color: "text-green-500",
    },
    {
      id: "purpose" as CrisisArea,
      icon: Compass,
      title: t("crisis.areas.purpose.title"),
      color: "text-purple-500",
    },
    {
      id: "general" as CrisisArea,
      icon: Sparkles,
      title: t("crisis.areas.general.title"),
      color: "text-primary",
    },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: t(`forecast.months.${i + 1}`),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  const handleSelectArea = (area: CrisisArea) => {
    setCurrentStep({ ...currentStep, step: 3, area });
  };

  const handleCalculate = () => {
    if (day && month && year && currentStep.area) {
      const matrix = calculatePersonalMatrix(parseInt(day), parseInt(month), parseInt(year));
      setResult(matrix);
      setCurrentStep({ ...currentStep, step: 4, birthData: { day: parseInt(day), month: parseInt(month), year: parseInt(year) } });
    }
  };

  const handleBack = () => {
    if (currentStep.step > 1) {
      setCurrentStep({ ...currentStep, step: currentStep.step - 1 });
    }
  };

  const handleReset = () => {
    setCurrentStep({ step: 1 });
    setResult(null);
    setDay("");
    setMonth("");
    setYear("");
  };

  const handleTelegramClick = () => {
    window.open("https://t.me/BisnessWomenN", "_blank");
  };

  const getCrisisInterpretation = (area: CrisisArea, matrix: PersonalMatrix) => {
    const mainArcana = getArcana(matrix.positions[4]); // position 5 (0-indexed: 4)
    const karmicArcana = getArcana(matrix.positions[11]); // position 12 (0-indexed: 11)
    
    // Area-specific interpretations based on arcana
    const areaKeys: Record<CrisisArea, string> = {
      relationships: "relationships",
      career: "career",
      finances: "finances",
      purpose: "purpose",
      general: "general",
    };

    return {
      mainArcana,
      karmicArcana,
      areaKey: areaKeys[area],
    };
  };

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="relative z-10 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress */}
            {currentStep.step < 4 && (
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      s === currentStep.step ? "w-8 bg-primary" : s < currentStep.step ? "w-2 bg-primary/50" : "w-2 bg-muted"
                    )}
                  />
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* Step 1: Introduction */}
              {currentStep.step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border text-center">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-display text-primary mb-4">
                      {t("crisis.title")}
                    </h1>
                    
                    <p className="text-muted-foreground mb-6">
                      {t("crisis.intro")}
                    </p>
                    
                    <p className="text-sm text-muted-foreground/70 mb-8">
                      {t("crisis.disclaimer")}
                    </p>

                    <Button
                      onClick={() => setCurrentStep({ step: 2 })}
                      className="w-full md:w-auto btn-fill bg-primary hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full border-2 border-primary"
                    >
                      {t("crisis.continue")}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Select Crisis Area */}
              {currentStep.step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("crisis.back")}
                    </button>

                    <h2 className="text-xl md:text-2xl font-display text-primary mb-2 text-center">
                      {t("crisis.selectArea")}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      {t("crisis.selectAreaDesc")}
                    </p>

                    <div className="space-y-3">
                      {crisisAreas.map((area) => (
                        <button
                          key={area.id}
                          onClick={() => handleSelectArea(area.id)}
                          className="w-full p-4 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-300 text-left flex items-center gap-4"
                        >
                          <div className={cn("w-10 h-10 rounded-full bg-secondary flex items-center justify-center", area.color)}>
                            <area.icon className="w-5 h-5" />
                          </div>
                          <span className="font-display font-semibold text-foreground">
                            {area.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Enter Birth Date */}
              {currentStep.step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border">
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      {t("crisis.back")}
                    </button>

                    <h2 className="text-xl md:text-2xl font-display text-primary mb-2 text-center">
                      {t("crisis.enterBirthDate")}
                    </h2>
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      {t("crisis.birthDateNote")}
                    </p>

                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-3">
                        <Select value={day} onValueChange={setDay}>
                          <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                            <SelectValue placeholder={t("calculator.day")} />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {days.map((d) => (
                              <SelectItem key={d.value} value={d.value} className="focus:bg-secondary">
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={month} onValueChange={setMonth}>
                          <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                            <SelectValue placeholder={t("calculator.month")} />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {months.map((m) => (
                              <SelectItem key={m.value} value={m.value} className="focus:bg-secondary">
                                {m.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={year} onValueChange={setYear}>
                          <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                            <SelectValue placeholder={t("calculator.year")} />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {years.map((y) => (
                              <SelectItem key={y.value} value={y.value} className="focus:bg-secondary">
                                {y.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleCalculate}
                        disabled={!day || !month || !year}
                        className="w-full btn-fill bg-primary hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full border-2 border-primary disabled:opacity-50"
                      >
                        {t("crisis.getResult")}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Results */}
              {currentStep.step === 4 && result && currentStep.area && (
                <motion.div
                  key="step4"
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <CrisisResult
                    area={currentStep.area}
                    matrix={result}
                    onReset={handleReset}
                    onConsultation={handleTelegramClick}
                    t={t}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

interface CrisisResultProps {
  area: CrisisArea;
  matrix: PersonalMatrix;
  onReset: () => void;
  onConsultation: () => void;
  t: (key: string, options?: any) => string;
}

function CrisisResult({ area, matrix, onReset, onConsultation, t }: CrisisResultProps) {
  const mainArcana = getArcana(matrix.positions[4]); // position 5 (0-indexed: 4)
  const karmicArcana = getArcana(matrix.positions[11]); // position 12 (0-indexed: 11)
  const currentPeriodArcana = getArcana(matrix.positions[8]); // position 9 (0-indexed: 8)

  const areaIcon = {
    relationships: Heart,
    career: Briefcase,
    finances: Wallet,
    purpose: Compass,
    general: Sparkles,
  }[area];

  const AreaIcon = areaIcon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <AreaIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-display text-primary">
              {t(`crisis.results.${area}.title`)}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("crisis.personalAnalysis")}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground">
          {t("crisis.results.intro")}
        </p>
      </div>

      {/* What's happening */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t("crisis.results.whatHappening")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t(`crisis.results.${area}.whatHappening`)}
        </p>
        {mainArcana && (
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t("crisis.results.yourCode")}: {mainArcana.name}</span>
              <br />
              {mainArcana.personalReversed}
            </p>
          </div>
        )}
      </div>

      {/* Why now */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="text-lg font-display text-primary mb-4">
          {t("crisis.results.whyNow")}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t(`crisis.results.${area}.whyNow`)}
        </p>
        {currentPeriodArcana && (
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t("crisis.results.currentPeriod")}: {currentPeriodArcana.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Main mistake */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" />
          {t("crisis.results.mainMistake")}
        </h2>
        <p className="text-muted-foreground">
          {t(`crisis.results.${area}.mainMistake`)}
        </p>
      </div>

      {/* What to do */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          {t("crisis.results.whatToDo")}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                {step}
              </div>
              <p className="text-sm text-foreground">
                {t(`crisis.results.${area}.step${step}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What NOT to do */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <h2 className="text-lg font-display text-primary mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          {t("crisis.results.whatNotToDo")}
        </h2>
        <ul className="space-y-2">
          {[1, 2, 3].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-destructive">•</span>
              {t(`crisis.results.${area}.avoid${item}`)}
            </li>
          ))}
        </ul>
      </div>

      {/* Expected result */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-primary/30 bg-primary/5">
        <h2 className="text-lg font-display text-primary mb-4">
          {t("crisis.results.expectedResult")}
        </h2>
        <p className="text-muted-foreground">
          {t(`crisis.results.${area}.expectedResult`)}
        </p>
      </div>

      {/* CTA */}
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border text-center">
        <p className="text-muted-foreground mb-6">
          {t("crisis.results.consultationPrompt")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onConsultation}
            className="btn-fill bg-primary hover:bg-primary text-primary-foreground px-6 py-4 rounded-full border-2 border-primary"
          >
            {t("crisis.results.bookConsultation")}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="px-6 py-4 rounded-full"
          >
            {t("crisis.results.newAnalysis")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CrisisPage;
