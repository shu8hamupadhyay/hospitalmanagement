"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";

const API = "http://localhost:8080/api/birthreports";

const BackIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const BabyIcon = () => (
  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
);

export default function EditBirthReport() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadReport() {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Birth Report not found");
        
        const data = await res.json();

        setForm({
          babyName: data.babyName || "",
          motherName: data.motherName || "",
          fatherName: data.fatherName || "",
          gender: data.gender || "",
          doctorName: data.doctorName || "",
          remarks: data.remarks || "",
        });
      } catch (err) {
        setError("Could not load birth report details.");
      }
    }

    loadReport();
  }, [id]);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      router.push("/birthreports");
    } catch (err) {
      alert("Error updating birth report: " + err.message);
      setIsSaving(false);
    }
  }

  if (!form) {
    return (
      <Layout active="birthreports">
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="birthreports">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/birthreports">
          <button className="flex items-center text-blue-500 hover:text-blue-600 mb-4">
            <BackIcon /> Back to Birth Reports
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Birth Report</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          {/* Baby Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <BabyIcon className="inline" /> Baby Name
            </label>
            <input
              type="text"
              name="babyName"
              value={form.babyName}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mother Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Mother Name</label>
            <input
              type="text"
              name="motherName"
              value={form.motherName}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Father Name</label>
            <input
              type="text"
              name="fatherName"
              value={form.fatherName}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor Name</label>
            <input
              type="text"
              name="doctorName"
              value={form.doctorName}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Update"}
            </button>
            <Link href="/birthreports">
              <button type="button" className="px-6 py-2 bg-slate-300 text-slate-800 rounded-lg hover:bg-slate-400 transition">
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
