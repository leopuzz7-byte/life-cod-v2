import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-5">
        {/* Десктоп — одна строка */}
        <div className="hidden md:flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© {year} Life COD — Ковалева Серина Надежда Владимировна. {t("footer.rights")}</span>

          <div className="flex items-center gap-4">
            <a
              href="/oferta-life-cod.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" />
              {t("footer.offer")}
            </a>
            <span className="text-border">|</span>
            <a
              href="/privacy-policy.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" />
              {t("footer.privacy")}
            </a>
          </div>
        </div>

        {/* Мобилка — две строки */}
        <div className="md:hidden flex flex-col items-center gap-3 text-xs text-muted-foreground text-center">
          <div className="flex items-center gap-4">
            <a
              href="/oferta-life-cod.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" />
              {t("footer.offerShort")}
            </a>
            <span className="text-border">|</span>
            <a
              href="/privacy-policy.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" />
              {t("footer.privacy")}
            </a>
          </div>
          <span>© {year} Life COD — Ковалёва Серина Надежда Владимировна</span>
        </div>
      </div>
    </footer>
  );
}
