import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, jsonError, parseDate, parseMoney, recalculateTripBudget, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ stopId: string }> };

async function stopWithTrip(stopId: string) {
  return prisma.tripStop.findUnique({ where: { id: stopId }, include: { trip: true } });
}

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { stopId } = await context.params;
  const stop = await stopWithTrip(stopId);
  if (!stop || !(await canAccessTrip(stop.tripId, user.id))) return jsonError("Forbidden", 403);
  const activities = await prisma.stopActivity.findMany({
    where: { stopId },
    orderBy: { sortOrder: "asc" },
    include: { cityActivity: true },
  });
  return NextResponse.json(activities);
}

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { stopId } = await context.params;
  const stop = await stopWithTrip(stopId);
  if (!stop || !(await canEditTrip(stop.tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const activity = await prisma.stopActivity.create({
    data: {
      stopId,
      cityActivityId: body.cityActivityId,
      activityDate: parseDate(body.activityDate),
      startTime: body.startTime ?? null,
      endTime: body.endTime ?? null,
      actualCost: body.actualCost == null ? undefined : parseMoney(body.actualCost),
      status: body.status ?? "planned",
      sortOrder: Number(body.sortOrder ?? 0),
      notes: body.notes ?? null,
    },
    include: { cityActivity: true },
  });
  await recalculateTripBudget(stop.tripId);
  return NextResponse.json(activity, { status: 201 });
}
