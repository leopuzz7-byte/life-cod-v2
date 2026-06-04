import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAccess } from "@/lib/accessControl";
import { useAuth } from "@/contexts/AuthContext";
import { saveAnalysis } from "@/lib/analysisStorage";
import { PaymentScreen } from "@/components/PaymentScreen";
import { Header } from "@/components/Header";
import { DateInput } from "@/components/DateInput";
import { CompatibilityDateInput } from "@/components/CompatibilityDateInput";
import { YearForecastResult } from "@/components/YearForecastResult";
import { MonthForecastResult } from "@/components/MonthForecastResult";
import { PersonalMatrixResult } from "@/components/PersonalMatrixResult";
import { KeyToResultComponent } from "@/components/KeyToResult";
import { CompatibilityResultComponent } from "@/components/CompatibilityResult";
import { AncestralResultComponent } from "@/components/AncestralResult";
import { DailyForecastResultComponent } from "@/components/DailyForecastResult";
import { FinancialCodeResultComponent } from "@/components/FinancialCodeResult";
import { NameEnergyResultComponent } from "@/components/NameEnergyResult";
import { ContractEnergyResultComponent } from "@/components/ContractEnergyResult";
import { ComingSoon } from "@/components/ComingSoon";
import { LifeCodInputForm, LifeCodResult, UnifiedPersonalResult } from "@/components/lifecod";
import { TierSelector } from "@/components/TierSelector";
import { analysisConfigs, getAnalysisConfig, getConfigsForMethodology, proExtendedDescription, type TierType } from "@/lib/analysisConfig";
import { GOLDEN_ICONS } from "@/components/GoldenIcons";
import {
  calculateYearForecast,
  calculateMonthForecast,
  calculatePersonalMatrix,
  calculateCompatibility,
  YearForecast,
  MonthForecast,
  PersonalMatrix,
  CompatibilityResult
} from "@/lib/calculations";
import { calculateKeyTo, KeyToResult } from "@/lib/keyto";
import { calculateAncestralPrograms, AncestralResult } from "@/lib/ancestral";
import { calculateLifeCodCompatibility, LifeCodCompatibilityResult, RelationType, calculateUnifiedPersonalAnalysis, UnifiedPersonalAnalysis } from "@/lib/lifecod";
import { calculateBusinessBasic, calculateBusinessPro, type BusinessBasicModule, type BusinessProModule } from "@/lib/lifecod/businessAnalysis";
import { calculateSuccessPath, type SuccessPathModule } from "@/lib/lifecod/successPath";
import { BusinessResult } from "@/components/BusinessResult";
import { SuccessPathResult } from "@/components/SuccessPathResult";
import { calculateDailyForecast, DailyForecastResult as DailyForecastType } from "@/lib/dailyForecast";
import { calculateFinancialCode, FinancialCodeResult as FinancialCodeType } from "@/lib/financialCode";
import { calculateNameEnergy, NameEnergyResult as NameEnergyType } from "@/lib/nameEnergy";
import { LifeCodPersonalResult } from "@/components/lifecod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, FileText, Building, Type, Wallet, Lock, Calendar, CalendarDays, Compass, Brain, Clock, Sparkles, Check, Heart, Briefcase, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMethodPrice } from "@/hooks/useMethodPrice";

// Icon mapping for config
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Compass, Users, CalendarDays, Calendar, Clock, Brain, Building, Type, Wallet, FileText, Heart, Briefcase, Sparkles,
};

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Refs for tracking analysis save state
  const lastInputRef = useRef<Record<string, unknown>>({});
  const savedResultRef = useRef<unknown>(null);

  type ResultType =
    | { type: "year"; data: YearForecast }
    | { type: "month"; data: MonthForecast }
    | { type: "purpose"; data: PersonalMatrix }
    | { type: "keyto"; data: KeyToResult }
    | { type: "compatibility"; data: CompatibilityResult }
    | { type: "ancestral"; data: AncestralResult }
    | { type: "lifecod"; data: LifeCodCompatibilityResult }
    | { type: "lifecod-personal"; data: { name: string; day: number; month: number; year: number } }
    | { type: "unified-personal"; data: UnifiedPersonalAnalysis }
    | { type: "day"; data: DailyForecastType }
    | { type: "finance"; data: FinancialCodeType }
    | { type: "name"; data: NameEnergyType }
    | { type: "contract"; data: DailyForecastType }
    | { type: "business"; data: BusinessBasicModule | BusinessProModule; isPro: boolean }
    | { type: "success-path"; data: SuccessPathModule }
    | null;

  const [selectedMethodology, setSelectedMethodology] = useState<"1" | "2">("1");
  const [selectedMethod, setSelectedMethod] = useState("purpose");
  const [selectedTier, setSelectedTier] = useState<TierType>("basic");
  const [result, setResult] = useState<ResultType>(null);
  const [userName, setUserName] = useState("");
  const [nameEnergyInput, setNameEnergyInput] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "paid">("idle");
  const [pendingCalcArgs, setPendingCalcArgs] = useState<{
    day: number; month: number; year: number; name: string;
    targetMonth?: number; targetYear?: number; gender?: 'male' | 'female'; targetDay?: number;
    method?: string; methodology?: string; tier?: TierType;
  } | null>(null);
  const [pendingCompatArgs, setPendingCompatArgs] = useState<{
    p1Day: number; p1Month: number; p1Year: number; p1Name: string;
    p2Day: number; p2Month: number; p2Year: number; p2Name: string;
  } | null>(null);
  const [pendingLifeCodArgs, setPendingLifeCodArgs] = useState<{
    p1Name: string; p1Day: number; p1Month: number; p1Year: number;
    p2Name: string; p2Day: number; p2Month: number; p2Year: number;
    relationType: RelationType;
  } | null>(null);

  // Обработка возврата с /payment/success.
  // PaymentSuccess сохраняет "payment_completed" в sessionStorage и редиректит на "/".
  // Здесь восстанавливаем все pending данные и запускаем расчёт.
  useEffect(() => {
    const completed = sessionStorage.getItem("payment_completed");
    if (completed !== "true") return;

    // Чистим флаг сразу
    sessionStorage.removeItem("payment_completed");
    sessionStorage.removeItem("pending_order_id");

    // Восстанавливаем pendingCalcData (одиночные разборы)
    const calcRaw = sessionStorage.getItem("pendingCalcData") || localStorage.getItem("pendingCalcData");
    if (calcRaw) {
      try {
        const d = JSON.parse(calcRaw);
        sessionStorage.removeItem("pendingCalcData");
        localStorage.removeItem("pendingCalcData");
        if (d.methodology) setSelectedMethodology(d.methodology as "1" | "2");
        if (d.method) setSelectedMethod(d.method);
        if (d.tier) setSelectedTier(d.tier as TierType);
        setPendingCalcArgs(d);
        sessionStorage.removeItem("pending_method_id");
        setPaymentStatus("paid");
        return;
      } catch {}
    }

    // Восстанавливаем pendingCompatData (совместимость М1)
    const compatRaw = sessionStorage.getItem("pendingCompatData");
    if (compatRaw) {
      try {
        const d = JSON.parse(compatRaw);
        sessionStorage.removeItem("pendingCompatData");
        if (d.methodology) setSelectedMethodology(d.methodology as "1" | "2");
        if (d.method) setSelectedMethod(d.method);
        setPendingCompatArgs(d);
        sessionStorage.removeItem("pending_method_id");
        setPaymentStatus("paid");
        return;
      } catch {}
    }

    // Восстанавливаем pendingLifeCodData (совместимость М2)
    const lifecodRaw = sessionStorage.getItem("pendingLifeCodData");
    if (lifecodRaw) {
      try {
        const d = JSON.parse(lifecodRaw);
        sessionStorage.removeItem("pendingLifeCodData");
        if (d.methodology) setSelectedMethodology(d.methodology as "1" | "2");
        if (d.method) setSelectedMethod(d.method);
        setPendingLifeCodArgs(d);
        sessionStorage.removeItem("pending_method_id");
        setPaymentStatus("paid");
        return;
      } catch {}
    }

    // Fallback: просто ставим paid, пусть юзер пересчитает
    const pendingMethod = sessionStorage.getItem("pending_method_id");
    sessionStorage.removeItem("pending_method_id");
    if (pendingMethod) setSelectedMethod(pendingMethod);
    setPaymentStatus("paid");
  }, []);

  // Когда paymentStatus становится "paid" и есть pending данные — автоматически считаем разбор
  useEffect(() => {
    if (paymentStatus === "paid" && result === null) {
      if (pendingCalcArgs || pendingCompatArgs || pendingLifeCodArgs) {
        handlePaymentSuccess();
      }
    }
  }, [paymentStatus, pendingCalcArgs, pendingCompatArgs, pendingLifeCodArgs]);

  // Get current analysis config
  const currentConfig = getAnalysisConfig(selectedMethod);

  // Life C⚙D compatibility handler
  const handleLifeCodCalculate = (
    person1Name: string, person1Day: number, person1Month: number, person1Year: number,
    person2Name: string, person2Day: number, person2Month: number, person2Year: number,
    relationType: RelationType
  ) => {
    // Track input for saving
    lastInputRef.current = {
      person1Name, person1Day, person1Month, person1Year,
      person2Name, person2Day, person2Month, person2Year,
      relationType,
    };
    // Показываем оплату если цена > 0 (и не владелец)
    const lifecodPrice = selectedTier === 'professional' ? methodPrices?.price_pro : methodPrices?.price_basic;
    if (lifecodPrice != null && lifecodPrice > 0 && paymentStatus !== 'paid' && !isOwner) {
      setPendingLifeCodArgs({ p1Name: person1Name, p1Day: person1Day, p1Month: person1Month, p1Year: person1Year, p2Name: person2Name, p2Day: person2Day, p2Month: person2Month, p2Year: person2Year, relationType });
      sessionStorage.setItem("pendingLifeCodData", JSON.stringify({ p1Name: person1Name, p1Day: person1Day, p1Month: person1Month, p1Year: person1Year, p2Name: person2Name, p2Day: person2Day, p2Month: person2Month, p2Year: person2Year, relationType, method: selectedMethod, methodology: selectedMethodology }));
      setPaymentStatus("pending");
      return;
    }
    const lifecodResult = calculateLifeCodCompatibility(
      person1Name, person1Day, person1Month, person1Year,
      person2Name, person2Day, person2Month, person2Year,
      relationType
    );
    setResult({ type: "lifecod", data: lifecodResult });
  };

  // Reset method when methodology changes
  useEffect(() => {
    if (selectedMethodology === "2") {
      setSelectedMethod("classic-full");
    } else {
      setSelectedMethod("purpose");
    }
    setSelectedTier("basic");
  }, [selectedMethodology]);

  // When method changes — if the new method has no basic tier, auto-switch to professional
  useEffect(() => {
    const cfg = getAnalysisConfig(selectedMethod);
    if (cfg && !cfg.basic.available && cfg.professional?.available) {
      setSelectedTier("professional");
    } else {
      setSelectedTier("basic");
    }
  }, [selectedMethod]);

  // Auto-save every new result to "Мои разборы" for logged-in users
  useEffect(() => {
    if (!user || !result) return;
    if (savedResultRef.current === result) return; // already saved this exact result instance
    savedResultRef.current = result;

    const titleBase = getAnalysisConfig(selectedMethod)?.title || selectedMethod;
    const personName = (lastInputRef.current?.name as string) || (lastInputRef.current?.person1Name as string) || "";
    const title = personName ? `${titleBase} — ${personName}` : titleBase;

    saveAnalysis({
      user_id: user.id,
      method_id: selectedMethod,
      methodology: selectedMethodology,
      tier: selectedTier,
      result_type: result.type,
      input: lastInputRef.current,
      result: result.data as Record<string, unknown>,
      title,
    }).catch((e) => {
      console.error("Failed to save analysis:", e);
    });
  }, [result, user, selectedMethod, selectedMethodology, selectedTier]);

  const handleCalculate = (
    day: number,
    month: number,
    year: number,
    name: string,
    targetMonth?: number,
    targetYear?: number,
    gender?: 'male' | 'female',
    targetDay?: number
  ) => {
    setUserName(name);

    // Запоминаем входные данные — используются для сохранения в БД
    lastInputRef.current = { day, month, year, name, targetMonth, targetYear, gender, targetDay };

    // Показываем экран оплаты если цена > 0 для выбранного тира (и не владелец)
    const priceForTier = selectedTier === 'professional' ? methodPrices?.price_pro : methodPrices?.price_basic;
    if (priceForTier != null && priceForTier > 0 && paymentStatus !== 'paid' && !isOwner) {
      setPendingCalcArgs({ day, month, year, name, targetMonth, targetYear, gender, targetDay });
      localStorage.setItem("pendingCalcData", JSON.stringify({ day, month, year, name, targetMonth, targetYear, gender, targetDay, method: selectedMethod, methodology: selectedMethodology, tier: selectedTier }));
      setPaymentStatus("pending");
      return;
    }

    // Methodology 2 — main "Predназначение" (classic-full) routes to keyto/unified
    if (selectedMethodology === "2" && selectedMethod === "classic-full") {
      if (selectedTier === 'professional') {
        const unifiedResult = calculateUnifiedPersonalAnalysis(name || "Вы", day, month, year, targetYear || new Date().getFullYear());
        setResult({ type: "unified-personal", data: unifiedResult });
        return;
      }
      const classicResult = calculateKeyTo(day, month, year);
      setResult({ type: "keyto", data: classicResult });
      return;
    }

    // All other methods (both methodologies) — switch by method id
    switch (selectedMethod) {
      case "year": {
        const yearForecast = calculateYearForecast(day, month, year, targetYear || new Date().getFullYear());
        setResult({ type: "year", data: yearForecast });
        break;
      }
      case "month": {
        const monthForecast = calculateMonthForecast(
          day, month, year,
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "month", data: monthForecast });
        break;
      }
      case "day": {
        const daily = calculateDailyForecast(
          day, month, year,
          targetDay || new Date().getDate(),
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "day", data: daily });
        break;
      }
      case "contract": {
        const contract = calculateDailyForecast(
          day, month, year,
          targetDay || new Date().getDate(),
          targetMonth || new Date().getMonth() + 1,
          targetYear || new Date().getFullYear()
        );
        setResult({ type: "contract", data: contract });
        break;
      }
      case "finance": {
        const finance = calculateFinancialCode(day, month, year);
        setResult({ type: "finance", data: finance });
        break;
      }
      case "ancestral": {
        const ancestralResult = calculateAncestralPrograms(day, month, year, gender || 'female');
        setResult({ type: "ancestral", data: ancestralResult });
        break;
      }
      case "business": {
        const isProTier = selectedTier === 'professional';
        const data = isProTier ? calculateBusinessPro(day, month, year) : calculateBusinessBasic(day, month, year);
        setResult({ type: "business", data, isPro: isProTier });
        break;
      }
      case "success-path": {
        setResult({ type: "success-path", data: calculateSuccessPath(day, month, year) });
        break;
      }
      case "purpose":
      default: {
        const personalMatrix = calculatePersonalMatrix(day, month, year);
        setResult({ type: "purpose", data: personalMatrix });
        break;
      }
    }
  };

  const handleNameEnergyCalculate = () => {
    if (nameEnergyInput.trim()) {
      lastInputRef.current = { name: nameEnergyInput.trim() };
      const nameResult = calculateNameEnergy(nameEnergyInput.trim());
      setResult({ type: "name", data: nameResult });
    }
  };

  const handleCompatibilityCalculate = (
    person1Day: number, person1Month: number, person1Year: number, person1Name: string,
    person2Day: number, person2Month: number, person2Year: number, person2Name: string
  ) => {
    lastInputRef.current = {
      person1Day, person1Month, person1Year, person1Name,
      person2Day, person2Month, person2Year, person2Name,
    };
    // Показываем оплату если цена > 0 (и не владелец)
    const compatPrice = selectedTier === 'professional' ? methodPrices?.price_pro : methodPrices?.price_basic;
    if (compatPrice != null && compatPrice > 0 && paymentStatus !== 'paid' && !isOwner) {
      setPendingCompatArgs({ p1Day: person1Day, p1Month: person1Month, p1Year: person1Year, p1Name: person1Name, p2Day: person2Day, p2Month: person2Month, p2Year: person2Year, p2Name: person2Name });
      sessionStorage.setItem("pendingCompatData", JSON.stringify({ p1Day: person1Day, p1Month: person1Month, p1Year: person1Year, p1Name: person1Name, p2Day: person2Day, p2Month: person2Month, p2Year: person2Year, p2Name: person2Name, method: selectedMethod, methodology: selectedMethodology }));
      setPaymentStatus("pending");
      return;
    }
    const compatResult = calculateCompatibility(
      person1Day, person1Month, person1Year, person1Name,
      person2Day, person2Month, person2Year, person2Name
    );
    setResult({ type: "compatibility", data: compatResult });
  };

  const { lock } = useAccess();
  const OWNER_EMAIL = "leo.puzz7@gmail.com";
  const isOwner = user?.email === OWNER_EMAIL;
  const { prices: methodPrices } = useMethodPrice(selectedMethod);

  const handleReset = () => {
    setResult(null);
    setUserName("");
    setSelectedTier("basic");
    setPaymentStatus("idle");
    setPendingCalcArgs(null);
    setPendingCompatArgs(null);
    setPendingLifeCodArgs(null);
    localStorage.removeItem("pendingCalcData");
    lock(); // reset access state for new calculation
  };

  // After successful payment, run the pending calculation and show result
  const handlePaymentSuccess = () => {
    setPaymentStatus("paid");

    // Handle pending compatibility args
    if (pendingCompatArgs) {
      const { p1Day, p1Month, p1Year, p1Name, p2Day, p2Month, p2Year, p2Name } = pendingCompatArgs;
      const compatResult = calculateCompatibility(p1Day, p1Month, p1Year, p1Name, p2Day, p2Month, p2Year, p2Name);
      setResult({ type: "compatibility", data: compatResult });
      return;
    }

    // Handle pending lifecod args
    if (pendingLifeCodArgs) {
      const { p1Name, p1Day, p1Month, p1Year, p2Name, p2Day, p2Month, p2Year, relationType } = pendingLifeCodArgs;
      const lifecodResult = calculateLifeCodCompatibility(p1Name, p1Day, p1Month, p1Year, p2Name, p2Day, p2Month, p2Year, relationType);
      setResult({ type: "lifecod", data: lifecodResult });
      return;
    }

    if (pendingCalcArgs) {
      const { day, month, year, name, targetMonth, targetYear, gender, targetDay } = pendingCalcArgs;
      // Используем method/methodology/tier из сохранённых данных, а не из state —
      // это защита от гонки useEffect при монтировании страницы после редиректа с оплаты.
      const resolvedMethod = pendingCalcArgs.method || selectedMethod;
      const resolvedMethodology = pendingCalcArgs.methodology || selectedMethodology;
      const resolvedTier = pendingCalcArgs.tier || selectedTier;
      // Синхронизируем state — нужно чтобы автосохранение записало правильный method_id/tier
      setSelectedMethod(resolvedMethod);
      setSelectedMethodology(resolvedMethodology as "1" | "2");
      setSelectedTier(resolvedTier);
      setUserName(name);

      // Methodology 2 — main "Predназначение" (classic-full) routes to keyto/unified
      if (resolvedMethodology === "2" && resolvedMethod === "classic-full") {
        if (resolvedTier === 'professional') {
          const unifiedResult = calculateUnifiedPersonalAnalysis(name || "Вы", day, month, year, targetYear || new Date().getFullYear());
          setResult({ type: "unified-personal", data: unifiedResult });
          return;
        }
        const classicResult = calculateKeyTo(day, month, year);
        setResult({ type: "keyto", data: classicResult });
        return;
      }

      switch (resolvedMethod) {
        case "year":
          setResult({ type: "year", data: calculateYearForecast(day, month, year, targetYear || new Date().getFullYear()) });
          break;
        case "month":
          setResult({ type: "month", data: calculateMonthForecast(day, month, year, targetMonth || new Date().getMonth() + 1, targetYear || new Date().getFullYear()) });
          break;
        case "day":
          setResult({ type: "day", data: calculateDailyForecast(day, month, year, targetDay || new Date().getDate(), targetMonth || new Date().getMonth() + 1, targetYear || new Date().getFullYear()) });
          break;
        case "contract":
          setResult({ type: "contract", data: calculateDailyForecast(day, month, year, targetDay || new Date().getDate(), targetMonth || new Date().getMonth() + 1, targetYear || new Date().getFullYear()) });
          break;
        case "finance":
          setResult({ type: "finance", data: calculateFinancialCode(day, month, year) });
          break;
        case "ancestral":
          setResult({ type: "ancestral", data: calculateAncestralPrograms(day, month, year, gender || 'female') });
          break;
        case "business": {
          const isProTier = resolvedTier === 'professional';
          setResult({ type: "business", data: isProTier ? calculateBusinessPro(day, month, year) : calculateBusinessBasic(day, month, year), isPro: isProTier });
          break;
        }
        case "success-path":
          setResult({ type: "success-path", data: calculateSuccessPath(day, month, year) });
          break;
        case "purpose":
        default:
          setResult({ type: "purpose", data: calculatePersonalMatrix(day, month, year) });
          break;
      }
    }
  };

  const handlePaymentBack = () => {
    setPaymentStatus("idle");
    setPendingCalcArgs(null);
    setPendingCompatArgs(null);
    setPendingLifeCodArgs(null);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  // Method lists per methodology — built from analysisConfig
  const methodology1Methods = getConfigsForMethodology('1').map(cfg => ({
    id: cfg.id,
    name: cfg.title,
    description: cfg.description,
    available: !cfg.comingSoon,
    comingSoon: !!cfg.comingSoon,
    icon: iconMap[cfg.icon] || Compass,
    iconName: cfg.icon,
  }));

  const methodology2Methods = getConfigsForMethodology('2').map(cfg => ({
    id: cfg.id,
    name: cfg.title,
    description: cfg.description,
    available: !cfg.comingSoon,
    comingSoon: !!cfg.comingSoon,
    icon: iconMap[cfg.icon] || Compass,
    iconName: cfg.icon,
  }));

  return (
    <div className="min-h-screen">
      <Header />

      <main className="relative z-10">
        {paymentStatus === "pending" && !result ? (
          /* Payment gate — shown when professional tier selected but not yet paid */
          <div className="container mx-auto px-4 py-6 md:py-8">
            <PaymentScreen
              methodId={selectedMethod}
              tier={selectedTier}
              onPaid={handlePaymentSuccess}
              onBack={handlePaymentBack}
            />
          </div>
        ) : !result ? (
          <>
            {/* Hero block — shown only to non-authenticated visitors */}
            {!user && (
              <section className="pt-8 md:pt-12 lg:pt-16 pb-2">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{background:'linear-gradient(135deg,#F5DFA0,rgba(201,151,58,0.3))',border:'1px solid rgba(201,151,58,0.5)'}}>
                      <Sparkles className="w-6 h-6" style={{color:'#8B5E1A'}} />
                    </div>
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary mb-5 leading-tight">
                      Персональная диагностика Life C⚙D
                    </h1>
                    <p className="text-base md:text-lg text-muted-foreground mb-4 leading-relaxed">
                      Понимание себя, своих жизненных циклов, сильных и слабых сторон, а также текущего периода жизни.
                    </p>
                    <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                      Этот инструмент помогает увидеть, как ты принимаешь решения, где твоя опора и на что сейчас важно обратить внимание.
                    </p>
                    <p className="text-sm text-muted-foreground/70 italic mb-8">
                      Без мистики. Без обещаний изменить тебя. Только структура и логика.
                    </p>
                    <div className="flex flex-col items-center gap-3">
                      <Link to="/register">
                        <Button className="h-14 px-8 rounded-full text-base font-medium gradient-brown text-white border-2 border-primary">
                          Начать диагностику
                          <span className="ml-2">→</span>
                        </Button>
                      </Link>
                      <Link
                        to="/login"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                      >
                        Уже есть аккаунт? Войти в калькулятор
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Calculator Section — visible ONLY to authenticated users.
                Non-authenticated visitors see only the hero block above. */}
            {user && (
            <section className="py-8 md:py-12 lg:py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-6 md:mb-8 text-center flex items-center justify-center gap-2" style={{fontWeight:600,letterSpacing:'-0.02em',color:'#1a1a1a'}}>
                    {t("calculator.title")}
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block flex-shrink-0">
                      <path d="M14 23.5C14 23.5 3.5 17.5 3.5 10.5C3.5 7.46 5.96 5 9 5C10.96 5 12.68 6.02 13.75 7.56C13.88 7.74 14.12 7.74 14.25 7.56C15.32 6.02 17.04 5 19 5C22.04 5 24.5 7.46 24.5 10.5C24.5 17.5 14 23.5 14 23.5Z" fill="url(#redHeart)" stroke="#6B0020" strokeWidth="0.5"/>
                      <defs>
                        <linearGradient id="redHeart" x1="3.5" y1="5" x2="24.5" y2="23.5" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#C41E3A"/>
                          <stop offset="50%" stopColor="#A31328"/>
                          <stop offset="100%" stopColor="#7B0D1E"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </h2>

                  <p className="text-sm text-muted-foreground text-center mb-4 md:mb-6">
                    {t("calculator.selectMethodology")}
                  </p>

                  {/* Methodology 1 - 22 Arcana */}
                  <div className="mb-4 md:mb-6">
                    <button
                      onClick={() => setSelectedMethodology("1")}
                      className={cn(
                        "relative w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedMethodology === "1"
                          ? "bg-[#edebe4] border-[#1A0800] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                          : "bg-white border-[#3D1A00] hover:border-[#1A0800]"
                      )}
                    >
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-medium flex items-center gap-1 whitespace-nowrap" style={{background:'#fff',border:'1px solid #C9973A',borderRadius:'4px',color:'#8B5E1A',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                        <Sparkles className="w-3 h-3" />
                        {t("methodology.moreAccurate")}
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedMethodology === "1"
                            ? "border-[#2C1200] bg-[#2C1200]"
                            : "border-[#3D1A00]/50"
                        )}>
                          {selectedMethodology === "1" && (
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-[#FFF8E7]" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display font-semibold text-foreground text-base md:text-lg">
                              {t("methodology.methodology1")}
                            </h3>
                            <span className="text-xs px-2 py-0.5" style={{background:'rgba(0,0,0,0.06)',color:'#3d3929',borderRadius:'5px',fontWeight:500}}>
                              {t("methodology.arcana22")}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm mb-3" style={{color:'#6b6b6b'}}>
                            {t("methodology.arcanaDescription")}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {[
                              t("methodology.features.purpose"),
                              t("methodology.features.compatibility"),
                              t("methodology.features.forecasts"),
                              t("methodology.features.lifePeriods"),
                            ].map((feature, i) => (
                              <span key={i} className="text-xs px-2 py-1" style={{background:'rgba(0,0,0,0.06)',color:'#3d3929',borderRadius:'6px',fontWeight:500}}>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Methods grid - shown when Methodology 1 is selected */}
                    {selectedMethodology === "1" && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {methodology1Methods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => handleMethodSelect(method.id)}
                            className={cn(
                              "relative p-3 md:p-4 rounded-xl border-[1.5px] transition-all duration-300 text-left",
                              selectedMethod === method.id
                                ? "bg-[#edebe4] border-[#1A0800] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                                : "bg-white border-[#3D1A00] hover:border-[#1A0800] hover:shadow-[0_2px_10px_rgba(30,8,0,0.08)]"
                            )}
                          >
                            <div className="flex flex-col gap-2.5">
                              <div className="flex items-start justify-between">
                                {(() => { const G = GOLDEN_ICONS[method.iconName]; return G ? <G /> : <method.icon className="w-7 h-7" style={{color:'#C9973A'}} />; })()}
                                <div className="flex items-center gap-1">
                                  {selectedMethod === method.id && (
                                    <Sparkles className="w-3 h-3" style={{color:'#C9973A'}} />
                                  )}
                                  {method.comingSoon && (
                                    <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{background:'rgba(196,152,90,0.15)',color:'#8B5E1A'}}>
                                      Скоро
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-display font-semibold text-base md:text-lg" style={{color:'#1a1a1a'}}>
                                  {method.name}
                                </h4>
                                <p className="text-xs md:text-sm mt-1 line-clamp-2" style={{color:'#6b6b6b'}}>
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Methodology 2 - Classic with Life C⚙D */}
                  <div className="mb-6 md:mb-8">
                    <button
                      onClick={() => setSelectedMethodology("2")}
                      className={cn(
                        "relative w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left",
                        selectedMethodology === "2"
                          ? "bg-[#edebe4] border-[#1A0800] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                          : "bg-white border-[#3D1A00] hover:border-[#1A0800]"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          selectedMethodology === "2"
                            ? "border-[#2C1200] bg-[#2C1200]"
                            : "border-[#3D1A00]/50"
                        )}>
                          {selectedMethodology === "2" && (
                            <Check className="w-3 h-3 md:w-4 md:h-4 text-[#FFF8E7]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display font-semibold text-base md:text-lg" style={{color:'#1a1a1a'}}>
                              {t("methodology.methodology2")}
                            </h3>
                            <span className="text-xs px-2 py-0.5" style={{background:'rgba(0,0,0,0.06)',color:'#3d3929',borderRadius:'5px',fontWeight:500}}>
                              {t("methodology.classic")}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm mb-3" style={{color:'#6b6b6b'}}>
                            {t("methodology.classicDescription")}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {[
                              t("methodology.features.mindNumber"),
                              t("methodology.features.actionNumber"),
                              t("methodology.features.realizationNumber"),
                              t("methodology.features.outcomeNumber"),
                            ].map((feature, i) => (
                              <span key={i} className="text-xs px-2 py-1" style={{background:'rgba(0,0,0,0.06)',color:'#3d3929',borderRadius:'6px',fontWeight:500}}>
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Methods grid - shown when Methodology 2 is selected */}
                    {selectedMethodology === "2" && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                        {methodology2Methods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => handleMethodSelect(method.id)}
                            className={cn(
                              "relative p-3 md:p-4 rounded-xl border-[1.5px] transition-all duration-300 text-left",
                              selectedMethod === method.id
                                ? "bg-[#edebe4] border-[#1A0800] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
                                : "bg-white border-[#3D1A00] hover:border-[#1A0800] hover:shadow-[0_2px_10px_rgba(30,8,0,0.08)]"
                            )}
                          >
                            <div className="flex flex-col gap-2.5">
                              <div className="flex items-start justify-between">
                                {(() => { const G = GOLDEN_ICONS[method.iconName]; return G ? <G /> : <method.icon className="w-7 h-7" style={{color:'#C9973A'}} />; })()}
                                <div className="flex items-center gap-1">
                                  {selectedMethod === method.id && (
                                    <Sparkles className="w-3 h-3" style={{color:'#C9973A'}} />
                                  )}
                                  {method.comingSoon && (
                                    <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{background:'rgba(196,152,90,0.15)',color:'#8B5E1A'}}>
                                      Скоро
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-display font-semibold text-base md:text-lg" style={{color:'#1a1a1a'}}>
                                  {method.name}
                                </h4>
                                <p className="text-xs md:text-sm mt-1 line-clamp-2" style={{color:'#6b6b6b'}}>
                                  {method.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tier Selector — hidden for coming-soon methods */}
                  {currentConfig && !currentConfig.comingSoon && (
                    <div className="max-w-xl mx-auto mb-2">
                      <h3 className="text-sm font-medium text-center mb-3" style={{color:'#6b6b6b'}}>
                        {t("cfg.chooseTierFor", { title: currentConfig.title })}
                      </h3>
                      <TierSelector
                        config={currentConfig}
                        selectedTier={selectedTier}
                        onSelectTier={setSelectedTier}
                        priceBasic={methodPrices?.price_basic ?? null}
                        pricePro={methodPrices?.price_pro ?? null}
                      />
                      {/* What's inside Professional extended analysis (per methodology) */}
                      {selectedTier === 'professional' && currentConfig.professional && (
                        <div className="mt-1 mb-4 px-4 py-3 rounded-lg text-xs leading-relaxed" style={{background:'rgba(196,152,90,0.08)',border:'1px solid rgba(196,152,90,0.3)'}}>
                          <p className="font-medium mb-1" style={{color:'#8B5E1A'}}>{t("res.proExtendedIncluded")}</p>
                          <p style={{color:'#6b6b6b'}}>{proExtendedDescription(selectedMethodology)}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Form rendering — picks input form based on method */}
                  {currentConfig?.comingSoon ? (
                    /* Placeholder for Бизнес and Путь к успеху */
                    <ComingSoon
                      title={currentConfig.title}
                      description={currentConfig.description}
                    />
                  ) : selectedMethod === "name" ? (
                    /* Name energy input (text field, not date) */
                    <div className="w-full max-w-xl mx-auto">
                      <div className="rounded-2xl p-5 sm:p-8" style={{background:'#fdfaf5',border:'1.5px solid #C4985A'}}>
                        <div className="space-y-5">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t("calculator.nameToCheck")}</label>
                            <Input
                              placeholder={t("calculator.nameToCheckPlaceholder")}
                              value={nameEnergyInput}
                              onChange={(e) => setNameEnergyInput(e.target.value)}
                              className="bg-background border-border focus:border-primary focus:ring-primary/20 h-12 text-foreground placeholder:text-muted-foreground"
                            />
                          </div>
                          <Button
                            onClick={handleNameEnergyCalculate}
                            disabled={!nameEnergyInput.trim()}
                            className="w-full h-14 text-lg font-display btn-fill animate-gentle-shake bg-primary hover:bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none transition-all duration-300 rounded-full border-2 border-primary"
                          >
                            Рассчитать энергию названия
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : selectedMethod === "lifecod-compatibility" ? (
                    /* Methodology 2 compatibility — two people form via LifeCod */
                    <LifeCodInputForm onCalculate={handleLifeCodCalculate} />
                  ) : selectedMethod === "compatibility" ? (
                    /* Methodology 1 compatibility — two people form */
                    <CompatibilityDateInput onCalculate={handleCompatibilityCalculate} />
                  ) : (
                    /* Default — single date input form */
                    <DateInput
                      selectedMethod={selectedMethod}
                      onCalculate={handleCalculate}
                    />
                  )}
                </div>
              </div>
            </section>
            )}
          </>
        ) : (
          <div className="container mx-auto px-4 py-6 md:py-8">
              {result.type === "year" && (
              <YearForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "month" && (
              <MonthForecastResult
                forecast={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "purpose" && (
              <PersonalMatrixResult
                matrix={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "keyto" && (
              <KeyToResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
              />
            )}
            {result.type === "compatibility" && (
              <CompatibilityResultComponent
                result={result.data}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "ancestral" && (
              <AncestralResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "lifecod" && (
              <LifeCodResult
                result={result.data}
                onReset={handleReset}
              />
            )}
            {result.type === "lifecod-personal" && (
              <LifeCodPersonalResult
                name={result.data.name}
                day={result.data.day}
                month={result.data.month}
                year={result.data.year}
                onReset={handleReset}
              />
            )}
            {result.type === "unified-personal" && (
              <UnifiedPersonalResult
                analysis={result.data}
                onReset={handleReset}
                isPaid={selectedTier === 'professional'}
              />
            )}
            {result.type === "day" && (
              <DailyForecastResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "finance" && (
              <FinancialCodeResultComponent
                result={result.data}
                name={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "name" && (
              <NameEnergyResultComponent
                result={result.data}
                onReset={handleReset}
              />
            )}
            {result.type === "contract" && (
              <ContractEnergyResultComponent
                result={result.data}
                personName={userName}
                onReset={handleReset}
                tier={selectedTier}
              />
            )}
            {result.type === "business" && (
              <div className="space-y-4">
                <div className="max-w-2xl mx-auto">
                  <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("results.newCalculation")}
                  </Button>
                </div>
                <BusinessResult result={result.data} isPro={result.isPro} />
              </div>
            )}
            {result.type === "success-path" && (
              <div className="space-y-4">
                <div className="max-w-2xl mx-auto">
                  <Button variant="ghost" onClick={handleReset} className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t("results.newCalculation")}
                  </Button>
                </div>
                <SuccessPathResult result={result.data} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
