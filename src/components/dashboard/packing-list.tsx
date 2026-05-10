"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Package, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { toast } from "sonner";

type PackingItem = {
  id: string;
  name: string;
  category: string;
  packed: boolean;
};

const initialItems: PackingItem[] = [
  { id: "p1", name: "Passport", category: "Documents", packed: true },
  { id: "p2", name: "Travel Insurance", category: "Documents", packed: true },
  { id: "p3", name: "Flight Tickets", category: "Documents", packed: false },
  { id: "p4", name: "T-Shirts (5)", category: "Clothing", packed: false },
  { id: "p5", name: "Jeans (2)", category: "Clothing", packed: false },
  { id: "p6", name: "Jacket", category: "Clothing", packed: true },
  { id: "p7", name: "Sneakers", category: "Clothing", packed: false },
  { id: "p8", name: "Phone Charger", category: "Electronics", packed: true },
  { id: "p9", name: "Camera", category: "Electronics", packed: false },
  { id: "p10", name: "Power Bank", category: "Electronics", packed: false },
  { id: "p11", name: "Sunscreen", category: "Toiletries", packed: false },
  { id: "p12", name: "Toothbrush", category: "Toiletries", packed: true },
  { id: "p13", name: "Medications", category: "Health", packed: true },
  { id: "p14", name: "First Aid Kit", category: "Health", packed: false },
];

const categoryIcons: Record<string, string> = {
  Documents: "📄",
  Clothing: "👕",
  Electronics: "📱",
  Toiletries: "🧴",
  Health: "💊",
  Other: "📦",
};

export function PackingList() {
  const [items, setItems] = useState<PackingItem[]>(initialItems);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const [search, setSearch] = useState("");

  const packedCount = items.filter((i) => i.packed).length;
  const totalCount = items.length;
  const percentPacked = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const categories = [...new Set(items.map((i) => i.category))];

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  function togglePacked(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i))
    );
  }

  function addItem() {
    if (!newItem.trim()) {
      toast.error("Enter an item name");
      return;
    }
    setItems((prev) => [
      ...prev,
      { id: `p-${Date.now()}`, name: newItem, category: newCategory, packed: false },
    ]);
    setNewItem("");
    toast.success("Item added");
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Packing List</h1>
        <p className="text-muted-foreground mt-1">
          Keep track of everything you need for your trip
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold">Packing Progress</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {packedCount} / {totalCount} items packed
            </span>
          </div>
          <Progress value={percentPacked} className="h-3" />
        </CardContent>
      </Card>

      {/* Search + Add */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex gap-2">
            <Input
              placeholder="New item"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="flex-1"
            />
            <select
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm focus:outline-none"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {Object.keys(categoryIcons).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Button onClick={addItem} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Items by Category */}
      {categories.map((category) => {
        const catItems = filtered.filter((i) => i.category === category);
        if (catItems.length === 0) return null;

        return (
          <Card key={category}>
            <CardContent className="p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <span>{categoryIcons[category] || "📦"}</span>
                {category}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {catItems.filter((i) => i.packed).length}/{catItems.length}
                </Badge>
              </h3>
              <div className="space-y-2">
                {catItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 group hover:bg-slate-50 transition"
                  >
                    <button
                      type="button"
                      onClick={() => togglePacked(item.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition ${
                        item.packed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 hover:border-emerald-400"
                      }`}
                    >
                      {item.packed && <Check className="h-4 w-4" />}
                    </button>
                    <span
                      className={`flex-1 text-sm font-medium transition ${
                        item.packed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
