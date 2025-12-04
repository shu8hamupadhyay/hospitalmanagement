"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../../components/Layout";
import { 
  Save, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Stethoscope, 
  ArrowLeft, 
  Loader2,
  Building,
  AlertTriangle
} from "lucide-react";

const API = "http://localhost:8080/api/doctors";
const DEPT_API = "http://localhost:8080/api/departments";

export default function EditDoctor() {
  const router = useRouter();
  const { id } = router.query;

  // State
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    departmentId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --- Load Data ---
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        // Fetch Doctor and Departments in parallel
        const [doctorRes, deptRes] = await Promise.all([
          fetch(`${API}/${id}`),
          fetch(DEPT_API)
        ]);

        if (!doctorRes.ok) throw new Error("Failed to load doctor");
        
        const doctorData = await doctorRes.json();
        const deptData = await deptRes.json();

        setDepartments(Array.isArray(deptData) ? deptData : []);
        
        // Populate Form
        setForm({
          name: doctorData.name || "",
          email: doctorData.email || "",
          phone: doctorData.phone || "",
          qualification: doctorData.qualification || "",
          specialization: doctorData.specialization || "",
          departmentId: doctorData.departmentId || "",
        });

      } catch (e) {
        console.error(e);
        setError("Could not load doctor details.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // --- Handlers ---
  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.departmentId) {
      setError("Name and Department are required.");
      window.scrollTo(0,0);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          departmentId: Number(form.departmentId),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/doctors");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // --- Styles ---
  const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-slate-600";
  const selectClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer";
  const iconClass = "absolute left-3 top-3 text-slate-500 pointer-events-none";

  // --- Loading State ---
  if (loading) return (
    <Layout active="doctors/edit">
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
         <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p>Loading doctor profile...</p>
      </div>
    </Layout>
  );

  return (
    <Layout active="doctors/edit">
      <div className="p-6 md:p-10 text-white min-h-screen flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">

          {/* --- HEADER --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.back()} 
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Edit Doctor</h2>
                <p className="text-slate-400 mt-1 text-sm">Update profile information for <span className="text-amber-400">{form.name}</span>.</p>
              </div>
            </div>
          </div>

          {/* --- ERROR ALERT --- */}
          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in">
              <AlertTriangle size={20} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* --- FORM --- */}
          <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-8">
            
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="text-blue-500" size={20} /> Personal Information
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User size={18} className={iconClass} />
                    <input
                      name="name"
                      className={inputClass}
                      placeholder="e.g. Dr. John Doe"
                      value={form.name}
                      onChange={update}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail size={18} className={iconClass} />
                      <input
                        name="email"
                        className={inputClass}
                        placeholder="doctor@hospital.com"
                        value={form.email}
                        onChange={update}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className={iconClass} />
                      <input
                        name="phone"
                        className={inputClass}
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={update}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Stethoscope className="text-green-500" size={20} /> Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Qualification</label>
                  <div className="relative">
                    <Award size={18} className={iconClass} />
                    <input
                      name="qualification"
                      className={inputClass}
                      placeholder="e.g. MBBS, MD"
                      value={form.qualification}
                      onChange={update}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Specialization</label>
                  <div className="relative">
                    <Stethoscope size={18} className={iconClass} />
                    <input
                      name="specialization"
                      className={inputClass}
                      placeholder="e.g. Cardiology"
                      value={form.specialization}
                      onChange={update}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className={labelClass}>Department *</label>
                  <div className="relative">
                    <Building size={18} className={iconClass} />
                    <select
                      name="departmentId"
                      className={selectClass}
                      value={form.departmentId}
                      onChange={update}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-800">
              <Link 
                href="/doctors" 
                className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all ${
                  saving ? 'bg-amber-800 cursor-wait' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
}