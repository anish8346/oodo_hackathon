import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseDate, requireUser, tripInclude } from "@/lib/traveloop";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const trips = await prisma.trip.findMany({
    where: { OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }] },
    orderBy: { createdAt: "desc" },
    include: {
      stops: { include: { city: true }, orderBy: { stopOrder: "asc" } },
      budget: true,
      members: true,
    },
  });
  return NextResponse.json(trips);
}

export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = await request.json();
  if (!body.title?.trim()) return jsonError("Trip title is required.");
  const trip = await prisma.trip.create({
    data: {
      ownerId: user.id,
      title: body.title.trim(),
      description: body.description ?? null,
      startDate: parseDate(body.startDate),
      endDate: parseDate(body.endDate),
      coverImageUrl: body.coverImageUrl ?? null,
      status: body.status ?? "planning",
      visibility: body.visibility ?? "private",
      members: { create: { userId: user.id, role: "owner" } },
      budget: { create: { totalBudget: body.totalBudget ?? 0, currency: body.currency ?? user.preferredCurrency } },
    },
    include: tripInclude,
  });
  return NextResponse.json(trip, { status: 201 });
}
