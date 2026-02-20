import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw, Headset, ChevronLeft } from "lucide-react";
import Header from "../components/Header";

export default function PaymentFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header variant="default" breadcrumb="Payment Failed" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-card border border-destructive/20 rounded-3xl p-8 text-center shadow-2xl shadow-destructive/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />

            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-destructive" />
              </div>
            </div>

            <h1 className="text-3xl font-black mb-3">Payment Failed</h1>
            <p className="text-muted-foreground font-mono text-sm mb-8">
              We couldn't process your payment. Please try again or use a
              different method.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-4 px-6 rounded-xl bg-destructive text-destructive-foreground font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Retry Payment
              </button>

              <button
                onClick={() => navigate("/support")}
                className="w-full py-4 px-6 rounded-xl border border-border hover:bg-muted/50 transition-all font-bold flex items-center justify-center gap-2"
              >
                <Headset className="w-4 h-4" />
                Contact Support
              </button>
            </div>

            <button
              onClick={() => navigate("/")}
              className="mt-8 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
