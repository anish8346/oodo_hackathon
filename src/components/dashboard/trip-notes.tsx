"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Search, Trash2, Edit2, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string;
  updatedAt: string;
  isEditing: boolean;
};

const initialNotes: Note[] = [
  {
    id: "n1",
    title: "Kyoto Must-Visit Spots",
    content: "1. Fushimi Inari — go before 7 AM\n2. Kinkaku-ji — best in afternoon light\n3. Arashiyama Bamboo Grove\n4. Nishiki Market for street food",
    tag: "Sightseeing",
    updatedAt: "2026-05-08",
    isEditing: false,
  },
  {
    id: "n2",
    title: "Restaurant Reservations",
    content: "• Gion dinner — May 24, 7 PM (confirmed)\n• Ichiran Ramen — walk in\n• Kichi Kichi Omurice — need reservation 2 weeks ahead",
    tag: "Food",
    updatedAt: "2026-05-07",
    isEditing: false,
  },
  {
    id: "n3",
    title: "Transport Tips",
    content: "JR Pass covers Nara and Osaka day trips.\nIC Card (Suica/ICOCA) for local buses.\nShinkansen to Osaka takes ~15 minutes.",
    tag: "Transport",
    updatedAt: "2026-05-05",
    isEditing: false,
  },
];

const tagColors: Record<string, string> = {
  Sightseeing: "bg-purple-100 text-purple-700",
  Food: "bg-[#0f766E]/10 text-[#0f766E]",
  Transport: "bg-blue-100 text-blue-700",
  Accommodation: "bg-emerald-100 text-emerald-700",
  General: "bg-slate-100 text-slate-700",
};

export function TripNotes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  function addNote() {
    const newNote: Note = {
      id: `n-${Date.now()}`,
      title: "Untitled Note",
      content: "",
      tag: "General",
      updatedAt: new Date().toISOString().split("T")[0],
      isEditing: true,
    };
    setNotes((prev) => [newNote, ...prev]);
  }

  function toggleEdit(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isEditing: !n.isEditing } : n))
    );
  }

  function updateNote(id: string, field: "title" | "content" | "tag", value: string) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, [field]: value, updatedAt: new Date().toISOString().split("T")[0] }
          : n
      )
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Note deleted");
  }

  function saveNote(id: string) {
    toggleEdit(id);
    toast.success("Note saved");
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trip Notes</h1>
          <p className="text-muted-foreground mt-1">
            Jot down important info for your travels
          </p>
        </div>
        <Button onClick={addNote}>
          <Plus className="h-5 w-5 mr-2" /> New Note
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-all group">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  {note.isEditing ? (
                    <Input
                      value={note.title}
                      onChange={(e) => updateNote(note.id, "title", e.target.value)}
                      className="font-semibold text-lg"
                    />
                  ) : (
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      {note.title}
                    </h3>
                  )}
                  <div className="flex gap-1">
                    {note.isEditing ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => saveNote(note.id)}
                      >
                        <Save className="h-4 w-4 text-emerald-600" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition"
                        onClick={() => toggleEdit(note.id)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {note.isEditing ? (
                  <>
                    <Textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, "content", e.target.value)}
                      rows={5}
                    />
                    <select
                      className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm focus:outline-none"
                      value={note.tag}
                      onChange={(e) => updateNote(note.id, "tag", e.target.value)}
                    >
                      {Object.keys(tagColors).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                    {note.content}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge className={tagColors[note.tag] || tagColors.General} variant="secondary">
                    {note.tag}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{note.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
