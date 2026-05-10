"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 mb-6">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Authentication Error</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        Something went wrong during sign in. Please try again or contact support if the issue persists.
      </p>
      <Link
        href="/auth/signin"
        className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2563EB]/30 transition-all hover:bg-[#2563EB]/90 hover:-translate-y-0.5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>
    </div>
  );
}
