import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient, Prisma } from "../src/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const cityImages: Record<string, string> = {
  Mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80",
  Jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80",
  Goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80",
  Varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80",
  Delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80",
  Kochi: "https://images.unsplash.com/photo-1590123717647-9d89d3be5289?auto=format&fit=crop&w=900&q=80",
  Udaipur: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=900&q=80",
  Rishikesh: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80",
  Bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80",
  Shillong: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=900&q=80",
};

const citySeeds = [
  ["Mumbai", "India", "West India", 2.8, 98],
  ["Jaipur", "India", "North India", 2.1, 96],
  ["Goa", "India", "West India", 2.6, 95],
  ["Varanasi", "India", "North India", 1.8, 94],
  ["Delhi", "India", "North India", 2.5, 93],
  ["Kochi", "India", "South India", 2.2, 91],
  ["Udaipur", "India", "North India", 2.4, 90],
  ["Rishikesh", "India", "North India", 1.9, 89],
  ["Bengaluru", "India", "South India", 2.7, 88],
  ["Shillong", "India", "North East India", 2.0, 87],
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

  const adminPassword = await hash("traveloop123", 12);
  const userPassword = await hash("user@1234", 12);
  const users = await Promise.all(
    [
      ["Ava", "Admin", "admin@traveloop.test", adminPassword, true],
      ["Demo", "User", "user@gmail.com", userPassword, false],
      ["Arjun", "Mehta", "arjun@traveloop.test", userPassword, false],
      ["Lina", "Patel", "lina@traveloop.test", userPassword, false],
      ["Noah", "Reed", "noah@traveloop.test", userPassword, false],
    ].map(([firstName, lastName, email, password, isAdmin]) =>
      prisma.user.create({
        data: {
          firstName: firstName as string,
          lastName: lastName as string,
          name: `${firstName} ${lastName}`,
          email: email as string,
          password: password as string,
          emailVerified: new Date(),
          isAdmin: Boolean(isAdmin),
          city: "Pune",
          country: "India",
          preferredCurrency: "INR",
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
            description: `A curated ${category} stop in ${name} with Indian travel pacing in mind.`,
            category,
            imageUrl: cityImages[name],
            estimatedCost: money(500 + index * 900 + Math.round(costIndex * 250)),
            currency: "INR",
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
  const mumbai = cities.get("Mumbai")!;
  const jaipur = cities.get("Jaipur")!;
  const goa = cities.get("Goa")!;
  const varanasi = cities.get("Varanasi")!;

  const westIndiaTrip = await prisma.trip.create({
    data: {
      ownerId: owner.id,
      title: "Mumbai Jaipur Goa Circuit",
      description: "A culture, food, fort, and beach route across West and North India.",
      startDate: new Date("2026-06-12"),
      endDate: new Date("2026-06-21"),
      coverImageUrl: mumbai.imageUrl,
      status: "planning",
      visibility: "shared",
      budget: { create: { totalBudget: money(85000), estimatedTotal: money(32000), actualSpent: money(9000), currency: "INR" } },
      members: { create: [{ userId: owner.id, role: "owner" }, { userId: users[2].id, role: "editor" }] },
      checklist: {
        create: [
          { itemName: "Aadhaar or ID proof", category: "documents", isPacked: true },
          { itemName: "Comfortable walking shoes", category: "clothing" },
          { itemName: "UPI backup and power bank", category: "electronics" },
        ],
      },
    },
  });

  const spiritualTrip = await prisma.trip.create({
    data: {
      ownerId: users[2].id,
      title: "Varanasi Goa Slow Travel",
      description: "Ganga aarti, old-city lanes, seafood shacks, and relaxed coastal time.",
      startDate: new Date("2026-08-04"),
      endDate: new Date("2026-08-15"),
      coverImageUrl: varanasi.imageUrl,
      status: "planning",
      budget: { create: { totalBudget: money(65000), estimatedTotal: money(24000), actualSpent: money(4000), currency: "INR" } },
      members: { create: [{ userId: users[2].id, role: "owner" }] },
      checklist: { create: [{ itemName: "Camera", category: "electronics" }, { itemName: "Light cotton clothes", category: "clothing" }] },
    },
  });

  for (const [trip, orderedCities] of [
    [westIndiaTrip, [mumbai, jaipur, goa]],
    [spiritualTrip, [varanasi, goa]],
  ] as const) {
    for (const [index, city] of orderedCities.entries()) {
      const stop = await prisma.tripStop.create({
        data: {
          tripId: trip.id,
          cityId: city.id,
          stopOrder: index + 1,
          arrivalDate: new Date(index === 0 ? trip.startDate! : new Date(trip.startDate!.getTime() + 5 * 86400000)),
          departureDate: new Date(index === 0 ? new Date(trip.startDate!.getTime() + 4 * 86400000) : trip.endDate!),
          notes: `Stay near convenient rail, metro, or local taxi access in ${city.name}.`,
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
          { budgetId: budget.id, stopId: stop.id, category: "stay", label: `${city.name} stay`, estimatedAmount: money(8000), actualAmount: money(0), currency: "INR" },
          { budgetId: budget.id, stopId: stop.id, category: "meals", label: `${city.name} food fund`, estimatedAmount: money(3500), actualAmount: money(1200), currency: "INR" },
        ],
      });
      await prisma.tripNote.create({
        data: {
          tripId: trip.id,
          userId: trip.ownerId,
          stopId: stop.id,
          title: `${city.name} day plan`,
          content: "Leave room for local food, market time, and transport delays.",
          noteDate: stop.arrivalDate ?? new Date(),
        },
      });
    }
  }

  await prisma.sharedItinerary.create({
    data: { tripId: westIndiaTrip.id, publicSlug: "mumbai-jaipur-goa-circuit", isActive: true },
  });
  await prisma.savedDestination.create({ data: { userId: owner.id, cityId: goa.id } });

  console.log("Seeded Traveloop demo data.");
  console.log("Admin login: admin@traveloop.test / traveloop123");
  console.log("User login: user@gmail.com / user@1234");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
