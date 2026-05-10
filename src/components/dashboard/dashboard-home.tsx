"use client";

import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, Plus, TrendingUp, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockTrips, recommendedDestinations } from "@/data/mock-dashboard";

type DashboardHomeProps = {
  displayName: string;
  onNavigate: (page: string) => void;
};

const stats = [
  { label: "Total Trips", value: "12", icon: MapPin, color: "text-emerald-700" },
  { label: "Countries Visited", value: "8", icon: TrendingUp, color: "text-sky-700" },
  { label: "Travel Buddies", value: "24", icon: Users, color: "text-teal-700" },
  { label: "Total Spent", value: "$12.5k", icon: DollarSign, color: "text-lime-700" },
];

export function DashboardHome({ displayName, onNavigate }: DashboardHomeProps) {
  const upcomingTrip = mockTrips.find((trip) => trip.status === "upcoming");
  const upcomingTrips = mockTrips.filter((trip) => trip.status === "upcoming");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-sky-600 to-teal-500 p-6 text-white shadow-sm md:p-10 lg:p-12"
      >
        <div className="relative z-10">
          <h1 className="mb-3 text-3xl font-bold tracking-normal md:text-4xl">
            Welcome back, {displayName}!
          </h1>
          <p className="mb-6 text-lg text-white/90">Your next adventure awaits</p>

          {upcomingTrip ? (
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
          ) : null}

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
      </motion.section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="mb-1 text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`rounded-xl bg-slate-100 p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-normal">Upcoming Trips</h2>
          <Button variant="ghost" onClick={() => onNavigate("trips")}>
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute right-4 top-4">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {trip.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold">{trip.title}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="truncate">{trip.destinations.join(" -> ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span>
                        {trip.startDate} - {trip.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {trip.travelers.map((traveler) => (
                          <Avatar key={traveler.name} className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={traveler.avatar} alt={traveler.name} />
                            <AvatarFallback>{traveler.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <span className="text-sm text-slate-500">
                        {trip.travelers.length} travelers
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-500">Budget</span>
                        <span className="font-medium">
                          ${trip.spent.toLocaleString()} / ${trip.budget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(trip.spent / trip.budget) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-normal">Recommended Destinations</h2>
          <Button variant="ghost" onClick={() => onNavigate("activities")}>
            Explore More
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recommendedDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="relative h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="mb-1 text-xl font-bold">{destination.city}</h3>
                    <p className="text-sm text-white/90">{destination.country}</p>
                  </div>
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Badge className="bg-white/90 text-slate-950 backdrop-blur-sm">
                      Star {destination.rating}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                      {destination.costIndex}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
