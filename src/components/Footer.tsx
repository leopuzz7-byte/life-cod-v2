import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const linkClass = "flex items-center gap-1 text-[#0F2044]/55 hover:text-[#0F2044] transition-colors duration-200 hover:underline underline-offset-2";

  return (
    <footer className="w-full border-t border-white/20 bg-background/20 backdrop-blur-lg mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-5">
        {/* Десктоп */}
        <div className="hidden md:flex items-center justify-between gap-4 text-xs text-[#0F2044]/50">
          <span>© {year} Life COD — Ковалева Серина Надежда Владимировна. {t("footer.rights")}</span>
          <div className="flex items-center gap-4">
            <a href="/oferta-life-cod.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.offer")}
            </a>
            <span className="text-[#0F2044]/20">|</span>
            <a href="/privacy-policy.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.privacy")}
            </a>
          </div>
        </div>

        {/* Мобилка */}
        <div className="md:hidden flex flex-col items-center gap-3 text-xs text-[#0F2044]/50 text-center">
          <div className="flex items-center gap-4">
            <a href="/oferta-life-cod.pdf" download target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Download className="w-3 h-3" />
              {t("footer.offerShort")}
            </a>
            <span className="text-[#0F2044]/20">|</span>
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
