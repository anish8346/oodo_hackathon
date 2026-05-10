import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireUser } from "@/lib/traveloop";

type Context = { params: Promise<{ cityId: string }> };

export async function DELETE(_request: Request, context: Context) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { cityId } = await context.params;
  await prisma.savedDestination.delete({ where: { userId_cityId: { userId: user.id, cityId } } });
  return NextResponse.json({ ok: true });
}
