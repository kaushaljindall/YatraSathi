import { useState } from "react";
import { Wallet, TrendingDown, TrendingUp, AlertCircle, PlusCircle, DollarSign, Plane, Hotel, Coffee, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function BudgetTracker() {
  const [expenses, setExpenses] = useState([
    { id: 1, category: "Accommodation", amount: 800, date: "2026-05-10", icon: Hotel },
    { id: 2, category: "Food", amount: 350, date: "2026-05-12", icon: Coffee },
    { id: 3, category: "Transport", amount: 200, date: "2026-05-13", icon: Plane },
    { id: 4, category: "Activities", amount: 450, date: "2026-05-14", icon: ShoppingBag },
  ]);

  const totalBudget = 3000;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = (totalSpent / totalBudget) * 100;

  const categoryData = [
    { name: "Accommodation", value: 800, color: "#3b82f6" },
    { name: "Food", value: 350, color: "#8b5cf6" },
    { name: "Transport", value: 200, color: "#ec4899" },
    { name: "Activities", value: 450, color: "#f59e0b" },
    { name: "Remaining", value: remaining, color: "#10b981" },
  ];

  const dailySpending = [
    { day: "Mon", amount: 200 },
    { day: "Tue", amount: 350 },
    { day: "Wed", amount: 180 },
    { day: "Thu", amount: 420 },
    { day: "Fri", amount: 300 },
    { day: "Sat", amount: 250 },
    { day: "Sun", amount: 100 },
  ];

  const savingTips = [
    { tip: "Use public transport instead of taxis", savings: "$15-20/day" },
    { tip: "Eat at local restaurants vs tourist areas", savings: "$30-40/meal" },
    { tip: "Book attractions online in advance", savings: "10-20% off" },
    { tip: "Use travel credit cards for rewards", savings: "2-5% cashback" },
  ];

  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-full"
        >
          <DollarSign className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            FINANCIAL AI ENGINE
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Budget Intelligence
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Predictive expense tracking with AI-powered cost optimization
        </p>
      </motion.div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Wallet className="w-8 h-8" />
          </div>
          <p className="text-blue-100 text-sm mb-1">Total Budget</p>
          <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8" />
          </div>
          <p className="text-purple-100 text-sm mb-1">Total Spent</p>
          <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
          </div>
          <p className="text-green-100 text-sm mb-1">Remaining</p>
          <p className="text-3xl font-bold">${remaining.toLocaleString()}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-orange-100 text-sm mb-1">Budget Used</p>
          <p className="text-3xl font-bold">{percentageUsed.toFixed(1)}%</p>
        </div>
      </div>

      {/* Budget Alert */}
      {percentageUsed > 75 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-900">Budget Alert!</h3>
              <p className="text-sm text-orange-700 mt-1">
                You've used {percentageUsed.toFixed(1)}% of your budget. Consider reviewing your spending to stay within limits.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Budget Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Spending */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Daily Spending Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent Expenses</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all">
            <PlusCircle className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        <div className="space-y-3">
          {expenses.map((expense) => {
            const Icon = expense.icon;
            return (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <p className="text-xl font-bold">${expense.amount}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost-Saving Tips */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-green-600" />
          Smart Cost-Saving Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingTips.map((item, i) => (
            <div key={i} className="p-4 border border-border rounded-lg hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm flex-1">{item.tip}</p>
                <span className="text-sm font-semibold text-green-600 ml-2">{item.savings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predicted Spending */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">AI Predicted Spending</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Projected Total</p>
            <p className="text-2xl font-bold">$2,850</p>
            <p className="text-xs text-green-600 mt-1">Under budget by $150</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Average Daily</p>
            <p className="text-2xl font-bold">$285</p>
            <p className="text-xs text-muted-foreground mt-1">Based on current trend</p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Recommended Daily</p>
            <p className="text-2xl font-bold">$200</p>
            <p className="text-xs text-blue-600 mt-1">To stay on budget</p>
          </div>
        </div>
      </div>
    </div>
  );
}
