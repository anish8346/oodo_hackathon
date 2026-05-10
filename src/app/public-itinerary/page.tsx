import Link from "next/link";
import { mockTrips } from "@/data/mock-dashboard";

const trip = mockTrips[0]; // Kyoto Spring Escape

const itinerary = [
  {
    day: 1,
    date: "May 24",
    label: "Arrival",
    activities: [
      { time: "09:00 AM", title: "Flight to Kyoto", type: "transport", location: "KIX Airport" },
      { time: "02:00 PM", title: "Hotel Check-in", type: "hotel", location: "Hotel Granvia Kyoto" },
      { time: "04:00 PM", title: "Nishiki Market", type: "sightseeing", location: "Nishiki Market" },
      { time: "07:00 PM", title: "Dinner at Gion", type: "food", location: "Gion District" },
    ],
  },
  {
    day: 2,
    date: "May 25",
    label: "Temples",
    activities: [
      { time: "07:00 AM", title: "Fushimi Inari Shrine", type: "sightseeing", location: "Fushimi, Kyoto" },
      { time: "11:00 AM", title: "Kinkaku-ji", type: "sightseeing", location: "Golden Pavilion" },
      { time: "01:00 PM", title: "Ramen Lunch", type: "food", location: "Ichiran Ramen" },
      { time: "03:00 PM", title: "Bamboo Grove Walk", type: "activity", location: "Arashiyama" },
    ],
  },
  {
    day: 3,
    date: "May 26",
    label: "Day Trip to Nara",
    activities: [
      { time: "08:30 AM", title: "Train to Nara", type: "transport", location: "JR Nara Line" },
      { time: "10:00 AM", title: "Nara Park & Deer", type: "activity", location: "Nara Park" },
      { time: "12:00 PM", title: "Todai-ji Temple", type: "sightseeing", location: "Todai-ji" },
      { time: "05:00 PM", title: "Return to Kyoto", type: "transport", location: "JR Nara Line" },
    ],
  },
];

const typeEmoji: Record<string, string> = {
  sightseeing: "📸",
  food: "🍜",
  transport: "🚄",
  hotel: "🏨",
  activity: "🎯",
};

const typeColor: Record<string, string> = {
  sightseeing: "bg-purple-100 text-purple-700",
  food: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  hotel: "bg-emerald-100 text-emerald-700",
  activity: "bg-pink-100 text-pink-700",
};

export default function PublicItineraryPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-sky-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">Traveloop</span>
          </Link>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
            Public Itinerary
          </span>
        </div>
      </header>

      {/* Hero */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-64 w-full object-cover sm:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              {trip.title}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {trip.destinations.join(" → ")} · {trip.startDate} – {trip.endDate}
            </p>
            <div className="mt-3 flex items-center gap-2">
              {trip.travelers.map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.avatar} alt={t.name} className="h-5 w-5 rounded-full object-cover" />
                  <span className="text-xs font-medium text-white">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="space-y-8">
          {itinerary.map((day) => (
            <div key={day.day}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
                  {day.day}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Day {day.day} — {day.label}
                  </h2>
                  <p className="text-sm text-slate-500">{day.date}</p>
                </div>
              </div>

              <div className="ml-5 border-l-2 border-slate-200 pl-8 space-y-4">
                {day.activities.map((act, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[2.55rem] top-6 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />

                    <div className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${typeColor[act.type] || "bg-slate-100"}`}>
                        {typeEmoji[act.type] || "📌"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{act.title}</h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-500">
                          <span>🕐 {act.time}</span>
                          <span>📍 {act.location}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeColor[act.type] || "bg-slate-100 text-slate-700"}`}>
                        {act.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center">
        <p className="text-sm text-slate-500">
          Created with{" "}
          <Link href="/" className="font-semibold text-emerald-600 hover:underline">
            Traveloop
          </Link>{" "}
          — Plan your perfect trip
        </p>
      </footer>
    </div>
  );
}
