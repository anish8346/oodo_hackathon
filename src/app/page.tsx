import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-sky-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Traveloop</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:pt-32">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Now in Beta — Free to use
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            Plan your perfect trip
            <span className="bg-gradient-to-r from-emerald-600 to-sky-500 bg-clip-text text-transparent"> with ease</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Discover destinations, build day-by-day itineraries, track your budget, manage packing lists, and collaborate with travel companions — all in one beautiful dashboard.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-600/30"
            >
              Start Planning — It&apos;s Free
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200/60 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything you need for your travels
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From planning to packing, we&apos;ve got every step covered
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🗺️",
                title: "Itinerary Builder",
                desc: "Build day-by-day travel plans with drag-and-drop activities, timing, and locations.",
              },
              {
                icon: "💰",
                title: "Budget Tracker",
                desc: "Set budgets, log expenses by category, and visualize spending with real-time breakdowns.",
              },
              {
                icon: "🌍",
                title: "Discover Cities",
                desc: "Explore curated destinations with ratings, cost indexes, and seasonal recommendations.",
              },
              {
                icon: "🎯",
                title: "Activities",
                desc: "Browse and book experiences — from cooking classes to temple tours — all in one place.",
              },
              {
                icon: "🧳",
                title: "Packing Lists",
                desc: "Category-based checklists with progress tracking so you never forget essentials.",
              },
              {
                icon: "📝",
                title: "Trip Notes",
                desc: "Keep all your reservations, tips, and reminders organized with tags and search.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 hover:border-emerald-200"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-sky-500 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center text-white">
            {[
              { value: "10K+", label: "Trips Planned" },
              { value: "150+", label: "Destinations" },
              { value: "50K+", label: "Activities" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-extrabold lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Join thousands of travelers who plan smarter with Traveloop.
          </p>
          <Link
            href="/auth/register"
            className="mt-8 inline-block rounded-xl bg-emerald-600 px-10 py-4 text-lg font-semibold text-white shadow-xl shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:-translate-y-0.5"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-sky-500">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900">Traveloop</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Traveloop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
