"use client";

import Layout from "../../components/Layout";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { useState, useMemo } from "react";

const API = "http://localhost:8080/api/prescriptions";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const SearchIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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

export default function PrescriptionsList() {
  const { data, error, isLoading } = useSWR(API, fetcher);

  const [searchTerm, setSearchTerm] = useState("");

  const prescriptions = Array.isArray(data) ? data : [];

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter((p) => {
      const matchesSearch =
        p.medicine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dosage?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [prescriptions, searchTerm]);

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    const res = await fetch(`${API}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    mutate(API);
  }

  if (isLoading) {
    return (
      <Layout active="prescriptions">
        <div className="flex items-center justify-center h-96">
          <p className="text-slate-500 text-lg">Loading prescriptions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout active="prescriptions">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error loading prescriptions</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="prescriptions">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Prescriptions</h1>
          <Link href="/prescriptions/add">
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <PlusIcon /> Add Prescription
            </button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by medicine, patient name, or dosage..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Prescriptions Table */}
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600 text-lg">No prescriptions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Medicine</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Dosage</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Doctor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Instructions</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{p.medicine}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.dosage}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.patientName}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.doctorName}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.instructions}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/prescriptions/${p.id}`}>
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition">
                            <EditIcon />
                          </button>
                        </Link>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          onClick={() => remove(p.id)}
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
        )}
      </div>
    </Layout>
  );
}
