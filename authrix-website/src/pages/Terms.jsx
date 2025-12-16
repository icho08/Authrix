import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 16, 2024</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using Authrix ("the Service"), you accept and agree to be bound by 
              the terms and provision of this agreement. If you do not agree to abide by the above, 
              please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              Authrix provides authentication and user management services for web and mobile applications. 
              Our service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>User authentication and authorization</li>
              <li>API keys and security tokens</li>
              <li>User management dashboard</li>
              <li>Integration tools and documentation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use our service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit malicious code or conduct security attacks</li>
              <li>Spam, harass, or abuse other users</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service for illegal or fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. API Usage and Limits</h2>
            <p className="mb-4">
              Your use of our API is subject to rate limits and usage restrictions:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>API calls are limited based on your subscription plan</li>
              <li>Excessive usage may result in temporary suspension</li>
              <li>You must not attempt to circumvent rate limits</li>
              <li>Commercial use requires appropriate licensing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
            <p className="mb-4">
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <p className="mb-4">
              While we strive to maintain high availability, we do not guarantee uninterrupted service. 
              We may experience downtime for maintenance, updates, or unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by Authrix 
              and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall Authrix be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the service immediately, 
              without prior notice, for conduct that we believe violates these terms or is harmful 
              to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will notify users of 
              material changes via email or through the service. Continued use after changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of 
              [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p>Email: <a href="mailto:authrix08@gmail.com" className="text-primary hover:underline">authrix08@gmail.com</a></p>
              <p>Address: Kathmandu , Nepal</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
