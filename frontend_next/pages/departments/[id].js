"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";

import { 
  Building, 
  User, 
  Users, 
  Stethoscope, 
  Activity, 
  Save, 
  ArrowLeft, 
  Loader2,
  AlertTriangle
} from "lucide-react";

const API = "http://localhost:8080/api/departments";
const DOCTORS_API = "http://localhost:8080/api/doctors";

export default function EditDepartment() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------
  // LOAD DEPARTMENT DTO + DOCTORS LIST
  // ----------------------------------------------------
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        // Load department DTO
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Department not found");
        const data = await res.json();
        setForm(data);

        // Load doctors
        const docRes = await fetch(DOCTORS_API);
        const docData = await docRes.json();
        setDoctors(docData);

      } catch (e) {
        console.error(e);
        setError("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ----------------------------------------------------
  // UPDATE FORM FIELDS
  // ----------------------------------------------------
  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ----------------------------------------------------
  // SAVE UPDATED DTO
  // ----------------------------------------------------
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          staffCount: Number(form.staffCount),
          headDoctorId: Number(form.headDoctorId),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/departments");
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // STYLE CLASSES
  // ----------------------------------------------------
  const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500";
  const selectClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-emerald-500";
  const iconClass = "absolute left-3 top-3 text-slate-500";

  // ----------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------
  if (loading)
    return (
      <Layout active="departments">
        <div className="min-h-screen flex items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );

  if (!form)
    return (
      <Layout active="departments">
        <div className="p-10 text-center">
          <div className="p-4 bg-red-900/20 rounded-full text-red-500 mb-4">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-xl font-bold text-white">Department Not Found</h2>
        </div>
      </Layout>
    );

  return (
    <Layout active="departments">
      <div className="p-6 md:p-10 text-white min-h-screen flex justify-center">

        <div className="w-full max-w-2xl space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-bold">Edit Department</h2>
              <p className="text-slate-400 text-sm">
                Updating <span className="text-emerald-400">{form.name}</span>
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-700 text-red-400 rounded-lg flex items-center gap-3">
              <AlertTriangle size={20} /> {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">

            {/* NAME */}
            <div>
              <label className={labelClass}>Department Name *</label>
              <div className="relative">
                <Building size={18} className={iconClass} />
                <input
                  className={inputClass}
                  name="name"
                  value={form.name}
                  onChange={update}
                  required
                />
              </div>
            </div>

            {/* HEAD DOCTOR */}
            <div>
              <label className={labelClass}>Head Doctor *</label>
              <div className="relative">
                <User size={18} className={iconClass} />
                <select
                  className={selectClass}
                  name="headDoctorId"
                  value={form.headDoctorId}
                  onChange={update}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* STAFF COUNT */}
            <div>
              <label className={labelClass}>Staff Count</label>
              <div className="relative">
                <Users size={18} className={iconClass} />
                <input
                  type="number"
                  className={inputClass}
                  name="staffCount"
                  value={form.staffCount}
                  onChange={update}
                />
              </div>
            </div>

            {/* SERVICES */}
            <div>
              <label className={labelClass}>Services Offered</label>
              <div className="relative">
                <Stethoscope size={18} className={iconClass} />
                <input
                  className={inputClass}
                  name="servicesOffered"
                  value={form.servicesOffered}
                  onChange={update}
                />
              </div>
            </div>

            {/* STATUS */}
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

            {/* ACTIONS */}
            <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
              <Link href="/departments" className="px-5 py-2.5 border border-slate-600 rounded-lg text-slate-300">
                Cancel
              </Link>
              <button
                disabled={saving}
                className={`px-6 py-2.5 rounded-lg text-white flex items-center ${
                  saving
                    ? "bg-emerald-800 cursor-wait"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </Layout>
  );
}
