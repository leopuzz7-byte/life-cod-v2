import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Calendar } from "@/components/ui/calendar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { reduceToSingleDigit } from "@/lib/numerology";
import { ru, enUS, es } from "date-fns/locale";

const CalendarPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return enUS;
      case 'es': return es;
      default: return ru;
    }
  };

  const getDayNumbers = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const mindNumber = reduceToSingleDigit(day);
    const actionNumber = reduceToSingleDigit(month);
    const realizationNumber = reduceToSingleDigit(year);
    const totalNumber = reduceToSingleDigit(day + month + year);

    return { mindNumber, actionNumber, realizationNumber, totalNumber };
  };

  const dayNumbers = selectedDate ? getDayNumbers(selectedDate) : null;

  const getDayInterpretation = (number: number, type: string) => {
    return t(`calendar.interpretations.${type}.${number}`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg text-muted-foreground mb-4">
                {t("calendar.selectDatePrompt")}
              </h2>
              
              <div className="gradient-card rounded-2xl p-4 border border-border inline-block">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={getLocale()}
                  className="rounded-xl pointer-events-auto"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display text-foreground mb-6">
                {t("calendar.dayCode")}
              </h2>
              
              {selectedDate && dayNumbers && (
                <div className="space-y-3">
                  <Accordion type="single" collapsible defaultValue="mind">
                    <AccordionItem value="mind" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.mindNumber} — {t("calendar.mindNumber")}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.mindNumber, "mind")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="action" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.actionNumber} — {t("calendar.actionNumber")}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.actionNumber, "action")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="realization" className="gradient-card rounded-xl border border-border px-4 mb-3">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.realizationNumber} — {t("calendar.realizationNumber")}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.realizationNumber, "realization")}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="total" className="gradient-card rounded-xl border border-border px-4">
                      <AccordionTrigger className="hover:no-underline py-4">
                        <span className="text-lg font-display text-primary">
                          {dayNumbers.totalNumber} — {t("calendar.outcomeNumber")}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {getDayInterpretation(dayNumbers.totalNumber, "total")}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;