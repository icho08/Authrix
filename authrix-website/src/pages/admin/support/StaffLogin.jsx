import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { staffApi } from "../../../utils/staffApi";
import { ShieldAlert, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await staffApi.login(email, password);
      toast.success("Welcome back, teammate!");
      navigate("/staff/support");
    } catch (error) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="bg-indigo-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-600/30">
            <ShieldAlert className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">Staff Login</h1>
          <p className="text-slate-400 text-sm">
            Authrix Internal Support Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                placeholder="Staff Email"
                className="w-full bg-slate-800 border-none rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-slate-800 border-none rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 transition-shadow"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600">
          Unauthorized access is prohibited. All activity is logged.
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;
