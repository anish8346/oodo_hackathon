import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { mockUser } from "@/data/mock-dashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const sessionUser = session.user;
  const user = {
    ...mockUser,
    name: sessionUser.name || mockUser.name,
    firstName: sessionUser.name?.trim().split(/\s+/)[0] || mockUser.firstName,
    email: sessionUser.email || mockUser.email,
    image: sessionUser.image || null,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
