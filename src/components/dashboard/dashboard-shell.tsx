import { ActivityList } from "./activity-list";
import { DashboardHeader } from "./dashboard-header";
import { ProfileSummary } from "./profile-summary";
import { StatCard } from "./stat-card";

type DashboardUser = {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  additionalInfo?: string | null;
  image?: string | null;
  createdAt?: Date | null;
};

type DashboardShellProps = {
  user: DashboardUser;
};

export function DashboardShell({ user }: DashboardShellProps) {
  const joinedDate = user.createdAt
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
        user.createdAt
      )
    : "Today";

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <DashboardHeader name={user.name} email={user.email} image={user.image} />
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="Account Status" value="Active" detail="Ready for demo workflows" />
          <StatCard label="User ID" value={user.email || "Email"} detail="Email address login" />
          <StatCard label="Joined" value={joinedDate} detail="Profile created date" />
        </section>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <ProfileSummary
            firstName={user.firstName}
            lastName={user.lastName}
            phone={user.phone}
            city={user.city}
            country={user.country}
            additionalInfo={user.additionalInfo}
          />
          <ActivityList />
        </div>
      </div>
    </main>
  );
}
