"use client";

import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import { AlertCircle, CheckCircle2, Save, X } from "lucide-react";

const API = "http://localhost:8080/api/pharmacy/medicines";

export default function AddMedicine() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    manufacturer: "",
    batchNumber: "",
    expiryDate: "",
    composition: "",
    type: "",
    price: "",
    stockQuantity: "",
    description: "",
    location: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (!form.name.trim()) {
      setError("Medicine name is required");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: form.name,
        manufacturer: form.manufacturer || null,
        batchNumber: form.batchNumber || null,
        expiryDate: form.expiryDate || null,
        composition: form.composition || null,
        type: form.type || null,
        price: form.price ? Number(form.price) : 0,
        stockQuantity: form.stockQuantity ? Number(form.stockQuantity) : 0,
        description: form.description || null,
        location: form.location || null,
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "Failed to save medicine";
        try {
          const text = await res.text();
          if (text) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorData.error || text;
            } catch (parseErr) {
              errorMessage = text;
            }
          }
        } catch (e) {
          console.error("Error reading response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setSuccess("Medicine added successfully!");
      setTimeout(() => {
        router.push("/pharmacy");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to save medicine");
      setSaving(false);
    }
  };

  const label = "block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2";
  const input =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-slate-600";
  const textarea =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-slate-600 resize-vertical";
  const sectionClass = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg";

  return (
    <Layout active="pharmacy">
      <div className="p-6 text-white space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">💊 Add Medicine</h2>
          <p className="text-sm text-slate-400 mt-1">Add a new medicine to the inventory</p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-900/30 border border-red-700 text-red-300">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-900/30 border border-green-700 text-green-300">
            <CheckCircle2 className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={save} className="space-y-6">
          {/* Basic Information Section */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Medicine Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="e.g., Paracetamol 500mg"
                  className={input}
                  required
                />
              </div>

              <div>
                <label className={label}>Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={update}
                  className={input}
                >
                  <option value="">Select Type</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Cream">Cream</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Powder">Powder</option>
                  <option value="Drops">Drops</option>
                </select>
              </div>

              <div>
                <label className={label}>Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={update}
                  placeholder="e.g., Cipla Ltd"
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={update}
                  placeholder="e.g., BATCH001"
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Inventory Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={update}
                  placeholder="0"
                  min="0"
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Price per Unit (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={update}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={update}
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Storage Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={update}
                  placeholder="e.g., Shelf A1"
                  className={input}
                />
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Details</h3>
            <div className="space-y-6">
              <div>
                <label className={label}>Composition</label>
                <input
                  type="text"
                  name="composition"
                  value={form.composition}
                  onChange={update}
                  placeholder="e.g., Paracetamol IP 500mg"
                  className={input}
                />
              </div>

              <div>
                <label className={label}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={update}
                  placeholder="Additional details about the medicine..."
                  rows="4"
                  className={textarea}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => router.push("/pharmacy")}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition font-semibold"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 rounded-lg transition font-semibold"
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving..." : "Save Medicine"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
