"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/Layout";

export default function DeathReportsPage() {
  const API = "http://localhost:8080/api/death-reports";

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setReports(data);
    } catch (e) {
      console.error("Failed to fetch death reports:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <Layout active="deathreports">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Death Reports</h2>

          <a
            href="/deathreports/add"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Add New Report
          </a>
        </div>

        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          {loading ? (
            <div className="text-center p-6">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-center p-6 text-slate-500">
              No death reports found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3">ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Cause</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">{r.id}</td>
                    <td className="p-3">{r.patientName}</td>
                    <td className="p-3">{r.gender}</td>
                    <td className="p-3">{r.causeOfDeath}</td>
                    <td className="p-3">{r.doctorName}</td>
                    <td className="p-3">{r.ward}</td>
                    <td className="p-3">
                      {r.dateOfDeath?.replace("T", " ").slice(0, 16)}
                    </td>

                    <td className="p-3 flex gap-2">
                      <a
                        href={`/deathreports/${r.id}`}
                        className="px-2 py-1 text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <button
                        className="px-2 py-1 text-red-600 hover:underline"
                        onClick={async () => {
                          if (!confirm("Delete this report?")) return;
                          await fetch(`${API}/${r.id}`, { method: "DELETE" });
                          loadReports();
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
