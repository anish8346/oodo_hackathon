"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Heart,
  MapPin,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

type City = {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  highlights: string[];
  costIndex: string;
  bestSeason: string;
  liked: boolean;
};

const cities: City[] = [
  {
    id: "paris",
    name: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    highlights: ["Eiffel Tower", "Louvre", "Cuisine"],
    costIndex: "₹₹₹",
    bestSeason: "Spring",
    liked: false,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    highlights: ["Temples", "Food", "Technology"],
    costIndex: "₹₹₹",
    bestSeason: "Spring/Autumn",
    liked: true,
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    highlights: ["Beaches", "Temples", "Rice Terraces"],
    costIndex: "₹",
    bestSeason: "Apr–Oct",
    liked: false,
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    highlights: ["Architecture", "Beaches", "Nightlife"],
    costIndex: "₹₹",
    bestSeason: "Summer",
    liked: false,
  },
  {
    id: "iceland",
    name: "Reykjavik",
    country: "Iceland",
    image: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    highlights: ["Northern Lights", "Glaciers", "Hot Springs"],
    costIndex: "₹₹₹₹",
    bestSeason: "Winter",
    liked: false,
  },
  {
    id: "marrakesh",
    name: "Marrakesh",
    country: "Morocco",
    image: "https://images.unsplash.com/photo-1548018560-c7196548e84d?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    highlights: ["Souks", "Palaces", "Desert Trips"],
    costIndex: "₹",
    bestSeason: "Spring",
    liked: false,
  },
];

export function DiscoverCities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityList, setCityList] = useState(cities);

  function toggleLike(id: string) {
    setCityList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, liked: !c.liked } : c))
    );
    toast.success("Updated favorites");
  }

  const filtered = cityList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Discover Cities</h1>
          <p className="text-muted-foreground mt-1">
            Explore destinations for your next adventure
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search cities or countries..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((city, i) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-white">{city.name}</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" /> {city.country}
                  </p>
                </div>
                <button
                  onClick={() => toggleLike(city.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition"
                >
                  <Heart
                    className={`h-5 w-5 transition ${
                      city.liked ? "fill-red-500 text-red-500" : "text-slate-500"
                    }`}
                  />
                </button>
              </div>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-sm">{city.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {city.costIndex}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {city.highlights.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs">
                      {h}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Best season: {city.bestSeason}
                </div>
                <Button
                  className="w-full mt-2"
                  variant="outline"
                  onClick={() => toast.info(`Adding ${city.name} to your trip...`)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Add to Trip
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
