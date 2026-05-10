import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessTrip, canEditTrip, jsonError, parseDate, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canAccessTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const stopId = new URL(request.url).searchParams.get("stopId");
  const notes = await prisma.tripNote.findMany({
    where: { tripId, ...(stopId ? { stopId } : {}) },
    orderBy: { noteDate: "asc" },
    include: { user: { select: { id: true, name: true, image: true } }, stop: { include: { city: true } } },
  });
  return NextResponse.json(notes);
}

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const note = await prisma.tripNote.create({
    data: {
      tripId,
      userId: user.id,
      stopId: body.stopId || null,
      title: body.title ?? "Untitled note",
      content: body.content ?? "",
      noteDate: parseDate(body.noteDate) ?? new Date(),
    },
  });
  return NextResponse.json(note, { status: 201 });
}
