import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser } from "@/lib/traveloop";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { password, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PUT(request: NextRequest) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const body = await request.json();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: body.name ?? user.name,
      firstName: body.firstName ?? user.firstName,
      lastName: body.lastName ?? user.lastName,
      phone: body.phone ?? user.phone,
      city: body.city ?? user.city,
      country: body.country ?? user.country,
      additionalInfo: body.additionalInfo ?? user.additionalInfo,
      image: body.image ?? user.image,
      language: body.language ?? user.language,
      preferredCurrency: body.preferredCurrency ?? user.preferredCurrency,
    },
  });
  const { password, ...safeUser } = updated;
  return NextResponse.json(safeUser);
}

export async function DELETE() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  await prisma.user.delete({ where: { id: user.id } });
  return NextResponse.json({ ok: true });
}
