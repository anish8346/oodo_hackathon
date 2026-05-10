"use client";

import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const STATS: Stat[] = [
  { label: "Total Trips", value: "12", icon: MapPin, color: "text-emerald-700" },
  { label: "Countries Visited", value: "8", icon: TrendingUp, color: "text-sky-700" },
  { label: "Travel Buddies", value: "24", icon: Users, color: "text-teal-700" },
  { label: "Total Spent", value: "$12.5k", icon: DollarSign, color: "text-lime-700" },
];

export function StatsSection() {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {STATS.map((stat, index) => (
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
  );
}
