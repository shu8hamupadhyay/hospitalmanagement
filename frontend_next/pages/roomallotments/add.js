import Layout from "../../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SearchableSelect from "../../components/SearchableSelect";
import Link from "next/link";

const API = "http://localhost:8080/api/roomallotments";

const BuildingIcon = () => (
  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);

export default function AddRoomAllotment() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    roomNumber: "",
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorInCharge: "",
    roomType: "",
    admissionDate: new Date().toISOString().split("T")[0],
    dischargeDate: "",
    status: "Occupied",
  });

  // Load patients and doctors on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const [pRes, dRes] = await Promise.all([
          fetch("http://localhost:8080/api/patients"),
          fetch("http://localhost:8080/api/doctors")
        ]);
        if (pRes.ok) {
          const pData = await pRes.json();
          setPatients(pData);
        }
        if (dRes.ok) {
          const dData = await dRes.json();
          setDoctors(dData);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function save(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Validate required fields
    if (!form.roomNumber || !form.patientId || !form.doctorId || !form.roomType || !form.admissionDate) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Prevent duplicate submission
    const payload = JSON.stringify(form);
    const submissionHash = btoa(payload).substring(0, 20);
    const lastSubmissionKey = `lastRoomAllotmentSubmission_${submissionHash}`;
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
      router.push("/roomallotments");
    } catch (err) {
      setError("Error saving room allotment: " + err.message);
      setIsSubmitting(false);
    }
  }

  return (
    <Layout active="roomallotments">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/roomallotments" className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 mb-4">
              ← Back to Room Allotments
            </Link>
            <h1 className="text-4xl font-bold text-slate-800">Allot Room</h1>
            <p className="text-slate-600 mt-2">Assign a room to a patient</p>
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
                  🛏️ Room Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="e.g., 101, 102-A"
                  required
                />
              </div>

              <SearchableSelect
                label="Patient"
                value={form.patientId}
                onChange={(val) => {
                  const selectedPatient = patients.find(p => p.id === Number(val));
                  setForm({
                    ...form,
                    patientId: val,
                    patientName: selectedPatient ? selectedPatient.name : ""
                  });
                }}
                options={patients}
                placeholder="Select a patient..."
                required
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  🏥 Room Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                >
                  <option value="">Select Room Type</option>
                  <option value="General Ward">General Ward</option>
                  <option value="Private Room">Private Room</option>
                  <option value="ICU">ICU</option>
                  <option value="Semi-Private">Semi-Private</option>
                </select>
              </div>

              <SearchableSelect
                label="Doctor In Charge"
                value={form.doctorId}
                onChange={(val) => {
                  const selectedDoctor = doctors.find(d => d.id === Number(val));
                  setForm({
                    ...form,
                    doctorId: val,
                    doctorInCharge: selectedDoctor ? selectedDoctor.name : ""
                  });
                }}
                options={doctors}
                placeholder="Select a doctor..."
                getOptionLabel={(d) => `Dr. ${d.name}`}
                required
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📅 Admission Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="admissionDate"
                  value={form.admissionDate}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📅 Discharge Date (Optional)
                </label>
                <input
                  type="date"
                  name="dischargeDate"
                  value={form.dischargeDate}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  📊 Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={update}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                >
                  <option value="Occupied">Occupied</option>
                  <option value="Available">Available</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Saving..." : "✓ Save Room Allotment"}
                </button>
                <Link href="/roomallotments" className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-3 px-4 rounded-lg transition text-center">
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
