"use client";

import { useState } from "react";
import Layout from "../../components/Layout";

export default function AddDeathReportPage() {
  const API = "http://localhost:8080/api/death-reports";

  const [form, setForm] = useState({
    patientName: "",
    gender: "",
    ward: "",
    causeOfDeath: "",
    doctorName: "",
    dateOfDeath: "",
    remarks: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.location.href = "/deathreports";
    }
  };

  return (
    <Layout active="deathreports">
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Add Death Report</h2>

        <form className="bg-white rounded shadow p-6 space-y-4" onSubmit={save}>
          <input
            name="patientName"
            placeholder="Patient Name"
            className="input"
            onChange={update}
            required
          />

          <select name="gender" className="input" onChange={update}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            name="ward"
            placeholder="Ward"
            className="input"
            onChange={update}
          />

          <input
            name="causeOfDeath"
            placeholder="Cause of Death"
            className="input"
            onChange={update}
            required
          />

          <input
            name="doctorName"
            placeholder="Doctor Name"
            className="input"
            onChange={update}
            required
          />

          <input
            type="datetime-local"
            name="dateOfDeath"
            className="input"
            onChange={update}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            className="input h-24"
            onChange={update}
          />

          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Save Report
          </button>

          <a href="/deathreports" className="ml-3 text-slate-600">
            Back
          </a>
        </form>
      </div>
    </Layout>
  );
}
