export default function DashboardLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-lg bg-slate-200" />
          <div className="h-4 w-40 rounded-lg bg-slate-200" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-slate-200" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
          >
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-8 w-32 rounded bg-slate-200" />
            <div className="h-2 w-full rounded-full bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
          >
            <div className="h-48 bg-slate-200" />
            <div className="p-6 space-y-3">
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
