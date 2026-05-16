import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { AncestralResult } from "@/lib/ancestral";
import { KarmicStar } from "./KarmicStar";
import { ArrowLeft, Shield, Heart, Star, AlertTriangle, Crown, Sparkles, Users, BookOpen, Target, CheckCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDownloadButton } from "./PDFDownloadButton";
import { generatePDF, formatBirthDateForPDF } from "@/lib/pdfGenerator";
import { getAncestralProData } from "@/lib/proInterpretationsExtra";
import { ProSectionBlock, ProTextBlock, ProListBlock, ProNumberedList } from "./ProSectionBlock";
import type { TierType } from "@/lib/analysisConfig";

interface AncestralResultProps {
  result: AncestralResult;
  name: string;
  onReset: () => void;
  tier?: TierType;
}

export function AncestralResultComponent({ result, name, onReset, tier = 'basic' }: AncestralResultProps) {
  const { t } = useTranslation();
  const isPro = tier === 'professional';
  const proData = isPro ? getAncestralProData(result.workingNumbers, result.starCounts) : null;

  const formatBirthDateStr = () => {
    const { day, month, year } = result.birthDate;
    return `${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year}`;
  };

  const getDigitInterpretation = (digit: string, count: number) => {
    const key = `ancestral.interpretations.${digit}.${Math.min(count, 4)}`;
    return t(key);
  };

  const digitInfo = [
    { digit: "2", count: result.starCounts.twos, title: t("ancestral.digits.twoTitle"), icon: Heart },
    { digit: "4", count: result.starCounts.fours, title: t("ancestral.digits.fourTitle"), icon: Users },
    { digit: "8", count: result.starCounts.eights, title: t("ancestral.digits.eightTitle"), icon: Shield },
    { digit: "5", count: result.starCounts.fives, title: t("ancestral.digits.fiveTitle"), icon: Sparkles },
    { digit: "7", count: result.starCounts.sevens, title: t("ancestral.digits.sevenTitle"), icon: Star },
  ];

  const shownDigits = isPro ? digitInfo : digitInfo.slice(0, 2);

  const handleDownloadPDF = async () => {
    const sections = [];
    sections.push({
      title: t("ancestral.workingNumbers"),
      content: [
        `${t("ancestral.dateRow")}: ${formatBirthDateStr()}`,
        `№1: ${result.workingNumbers.first}`, `№2: ${result.workingNumbers.second}`,
        `№3: ${result.workingNumbers.third}`, `№4: ${result.workingNumbers.fourth}`,
      ],
      highlight: true,
    });
    if (result.roles.isKeeper) sections.push({ title: t("ancestral.roles.keeper"), content: t("ancestral.roles.keeperDesc") });
    if (result.roles.isHealer) sections.push({ title: t("ancestral.roles.healer"), content: t("ancestral.roles.healerDesc") });
    if (result.roles.isLastHope) sections.push({ title: t("ancestral.roles.lastHope"), content: t("ancestral.roles.lastHopeDesc") });
    if (result.roles.hasCurse) sections.push({ title: t("ancestral.roles.curse"), content: t("ancestral.roles.curseDesc") });
    digitInfo.forEach((info) => {
      sections.push({ title: `${t("ancestral.digit")} ${info.digit}: ${info.title} (×${info.count})`, content: getDigitInterpretation(info.digit, info.count) });
    });
    await generatePDF({
      title: t("ancestral.title"),
      subtitle: result.gender === 'female' ? t("ancestral.female") : t("ancestral.male"),
      birthDate: formatBirthDateForPDF(result.birthDate.day, result.birthDate.month, result.birthDate.year),
      name: name || undefined,
      sections,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("results.newCalculation")}
        </Button>
        <PDFDownloadButton onDownload={handleDownloadPDF} />
      </div>

      <div className="text-center space-y-2">
        <span className={cn(
          "inline-block px-3 py-1 rounded-full text-xs font-medium",
          isPro ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
        )}>
          {isPro ? "✦ Профессиональный разбор" : "Базовый разбор"}
        </span>
        <h2 className="text-2xl md:text-3xl font-display text-primary">{t("ancestral.title")}</h2>
        {name && <p className="text-lg text-foreground">{name}</p>}
        <p className="text-muted-foreground">{t("results.birthDate")}: {formatBirthDateStr()}</p>
        <p className="text-sm text-muted-foreground">
          {t("ancestral.gender")}: {result.gender === 'female' ? t("ancestral.female") : t("ancestral.male")}
        </p>
      </div>

      {/* Working Numbers */}
      <div className="gradient-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-display text-foreground mb-4 text-center">{t("ancestral.workingNumbers")}</h3>
        <div className="mb-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">{t("ancestral.dateRow")}:</p>
          <p className="font-mono text-lg text-foreground">
            {result.birthDate.day.toString().padStart(2, '0')}.{result.birthDate.month.toString().padStart(2, '0')}.{result.birthDate.year}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{t("ancestral.workingRow")}:</p>
          <div className="flex justify-center gap-4">
            {[
              { num: result.workingNumbers.first, label: "1" },
              { num: result.workingNumbers.second, label: "2" },
              { num: result.workingNumbers.third, label: "3" },
              { num: result.workingNumbers.fourth, label: "4" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{item.num}</span>
                </div>
                <span className="text-xs text-muted-foreground mt-1">№{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">{t("ancestral.allDigits")}: {result.allDigits}</p>
      </div>

      {/* Karmic Star */}
      <div className="gradient-card rounded-2xl p-6 border border-border">
        <h3 className="text-lg font-display text-foreground mb-4 text-center">{t("ancestral.karmicStar")}</h3>
        <KarmicStar counts={result.starCounts} />
      </div>

      {/* Roles */}
      {(result.roles.isKeeper || result.roles.isHealer || result.roles.isLastHope) && (
        <div className="gradient-card rounded-2xl p-6 border border-border bg-primary/5">
          <h3 className="text-lg font-display text-foreground mb-4 text-center flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            {t("ancestral.yourRole")}
          </h3>
          <div className="space-y-4">
            {result.roles.isKeeper && (
              <div className="p-5 rounded-xl bg-background border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-lg">{t("ancestral.roles.keeper")}</h4>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{t("ancestral.roles.keeperDesc")}</div>
              </div>
            )}
            {result.roles.isHealer && (
              <div className="p-5 rounded-xl bg-background border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-lg">{t("ancestral.roles.healer")}</h4>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{t("ancestral.roles.healerDesc")}</div>
              </div>
            )}
            {result.roles.isLastHope && (
              <div className="p-5 rounded-xl bg-background border border-primary/30">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-primary" />
                  <h4 className="font-display font-semibold text-foreground text-lg">{t("ancestral.roles.lastHope")}</h4>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{t("ancestral.roles.lastHopeDesc")}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curse */}
      {result.roles.hasCurse && (
        <div className="gradient-card rounded-2xl p-6 border border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h4 className="font-display font-semibold text-foreground text-lg">{t("ancestral.roles.curse")}</h4>
          </div>
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{t("ancestral.roles.curseDesc")}</div>
        </div>
      )}

      {/* Digit interpretations */}
      <div className="space-y-4">
        <h3 className="text-lg font-display text-foreground text-center">{t("ancestral.interpretationsTitle")}</h3>
        {shownDigits.map((info) => (
          <div key={info.digit} className="gradient-card rounded-2xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className={cn("w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0", info.count > 0 ? "bg-primary" : "bg-muted")}>
                <info.icon className={cn("w-7 h-7", info.count > 0 ? "text-primary-foreground" : "text-muted-foreground")} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-display font-semibold text-foreground text-lg">{t("ancestral.digit")} {info.digit}: {info.title}</h4>
                  <span className={cn("px-3 py-1 rounded-full text-sm font-medium", info.count > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>×{info.count}</span>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{getDigitInterpretation(info.digit, info.count)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== PRO CONTENT ===== */}
      {isPro && proData && (
        <div className="space-y-6">
          <ProSectionBlock icon={BookOpen} title="Введение в родовые программы" variant="highlight">
            <ProTextBlock text={proData.intro} className="mb-4" />
            <ProTextBlock text={proData.lineageOverview} />
          </ProSectionBlock>

          <ProSectionBlock icon={AlertTriangle} title="Кармический долг рода" variant="warning">
            <ProTextBlock text={proData.karmicDebt} />
          </ProSectionBlock>

          <ProSectionBlock icon={Heart} title="Путь исцеления">
            <ProTextBlock text={proData.healingPath} />
          </ProSectionBlock>

          <div className="grid md:grid-cols-2 gap-4">
            <ProSectionBlock icon={Sparkles} title="Родовые дары" variant="success">
              <ProListBlock items={proData.ancestralGifts} icon="★" />
            </ProSectionBlock>
            {proData.ancestralBlocks.length > 0 && (
              <ProSectionBlock icon={Shield} title="Родовые блоки" variant="warning">
                <ProListBlock items={proData.ancestralBlocks} icon="⚠" />
              </ProSectionBlock>
            )}
          </div>

          <ProSectionBlock icon={Target} title="Генерационные паттерны">
            <ProTextBlock text={proData.generationalPatterns} />
          </ProSectionBlock>

          <ProSectionBlock icon={Sparkles} title="🕯️ Ритуалы для работы с родом">
            <ProNumberedList items={proData.rituals} />
          </ProSectionBlock>

          <ProSectionBlock icon={CheckCircle} title="Рекомендации" variant="highlight">
            <h4 className="text-sm font-medium text-foreground mb-3">Что делать</h4>
            <ProNumberedList items={proData.recommendations} className="mb-6" />
            <h4 className="text-sm font-medium text-destructive mb-3">Чего избегать</h4>
            <ProListBlock items={proData.avoidList} icon="✗" />
          </ProSectionBlock>

          <ProSectionBlock icon={MessageCircle} title="Итог" variant="highlight">
            <ProTextBlock text={proData.conclusion} className="mb-4" />
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <p className="text-sm text-foreground font-medium italic">«{proData.keyThought}»</p>
            </div>
          </ProSectionBlock>
        </div>
      )}

      {!isPro && (
        <div className="bg-muted/30 rounded-xl border border-border p-5 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            В профессиональном разборе: все 5 цифр звезды, кармический долг рода, путь исцеления,
            родовые дары и блоки, ритуалы, генерационные паттерны и персональные рекомендации.
          </p>
        </div>
      )}
    </div>
  );
}
