export default function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="text-muted-foreground">
        Administrative controls and analytics — Coming soon.
      </p>
      <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-16 text-center">
        <p className="text-lg font-medium text-slate-500">
          🚧 Under Construction
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Admin features like user management, trip analytics, and system settings will be available here.
        </p>
      </div>
    </div>
  );
}
