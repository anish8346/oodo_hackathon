"use client";

import { Button } from "@/components/ui/button";
import { RecommendedDestination } from "@/data/mock-dashboard";
import { DestinationCard } from "./destination-card";

interface RecommendedDestinationsSectionProps {
  destinations: RecommendedDestination[];
  onNavigate: (page: string) => void;
}

export function RecommendedDestinationsSection({
  destinations,
  onNavigate,
}: RecommendedDestinationsSectionProps) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-normal">Recommended Destinations</h2>
        <Button variant="ghost" onClick={() => onNavigate("activities")}>
          Explore More
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {destinations.map((destination, index) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
