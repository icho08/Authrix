"use client"

import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <article className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div className="inline-block px-3 py-1 mb-6 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                Legal
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Terms of Service</h1>
              <p className="text-muted-foreground">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none space-y-8 text-foreground">
              {[
                {
                  title: "1. Acceptance of Terms",
                  content:
                    "By accessing and using Authrix, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
                },
                {
                  title: "2. Use License",
                  content:
                    "Permission is granted to temporarily download one copy of the materials (information or software) on Authrix for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n- Modify or copy the materials\n- Use the materials for any commercial purpose or for any public display\n- Attempt to decompile or reverse engineer any software contained on Authrix\n- Remove any copyright or other proprietary notations from the materials",
                },
                {
                  title: "3. Disclaimer",
                  content:
                    "The materials on Authrix are provided on an 'as is' basis. Authrix makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
                },
                {
                  title: "4. Limitations",
                  content:
                    "In no event shall Authrix or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Authrix.",
                },
                {
                  title: "5. Accuracy of Materials",
                  content:
                    "The materials appearing on Authrix could include technical, typographical, or photographic errors. Authrix does not warrant that any of the materials on Authrix are accurate, complete, or current. Authrix may make changes to the materials contained on its website at any time without notice.",
                },
                {
                  title: "6. Links",
                  content:
                    "Authrix has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Authrix of the site. Use of any such linked website is at the user's own risk.",
                },
                {
                  title: "7. Modifications",
                  content:
                    "Authrix may revise these terms of service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.",
                },
                {
                  title: "8. Governing Law",
                  content:
                    "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction where Authrix is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
                },
              ].map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">
                If you have any questions about our Terms of Service, please contact us at{" "}
                <Link href="mailto:authrix08@gmail.com" className="text-primary hover:underline">
                  authrix08@gmail.com
                </Link>
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
