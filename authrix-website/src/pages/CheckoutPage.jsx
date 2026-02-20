import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../pages/Pricing"; // Reusing Footer component exported from Pricing
import PaymentForm from "../components/PaymentForm";
import { ChevronLeft, ShoppingBag, Sparkles, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Pricing data to match Pricing.jsx
const plans = {
  Free: { price: 0, amount: 0 },
  Starter: { price: 3, amount: 400 }, // Mock NPR amounts for demo
  Pro: { price: 5, amount: 650 },
  Business: { price: 20, amount: 2600 },
};

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planName = searchParams.get("plan") || "Starter";
  const plan = plans[planName] || plans.Starter;
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleBack = () => navigate("/pricing");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handlePay = async () => {
    try {
      const token = getCookie("auth_access_token");
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_API_KEY,
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: plan.amount,
            planName: planName,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Create a hidden form and submit it to eSewa
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;

        for (const key in data.formData) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.formData[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        alert(data.error || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong while initiating payment");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header variant="default" breadcrumb="Checkout" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Pricing</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Order Summary */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70 mb-2">
                Order Summary
              </h2>
              <p className="text-muted-foreground font-mono">
                Review your subscription details
              </p>
            </div>

            <div className="bg-muted/30 border border-border rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{planName} Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      Monthly Subscription
                    </p>
                  </div>
                </div>
                <div className="text-right font-bold text-xl">
                  ${plan.price}
                </div>
              </div>

              <div className="space-y-3 font-mono">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${plan.price}.00</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border mt-3">
                  <span className="text-foreground font-bold">
                    Total Amount
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-black text-foreground">
                      ${plan.price}.00
                    </div>
                    <div className="text-xs text-primary font-bold">
                      ≈ NPR {plan.amount}.00
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium leading-relaxed">
                You are purchasing the{" "}
                <span className="text-primary font-bold">{planName}</span> plan.
                Immediate access will be granted after successful payment.
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 delay-150">
            <PaymentForm
              plan={planName}
              amount={plan.amount}
              onPay={() => setShowVerificationModal(true)}
            />
          </div>
        </div>

        <AlertDialog
          open={showVerificationModal}
          onOpenChange={setShowVerificationModal}
        >
          <AlertDialogContent className="max-w-[400px] border-primary/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="w-6 h-6 text-amber-500" />
                Under Verification
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                The Authrix team is currently{" "}
                <span className="text-foreground font-bold italic">
                  awaiting merchant verification
                </span>{" "}
                from eSewa.
                <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm border border-border">
                  Please try again later. We'll be fully live soon!
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction className="w-full sm:w-full bg-primary hover:bg-primary/90 font-bold">
                Got it, thanks!
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>

      {/* Basic Footer for Checkout */}
      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground font-mono">
        &copy; {new Date().getFullYear()} Authrix Inc. Secure Checkout.
      </footer>
    </div>
  );
}
