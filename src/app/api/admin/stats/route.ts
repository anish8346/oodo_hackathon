import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/traveloop";

const chartColors = ["#2563eb", "#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b"];

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
}

function lastSixMonths() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      month: monthLabel(date),
      start: date,
    };
  });
}

function userName(user?: { firstName?: string | null; lastName?: string | null; name?: string | null; email?: string | null }) {
  return user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Traveler";
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Forbidden", 403);

  const months = lastSixMonths();
  const [
    users,
    trips,
    activeUsers,
    tripChartRows,
    stops,
    activitiesAdded,
    budgetEntries,
    sharedTrips,
    recentUsers,
    recentTrips,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.user.count({
      where: {
        OR: [
          { ownedTrips: { some: {} } },
          { memberships: { some: {} } },
          { notes: { some: {} } },
          { savedDestinations: { some: {} } },
        ],
      },
    }),
    prisma.trip.findMany({
      where: { createdAt: { gte: months[0].start } },
      select: { createdAt: true },
    }),
    prisma.tripStop.findMany({ include: { city: { select: { name: true } } } }),
    prisma.stopActivity.count(),
    prisma.budgetItem.count(),
    prisma.sharedItinerary.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: { select: { ownedTrips: true, memberships: true } },
      },
    }),
    prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        owner: { select: { firstName: true, lastName: true, name: true, email: true } },
        stops: { select: { id: true } },
      },
    }),
  ]);

  const tripsOverTime = months.map(({ key, month }) => ({
    month,
    trips: tripChartRows.filter((trip) => {
      const created = trip.createdAt;
      const tripKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
      return tripKey === key;
    }).length,
  }));

  const cityCounts = stops.reduce<Record<string, number>>((acc, stop) => {
    const name = stop.city?.name || "Unknown";
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});

  const topCities = Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, tripCount], index) => ({ name, trips: tripCount, color: chartColors[index % chartColors.length] }));

  return NextResponse.json({
    totals: {
      users,
      trips,
      activeUsers,
      activities: activitiesAdded,
    },
    tripsOverTime,
    topCities,
    userEngagement: [
      { activity: "Trips Created", value: trips },
      { activity: "Activities Added", value: activitiesAdded },
      { activity: "Budget Entries", value: budgetEntries },
      { activity: "Shared Trips", value: sharedTrips },
    ],
    recentUsers: recentUsers.map((user) => ({
      id: user.id,
      name: userName(user),
      email: user.email,
      joined: user.createdAt,
      trips: user._count.ownedTrips + user._count.memberships,
      avatar: user.image,
    })),
    recentTrips: recentTrips.map((trip) => ({
      id: trip.id,
      title: trip.title,
      user: userName(trip.owner),
      cities: trip.stops.length,
      status: trip.status,
    })),
  });
}
