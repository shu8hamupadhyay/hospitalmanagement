"use client";

import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import useSWR, { mutate } from "swr";

const API = "http://localhost:8080/api/appointments";

const fetcher = (url) => fetch(url).then((r) => r.json());

// --- Icons ---
const SearchIcon = () => (<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const PlusIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);
const CalendarIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const TrashIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);

// FIXED EYE ICON HERE:
const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PencilIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>);
const FilterIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);

export default function AppointmentsPage() {
  const { data, error, isLoading } = useSWR(API, fetcher);
  
  // Safe array processing
  const appointments = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((a) => ({
      ...a,
      id: a.id ?? a.appointmentId ?? null,
    }));
  }, [data]);

  // --- Local State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // --- Filter Logic ---
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchesSearch = 
        a.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" ? true : a.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  // --- Handlers ---
  async function deleteAppointment(id) {
    if (!confirm("Are you sure you want to cancel and remove this appointment?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if(res.ok) mutate(API);
      else alert("Failed to delete");
    } catch (e) {
      console.error(e);
    }
  }

  // --- Helper: Status Badge Color ---
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-900/30 text-green-400 border-green-800";
      case "pending": return "bg-amber-900/30 text-amber-400 border-amber-800";
      case "cancelled": return "bg-red-900/30 text-red-400 border-red-800";
      case "completed": return "bg-blue-900/30 text-blue-400 border-blue-800";
      default: return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <Layout active="appointments">
      <div className="p-6 md:p-10 text-white space-y-8 max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Schedule, manage, and track patient consultations.
            </p>
          </div>

          <Link
            href="/appointments/add"
            className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 transition-all"
          >
            <PlusIcon /> New Appointment
          </Link>
        </div>

        {/* --- FILTERS BAR --- */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 text-white transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm flex items-center"><FilterIcon /> Status:</span>
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              {['All', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    statusFilter === status 
                    ? 'bg-slate-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl ring-1 ring-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">ID & Serial</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Doctor & Dept</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {isLoading && (
                   <tr><td colSpan="7" className="p-8 text-center text-slate-500">Loading schedule...</td></tr>
                )}
                
                {!isLoading && filteredAppointments.length === 0 && (
                   <tr><td colSpan="7" className="p-8 text-center text-slate-500">No appointments found.</td></tr>
                )}

                {filteredAppointments.map((a, i) => (
                  <tr key={`${a.id}-${i}`} className="hover:bg-slate-800/50 transition-colors group">
                    
                    {/* ID */}
                    <td className="px-6 py-4">
                      <div className="text-slate-300 font-mono">#{a.id}</div>
                      <div className="text-xs text-slate-500 mt-0.5">SN: {a.serialNo || "-"}</div>
                    </td>

                    {/* Patient */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{a.patientName}</div>
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-4">
                      <div className="text-blue-400">Dr. {a.doctorName}</div>
                      <div className="text-xs text-slate-500">{a.departmentName}</div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-300">
                        <CalendarIcon />
                        {a.appointmentDate ? new Date(a.appointmentDate).toLocaleDateString() : "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 pl-5">
                         {a.appointmentDate ? new Date(a.appointmentDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="text-slate-300 bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                        {a.appointmentType || "General"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(a.status)}`}>
                        {a.status || "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {a.id ? (
                          <>
                            <Link
                              href={`/appointments/${a.id}`}
                              title="View Details"
                              className="p-2 text-blue-400 hover:text-white hover:bg-blue-600 rounded transition-colors"
                            >
                              <EyeIcon />
                            </Link>
                           <Link
  href={`/appointments/${a.id}`}
  title="Edit Appointment"
  className="p-2 text-amber-500 hover:text-white hover:bg-amber-600 rounded transition-colors"
>
  <PencilIcon />
</Link>

                            <button
                              onClick={() => deleteAppointment(a.id)}
                              title="Cancel Appointment"
                              className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded transition-colors"
                            >
                              <TrashIcon />
                            </button>
                          </>
                        ) : (
                          <span className="text-red-500 text-xs italic">Error</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/50 p-3 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
             <span>Live Schedule</span>
             <span>{filteredAppointments.length} Appointments</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}