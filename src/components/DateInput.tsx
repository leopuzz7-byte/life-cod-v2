import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DateInputProps {
  selectedMethod: string;
  onCalculate: (day: number, month: number, year: number, name: string, targetMonth?: number, targetYear?: number, gender?: 'male' | 'female', targetDay?: number) => void;
}

const days = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const years = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

const forecastYears = Array.from({ length: 10 }, (_, i) => ({
  value: String(currentYear - 2 + i),
  label: String(currentYear - 2 + i),
}));

export function DateInput({ selectedMethod, onCalculate }: DateInputProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [targetMonth, setTargetMonth] = useState<string>(String(currentMonth));
  const [targetYear, setTargetYear] = useState<string>(String(currentYear));
  const [targetDay, setTargetDay] = useState<string>(String(new Date().getDate()));
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: t(`forecast.months.${i + 1}`),
  }));

  const handleCalculate = () => {
    if (day && month && year) {
      const needsTarget = selectedMethod === "month" || selectedMethod === "year" || selectedMethod === "day" || selectedMethod === "contract" || selectedMethod === "lifecod-personal";
      const targetMonthNum = (selectedMethod === "month" || selectedMethod === "day" || selectedMethod === "contract") ? parseInt(targetMonth) : undefined;
      const targetYearNum = needsTarget ? parseInt(targetYear) : undefined;
      const genderValue = selectedMethod === "ancestral" ? gender : undefined;
      const targetDayNum = (selectedMethod === "day" || selectedMethod === "contract") ? parseInt(targetDay) : undefined;
      
      onCalculate(
        parseInt(day), 
        parseInt(month), 
        parseInt(year), 
        name,
        targetMonthNum,
        targetYearNum,
        genderValue,
        targetDayNum
      );
    }
  };

  const isValid = day && month && year;

  const getButtonText = () => {
    switch (selectedMethod) {
      case "month":
        return t("calculator.calculateMonth");
      case "year":
        return t("calculator.calculateYear");
      case "purpose":
        return t("calculator.calculatePurpose");
      case "ancestral":
        return t("calculator.calculateAncestral");
      case "day":
        return "Рассчитать прогноз на день";
      case "contract":
        return "Рассчитать энергию договора";
      case "finance":
        return "Рассчитать финансовый код";
      default:
        return t("calculator.calculate");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="gradient-card rounded-2xl p-5 sm:p-8 border border-border">
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("calculator.yourName")}
            </label>
            <Input
              placeholder={t("calculator.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              {t("calculator.birthDate")}
            </label>
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
          </div>

          {(selectedMethod === "month" || selectedMethod === "year" || selectedMethod === "day" || selectedMethod === "contract" || selectedMethod === "lifecod-personal") && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {selectedMethod === "day" ? "Дата прогноза" : selectedMethod === "contract" ? "Дата договора" : selectedMethod === "month" ? t("calculator.forecastMonthYear") : selectedMethod === "lifecod-personal" ? "Год прогноза" : t("calculator.forecastYear")}
              </label>
              <div className={`grid gap-3 ${(selectedMethod === "month" || selectedMethod === "day" || selectedMethod === "contract") ? "grid-cols-3" : (selectedMethod === "year" || selectedMethod === "lifecod-personal") ? "grid-cols-1" : "grid-cols-1"}`}>
                {(selectedMethod === "day" || selectedMethod === "contract") && (
                  <Select value={targetDay} onValueChange={setTargetDay}>
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
                )}
                {(selectedMethod === "month" || selectedMethod === "day" || selectedMethod === "contract") && (
                  <Select value={targetMonth} onValueChange={setTargetMonth}>
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
                )}

                <Select value={targetYear} onValueChange={setTargetYear}>
                  <SelectTrigger className="bg-background border-border focus:border-primary h-12">
                    <SelectValue placeholder={t("calculator.year")} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-60">
                    {forecastYears.map((y) => (
                      <SelectItem key={y.value} value={y.value} className="focus:bg-secondary">
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedMethod === "ancestral" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {t("ancestral.selectGender")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    gender === 'female' 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {t("ancestral.female")}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    gender === 'male' 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-background border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">
                    {t("ancestral.male")}
                  </span>
                </button>
              </div>
            </div>
          )}

          <Button
            onClick={handleCalculate}
            disabled={!isValid}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-display btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none transition-all duration-300 rounded-full border-2 border-primary"
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
}