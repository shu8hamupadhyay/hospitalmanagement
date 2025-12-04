"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";

const API = "http://localhost:8080/api/contacts";

const BackIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);

export default function EditContact() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadContact() {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Contact not found");
        
        const data = await res.json();

        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          category: data.category || "",
        });
      } catch (err) {
        setError("Could not load contact details.");
      }
    }

    loadContact();
  }, [id]);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      router.push("/contacts");
    } catch (err) {
      alert("Error updating contact: " + err.message);
      setIsSaving(false);
    }
  }

  if (!form) {
    return (
      <Layout active="contacts">
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="contacts">
      <div className="max-w-2xl mx-auto p-6">
        <Link href="/contacts">
          <button className="flex items-center text-blue-500 hover:text-blue-600 mb-4">
            <BackIcon /> Back to Contacts
          </button>
        </Link>

        <h1 className="text-3xl font-bold text-slate-800 mb-6">Edit Contact</h1>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={save} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <UserIcon className="inline" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={update}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Client">Client</option>
              <option value="Vendor">Vendor</option>
              <option value="Partner">Partner</option>
              <option value="Employee">Employee</option>
              <option value="Other">Other</option>
            </select>
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
            <Link href="/contacts">
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
