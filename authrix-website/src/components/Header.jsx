import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Header({ variant = "landing", breadcrumb }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = variant === "landing";
  const headerClass =
    isLanding && !scrolled && !isMenuOpen
      ? "fixed top-0 w-full z-50 transition-all duration-300 bg-transparent py-2"
      : isLanding
        ? "fixed top-0 w-full z-50 transition-all duration-300 bg-background/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 dark:border-white/5 py-2 supports-[backdrop-filter]:bg-background/60"
        : "sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border py-2";

  return (
    <nav className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-tr from-primary/20 to-violet-500/20 group-hover:from-primary/30 group-hover:to-violet-500/30 transition-all duration-300 border border-white/10">
              <Sparkles className="w-4 h-4 text-primary transition-transform group-hover:scale-110 duration-300" />
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 group-hover:to-primary transition-all duration-300">
              Authrix
            </span>
          </Link>
          {breadcrumb && (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="text-muted-foreground hidden sm:block font-medium">
                {breadcrumb}
              </span>
            </>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/#features", text: "Features" },
            { href: "/pricing", text: "Pricing" },
            { href: "/docs", text: "Documentation" },
          ].map((item, i) => {
            const isActive = location.pathname === item.href;
            return item.href.startsWith("/#") ? (
              <a
                key={i}
                href={item.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item.text}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
              </a>
            ) : (
              <Link
                key={i}
                to={item.href}
                className={`px-4 py-2 text-sm transition-colors relative group ${isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.text}
                <span
                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300 ${isActive ? "w-1/2" : "w-0 group-hover:w-1/2 opacity-0 group-hover:opacity-100"}`}
                ></span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="relative group px-3 sm:px-5 py-2 sm:py-2.5 overflow-hidden rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-all duration-300 flex-shrink-0"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1 sm:gap-2">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-64px)] bg-background/95 backdrop-blur-2xl border-t border-border p-4 animate-in slide-in-from-top-4 overflow-y-auto">
          <div className="flex flex-col h-full">
            <div className="space-y-1 flex-1">
              {[
                { href: "/#features", text: "Features" },
                { href: "/pricing", text: "Pricing" },
                { href: "/docs", text: "Documentation" },
              ].map((item, i) =>
                item.href.startsWith("/#") ? (
                  <a
                    key={i}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all"
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link
                    key={i}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all"
                  >
                    {item.text}
                  </Link>
                ),
              )}
            </div>
            <div className="pt-6 mt-4 border-t border-border flex flex-col gap-3 pb-8">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3.5 text-center text-base font-medium text-muted-foreground hover:text-foreground bg-secondary/30 rounded-xl border border-border/50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3.5 text-center text-base font-bold text-white bg-primary rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
