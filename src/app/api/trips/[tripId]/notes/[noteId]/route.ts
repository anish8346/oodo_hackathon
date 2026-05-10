import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, parseDate, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string; noteId: string }> };

export async function PUT(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, noteId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  const body = await request.json();
  const note = await prisma.tripNote.update({
    where: { id: noteId, tripId },
    data: { title: body.title, content: body.content, stopId: body.stopId, noteDate: parseDate(body.noteDate) },
  });
  return NextResponse.json(note);
}

export async function DELETE(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId, noteId } = await context.params;
  if (!(await canEditTrip(tripId, user.id))) return jsonError("Forbidden", 403);
  await prisma.tripNote.delete({ where: { id: noteId, tripId } });
  return NextResponse.json({ ok: true });
}
