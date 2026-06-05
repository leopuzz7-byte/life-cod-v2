import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { HelpCircle, LogIn, User, FolderClock, Menu, X } from "lucide-react";
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

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full pt-2 sm:pt-3 px-0 sm:px-10 bg-transparent">
      <div className="glass-brown rounded-b-3xl sm:rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(10,3,0,0.38)]">
      <div className="container mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src={logo}
            alt={t("common.imgAlt")}
            className="h-[52px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {baseNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors relative py-1",
                location.pathname === item.path
                  ? "text-[hsl(14,100%,4%)]"
                  : "text-[hsl(14,100%,4%)]/60 hover:text-[hsl(14,100%,4%)]"
              )}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[hsl(14,100%,4%)]/40 rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {user && (
            <Link
              to="/my-analyses"
              className={cn(
                "h-10 px-3 sm:px-4 rounded-full flex items-center gap-1.5 transition-colors border text-sm font-medium",
                isMyAnalysesActive
                  ? "bg-[hsl(14,100%,4%)] text-white border-[hsl(14,100%,4%)]"
                  : "bg-transparent hover:bg-[hsl(14,100%,4%)]/8 text-[hsl(14,100%,4%)] border-[hsl(14,100%,4%)]"
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
                ? "bg-[hsl(14,100%,4%)] text-white border-[hsl(14,100%,4%)]"
                : "bg-transparent hover:bg-[hsl(14,100%,4%)]/8 text-[hsl(14,100%,4%)] border-[hsl(14,100%,4%)]"
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
                    ? "bg-[hsl(14,100%,4%)] text-white border-[hsl(14,100%,4%)]"
                    : "bg-transparent hover:bg-[hsl(14,100%,4%)]/8 text-[hsl(14,100%,4%)] border-[hsl(14,100%,4%)]"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.profile")}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-10 px-4 rounded-full flex items-center gap-2 transition-colors border bg-transparent hover:bg-[hsl(14,100%,4%)]/8 text-[hsl(14,100%,4%)] border-[hsl(14,100%,4%)] text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav.login")}</span>
              </Link>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[hsl(14,100%,4%)] text-[hsl(14,100%,4%)] transition-all active:scale-95"
          onClick={() => setMenuOpen(true)}
          aria-label="Меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 h-full w-72 flex flex-col glass-brown shadow-2xl animate-slide-right"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(14,100%,4%)]/15">
              <img src={logo} alt="logo" className="h-9 w-auto" />
              <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full border border-[hsl(14,100%,4%)]/40 text-[hsl(14,100%,4%)] transition-all active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex flex-col px-4 pt-3 pb-1 gap-0.5">
              {baseNavItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                  className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-[hsl(14,100%,4%)]/10 text-[hsl(14,100%,4%)]"
                      : "text-[hsl(14,100%,4%)]/60 hover:text-[hsl(14,100%,4%)] hover:bg-[hsl(14,100%,4%)]/5"
                  )}
                >{item.label}</Link>
              ))}
            </nav>
            <div className="mx-4 my-2 border-t border-[hsl(14,100%,4%)]/15" />
            <div className="flex flex-col px-4 gap-2">
              {user && (
                <Link to="/my-analyses" onClick={() => setMenuOpen(false)}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
                    isMyAnalysesActive ? "bg-[hsl(14,100%,4%)] text-white border-[hsl(14,100%,4%)]" : "border-[hsl(14,100%,4%)] text-[hsl(14,100%,4%)]"
                  )}
                ><FolderClock className="w-4 h-4" />{t("nav.myAnalyses")}</Link>
              )}
              {!loading && (user ? (
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(14,100%,4%)] text-white text-sm font-medium">
                  <User className="w-4 h-4" />{t("nav.profile")}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[hsl(14,100%,4%)] text-white text-sm font-medium">
                  <LogIn className="w-4 h-4" />{t("nav.login")}
                </Link>
              ))}
            </div>
            <div className="mx-4 my-2 border-t border-[hsl(14,100%,4%)]/15" />
            <div className="flex items-center gap-4 px-5 py-3">
              <LanguageSelector variant="default" />
              <Link to="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm text-[hsl(14,100%,4%)]/60 hover:text-[hsl(14,100%,4%)] transition-colors">
                <HelpCircle className="w-4 h-4" />{t("nav.support")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
