"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(result?.error || "Sign in failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto rounded-2xl bg-white/85 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl border border-white/40"
    >
      {/* Toggle */}
      <div className="mb-8 flex w-full rounded-xl bg-slate-100 p-1">
        <div className="flex w-1/2 items-center justify-center rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-sm">
          Login
        </div>
        <Link
          href="/auth/register"
          className="flex w-1/2 items-center justify-center rounded-lg py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          Sign Up
        </Link>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-5"
        animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#111827]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-xl border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]/20'} bg-white py-3 pl-11 pr-4 text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-200`}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#111827]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-xl border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB]/20'} bg-white py-3 pl-11 pr-12 text-[#111827] placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-200`}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-5 w-5 rounded border border-[#E5E7EB] bg-white transition-colors peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563EB]/30 group-hover:border-[#2563EB]/50" />
              <svg className="absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-[#6B7280] select-none font-medium">Remember me</span>
          </label>
          <a href="#" className="text-sm font-semibold text-[#2563EB] hover:text-[#2563EB]/80 transition-colors">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="relative flex w-full justify-center items-center rounded-xl bg-[#2563EB] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#2563EB]/30 transition-all hover:bg-[#2563EB]/90 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed overflow-hidden group"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </span>
          ) : (
            <span className="relative z-10">Login</span>
          )}
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </motion.form>

    </motion.div>
  );
}
