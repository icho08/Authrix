"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Lock, Users, Code2, Globe } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Inspired by Firebase & Appwrite */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-7xl font-bold text-balance text-foreground leading-tight">
                Authentication Infrastructure for Modern Apps
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-3xl leading-relaxed">
                Production-ready authentication that scales. Secure, simple, and fully customizable. Focus on building,
                not auth infrastructure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register">
                <Button size="lg" className="px-8 py-6 text-base font-medium rounded-lg">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-base font-medium rounded-lg bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">
              Free forever • No credit card required • Self-hosted option available
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">10M+</div>
              <div className="text-sm text-muted-foreground">Potential Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">&lt; 50ms</div>
              <div className="text-sm text-muted-foreground">Auth Latency</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">Open</div>
              <div className="text-sm text-muted-foreground">Source</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Everything You Need</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Complete authentication solution with enterprise-grade security and developer-friendly APIs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="Enterprise Security"
                description="JWT tokens, password hashing, rate limiting, and CORS protection built-in. GDPR, SOC-2, and HIPAA compliant."
              />
              <FeatureCard
                icon={<Users className="w-6 h-6" />}
                title="Multi-Tenant Ready"
                description="Isolate users by application. Perfect for SaaS platforms, agencies, and multi-deployment architectures."
              />
              <FeatureCard
                icon={<Zap className="w-6 h-6" />}
                title="Lightning Fast"
                description="Optimized for speed with &lt; 50ms authentication latency and automatic token refresh for seamless UX."
              />
              <FeatureCard
                icon={<Code2 className="w-6 h-6" />}
                title="Developer First"
                description="React SDK, TypeScript support, comprehensive documentation, and hooks for easy integration into any stack."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="Self-Hosted Freedom"
                description="100% open source. Deploy on your infrastructure and maintain complete control over your authentication data."
              />
              <FeatureCard
                icon={<Shield className="w-6 h-6" />}
                title="Email Verification"
                description="Built-in email services for verification, password reset, and login alerts with customizable templates."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Authrix */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-16">Why Choose Authrix?</h2>

          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Ship Faster</h3>
              <p className="text-muted-foreground leading-relaxed">
                Implement authentication in minutes, not weeks. Get a production-ready auth system running in 5 minutes
                with our React SDK.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Own Your Data</h3>
              <p className="text-muted-foreground leading-relaxed">
                Self-hosted option means your user data stays on your servers. No vendor lock-in, no surprise pricing
                changes, full control.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Cost Effective</h3>
              <p className="text-muted-foreground leading-relaxed">
                No per-user pricing. Open source and free to use forever. Pay only for infrastructure if you choose to
                self-host.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Transparent & Auditable</h3>
              <p className="text-muted-foreground leading-relaxed">
                100% open source code. Transparent development process. Customize and audit everything for your specific
                requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Ready to Simplify Authentication?</h2>
            <p className="text-lg text-muted-foreground">
              Join developers building secure applications with Authrix. Start building in 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="px-8 py-6 text-base font-medium rounded-lg">
                Start Building Today
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 py-6 text-base font-medium rounded-lg bg-transparent">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-200 space-y-4">
      <div className="text-primary w-fit">{icon}</div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
