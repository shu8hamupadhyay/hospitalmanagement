"use client";

import Layout from "../../components/Layout";
import { useState } from "react";
import useSWR, { mutate } from "swr";

const API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function AddPatient() {
  const { data: doctorsData } = useSWR(DOCTORS_API, fetcher);

  // Prevent crash if backend returns null or object
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bloodGroup: "",
    maritalStatus: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationshipToPatient: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    doctorId: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      dob: form.dob || null,
      doctor: form.doctorId ? { id: Number(form.doctorId) } : null,
    };

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Failed to save patient");
      return;
    }

    mutate(API);
    window.location.href = "/patients";
  }

  return (
    <Layout active="patients">
      <div className="p-6 max-w-4xl mx-auto text-white space-y-6">

        <div>
          <h2 className="text-3xl font-semibold">Add New Patient</h2>
          <p className="text-sm text-slate-400">
            Fill all patient details and assign a doctor.
          </p>
        </div>

        <form onSubmit={save} className="space-y-6">

          {/* ==================== PERSONAL INFO ==================== */}
          <section className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-medium text-green-300">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="name" value={form.name} onChange={update} required placeholder="Full Name" className="input-dark" />
              <input name="email" value={form.email} onChange={update} required type="email" placeholder="Email" className="input-dark" />
              <input name="phone" value={form.phone} onChange={update} placeholder="Phone" className="input-dark" />

              <select name="gender" value={form.gender} onChange={update} className="input-dark">
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input name="dob" value={form.dob} onChange={update} type="date" className="input-dark" />
              <input name="age" value={form.age} onChange={update} type="number" min="0" placeholder="Age" className="input-dark" />

              <select name="bloodGroup" value={form.bloodGroup} onChange={update} className="input-dark">
                <option value="">Blood Group</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option>
                <option>AB+</option><option>AB-</option>
              </select>

              <select name="maritalStatus" value={form.maritalStatus} onChange={update} className="input-dark">
                <option value="">Marital Status</option>
                <option>Single</option>
                <option>Married</option>
                <option>Divorced</option>
                <option>Widowed</option>
              </select>

              <input name="address" value={form.address} onChange={update} placeholder="Address" className="input-dark md:col-span-2" />
              <input name="city" value={form.city} onChange={update} placeholder="City" className="input-dark" />
              <input name="state" value={form.state} onChange={update} placeholder="State" className="input-dark" />
              <input name="country" value={form.country} onChange={update} placeholder="Country" className="input-dark" />
            </div>
          </section>

          {/* ==================== MEDICAL INFO ==================== */}
          <section className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-medium text-green-300">
              Medical Information
            </h3>

            <textarea name="medicalHistory" value={form.medicalHistory} onChange={update} placeholder="Medical history" className="input-dark w-full h-28" />

            <input name="allergies" value={form.allergies} onChange={update} placeholder="Allergies" className="input-dark" />

            <input name="currentMedications" value={form.currentMedications} onChange={update} placeholder="Current medications" className="input-dark" />
          </section>

          {/* ==================== EMERGENCY CONTACT ==================== */}
          <section className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-medium text-green-300">
              Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input name="emergencyContactName" value={form.emergencyContactName} onChange={update} placeholder="Contact name" className="input-dark" />
              <input name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={update} placeholder="Contact number" className="input-dark" />
              <input name="relationshipToPatient" value={form.relationshipToPatient} onChange={update} placeholder="Relationship" className="input-dark" />
            </div>
          </section>

          {/* ==================== INSURANCE & DOCTOR ==================== */}
          <section className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-medium text-green-300">
              Insurance & Assign Doctor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input name="insuranceProvider" value={form.insuranceProvider} onChange={update} placeholder="Insurance provider" className="input-dark" />
              <input name="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={update} placeholder="Policy number" className="input-dark" />

              <select name="doctorId" value={form.doctorId} onChange={update} className="input-dark md:col-span-2">
                <option value="">-- Select Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* ==================== ACTIONS ==================== */}
          <div className="flex justify-end gap-3">
            <a href="/patients" className="px-4 py-2 bg-slate-700 rounded">
              Cancel
            </a>

            <button type="submit" className="px-4 py-2 bg-green-600 rounded">
              Save Patient
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
