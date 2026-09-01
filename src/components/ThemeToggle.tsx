import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "icon" | "menu";
}

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const actionLabel = isDark ? t("theme.enableLight") : t("theme.enableDark");

  if (variant === "menu") {
    return (
      <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-[#0F2044]/20 dark:border-[#D5A95B]/40 bg-white/30 dark:bg-[#071326]/60">
        <div className="flex items-center gap-3 min-w-0">
          {isDark ? <Moon className="w-4 h-4 text-[#D5A95B]" /> : <Sun className="w-4 h-4 text-[#0F2044]" />}
          <div>
            <p className="text-sm font-medium text-[#0F2044] dark:text-[#F3DFC0]">{t("theme.appearance")}</p>
            <p className="text-xs text-[#0F2044]/60 dark:text-[#D8C7AE]/70">{isDark ? t("theme.dark") : t("theme.light")}</p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={actionLabel}
          onClick={toggleTheme}
          className={cn(
            "relative w-12 h-7 rounded-full border transition-colors duration-300 flex-shrink-0",
            isDark ? "bg-[#D5A95B] border-[#E6C77E]" : "bg-[#0F2044]/12 border-[#0F2044]/35"
          )}
        >
          <span className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full shadow-sm transition-transform duration-300",
            isDark ? "translate-x-[24px] bg-[#071326]" : "translate-x-0.5 bg-white"
          )} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full flex items-center justify-center border border-[#0F2044] text-[#0F2044] hover:bg-[#0F2044]/10 transition-all duration-200 active:scale-95 dark:border-[#D5A95B]/70 dark:text-[#E7C779] dark:hover:bg-[#D5A95B]/10"
      aria-label={actionLabel}
      title={actionLabel}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
