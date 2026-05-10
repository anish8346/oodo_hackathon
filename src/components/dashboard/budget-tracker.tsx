"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  PieChart,
  Plus,
  TrendingDown,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
};

const categoryColors: Record<string, string> = {
  Flights: "bg-blue-100 text-blue-700",
  Hotels: "bg-emerald-100 text-emerald-700",
  Food: "bg-[#0f766E]/10 text-[#0f766E]",
  Activities: "bg-purple-100 text-purple-700",
  Transport: "bg-sky-100 text-sky-700",
  Shopping: "bg-pink-100 text-pink-700",
  Other: "bg-slate-100 text-slate-700",
};

const initialExpenses: Expense[] = [
  { id: "e1", category: "Flights", description: "KIX roundtrip", amount: 820, date: "2026-05-01" },
  { id: "e2", category: "Hotels", description: "Granvia Kyoto (7 nights)", amount: 1260, date: "2026-05-02" },
  { id: "e3", category: "Transport", description: "JR Rail Pass", amount: 280, date: "2026-05-05" },
  { id: "e4", category: "Food", description: "Restaurant reservations", amount: 320, date: "2026-05-10" },
  { id: "e5", category: "Activities", description: "Temple passes & tours", amount: 100, date: "2026-05-12" },
];

export function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [newCategory, setNewCategory] = useState("Food");
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const totalBudget = 4800;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentUsed = Math.round((totalSpent / totalBudget) * 100);

  const categoryBreakdown = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  function addExpense() {
    if (!newDescription.trim() || !newAmount) {
      toast.error("Fill in description and amount");
      return;
    }
    const expense: Expense = {
      id: `e-${Date.now()}`,
      category: newCategory,
      description: newDescription,
      amount: parseFloat(newAmount),
      date: new Date().toISOString().split("T")[0],
    };
    setExpenses((prev) => [expense, ...prev]);
    setNewDescription("");
    setNewAmount("");
    toast.success("Expense added");
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success("Expense removed");
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Budget Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Kyoto Spring Escape — Track your spending
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <IndianRupee className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">₹{totalBudget.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766E]/10">
                <TrendingDown className="h-5 w-5 text-[#0f766E]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold">₹{totalSpent.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? "text-red-600" : ""}`}>
                  ₹{remaining.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-sm">Budget Usage</span>
            <span className="text-sm text-muted-foreground">{percentUsed}%</span>
          </div>
          <Progress value={percentUsed} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Expense
            </h3>
            <select
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            >
              {Object.keys(categoryColors).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Input
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount (INR)"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
            />
            <Button className="w-full" onClick={addExpense}>
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChart className="h-5 w-5" /> Category Breakdown
            </h3>
            {categoryBreakdown.map(([cat, amount]) => (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <Badge className={categoryColors[cat]}>{cat}</Badge>
                  <span className="font-medium">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <Progress value={(amount / totalBudget) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Expense List */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.map((expense, i) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 group hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <Badge className={categoryColors[expense.category]} variant="secondary">
                    {expense.category}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{expense.description}</p>
                    <p className="text-xs text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">₹{expense.amount.toLocaleString("en-IN")}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition"
                    onClick={() => deleteExpense(expense.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
