import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Heart } from "lucide-react";

interface CompatibilityDateInputProps {
  onCalculate: (
    person1Day: number, person1Month: number, person1Year: number, person1Name: string,
    person2Day: number, person2Month: number, person2Year: number, person2Name: string
  ) => void;
}

const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();

const years = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export function CompatibilityDateInput({ onCalculate }: CompatibilityDateInputProps) {
  const { t } = useTranslation();
  
  // Person 1
  const [name1, setName1] = useState("");
  const [day1, setDay1] = useState<string>("");
  const [month1, setMonth1] = useState<string>("");
  const [year1, setYear1] = useState<string>("");
  
  // Person 2
  const [name2, setName2] = useState("");
  const [day2, setDay2] = useState<string>("");
  const [month2, setMonth2] = useState<string>("");
  const [year2, setYear2] = useState<string>("");

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: t(`forecast.months.${i + 1}`),
  }));

  const handleCalculate = () => {
    if (day1 && month1 && year1 && day2 && month2 && year2) {
      onCalculate(
        parseInt(day1), parseInt(month1), parseInt(year1), name1,
        parseInt(day2), parseInt(month2), parseInt(year2), name2
      );
    }
  };

  const isValid = day1 && month1 && year1 && day2 && month2 && year2;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
        <div className="space-y-6">
          {/* Person 1 */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">1</span>
              {t("compatibility.person1")}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("calculator.yourName")}
              </label>
              <Input
                placeholder={t("compatibility.namePlaceholder1")}
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("calculator.birthDate")}
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <Select value={day1} onValueChange={setDay1}>
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

                <Select value={month1} onValueChange={setMonth1}>
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

                <Select value={year1} onValueChange={setYear1}>
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
            </div>
          </div>

          {/* Divider with heart */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <Heart className="w-5 h-5 text-primary" />
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Person 2 */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs text-primary">2</span>
              {t("compatibility.person2")}
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("calculator.yourName")}
              </label>
              <Input
                placeholder={t("compatibility.namePlaceholder2")}
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("calculator.birthDate")}
              </label>
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <Select value={day2} onValueChange={setDay2}>
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

                <Select value={month2} onValueChange={setMonth2}>
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

                <Select value={year2} onValueChange={setYear2}>
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
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            disabled={!isValid}
            className="w-full h-14 text-lg font-display btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none transition-all duration-300 rounded-full border-2 border-primary"
          >
            {t("compatibility.calculate")}
          </Button>
        </div>
      </div>
    </div>
  );
}
