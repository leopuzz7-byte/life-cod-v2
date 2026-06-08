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
  const [menuClosing, setMenuClosing] = useState(false);

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 220);
  };

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-10 bg-transparent">
      <div className="glass-brown rounded-3xl sm:rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(10,3,0,0.38)]">
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
                "text-sm font-semibold relative py-1 transition-all duration-200 hover:scale-[1.04]",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-transform after:duration-200 after:origin-center",
                location.pathname === item.path
                  ? "text-[#0F2044] after:bg-[#0F2044]/50 after:scale-x-100"
                  : "text-[#0F2044]/80 hover:text-[#0F2044] after:bg-[#0F2044]/35 after:scale-x-0 hover:after:scale-x-100"
              )}
            >
              {item.label}
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
                  ? "bg-[#0F2044] text-white border-[#0F2044]"
                  : "bg-transparent hover:bg-[#0F2044]/8 text-[#0F2044] border-[#0F2044]"
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
                ? "bg-[#0F2044] text-white border-[#0F2044]"
                : "bg-transparent hover:bg-[#0F2044]/8 text-[#0F2044] border-[#0F2044]"
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
                    ? "bg-[#0F2044] text-white border-[#0F2044]"
                    : "bg-transparent hover:bg-[#0F2044]/8 text-[#0F2044] border-[#0F2044]"
                )}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.profile")}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="h-10 px-4 rounded-full flex items-center gap-2 transition-colors border bg-transparent hover:bg-[#0F2044]/8 text-[#0F2044] border-[#0F2044] text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("nav.login")}</span>
              </Link>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-[#0F2044] text-[#0F2044] transition-all active:scale-95"
          onClick={() => setMenuOpen(true)}
          aria-label="Меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" onClick={closeMenu}>
          <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-[220ms] ${menuClosing ? 'opacity-0' : 'opacity-100'}`} />
          <div
            className={`absolute top-0 right-0 h-full w-72 flex flex-col glass-brown shadow-2xl ${menuClosing ? 'animate-slide-right-out' : 'animate-slide-right'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#0F2044]/15">
              <img src={logo} alt="logo" className="h-9 w-auto" />
              <button onClick={closeMenu} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#0F2044]/40 text-[#0F2044] transition-all active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex flex-col px-4 pt-3 pb-1 gap-0.5">
              {baseNavItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={closeMenu}
                  className={cn("px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-[#0F2044]/10 text-[#0F2044]"
                      : "text-[#0F2044]/80 hover:text-[#0F2044] hover:bg-[#0F2044]/5"
                  )}
                >{item.label}</Link>
              ))}
            </nav>
            <div className="mx-4 my-2 border-t border-[#0F2044]/15" />
            <div className="flex flex-col px-4 gap-2">
              {user && (
                <Link to="/my-analyses" onClick={closeMenu}
                  className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
                    isMyAnalysesActive ? "bg-[#0F2044] text-white border-[#0F2044]" : "border-[#0F2044] text-[#0F2044]"
                  )}
                ><FolderClock className="w-4 h-4" />{t("nav.myAnalyses")}</Link>
              )}
              {!loading && (user ? (
                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F2044] text-white text-sm font-medium">
                  <User className="w-4 h-4" />{t("nav.profile")}
                </Link>
              ) : (
                <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F2044] text-white text-sm font-medium">
                  <LogIn className="w-4 h-4" />{t("nav.login")}
                </Link>
              ))}
            </div>
            <div className="mx-4 my-2 border-t border-[#0F2044]/15" />
            <div className="flex items-center gap-4 px-5 py-3">
              <LanguageSelector variant="default" />
              <Link to="/support" onClick={closeMenu} className="flex items-center gap-2 text-sm text-[#0F2044]/60 hover:text-[#0F2044] transition-colors">
                <HelpCircle className="w-4 h-4" />{t("nav.support")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
