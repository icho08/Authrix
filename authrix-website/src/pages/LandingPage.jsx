import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Code,
  Lock,
  Zap,
  Shield,
  Users,
  Github,
  Terminal,
  Menu,
  X,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Activity,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Header from "../components/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans overflow-x-hidden transition-colors duration-300">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative z-10 pt-24 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-24 md:pb-28 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">
            <div className="flex-1 w-full text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-muted/50 border border-border mb-6 sm:mb-8 animate-fade-in-up text-xs sm:text-sm">
                <span className="flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0"></span>
                <span className="font-medium text-muted-foreground">
                  v2.0 is now live
                </span>
                <div className="w-px h-3 bg-border mx-1"></div>
                <Link
                  to="/changelog"
                  className="font-medium text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer flex-shrink-0"
                >
                  Read stats <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight lg:leading-[1.1]">
                <span className="block text-foreground">Authentication</span>
                <span className="block bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent pb-2">
                  reimagined.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Add secure, scalable, and customizable authentication to your
                React applications in minutes. Focus on your product, we handle
                the rest.
              </p>

              <div className="flex flex-col xs:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/register"
                  className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(0,217,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(0,217,255,0.6)] flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  Start Building Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform hidden sm:inline" />
                </Link>
                <Link
                  to="/docs"
                  className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-muted/50 text-foreground font-medium rounded-xl border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Terminal className="w-4 h-4 text-muted-foreground" />
                  <span className="hidden sm:inline">Documentation</span>
                  <span className="sm:hidden">Docs</span>
                </Link>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-row xs:flex-row items-center justify-center lg:justify-start gap-4 xs:gap-6 sm:gap-8 text-muted-foreground text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Free Forever</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-xl lg:max-w-none hidden sm:block">
              <div className="relative rounded-xl sm:rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                <div className="p-3 sm:p-4 border-b border-border flex items-center gap-2 sm:gap-3 bg-muted/30">
                  <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono px-2 sm:px-3 py-1 bg-background/50 rounded-md border border-border flex-1 text-center min-w-0">
                    useAuth.tsx
                  </div>
                </div>

                <div className="p-3 sm:p-6 md:p-8 font-mono text-xs sm:text-sm overflow-x-auto">
                  <div className="space-y-4">
                    <div className="flex">
                      <span className="text-violet-400 w-8">1</span>
                      <span className="text-pink-400">import</span>
                      <span className="text-foreground mx-2">{`{`}</span>
                      <span className="text-yellow-300">useAuth</span>
                      <span className="text-foreground mx-2">{`}`}</span>
                      <span className="text-pink-400">from</span>
                      <span className="text-green-400 ml-2">
                        {"'authrix-sdk'"}
                      </span>
                      <span className="text-muted-foreground">;</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">2</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">3</span>
                      <span className="text-pink-400">export</span>
                      <span className="text-blue-400 ml-2">default</span>
                      <span className="text-pink-400 ml-2">function</span>
                      <span className="text-yellow-300 ml-2">App</span>
                      <span className="text-foreground">() {`{`}</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">4</span>
                      <span className="text-foreground ml-4">const {`{`}</span>
                      <span className="text-blue-300 ml-2">user</span>
                      <span className="text-foreground">,</span>
                      <span className="text-blue-300 ml-2">login</span>
                      <span className="text-foreground ml-2">{`}`} = </span>
                      <span className="text-yellow-300 ml-2">useAuth</span>
                      <span className="text-foreground">()</span>
                      <span className="text-muted-foreground">;</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">5</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">6</span>
                      <span className="text-pink-400 ml-4">if</span>
                      <span className="text-foreground ml-2">(</span>
                      <span className="text-blue-300">user</span>
                      <span className="text-foreground">) {`{`}</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">7</span>
                      <span className="text-pink-400 ml-8">return</span>
                      <span className="text-green-400 ml-2">
                        &lt;Dashboard /&gt;
                      </span>
                      <span className="text-muted-foreground">;</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">8</span>
                      <span className="text-foreground ml-4">{`}`}</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">9</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">10</span>
                      <span className="text-pink-400 ml-4">return</span>
                      <span className="text-foreground ml-2">(</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">11</span>
                      <span className="text-green-400 ml-8">&lt;Button</span>
                      <span className="text-yellow-300 ml-2">onClick</span>
                      <span className="text-foreground">=</span>
                      <span className="text-blue-400">{`{`}</span>
                      <span className="text-blue-300">login</span>
                      <span className="text-blue-400">{`}`}</span>
                      <span className="text-green-400">&gt;</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">12</span>
                      <span className="text-foreground ml-12">Sign In</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">13</span>
                      <span className="text-green-400 ml-8">
                        &lt;/Button&gt;
                      </span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">14</span>
                      <span className="text-foreground ml-4">)</span>
                      <span className="text-muted-foreground">;</span>
                    </div>

                    <div className="flex">
                      <span className="text-violet-400 w-8">15</span>
                      <span className="text-foreground">{`}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        id="features"
        className="relative z-10 py-16 sm:py-20 md:py-24 bg-muted/20 border-y border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Core Engine Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
              Built directly from our high-performance SDK and Server
              architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: RefreshCw,
                title: "Auto Token Refresh",
                description:
                  "SDK automatically handles token rotation and retries with built-in interceptors.",
              },
              {
                icon: Activity,
                title: "Rate Limiting",
                description:
                  "Server-side middleware protects your API with intelligent rate limiting and request tracking.",
              },
              {
                icon: Globe,
                title: "Dynamic CORS",
                description:
                  "Securely manage Cross-Origin Resource Sharing with dynamic origin validation middleware.",
              },
              {
                icon: Code,
                title: "Type-Safe Hooks",
                description:
                  "Complete TypeScript definitions for useAuth, login, register, and all SDK methods.",
              },
              {
                icon: Lock,
                title: "Secure Storage",
                description:
                  "HttpOnly cookies and secure token storage mechanisms implemented by default.",
              },
              {
                icon: Terminal,
                title: "Advanced Logging",
                description:
                  "Configurable logging system for debugging authentication flows and errors.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-muted flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary group-hover:text-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to ship authentication?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
            Join developers building secure, scalable apps with Authrix
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_40px_-10px_rgba(0,217,255,0.5)] text-sm sm:text-base"
            >
              Get Started <ArrowRight className="inline ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 sm:py-10 md:py-12 px-4 sm:px-6 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 sm:w-8 h-7 sm:h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg text-foreground">
              Authrix
            </span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            © 2026 Authrix Inc. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6">
            <Link
              to="/changelog"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              Changelog
            </Link>
            <a
              href="https://github.com/icho08/Authsystem"
              className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
