import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { type DashboardUser } from "@/data/mock-dashboard";

export async function getDashboardUser(): Promise<DashboardUser | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      name: true,
      email: true,
      phone: true,
      city: true,
      country: true,
      additionalInfo: true,
      image: true,
      createdAt: true,
    },
  });

  return user;
}
