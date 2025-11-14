"use client";

import Layout from "../../components/Layout";
import { useState } from "react";

const API = "http://localhost:8080/api/doctors";

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
  });

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/doctors";
  };

  return (
    <Layout active="doctors/add">
      <div className="p-6 max-w-3xl mx-auto text-white">

        <h2 className="text-3xl font-bold mb-6">Add Doctor</h2>

        <form
          onSubmit={save}
          className="bg-slate-900 p-6 rounded-lg border border-slate-700 space-y-4"
        >
          <input
            className="input-dark"
            name="name"
            placeholder="Name"
            onChange={update}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input-dark"
              name="email"
              placeholder="Email"
              onChange={update}
            />
            <input
              className="input-dark"
              name="phone"
              placeholder="Phone"
              onChange={update}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input-dark"
              name="qualification"
              placeholder="Qualification"
              onChange={update}
            />
            <input
              className="input-dark"
              name="specialization"
              placeholder="Specialization"
              onChange={update}
            />
          </div>

          <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
            Save
          </button>

          <a href="/doctors" className="ml-3 text-slate-400">
            Back
          </a>
        </form>

      </div>
    </Layout>
  );
}
