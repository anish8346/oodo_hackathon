"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, LayoutDashboard, LogOut, Map, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";
import { type DashboardUser } from "@/data/mock-dashboard";
import { Sidebar } from "./sidebar";
import { UserAvatar } from "./user-avatar";

type DashboardShellProps = {
  user: DashboardUser;
  children: ReactNode;
};

const routeMap: Record<string, string> = {
  dashboard: "/dashboard",
  trips: "/dashboard/trips",
  itinerary: "/dashboard/itinerary",
  cities: "/dashboard/cities",
  activities: "/dashboard/activities",
  budget: "/dashboard/budget",
  packing: "/dashboard/packing",
  notes: "/dashboard/notes",
  settings: "/dashboard/settings",
  admin: "/dashboard/admin",
  "create-trip": "/dashboard/create",
};

const pathToPage: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/trips": "trips",
  "/dashboard/itinerary": "itinerary",
  "/dashboard/cities": "cities",
  "/dashboard/activities": "activities",
  "/dashboard/budget": "budget",
  "/dashboard/packing": "packing",
  "/dashboard/notes": "notes",
  "/dashboard/settings": "settings",
  "/dashboard/admin": "admin",
  "/dashboard/create": "create-trip",
};

const titleMap: Record<string, string> = {
  dashboard: "Dashboard",
  trips: "My Trips",
  itinerary: "Itinerary",
  cities: "Discover Cities",
  activities: "Activities",
  budget: "Budget",
  packing: "Packing List",
  notes: "Notes",
  settings: "Profile",
  admin: "Admin",
  "create-trip": "Create Trip",
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const displayName = user.firstName || user.name || "Traveler";
  const activePage = pathToPage[pathname] ?? "dashboard";

  function handleNavigate(page: string) {
    router.push(routeMap[page] ?? "/dashboard");
  }

  function handleLogout() {
    signOut({ callbackUrl: "/auth/signin" });
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#f4f7f4] text-slate-950">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      <div className="flex h-full min-w-0 flex-col overflow-hidden lg:pl-64">
        <TopNav
          user={user}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          displayName={displayName}
          title={titleMap[activePage] ?? "Traveloop"}
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}

function TopNav({
  user,
  displayName,
  title,
  onMenuClick,
}: {
  user: DashboardUser;
  displayName: string;
  title: string;
  onMenuClick: () => void;
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="z-30 flex h-[70px] shrink-0 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-slate-500">Traveloop</p>
          <h1 className="text-lg font-semibold leading-tight text-slate-950">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 sm:flex"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen((value) => !value)}
            className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50"
          >
            <UserAvatar image={user.image} name={user.name} email={user.email} size="sm" />
            <span className="hidden max-w-36 truncate text-left text-sm font-medium text-slate-800 md:block">
              {displayName}
            </span>
          </button>
          <AnimatePresence>
            {isProfileOpen ? (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-slate-200 bg-white py-2 shadow-xl"
              >
                <DropdownLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <DropdownLink href="/dashboard/trips" icon={Map} label="My Trips" />
                <DropdownLink href="/dashboard/settings" icon={Settings} label="Settings" />
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-700 transition hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function DropdownLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
