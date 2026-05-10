import { NotesView } from "@/components/dashboard/notes-view";
import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { mockUser } from "@/data/mock-dashboard";

export const metadata = {
  title: "Trip Notes & Journal | Traveloop",
  description:
    "Write, edit, and manage your travel journal entries linked to your trips.",
};

export default async function NotesPage() {
  const session = await auth();
  const sessionUser = session?.user;
  const user = sessionUser
    ? {
        ...mockUser,
        name: sessionUser.name || mockUser.name,
        firstName:
          sessionUser.name?.trim().split(/\s+/)[0] || mockUser.firstName,
        email: sessionUser.email || mockUser.email,
        image: sessionUser.image || null,
      }
    : mockUser;

  return <DashboardShell user={user} />;
}
