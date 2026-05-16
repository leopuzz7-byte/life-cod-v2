import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Target, TrendingUp, Heart, AlertCircle, Compass, Calendar, Users, Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScenarioType = "diagnosis" | "period" | "forecast" | "crisis";

interface OnboardingFlowProps {
  onComplete: (scenario: ScenarioType) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);

  const scenarios = [
    {
      id: "diagnosis" as ScenarioType,
      icon: Compass,
      title: t("onboarding.scenarios.diagnosis.title"),
      description: t("onboarding.scenarios.diagnosis.description"),
    },
    {
      id: "period" as ScenarioType,
      icon: TrendingUp,
      title: t("onboarding.scenarios.period.title"),
      description: t("onboarding.scenarios.period.description"),
    },
    {
      id: "forecast" as ScenarioType,
      icon: Calendar,
      title: t("onboarding.scenarios.forecast.title"),
      description: t("onboarding.scenarios.forecast.description"),
    },
    {
      id: "crisis" as ScenarioType,
      icon: AlertCircle,
      title: t("onboarding.scenarios.crisis.title"),
      description: t("onboarding.scenarios.crisis.description"),
    },
  ];

  const benefits = [
    t("onboarding.benefits.strengths"),
    t("onboarding.benefits.decisions"),
    t("onboarding.benefits.period"),
    t("onboarding.benefits.focus"),
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (selectedScenario) {
      onComplete(selectedScenario);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                s === step ? "w-8 bg-primary" : s < step ? "w-2 bg-primary/50" : "w-2 bg-muted"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-display text-primary mb-4">
                  {t("onboarding.step1.title")}
                </h1>
                
                <p className="text-muted-foreground mb-4">
                  {t("onboarding.step1.subtitle")}
                </p>
                
                <p className="text-sm text-muted-foreground mb-6">
                  {t("onboarding.step1.description")}
                </p>
                
                <p className="text-xs text-muted-foreground/70 mb-8 italic">
                  {t("onboarding.step1.disclaimer")}
                </p>

                <Button
                  onClick={handleNext}
                  className="w-full md:w-auto btn-fill bg-primary hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full border-2 border-primary"
                >
                  {t("onboarding.startDiagnosis")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: What you'll learn */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border">
                <h2 className="text-xl md:text-2xl font-display text-primary mb-6">
                  {t("onboarding.step2.title")}
                </h2>

                <div className="space-y-4 mb-6 text-left">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <p className="text-sm text-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-8">
                  {t("onboarding.step2.suitable")}
                </p>

                <Button
                  onClick={handleNext}
                  className="w-full md:w-auto btn-fill bg-primary hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full border-2 border-primary"
                >
                  {t("onboarding.continue")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Choose scenario */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border">
                <h2 className="text-xl md:text-2xl font-display text-primary mb-2 text-center">
                  {t("onboarding.step3.title")}
                </h2>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {t("onboarding.step3.subtitle")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all duration-300",
                        selectedScenario === scenario.id
                          ? "bg-primary/10 border-primary shadow-warm"
                          : "bg-card border-border hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <scenario.icon className={cn(
                          "w-6 h-6 mt-0.5",
                          selectedScenario === scenario.id ? "text-primary" : "text-muted-foreground"
                        )} />
                        <div>
                          <h3 className="font-display font-semibold text-foreground text-sm mb-1">
                            {scenario.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {scenario.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!selectedScenario}
                  className="w-full btn-fill bg-primary hover:bg-primary text-primary-foreground px-8 py-6 text-lg rounded-full border-2 border-primary disabled:opacity-50"
                >
                  {t("onboarding.chooseAndContinue")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip link */}
        <div className="text-center mt-6">
          <button
            onClick={onSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("onboarding.skipToCalculator")}
          </button>
        </div>
      </div>
    </div>
  );
}
