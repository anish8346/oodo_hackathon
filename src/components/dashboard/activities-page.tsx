"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, MapPin, Plus, Search, Star, Tag, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

type ActivityItem = {
  id: string;
  title: string;
  location: string;
  category: string;
  duration: string;
  cost: number;
  rating: number;
  booked: boolean;
  image: string;
};

const initialActivities: ActivityItem[] = [
  {
    id: "act1",
    title: "Fushimi Inari Shrine Hike",
    location: "Kyoto",
    category: "Cultural",
    duration: "3 hrs",
    cost: 0,
    rating: 4.9,
    booked: true,
    image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "act2",
    title: "Cooking Class — Ramen Making",
    location: "Kyoto",
    category: "Food",
    duration: "2.5 hrs",
    cost: 85,
    rating: 4.8,
    booked: false,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "act3",
    title: "Bamboo Grove Cycling Tour",
    location: "Arashiyama",
    category: "Adventure",
    duration: "4 hrs",
    cost: 45,
    rating: 4.7,
    booked: false,
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "act4",
    title: "Tea Ceremony Experience",
    location: "Gion, Kyoto",
    category: "Cultural",
    duration: "1.5 hrs",
    cost: 60,
    rating: 4.9,
    booked: true,
    image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "act5",
    title: "Nara Deer Park Visit",
    location: "Nara",
    category: "Nature",
    duration: "2 hrs",
    cost: 0,
    rating: 4.6,
    booked: false,
    image: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "act6",
    title: "Sake Tasting Tour",
    location: "Fushimi, Kyoto",
    category: "Food",
    duration: "2 hrs",
    cost: 40,
    rating: 4.5,
    booked: false,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
  },
];

const categoryFilters = ["All", "Cultural", "Food", "Adventure", "Nature"];

export function ActivitiesPage() {
  const [activities, setActivities] = useState(initialActivities);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activities.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function toggleBooked(id: string) {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, booked: !a.booked } : a))
    );
    toast.success("Booking status updated");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Activities</h1>
        <p className="text-muted-foreground mt-1">
          Discover and book exciting experiences
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categoryFilters.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {activity.booked && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-emerald-500 text-white">
                      <Check className="h-3 w-3 mr-1" /> Booked
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-lg">{activity.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {activity.location}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {activity.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{" "}
                    {activity.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />{" "}
                    {activity.cost === 0 ? "Free" : `₹${activity.cost.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {activity.category}
                </Badge>
                <Button
                  className="w-full mt-2"
                  variant={activity.booked ? "outline" : "default"}
                  onClick={() => toggleBooked(activity.id)}
                >
                  {activity.booked ? "Cancel Booking" : "Book Activity"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
