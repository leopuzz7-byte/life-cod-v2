import { useTranslation } from "react-i18next";
import { KeytoNameResult, nameEnergy } from "@/lib/keytoName";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NadezhdaSignature } from "./NadezhdaSignature";

interface Props {
  result: KeytoNameResult;
  onReset: () => void;
}

export function KeyToNameResultComponent({ result, onReset }: Props) {
  const { t } = useTranslation();
  const { name, full, n } = result;
  const data = nameEnergy[n];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={onReset} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> {t("results.newCalculation")}
      </Button>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display text-primary mb-1">Энергия названия</h1>
        {name && <p className="text-lg text-foreground">{name}</p>}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto">
        Каждое слово, имя и название обладает своей уникальной энергией. От неё зависит общий фон и атмосфера проекта, а также направление его развития. Проверьте, что несёт выбранное название.
      </p>

      <div className="gradient-card rounded-2xl border border-border p-6 md:p-7">
        <div className="rounded-2xl bg-primary/5 border border-primary/15 p-5 mb-5 text-center">
          <div className="flex items-start justify-center gap-1.5">
            <span className="text-4xl md:text-5xl font-display font-bold text-primary leading-none">{n}</span>
            {full !== n && (
              <span className="text-[11px] text-muted-foreground leading-tight mt-1">из<br />{full}</span>
            )}
          </div>
        </div>
        {data?.sub && <p className="font-display font-semibold text-foreground mb-3">{data.sub}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{data?.desc}</p>
      </div>

      <NadezhdaSignature />
    </div>
  );
}
