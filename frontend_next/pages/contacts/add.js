import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const API = "http://localhost:8080/api/contacts";

export default function AddContact() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    category: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function save(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate required fields
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Prevent duplicate submission
    const payload = JSON.stringify(form);
    const submissionHash = btoa(payload).substring(0, 20);
    const lastSubmissionKey = `lastContactSubmission_${submissionHash}`;
    const lastSubmissionTime = localStorage.getItem(lastSubmissionKey);
    const now = Date.now();

    if (lastSubmissionTime && now - parseInt(lastSubmissionTime) < 2000) {
      setError("Please wait before submitting again");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem(lastSubmissionKey, now.toString());

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      // Clear submission history on success
      localStorage.removeItem(lastSubmissionKey);
      router.push("/contacts");
    } catch (err) {
      setError("Error saving contact: " + err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <Layout active="contacts">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/contacts" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2 mb-4">
              ← Back to Contacts
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Add New Contact</h1>
            <p className="text-slate-600 mt-2">Fill in the details below to create a new contact</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={save} className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📝 Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Full Name"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  ✉️ Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="email@example.com"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📱 Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  🏢 Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Company Name"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  🏷️ Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">Select Category</option>
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                  <option value="Medical">Medical</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "✓ Save Contact"}
                </button>
                <Link href="/contacts" className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 px-4 rounded-lg transition text-center">
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
