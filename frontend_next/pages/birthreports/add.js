import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const API = "http://localhost:8080/api/birthreports";

const BabyIcon = () => (
  <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);

export default function AddBirthReport() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    babyName: "",
    motherName: "",
    fatherName: "",
    gender: "",
    birthDateTime: new Date().toISOString().split("T")[0],
    doctorName: "",
    remarks: "",
  });

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function save(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate required fields
    if (!form.babyName || !form.motherName || !form.fatherName || !form.gender || !form.birthDateTime || !form.doctorName) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Prevent duplicate submission
    const payload = JSON.stringify(form);
    const submissionHash = btoa(payload).substring(0, 20);
    const lastSubmissionKey = `lastBirthReportSubmission_${submissionHash}`;
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

      localStorage.removeItem(lastSubmissionKey);
      router.push("/birthreports");
    } catch (err) {
      setError("Error saving birth report: " + err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <Layout active="birthreports">
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/birthreports" className="text-pink-600 hover:text-pink-800 font-semibold flex items-center gap-2 mb-4">
              ← Back to Birth Reports
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Add Birth Report</h1>
            <p className="text-slate-600 mt-2">Record a new birth in the hospital</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={save} className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👶 Baby Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="babyName"
                  value={form.babyName}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Baby's Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👩 Mother Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="motherName"
                  value={form.motherName}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Mother's Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👨 Father Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherName"
                  value={form.fatherName}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Father's Full Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👶 Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📅 Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDateTime"
                  value={form.birthDateTime}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  👨‍⚕️ Doctor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={form.doctorName}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Doctor's Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📝 Remarks
                </label>
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={update}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                  placeholder="Any additional notes or remarks..."
                />
              </div>

              <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "✓ Save Birth Report"}
                </button>
                <Link href="/birthreports" className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 px-4 rounded-lg transition text-center">
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
