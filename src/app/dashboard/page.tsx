import { DashboardHome } from "@/components/dashboard/dashboard-home";
import { mockUser } from "@/data/mock-dashboard";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const sessionUser = session?.user;
  const user = sessionUser
    ? {
        ...mockUser,
        name: sessionUser.name || mockUser.name,
        firstName: sessionUser.name?.trim().split(/\s+/)[0] || mockUser.firstName,
        email: sessionUser.email || mockUser.email,
        image: sessionUser.image || null,
      }
    : mockUser;

  return <DashboardHome user={user} />;
}
