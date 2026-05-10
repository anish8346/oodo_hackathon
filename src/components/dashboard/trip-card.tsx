"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trip } from "@/data/mock-dashboard";

interface TripCardProps {
  trip: Trip;
  index: number;
}

export function TripCard({ trip, index }: TripCardProps) {
  return (
    <motion.div
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
              <span className="truncate">{trip.destinations.join(" → ")}</span>
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
  );
}
