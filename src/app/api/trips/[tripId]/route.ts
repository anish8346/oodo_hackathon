import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, jsonError, parseDate, requireUser, tripInclude } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canAccessTrip(tripId, user.id);
  if (!allowed) return jsonError("Trip not found", 404);
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: tripInclude });
  return NextResponse.json(trip);
}

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const body = await request.json();
  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      title: body.title,
      description: body.description,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      coverImageUrl: body.coverImageUrl,
      status: body.status,
      visibility: body.visibility,
    },
    include: tripInclude,
  });
  return NextResponse.json(trip);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  await prisma.trip.delete({ where: { id: tripId } });
  return NextResponse.json({ ok: true });
}
