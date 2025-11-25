"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempted with:", { ...formData, agreedToTerms })
  }

  const passwordStrength = formData.password.length >= 8 ? "strong" : formData.password.length >= 4 ? "medium" : "weak"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Create Account</h1>
            <p className="text-base text-muted-foreground">Get started with Authrix in 5 minutes</p>
          </div>

          {/* Register Form Card */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6 shadow-sm">
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name Input */}
              <div className="space-y-2.5">
                <label htmlFor="fullName" className="text-sm font-semibold text-foreground block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 py-5 text-base"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2.5">
                <label htmlFor="email" className="text-sm font-semibold text-foreground block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 py-5 text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2.5">
                <label htmlFor="password" className="text-sm font-semibold text-foreground block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 py-5 text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <div className="mt-3 flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${formData.password.length >= 4 ? "bg-destructive" : "bg-border"}`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${formData.password.length >= 6 ? "bg-accent" : "bg-border"}`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full transition-colors ${formData.password.length >= 8 ? "bg-primary" : "bg-border"}`}
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1.5 w-4 h-4 rounded border border-border cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I agree to the{" "}
                  <Link href="/" className="text-primary hover:text-primary/90 transition-colors font-medium">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className="text-primary hover:text-primary/90 transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full py-5 text-base font-semibold rounded-lg mt-6"
                disabled={!agreedToTerms}
              >
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:text-primary/90 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
