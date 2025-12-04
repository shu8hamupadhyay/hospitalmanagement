"use client";

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import useSWR from "swr";

const API = "http://localhost:8080/api/patients";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const fetcher = (url) => fetch(url).then((r) => r.json());

// --- Icons ---
const BackIcon = () => (
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const MedicalIcon = () => (
  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const AdminIcon = () => (
  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
);

export default function EditPatient() {
  const router = useRouter();
  const { id } = router.query;

  const { data: doctorsData } = useSWR(DOCTORS_API, fetcher);
  const doctors = Array.isArray(doctorsData) ? doctorsData : [];

  const [form, setForm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Helper to format ISO date (2023-01-01T00:00:00) to HTML Input date (2023-01-01)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  // FETCH PATIENT
  useEffect(() => {
    if (!id) return;

    async function loadPatient() {
      try {
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Patient not found");
        
        const data = await res.json();

        setForm({
          name: data.name || "",
          age: data.age || "",
          gender: data.gender || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: formatDate(data.dob), // Fix date format
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          bloodGroup: data.bloodGroup || "",
          maritalStatus: data.maritalStatus || "",
          medicalHistory: data.medicalHistory || "",
          allergies: data.allergies || "",
          currentMedications: data.currentMedications || "",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactNumber: data.emergencyContactNumber || "",
          relationshipToPatient: data.relationshipToPatient || "",
          insuranceProvider: data.insuranceProvider || "",
          insurancePolicyNumber: data.insurancePolicyNumber || "",
          doctorId: data.doctorId || (data.doctor ? data.doctor.id : ""),
        });
      } catch (err) {
        setError("Could not load patient details.");
      }
    }

    loadPatient();
  }, [id]);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setIsSaving(true);
    
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
      doctorId: form.doctorId ? Number(form.doctorId) : null,
    };

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed update");

      router.push("/patients");
    } catch (err) {
      alert("Failed to update patient");
      setIsSaving(false);
    }
  }

  // --- Styles ---
  const labelClass = "block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-slate-600";
  const sectionClass = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 md:p-8 rounded-xl shadow-lg";

  // --- Loading State ---
  if (!form && !error) {
    return (
      <Layout active="patients">
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
           <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Loading patient record...</p>
        </div>
      </Layout>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Layout active="patients">
        <div className="p-10 text-center text-red-400">
          <p className="text-xl font-bold">{error}</p>
          <button onClick={() => router.back()} className="mt-4 text-slate-400 hover:text-white underline">Go Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="patients">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition-colors">
                <BackIcon />
              </button>
              <h2 className="text-3xl font-bold text-white tracking-tight">Edit Patient</h2>
            </div>
            <p className="text-slate-400 text-sm ml-7">
              Editing record for <span className="text-amber-400 font-medium">{form.name}</span>
            </p>
          </div>
          
          <div className="flex gap-3 ml-7 md:ml-0">
             <button 
               type="button"
               onClick={() => router.push("/patients")}
               className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
             >
                Cancel
             </button>
             <button 
               onClick={save}
               disabled={isSaving}
               className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all 
                 ${isSaving ? 'bg-amber-800 cursor-wait' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'}`}
             >
               {isSaving ? 'Updating...' : 'Save Changes'}
             </button>
          </div>
        </div>

        <form onSubmit={save} className="space-y-8">

          {/* 1. PERSONAL INFO */}
          <section className={sectionClass}>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
              <UserIcon /> Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                 <label className={labelClass}>Full Name</label>
                 <input className={inputClass} name="name" value={form.name} onChange={update} required />
              </div>
              <div>
                 <label className={labelClass}>Email</label>
                 <input className={inputClass} name="email" value={form.email} onChange={update} required />
              </div>
              <div>
                 <label className={labelClass}>Phone</label>
                 <input className={inputClass} name="phone" value={form.phone} onChange={update} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className={labelClass}>Gender</label>
                   <select name="gender" className={inputClass} value={form.gender} onChange={update}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div>
                   <label className={labelClass}>Date of Birth</label>
                   <input className={inputClass} name="dob" type="date" value={form.dob} onChange={update} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={labelClass}>Age</label>
                    <input className={inputClass} name="age" type="number" value={form.age} onChange={update} />
                 </div>
                 <div>
                    <label className={labelClass}>Blood Group</label>
                    <select name="bloodGroup" className={inputClass} value={form.bloodGroup} onChange={update}>
                      <option value="">Select</option>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                      <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                 </div>
              </div>

              <div>
                 <label className={labelClass}>Marital Status</label>
                 <select name="maritalStatus" className={inputClass} value={form.maritalStatus} onChange={update}>
                    <option value="">Select</option>
                    <option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option>
                 </select>
              </div>

              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-800/50">
                 <div className="md:col-span-2">
                    <label className={labelClass}>Address</label>
                    <input className={inputClass} name="address" value={form.address} onChange={update} />
                 </div>
                 <div>
                    <label className={labelClass}>City</label>
                    <input className={inputClass} name="city" value={form.city} onChange={update} />
                 </div>
                 <div>
                    <label className={labelClass}>State / Country</label>
                    <input className={inputClass} name="country" value={form.country} onChange={update} />
                 </div>
              </div>
            </div>
          </section>

          {/* 2. MEDICAL & EMERGENCY (Split Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Medical Info */}
            <section className={sectionClass}>
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                <MedicalIcon /> Medical Information
              </h3>
              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Medical History</label>
                  <textarea className={`${inputClass} resize-none h-32`} name="medicalHistory" value={form.medicalHistory} onChange={update} />
                </div>
                <div>
                  <label className={labelClass}>Allergies</label>
                  <input className={inputClass} name="allergies" value={form.allergies} onChange={update} />
                </div>
                <div>
                  <label className={labelClass}>Current Medications</label>
                  <input className={inputClass} name="currentMedications" value={form.currentMedications} onChange={update} />
                </div>
              </div>
            </section>

            <div className="space-y-8">
               {/* Emergency */}
               <section className={sectionClass}>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                     Emergency Contact
                  </h3>
                  <div className="space-y-5">
                     <div>
                        <label className={labelClass}>Contact Name</label>
                        <input className={inputClass} name="emergencyContactName" value={form.emergencyContactName} onChange={update} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className={labelClass}>Phone</label>
                           <input className={inputClass} name="emergencyContactNumber" value={form.emergencyContactNumber} onChange={update} />
                        </div>
                        <div>
                           <label className={labelClass}>Relationship</label>
                           <input className={inputClass} name="relationshipToPatient" value={form.relationshipToPatient} onChange={update} />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Admin / Insurance */}
               <section className={sectionClass}>
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center border-b border-slate-800 pb-4">
                     <AdminIcon /> Insurance & Doctor
                  </h3>
                  <div className="space-y-5">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className={labelClass}>Provider</label>
                           <input className={inputClass} name="insuranceProvider" value={form.insuranceProvider} onChange={update} />
                        </div>
                        <div>
                           <label className={labelClass}>Policy #</label>
                           <input className={inputClass} name="insurancePolicyNumber" value={form.insurancePolicyNumber} onChange={update} />
                        </div>
                     </div>

                     <div>
                        <label className={labelClass}>Assigned Doctor</label>
                        <select className={`${inputClass} appearance-none`} name="doctorId" value={form.doctorId} onChange={update}>
                           <option value="">-- No Doctor Assigned --</option>
                           {doctors.map((d) => (
                              <option key={d.id} value={d.id}>
                                 Dr. {d.name} ({d.specialization})
                              </option>
                           ))}
                        </select>
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