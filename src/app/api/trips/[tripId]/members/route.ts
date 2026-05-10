import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canEditTrip, jsonError, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ tripId: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const members = await prisma.tripMember.findMany({
    where: { tripId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
  });
  return NextResponse.json(members);
}

export async function POST(request: NextRequest, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { tripId } = await context.params;
  const allowed = await canEditTrip(tripId, user.id);
  if (!allowed) return jsonError("Forbidden", 403);
  const body = await request.json();
  const invitee = await prisma.user.findUnique({ where: { email: String(body.email ?? "").toLowerCase() } });
  if (!invitee) return jsonError("No user found for that email.", 404);
  const member = await prisma.tripMember.upsert({
    where: { tripId_userId: { tripId, userId: invitee.id } },
    create: { tripId, userId: invitee.id, role: body.role ?? "viewer" },
    update: { role: body.role ?? "viewer" },
  });
  return NextResponse.json(member, { status: 201 });
}
