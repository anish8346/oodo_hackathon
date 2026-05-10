import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, createSlug, jsonError, publicTripUrl, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function POST(_request: Request, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  let slug = createSlug();
  for (let index = 0; index < 4; index += 1) {
    const exists = await prisma.sharedItinerary.findUnique({ where: { publicSlug: slug } });
    if (!exists) break;
    slug = createSlug();
  }
  const share = await prisma.sharedItinerary.upsert({
    where: { tripId },
    create: { tripId, publicSlug: slug },
    update: { isActive: true },
  });
  await prisma.trip.update({ where: { id: tripId }, data: { visibility: "public" } });
  return NextResponse.json({ ...share, url: publicTripUrl(share.publicSlug) });
}

export async function DELETE(_request: Request, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const share = await prisma.sharedItinerary.update({ where: { tripId }, data: { isActive: false } });
  await prisma.trip.update({ where: { id: tripId }, data: { visibility: "private" } });
  return NextResponse.json(share);
}
