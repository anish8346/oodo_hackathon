import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, parseDate, parseMoney, requireUser, tripInclude } from "@/lib/traveloop";

const indianCityImages: Record<string, string> = {
  Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
  Jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
  Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80",
};

function normalizeList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

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
  const destinationNames = normalizeList(body.destinations);
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
      budget: { create: { totalBudget: parseMoney(body.totalBudget), currency: body.currency ?? user.preferredCurrency ?? "INR" } },
    },
    include: tripInclude,
  });

  for (const [index, name] of destinationNames.entries()) {
    const city =
      (await prisma.city.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
      })) ??
      (await prisma.city.create({
        data: {
          name,
          country: "India",
          region: "India",
          costIndex: 2,
          popularityScore: 70,
          imageUrl: indianCityImages[name] ?? body.coverImageUrl ?? null,
          description: `${name} is an India-focused stop with local food, culture, transport, and flexible pacing for the route.`,
        },
      }));

    await prisma.tripStop.create({
      data: {
        tripId: trip.id,
        cityId: city.id,
        stopOrder: index + 1,
        arrivalDate: index === 0 ? parseDate(body.startDate) : undefined,
        departureDate: index === destinationNames.length - 1 ? parseDate(body.endDate) : undefined,
        notes: `Plan local transport, food stops, and stay near the main ${city.name} travel area.`,
      },
    });
  }

  const createdTrip = await prisma.trip.findUniqueOrThrow({
    where: { id: trip.id },
    include: tripInclude,
  });
  return NextResponse.json(createdTrip, { status: 201 });
}
