"use client"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const pricingPlans = [
  {
    name: "Completely Free",
    description: "Perfect for getting started and development",
    price: "Free",
    features: [
      "Up to 10,000 monthly active users",
      "Basic authentication methods",
      "Community support",
      "Basic analytics and logs",
      "Single application",
      "Email and password auth",
    ],
  },
  {
    name: "Self-Hosted",
    description: "For advanced users who want full control",
    price: "Infrastructure Costs",
    features: [
      "Unlimited users",
      "Full source code access",
      "Complete customization",
      "Deploy anywhere",
      "No usage limits",
      "Dedicated infrastructure",
      "Priority support available",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors duration-300">
              Transparent Pricing
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Pricing That Scales With You
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Start free. Pay only for infrastructure if you self-host. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className="p-8 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                  <div className="mb-8">
                    <p className="text-4xl font-bold text-foreground">{plan.price}</p>
                  </div>
                  <Button className="w-full mb-8 hover:shadow-lg transition-all duration-300">Get Started</Button>
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I upgrade later?",
                  a: "Yes, you can upgrade to self-hosted at any time. Your data and configurations will be preserved.",
                },
                {
                  q: "What about support?",
                  a: "Free tier users get community support. Self-hosted users can purchase dedicated support plans.",
                },
                {
                  q: "Is there a trial period?",
                  a: "The free tier is our trial. There's no time limit - use it as long as you need.",
                },
                {
                  q: "Can I export my data?",
                  a: "Yes, complete data export is available on both free and self-hosted tiers.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-border bg-card rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
