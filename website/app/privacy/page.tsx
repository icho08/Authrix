"use client"

import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function PrivacyPage() {
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
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Privacy Policy</h1>
              <p className="text-muted-foreground">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none space-y-8 text-foreground">
              {[
                {
                  title: "1. Introduction",
                  content:
                    "Authrix ('we' or 'us' or 'our') operates the Authrix website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.",
                },
                {
                  title: "2. Information Collection and Use",
                  content:
                    "We collect several different types of information for various purposes to provide and improve our service to you:\n- Personal Data: name, email address, phone number, address, authentication credentials\n- Usage Data: pages you visit, time and date of your visit, time spent on pages\n- Technical Data: IP address, browser type, operating system, referral source",
                },
                {
                  title: "3. Use of Data",
                  content:
                    "Authrix uses the collected data for various purposes:\n- To provide and maintain our service\n- To notify you about changes to our service\n- To provide customer support\n- To gather analysis or valuable information to improve our service\n- To monitor the usage of our service\n- To detect, prevent and address technical issues",
                },
                {
                  title: "4. Security of Data",
                  content:
                    "The security of your data is important to us but remember that no method of transmission over the Internet is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
                },
                {
                  title: "5. Links to Other Sites",
                  content:
                    "Our service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.",
                },
                {
                  title: "6. Changes to This Privacy Policy",
                  content:
                    "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date at the top of this page.",
                },
                {
                  title: "7. Contact Us",
                  content:
                    "If you have any questions about this Privacy Policy, please contact us at authrix08@gmail.com",
                },
                {
                  title: "8. Your Rights",
                  content:
                    "Depending on your location, you may have certain rights regarding your personal data, including the right to access, correct, or delete your data. Please contact us to exercise any of these rights.",
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
                If you have any questions about our Privacy Policy, please contact us at{" "}
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
