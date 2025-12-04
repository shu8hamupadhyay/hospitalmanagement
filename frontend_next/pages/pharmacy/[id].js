"use client";

import Layout from "../../components/Layout";
import useSWR from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowLeft, Edit } from "lucide-react";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ViewMedicine() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    id ? `http://localhost:8080/api/pharmacy/medicines/${id}` : null,
    fetcher
  );

  const medicine = data || {};

  return (
    <Layout active="pharmacy">
      <div className="p-6 text-white space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold">💊 Medicine Details</h2>
            <p className="text-sm text-slate-400 mt-1">Complete information about this medicine</p>
          </div>

          {!isLoading && !error && data && (
            <Link
              href={`/pharmacy/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg transition font-semibold"
            >
              <Edit className="w-5 h-5" />
              Edit Medicine
            </Link>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border border-cyan-500 border-t-transparent"></div>
            </div>
            <p className="text-slate-400">Loading medicine details...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span>Failed to load medicine details.</span>
          </div>
        )}

        {/* Data */}
        {!isLoading && !error && data && (
          <>
            {/* Main Info Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 shadow-lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-cyan-400">{medicine.name}</h3>
                  {medicine.manufacturer && (
                    <p className="text-slate-400 mt-2">by {medicine.manufacturer}</p>
                  )}
                </div>
                {medicine.type && (
                  <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm font-semibold">
                    {medicine.type}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Price</div>
                  <div className="text-2xl font-bold text-cyan-400 mt-2">₹{medicine.price?.toFixed(2) || "0"}</div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  medicine.isLowStock
                    ? "bg-orange-900/30 border-orange-700"
                    : "bg-green-900/30 border-green-700"
                }`}>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Stock</div>
                  <div className={`text-2xl font-bold mt-2 ${
                    medicine.isLowStock ? "text-orange-400" : "text-green-400"
                  }`}>
                    {medicine.stockQuantity || 0}
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Batch</div>
                  <div className="text-lg font-semibold mt-2">{medicine.batchNumber || "N/A"}</div>
                </div>

                <div className={`p-4 rounded-lg border ${
                  medicine.isExpired
                    ? "bg-red-900/30 border-red-700"
                    : medicine.daysUntilExpiry !== null && medicine.daysUntilExpiry < 30
                    ? "bg-yellow-900/30 border-yellow-700"
                    : "bg-green-900/30 border-green-700"
                }`}>
                  <div className="text-xs text-slate-400 uppercase font-semibold">Status</div>
                  <div className={`text-lg font-bold mt-2 ${
                    medicine.isExpired
                      ? "text-red-400"
                      : medicine.daysUntilExpiry !== null && medicine.daysUntilExpiry < 30
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}>
                    {medicine.isExpired ? "❌ Expired" : medicine.daysUntilExpiry !== null && medicine.daysUntilExpiry < 30 ? `⚠️ ${medicine.daysUntilExpiry}d left` : "✅ Good"}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Composition */}
                {medicine.composition && (
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-300 uppercase mb-3">Composition</h4>
                    <p className="text-slate-300">{medicine.composition}</p>
                  </div>
                )}

                {/* Location */}
                {medicine.location && (
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-300 uppercase mb-3">Storage Location</h4>
                    <p className="text-slate-300 font-mono">{medicine.location}</p>
                  </div>
                )}

                {/* Expiry Date */}
                {medicine.expiryDate && (
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-300 uppercase mb-3">Expiry Date</h4>
                    <p className="text-slate-300 font-mono text-lg">
                      {new Date(medicine.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                {medicine.description && (
                  <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-300 uppercase mb-3">Description</h4>
                    <p className="text-slate-300 leading-relaxed">{medicine.description}</p>
                  </div>
                )}

                {/* Additional Info */}
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-xl">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase mb-3">Additional Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Medicine ID</span>
                      <span className="font-mono text-cyan-400">#{medicine.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Inventory Value</span>
                      <span className="font-semibold text-cyan-400">₹{(medicine.price * medicine.stockQuantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push("/pharmacy")}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to List
            </button>
          </>
        )}
      </div>
    </Layout>
  );
}
