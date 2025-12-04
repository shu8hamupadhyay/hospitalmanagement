"use client";

import Layout from "../../components/Layout";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { AlertCircle, CheckCircle2, TrendingDown, ShoppingCart } from "lucide-react";
import { useState } from "react";

const API = "http://localhost:8080/api/pharmacy/medicines";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function MedicineList() {
  const { data, error, isLoading } = useSWR(API, fetcher);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, expired, lowstock
  const [notification, setNotification] = useState(null);

  const medicines = Array.isArray(data) ? data : [];

  // Filter medicines
  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "expired") return matchesSearch && m.isExpired;
    if (filter === "lowstock") return matchesSearch && m.isLowStock;
    return matchesSearch;
  });

  async function remove(id) {
    if (!confirm("Delete this medicine?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.text();
        setNotification({ type: "error", message: error || "Delete failed" });
        return;
      }
      setNotification({ type: "success", message: "Medicine deleted successfully" });
      mutate(API);
    } catch (e) {
      setNotification({ type: "error", message: "Error deleting medicine" });
    }
  }

  const stats = {
    total: medicines.length,
    expired: medicines.filter((m) => m.isExpired).length,
    lowStock: medicines.filter((m) => m.isLowStock).length,
    totalValue: medicines.reduce((sum, m) => sum + (m.price * m.stockQuantity || 0), 0),
  };

  return (
    <Layout active="pharmacy">
      <div className="p-6 text-white space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              notification.type === "success"
                ? "bg-green-900/30 border-green-700 text-green-300"
                : "bg-red-900/30 border-red-700 text-red-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">💊 Pharmacy Management</h2>
            <p className="text-sm text-slate-400 mt-1">Manage medicines and inventory</p>
          </div>

          <Link
            href="/pharmacy/add"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg hover:from-cyan-700 hover:to-blue-700 transition font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            Add Medicine
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs uppercase font-semibold">Total Medicines</div>
            <div className="text-2xl font-bold text-cyan-400 mt-2">{stats.total}</div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs uppercase font-semibold">Expired</div>
            <div className={`text-2xl font-bold mt-2 ${stats.expired > 0 ? "text-red-400" : "text-slate-400"}`}>
              {stats.expired}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs uppercase font-semibold">Low Stock</div>
            <div className={`text-2xl font-bold mt-2 ${stats.lowStock > 0 ? "text-orange-400" : "text-slate-400"}`}>
              {stats.lowStock}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="text-slate-400 text-xs uppercase font-semibold">Inventory Value</div>
            <div className="text-2xl font-bold text-purple-400 mt-2">₹{stats.totalValue.toFixed(2)}</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-5 rounded-xl flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search medicine name or manufacturer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">All Medicines</option>
            <option value="expired">Expired Only</option>
            <option value="lowstock">Low Stock Only</option>
          </select>
        </div>

        {/* Medicines Table */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl overflow-auto shadow-2xl">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Medicine</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase">Expiry</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/50">
              {isLoading && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border border-cyan-500 border-t-transparent"></div>
                    </div>
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-red-400">
                    Failed to load medicines.
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    {medicines.length === 0 ? "No medicines in inventory." : "No matches found."}
                  </td>
                </tr>
              )}

              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{m.name}</div>
                    <div className="text-xs text-slate-400">{m.manufacturer || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{m.type || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="text-cyan-400 font-semibold">₹{m.price?.toFixed(2) || "0"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      m.isLowStock
                        ? "bg-orange-900/30 text-orange-300"
                        : "bg-green-900/30 text-green-300"
                    }`}>
                      {m.stockQuantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {m.isExpired ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-300 flex items-center justify-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Expired
                      </span>
                    ) : m.daysUntilExpiry !== null && m.daysUntilExpiry < 30 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/30 text-yellow-300">
                        {m.daysUntilExpiry}d left
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/30 text-green-300 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Good
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/pharmacy/${m.id}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white mr-2 inline-block transition"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => remove(m.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded text-xs text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
