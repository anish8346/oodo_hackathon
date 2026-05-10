"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  Check,
  DollarSign,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Mode =
  | "dashboard"
  | "trips"
  | "create"
  | "itinerary"
  | "view"
  | "cities"
  | "activities"
  | "budget"
  | "packing"
  | "notes"
  | "profile"
  | "admin";

type Props = {
  mode: Mode;
  displayName?: string;
};

const palette = ["#f59e0b", "#0f766e", "#dc2626", "#2563eb", "#7c3aed"];

async function api(path: string, init?: RequestInit) {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

function formatDate(value?: string | null) {
  if (!value) return "Flexible";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function money(value: unknown, currency = "USD") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value ?? 0));
}

export function WorkspacePage({ mode, displayName = "Traveler" }: Props) {
  if (mode === "dashboard") return <DashboardScreen displayName={displayName} />;
  if (mode === "trips") return <TripsScreen />;
  if (mode === "create") return <CreateTripScreen />;
  if (mode === "itinerary") return <ItineraryScreen builder />;
  if (mode === "view") return <ItineraryScreen />;
  if (mode === "cities") return <CitiesScreen />;
  if (mode === "activities") return <ActivitiesScreen />;
  if (mode === "budget") return <BudgetScreen />;
  if (mode === "packing") return <ChecklistScreen />;
  if (mode === "notes") return <NotesScreen />;
  if (mode === "profile") return <ProfileScreen />;
  return <AdminScreen />;
}

function useTraveloopData() {
  const [trips, setTrips] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const [tripData, cityData] = await Promise.all([api("/api/trips"), api("/api/cities")]);
      setTrips(tripData);
      setCities(cityData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return { trips, cities, loading, refresh };
}

function SelectTrip({ trips, value, onChange }: { trips: any[]; value?: string; onChange: (id: string) => void }) {
  return (
    <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm">
      <option value="">Select trip</option>
      {trips.map((trip) => (
        <option key={trip.id} value={trip.id}>
          {trip.title}
        </option>
      ))}
    </select>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="h-48 animate-pulse rounded-md bg-slate-200" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
        <Icon className="mb-3 h-10 w-10 text-amber-500" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">{body}</p>
      </CardContent>
    </Card>
  );
}

function DashboardScreen({ displayName }: { displayName: string }) {
  const { trips, cities, loading } = useTraveloopData();
  const nextTrip = trips[0];
  const budgetTotal = trips.reduce((sum, trip) => sum + Number(trip.budget?.estimatedTotal ?? 0), 0);
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-md bg-amber-500 p-6 text-slate-950 md:p-10">
        <h1 className="text-3xl font-bold">Welcome back, {displayName}</h1>
        <p className="mt-2 text-slate-800">Plan richer multi-city trips with stops, budgets, packing, notes, and shareable itineraries.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/create"><Button><Plus className="mr-2 h-4 w-4" />Plan New Trip</Button></Link>
          <Link href="/dashboard/cities"><Button variant="secondary"><Search className="mr-2 h-4 w-4" />Explore Cities</Button></Link>
        </div>
      </section>
      {loading ? <LoadingGrid /> : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Metric icon={Calendar} label="Trips" value={trips.length} />
            <Metric icon={Globe} label="Cities available" value={cities.length} />
            <Metric icon={DollarSign} label="Estimated spend" value={money(budgetTotal)} />
          </div>
          {nextTrip ? <TripCard trip={nextTrip} /> : <EmptyState icon={MapPin} title="No trips yet" body="Create your first route and Traveloop will organize the rest." />}
          <div className="grid gap-4 md:grid-cols-4">
            {cities.slice(0, 4).map((city) => <CityCard key={city.id} city={city} />)}
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <Card><CardContent><Icon className="mb-4 h-5 w-5 text-amber-600" /><p className="text-sm text-slate-500">{label}</p><p className="text-2xl font-semibold">{value}</p></CardContent></Card>
  );
}

function TripCard({ trip, onDelete }: { trip: any; onDelete?: (id: string) => void }) {
  return (
    <Card className="overflow-hidden">
      {trip.coverImageUrl ? <img src={trip.coverImageUrl} alt="" className="h-40 w-full object-cover" /> : null}
      <CardContent className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{trip.title}</h2>
          <p className="line-clamp-2 text-sm text-slate-500">{trip.description || "No description yet."}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          <span>{trip.stops?.length ?? 0} stops</span>
          <span>{trip.status}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/itinerary"><Button size="sm">Build</Button></Link>
          <Link href="/dashboard/budget"><Button size="sm" variant="ghost">Budget</Button></Link>
          {onDelete ? <Button size="sm" variant="ghost" onClick={() => onDelete(trip.id)}><Trash2 className="h-4 w-4" /></Button> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function CityCard({ city, onSave }: { city: any; onSave?: (id: string) => void }) {
  return (
    <Card className="overflow-hidden">
      {city.imageUrl ? <img src={city.imageUrl} alt="" className="h-36 w-full object-cover" /> : null}
      <CardContent className="space-y-3">
        <div><h2 className="font-semibold">{city.name}</h2><p className="text-sm text-slate-500">{city.country} · {city.region}</p></div>
        <div className="flex items-center justify-between text-sm"><span>Cost index {city.costIndex}</span><span>{city.popularityScore}</span></div>
        {onSave ? <Button size="sm" variant="ghost" onClick={() => onSave(city.id)}>Save</Button> : null}
      </CardContent>
    </Card>
  );
}

function TripsScreen() {
  const { trips, loading, refresh } = useTraveloopData();
  async function remove(id: string) {
    if (!confirm("Delete this trip?")) return;
    await api(`/api/trips/${id}`, { method: "DELETE" });
    toast.success("Trip deleted");
    refresh();
  }
  if (loading) return <LoadingGrid />;
  return <div className="mx-auto max-w-7xl space-y-4"><div className="flex justify-end"><Link href="/dashboard/create"><Button><Plus className="mr-2 h-4 w-4" />Create Trip</Button></Link></div>{trips.length ? <div className="grid gap-4 md:grid-cols-3">{trips.map((trip) => <TripCard key={trip.id} trip={trip} onDelete={remove} />)}</div> : <EmptyState icon={Calendar} title="No trips yet" body="Create a trip to start adding cities, activities, budgets, and notes." />}</div>;
}

function CreateTripScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const form = new FormData(event.currentTarget);
    try {
      await api("/api/trips", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
      });
      toast.success("Trip created");
      router.push("/dashboard/trips");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create trip");
    } finally {
      setSaving(false);
    }
  }
  return (
    <Card className="mx-auto max-w-3xl"><CardContent>
      <form onSubmit={submit} className="grid gap-4">
        <Input name="title" label="Trip title" required />
        <div className="grid gap-4 md:grid-cols-2"><Input name="startDate" label="Start date" type="date" /><Input name="endDate" label="End date" type="date" /></div>
        <Input name="coverImageUrl" label="Cover image URL" />
        <label className="grid gap-1 text-sm font-medium">Description<textarea name="description" className="min-h-32 rounded-md border border-slate-200 p-3" /></label>
        <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Create Trip</Button>
      </form>
    </CardContent></Card>
  );
}

function Input(props: { name: string; label: string; type?: string; required?: boolean; defaultValue?: string }) {
  return <label className="grid gap-1 text-sm font-medium">{props.label}<input {...props} className="h-10 rounded-md border border-slate-200 px-3 font-normal" /></label>;
}

function ItineraryScreen({ builder = false }: { builder?: boolean }) {
  const { trips, cities, loading, refresh } = useTraveloopData();
  const [tripId, setTripId] = useState("");
  const trip = trips.find((item) => item.id === tripId) ?? trips[0];
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => {
    if (cities[0]?.id) api(`/api/cities/${cities[0].id}/activities`).then(setActivities).catch(() => undefined);
  }, [cities]);
  async function addStop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api(`/api/trips/${trip.id}/stops`, { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
    toast.success("Stop added");
    refresh();
  }
  async function addActivity(stopId: string, cityActivityId: string) {
    await api(`/api/stops/${stopId}/activities`, { method: "POST", body: JSON.stringify({ cityActivityId }) });
    toast.success("Activity added");
    refresh();
  }
  if (loading) return <LoadingGrid />;
  if (!trip) return <EmptyState icon={Calendar} title="No trip selected" body="Create a trip before building an itinerary." />;
  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <SelectTrip trips={trips} value={trip.id} onChange={setTripId} />
      {builder ? (
        <Card><CardContent><form onSubmit={addStop} className="grid gap-3 md:grid-cols-5"><select name="cityId" className="h-10 rounded-md border border-slate-200 px-3 md:col-span-2">{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select><input name="arrivalDate" type="date" className="h-10 rounded-md border border-slate-200 px-3" /><input name="departureDate" type="date" className="h-10 rounded-md border border-slate-200 px-3" /><Button type="submit"><Plus className="mr-2 h-4 w-4" />Add Stop</Button></form></CardContent></Card>
      ) : null}
      <div className="space-y-4">
        {trip.stops?.map((stop: any, index: number) => (
          <Card key={stop.id}><CardContent>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-amber-600">Stop {index + 1}</p><h2 className="text-xl font-semibold">{stop.city.name}</h2><p className="text-sm text-slate-500">{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p></div>{builder && activities[0] ? <Button size="sm" onClick={() => addActivity(stop.id, activities[0].id)}>Add popular activity</Button> : null}</div>
            <div className="mt-4 grid gap-2">{stop.activities?.length ? stop.activities.map((activity: any) => <div key={activity.id} className="rounded-md border border-slate-200 p-3 text-sm"><span className="font-medium">{activity.cityActivity.title}</span><span className="ml-2 text-slate-500">{activity.status}</span></div>) : <p className="text-sm text-slate-500">No activities yet.</p>}</div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}

function CitiesScreen() {
  const [q, setQ] = useState("");
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  async function search(query = q) {
    setLoading(true);
    setCities(await api(`/api/cities?q=${encodeURIComponent(query)}`));
    setLoading(false);
  }
  useEffect(() => { search(""); }, []);
  async function save(cityId: string) {
    await api("/api/saved", { method: "POST", body: JSON.stringify({ cityId }) });
    toast.success("Destination saved");
  }
  return <div className="mx-auto max-w-7xl space-y-4"><form onSubmit={(e) => { e.preventDefault(); search(); }} className="flex gap-2"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Paris, Asia, London..." className="h-10 flex-1 rounded-md border border-slate-200 px-3" /><Button type="submit"><Search className="mr-2 h-4 w-4" />Search</Button></form>{loading ? <LoadingGrid /> : <div className="grid gap-4 md:grid-cols-4">{cities.map((city) => <CityCard key={city.id} city={city} onSave={save} />)}</div>}</div>;
}

function ActivitiesScreen() {
  const { cities } = useTraveloopData();
  const [cityId, setCityId] = useState("");
  const [category, setCategory] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  useEffect(() => { if (!cityId && cities[0]) setCityId(cities[0].id); }, [cities, cityId]);
  useEffect(() => { if (cityId) api(`/api/cities/${cityId}/activities?category=${category}`).then(setActivities).catch(() => undefined); }, [cityId, category]);
  return <div className="mx-auto max-w-7xl space-y-4"><div className="flex flex-wrap gap-2"><select value={cityId} onChange={(e) => setCityId(e.target.value)} className="h-10 rounded-md border border-slate-200 px-3">{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select><select value={category} onChange={(e) => setCategory(e.target.value)} className="h-10 rounded-md border border-slate-200 px-3"><option value="">All categories</option><option>food</option><option>sightseeing</option><option>culture</option><option>adventure</option><option>shopping</option></select></div><div className="grid gap-4 md:grid-cols-3">{activities.map((activity) => <Card key={activity.id}><CardContent><h2 className="font-semibold">{activity.title}</h2><p className="mt-1 text-sm text-slate-500">{activity.description}</p><p className="mt-3 text-sm">{money(activity.estimatedCost, activity.currency)} · {activity.durationMinutes} min</p></CardContent></Card>)}</div></div>;
}

function BudgetScreen() {
  const { trips } = useTraveloopData();
  const [tripId, setTripId] = useState("");
  const trip = trips.find((item) => item.id === tripId) ?? trips[0];
  const [budget, setBudget] = useState<any>();
  async function load(id = trip?.id) { if (id) setBudget(await api(`/api/trips/${id}/budget`)); }
  useEffect(() => { load(); }, [trip?.id]);
  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api(`/api/trips/${trip.id}/budget/items`, { method: "POST", body: JSON.stringify(Object.fromEntries(form)) });
    toast.success("Budget item added");
    load(trip.id);
  }
  const chartData = useMemo(() => budget?.breakdown?.map((row: any) => ({ name: row.category, value: Number(row._sum.estimatedAmount ?? 0) })) ?? [], [budget]);
  if (!trip) return <EmptyState icon={DollarSign} title="No budget yet" body="Create a trip to track costs." />;
  return <div className="mx-auto max-w-7xl space-y-4"><SelectTrip trips={trips} value={trip.id} onChange={setTripId} /><div className="grid gap-4 md:grid-cols-3"><Metric icon={DollarSign} label="Budget" value={money(budget?.totalBudget, budget?.currency)} /><Metric icon={BarChart3} label="Estimated" value={money(budget?.estimatedTotal, budget?.currency)} /><Metric icon={Check} label="Actual" value={money(budget?.actualSpent, budget?.currency)} /></div>{budget?.overBudgetAlert ? <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">This trip is over budget.</div> : null}<Card><CardContent className="grid gap-4 md:grid-cols-2"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={chartData} dataKey="value" nameKey="name">{chartData.map((_: any, i: number) => <Cell key={i} fill={palette[i % palette.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><form onSubmit={addItem} className="grid gap-3"><Input name="label" label="Line item" /><select name="category" className="h-10 rounded-md border border-slate-200 px-3"><option>transport</option><option>stay</option><option>meals</option><option>activities</option><option>other</option></select><Input name="estimatedAmount" label="Estimated amount" type="number" /><Input name="actualAmount" label="Actual amount" type="number" /><Button type="submit">Add item</Button></form></CardContent></Card><Card><CardContent><div className="divide-y divide-slate-100">{budget?.items?.map((item: any) => <div key={item.id} className="flex justify-between py-3 text-sm"><span>{item.label || item.category}</span><span>{money(item.estimatedAmount, item.currency)}</span></div>)}</div></CardContent></Card></div>;
}

function ChecklistScreen() {
  const { trips } = useTraveloopData();
  const [tripId, setTripId] = useState("");
  const trip = trips.find((item) => item.id === tripId) ?? trips[0];
  const [items, setItems] = useState<any[]>([]);
  async function load(id = trip?.id) { if (id) setItems(await api(`/api/trips/${id}/checklist`)); }
  useEffect(() => { load(); }, [trip?.id]);
  async function add(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await api(`/api/trips/${trip.id}/checklist`, { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); toast.success("Item added"); load(trip.id); }
  async function toggle(id: string) { await api(`/api/trips/${trip.id}/checklist/${id}`, { method: "PATCH", body: "{}" }); load(trip.id); }
  return <div className="mx-auto max-w-4xl space-y-4"><SelectTrip trips={trips} value={trip?.id} onChange={setTripId} />{trip ? <Card><CardContent><form onSubmit={add} className="mb-4 grid gap-3 md:grid-cols-3"><Input name="itemName" label="Item" /><select name="category" className="mt-6 h-10 rounded-md border border-slate-200 px-3"><option>clothing</option><option>documents</option><option>electronics</option><option>toiletries</option><option>other</option></select><Button type="submit" className="mt-6">Add</Button></form><div className="space-y-2">{items.map((item) => <button key={item.id} onClick={() => toggle(item.id)} className="flex w-full items-center justify-between rounded-md border border-slate-200 p-3 text-left"><span className={item.isPacked ? "line-through text-slate-400" : ""}>{item.itemName}</span><span>{item.category}</span></button>)}</div></CardContent></Card> : <EmptyState icon={Package} title="No checklist" body="Select a trip to create packing groups." />}</div>;
}

function NotesScreen() {
  const { trips } = useTraveloopData();
  const [tripId, setTripId] = useState("");
  const trip = trips.find((item) => item.id === tripId) ?? trips[0];
  const [notes, setNotes] = useState<any[]>([]);
  async function load(id = trip?.id) { if (id) setNotes(await api(`/api/trips/${id}/notes`)); }
  useEffect(() => { load(); }, [trip?.id]);
  async function add(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await api(`/api/trips/${trip.id}/notes`, { method: "POST", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); toast.success("Note added"); load(trip.id); }
  async function remove(id: string) { if (confirm("Delete note?")) { await api(`/api/trips/${trip.id}/notes/${id}`, { method: "DELETE" }); load(trip.id); } }
  return <div className="mx-auto max-w-5xl space-y-4"><SelectTrip trips={trips} value={trip?.id} onChange={setTripId} />{trip ? <><Card><CardContent><form onSubmit={add} className="grid gap-3"><Input name="title" label="Title" /><textarea name="content" className="min-h-28 rounded-md border border-slate-200 p-3" /><Button type="submit">Add note</Button></form></CardContent></Card><div className="grid gap-4 md:grid-cols-2">{notes.map((note) => <Card key={note.id}><CardContent><div className="flex justify-between"><h2 className="font-semibold">{note.title}</h2><button onClick={() => remove(note.id)}><Trash2 className="h-4 w-4 text-red-600" /></button></div><p className="mt-2 text-sm text-slate-600">{note.content || "Empty note"}</p></CardContent></Card>)}</div></> : <EmptyState icon={FileText} title="No notes" body="Create a trip to journal the journey." />}</div>;
}

function ProfileScreen() {
  const [user, setUser] = useState<any>();
  useEffect(() => { api("/api/auth/me").then(setUser).catch(() => undefined); }, []);
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const updated = await api("/api/auth/me", { method: "PUT", body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) }); setUser(updated); toast.success("Profile updated"); }
  if (!user) return <LoadingGrid />;
  return <Card className="mx-auto max-w-3xl"><CardContent><form onSubmit={save} className="grid gap-4"><div className="grid gap-4 md:grid-cols-2"><Input name="firstName" label="First name" defaultValue={user.firstName} /><Input name="lastName" label="Last name" defaultValue={user.lastName} /></div><Input name="name" label="Display name" defaultValue={user.name} /><Input name="image" label="Avatar URL" defaultValue={user.image} /><div className="grid gap-4 md:grid-cols-2"><Input name="language" label="Language" defaultValue={user.language} /><Input name="preferredCurrency" label="Currency" defaultValue={user.preferredCurrency} /></div><Button type="submit">Save profile</Button></form></CardContent></Card>;
}

function AdminScreen() {
  const [stats, setStats] = useState<any>();
  const [users, setUsers] = useState<any[]>([]);
  async function load() { setStats(await api("/api/admin/stats")); setUsers(await api("/api/admin/users")); }
  useEffect(() => { load().catch((error) => toast.error(error.message)); }, []);
  async function remove(id: string) { if (confirm("Delete user?")) { await api(`/api/admin/users/${id}`, { method: "DELETE" }); load(); } }
  return <div className="mx-auto max-w-7xl space-y-4"><div className="grid gap-4 md:grid-cols-3"><Metric icon={Globe} label="Users" value={stats?.users ?? 0} /><Metric icon={Calendar} label="Trips" value={stats?.trips ?? 0} /><Metric icon={MapPin} label="Top cities" value={stats?.topCities?.length ?? 0} /></div><Card><CardContent><div className="divide-y divide-slate-100">{users.map((user) => <div key={user.id} className="flex items-center justify-between py-3 text-sm"><span>{user.name} · {user.email}</span><button onClick={() => remove(user.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button></div>)}</div></CardContent></Card></div>;
}
