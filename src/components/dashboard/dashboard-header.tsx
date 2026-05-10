import { SignOutButton } from "./sign-out-button";
import { UserAvatar } from "./user-avatar";

type DashboardHeaderProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function DashboardHeader({ name, email, image }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-zinc-200 bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <UserAvatar image={image} name={name} email={email} size="lg" />
        <div>
          <p className="text-sm text-zinc-500">Welcome back</p>
          <h1 className="text-2xl font-semibold text-zinc-950">{name || "Dashboard User"}</h1>
          <p className="text-sm text-zinc-600">{email}</p>
        </div>
      </div>
      <SignOutButton />
    </header>
  );
}
