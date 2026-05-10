"use client";

import { useRouter } from "next/navigation";

import { mockTrips, recommendedDestinations } from "@/data/mock-dashboard";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { UpcomingTripsSection } from "./upcoming-trips-section";
import { RecommendedDestinationsSection } from "./recommended-destinations-section";

import { type DashboardUser } from "@/data/mock-dashboard";

type DashboardHomeProps = {
  user: DashboardUser;
};

/**
 * Main Dashboard component
 * Orchestrates all dashboard sections without containing business logic
 * Follows separation of concerns by delegating to specialized components
 */
export function DashboardHome({ user }: DashboardHomeProps) {
  const router = useRouter();
  const displayName = user.firstName || user.name || "Traveler";
  const upcomingTrip = mockTrips.find((trip) => trip.status === "upcoming");
  const upcomingTrips = mockTrips.filter((trip) => trip.status === "upcoming");

  function handleNavigate(page: string) {
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
    router.push(routeMap[page] ?? "/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <HeroSection
        displayName={displayName}
        upcomingTrip={upcomingTrip}
        onNavigate={handleNavigate}
      />

      <StatsSection />

      <UpcomingTripsSection trips={upcomingTrips} onNavigate={handleNavigate} />

      <RecommendedDestinationsSection
        destinations={recommendedDestinations}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
