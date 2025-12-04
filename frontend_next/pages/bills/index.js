"use client";

import { useState, useMemo, useRef } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import useSWR, { mutate } from "swr";

const API = "http://localhost:8080/api/bills";
const IMPORT_API = "http://localhost:8080/bills/import";
const EXPORT_API = "http://localhost:8080/bills/export";

const fetcher = (url) => fetch(url).then((r) => r.json());

// --- Icons ---
const SearchIcon = () => (<svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const FilterIcon = () => (<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);
const PlusIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>);
const DownloadIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const UploadIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const FilePdfIcon = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const TrashIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const EditIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>);
const RefreshIcon = () => (<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>);

export default function BillsPage() {
  const { data, isLoading, mutate: refresh } = useSWR(API, fetcher);
  const bills = Array.isArray(data) ? data : [];
  
  // --- Local State ---
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Filter State ---
  const [filterDoctor, setFilterDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, highest, lowest

  // --- Logic: Unique Doctors for Dropdown ---
  const doctors = useMemo(() => {
    const docs = new Map();
    bills.forEach(b => {
      if(b.doctorId && b.doctorName) docs.set(b.doctorId, b.doctorName);
    });
    return Array.from(docs.entries());
  }, [bills]);

  // --- Logic: Filtering & Sorting ---
  const filteredBills = useMemo(() => {
    let result = bills.filter((b) => {
      // 1. Text Search
      const matchesSearch = 
        b.patientName?.toLowerCase().includes(search.toLowerCase()) ||
        b.invoiceNumber?.toLowerCase().includes(search.toLowerCase());

      // 2. Doctor Filter
      const matchesDoctor = filterDoctor ? String(b.doctorId) === String(filterDoctor) : true;

      // 3. Date Range
      let matchesDate = true;
      if (startDate || endDate) {
        const billDate = new Date(b.billDate).getTime();
        if (startDate && billDate < new Date(startDate).getTime()) matchesDate = false;
        // End date set to end of day
        const endDateTime = endDate ? new Date(endDate).setHours(23,59,59,999) : null;
        if (endDate && billDate > endDateTime) matchesDate = false;
      }

      // 4. Amount Range
      const matchesAmount = minAmount ? b.grandTotal >= Number(minAmount) : true;

      return matchesSearch && matchesDoctor && matchesDate && matchesAmount;
    });

    // 5. Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.billDate || 0).getTime();
      const dateB = new Date(b.billDate || 0).getTime();
      const amtA = a.grandTotal || 0;
      const amtB = b.grandTotal || 0;

      switch (sortBy) {
        case "oldest": return dateA - dateB;
        case "highest": return amtB - amtA;
        case "lowest": return amtA - amtB;
        case "newest": default: return dateB - dateA;
      }
    });

    return result;
  }, [bills, search, filterDoctor, startDate, endDate, minAmount, sortBy]);

  // --- Logic: Dynamic Stats ---
  const totalRevenue = useMemo(() => {
    return filteredBills.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
  }, [filteredBills]);

  // --- Handlers ---
  const resetFilters = () => {
    setFilterDoctor("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setSortBy("newest");
    setSearch("");
  };

  async function deleteBill(id) {
    if (!confirm("Are you sure you want to delete this bill? This action cannot be undone.")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    refresh();
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(IMPORT_API, { method: "POST", body: formData });
      if (res.ok) {
        alert("Import Successful!");
        refresh();
      } else {
        alert("Import Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
      e.target.value = ""; 
    }
  };

  // --- Styles ---
  const filterInputClass = "bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-slate-500";
  const labelClass = "block mb-1 text-xs font-medium text-slate-400 uppercase";

  return (
    <Layout active="bills">
      <div className="p-6 md:p-10 text-white space-y-8 max-w-7xl mx-auto">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Billing & Invoices</h2>
            <p className="text-slate-400 mt-1 text-sm">
              Financial overview and invoice management.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <input 
              type="file" 
              accept=".xlsx" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              {isUploading ? <span className="animate-pulse">Uploading...</span> : <><UploadIcon /> Import</>}
            </button>

            <a
              href={EXPORT_API}
              className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              <DownloadIcon /> Export
            </a>

            <Link
              href="/bills/add"
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-green-900/20 transition-all"
            >
              <PlusIcon /> New Bill
            </Link>
          </div>
        </div>

        {/* --- STATISTICS CARDS (Dynamic) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-16 h-16 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" /></svg>
            </div>
            <h4 className="text-slate-400 text-xs uppercase font-semibold">Total Revenue (Filtered)</h4>
            <div className="text-2xl font-bold text-green-400 mt-1">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-2">Based on current selection</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm">
            <h4 className="text-slate-400 text-xs uppercase font-semibold">Invoices Found</h4>
            <div className="text-2xl font-bold text-white mt-1">{filteredBills.length}</div>
          </div>

           <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow-sm flex flex-col justify-center items-start">
             <button onClick={resetFilters} className="text-xs flex items-center text-blue-400 hover:text-white transition-colors">
               <RefreshIcon /> Reset all filters
             </button>
          </div>
        </div>

        {/* --- SEARCH & FILTER BAR --- */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 shadow-sm space-y-4">
          
          {/* Top Row: Search + Filter Toggle */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search Invoice # or Patient Name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 text-white transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                showFilters 
                ? "bg-slate-800 border-blue-500 text-blue-400" 
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <FilterIcon /> Filters {(startDate || endDate || minAmount || filterDoctor) && <span className="ml-2 w-2 h-2 rounded-full bg-blue-500"></span>}
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Doctor Select */}
              <div className="md:col-span-1">
                <label className={labelClass}>Filter by Doctor</label>
                <select 
                  value={filterDoctor} 
                  onChange={(e) => setFilterDoctor(e.target.value)} 
                  className={filterInputClass}
                >
                  <option value="">All Doctors</option>
                  {doctors.map(([id, name]) => (
                    <option key={id} value={id}>Dr. {name}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="md:col-span-1">
                <label className={labelClass}>From Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className={filterInputClass} 
                />
              </div>
              <div className="md:col-span-1">
                <label className={labelClass}>To Date</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  className={filterInputClass} 
                />
              </div>

              {/* Min Amount */}
              <div className="md:col-span-1">
                <label className={labelClass}>Min Amount (₹)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={minAmount} 
                  onChange={(e) => setMinAmount(e.target.value)} 
                  className={filterInputClass} 
                />
              </div>

              {/* Sort Order */}
              <div className="md:col-span-1">
                <label className={labelClass}>Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)} 
                  className={filterInputClass}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>

            </div>
          )}
        </div>

        {/* --- TABLE --- */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl ring-1 ring-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-800/80 text-slate-400 text-xs uppercase font-semibold tracking-wider border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4">Invoice Details</th>
                  <th className="px-6 py-4">Patient Info</th>
                  <th className="px-6 py-4">Doctor</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {isLoading && (
                  <tr><td colSpan="5" className="p-8 text-center text-slate-500">Loading records...</td></tr>
                )}

                {!isLoading && filteredBills.length === 0 && (
                   <tr>
                     <td colSpan="5" className="p-12 text-center text-slate-500">
                       <div className="flex flex-col items-center">
                         <span className="text-2xl opacity-20 mb-2"><FilterIcon /></span>
                         <p>No bills found matching your filters.</p>
                         <button onClick={resetFilters} className="text-blue-400 text-xs mt-2 hover:underline">Clear Filters</button>
                       </div>
                     </td>
                  </tr>
                )}

                {filteredBills.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-blue-400 font-medium">{b.invoiceNumber}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {b.billDate ? new Date(b.billDate).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{b.patientName}</div>
                      <div className="text-xs text-slate-500">ID: #{b.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {b.doctorName || <span className="text-slate-600 italic">None</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-green-900/20 text-green-400 font-bold border border-green-900/30">
                        ₹{b.grandTotal?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <a 
                          href={`http://localhost:8080/bills/${b.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          title="Download PDF"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        >
                          <FilePdfIcon />
                        </a>
                        <Link
                          href={`/bills/add?id=${b.id}`}
                          title="Edit Bill"
                          className="p-2 text-amber-500 hover:text-white hover:bg-amber-600 rounded transition-colors"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          onClick={() => deleteBill(b.id)}
                          title="Delete Bill"
                          className="p-2 text-red-500 hover:text-white hover:bg-red-600 rounded transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-800/50 p-3 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
             <span>Data sourced from API</span>
             <span>Showing {filteredBills.length} of {bills.length} Records</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}