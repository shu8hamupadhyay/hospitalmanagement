"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";

const API = "http://localhost:8080/api/roomallotments";

const BackIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const BuildingIcon = () => (
  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);

export default function EditRoomAllotment() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadRoom() {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Room Allotment not found");
        
        const data = await res.json();

        setForm({
          roomNumber: data.roomNumber || "",
          patientName: data.patientName || "",
          roomType: data.roomType || "",
          doctorInCharge: data.doctorInCharge || "",
          admissionDate: data.admissionDate || "",
          dischargeDate: data.dischargeDate || "",
          status: data.status || "",
        });
      } catch (err) {
        setError("Could not load room allotment details.");
      }
    }

    loadRoom();
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

      router.push("/roomallotments");
    } catch (err) {
      alert("Error updating room allotment: " + err.message);
      setIsSaving(false);
    }
  }

  if (!form) {
    return (
      <Layout active="roomallotments">
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="roomallotments">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/roomallotments">
          <button className="flex items-center text-blue-500 hover:text-blue-600 mb-4">
            <BackIcon /> Back to Room Allotments
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Room Allotment</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          {/* Room Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <BuildingIcon className="inline" /> Room Number
            </label>
            <input
              type="text"
              name="roomNumber"
              value={form.roomNumber}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Patient Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Room Type</label>
            <select
              name="roomType"
              value={form.roomType}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Room Type</option>
              <option value="General">General</option>
              <option value="Private">Private</option>
              <option value="ICU">ICU</option>
              <option value="Semi-Private">Semi-Private</option>
            </select>
          </div>

          {/* Doctor In Charge */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Doctor In Charge</label>
            <input
              type="text"
              name="doctorInCharge"
              value={form.doctorInCharge}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Admission Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Admission Date</label>
            <input
              type="date"
              name="admissionDate"
              value={form.admissionDate}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Discharge Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Discharge Date</label>
            <input
              type="date"
              name="dischargeDate"
              value={form.dischargeDate}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Occupied">Occupied</option>
              <option value="Available">Available</option>
              <option value="Cleaning">Cleaning</option>
            </select>
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
            <Link href="/roomallotments">
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
