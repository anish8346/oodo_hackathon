import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDashboardUser } from "@/lib/dashboard-user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
