"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import SearchableSelect from "../../components/SearchableSelect";
import Link from "next/link";
import {
  FlaskConical,
  User,
  FileText,
  Save,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Beaker,
} from "lucide-react";

export default function AddLabReportPage() {
  const router = useRouter();
  const API = "http://localhost:8080/api/labreports";

  const [patients, setPatients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    testName: "",
    result: "",
    notes: "",
  });

  const label = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5";
  const input =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-slate-600";
  const textarea =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all placeholder-slate-600 resize-vertical";
  const sectionClass = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg";

  // Load patients
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const pRes = await fetch("http://localhost:8080/api/patients");
        if (!pRes.ok) throw new Error("Failed to load patients");
        const pData = await pRes.json();
        setPatients(Array.isArray(pData) ? pData : []);
      } catch (e) {
        console.error("Failed to load patients:", e);
        setError("Failed to load patient list");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
    if (!form.patientId || !form.testName || !form.result) {
      setError("Please fill in all required fields");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        patientId: Number(form.patientId),
        testName: form.testName,
        result: form.result,
        notes: form.notes || null,
      };

      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = "Failed to save report";
        try {
          const text = await res.text();
          // Try to parse as JSON
          if (text) {
            try {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorData.error || text || "Failed to save report";
            } catch (parseErr) {
              // Not JSON, use text as is
              errorMessage = text || "Failed to save report";
            }
          }
        } catch (e) {
          console.error("Error reading response:", e);
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setSuccess("Lab report created successfully!");
      setTimeout(() => {
        router.push("/labreports");
      }, 1500);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to save lab report");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout active="labreports">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mr-3" />
          <span className="text-slate-400">Loading form data...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="labreports">
      <div className="p-6 md:p-10 text-white min-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Add Lab Report</h1>
            <p className="text-slate-400 mt-1">Create a new laboratory test report</p>
          </div>
          <div className="flex gap-3">
            <Link href="/labreports" className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
              Cancel
            </Link>
            <button 
              type="submit"
              form="labReportForm"
              disabled={saving}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-cyan-900/20 transition-all text-sm
                ${saving ? 'bg-cyan-800 cursor-wait' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Report
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
        <form id="labReportForm" onSubmit={save} className="space-y-8">
          
          {/* PATIENT SECTION */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="w-5 h-5 text-cyan-500" />
              Patient Information
            </h2>
            <SearchableSelect
              value={form.patientId}
              onChange={(val) => setForm({...form, patientId: val})}
              options={patients}
              placeholder="Select a patient..."
              getOptionLabel={(p) => `${p.name} (ID: ${p.id})`}
              required
            />
          </section>

          {/* TEST DETAILS SECTION */}
          <section className={sectionClass}>
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Beaker className="w-5 h-5 text-purple-500" />
              Test Information
            </h2>
            <div className="space-y-6">
              {/* Test Name */}
              <div>
                <label className={label}>Test Name *</label>
                <input
                  name="testName"
                  className={input}
                  placeholder="e.g., Blood Test, X-Ray, ECG"
                  required
                  value={form.testName}
                  onChange={update}
                />
              </div>

              {/* Test Result */}
              <div>
                <label className={label}>Test Result *</label>
                <textarea
                  name="result"
                  placeholder="Enter the test results (e.g., Normal, Abnormal, Positive, Negative)"
                  className={`${textarea} h-24`}
                  required
                  value={form.result}
                  onChange={update}
                />
              </div>

              {/* Notes */}
              <div>
                <label className={label}>Additional Notes</label>
                <textarea
                  name="notes"
                  placeholder="Any additional notes or observations (optional)"
                  className={`${textarea} h-20`}
                  value={form.notes}
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