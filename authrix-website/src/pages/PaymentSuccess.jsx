import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Share2, Sparkles } from "lucide-react";
import Header from "../components/Header";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionUuid = searchParams.get("transaction_uuid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header variant="default" breadcrumb="Payment Success" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-card border border-border rounded-3xl p-8 text-center shadow-2xl shadow-primary/10 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-primary" />

            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-6 h-6 text-primary animate-bounce" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black mb-3">Payment Successful!</h1>
            <p className="text-muted-foreground font-mono text-sm mb-8">
              Your transaction has been processed securely.
            </p>

            <div className="bg-muted/30 rounded-2xl p-6 mb-8 space-y-4 text-left font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="text-foreground font-bold">
                  {transactionUuid?.split("-")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md font-bold text-xs">
                  COMPLETED
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-4">
                <span className="text-muted-foreground">Total</span>
                <span className="text-foreground font-bold text-lg">
                  Verified
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => window.print()}
                className="w-full py-4 px-6 rounded-xl border border-border hover:bg-muted/50 transition-all font-bold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Print Receipt
              </button>
            </div>
          </div>

          <p className="text-center mt-8 text-xs text-muted-foreground font-mono uppercase tracking-widest">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </main>
    </div>
  );
}
