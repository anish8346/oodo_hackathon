import Link from "next/link";
import { notFound } from "next/navigation";
import { Copy, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicCopyButton } from "@/components/traveloop/public-copy-button";

/* eslint-disable @next/next/no-img-element */

type Props = { params: Promise<{ slug: string }> };

function formatDate(value?: Date | null) {
  if (!value) return "Flexible";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(value);
}

export default async function PublicItineraryPage({ params }: Props) {
  const { slug } = await params;
  const share = await prisma.sharedItinerary.findUnique({
    where: { publicSlug: slug },
    include: {
      trip: {
        include: {
          stops: { orderBy: { stopOrder: "asc" }, include: { city: true, activities: { include: { cityActivity: true } } } },
          owner: { select: { name: true } },
        },
      },
    },
  });
  if (!share?.isActive) notFound();

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-slate-950 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-md bg-white shadow-sm">
          {share.trip.coverImageUrl ? <img src={share.trip.coverImageUrl} alt="" className="h-72 w-full object-cover" /> : null}
          <div className="p-6">
            <p className="text-sm font-semibold uppercase text-amber-600">Shared itinerary</p>
            <h1 className="mt-2 text-3xl font-bold">{share.trip.title}</h1>
            <p className="mt-2 max-w-3xl text-slate-600">{share.trip.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <PublicCopyButton slug={slug} />
              <Link href="/auth/signin"><Button variant="ghost"><Copy className="mr-2 h-4 w-4" />Sign in to plan</Button></Link>
            </div>
          </div>
        </section>
        <div className="space-y-4">
          {share.trip.stops.map((stop) => (
            <Card key={stop.id}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-amber-600" />
                  <div>
                    <h2 className="text-xl font-semibold">{stop.city.name}, {stop.city.country}</h2>
                    <p className="text-sm text-slate-500">{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-2">
                  {stop.activities.map((activity) => (
                    <div key={activity.id} className="rounded-md border border-slate-200 p-3 text-sm">
                      <p className="font-medium">{activity.cityActivity.title}</p>
                      <p className="text-slate-500">{activity.cityActivity.category}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
