"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Edit2,
  ImagePlus,
  MapPin,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Note = {
  id: string;
  title: string;
  location: string;
  date: string;       // "YYYY-MM-DD"
  tripId: string;
  content: string;
  photos: string[];   // base64 data URLs
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "traveloop_notes_v2";

const DUMMY_TRIPS = [
  { id: "kyoto-spring",      label: "Kyoto Spring Escape" },
  { id: "barcelona-summer",  label: "Barcelona Summer Week" },
  { id: "iceland-aurora",    label: "Iceland Aurora Drive" },
  { id: "general",           label: "General / No Trip" },
];

const TRIP_CHIP: Record<string, string> = {
  "kyoto-spring":     "bg-rose-50 text-rose-600 border-rose-200",
  "barcelona-summer": "bg-amber-50 text-amber-600 border-amber-200",
  "iceland-aurora":   "bg-sky-50 text-sky-600 border-sky-200",
  general:            "bg-slate-100 text-slate-500 border-slate-200",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function load(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch { return []; }
}

function persist(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function getTripLabel(id: string) {
  return DUMMY_TRIPS.find((t) => t.id === id)?.label ?? "General";
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
        <BookOpen className="h-9 w-9 text-emerald-500" strokeWidth={1.6} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-slate-800">Your journal is empty</h3>
      <p className="mb-7 max-w-xs text-sm text-slate-500 leading-relaxed">
        Start documenting your travels — capture memories, locations, and stories from every trip.
      </p>
      <button
        id="notes-empty-add-btn"
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Write First Entry
      </button>
    </div>
  );
}

// ─── Journal Card ─────────────────────────────────────────────────────────────

function JournalCard({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: (n: Note) => void;
  onDelete: (id: string) => void;
}) {
  const chipClass = cn(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
    TRIP_CHIP[note.tripId] ?? TRIP_CHIP["general"]
  );

  const photos = note.photos ?? [];

  return (
    <article className="group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">

      {/* Photo strip — first photo as hero */}
      {photos.length > 0 && (
        <div className="relative h-36 w-full overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[0]}
            alt="Journal photo"
            className="h-full w-full object-cover"
          />
          {photos.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white">
              +{photos.length - 1} more
            </span>
          )}
        </div>
      )}

      {/* Card body */}
      <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
        {/* Top row — date + actions */}
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            {fmtDate(note.date)}
          </span>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              id={`note-edit-${note.id}`}
              type="button"
              aria-label="Edit entry"
              onClick={() => onEdit(note)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
            <button
              id={`note-delete-${note.id}`}
              type="button"
              aria-label="Delete entry"
              onClick={() => onDelete(note.id)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="line-clamp-1 text-[15px] font-semibold leading-snug text-slate-900">
          {note.title}
        </h2>

        {/* Location tag */}
        {note.location && (
          <span className="inline-flex w-fit items-center gap-1 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-emerald-500" />
            {note.location}
          </span>
        )}

        {/* Content preview */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {note.content}
        </p>

        {/* Trip badge */}
        <div className="border-t border-slate-100 pt-3">
          <span className={chipClass}>
            <Tag className="h-3 w-3" />
            {getTripLabel(note.tripId)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Modal Form ───────────────────────────────────────────────────────────────

type FormData = {
  title: string;
  location: string;
  date: string;
  tripId: string;
  content: string;
  photos: string[];   // base64
};

function NoteModal({
  editing,
  onClose,
  onSave,
}: {
  editing: Note | null;
  onClose: () => void;
  onSave: (data: FormData) => void;
}) {
  const [form, setForm] = useState<FormData>({
    title:    editing?.title    ?? "",
    location: editing?.location ?? "",
    date:     editing?.date     ?? todayISO(),
    tripId:   editing?.tripId   ?? "general",
    content:  editing?.content  ?? "",
    photos:   editing?.photos   ?? [],
  });
  const titleRef   = useRef<HTMLInputElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  function set(key: keyof Omit<FormData, "photos">, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setForm((prev) => ({
          ...prev,
          photos: [...prev.photos, dataUrl],
        }));
      };
      reader.readAsDataURL(file);
    });
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function removePhoto(idx: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  }

  const isValid = form.title.trim() && form.content.trim() && form.date;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSave({
      ...form,
      title:    form.title.trim(),
      location: form.location.trim(),
      content:  form.content.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? "Edit journal entry" : "New journal entry"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <BookOpen className="h-4.5 w-4.5 h-[18px] w-[18px] text-emerald-600" strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {editing ? "Edit Entry" : "New Journal Entry"}
              </h2>
              <p className="text-xs text-slate-400">
                {editing ? "Update your travel note" : "Document your travel experience"}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form body — scrollable on small screens */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 overflow-y-auto px-6 py-6 max-h-[calc(100vh-180px)]">

          {/* Row: Title + Date */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Entry Title */}
            <div className="flex flex-col gap-1.5 sm:col-span-1">
              <label htmlFor="modal-title" className="field-label">
                Entry Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="modal-title"
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Morning at Fushimi Inari"
                maxLength={120}
                required
                className="field-input"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-date" className="field-label">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                id="modal-date"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                required
                className="field-input"
              />
            </div>
          </div>

          {/* Row: Location + Trip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Location */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-location" className="field-label">
                Location
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                <input
                  id="modal-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="e.g. Kyoto, Japan"
                  maxLength={80}
                  className="field-input"
                  style={{ paddingLeft: '2.25rem' }}
                />
              </div>
            </div>

            {/* Trip linkage */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="modal-trip" className="field-label">
                Link to Trip
              </label>
              <div className="relative">
                <select
                  id="modal-trip"
                  value={form.tripId}
                  onChange={(e) => set("tripId", e.target.value)}
                  className="field-input appearance-none pr-8"
                >
                  {DUMMY_TRIPS.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Story / Content */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="modal-content" className="field-label">
              Your Story <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="modal-content"
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder="Write about your experience, what you saw, felt, or discovered..."
              rows={7}
              required
              className="field-input resize-none leading-relaxed"
            />
          </div>

          {/* Photos */}
          <div className="flex flex-col gap-2">
            <span className="field-label">Photos (optional)</span>

            {/* Thumbnails */}
            {form.photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.photos.map((src, idx) => (
                  <div key={idx} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`photo ${idx + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => removePhoto(idx)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <input
              ref={fileRef}
              id="modal-photo-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFiles}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <ImagePlus className="h-4 w-4" />
              {form.photos.length === 0 ? "Add Photos" : "Add More Photos"}
            </button>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-2">
            <button
              id="modal-cancel-btn"
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              id="modal-save-btn"
              type="submit"
              disabled={!isValid}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
            >
              {editing ? "Save Changes" : "Add Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* Inline Tailwind utility definitions via style tag */}
      <style>{`
        .field-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #64748b;
        }
        .field-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: #1e293b;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .field-input::placeholder { color: #94a3b8; }
        .field-input:focus {
          border-color: #34d399;
          box-shadow: 0 0 0 3px rgba(52,211,153,0.15);
        }
      `}</style>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────

function DeleteConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-rose-50">
          <Trash2 className="h-5 w-5 text-rose-500" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-900">Delete this entry?</h3>
        <p className="mb-5 text-sm text-slate-500 leading-relaxed">
          This journal entry will be permanently removed from your browser storage and cannot be recovered.
        </p>
        <div className="flex justify-end gap-3">
          <button
            id="delete-cancel-btn"
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            id="delete-confirm-btn"
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Notes View ──────────────────────────────────────────────────────────

export function NotesView() {
  const [notes, setNotes]         = useState<Note[]>([]);
  const [search, setSearch]       = useState("");
  const [filterTrip, setFilterTrip] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setNotes(load());
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Filtered + sorted list
  const displayed = notes
    .filter((n) => {
      const tripOk   = filterTrip === "all" || n.tripId === filterTrip;
      const searchOk = !search ||
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase()) ||
        n.location.toLowerCase().includes(search.toLowerCase());
      return tripOk && searchOk;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // ── CRUD ──

  function handleSave(data: FormData) {
    const now = new Date().toISOString();
    let updated: Note[];
    if (editing) {
      updated = notes.map((n) =>
        n.id === editing.id ? { ...n, ...data, updatedAt: now } : n
      );
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        ...data,
        photos: data.photos ?? [],
        createdAt: now,
        updatedAt: now,
      };
      updated = [newNote, ...notes];
    }
    setNotes(updated);
    persist(updated);
    closeModal();
  }

  function handleDelete(id: string) { setDeletingId(id); }

  function confirmDelete() {
    if (!deletingId) return;
    const updated = notes.filter((n) => n.id !== deletingId);
    setNotes(updated);
    persist(updated);
    setDeletingId(null);
  }

  function openAdd() { setEditing(null); setModalOpen(true); }
  function openEdit(n: Note) { setEditing(n); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  if (!mounted) return null;

  return (
    <div className="flex min-h-full flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Trip Journal
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {notes.length} {notes.length === 1 ? "entry" : "entries"} &mdash; stored in your browser
          </p>
        </div>
        <button
          id="notes-add-btn"
          type="button"
          onClick={openAdd}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          New Entry
        </button>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="notes-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location or content…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Trip filter */}
        <div className="relative sm:w-52">
          <select
            id="notes-filter-trip"
            value={filterTrip}
            onChange={(e) => setFilterTrip(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">All Trips</option>
            {DUMMY_TRIPS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* ── Content ── */}
      {notes.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-3 h-10 w-10 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm text-slate-500">No entries match your search or filter.</p>
          <button
            type="button"
            onClick={() => { setSearch(""); setFilterTrip("all"); }}
            className="mt-3 text-xs font-medium text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayed.map((note) => (
            <JournalCard
              key={note.id}
              note={note}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {modalOpen && (
        <NoteModal editing={editing} onClose={closeModal} onSave={handleSave} />
      )}

      {/* ── Delete confirm ── */}
      {deletingId && (
        <DeleteConfirm
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
