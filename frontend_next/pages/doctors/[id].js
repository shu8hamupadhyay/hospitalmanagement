"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/Layout";

const API = "http://localhost:8080/api/doctors";

export default function EditDoctor() {
  const { id } = useParams();               // 🟢 Correct for dynamic routes
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // 🔄 Load Doctor Details
  // ==========================================================
  useEffect(() => {
    if (!id) return;                        // Prevent fetching before ID exists

    async function load() {
      try {
        const res = await fetch(`${API}/${id}`);
        const data = await res.json();
        setForm(data);
      } catch (e) {
        console.error("Failed to load doctor", e);
      }
      setLoading(false);
    }

    load();
  }, [id]);

  // ==========================================================
  // 🕒 Loading UI
  // ==========================================================
  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-center text-slate-300">Loading doctor...</div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <div className="p-6 text-center text-red-400">
          Failed to load doctor record.
        </div>
      </Layout>
    );
  }

  // ==========================================================
  // ✏ Update form fields
  // ==========================================================
  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ==========================================================
  // 💾 Save / Update
  // ==========================================================
  const save = async (e) => {
    e.preventDefault();

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/doctors";
  };

  // ==========================================================
  // 🎨 UI
  // ==========================================================
  return (
    <Layout active="doctors/edit">
      <div className="p-6 max-w-xl mx-auto text-white">

        <h2 className="text-3xl font-semibold mb-6">Edit Doctor</h2>

        <form
          onSubmit={save}
          className="bg-slate-900 border border-slate-700 shadow-lg p-6 rounded-lg space-y-4"
        >
          <input
            name="name"
            className="input-dark"
            placeholder="Name"
            value={form.name || ""}
            onChange={update}
            required
          />

          <input
            name="email"
            className="input-dark"
            placeholder="Email"
            value={form.email || ""}
            onChange={update}
          />

          <input
            name="phone"
            className="input-dark"
            placeholder="Phone"
            value={form.phone || ""}
            onChange={update}
          />

          <input
            name="qualification"
            className="input-dark"
            placeholder="Qualification"
            value={form.qualification || ""}
            onChange={update}
          />

          <input
            name="specialization"
            className="input-dark"
            placeholder="Specialization"
            value={form.specialization || ""}
            onChange={update}
          />

          <div className="pt-4 flex justify-between">
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
            >
              Update
            </button>

            <a
              href="/doctors"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </Layout>
  );
}
