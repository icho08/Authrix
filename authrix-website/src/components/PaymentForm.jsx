import React from "react";
import { CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PaymentForm({ plan, amount, onPay }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl shadow-primary/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Payment Method</h3>
          <p className="text-sm text-muted-foreground font-mono">
            Select your preferred option
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* eSewa Option (Selected) */}
        <div className="relative group p-4 rounded-xl border-2 border-primary bg-primary/5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp"
                  alt="eSewa"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-foreground block">
                  eSewa epay
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Digital Wallet
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
          </div>
        </div>

        {/* Disabled Options (For future) */}
        <div className="relative p-4 rounded-xl border border-border bg-muted/30 opacity-60 grayscale cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center border border-border">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">
                  Bank
                </span>
              </div>
              <div>
                <span className="font-bold text-muted-foreground block">
                  Bank Transfer
                </span>
                <span className="text-xs text-muted-foreground font-mono italic">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onPay}
        className="w-full mt-8 py-4 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group uppercase tracking-wider"
      >
        <span>Pay NPR {amount} with eSewa</span>
        <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 font-mono">
        <ShieldCheck className="w-3.5 h-3.5" />
        Secure SSL Encrypted Payment
      </p>
    </div>
  );
}
