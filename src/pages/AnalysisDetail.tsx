import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import {
  getAnalysis,
  methodLabel,
  methodologyLabel,
  tierLabel,
  type SavedAnalysis,
} from "@/lib/analysisStorage";

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
import { LifeCodResult, UnifiedPersonalResult } from "@/components/lifecod";

export default function AnalysisDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getAnalysis(id).then(({ data, error }) => {
      if (error || !data) {
        setError(error || t("analysisDetail.notFound"));
      } else {
        setAnalysis(data);
      }
      setLoading(false);
    });
  }, [id]);

  const handleBack = () => navigate("/my-analyses");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingScreen />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center gradient-card rounded-2xl p-8 border border-border">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">{t("analysisDetail.openError")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Link to="/my-analyses">
              <Button className="rounded-full">{t("analysisDetail.backToList")}</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const inputData = analysis.input as Record<string, unknown>;
  const userName = (inputData?.name as string) || t("common.partner");
  const tier = analysis.tier as "basic" | "professional";

  // Подкладываем сохранённый результат в соответствующий компонент
  const renderResult = () => {
    const data = analysis.result as never;

    switch (analysis.result_type) {
      case "year":
        return <YearForecastResult forecast={data} name={userName} onReset={handleBack} tier={tier} />;
      case "month":
        return <MonthForecastResult forecast={data} name={userName} onReset={handleBack} tier={tier} />;
      case "purpose":
        return <PersonalMatrixResult matrix={data} name={userName} onReset={handleBack} tier={tier} />;
      case "keyto":
        return <KeyToResultComponent result={data} name={userName} onReset={handleBack} />;
      case "compatibility":
        return <CompatibilityResultComponent result={data} onReset={handleBack} tier={tier} />;
      case "ancestral":
        return <AncestralResultComponent result={data} name={userName} onReset={handleBack} tier={tier} />;
      case "lifecod":
        return <LifeCodResult result={data} onReset={handleBack} />;
      case "unified-personal":
        return <UnifiedPersonalResult analysis={data} onReset={handleBack} isPaid={tier === "professional"} />;
      case "day":
        return <DailyForecastResultComponent result={data} name={userName} onReset={handleBack} tier={tier} />;
      case "finance":
        return <FinancialCodeResultComponent result={data} name={userName} onReset={handleBack} tier={tier} />;
      case "name":
        return <NameEnergyResultComponent result={data} onReset={handleBack} />;
      case "contract":
        return <ContractEnergyResultComponent result={data} personName={userName} onReset={handleBack} tier={tier} />;
      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            {t("analysisDetail.unsupported", { type: analysis.result_type })}
          </div>
        );
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb / back nav */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <Link
              to="/my-analyses"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("analysisDetail.allAnalyses")}
            </Link>
            <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span>•</span>
              <span>{methodologyLabel(analysis.methodology)}</span>
              <span>•</span>
              <span>{tierLabel(analysis.tier)}</span>
              <span>•</span>
              <span>{formatDate(analysis.created_at)}</span>
            </div>
          </div>

          {renderResult()}
        </div>
      </main>
    </div>
  );
}
