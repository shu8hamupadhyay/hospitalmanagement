"use client";

import Layout from "../../components/Layout";
import { useState } from "react";

const API = "http://localhost:8080/api/departments";

export default function AddDepartment() {
  const [form, setForm] = useState({
    name: "",
    head: "",
    staffCount: "",
    servicesOffered: "",
    status: "Active",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        staffCount: Number(form.staffCount),
      }),
    });

    window.location.href = "/departments";
  };

  return (
    <Layout active="departments">
      <div className="p-6 max-w-2xl mx-auto text-white">

        <h2 className="text-3xl font-semibold mb-6">Add Department</h2>

        <form onSubmit={save} className="bg-slate-900 p-6 rounded-lg border space-y-4">

          <input className="input-dark" name="name" placeholder="Department Name" onChange={update} required />

          <input className="input-dark" name="head" placeholder="Head of Department" onChange={update} required />

          <input className="input-dark" name="staffCount" type="number" placeholder="Staff Count" onChange={update} required />

          <input className="input-dark" name="servicesOffered" placeholder="Services Offered" onChange={update} required />

          <select className="input-dark" name="status" onChange={update}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="px-4 py-2 bg-green-600 rounded">Save</button>
          <a href="/departments" className="ml-3 text-slate-400">Back</a>
        </form>

      </div>
    </Layout>
  );
}
