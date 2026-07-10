import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const linkClass = "flex items-center gap-1 text-white/80 hover:text-white transition-colors duration-200 hover:underline underline-offset-2";

  return (
    <footer className="w-full border-t border-white/15 bg-[#0F2044]/22 backdrop-blur-lg mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-5">
        {/* Десктоп */}
        <div className="hidden md:flex items-center justify-between gap-4 text-xs text-white/75">
          <span>© {year} Life COD — Ковалева Серина Надежда Владимировна. {t("footer.rights")}</span>
          <div className="flex items-center gap-4">
            <a href="/oferta-life-cod.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.offer")}
            </a>
            <span className="text-white/30">|</span>
            <a href="/privacy-policy.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.privacy")}
            </a>
          </div>
        </div>

        {/* Мобилка */}
        <div className="md:hidden flex flex-col items-center gap-3 text-xs text-white/75 text-center">
          <div className="flex items-center gap-4">
            <a href="/oferta-life-cod.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.offerShort")}
            </a>
            <span className="text-white/30">|</span>
            <a href="/privacy-policy.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
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
