"use client"

import Link from "next/link"
import { Mail, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors duration-300">
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              We'd Love to Hear From You
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Have questions about Authrix? Need support? Reach out to our team.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Email Card */}
              <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Email</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Send us an email and we'll get back to you as soon as possible.
                </p>
                <Link href="mailto:authrix08@gmail.com">
                  <Button className="w-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Send Email
                  </Button>
                </Link>
                <p className="text-foreground text-sm mt-4 font-semibold">authrix08@gmail.com</p>
              </div>

              {/* GitHub Card */}
              <div className="p-8 rounded-lg border border-border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Github className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">GitHub</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Check out our repository, report issues, or contribute to the project.
                </p>
                <Link href="https://github.com/icho08/Authsystem" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Visit GitHub
                  </Button>
                </Link>
                <p className="text-foreground text-sm mt-4 font-semibold">icho08/Authsystem</p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-balance">What Can We Help With?</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { title: "Support", desc: "Technical questions and troubleshooting" },
                { title: "Sales", desc: "Enterprise plans and custom solutions" },
                { title: "Feedback", desc: "Feature requests and suggestions" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-border bg-card rounded-lg hover:shadow-md hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
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
