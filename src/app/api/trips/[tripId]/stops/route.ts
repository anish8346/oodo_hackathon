import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, createDayNotesForStop, jsonError, parseDate, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canAccessTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const stops = await prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { stopOrder: "asc" },
    include: { city: true, activities: { include: { cityActivity: true }, orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(stops);
}

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const body = await request.json();
  const city = await prisma.city.findUnique({ where: { id: body.cityId } });
  if (!city) return jsonError("City not found", 404);
  const count = await prisma.tripStop.count({ where: { tripId } });
  const stop = await prisma.tripStop.create({
    data: {
      tripId,
      cityId: city.id,
      stopOrder: Number(body.stopOrder ?? count + 1),
      arrivalDate: parseDate(body.arrivalDate),
      departureDate: parseDate(body.departureDate),
      notes: body.notes ?? null,
    },
    include: { city: true },
  });
  await createDayNotesForStop({
    tripId,
    userId: user.id,
    stopId: stop.id,
    cityName: city.name,
    arrivalDate: stop.arrivalDate ?? undefined,
    departureDate: stop.departureDate ?? undefined,
  });
  return NextResponse.json(stop, { status: 201 });
}
