import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient, Prisma } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const cityImages: Record<string, string> = {
  Paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  Tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
  Bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  "New York City": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80",
  Rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80",
  Bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  London: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
  Istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=80",
};

const citySeeds = [
  ["Paris", "France", "Europe", 4.2, 98],
  ["Tokyo", "Japan", "Asia", 4.5, 96],
  ["Bali", "Indonesia", "Asia", 2.1, 94],
  ["New York City", "United States", "North America", 4.8, 95],
  ["Rome", "Italy", "Europe", 3.8, 93],
  ["Bangkok", "Thailand", "Asia", 2.4, 91],
  ["Dubai", "United Arab Emirates", "Middle East", 4.6, 90],
  ["London", "United Kingdom", "Europe", 4.7, 92],
  ["Singapore", "Singapore", "Asia", 4.3, 89],
  ["Istanbul", "Turkiye", "Europe", 2.8, 88],
] as const;

const categories = ["sightseeing", "food", "adventure", "culture", "shopping"];

function money(value: number) {
  return new Prisma.Decimal(value);
}

async function main() {
  await prisma.savedDestination.deleteMany();
  await prisma.sharedItinerary.deleteMany();
  await prisma.tripNote.deleteMany();
  await prisma.packingChecklist.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.tripBudget.deleteMany();
  await prisma.stopActivity.deleteMany();
  await prisma.cityActivity.deleteMany();
  await prisma.tripStop.deleteMany();
  await prisma.tripMember.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.city.deleteMany();
  await prisma.user.deleteMany();

  const password = await hash("traveloop123", 12);
  const users = await Promise.all(
    [
      ["Ava", "Admin", "admin@traveloop.test", true],
      ["Maya", "Shah", "maya@traveloop.test", false],
      ["Arjun", "Mehta", "arjun@traveloop.test", false],
      ["Lina", "Patel", "lina@traveloop.test", false],
      ["Noah", "Reed", "noah@traveloop.test", false],
    ].map(([firstName, lastName, email, isAdmin]) =>
      prisma.user.create({
        data: {
          firstName: firstName as string,
          lastName: lastName as string,
          name: `${firstName} ${lastName}`,
          email: email as string,
          password,
          emailVerified: new Date(),
          isAdmin: Boolean(isAdmin),
          city: "Pune",
          country: "India",
          preferredCurrency: "USD",
        },
      })
    )
  );

  const cities = new Map<string, Awaited<ReturnType<typeof prisma.city.create>>>();
  for (const [name, country, region, costIndex, popularityScore] of citySeeds) {
    const city = await prisma.city.create({
      data: {
        name,
        country,
        region,
        costIndex,
        popularityScore,
        imageUrl: cityImages[name],
        description: `${name} blends iconic landmarks, local flavors, and flexible trip pacing for multi-city planners.`,
        activities: {
          create: categories.map((category, index) => ({
            title: `${name} ${category} experience`,
            description: `A curated ${category} stop in ${name}.`,
            category,
            imageUrl: cityImages[name],
            estimatedCost: money(20 + index * 18 + Math.round(costIndex * 10)),
            currency: "USD",
            durationMinutes: 90 + index * 30,
            avgRating: 4.2 + index * 0.12,
            isPopular: index < 2,
          })),
        },
      },
    });
    cities.set(name, city);
  }

  const owner = users[1];
  const paris = cities.get("Paris")!;
  const rome = cities.get("Rome")!;
  const tokyo = cities.get("Tokyo")!;
  const bali = cities.get("Bali")!;

  const euroTrip = await prisma.trip.create({
    data: {
      ownerId: owner.id,
      title: "Europe Golden Loop",
      description: "A culture-first route through Paris and Rome.",
      startDate: new Date("2026-06-12"),
      endDate: new Date("2026-06-21"),
      coverImageUrl: paris.imageUrl,
      status: "planning",
      visibility: "shared",
      budget: { create: { totalBudget: money(4200), estimatedTotal: money(980), actualSpent: money(260), currency: "USD" } },
      members: { create: [{ userId: owner.id, role: "owner" }, { userId: users[2].id, role: "editor" }] },
      checklist: {
        create: [
          { itemName: "Passport", category: "documents", isPacked: true },
          { itemName: "Walking shoes", category: "clothing" },
          { itemName: "Universal adapter", category: "electronics" },
        ],
      },
    },
  });

  const asiaTrip = await prisma.trip.create({
    data: {
      ownerId: users[2].id,
      title: "Asia Food Trail",
      description: "Tokyo precision followed by Bali calm.",
      startDate: new Date("2026-08-04"),
      endDate: new Date("2026-08-15"),
      coverImageUrl: tokyo.imageUrl,
      status: "planning",
      budget: { create: { totalBudget: money(3600), estimatedTotal: money(840), actualSpent: money(120), currency: "USD" } },
      members: { create: [{ userId: users[2].id, role: "owner" }] },
      checklist: { create: [{ itemName: "Camera", category: "electronics" }, { itemName: "Swimwear", category: "clothing" }] },
    },
  });

  for (const [trip, orderedCities] of [
    [euroTrip, [paris, rome]],
    [asiaTrip, [tokyo, bali]],
  ] as const) {
    for (const [index, city] of orderedCities.entries()) {
      const stop = await prisma.tripStop.create({
        data: {
          tripId: trip.id,
          cityId: city.id,
          stopOrder: index + 1,
          arrivalDate: new Date(index === 0 ? trip.startDate! : new Date(trip.startDate!.getTime() + 5 * 86400000)),
          departureDate: new Date(index === 0 ? new Date(trip.startDate!.getTime() + 4 * 86400000) : trip.endDate!),
          notes: `Stay close to central ${city.name}.`,
        },
      });
      const activities = await prisma.cityActivity.findMany({ where: { cityId: city.id }, take: 2 });
      await prisma.stopActivity.createMany({
        data: activities.map((activity, activityIndex) => ({
          stopId: stop.id,
          cityActivityId: activity.id,
          activityDate: stop.arrivalDate,
          startTime: `${10 + activityIndex * 3}:00`,
          endTime: `${12 + activityIndex * 3}:00`,
          sortOrder: activityIndex,
        })),
      });
      const budget = await prisma.tripBudget.findUniqueOrThrow({ where: { tripId: trip.id } });
      await prisma.budgetItem.createMany({
        data: [
          { budgetId: budget.id, stopId: stop.id, category: "stay", label: `${city.name} hotel`, estimatedAmount: money(320), actualAmount: money(0) },
          { budgetId: budget.id, stopId: stop.id, category: "meals", label: `${city.name} food fund`, estimatedAmount: money(180), actualAmount: money(60) },
        ],
      });
      await prisma.tripNote.create({
        data: {
          tripId: trip.id,
          userId: trip.ownerId,
          stopId: stop.id,
          title: `${city.name} day plan`,
          content: "Leave room for one unplanned local recommendation.",
          noteDate: stop.arrivalDate ?? new Date(),
        },
      });
    }
  }

  await prisma.sharedItinerary.create({
    data: { tripId: euroTrip.id, publicSlug: "europe-golden-loop", isActive: true },
  });
  await prisma.savedDestination.create({ data: { userId: owner.id, cityId: bali.id } });

  console.log("Seeded Traveloop demo data. Login with admin@traveloop.test / traveloop123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
