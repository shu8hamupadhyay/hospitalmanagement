"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import useSWR from "swr";

const API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;

  // Load doctors safely
  const { data: doctorsData } = useSWR(DOCTORS_API, fetcher);
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();

      setForm({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        email: data.email || "",
        phone: data.phone || "",
        dob: data.dob || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "",
        bloodGroup: data.bloodGroup || "",
        maritalStatus: data.maritalStatus || "",
        medicalHistory: data.medicalHistory || "",
        allergies: data.allergies || "",
        currentMedications: data.currentMedications || "",
        emergencyContactName: data.emergencyContactName || "",
        emergencyContactNumber: data.emergencyContactNumber || "",
        relationshipToPatient: data.relationshipToPatient || "",
        insuranceProvider: data.insuranceProvider || "",
        insurancePolicyNumber: data.insurancePolicyNumber || "",
        doctorId: data.doctor ? data.doctor.id : "",
      });
    }

    load();
  }, [id]);

  if (!form)
    return (
      <Layout>
        <div className="p-6 text-white">Loading...</div>
      </Layout>
    );

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();

    const payload = {
      ...form,
      age: Number(form.age),
      doctor: form.doctorId ? { id: Number(form.doctorId) } : null,
    };

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    router.push("/patients");
  }

  return (
    <Layout active="patients">
      <div className="p-6 max-w-3xl mx-auto text-white">

        <h2 className="text-3xl font-semibold mb-6">Edit Patient</h2>

        <form onSubmit={save} className="space-y-4 bg-slate-900 p-6 rounded border">

          <input className="input-dark" name="name" value={form.name} onChange={update} />

          <input className="input-dark" name="email" value={form.email} onChange={update} />

          <input className="input-dark" name="phone" value={form.phone} onChange={update} />

          <input className="input-dark" name="age" type="number" value={form.age} onChange={update} />

          <input className="input-dark" name="dob" type="date" value={form.dob} onChange={update} />

          <select name="gender" className="input-dark" value={form.gender} onChange={update}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input className="input-dark" name="address" value={form.address} onChange={update} />

          <input className="input-dark" name="city" value={form.city} onChange={update} />

          <input className="input-dark" name="state" value={form.state} onChange={update} />

          <input className="input-dark" name="country" value={form.country} onChange={update} />

          <select name="bloodGroup" className="input-dark" value={form.bloodGroup} onChange={update}>
            <option value="">Select</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option>
            <option>AB+</option><option>AB-</option>
          </select>

          <select name="maritalStatus" className="input-dark" value={form.maritalStatus} onChange={update}>
            <option value="">Select</option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Widowed</option>
          </select>

          <textarea className="input-dark" name="medicalHistory" value={form.medicalHistory} onChange={update} />

          <textarea className="input-dark" name="allergies" value={form.allergies} onChange={update} />

          <textarea className="input-dark" name="currentMedications" value={form.currentMedications} onChange={update} />

          <input className="input-dark" name="emergencyContactName" value={form.emergencyContactName} onChange={update} />

          <input className="input-dark" name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={update} />

          <input className="input-dark" name="relationshipToPatient" value={form.relationshipToPatient} onChange={update} />

          <input className="input-dark" name="insuranceProvider" value={form.insuranceProvider} onChange={update} />

          <input className="input-dark" name="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={update} />

          <select className="input-dark" name="doctorId" value={form.doctorId} onChange={update}>
            <option value="">Unassigned</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialization}
              </option>
            ))}
          </select>

          <button className="px-4 py-2 bg-green-600 rounded">Update</button>
        </form>

      </div>
    </Layout>
  );
}
