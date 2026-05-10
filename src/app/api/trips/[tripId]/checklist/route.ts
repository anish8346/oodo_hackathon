import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, jsonError, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canAccessTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const items = await prisma.packingChecklist.findMany({ where: { tripId }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const item = await prisma.packingChecklist.create({
    data: { tripId, itemName: body.itemName, category: body.category ?? "other", sortOrder: Number(body.sortOrder ?? 0) },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  await prisma.packingChecklist.deleteMany({ where: { tripId } });
  return NextResponse.json({ ok: true });
}
