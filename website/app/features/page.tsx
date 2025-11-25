"use client"

import Link from "next/link"
import { CheckCircle, Zap, Shield, Users, GitBranch, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description:
      "Enterprise-grade authentication with sub-millisecond latency. Deploy globally with our distributed infrastructure.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security First",
    description:
      "Military-grade encryption, OAuth 2.0, SAML support, and compliance with GDPR, SOC 2, and HIPAA standards.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multi-Tenant",
    description:
      "Manage multiple applications and user bases from a single dashboard. Perfect for SaaS platforms and enterprise apps.",
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: "Version Control",
    description:
      "Track all authentication events, user activities, and changes with detailed audit logs and analytics.",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "Developer Friendly",
    description:
      "Simple REST API, comprehensive SDKs for all major frameworks, and extensive documentation with code examples.",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Always Reliable",
    description:
      "99.99% uptime guarantee with automatic failover, backup systems, and 24/7 monitoring for peace of mind.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors duration-300">
              Everything You Need
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              Powerful Features for Every Scale
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              From startups to enterprises, Authrix provides everything you need to build secure, scalable
              authentication systems.
            </p>
            <Link href="/register">
              <Button className="hover:shadow-lg hover:scale-105 transition-all duration-300">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border border-border bg-card hover:shadow-md hover:border-primary/30 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Ready to Secure Your Application?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Join thousands of developers using Authrix for their authentication needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="w-full sm:w-auto hover:shadow-lg hover:scale-105 transition-all duration-300">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto hover:bg-secondary hover:scale-105 transition-all duration-300 bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
