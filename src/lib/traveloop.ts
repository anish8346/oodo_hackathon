import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/client";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!user?.isAdmin) return null;
  return user;
}

export async function canAccessTrip(tripId: string, userId: string, roles?: string[]) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      OR: [{ ownerId: userId }, { members: { some: { userId, ...(roles ? { role: { in: roles } } : {}) } } }],
    },
    include: { members: true },
  });
  return trip;
}

export async function canEditTrip(tripId: string, userId: string) {
  return canAccessTrip(tripId, userId, ["owner", "editor"]);
}

export function parseDate(value: unknown) {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function parseMoney(value: unknown) {
  const number = Number(value ?? 0);
  return new Prisma.Decimal(Number.isFinite(number) ? number : 0);
}

export function publicTripUrl(slug: string) {
  return `/trip/${slug}`;
}

export function createSlug() {
  return randomBytes(8).toString("hex");
}

export async function savePublicUpload(file: File, folder: string) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image uploads are supported.");
  }
  if (file.size > 2_500_000) {
    throw new Error("Image must be under 2.5 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "png";
  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "traveloop";
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);
  return `/uploads/${safeFolder}/${filename}`;
}

export async function recalculateTripBudget(tripId: string) {
  const budget = await prisma.tripBudget.upsert({
    where: { tripId },
    create: { tripId },
    update: {},
  });

  const [activityAgg, itemAgg] = await Promise.all([
    prisma.stopActivity.findMany({
      where: { stop: { tripId } },
      include: { cityActivity: { select: { estimatedCost: true } } },
    }),
    prisma.budgetItem.aggregate({
      where: { budgetId: budget.id },
      _sum: { estimatedAmount: true, actualAmount: true },
    }),
  ]);

  const activityEstimated = activityAgg.reduce(
    (sum, item) => sum.plus(item.cityActivity.estimatedCost),
    new Prisma.Decimal(0)
  );
  const itemEstimated = itemAgg._sum.estimatedAmount ?? new Prisma.Decimal(0);
  const actualSpent = itemAgg._sum.actualAmount ?? new Prisma.Decimal(0);
  const estimatedTotal = activityEstimated.plus(itemEstimated);

  return prisma.tripBudget.update({
    where: { id: budget.id },
    data: {
      estimatedTotal,
      actualSpent,
      overBudgetAlert: estimatedTotal.gt(budget.totalBudget),
    },
  });
}

export async function createDayNotesForStop(input: {
  tripId: string;
  userId: string;
  stopId: string;
  cityName: string;
  arrivalDate?: Date;
  departureDate?: Date;
}) {
  if (!input.arrivalDate || !input.departureDate) return;
  const notes = [];
  for (
    let date = new Date(input.arrivalDate);
    date <= input.departureDate;
    date = new Date(date.getTime() + 86400000)
  ) {
    notes.push({
      tripId: input.tripId,
      userId: input.userId,
      stopId: input.stopId,
      title: `${input.cityName} plan`,
      content: "",
      noteDate: date,
    });
  }
  if (notes.length > 0) {
    await prisma.tripNote.createMany({ data: notes });
  }
}

export const tripInclude = {
  owner: { select: { id: true, name: true, email: true, image: true } },
  members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
  stops: { orderBy: { stopOrder: "asc" as const }, include: { city: true, activities: { include: { cityActivity: true } } } },
  budget: { include: { items: true } },
  checklist: { orderBy: { sortOrder: "asc" as const } },
  sharedItinerary: true,
};
