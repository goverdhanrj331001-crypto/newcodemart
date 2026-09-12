"use client";

import React, { useState } from "react";
import { useAuth } from "../auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, X } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
  showCloseButton?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, showCloseButton }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect = searchParams?.get("redirect") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await login(email.trim(), password);
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirect);
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black px-4 py-8 relative">
      {showCloseButton && (
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009f7f] to-[#00b894] mb-4 shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            CodeMart Admin
          </h1>
          <p className="text-zinc-400 text-sm mt-1.5">
            Sign in to access your admin dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@codemart.io"
                  autoFocus
                  className="w-full bg-neutral-950 border border-zinc-800 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-950 border border-zinc-800 rounded-lg pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2.5">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center mb-2">
              Default Super Admin credentials
            </p>
            <div className="bg-neutral-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-zinc-500">Email:</span>
                <code className="text-emerald-400">admin@codemart.io</code>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Password:</span>
                <code className="text-emerald-400">ChangeMe@Admin123</code>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          CodeMart Admin Panel • Protected by JWT authentication
        </p>
      </div>
    </div>
  );
};
