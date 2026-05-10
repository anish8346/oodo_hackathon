"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trip } from "@/data/mock-dashboard";

interface HeroSectionProps {
  displayName: string;
  upcomingTrip: Trip | undefined;
  onNavigate: (page: string) => void;
}

export function HeroSection({ displayName, upcomingTrip, onNavigate }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-sky-600 to-teal-500 p-6 text-white shadow-sm md:p-10 lg:p-12"
    >
      <div className="relative z-10">
        <h1 className="mb-3 text-3xl font-bold tracking-normal md:text-4xl">
          Welcome back, {displayName}! ✈️
        </h1>
        <p className="mb-6 text-lg text-white/90">Your next adventure awaits</p>

        {upcomingTrip && (
          <div className="max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="mb-1 text-xl font-semibold">{upcomingTrip.title}</h2>
                <div className="flex flex-col gap-2 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {upcomingTrip.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {upcomingTrip.destinations.length} cities
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => onNavigate("trips")}>
                View Details
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Trip Progress</span>
                <span>{upcomingTrip.progress}%</span>
              </div>
              <Progress value={upcomingTrip.progress} className="h-2 bg-white/25" />
            </div>
          </div>
        )}

        <Button
          onClick={() => onNavigate("create-trip")}
          size="lg"
          variant="secondary"
          className="mt-6"
        >
          <Plus className="mr-2 h-5 w-5" />
          Plan New Trip
        </Button>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
    </motion.section>
  );
}
