"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import {
  Plus,
  Beaker,
  Loader2,
  Trash2,
  Eye,
  Calendar,
  TestTubes,
} from "lucide-react";

export default function LabReportsPage() {
  const API = "http://localhost:8080/api/labreports";

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error loading reports:", e);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: reports.length,
    thisMonth: reports.filter((r) => {
      const date = new Date(r.reportDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
  };

  const deleteReport = async (id) => {
    if (!confirm("Delete this lab report?")) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        load();
      }
    } catch (e) {
      console.error("Error deleting:", e);
    }
  };

  return (
    <Layout active="labreports">
      <div className="p-6 md:p-10 text-white min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                <Beaker className="w-8 h-8 text-cyan-500" />
                Lab Reports
              </h1>
              <p className="text-slate-400 mt-1">Manage laboratory test reports</p>
            </div>
            <Link
              href="/labreports/add"
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-lg shadow-cyan-900/20 transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Report
            </Link>
          </div>

          {/* STATISTICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Reports</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <TestTubes className="w-12 h-12 text-cyan-500/20" />
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">This Month</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.thisMonth}</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-500/20" />
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
            <input
              type="text"
              placeholder="Search by patient name or test name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-600"
            />
          </div>

          {/* TABLE */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-500 animate-spin mr-3" />
                <span className="text-slate-400">Loading reports...</span>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-12 text-center">
                <Beaker className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No lab reports found</p>
                <Link
                  href="/labreports/add"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Create First Report
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Test Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((r, idx) => (
                      <tr key={r.id} className={`border-b border-slate-800 hover:bg-slate-800/50 transition ${idx % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                        <td className="px-6 py-4 text-sm font-mono text-cyan-400">#{r.id}</td>
                        <td className="px-6 py-4 text-sm text-white font-medium">{r.patientName}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{r.testName}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">
                          {new Date(r.reportDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <Link
                            href={`/labreports/${r.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded transition text-xs font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </Link>
                          <Link
                            href={`/labreports/${r.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 rounded transition text-xs font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteReport(r.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded transition text-xs font-medium"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
