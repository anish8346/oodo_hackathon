import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
      <div className="text-8xl font-extrabold bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent mb-4">
        404
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-slate-600 mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
