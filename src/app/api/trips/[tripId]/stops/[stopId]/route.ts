import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, parseDate, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string; stopId: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, stopId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const body = await request.json();
  const stop = await prisma.tripStop.update({
    where: { id: stopId, tripId },
    data: {
      stopOrder: body.stopOrder,
      arrivalDate: parseDate(body.arrivalDate),
      departureDate: parseDate(body.departureDate),
      notes: body.notes,
    },
    include: { city: true },
  });
  return NextResponse.json(stop);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, stopId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  await prisma.tripStop.delete({ where: { id: stopId, tripId } });
  return NextResponse.json({ ok: true });
}
