"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  Globe,
  ImagePlus,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const coverOptions = [
  "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80",
];

export function CreateTrip() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [destinations, setDestinations] = useState<string[]>([""]);
  const [travelers, setTravelers] = useState<string[]>([""]);
  const [selectedCover, setSelectedCover] = useState(0);
  const [loading, setLoading] = useState(false);

  function addDestination() {
    setDestinations((prev) => [...prev, ""]);
  }

  function removeDestination(index: number) {
    setDestinations((prev) => prev.filter((_, i) => i !== index));
  }

  function updateDestination(index: number, value: string) {
    setDestinations((prev) => prev.map((d, i) => (i === index ? value : d)));
  }

  function addTraveler() {
    setTravelers((prev) => [...prev, ""]);
  }

  function removeTraveler(index: number) {
    setTravelers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTraveler(index: number, value: string) {
    setTravelers((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a trip title");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          startDate,
          endDate,
          totalBudget: budget,
          currency: "INR",
          coverImageUrl: coverOptions[selectedCover],
          destinations: destinations.map((destination) => destination.trim()).filter(Boolean),
          travelers: travelers.map((traveler) => traveler.trim()).filter(Boolean),
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create trip");
      }

      toast.success("Trip created successfully");
      router.push("/dashboard/trips");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create trip");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Trip</h1>
            <p className="text-muted-foreground mt-1">
              Plan your next adventure step by step
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image Selection */}
          <Card>
            <CardContent className="p-6">
              <Label className="text-base font-semibold mb-4 block">
                <ImagePlus className="inline h-5 w-5 mr-2" />
                Cover Image
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {coverOptions.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCover(i)}
                    className={`relative h-28 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedCover === i
                        ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-[1.02]"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Cover ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Trip Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Mumbai Jaipur Goa Circuit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Food walks, forts, beaches, train routes, and local stays..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start" className="text-base font-semibold">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Start Date
                  </Label>
                  <Input
                    id="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end" className="text-base font-semibold">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    End Date
                  </Label>
                  <Input
                    id="end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-base font-semibold">
                  <IndianRupee className="inline h-4 w-4 mr-1" />
                  Budget (INR)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="75000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Destinations */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  <MapPin className="inline h-5 w-5 mr-2" />
                  Destinations
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addDestination}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {destinations.map((dest, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={i === 0 ? "Mumbai" : i === 1 ? "Jaipur" : `Destination ${i + 1}`}
                    value={dest}
                    onChange={(e) => updateDestination(i, e.target.value)}
                  />
                  {destinations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDestination(i)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Travelers */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  <Users className="inline h-5 w-5 mr-2" />
                  Travelers
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addTraveler}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {travelers.map((traveler, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    placeholder={`Traveler ${i + 1} name`}
                    value={traveler}
                    onChange={(e) => updateTraveler(i, e.target.value)}
                  />
                  {travelers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTraveler(i)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating...
                </span>
              ) : (
                <>
                  <Globe className="h-5 w-5 mr-2" />
                  Create Trip
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
