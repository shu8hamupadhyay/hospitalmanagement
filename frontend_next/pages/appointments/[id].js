"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import {
  AlertTriangle,
  Save,
  Clock,
  DollarSign,
  FileText,
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  Activity
} from "lucide-react";

export default function AppointmentEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const API = "http://localhost:8080/api/appointments";

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    departmentId: "",
    doctorId: "",
    appointmentDate: "",
    status: "Scheduled",
    problem: "",
    chiefComplaint: "",
    appointmentType: "IN_PERSON",
    plannedDurationMinutes: 30,
    isFollowUp: false,
    roomNumber: "",
    remarks: "",
    cancellationReason: "",
    fee: 0,
    paymentStatus: "PENDING",
    icd10Code: "",
    cptCode: "",
  });

  // --- Helpers ---
  // Converts API ISO string (2023-10-25T14:30:00) to Input format (2023-10-25T14:30)
  const isoToInput = (iso) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 16);
  };

  const toServer = (v) => (v && v.length === 16 ? v + ":00" : v);

  // --- Load Doctors ---
  const loadDoctors = useCallback(async (deptId) => {
    if (!deptId) return setDoctors([]);
    try {
      const res = await fetch(`${API}/doctors/by-department/${deptId}`);
      setDoctors(await res.json());
    } catch {
      setDoctors([]);
    }
  }, []);

  // --- Load Initial Data ---
  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        // 1. Fetch Appointment & Metadata in parallel
        const [apptRes, pRes, dRes] = await Promise.all([
          fetch(`${API}/${id}`),
          fetch("http://localhost:8080/api/patients"),
          fetch("http://localhost:8080/api/departments"),
        ]);

        if (!apptRes.ok) throw new Error("Appointment not found");

        const appt = await apptRes.json();
        setPatients(await pRes.json());
        setDepartments(await dRes.json());

        // 2. Fetch Doctors for the specific department immediately
        if (appt.departmentId) {
          await loadDoctors(appt.departmentId);
        }

        // 3. Populate Form
        setForm({
          patientId: appt.patientId || "",
          doctorId: appt.doctorId || "",
          departmentId: appt.departmentId || "",
          appointmentDate: isoToInput(appt.appointmentDate),
          status: appt.status || "Scheduled",
          problem: appt.problem || "",
          chiefComplaint: appt.chiefComplaint || "",
          appointmentType: appt.appointmentType || "IN_PERSON",
          plannedDurationMinutes: appt.plannedDurationMinutes || 30,
          isFollowUp: appt.isFollowUp || false,
          roomNumber: appt.roomNumber || "",
          remarks: appt.remarks || "",
          cancellationReason: appt.cancellationReason || "",
          fee: appt.fee || 0,
          paymentStatus: appt.paymentStatus || "PENDING",
          icd10Code: appt.icd10Code || "",
          cptCode: appt.cptCode || "",
        });

      } catch (e) {
        console.error(e);
        setError("Failed to load appointment details.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, loadDoctors]);

  // --- Form Handlers ---
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onDeptChange = async (e) => {
    const deptId = e.target.value;
    update("departmentId", deptId);
    update("doctorId", ""); // Reset doctor when dept changes
    await loadDoctors(deptId);
  };

  const save = async (e) => {
    e.preventDefault();

    if (!form.patientId || !form.departmentId || !form.doctorId || !form.appointmentDate) {
      setError("Please fill all required fields marked with *");
      window.scrollTo(0, 0);
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      departmentId: Number(form.departmentId),
      appointmentDate: toServer(form.appointmentDate),
      plannedDurationMinutes: Number(form.plannedDurationMinutes),
      fee: Number(form.fee),
    };

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/appointments");
    } catch {
      setError("Failed to save changes. Please try again.");
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
    }
  };

  // --- Styles ---
  const sectionClass = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm";
  const headerClass = "text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3";
  const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all placeholder-slate-600";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  if (loading) return (
    <Layout active="appointments">
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
         <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p>Loading appointment data...</p>
      </div>
    </Layout>
  );

  return (
    <Layout active="appointments">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => router.back()} 
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Edit Appointment</h2>
              <p className="text-slate-400 mt-1 text-sm">Update consultation details for <span className="text-amber-400 font-mono">#{id}</span></p>
            </div>
          </div>
          <div className="flex gap-3">
             <Link href="/appointments" className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium">
                Cancel
             </Link>
             <button 
               onClick={save}
               disabled={saving}
               className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                 ${saving ? 'bg-amber-800 cursor-wait' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'}`}
             >
                <Save size={18} className="mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
             </button>
          </div>
        </div>

        {/* --- ERROR --- */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in">
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={save} className="space-y-8">
          
          {/* 1. SCHEDULING */}
          <section className={sectionClass}>
            <h3 className={headerClass}>
              <Clock className="text-amber-500" size={20} /> Core Scheduling
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Patient *</label>
                <div className="relative">
                  <select className={selectClass} value={form.patientId} onChange={(e) => update("patientId", e.target.value)}>
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <User className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Date & Time *</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    className={inputClass} 
                    value={form.appointmentDate} 
                    onChange={(e) => update("appointmentDate", e.target.value)} 
                  />
                  <Calendar className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Department *</label>
                <select className={selectClass} value={form.departmentId} onChange={onDeptChange}>
                  <option value="">-- Select Department --</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Doctor *</label>
                <div className="relative">
                  <select 
                    className={selectClass} 
                    value={form.doctorId} 
                    onChange={(e) => update("doctorId", e.target.value)}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((doc) => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                  </select>
                  <Stethoscope className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                 <label className={labelClass}>Duration (min)</label>
                 <input type="number" className={inputClass} value={form.plannedDurationMinutes} onChange={(e) => update("plannedDurationMinutes", e.target.value)} />
              </div>

              <div>
                 <label className={labelClass}>Room Number</label>
                 <input className={inputClass} value={form.roomNumber} onChange={(e) => update("roomNumber", e.target.value)} />
              </div>
            </div>
          </section>

          {/* 2. CLINICAL & BILLING GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Clinical Info */}
            <section className={sectionClass}>
              <h3 className={headerClass}>
                <Activity className="text-blue-500" size={20} /> Clinical Details
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Type *</label>
                    <select className={selectClass} value={form.appointmentType} onChange={(e) => update("appointmentType", e.target.value)}>
                      <option value="IN_PERSON">In Person</option>
                      <option value="TELEHEALTH">Telehealth</option>
                      <option value="HOME_VISIT">Home Visit</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select className={selectClass} value={form.status} onChange={(e) => update("status", e.target.value)}>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-In">Checked-In</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>Chief Complaint</label>
                   <textarea rows="3" className={inputClass} value={form.chiefComplaint} onChange={(e) => update("chiefComplaint", e.target.value)} />
                </div>

                <div>
                   <label className={labelClass}>Diagnosis / Problem</label>
                   <input className={inputClass} value={form.problem} onChange={(e) => update("problem", e.target.value)} />
                </div>

                {form.status === "Cancelled" && (
                   <div className="animate-in fade-in slide-in-from-top-2">
                      <label className={`${labelClass} text-red-400`}>Cancellation Reason</label>
                      <input className={`${inputClass} border-red-900/50`} value={form.cancellationReason} onChange={(e) => update("cancellationReason", e.target.value)} />
                   </div>
                )}
                
                <div>
                  <label className={labelClass}>Remarks</label>
                  <textarea rows="2" className={inputClass} value={form.remarks} onChange={(e) => update("remarks", e.target.value)} />
                </div>
              </div>
            </section>

            {/* Billing Info */}
            <section className={sectionClass}>
              <h3 className={headerClass}>
                <DollarSign className="text-green-500" size={20} /> Billing & Coding
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Fee (₹)</label>
                    <input type="number" className={inputClass} value={form.fee} onChange={(e) => update("fee", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Payment Status</label>
                    <select className={selectClass} value={form.paymentStatus} onChange={(e) => update("paymentStatus", e.target.value)}>
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="CLAIMED">Claimed</option>
                      <option value="WAIVED">Waived</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>ICD-10 Code</label>
                   <input className={inputClass} value={form.icd10Code} onChange={(e) => update("icd10Code", e.target.value)} placeholder="e.g. R51.9" />
                </div>

                <div>
                   <label className={labelClass}>CPT Code</label>
                   <input className={inputClass} value={form.cptCode} onChange={(e) => update("cptCode", e.target.value)} placeholder="e.g. 99203" />
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
                   <input 
                     type="checkbox" 
                     id="followup"
                     className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-600 focus:ring-amber-500"
                     checked={form.isFollowUp} 
                     onChange={(e) => update("isFollowUp", e.target.checked)} 
                   />
                   <label htmlFor="followup" className="text-sm text-slate-300 select-none">Mark as Follow-up Visit</label>
                </div>
              </div>
            </section>
          </div>

        </form>
      </div>
    </Layout>
  );
}