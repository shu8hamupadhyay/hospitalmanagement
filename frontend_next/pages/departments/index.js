"use client";

import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import useSWR from "swr";
import Link from "next/link";
import {
  Building,
  Plus,
  Search,
  Grid,
  List as ListIcon,
  Users,
  Activity,
  Edit,
  Stethoscope
} from "lucide-react";

const API = "http://localhost:8080/api/departments";
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DepartmentsList() {
  const { data, error, isLoading } = useSWR(API, fetcher);
  const departments = Array.isArray(data) ? data : [];

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");

  // Filter by name or head doctor name
  const filteredDepartments = useMemo(() => {
    return departments.filter((d) =>
      (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.headDoctorName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const activeCount = departments.filter((d) => d.status === "Active").length;
  const totalStaff = departments.reduce(
    (acc, curr) => acc + (Number(curr.staffCount) || 0),
    0
  );

  // Style helpers
  const cardClass =
    "bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all shadow-sm group relative overflow-hidden flex flex-col justify-between";

  const badgeClass = (status) =>
    `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
      status === "Active"
        ? "bg-green-900/30 text-green-400 border-green-800"
        : "bg-slate-800 text-slate-400 border-slate-700"
    }`;

  return (
    <Layout active="departments">
      <div className="p-6 md:p-10 text-white space-y-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Manage hospital wards, units, and medical centers.
            </p>
          </div>

          <Link
            href="/departments/add"
            className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 transition-all"
          >
            <Plus size={18} className="mr-2" /> Add Department
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
              <Building size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Total Units</p>
              <p className="text-2xl font-bold text-white">{departments.length}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-400">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Active Status</p>
              <p className="text-2xl font-bold text-white">
                {activeCount}
                <span className="text-sm font-normal text-slate-500">
                  {" "}
                  / {departments.length}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Total Staff</p>
              <p className="text-2xl font-bold text-white">{totalStaff}</p>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800 backdrop-blur-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search departments..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Grid size={18} />
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-slate-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading departments...
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <p>No departments found.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map((d) => (
              <div key={d.id} className={cardClass}>
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-900/20 rounded-lg text-indigo-400 border border-indigo-900/50">
                      <Stethoscope size={24} />
                    </div>
                    <span className={badgeClass(d.status)}>{d.status}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{d.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {d.servicesOffered || "General Medical Services"}
                  </p>

                  <div className="space-y-2 text-sm border-t border-slate-800 pt-4 mt-2">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Head:</span>
                      <span>{d.headDoctorName || "Not Assigned"}</span>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-500">Staff Count:</span>
                      <span>{d.staffCount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
                  <Link
                    href={`/departments/${d.id}`}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-center rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>

                  <Link
                    href={`/departments/${d.id}`}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-500 text-center rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-800/50 text-xs uppercase font-semibold text-slate-300">
                  <tr>
                    <th className="px-6 py-4">Department Name</th>
                    <th className="px-6 py-4">Head of Dept</th>
                    <th className="px-6 py-4 text-center">Staff</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredDepartments.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-indigo-400">
                            <Building size={16} />
                          </div>
                          {d.name}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {d.headDoctorName || "—"}
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-slate-300">
                        {d.staffCount}
                      </td>

                      <td className="px-6 py-4">
                        <span className={badgeClass(d.status)}>{d.status}</span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/departments/${d.id}`}
                          className="text-blue-400 hover:text-blue-300 text-xs font-medium mr-4"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
