import { Shield, ArrowRight, Check, X } from "lucide-react"
import { Header } from "./LandingPage"
// Pricing Card Component
function PricingCard({ plan, price, apps, features, popular, buttonText }) {
  return (
    <div
      className={`relative bg-card border rounded-2xl p-8 flex flex-col ${popular ? "border-foreground shadow-xl scale-105" : "border-border"}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-4 py-1.5 rounded-full">
          Most Popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">{plan}</h3>
        <div className="flex items-baseline gap-1">
          {price === 0 ? (
            <span className="text-4xl font-bold text-foreground">Free</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-foreground">${price}</span>
              <span className="text-muted-foreground">/month</span>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Up to {apps} {apps === 1 ? "app" : "apps"}
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground/60"}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <a
        href="/register"
        className={`w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          popular
            ? "bg-foreground text-background hover:bg-foreground/90"
            : "border border-border hover:border-foreground/20 text-foreground bg-background"
        }`}
      >
        {buttonText}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
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
            <a href="#" className="hover:text-foreground transition-colors">
              Docs
            </a>
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
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

export default function PricingPage() {
  const plans = [
    {
      plan: "Free",
      price: 0,
      apps: 1,
      popular: false,
      buttonText: "Get Started Free",
      features: [
        { text: "1 app", included: true },
        { text: "Up to 1,000 users", included: true },
        { text: "Basic login options", included: true },
        { text: "Email support", included: true },
        { text: "Custom branding", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      plan: "Starter",
      price: 3,
      apps: 2,
      popular: false,
      buttonText: "Start with Starter",
      features: [
        { text: "2 apps", included: true },
        { text: "Up to 5,000 users", included: true },
        { text: "All login options", included: true },
        { text: "Email support", included: true },
        { text: "Custom branding", included: true },
        { text: "Priority support", included: false },
      ],
    },
    {
      plan: "Pro",
      price: 5,
      apps: 5,
      popular: true,
      buttonText: "Start with Pro",
      features: [
        { text: "5 apps", included: true },
        { text: "Up to 25,000 users", included: true },
        { text: "All login options", included: true },
        { text: "Priority email support", included: true },
        { text: "Custom branding", included: true },
        { text: "Analytics dashboard", included: true },
      ],
    },
    {
      plan: "Business",
      price: 20,
      apps: 20,
      popular: false,
      buttonText: "Start with Business",
      features: [
        { text: "20 apps", included: true },
        { text: "Unlimited users", included: true },
        { text: "All login options", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Custom branding", included: true },
        { text: "Advanced analytics", included: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Pricing</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-5 tracking-tight">
              Simple pricing for everyone
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick a plan that works for you. Start free and upgrade as you grow.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 items-start">
              {plans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-foreground mb-12 text-center">Common Questions</h2>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-2">Can I switch plans later?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan anytime. Changes take effect right away.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-2">What counts as an app?</h3>
                <p className="text-sm text-muted-foreground">
                  Each website or mobile app you add to Authrix counts as one app. Each app gets its own users and
                  settings.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-2">Is there a free trial?</h3>
                <p className="text-sm text-muted-foreground">
                  The Free plan is free forever. No credit card needed. Just sign up and start building.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-foreground mb-2">What if I need more than 20 apps?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact us for a custom Enterprise plan. We can set up special pricing for larger teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-background">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold text-foreground mb-4 tracking-tight">Ready to get started?</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Start with our free plan. No credit card needed.
            </p>
            <a
              href="/register"
              className="inline-flex bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-lg text-sm font-medium transition-all items-center gap-2"
            >
              <span>Start Free Today</span>
              <ArrowRight className="w-4 h-4" />
        </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
