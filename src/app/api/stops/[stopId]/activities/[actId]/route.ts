import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, parseDate, parseMoney, recalculateTripBudget, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ stopId: string; actId: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { stopId, actId } = await context.params;
  const stop = await prisma.tripStop.findUnique({ where: { id: stopId } });
  if (!stop || !(await canEditTrip(stop.tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const activity = await prisma.stopActivity.update({
    where: { id: actId, stopId },
    data: {
      activityDate: parseDate(body.activityDate),
      startTime: body.startTime,
      endTime: body.endTime,
      actualCost: body.actualCost == null ? undefined : parseMoney(body.actualCost),
      status: body.status,
      sortOrder: body.sortOrder,
      notes: body.notes,
    },
    include: { cityActivity: true },
  });
  await recalculateTripBudget(stop.tripId);
  return NextResponse.json(activity);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { stopId, actId } = await context.params;
  const stop = await prisma.tripStop.findUnique({ where: { id: stopId } });
  if (!stop || !(await canEditTrip(stop.tripId, user.id))) return jsonError("Forbidden", 403);
  await prisma.stopActivity.delete({ where: { id: actId, stopId } });
  await recalculateTripBudget(stop.tripId);
  return NextResponse.json({ ok: true });
}
