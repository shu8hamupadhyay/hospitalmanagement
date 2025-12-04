"use client";

import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Building,
  Users,
  Stethoscope,
  Activity,
  Save,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  User
} from "lucide-react";

const API = "http://localhost:8080/api/departments";
const DOCTOR_API = "http://localhost:8080/api/doctors";

export default function AddDepartment() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    name: "",
    headDoctorId: "",
    staffCount: "",
    servicesOffered: "",
    status: "Active",
  });

  // Load doctors list from backend
  useEffect(() => {
    fetch(DOCTOR_API)
      .then((r) => r.json())
      .then((d) => setDoctors(Array.isArray(d) ? d : []))
      .catch(() => setDoctors([]));
  }, []);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          headDoctorId: Number(form.headDoctorId) || null,
          staffCount: Number(form.staffCount) || 0,
          servicesOffered: form.servicesOffered,
          status: form.status,
        }),
      });

      if (res.ok) {
        router.push("/departments");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  };

  // --- Styles ---
  const labelClass =
    "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all";
  const selectClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer";
  const iconClass = "absolute left-3 top-3 text-slate-500 pointer-events-none";

  return (
    <Layout active="departments">
      <div className="p-6 md:p-10 text-white min-h-screen flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* HEADER */}
          <div className="flex items-center gap-3">
            <Link
              href="/departments"
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h2 className="text-3xl font-bold">New Department</h2>
              <p className="text-slate-400 text-sm">
                Establish a new medical unit using DTO-based submission.
              </p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* FORM */}
          <form
            onSubmit={save}
            className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-6"
          >
            {/* Department Name */}
            <div>
              <label className={labelClass}>Department Name *</label>
              <div className="relative">
                <Building size={18} className={iconClass} />
                <input
                  className={inputClass}
                  name="name"
                  placeholder="e.g. Cardiology"
                  onChange={update}
                  required
                />
              </div>
            </div>

            {/* Head Doctor */}
            <div>
              <label className={labelClass}>Head Doctor *</label>
              <div className="relative">
                <User size={18} className={iconClass} />
                <select
                  className={selectClass}
                  name="headDoctorId"
                  onChange={update}
                  required
                >
                  <option value="">Select Head Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Count + Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Initial Staff Count</label>
                <div className="relative">
                  <Users size={18} className={iconClass} />
                  <input
                    className={inputClass}
                    name="staffCount"
                    type="number"
                    placeholder="0"
                    onChange={update}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Services Offered</label>
                <div className="relative">
                  <Stethoscope size={18} className={iconClass} />
                  <input
                    className={inputClass}
                    name="servicesOffered"
                    placeholder="e.g. Surgery, Consultation"
                    onChange={update}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <div className="relative">
                <Activity size={18} className={iconClass} />
                <select
                  className={selectClass}
                  name="status"
                  value={form.status}
                  onChange={update}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-6 flex justify-end gap-3 border-t border-slate-800">
              <Link
                href="/departments"
                className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all ${
                  saving
                    ? "bg-emerald-800 cursor-wait"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} /> Create Department
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
