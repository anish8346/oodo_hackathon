import { WorkspacePage } from "@/components/traveloop/workspace-page";
import { getDashboardUser } from "@/lib/dashboard-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <WorkspacePage mode="dashboard" displayName={user.firstName || user.name || "Traveler"} />;
}
