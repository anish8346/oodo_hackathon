import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, parseDate, parseMoney, recalculateTripBudget, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const budget = await prisma.tripBudget.upsert({ where: { tripId }, create: { tripId }, update: {} });
  const item = await prisma.budgetItem.create({
    data: {
      budgetId: budget.id,
      stopId: body.stopId || null,
      category: body.category ?? "other",
      label: body.label ?? null,
      estimatedAmount: parseMoney(body.estimatedAmount),
      actualAmount: parseMoney(body.actualAmount),
      currency: body.currency ?? budget.currency,
      itemDate: parseDate(body.itemDate),
    },
  });
  await recalculateTripBudget(tripId);
  return NextResponse.json(item, { status: 201 });
}
