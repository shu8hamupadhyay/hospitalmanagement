"use client";

import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Save,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Heart,
  User,
  Stethoscope,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";

export default function EditDeathReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const API = "http://localhost:8080/api/death-reports";

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState(null);

  const label = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";
  const input =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600";
  const textarea =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600 resize-vertical";
  const sectionClass = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg";

  // Load report, patients, and doctors
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        setLoading(true);

        // Fetch report data
        const reportRes = await fetch(`${API}/${id}`);
        if (!reportRes.ok) throw new Error("Report not found");
        const reportData = await reportRes.json();

        // Fetch patients and doctors in parallel
        const [pRes, dRes] = await Promise.all([
          fetch("http://localhost:8080/api/patients"),
          fetch("http://localhost:8080/api/doctors"),
        ]);

        if (!pRes.ok || !dRes.ok) throw new Error("Failed to load data");

        const pData = await pRes.json();
        const dData = await dRes.json();

        setPatients(Array.isArray(pData) ? pData : []);
        setDoctors(Array.isArray(dData) ? dData : []);

        // Format date properly for datetime-local input
        let formattedDate = "";
        if (reportData.dateOfDeath) {
          const date = new Date(reportData.dateOfDeath);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");
          formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        }

        // Set form with fetched report data
        setForm({
          patientId: reportData.patientId || "",
          doctorId: reportData.doctorId || "",
          gender: reportData.gender || "",
          ward: reportData.ward || "",
          causeOfDeath: reportData.causeOfDeath || "",
          dateOfDeath: formattedDate,
          remarks: reportData.remarks || "",
        });
      } catch (e) {
        console.error("Failed to load data:", e);
        setError(e.message || "Failed to load death report");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // SAVE REPORT (use DTO with IDs)
  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Validate required fields
    if (
      !form.patientId ||
      !form.doctorId ||
      !form.causeOfDeath ||
      !form.gender ||
      !form.dateOfDeath
    ) {
      setError("Please fill in all required fields");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        gender: form.gender,
        ward: form.ward || null,
        causeOfDeath: form.causeOfDeath,
        dateOfDeath: form.dateOfDeath,
        remarks: form.remarks || null,
      };

      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update report");
      }

      setSuccess("Death report updated successfully!");
      setTimeout(() => {
        router.push(`/deathreports/${id}`);
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to update death report");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout active="deathreports">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
          <span className="text-slate-400">Loading form data...</span>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout active="deathreports">
        <div className="p-6 max-w-4xl mx-auto text-center">
          <p className="text-red-400">Failed to load report</p>
          <Link href="/deathreports" className="mt-4 text-blue-400 hover:text-blue-300 transition">
            Back to Reports
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="deathreports">
      <div className="p-6 md:p-10 text-white min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Edit Death Report #{id}</h1>
              <p className="text-slate-400 mt-1">Update death report details</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/deathreports/${id}`} className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
                Cancel
              </Link>
              <button 
                type="submit"
                form="editDeathReportForm"
                disabled={saving}
                className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-blue-900/20 transition-all text-sm
                  ${saving ? 'bg-blue-800 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Report
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-red-400">{error}</span>
            </div>
          )}

          {/* SUCCESS ALERT */}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                ✓
              </div>
              <span className="text-green-400">{success}</span>
            </div>
          )}

          {/* FORM */}
          <form id="editDeathReportForm" onSubmit={save} className="space-y-8">
          {/* PATIENT & DOCTOR SECTION */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="w-5 h-5 text-blue-500" />
              Patient & Doctor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient */}
              <div>
                <label className={label}>Patient *</label>
                <select
                  name="patientId"
                  className={input}
                  value={form.patientId}
                  onChange={update}
                  required
                >
                  <option value="">-- Select Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (ID: {p.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className={label}>Gender *</label>
                <select
                  name="gender"
                  className={input}
                  value={form.gender}
                  onChange={update}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Doctor */}
              <div>
                <label className={label}>Doctor *</label>
                <select
                  name="doctorId"
                  className={input}
                  value={form.doctorId}
                  onChange={update}
                  required
                >
                  <option value="">-- Select Doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} - {d.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div>
                <label className={label}>Ward</label>
                <input
                  name="ward"
                  className={input}
                  placeholder="e.g., ICU, Ward A, General Ward"
                  value={form.ward}
                  onChange={update}
                />
              </div>
            </div>
          </section>

          {/* DEATH DETAILS SECTION */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <FileText className="w-5 h-5 text-purple-500" />
              Death Details
            </h2>
            <div className="space-y-6">
              {/* Cause of Death */}
              <div>
                <label className={label}>Cause of Death *</label>
                <input
                  name="causeOfDeath"
                  className={input}
                  placeholder="Enter the cause of death"
                  required
                  value={form.causeOfDeath}
                  onChange={update}
                />
              </div>

              {/* Date of Death */}
              <div>
                <label className={label}>Date of Death *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
                  <input
                    type="datetime-local"
                    name="dateOfDeath"
                    className={`${input} pl-10`}
                    required
                    value={form.dateOfDeath}
                    onChange={update}
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className={label}>Remarks</label>
                <textarea
                  name="remarks"
                  placeholder="Additional remarks or notes about the death (optional)"
                  className={`${textarea} h-32`}
                  value={form.remarks}
                  onChange={update}
                />
              </div>
            </div>
          </section>

          </form>
        </div>
      </div>
    </Layout>
  );
}
