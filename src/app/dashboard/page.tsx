import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { mockUser } from "@/data/mock-dashboard";

export default function DashboardPage() {
  return <DashboardShell user={mockUser} />;
}
