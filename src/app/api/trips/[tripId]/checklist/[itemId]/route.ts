import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string; itemId: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, itemId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json().catch(() => ({}));
  const existing = await prisma.packingChecklist.findUnique({ where: { id: itemId } });
  const item = await prisma.packingChecklist.update({
    where: { id: itemId, tripId },
    data: { isPacked: body.isPacked ?? !existing?.isPacked },
  });
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, itemId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  await prisma.packingChecklist.delete({ where: { id: itemId, tripId } });
  return NextResponse.json({ ok: true });
}
