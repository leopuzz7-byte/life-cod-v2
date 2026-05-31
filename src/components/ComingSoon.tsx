import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  const { t } = useTranslation();
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="gradient-card rounded-2xl p-8 sm:p-12 border border-border text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {t("comingSoon.soon")}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-full text-xs text-muted-foreground">
          {t("comingSoon.inDevelopment")}
        </div>
      </div>
    </div>
  );
}
