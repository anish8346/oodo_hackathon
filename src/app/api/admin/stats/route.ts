import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/traveloop";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Forbidden", 403);
  const [users, trips, topCities] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.city.findMany({ orderBy: { popularityScore: "desc" }, take: 5 }),
  ]);
  return NextResponse.json({ users, trips, topCities });
}
