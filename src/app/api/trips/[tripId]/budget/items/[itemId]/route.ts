import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, parseDate, parseMoney, recalculateTripBudget, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string; itemId: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, itemId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const budget = await prisma.tripBudget.findUnique({ where: { tripId } });
  if (!budget) return jsonError("Budget not found", 404);
  const item = await prisma.budgetItem.update({
    where: { id: itemId, budgetId: budget.id },
    data: {
      stopId: body.stopId,
      category: body.category,
      label: body.label,
      estimatedAmount: body.estimatedAmount == null ? undefined : parseMoney(body.estimatedAmount),
      actualAmount: body.actualAmount == null ? undefined : parseMoney(body.actualAmount),
      currency: body.currency,
      itemDate: parseDate(body.itemDate),
    },
  });
  await recalculateTripBudget(tripId);
  return NextResponse.json(item);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, itemId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  await prisma.budgetItem.delete({ where: { id: itemId } });
  await recalculateTripBudget(tripId);
  return NextResponse.json({ ok: true });
}
