"use client";

import Layout from "../../components/Layout";
import useSWR from "swr";
import Link from "next/link";

const API = "http://localhost:8080/api/doctors";
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DoctorsList() {
  const { data: doctors, error, isLoading } = useSWR(API, fetcher);

  return (
    <Layout active="doctors/list">
      <div className="p-6 space-y-6 text-white">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">All Doctors</h2>

          <Link
            href="/doctors/add"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
          >
            + Add Doctor
          </Link>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Specialization</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">

              {isLoading && (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-slate-400">
                    Loading doctors...
                  </td>
                </tr>
              )}

              {doctors?.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-5 text-center text-slate-400">
                    No doctors found.
                  </td>
                </tr>
              )}

              {doctors?.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800 transition">
                  <td className="p-3">{d.id}</td>
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-800 text-blue-200 rounded text-xs">
                      {d.specialization}
                    </span>
                  </td>
                  <td className="p-3">{d.phone || "—"}</td>

                  <td className="p-3 flex gap-2">
                    <Link
                      href={`/doctors/${d.id}`}
                      className="px-3 py-1 bg-amber-600 text-white rounded text-xs hover:bg-amber-700"
                    >
                      Edit
                    </Link>

                    <Link
                      href={`/doctors/${d.id}`}
                      className="px-3 py-1 bg-slate-700 text-white rounded text-xs hover:bg-slate-600"
                    >
                      View
                    </Link>
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
