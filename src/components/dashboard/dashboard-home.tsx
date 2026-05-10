"use client";

import { mockTrips, recommendedDestinations } from "@/data/mock-dashboard";
import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { UpcomingTripsSection } from "./upcoming-trips-section";
import { RecommendedDestinationsSection } from "./recommended-destinations-section";

type DashboardHomeProps = {
  displayName: string;
  onNavigate: (page: string) => void;
};

/**
 * Main Dashboard component
 * Orchestrates all dashboard sections without containing business logic
 * Follows separation of concerns by delegating to specialized components
 */
export function DashboardHome({ displayName, onNavigate }: DashboardHomeProps) {
  const upcomingTrip = mockTrips.find((trip) => trip.status === "upcoming");
  const upcomingTrips = mockTrips.filter((trip) => trip.status === "upcoming");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <HeroSection
        displayName={displayName}
        upcomingTrip={upcomingTrip}
        onNavigate={onNavigate}
      />

      <StatsSection />

      <UpcomingTripsSection trips={upcomingTrips} onNavigate={onNavigate} />

      <RecommendedDestinationsSection
        destinations={recommendedDestinations}
        onNavigate={onNavigate}
      />
    </div>
  );
}
