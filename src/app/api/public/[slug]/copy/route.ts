import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser, tripInclude } from "@/lib/traveloop";

type Context = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { slug } = await context.params;
  const share = await prisma.sharedItinerary.findUnique({
    where: { publicSlug: slug },
    include: { trip: { include: { stops: { include: { activities: true } }, budget: { include: { items: true } }, checklist: true } } },
  });
  if (!share?.isActive) return jsonError("Public itinerary not found", 404);

  const copied = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        ownerId: user.id,
        title: `${share.trip.title} (Copy)`,
        description: share.trip.description,
        startDate: share.trip.startDate,
        endDate: share.trip.endDate,
        coverImageUrl: share.trip.coverImageUrl,
        status: "planning",
        visibility: "private",
        members: { create: { userId: user.id, role: "owner" } },
        budget: share.trip.budget
          ? {
              create: {
                totalBudget: share.trip.budget.totalBudget,
                estimatedTotal: share.trip.budget.estimatedTotal,
                actualSpent: share.trip.budget.actualSpent,
                currency: share.trip.budget.currency,
                overBudgetAlert: share.trip.budget.overBudgetAlert,
              },
            }
          : undefined,
        checklist: {
          create: share.trip.checklist.map((item) => ({
            itemName: item.itemName,
            category: item.category,
            sortOrder: item.sortOrder,
          })),
        },
      },
    });
    const stopMap = new Map<string, string>();
    for (const sourceStop of share.trip.stops) {
      const stop = await tx.tripStop.create({
        data: {
          tripId: trip.id,
          cityId: sourceStop.cityId,
          stopOrder: sourceStop.stopOrder,
          arrivalDate: sourceStop.arrivalDate,
          departureDate: sourceStop.departureDate,
          notes: sourceStop.notes,
        },
      });
      stopMap.set(sourceStop.id, stop.id);
      await tx.stopActivity.createMany({
        data: sourceStop.activities.map((activity) => ({
          stopId: stop.id,
          cityActivityId: activity.cityActivityId,
          activityDate: activity.activityDate,
          startTime: activity.startTime,
          endTime: activity.endTime,
          actualCost: activity.actualCost,
          status: activity.status,
          sortOrder: activity.sortOrder,
          notes: activity.notes,
        })),
      });
    }
    const budget = await tx.tripBudget.findUnique({ where: { tripId: trip.id } });
    if (budget && share.trip.budget) {
      await tx.budgetItem.createMany({
        data: share.trip.budget.items.map((item) => ({
          budgetId: budget.id,
          stopId: item.stopId ? stopMap.get(item.stopId) ?? null : null,
          category: item.category,
          label: item.label,
          estimatedAmount: item.estimatedAmount,
          actualAmount: item.actualAmount,
          currency: item.currency,
          itemDate: item.itemDate,
        })),
      });
    }
    await tx.sharedItinerary.update({ where: { id: share.id }, data: { copyCount: { increment: 1 } } });
    return tx.trip.findUniqueOrThrow({ where: { id: trip.id }, include: tripInclude });
  });

  return NextResponse.json(copied, { status: 201 });
}
