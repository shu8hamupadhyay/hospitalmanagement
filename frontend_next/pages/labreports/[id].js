"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import {
  Loader2,
  ArrowLeft,
  Beaker,
  User,
  Calendar,
  FileText,
  Trash2,
  Edit,
} from "lucide-react";

export default function ViewLabReportPage() {
  const router = useRouter();
  const { id } = router.query;
  const API = "http://localhost:8080/api/labreports";

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadReport() {
      try {
        setLoading(true);
        const res = await fetch(`${API}/${id}`);
        if (!res.ok) throw new Error("Report not found");
        const data = await res.json();
        setReport(data);
      } catch (e) {
        console.error("Error loading:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [id]);

  const deleteReport = async () => {
    if (!confirm("Delete this lab report permanently?")) return;
    try {
      setDeleting(true);
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/labreports");
      } else {
        setError("Failed to delete report");
      }
    } catch (e) {
      setError("Error deleting report");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Layout active="labreports">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mr-3" />
          <span className="text-slate-400">Loading report...</span>
        </div>
      </Layout>
    );
  }

  if (error || !report) {
    return (
      <Layout active="labreports">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error || "Report not found"}</p>
            <Link href="/labreports" className="text-cyan-400 hover:text-cyan-300 transition">
              Back to Lab Reports
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="labreports">
      <div className="p-6 md:p-10 text-white min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/labreports" className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Lab Report #{id}</h1>
                <p className="text-slate-400 mt-1">View and manage test report details</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/labreports/${id}/edit`}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <button
                onClick={deleteReport}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition text-sm disabled:opacity-50"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete
              </button>
            </div>
          </div>

          {/* PATIENT INFO CARD */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <User className="w-5 h-5 text-cyan-500" />
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Patient Name</p>
                <p className="text-lg text-white font-medium">{report.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                <p className="text-lg text-white font-medium">{report.patientEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Age</p>
                <p className="text-lg text-white font-medium">{report.patientAge} years</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Phone</p>
                <p className="text-lg text-white font-medium">{report.patientPhone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* TEST DETAILS CARD */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Beaker className="w-5 h-5 text-purple-500" />
              Test Information
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Test Name</p>
                <p className="text-white font-medium text-lg">{report.testName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Test Result</p>
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-white whitespace-pre-wrap">
                  {report.result}
                </div>
              </div>
              {report.notes && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Notes</p>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-slate-300 whitespace-pre-wrap">
                    {report.notes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* METADATA CARD */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Calendar className="w-5 h-5 text-slate-400" />
              Report Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Report Date</p>
                <p className="text-white">
                  {new Date(report.reportDate).toLocaleDateString()} {new Date(report.reportDate).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Report ID</p>
                <p className="text-cyan-400 font-mono text-sm">#{report.id}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
