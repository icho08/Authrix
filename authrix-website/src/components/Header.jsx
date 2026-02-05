import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Menu,
  X,
  ArrowRight,
  Sun,
  Moon,
  ChevronRight,
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
      ? "fixed top-0 w-full z-50 transition-all duration-300 bg-transparent"
      : isLanding
        ? "fixed top-0 w-full z-50 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border"
        : "sticky top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border";

  return (
    <nav className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 blur-lg rounded-full group-hover:bg-primary/80 transition-all duration-500"></div>
              <div className="relative w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-br from-primary to-violet-600 rounded-xl flex items-center justify-center border border-white/20 shadow-xl">
                <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 hidden xs:block">
              Authrix
            </span>
          </Link>
          {breadcrumb && (
            <>
              <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
              <span className="text-muted-foreground hidden sm:block">
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

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
            ) : (
              <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
            )}
          </button>

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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1 sm:gap-2">
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground flex-shrink-0"
          >
            {isMenuOpen ? (
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
            ) : (
              <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-[calc(100vh-64px)] bg-background border-t border-border p-4 animate-in slide-in-from-top-4 overflow-y-auto shadow-xl">
          <div className="flex flex-col h-full">
            <div className="space-y-2 flex-1">
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
                    className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/50"
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link
                    key={i}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border border-transparent hover:border-border/50"
                  >
                    {item.text}
                  </Link>
                ),
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-border flex flex-col gap-3 pb-8">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/50 rounded-lg border border-border"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-center text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/20"
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
