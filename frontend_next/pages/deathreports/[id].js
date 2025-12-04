"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import {
  Trash2,
  Edit,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Heart,
  User,
  Stethoscope,
  Calendar,
  FileText,
  MapPin,
  Clock,
} from "lucide-react";

export default function ViewReportPage() {
  const router = useRouter();
  const { id } = router.query;

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8080/api/death-reports/${id}`);
        if (!res.ok) throw new Error("Report not found");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Failed to load report", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const deleteReport = async () => {
    if (!confirm("Are you sure you want to delete this death report? This action cannot be undone."))
      return;

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8080/api/death-reports/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/deathreports");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to delete report");
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout active="deathreports">
        <div className="p-6 flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mr-3" />
          <span className="text-slate-600">Loading report...</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout active="deathreports">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Error</h1>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <Link
            href="/deathreports"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Reports
          </Link>
        </div>
      </Layout>
    );
  }

  if (!report) return null;

  return (
    <Layout active="deathreports">
      <div className="p-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Death Report #{report.id}</h1>
              <p className="text-slate-600 mt-1">
                Created: {formatDate(report.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* MAIN CARD */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* PATIENT & DOCTOR SECTION */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <User className="w-5 h-5" />
              Patient & Doctor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailCard
                icon={<User className="w-5 h-5" />}
                label="Patient"
                value={report.patientName}
              />
              <DetailCard
                icon={<Stethoscope className="w-5 h-5" />}
                label="Doctor"
                value={report.doctorName}
              />
              <DetailCard
                icon={<FileText className="w-5 h-5" />}
                label="Gender"
                value={report.gender}
              />
              <DetailCard
                icon={<MapPin className="w-5 h-5" />}
                label="Ward"
                value={report.ward || "—"}
              />
            </div>
          </div>

          {/* DEATH DETAILS SECTION */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2 pb-3 border-b-2 border-slate-200">
              <FileText className="w-5 h-5" />
              Death Details
            </h2>
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Cause of Death
                </label>
                <p className="text-lg text-slate-900 font-medium mt-2">
                  {report.causeOfDeath}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailCard
                  icon={<Calendar className="w-5 h-5" />}
                  label="Date of Death"
                  value={formatDate(report.dateOfDeath)}
                />
                <DetailCard
                  icon={<Clock className="w-5 h-5" />}
                  label="Report Created"
                  value={formatDate(report.createdAt)}
                />
              </div>

              {report.remarks && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <label className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                    Remarks
                  </label>
                  <p className="text-slate-800 mt-2 whitespace-pre-wrap">
                    {report.remarks}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200">
            <Link
              href={`/deathreports/${report.id}/edit`}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              <Edit className="w-5 h-5" />
              Edit Report
            </Link>

            <button
              onClick={deleteReport}
              disabled={deleting}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Delete Report
                </>
              )}
            </button>

            <Link
              href="/deathreports"
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-slate-500">{icon}</div>
        <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      </div>
      <p className="text-lg font-medium text-slate-900 ml-7">{value}</p>
    </div>
  );
}
