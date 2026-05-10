import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, jsonError, parseMoney, recalculateTripBudget, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canAccessTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const budget = await recalculateTripBudget(tripId);
  const items = await prisma.budgetItem.findMany({ where: { budgetId: budget.id }, include: { stop: { include: { city: true } } } });
  const breakdown = await prisma.budgetItem.groupBy({
    by: ["category"],
    where: { budgetId: budget.id },
    _sum: { estimatedAmount: true, actualAmount: true },
  });
  return NextResponse.json({ ...budget, items, breakdown });
}

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  await prisma.tripBudget.upsert({
    where: { tripId },
    create: { tripId, totalBudget: parseMoney(body.totalBudget), currency: body.currency ?? user.preferredCurrency ?? "INR" },
    update: { totalBudget: parseMoney(body.totalBudget), currency: body.currency },
  });
  const budget = await recalculateTripBudget(tripId);
  return NextResponse.json(budget);
}
