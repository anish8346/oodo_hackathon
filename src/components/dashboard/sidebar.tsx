"use client";

import {
  Activity,
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Package,
  Plane,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
  onLogout?: () => void;
};

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "trips", label: "My Trips", icon: Plane },
  { id: "itinerary", label: "Itinerary", icon: Calendar },
  { id: "cities", label: "Discover Cities", icon: Globe },
  { id: "activities", label: "Activities", icon: Activity },
  { id: "budget", label: "Budget", icon: DollarSign },
  { id: "packing", label: "Packing List", icon: Package },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "admin", label: "Admin", icon: BarChart3 },
];

export function Sidebar({
  activePage,
  onNavigate,
  isMobileMenuOpen,
  onMobileMenuClose,
  onLogout,
}: SidebarProps) {
  return (
    <>
      {isMobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileMenuClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-sky-500">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-950">Traveloop</span>
          </div>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onMobileMenuClose?.();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-emerald-50 hover:text-slate-950"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-sky-500 text-sm font-semibold text-white">
              JD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-950">John Doe</p>
              <p className="truncate text-xs text-slate-500">john@example.com</p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-slate-950"
              onClick={() => {
                onLogout?.();
                toast.success("Logged out successfully");
              }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
