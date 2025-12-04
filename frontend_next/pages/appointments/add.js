"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  Save,
  DollarSign,
  User,
  Stethoscope,
  Activity,
  ArrowLeft
} from "lucide-react";

export default function AddAppointment() {
  const router = useRouter();

  const API_APPOINTMENTS = "http://localhost:8080/api/appointments";
  const API_DOCTORS = "http://localhost:8080/api/doctors";        // ✅ FIXED
  const API_PATIENTS = "http://localhost:8080/api/patients";
  const API_DEPARTMENTS = "http://localhost:8080/api/departments";

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const normalizeDateTime = (v) =>
    v && v.length === 16 ? v + ":00" : v;

  // Load Initial Data
  useEffect(() => {
    async function load() {
      try {
        const [p, d] = await Promise.all([
          fetch(API_PATIENTS),
          fetch(API_DEPARTMENTS),
        ]);

        setPatients(await p.json());
        setDepartments(await d.json());
      } catch (e) {
        setError("Failed to load data from server.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Load Doctors by Department
  const loadDoctors = async (deptId) => {
    if (!deptId) return setDoctors([]);

    try {
      const res = await fetch(`${API_DOCTORS}/by-department/${deptId}`); // ✅ FIXED
      setDoctors(await res.json());
    } catch {
      setDoctors([]);
    }
  };

  const onDeptChange = (e) => {
    const id = e.target.value;
    update("departmentId", id);
    update("doctorId", "");
    loadDoctors(id);
  };

  // Submit Form
  const submit = async (e) => {
    e.preventDefault();

    if (!form.patientId || !form.departmentId || !form.doctorId || !form.appointmentDate) {
      setError("Please fill all required fields marked with *.");
      window.scrollTo(0, 0);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const payload = {
      ...form,
      patientId: Number(form.patientId),
      doctorId: Number(form.doctorId),
      departmentId: Number(form.departmentId),
      appointmentDate: normalizeDateTime(form.appointmentDate),
      plannedDurationMinutes: Number(form.plannedDurationMinutes),
      fee: Number(form.fee),
      isFollowUp: Boolean(form.isFollowUp),
    };

    try {
      const res = await fetch(API_APPOINTMENTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Submission failed");
      }

      router.push("/appointments");
    } catch (err) {
      setError(`Error: ${err.message}`);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles
  const sectionClass =
    "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm";
  const headerClass =
    "text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3";
  const labelClass =
    "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5";
  const inputClass =
    "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-600";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <Layout active="appointments">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Schedule Appointment
              </h2>
              <p className="text-slate-400 mt-1 text-sm">
                Create a new consultation booking.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/appointments"
              className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={submit}
              disabled={isSubmitting}
              className={`flex items-center px-6 py-2.5 rounded-lg text-white font-medium shadow-lg transition-all
                ${
                  isSubmitting
                    ? "bg-blue-800 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
                }`}
            >
              <Save size={18} className="mr-2" />
              {isSubmitting ? "Scheduling..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            Loading form data...
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-8">

            {/* 1 — SCHEDULING DETAILS */}
            <section className={sectionClass}>
              <h3 className={headerClass}>
                <Calendar className="text-blue-500" size={20} /> Scheduling Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Patient */}
                <div>
                  <label className={labelClass}>Patient *</label>
                  <select
                    className={selectClass}
                    value={form.patientId}
                    onChange={(e) => update("patientId", e.target.value)}
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <User className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                </div>

                {/* Appointment Date */}
                <div>
                  <label className={labelClass}>Appointment Date *</label>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={form.appointmentDate}
                    onChange={(e) => update("appointmentDate", e.target.value)}
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className={labelClass}>Duration (Min)</label>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.plannedDurationMinutes}
                    onChange={(e) => update("plannedDurationMinutes", e.target.value)}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className={labelClass}>Department *</label>
                  <select
                    className={selectClass}
                    value={form.departmentId}
                    onChange={onDeptChange}
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Doctor */}
                <div>
                  <label className={labelClass}>Doctor *</label>
                  <select
                    className={selectClass}
                    value={form.doctorId}
                    disabled={!form.departmentId}
                    onChange={(e) => update("doctorId", e.target.value)}
                  >
                    <option value="">
                      {form.departmentId ? "-- Select Doctor --" : "Select Dept First"}
                    </option>

                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div>
                  <label className={labelClass}>Room No</label>
                  <input
                    className={inputClass}
                    value={form.roomNumber}
                    onChange={(e) => update("roomNumber", e.target.value)}
                    placeholder="e.g. 304-B"
                  />
                </div>
              </div>
            </section>

            {/* 2 — CLINICAL INFO */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className={`${sectionClass} lg:col-span-2`}>
                <h3 className={headerClass}>
                  <Activity className="text-green-500" size={20} /> Clinical Information
                </h3>

                <div className="space-y-4">

                  {/* Appointment Type */}
                  <div>
                    <label className={labelClass}>Appointment Type</label>
                    <select
                      className={selectClass}
                      value={form.appointmentType}
                      onChange={(e) => update("appointmentType", e.target.value)}
                    >
                      <option value="IN_PERSON">In Person</option>
                      <option value="TELEHEALTH">Telehealth</option>
                      <option value="HOME_VISIT">Home Visit</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      className={selectClass}
                      value={form.status}
                      onChange={(e) => update("status", e.target.value)}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked-In">Checked-In</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Chief Complaint */}
                  <div>
                    <label className={labelClass}>Chief Complaint</label>
                    <textarea
                      rows="3"
                      className={inputClass}
                      value={form.chiefComplaint}
                      onChange={(e) => update("chiefComplaint", e.target.value)}
                      placeholder="Patient's primary reason for visit..."
                    />
                  </div>

                  {/* Additional Problem */}
                  <div>
                    <label className={labelClass}>Additional Problem / Notes</label>
                    <input
                      className={inputClass}
                      value={form.problem}
                      onChange={(e) => update("problem", e.target.value)}
                      placeholder="Secondary symptoms…"
                    />
                  </div>

                  {/* Cancellation */}
                  {form.status === "Cancelled" && (
                    <div>
                      <label className={`${labelClass} text-red-400`}>
                        Reason for Cancellation
                      </label>
                      <input
                        className={`${inputClass} border-red-900/50 focus:ring-red-500`}
                        value={form.cancellationReason}
                        onChange={(e) => update("cancellationReason", e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </section>

              {/* 3 — BILLING & CODING */}
              <section className={sectionClass}>
                <h3 className={headerClass}>
                  <DollarSign className="text-amber-500" size={20} /> Billing & Coding
                </h3>

                <div className="space-y-4">
                  
                  {/* FEE */}
                  <div>
                    <label className={labelClass}>Consultation Fee (₹)</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={form.fee}
                      onChange={(e) => update("fee", e.target.value)}
                    />
                  </div>

                  {/* PAYMENT STATUS */}
                  <div>
                    <label className={labelClass}>Payment Status</label>
                    <select
                      className={selectClass}
                      value={form.paymentStatus}
                      onChange={(e) => update("paymentStatus", e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="INSURANCE">Insurance Claim</option>
                    </select>
                  </div>

                  {/* ICD CODE */}
                  <div>
                    <label className={labelClass}>ICD-10 Code</label>
                    <input
                      className={inputClass}
                      value={form.icd10Code}
                      onChange={(e) => update("icd10Code", e.target.value)}
                      placeholder="e.g. J01.90"
                    />
                  </div>

                  {/* CPT CODE */}
                  <div>
                    <label className={labelClass}>CPT Code</label>
                    <input
                      className={inputClass}
                      value={form.cptCode}
                      onChange={(e) => update("cptCode", e.target.value)}
                      placeholder="e.g. 99213"
                    />
                  </div>

                  {/* FOLLOWUP */}
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="followup"
                      className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                      checked={form.isFollowUp}
                      onChange={(e) => update("isFollowUp", e.target.checked)}
                    />
                    <label
                      htmlFor="followup"
                      className="text-sm text-slate-300 select-none"
                    >
                      Is this a follow-up visit?
                    </label>
                  </div>
                </div>
              </section>
            </div>

          </form>
        )}
      </div>
    </Layout>
  );
}
