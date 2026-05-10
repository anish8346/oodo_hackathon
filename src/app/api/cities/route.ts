import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const region = searchParams.get("region");
  const cities = await prisma.city.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { country: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(region ? { region: { contains: region, mode: "insensitive" } } : {}),
    },
    orderBy: [{ popularityScore: "desc" }, { name: "asc" }],
    take: 50,
  });
  return NextResponse.json(cities);
}
