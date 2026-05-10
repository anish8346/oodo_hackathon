"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { RecommendedDestination } from "@/data/mock-dashboard";

interface DestinationCardProps {
  destination: RecommendedDestination;
  index: number;
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
  return (
    <motion.div
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
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm">
              ⭐ {destination.rating}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {destination.costIndex}
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
