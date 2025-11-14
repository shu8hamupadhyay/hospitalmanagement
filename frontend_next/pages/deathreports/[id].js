"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function ViewReportPage() {
  const router = useRouter();
  const { id } = router.query;        // ✅ Correct for Pages Router

  const [report, setReport] = useState(null);

  useEffect(() => {
    if (!id) return;                  // ⛔ Wait for id to load

    fetch(`http://localhost:8080/api/death-reports/${id}`)
      .then((r) => r.json())
      .then(setReport)
      .catch((err) => console.error("Failed to load report", err));

  }, [id]);

  if (!report)
    return (
      <Layout active="deathreports">
        <div className="p-4">Loading...</div>
      </Layout>
    );

  return (
    <Layout active="deathreports">
      <div className="p-4 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Death Report Details</h2>

        <div className="bg-white p-6 rounded shadow space-y-2">

          <Detail label="ID" value={report.id} />
          <Detail label="Patient Name" value={report.patientName} />
          <Detail label="Gender" value={report.gender} />
          <Detail label="Cause of Death" value={report.causeOfDeath} />
          <Detail label="Doctor" value={report.doctorName} />
          <Detail label="Ward" value={report.ward} />
          <Detail
            label="Date of Death"
            value={report.dateOfDeath?.replace("T", " ").slice(0, 16)}
          />
          <Detail label="Remarks" value={report.remarks} />

          <button
            className="mt-4 px-3 py-2 text-red-600 border border-red-400 rounded"
            onClick={async () => {
              if (!confirm("Delete this report?")) return;
              await fetch(`http://localhost:8080/api/death-reports/${id}`, {
                method: "DELETE",
              });
              router.push("/deathreports");
            }}
          >
            Delete
          </button>

          <a href="/deathreports" className="ml-3 text-slate-600">
            Back
          </a>
        </div>
      </div>
    </Layout>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}
