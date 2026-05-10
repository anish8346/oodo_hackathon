"use client";

import { Button } from "@/components/ui/button";
import { Trip } from "@/data/mock-dashboard";
import { TripCard } from "./trip-card";

interface UpcomingTripsSectionProps {
  trips: Trip[];
  onNavigate: (page: string) => void;
}

export function UpcomingTripsSection({ trips, onNavigate }: UpcomingTripsSectionProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-normal">Upcoming Trips</h2>
        <Button variant="ghost" onClick={() => onNavigate("trips")}>
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip, index) => (
          <TripCard key={trip.id} trip={trip} index={index} />
        ))}
      </div>
    </section>
  );
}
