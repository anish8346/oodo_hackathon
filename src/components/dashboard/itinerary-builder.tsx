"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  GripVertical,
  MapPin,
  Plus,
  Trash2,
  Utensils,
  Camera,
  Footprints,
  Hotel,
  Plane,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

type Activity = {
  id: string;
  title: string;
  time: string;
  type: "sightseeing" | "food" | "transport" | "hotel" | "activity";
  location: string;
  notes: string;
};

type Day = {
  id: string;
  date: string;
  label: string;
  activities: Activity[];
  isExpanded: boolean;
};

const typeIcons: Record<Activity["type"], React.ReactNode> = {
  sightseeing: <Camera className="h-4 w-4" />,
  food: <Utensils className="h-4 w-4" />,
  transport: <Plane className="h-4 w-4" />,
  hotel: <Hotel className="h-4 w-4" />,
  activity: <Footprints className="h-4 w-4" />,
};

const typeColors: Record<Activity["type"], string> = {
  sightseeing: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  hotel: "bg-emerald-100 text-emerald-700",
  activity: "bg-pink-100 text-pink-700",
};

const initialDays: Day[] = [
  {
    id: "day-1",
    date: "May 24",
    label: "Day 1 — Arrival",
    isExpanded: true,
    activities: [
      { id: "a1", title: "Flight to Kyoto", time: "09:00 AM", type: "transport", location: "KIX Airport", notes: "" },
      { id: "a2", title: "Hotel Check-in", time: "02:00 PM", type: "hotel", location: "Hotel Granvia Kyoto", notes: "Early check-in confirmed" },
      { id: "a3", title: "Nishiki Market", time: "04:00 PM", type: "sightseeing", location: "Nishiki Market", notes: "Try matcha desserts" },
      { id: "a4", title: "Dinner at Gion", time: "07:00 PM", type: "food", location: "Gion District", notes: "Reservation under John" },
    ],
  },
  {
    id: "day-2",
    date: "May 25",
    label: "Day 2 — Temples",
    isExpanded: false,
    activities: [
      { id: "a5", title: "Fushimi Inari Shrine", time: "07:00 AM", type: "sightseeing", location: "Fushimi, Kyoto", notes: "Go early to avoid crowds" },
      { id: "a6", title: "Kinkaku-ji (Golden Pavilion)", time: "11:00 AM", type: "sightseeing", location: "Kinkaku-ji", notes: "" },
      { id: "a7", title: "Ramen Lunch", time: "01:00 PM", type: "food", location: "Ichiran Ramen", notes: "" },
      { id: "a8", title: "Bamboo Grove Walk", time: "03:00 PM", type: "activity", location: "Arashiyama", notes: "Bring camera" },
    ],
  },
  {
    id: "day-3",
    date: "May 26",
    label: "Day 3 — Day Trip to Nara",
    isExpanded: false,
    activities: [
      { id: "a9", title: "Train to Nara", time: "08:30 AM", type: "transport", location: "JR Nara Line", notes: "Use JR Pass" },
      { id: "a10", title: "Nara Park & Deer", time: "10:00 AM", type: "activity", location: "Nara Park", notes: "Buy deer crackers at entrance" },
      { id: "a11", title: "Todai-ji Temple", time: "12:00 PM", type: "sightseeing", location: "Todai-ji", notes: "" },
      { id: "a12", title: "Return to Kyoto", time: "05:00 PM", type: "transport", location: "JR Nara Line", notes: "" },
    ],
  },
];

export function ItineraryBuilder() {
  const [days, setDays] = useState<Day[]>(initialDays);

  function toggleDay(dayId: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId ? { ...d, isExpanded: !d.isExpanded } : d
      )
    );
  }

  function deleteActivity(dayId: string, activityId: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((a) => a.id !== activityId) }
          : d
      )
    );
    toast.success("Activity removed");
  }

  function addActivity(dayId: string) {
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: "",
      time: "",
      type: "activity",
      location: "",
      notes: "",
    };
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, newActivity], isExpanded: true }
          : d
      )
    );
  }

  function addDay() {
    const newDay: Day = {
      id: `day-${Date.now()}`,
      date: "",
      label: `Day ${days.length + 1}`,
      isExpanded: true,
      activities: [],
    };
    setDays((prev) => [...prev, newDay]);
    toast.success("New day added");
  }

  function updateActivity(
    dayId: string,
    activityId: string,
    field: keyof Activity,
    value: string
  ) {
    setDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? {
              ...d,
              activities: d.activities.map((a) =>
                a.id === activityId ? { ...a, [field]: value } : a
              ),
            }
          : d
      )
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Itinerary Builder</h1>
          <p className="text-muted-foreground mt-1">
            Kyoto Spring Escape — {days.length} days planned
          </p>
        </div>
        <Button onClick={addDay}>
          <Plus className="h-5 w-5 mr-2" />
          Add Day
        </Button>
      </div>

      <div className="space-y-4">
        {days.map((day, dayIndex) => (
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.05 }}
          >
            <Card>
              <button
                type="button"
                onClick={() => toggleDay(day.id)}
                className="flex w-full items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                    {dayIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{day.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {day.date || "Date TBD"} · {day.activities.length} activities
                    </p>
                  </div>
                </div>
                {day.isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {day.isExpanded && (
                <CardContent className="px-6 pb-6 pt-0">
                  <div className="space-y-3">
                    {day.activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-all"
                      >
                        <div className="mt-1 cursor-grab text-slate-300 hover:text-slate-500">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div
                          className={`mt-1 flex h-8 w-8 items-center justify-center rounded-lg ${
                            typeColors[activity.type]
                          }`}
                        >
                          {typeIcons[activity.type]}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <Input
                            value={activity.title}
                            onChange={(e) =>
                              updateActivity(day.id, activity.id, "title", e.target.value)
                            }
                            placeholder="Activity title"
                            className="font-medium border-none shadow-none px-0 focus-visible:ring-0 h-auto text-base"
                          />
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <Input
                                value={activity.time}
                                onChange={(e) =>
                                  updateActivity(day.id, activity.id, "time", e.target.value)
                                }
                                placeholder="Time"
                                className="h-auto w-24 border-none shadow-none px-0 py-0 text-sm focus-visible:ring-0"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <Input
                                value={activity.location}
                                onChange={(e) =>
                                  updateActivity(day.id, activity.id, "location", e.target.value)
                                }
                                placeholder="Location"
                                className="h-auto w-36 border-none shadow-none px-0 py-0 text-sm focus-visible:ring-0"
                              />
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          {activity.notes && (
                            <p className="text-xs text-muted-foreground italic">
                              {activity.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteActivity(day.id, activity.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4 w-full border-dashed"
                    onClick={() => addActivity(day.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
