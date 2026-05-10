const activities = [
  "Profile record created",
  "Email login enabled",
  "Demo dashboard opened",
];

export function ActivityList() {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-950">Recent Activity</h2>
      <ol className="mt-4 space-y-3">
        {activities.map((activity) => (
          <li key={activity} className="flex items-center gap-3 text-sm text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {activity}
          </li>
        ))}
      </ol>
    </section>
  );
}
