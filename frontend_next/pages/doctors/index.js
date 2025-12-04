"use client";

import { useState, useMemo } from "react";
import Layout from "../../components/Layout";
import useSWR from "swr";
import Link from "next/link";
import { 
  Search, 
  UserPlus, 
  Stethoscope, 
  Phone, 
  Mail, 
  MapPin, 
  Grid, 
  List as ListIcon,
  Filter,
  MoreHorizontal
} from "lucide-react";

const API = "http://localhost:8080/api/doctors";
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DoctorsList() {
  const { data, error, isLoading } = useSWR(API, fetcher);
  const doctors = Array.isArray(data) ? data : [];

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");

  // --- Derived State ---
  const specializations = useMemo(() => {
    const specs = new Set(doctors.map(d => d.specialization).filter(Boolean));
    return Array.from(specs);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchesSearch = d.name?.toLowerCase().includes(search.toLowerCase()) || 
                            d.email?.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = specializationFilter ? d.specialization === specializationFilter : true;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, search, specializationFilter]);

  // --- Styles ---
  const cardClass = "bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm group relative overflow-hidden";
  const badgeClass = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800";

  return (
    <Layout active="doctors/list">
      <div className="p-6 md:p-10 text-white space-y-8 max-w-7xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Medical Staff</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Manage doctor profiles, schedules, and specializations.
            </p>
          </div>
          <Link
            href="/doctors/add"
            className="flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 transition-all"
          >
            <UserPlus size={18} className="mr-2" /> Add Doctor
          </Link>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-sm">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Loading doctors directory...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
            <p>No doctors found matching your criteria.</p>
            <button onClick={() => {setSearch(""); setSpecializationFilter("")}} className="text-blue-400 text-sm mt-2 hover:underline">Clear filters</button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((d) => (
                  <div key={d.id} className={cardClass}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 border border-slate-700">
                          {d.name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-white truncate max-w-[160px]">{d.name}</h3>
                          <span className={badgeClass}>{d.specialization || "General"}</span>
                        </div>
                      </div>
                      <div className="relative">
                         <Link 
                           href={`/doctors/${d.id}`} 
                           className="text-slate-500 hover:text-white p-1 rounded-md hover:bg-slate-800 transition block"
                         >
                           <MoreHorizontal size={20} />
                         </Link>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-400 mt-4 pt-4 border-t border-slate-800/50">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-500"/> {d.phone || "No phone"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-slate-500"/> 
                        <span className="truncate">{d.email || "No email"}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Link 
                        href={`/doctors/${d.id}`}
                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg text-center transition-colors"
                      >
                        View Profile
                      </Link>
                      <Link 
                        href={`/doctors/${d.id}?edit=true`} // Assuming edit mode via query param or distinct page
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-500 text-xs font-medium rounded-lg text-center transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800/50 text-xs uppercase font-semibold text-slate-300">
                      <tr>
                        <th className="px-6 py-4">Doctor</th>
                        <th className="px-6 py-4">Specialization</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredDoctors.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-700">
                                {d.name?.charAt(0)}
                              </div>
                              <span className="font-medium text-white">{d.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={badgeClass}>{d.specialization}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span>{d.email}</span>
                              <span className="text-xs text-slate-500">{d.phone}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/doctors/${d.id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium mr-3">View</Link>
                            <Link href={`/doctors/${d.id}`} className="text-amber-500 hover:text-amber-400 text-xs font-medium">Edit</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </Layout>
  );
}