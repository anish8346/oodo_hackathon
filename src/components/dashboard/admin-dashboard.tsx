"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Plane, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AdminStats = {
  totals: { users: number; trips: number; activeUsers: number; activities: number };
  tripsOverTime: { month: string; trips: number }[];
  topCities: { name: string; trips: number; color: string }[];
  userEngagement: { activity: string; value: number }[];
  recentUsers: { id: string; name: string; email: string; joined: string; trips: number; avatar?: string | null }[];
  recentTrips: { id: string; title: string; user: string; cities: number; status: string }[];
};

function compact(value: number) {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function relativeTime(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function statusVariant(status: string): "default" | "secondary" | "outline" {
  if (status.toLowerCase() === "completed") return "secondary";
  if (status.toLowerCase() === "planning") return "outline";
  return "default";
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/stats");
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error ?? "Could not load admin dashboard");
        setStats(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load admin dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = useMemo(() => {
    const totals = stats?.totals ?? { users: 0, trips: 0, activeUsers: 0, activities: 0 };
    return [
      { label: "Total Users", value: compact(totals.users), icon: Users, color: "text-blue-700" },
      { label: "Trips Created", value: compact(totals.trips), icon: Plane, color: "text-cyan-700" },
      { label: "Active Users", value: compact(totals.activeUsers), icon: TrendingUp, color: "text-emerald-700" },
      { label: "Total Activities", value: compact(totals.activities), icon: Activity, color: "text-[#0f766E]" },
    ];
  }, [stats]);

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-xl bg-slate-200" />)}</div>;
  }

  if (!stats) {
    return <Card><CardContent className="p-8 text-center text-sm text-slate-500">Admin analytics are unavailable.</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and user activity</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl bg-slate-100 p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-emerald-700">Live</Badge>
                </div>
                <p className="mb-1 text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Trips Created Over Time</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.tripsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="trips" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader><CardTitle>Top Destinations</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.topCities}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ payload }) => {
                        const city = payload as { name?: string; trips?: number };
                        return `${city.name ?? "City"}: ${city.trips ?? 0}`;
                      }}
                      outerRadius={82}
                      dataKey="trips"
                    >
                      {stats.topCities.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader><CardTitle>User Engagement Metrics</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.userEngagement}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="activity" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-slate-100">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar>
                        {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium">{user.trips} trips</p>
                      <p className="text-xs text-muted-foreground">{relativeTime(user.joined)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle>Recent Trips</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-slate-100">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{trip.title}</p>
                      <p className="text-sm text-muted-foreground">by {trip.user} - {trip.cities} cities</p>
                    </div>
                    <Badge variant={statusVariant(trip.status)}>{trip.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
