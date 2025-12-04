"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { 
  Trash2, 
  Edit, 
  Eye, 
  Plus, 
  Search, 
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Stethoscope,
  Heart
} from "lucide-react";

export default function DeathReportsPage() {
  const API = "http://localhost:8080/api/death-reports";

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data);
      setFilteredReports(data);
    } catch (e) {
      console.error("Failed to fetch death reports:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.causeOfDeath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.ward?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, reports, filterStatus]);

  const deleteReport = async (id) => {
    if (!confirm("Are you sure you want to delete this death report?")) return;

    setDeleting(id);
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setReports(reports.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete:", e);
      alert("Failed to delete report");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout active="deathreports">
      <div className="p-6 max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Heart className="w-10 h-10 text-red-600" />
              Death Reports
            </h1>
            <p className="text-slate-600 mt-1">Manage and track death reports</p>
          </div>
          <Link
            href="/deathreports/add"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Death Report
          </Link>
        </div>

        {/* SEARCH & FILTER SECTION */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by patient, doctor, cause, ward..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-slate-600">Loading reports...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 text-lg">
                {searchTerm ? "No reports match your search" : "No death reports found"}
              </p>
              {!searchTerm && (
                <Link
                  href="/deathreports/add"
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create First Report
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Doctor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Cause of Death</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Ward</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date of Death</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          #{report.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="font-medium text-slate-900">{report.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{report.doctorName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{report.causeOfDeath}</td>
                      <td className="px-6 py-4 text-slate-700">{report.ward || "—"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-700">{formatDate(report.dateOfDeath)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/deathreports/${report.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          <Link
                            href={`/deathreports/${report.id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteReport(report.id)}
                            disabled={deleting === report.id}
                            className="inline-flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                          >
                            {deleting === report.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
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

        {/* STATS FOOTER */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold">Total Reports</p>
            <p className="text-3xl font-bold text-blue-900 mt-1">{reports.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-600 font-semibold">This Month</p>
            <p className="text-3xl font-bold text-green-900 mt-1">
              {reports.filter((r) => {
                const d = new Date(r.dateOfDeath);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600 font-semibold">This Year</p>
            <p className="text-3xl font-bold text-red-900 mt-1">
              {reports.filter((r) => {
                const d = new Date(r.dateOfDeath);
                const now = new Date();
                return d.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
