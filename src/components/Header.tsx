import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import { LanguageSelector } from "./LanguageSelector";

export function Header() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { label: t("nav.analyses"), path: "/" },
    { label: t("nav.calendar"), path: "/calendar" },
    { label: t("crisis.title"), path: "/crisis" },
    { label: t("nav.products"), path: "/products" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-brown border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Life C⚙D" className="h-10 w-auto brightness-0 invert" />
          <span className="font-display font-bold text-lg text-white tracking-tight">Life C⚙D</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
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

        {/* Language & Support */}
        <div className="flex items-center gap-2">
          <LanguageSelector variant="header" />
          <Link
            to="/support"
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors border",
              location.pathname === "/support"
                ? "bg-white/20 text-white border-white/30"
                : "bg-white/10 hover:bg-white/20 text-white/80 border-white/20"
            )}
          >
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-start gap-1 pb-2 pt-1 px-3 border-t border-white/10 overflow-x-auto scrollbar-hide">
        {navItems.map((item) => (
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
    </header>
  );
}
