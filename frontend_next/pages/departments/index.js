"use client";

import Layout from "../../components/Layout";
import useSWR from "swr";
import Link from "next/link";

const API = "http://localhost:8080/api/departments";
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DepartmentsList() {
  const { data: departments, error, isLoading } = useSWR(API, fetcher);

  return (
    <Layout active="departments">
      <div className="p-6 space-y-6 text-white">

        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Departments</h2>

          <Link
            href="/departments/add"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
          >
            + Add Department
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-lg shadow overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Head</th>
                <th className="p-3">Staff</th>
                <th className="p-3">Services</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700">

              {isLoading && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              )}

              {departments?.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-5 text-center text-slate-400">
                    No departments found.
                  </td>
                </tr>
              )}

              {departments?.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800 transition">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.head}</td>
                  <td className="p-3">{d.staffCount}</td>
                  <td className="p-3">{d.servicesOffered}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        d.status === "Active" ? "bg-green-700" : "bg-gray-600"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <Link
                      href={`/departments/${d.id}`}
                      className="px-3 py-1 bg-amber-600 rounded text-xs"
                    >
                      Edit
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
