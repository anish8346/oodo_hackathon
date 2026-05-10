import { SettingsPage } from "@/components/dashboard/settings-page";
import { getDashboardUser } from "@/lib/dashboard-user";
import { redirect } from "next/navigation";

export default async function SettingsRoute() {
  const user = await getDashboardUser();

  if (!user) {
    redirect("/auth/signin");
  }

  return <SettingsPage user={user} />;
}
