import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { HelpCircle, LogIn, User, FolderClock } from "lucide-react";
import logo from "@/assets/logo.png";
import { LanguageSelector } from "./LanguageSelector";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, loading } = useAuth();

  const baseNavItems = [
    { label: t("nav.analyses"), path: "/" },
    { label: t("nav.calendar"), path: "/calendar" },
    { label: t("crisis.title"), path: "/crisis" },
    { label: t("nav.products"), path: "/products" },
  ];

  const isMyAnalysesActive = location.pathname.startsWith("/my-analyses");

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-5 bg-transparent">
      <div className="glass-brown rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(10,3,0,0.38)]">
      <div className="container mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt={t("common.imgAlt")}
            className="h-[52px] w-auto object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {baseNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors relative py-1",
                location.pathname === item.path
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              )}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side: My Analyses, language, support, auth */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {user && (
            <Link
              to="/my-analyses"
              className={cn(
                "h-10 px-3 sm:px-4 rounded-full flex items-center gap-1.5 transition-colors border text-sm font-medium",
                isMyAnalysesActive
                  ? "bg-white text-primary border-white"
                  : "bg-white/15 hover:bg-white/25 text-white border-white/25"
              )}
              aria-label={t("nav.myAnalyses")}
            >
              <FolderClock className="w-4 h-4" />
              <span className="hidden sm:inline">{t("nav.myAnalyses")}</span>
            </Link>
          )}

          <LanguageSelector variant="header" />

          <Link
            to="/support"
            className={cn(
              "w-10 h-10 rounded-full hidden sm:flex items-center justify-center transition-colors border",
              location.pathname === "/support"
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/10 hover:bg-white/20 text-white/80 border-white/20"
            )}
            aria-label={t("nav.support")}
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {!loading && (
            user ? (
              <Link
                to="/profile"
                className={cn(
                  "h-10 px-3 sm:px-4 rounded-full flex items-center gap-2 transition-colors border text-sm font-medium",
                  location.pathname === "/profile"
                    ? "bg-white/20 text-white border-white/30"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.profile")}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-10 px-4 rounded-full flex items-center gap-2 transition-colors border bg-white/10 hover:bg-white/20 text-white border-white/20 text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav.login")}</span>
              </Link>
            )
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="md:hidden flex items-center justify-start gap-1 pb-2 pt-1 px-3 border-t border-white/10 overflow-x-auto scrollbar-hide">
        {baseNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "text-[11px] font-medium transition-colors whitespace-nowrap px-2.5 py-1.5 rounded-full flex-shrink-0",
              location.pathname === item.path
                ? "text-white bg-white/15"
                : "text-white/70"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      </div>
    </header>
  );
}
