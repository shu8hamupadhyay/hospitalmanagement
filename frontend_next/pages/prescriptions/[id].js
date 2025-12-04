"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import SearchableSelect from "../../components/SearchableSelect";
import useSWR from "swr";
import Link from "next/link";

const API = "http://localhost:8080/api/prescriptions";
const PATIENTS_API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json());

const BackIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const MedicineIcon = () => (
  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);

export default function EditPrescription() {
  const router = useRouter();
  const { id } = router.query;

  const { data: patientsData } = useSWR(PATIENTS_API, fetcher);
  const { data: doctorsData } = useSWR(DOCTORS_API, fetcher);
  const patients = Array.isArray(patientsData) ? patientsData : [];
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadPrescription() {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Prescription not found");
        
        const data = await res.json();

        setForm({
          medicine: data.medicine || "",
          dosage: data.dosage || "",
          instructions: data.instructions || "",
          patientId: data.patientId || "",
          doctorId: data.doctorId || "",
        });
      } catch (err) {
        setError("Could not load prescription details.");
      }
    }

    loadPrescription();
  }, [id]);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      ...form,
      patientId: form.patientId ? Number(form.patientId) : null,
      doctorId: form.doctorId ? Number(form.doctorId) : null,
    };

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update");

      router.push("/prescriptions");
    } catch (err) {
      alert("Error updating prescription: " + err.message);
      setIsSaving(false);
    }
  }

  if (!form) {
    return (
      <Layout active="prescriptions">
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="prescriptions">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/prescriptions">
          <button className="flex items-center text-blue-500 hover:text-blue-600 mb-4">
            <BackIcon /> Back to Prescriptions
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Prescription</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          {/* Medicine */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <MedicineIcon className="inline" /> Medicine Name
            </label>
            <input
              type="text"
              name="medicine"
              value={form.medicine}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Dosage</label>
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Instructions</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Patient */}
          <div>
            <SearchableSelect
              label="Patient"
              value={form.patientId}
              onChange={(val) => setForm({...form, patientId: val})}
              options={patients}
              placeholder="Select a patient..."
              getOptionLabel={(p) => p.name}
              required
            />
          </div>

          {/* Doctor */}
          <div>
            <SearchableSelect
              label="Doctor"
              value={form.doctorId}
              onChange={(val) => setForm({...form, doctorId: val})}
              options={doctors}
              placeholder="Select a doctor..."
              getOptionLabel={(d) => `${d.name} (${d.specialization})`}
              required
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
            <Link href="/prescriptions">
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
