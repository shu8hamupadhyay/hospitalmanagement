"use client";

import Layout from "../../components/Layout";
import useSWR, { mutate } from "swr";
import Link from "next/link";

const API = "http://localhost:8080/api/patients";

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function PatientsList() {
  const { data, error, isLoading } = useSWR(API, fetcher);

  // 🛠 SAFE LIST
  const patients = Array.isArray(data) ? data : [];

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this patient?")) return;

    const res = await fetch(`${API}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    mutate(API); // Refresh list
  }

  return (
    <Layout active="patients">
      <div className="p-6 text-white space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold">Patients Management</h2>
            <p className="text-sm text-slate-400">View and manage all registered patients.</p>
          </div>

          <Link
            href="/patients/add"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            + Add Patient
          </Link>
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-auto shadow">

          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 text-xs uppercase">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name / Email</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Age / DOB</th>
                <th className="p-3">City</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Blood</th>
                <th className="p-3">Doctor</th>
                <th className="p-3">Insurance</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">

              {/* Loading */}
              {isLoading && (
                <tr>
                  <td colSpan="10" className="p-6 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              )}

              {/* Error */}
              {error && (
                <tr>
                  <td colSpan="10" className="p-6 text-center text-red-400">
                    Failed to load patients.
                  </td>
                </tr>
              )}

              {/* No Data */}
              {!isLoading && patients.length === 0 && (
                <tr>
                  <td colSpan="10" className="p-6 text-center text-slate-400">
                    No patients found.
                  </td>
                </tr>
              )}

              {/* Patient Rows */}
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800 transition">

                  <td className="p-3">{p.id}</td>

                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.email}</div>
                  </td>

                  <td className="p-3">{p.gender || "—"}</td>

                  <td className="p-3">
                    <div>{p.age ?? "—"}</div>
                    <div className="text-xs text-slate-400">{p.dob ?? "—"}</div>
                  </td>

                  <td className="p-3">{p.city || "-"}</td>

                  <td className="p-3">{p.phone || "-"}</td>

                  <td className="p-3">{p.bloodGroup || "-"}</td>

                  <td className="p-3">
                    {p.doctor ? (
                      <>
                        <div>{p.doctor.name}</div>
                        <div className="text-xs text-slate-400">
                          {p.doctor.specialization}
                        </div>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="p-3">
                    <div>{p.insuranceProvider || "—"}</div>
                    <div className="text-xs text-slate-400">
                      {p.insurancePolicyNumber || ""}
                    </div>
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/patients/${p.id}`}
                      className="px-3 py-1 bg-amber-600 rounded text-xs text-white mr-2"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => remove(p.id)}
                      className="px-3 py-1 bg-red-600 rounded text-xs text-white"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </Layout>
  );
}
