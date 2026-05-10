import { auth } from "@/auth";
import { WorkspacePage } from "@/components/traveloop/workspace-page";

export default async function DashboardPage() {
  const session = await auth();
  return <WorkspacePage mode="dashboard" displayName={session?.user?.name?.split(" ")[0] ?? "Traveler"} />;
}
