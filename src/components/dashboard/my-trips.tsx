"use client";

import { useState } from "react";
import { Plus, Search, Filter, MapPin, Calendar, MoreVertical, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { motion } from "framer-motion";
import { mockTrips } from "@/data/mock-dashboard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function MyTrips() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filterOptions: { label: string; value: typeof filter }[] = [
    { label: "All", value: "all" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Completed", value: "completed" },
  ];

  const filteredTrips = mockTrips.filter((trip) => {
    const matchesFilter = filter === "all" || trip.status === filter;
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destinations.some((d) =>
        d.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  function onNavigate(page: string) {
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
      "public-itinerary": "/public-itinerary",
    };
    router.push(routeMap[page] ?? "/dashboard");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-muted-foreground">
            Manage and organize all your travel plans
          </p>
        </div>
        <Button onClick={() => onNavigate("create-trip")} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create New Trip
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search trips or destinations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              {filterOptions.map((item) => (
                <Button
                  key={item.value}
                  variant={filter === item.value ? "default" : "outline"}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => toast.info("Advanced filters coming soon")}
            >
              <Filter className="w-5 h-5 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map((trip, i) => (
          <motion.div
            key={trip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
              {/* Trip Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={trip.coverImage}
                  alt={trip.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge
                    variant={trip.status === "upcoming" ? "default" : "secondary"}
                    className="bg-white/90 backdrop-blur-sm text-foreground"
                  >
                    {trip.status}
                  </Badge>
                  <button className="p-2 rounded-lg bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trip Details */}
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3">{trip.title}</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {trip.destinations.join(" → ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {trip.startDate} - {trip.endDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {trip.travelers.slice(0, 3).map((traveler, idx) => (
                        <Avatar
                          key={idx}
                          className="w-8 h-8 border-2 border-white"
                        >
                          <AvatarImage src={traveler.avatar} />
                          <AvatarFallback>{traveler.name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {trip.travelers.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs">
                          +{trip.travelers.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {trip.travelers.length}{" "}
                      {trip.travelers.length === 1 ? "traveler" : "travelers"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        ₹{trip.spent.toLocaleString("en-IN")} / ₹
                        {trip.budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <Progress
                      value={(trip.spent / trip.budget) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="h-2 mt-2" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toast.info("Edit trip functionality coming soon")}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onNavigate("public-itinerary");
                      toast.success("Opening public view...");
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onNavigate("itinerary")}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Start planning your next adventure!"}
          </p>
          <Button onClick={() => onNavigate("create-trip")}>
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Trip
          </Button>
        </motion.div>
      )}
    </div>
  );
}
