"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
const API = "http://localhost:8080/api/departments";

export default function EditDepartment() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function load() {
      const res = await fetch(`${API}/${id}`);
      const data = await res.json();
      setForm(data);
      setLoading(false);
    }

    load();
  }, [id]);

  if (loading) return <Layout><div className="p-6 text-center">Loading...</div></Layout>;
  if (!form) return <Layout><div className="p-6 text-center text-red-400">Not found</div></Layout>;

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();

    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        staffCount: Number(form.staffCount),
      }),
    });

    router.push("/departments");
  };

  return (
    <Layout active="departments">
      <div className="p-6 max-w-2xl mx-auto text-white">

        <h2 className="text-3xl font-semibold mb-6">Edit Department</h2>

        <form onSubmit={save} className="bg-slate-900 p-6 rounded-lg border space-y-4">

          <input className="input-dark" name="name" value={form.name} onChange={update} />

          <input className="input-dark" name="head" value={form.head} onChange={update} />

          <input className="input-dark" name="staffCount" type="number" value={form.staffCount} onChange={update} />

          <input className="input-dark" name="servicesOffered" value={form.servicesOffered} onChange={update} />

          <select className="input-dark" name="status" value={form.status} onChange={update}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button className="px-4 py-2 bg-green-600 rounded">Update</button>
          <a href="/departments" className="ml-3 text-slate-400">Back</a>

        </form>

      </div>
    </Layout>
  );
}
