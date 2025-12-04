"use client";

import Layout from "../../components/Layout";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useState, useMemo } from "react";

const API = "http://localhost:8080/api/patients";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

// --- Simple Icons Components (No external libraries required) ---
const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const FilterIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
);
const PlusIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);

export default function PatientsList() {
  const { data, error, isLoading } = useSWR(API, fetcher);

  // Local State for Filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  // Safe Data Access
  const patients = Array.isArray(data) ? data : [];

  // --- Derived State (Logic) ---

  // 1. Get Unique Doctors for the Dropdown
  const uniqueDoctors = useMemo(() => {
    const docs = new Map();
    patients.forEach((p) => {
      if (p.doctorId && p.doctorName) {
        docs.set(p.doctorId, p.doctorName);
      }
    });
    return Array.from(docs.entries()); // Returns [[id, name], [id, name]]
  }, [patients]);

  // 2. Filter Patients based on Search & Doctor Selection
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDoctor = selectedDoctor
        ? String(p.doctorId) === String(selectedDoctor)
        : true;

      return matchesSearch && matchesDoctor;
    });
  }, [patients, searchTerm, selectedDoctor]);

  // --- Handlers ---
  async function remove(id) {
    if (!confirm("Are you sure you want to delete this patient? This cannot be undone.")) return;

    const res = await fetch(`${API}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }
    mutate(API); 
  }

  // --- Render ---
  return (
    <Layout active="patients">
      <div className="p-6 md:p-10 text-white space-y-8 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">Patients</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Manage patient records, assign doctors, and view history.
            </p>
          </div>

          <Link
            href="/patients/add"
            className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <PlusIcon /> Add Patient
          </Link>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center backdrop-blur-sm">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-colors"
            />
          </div>

          {/* Doctor Filter */}
          <div className="md:col-span-4 relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon />
            </div>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All Doctors</option>
              {uniqueDoctors.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count / Reset */}
          <div className="md:col-span-3 text-right flex items-center justify-end gap-3 text-sm">
            <span className="text-slate-400">
              Showing <span className="text-white font-semibold">{filteredPatients.length}</span> results
            </span>
            {(searchTerm || selectedDoctor) && (
              <button 
                onClick={() => { setSearchTerm(""); setSelectedDoctor(""); }}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl ring-1 ring-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Demographics</th>
                  <th className="px-6 py-4">Contact / City</th>
                  <th className="px-6 py-4">Medical Info</th>
                  <th className="px-6 py-4">Assigned Doctor</th>
                  <th className="px-6 py-4">Insurance</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {/* LOADING */}
                {isLoading && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400 animate-pulse">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading patient records...</span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ERROR */}
                {error && (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-red-400 bg-red-900/10">
                      Failed to load data. Please check your connection.
                    </td>
                  </tr>
                )}

                {/* NO RESULTS */}
                {!isLoading && !error && filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <p className="text-lg font-medium">No patients found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* ROWS */}
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors group">
                    {/* Name & ID */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs mr-3 border border-blue-600/30">
                          {p.name ? p.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <div className="font-medium text-white">{p.name}</div>
                          <div className="text-xs text-slate-500">ID: #{p.id}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{p.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Gender & Age */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium w-fit
                          ${p.gender === 'Male' ? 'bg-blue-900/30 text-blue-300 border border-blue-800' : 
                            p.gender === 'Female' ? 'bg-pink-900/30 text-pink-300 border border-pink-800' : 
                            'bg-slate-700 text-slate-300'}`}>
                          {p.gender || "—"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {p.age ? `${p.age} yrs` : "Age N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-slate-300">
                      <div>{p.city || "—"}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{p.phone || "—"}</div>
                    </td>

                    {/* Medical / Blood */}
                    <td className="px-6 py-4">
                      {p.bloodGroup ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-900/20 text-red-400 text-xs font-bold border border-red-900/30">
                          Blood: {p.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Doctor */}
                    <td className="px-6 py-4">
                      {p.doctorId ? (
                        <div>
                          <div className="text-white text-sm">{p.doctorName}</div>
                          <div className="text-xs text-slate-500 italic">{p.doctorSpecialization}</div>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs italic">Unassigned</span>
                      )}
                    </td>

                    {/* Insurance */}
                    <td className="px-6 py-4">
                      <div>{p.insuranceProvider || <span className="text-slate-600">—</span>}</div>
                      <div className="text-xs text-slate-500 tracking-wider">
                         {p.insurancePolicyNumber}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/patients/${p.id}`}
                          title="Edit"
                          className="p-2 bg-amber-600/10 text-amber-500 rounded hover:bg-amber-600 hover:text-white transition-colors border border-amber-600/20"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          onClick={() => remove(p.id)}
                          title="Delete"
                          className="p-2 bg-red-600/10 text-red-500 rounded hover:bg-red-600 hover:text-white transition-colors border border-red-600/20"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER PAGINATION PLACEHOLDER */}
          <div className="bg-slate-800/50 p-3 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
             <span>Data updated via API</span>
             <span>Row count: {patients.length}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}