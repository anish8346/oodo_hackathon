import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { mockUser } from "@/data/mock-dashboard";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/signin");

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });
  const user = dbUser
    ? {
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        city: dbUser.city,
        country: dbUser.country,
        additionalInfo: dbUser.additionalInfo,
        image: dbUser.image,
        createdAt: dbUser.createdAt,
      }
    : mockUser;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
