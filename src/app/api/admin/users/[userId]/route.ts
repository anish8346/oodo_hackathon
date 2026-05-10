import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdmin } from "@/lib/traveloop";

type Context = { params: Promise<{ userId: string }> };

export async function DELETE(_request: Request, context: Context) {
  const admin = await requireAdmin();
  if (!admin) return jsonError("Forbidden", 403);
  const { userId } = await context.params;
  if (userId === admin.id) return jsonError("Admins cannot delete themselves.", 400);
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
