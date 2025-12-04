import Layout from "../../components/Layout";
import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import SearchableSelect from "../../components/SearchableSelect";
import Link from "next/link";

const API = "http://localhost:8080/api/prescriptions";
const PATIENTS_API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json()).catch(() => []);

export default function AddPrescription() {
  const router = useRouter();
  const { data: patientsData } = useSWR(PATIENTS_API, fetcher);
  const { data: doctorsData } = useSWR(DOCTORS_API, fetcher);

  const patients = Array.isArray(patientsData) ? patientsData : [];
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    medicine: "",
    dosage: "",
    instructions: "",
    date: new Date().toISOString().split("T")[0],
    patientId: "",
    doctorId: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function save(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const payload = {
      ...form,
      patientId: form.patientId ? Number(form.patientId) : null,
      doctorId: form.doctorId ? Number(form.doctorId) : null,
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      router.push("/prescriptions");
    } catch (err) {
      setError("Error saving prescription: " + err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <Layout active="prescriptions">
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/prescriptions" className="text-green-600 hover:text-green-800 font-semibold flex items-center gap-2 mb-4">
              ← Back to Prescriptions
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Add New Prescription</h1>
            <p className="text-slate-600 mt-2">Create a new prescription for a patient</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={save} className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👤 Patient <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  value={form.patientId}
                  onChange={(val) => setForm({...form, patientId: val})}
                  options={patients}
                  placeholder="Select a patient..."
                  getOptionLabel={(p) => p.name || `Patient #${p.id}`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👨‍⚕️ Doctor <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  value={form.doctorId}
                  onChange={(val) => setForm({...form, doctorId: val})}
                  options={doctors}
                  placeholder="Select a doctor..."
                  getOptionLabel={(d) => `Dr. ${d.name || `#${d.id}`}`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  💊 Medicine <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="medicine"
                  value={form.medicine}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  ⚖️ Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., 500mg twice daily"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📅 Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📝 Instructions
                </label>
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={update}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., Take after meals, avoid dairy..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "✓ Save Prescription"}
                </button>
                <Link href="/prescriptions" className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 px-4 rounded-lg transition text-center">
                  Cancel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
