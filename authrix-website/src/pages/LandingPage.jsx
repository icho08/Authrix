"use client"
import { Shield, ArrowRight, Play, Check, Lock, Users, Zap, Code, Smartphone, Github } from "lucide-react"

// Header Component
export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <a className="text-xl font-semibold text-foreground tracking-tight">Authrix</a>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

function HeroWithDashboard() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Hero content */}
          <div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground text-xs font-medium mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
              Now in Beta — Free for everyone
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-5 leading-tight tracking-tight text-balance">
              Add login to your app
              <span className="block text-muted-foreground">in minutes, not weeks</span>
            </h1>

            <p className="text-base lg:text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg">
              We handle user sign up, sign in, and security — so you can focus on building your app.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href="/register"
                className="bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button className="border border-border hover:border-foreground/20 text-foreground px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-background">
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>5 min setup</span>
              </div>
            </div>
          </div>

          {/* Right side - Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10"></div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background border border-border rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono max-w-xs mx-auto text-center">
                    Dashboard - Authrix
                  </div>
                </div>
              </div>

              {/* Static dashboard image */}
              <div className="min-h-[320px] lg:min-h-[380px] bg-muted/20">
                <img src="/dashboard.png" alt="Authrix Dashboard Preview" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Stats Section


// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Lock,
      title: "Full Login System",
      description: "Sign up, sign in, forgot password, email check, and two-factor auth — all ready to use.",
    },
    {
      icon: Users,
      title: "Multiple Apps Support",
      description: "Keep users separate for each app with their own API keys. Great for SaaS products.",
    },
    {
      icon: Zap,
      title: "Super Fast",
      description: "Works from servers around the world. Your users get quick responses everywhere.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "We protect user data with secure tokens, block attacks, and follow strict security rules.",
    },
    {
      icon: Code,
      title: "Easy to Use",
      description: "Simple React tools, clear guides, and automatic updates when users log in or out.",
    },
    {
      icon: Smartphone,
      title: "Works on All Devices",
      description: "Users can log in from phone, tablet, or computer. You can see all their sessions.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
            Everything you need for user login
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful tools that grow with your app — from small projects to big companies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className="group bg-card border border-border rounded-xl p-6 hover:border-foreground/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <IconComponent className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Create Account",
      description: "Sign up for free and confirm your email. It takes less than a minute.",
      icon: Users,
    },
    {
      step: "02",
      title: "Set Up Your App",
      description: "Add your app details and get your secret keys from the dashboard.",
      icon: Code,
    },
    {
      step: "03",
      title: "Add to Your Code",
      description: "Copy our code into your app and start letting users log in right away.",
      icon: Zap,
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">How it Works</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
            Get started in 3 easy steps
          </h2>
          <p className="text-muted-foreground">From zero to working login in just a few minutes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-xl p-8 h-full">
                  <div className="text-xs font-mono text-muted-foreground mb-4">{item.step}</div>
                  <div className="w-12 h-12 bg-foreground rounded-xl flex items-center justify-center mb-5">
                    <IconComponent className="w-6 h-6 text-background" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border"></div>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Code Example Section
function CodeExample() {
  const codeString = `import { useAuth } from 'authrix-sdk';

function App() {
  const { login, user, loading } = useAuth();
  
  if (loading) return <Spinner />;
  
  return user ? (
    <Dashboard user={user} />
  ) : (
    <LoginButton onClick={login} />
  );
}`

  return (
    <section className="py-24 bg-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium text-background/60 uppercase tracking-wider mb-3">For Developers</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-background mb-6 tracking-tight">
              Simple code.
              <span className="block text-background/60">Big results.</span>
            </h2>
            <p className="text-background/70 mb-8 leading-relaxed">
              Add login to your app with just a few lines of code. We handle the hard stuff — you build your product.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-background/60">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Works with TypeScript
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Easy React hooks
              </div>
              <div className="flex items-center gap-2 text-sm text-background/60">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Auto login refresh
              </div>
            </div>
          </div>

          <div className="bg-background/5 backdrop-blur rounded-xl border border-background/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-background/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
              </div>
              <span className="text-xs text-background/50 font-mono ml-2">App.jsx</span>
            </div>
            <pre className="p-6 text-sm leading-relaxed overflow-x-auto font-mono">
              <code className="text-emerald-400">{codeString}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of developers who use Authrix for login. It's free and takes just 5 minutes.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href="/register"
            className="bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free Today</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/icho08/Authsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border hover:border-foreground/20 text-foreground px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 bg-background"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-border py-12 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <span className="text-sm font-medium text-foreground">Authrix</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <a href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="/blogs" className="hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="/support" className="hover:text-foreground transition-colors">
              Support
            </a>
            <a href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </a>
          </div>

          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Authrix. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroWithDashboard />
        {/* <StatsSection /> */}
        <FeaturesSection />
        <HowItWorks />
        <CodeExample />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
