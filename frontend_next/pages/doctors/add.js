"use client";

import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  UserPlus, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Stethoscope, 
  ArrowLeft,
  Loader2
} from "lucide-react";

const API = "http://localhost:8080/api/doctors";

export default function AddDoctor() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
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
    setSaving(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/doctors");
      } else {
        alert("Failed to add doctor.");
        setSaving(false);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
      setSaving(false);
    }
  };

  // --- Styles ---
  const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder-slate-600";
  const iconClass = "absolute left-3 top-3 text-slate-500 pointer-events-none";

  return (
    <Layout active="doctors/add">
      <div className="p-6 md:p-10 text-white min-h-screen flex flex-col items-center">
        
        <div className="w-full max-w-3xl space-y-8">
          
          {/* --- HEADER --- */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/doctors" 
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Add New Doctor</h2>
                <p className="text-slate-400 mt-1 text-sm">Create a profile for a new medical staff member.</p>
              </div>
            </div>
          </div>

          {/* --- FORM CARD --- */}
          <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl space-y-6">
            
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <User className="text-green-500" size={20} /> Personal Information
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <div className="relative">
                    <User size={18} className={iconClass} />
                    <input
                      className={inputClass}
                      name="name"
                      placeholder="e.g. Dr. Sarah Smith"
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
                        className={inputClass}
                        name="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        onChange={update}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <div className="relative">
                      <Phone size={18} className={iconClass} />
                      <input
                        className={inputClass}
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        onChange={update}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="pt-2">
              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Stethoscope className="text-blue-500" size={20} /> Professional Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Qualification</label>
                  <div className="relative">
                    <Award size={18} className={iconClass} />
                    <input
                      className={inputClass}
                      name="qualification"
                      placeholder="e.g. MBBS, MD"
                      onChange={update}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Specialization</label>
                  <div className="relative">
                    <Stethoscope size={18} className={iconClass} />
                    <input
                      className={inputClass}
                      name="specialization"
                      placeholder="e.g. Cardiology"
                      onChange={update}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-800 mt-6">
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
                  saving ? 'bg-green-800 cursor-wait' : 'bg-green-600 hover:bg-green-700 shadow-green-900/20'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} /> Save Profile
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