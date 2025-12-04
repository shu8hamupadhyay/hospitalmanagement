"use client";

import Layout from "../../components/Layout";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/navigation";
import SearchableSelect from "../../components/SearchableSelect";
import Link from "next/link";

const API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json());

// --- Icons ---
const UserIcon = () => (
  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const MedicalIcon = () => (
  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const PhoneIcon = () => (
  <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const ShieldIcon = () => (
  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
);
const SaveIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
);

export default function AddPatient() {
  const router = useRouter();
  const { data: doctorsData, isLoading: isLoadingDocs } = useSWR(DOCTORS_API, fetcher);
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", age: "", gender: "", email: "", phone: "", dob: "",
    address: "", city: "", state: "", country: "",
    bloodGroup: "", maritalStatus: "",
    medicalHistory: "", allergies: "", currentMedications: "",
    emergencyContactName: "", emergencyContactNumber: "", relationshipToPatient: "",
    insuranceProvider: "", insurancePolicyNumber: "", doctorId: "",
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      dob: form.dob || null,
      doctorId: form.doctorId ? Number(form.doctorId) : null,
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      mutate(API); // Refresh SWR cache
      router.push("/patients"); // Smooth client-side navigate
    } catch (err) {
      alert("Failed to save patient. Please check the data.");
      setIsSubmitting(false);
    }
  }

  // Consistent Input Styles
  const labelClass = "block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600";
  const sectionClass = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg";

  return (
    <Layout active="patients">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Add New Patient</h2>
            <p className="text-slate-400 mt-1">Create a new patient record in the system.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/patients" className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
                Cancel
             </Link>
             <button 
               onClick={save}
               disabled={isSubmitting}
               className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg shadow-blue-900/20 transition-all
                 ${isSubmitting ? 'bg-blue-800 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}`}
             >
                {isSubmitting ? 'Saving...' : <><SaveIcon /> Save Patient</>}
             </button>
          </div>
        </div>

        <form onSubmit={save} className="space-y-8">

          {/* 1. PERSONAL DETAILS */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
              <UserIcon /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <label className={labelClass}>Full Name *</label>
                <input required name="name" value={form.name} onChange={update} placeholder="e.g. John Doe" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input required type="email" name="email" value={form.email} onChange={update} placeholder="john@example.com" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input name="phone" value={form.phone} onChange={update} placeholder="+1 (555) 000-0000" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" name="dob" value={form.dob} onChange={update} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Age</label>
                  <input type="number" min="0" name="age" value={form.age} onChange={update} placeholder="0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Gender</label>
                  <select name="gender" value={form.gender} onChange={update} className={inputClass}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={labelClass}>Blood Group</label>
                    <select name="bloodGroup" value={form.bloodGroup} onChange={update} className={inputClass}>
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                 </div>
                 <div>
                    <label className={labelClass}>Marital Status</label>
                    <select name="maritalStatus" value={form.maritalStatus} onChange={update} className={inputClass}>
                      <option value="">Select</option>
                      <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                    </select>
                 </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                <div className="md:col-span-2">
                   <label className={labelClass}>Street Address</label>
                   <input name="address" value={form.address} onChange={update} placeholder="123 Main St" className={inputClass} />
                </div>
                <div>
                   <label className={labelClass}>City</label>
                   <input name="city" value={form.city} onChange={update} placeholder="City" className={inputClass} />
                </div>
                <div>
                   <label className={labelClass}>State / Country</label>
                   <input name="country" value={form.country} onChange={update} placeholder="Country" className={inputClass} />
                </div>
              </div>
            </div>
          </section>

          {/* 2. MEDICAL & EMERGENCY (Split Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Medical Info */}
            <section className={sectionClass}>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                <MedicalIcon /> Medical History
              </h3>
              <div className="space-y-5">
                <div>
                   <label className={labelClass}>Existing Conditions / History</label>
                   <textarea name="medicalHistory" value={form.medicalHistory} onChange={update} 
                     rows="4" placeholder="Describe any past surgeries, chronic illnesses..." 
                     className={`${inputClass} resize-none`} 
                   />
                </div>
                <div>
                  <label className={labelClass}>Allergies</label>
                  <input name="allergies" value={form.allergies} onChange={update} placeholder="Peanuts, Penicillin, etc." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Current Medications</label>
                  <input name="currentMedications" value={form.currentMedications} onChange={update} placeholder="List current meds" className={inputClass} />
                </div>
              </div>
            </section>

            {/* Emergency & Insurance */}
            <div className="space-y-8">
              <section className={sectionClass}>
                 <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                  <PhoneIcon /> Emergency Contact
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Contact Name</label>
                    <input name="emergencyContactName" value={form.emergencyContactName} onChange={update} placeholder="Name" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={labelClass}>Phone Number</label>
                        <input name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={update} placeholder="Phone" className={inputClass} />
                     </div>
                     <div>
                        <label className={labelClass}>Relationship</label>
                        <input name="relationshipToPatient" value={form.relationshipToPatient} onChange={update} placeholder="e.g. Spouse" className={inputClass} />
                     </div>
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                 <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                  <ShieldIcon /> Insurance & Doctor
                </h3>
                <div className="space-y-5">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Insurance Provider</label>
                        <input name="insuranceProvider" value={form.insuranceProvider} onChange={update} placeholder="Provider Name" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Policy Number</label>
                        <input name="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={update} placeholder="#123456" className={inputClass} />
                      </div>
                   </div>

                   <div className="pt-2">
                      <SearchableSelect
                        label="Assign Primary Doctor"
                        value={form.doctorId}
                        onChange={(val) => setForm({...form, doctorId: val})}
                        options={doctors}
                        placeholder="Select a doctor..."
                        getOptionLabel={(d) => `Dr. ${d.name} — ${d.specialization}`}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                         *Required for scheduling appointments immediately.
                      </p>
                   </div>
                </div>
              </section>
            </div>

          </div>

        </form>
      </div>
    </Layout>
  );
}