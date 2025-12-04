"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import Link from "next/link";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Edit, 
  User, 
  Stethoscope, 
  Calendar, 
  FileText,
  CreditCard 
} from "lucide-react";

export default function BillDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // -------------------------------
  // FETCH BILL
  // -------------------------------
  useEffect(() => {
    if (!id) return;

    async function loadBill() {
      try {
        const res = await fetch(`http://localhost:8080/api/bills/${id}`);
        if (res.ok) {
          const data = await res.json();
          setBill(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load bill:", err);
        setError(true);
      }
      setLoading(false);
    }

    loadBill();
  }, [id]);

  // -------------------------------
  // LOADING STATE
  // -------------------------------
  if (!id || loading) {
    return (
      <Layout active="bills">
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
           <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p>Retrieving Invoice Details...</p>
        </div>
      </Layout>
    );
  }

  // -------------------------------
  // ERROR STATE
  // -------------------------------
  if (error || !bill) {
    return (
      <Layout active="bills">
        <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-red-900/20 rounded-full text-red-500">
            <FileText size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white">Invoice Not Found</h2>
          <p className="text-slate-400">The bill you are looking for does not exist or has been deleted.</p>
          <button 
            onClick={() => router.push("/bills")}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Back to All Bills
          </button>
        </div>
      </Layout>
    );
  }

  // --- Formatters ---
  const formattedDate = bill.billDate
    ? new Date(bill.billDate).toLocaleDateString("en-US", {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    : "N/A";

  const cardClass = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm";
  const labelClass = "block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1";
  const valueClass = "text-lg font-semibold text-white";

  return (
    <Layout active="bills">
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">

        {/* --- HEADER ACTIONS --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/bills")}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Invoice Details</h2>
              <p className="text-slate-400 text-sm">
                View payment breakdown for <span className="text-blue-400 font-mono">#{bill.invoiceNumber}</span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href={`/bills/add?id=${bill.id}`}
              className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition"
            >
              <Edit size={16} className="mr-2" /> Edit
            </Link>
            
            <a
              href={`http://localhost:8080/bills/${bill.id}/pdf`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-900/20 transition"
            >
              <Download size={16} className="mr-2" /> Download PDF
            </a>
          </div>
        </div>

        {/* --- INVOICE META GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Patient Card */}
          <div className={cardClass}>
            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2 bg-blue-900/20 rounded text-blue-400"><User size={20} /></div>
              <h3 className="text-slate-200 font-medium">Billed To</h3>
            </div>
            <div>
              <p className={valueClass}>{bill.patientName || "Unknown"}</p>
              <p className="text-sm text-slate-500 mt-1">Patient ID: #{bill.patientId}</p>
            </div>
          </div>

          {/* Doctor Card */}
          <div className={cardClass}>
             <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2 bg-purple-900/20 rounded text-purple-400"><Stethoscope size={20} /></div>
              <h3 className="text-slate-200 font-medium">Issued By</h3>
            </div>
            <div>
              <p className={valueClass}>Dr. {bill.doctorName || "Unknown"}</p>
              <p className="text-sm text-slate-500 mt-1">Provider ID: #{bill.doctorId}</p>
            </div>
          </div>

          {/* Invoice Info Card */}
          <div className={cardClass}>
             <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
              <div className="p-2 bg-amber-900/20 rounded text-amber-400"><Calendar size={20} /></div>
              <h3 className="text-slate-200 font-medium">Invoice Info</h3>
            </div>
            <div className="space-y-2">
              <div>
                <span className={labelClass}>Invoice Date</span>
                <p className="text-white text-sm">{formattedDate}</p>
              </div>
              <div>
                 <span className={labelClass}>Invoice No</span>
                 <p className="text-white text-sm font-mono tracking-wide">{bill.invoiceNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEMIZED TABLE --- */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center gap-2">
            <CreditCard size={18} className="text-slate-400"/>
            <h3 className="font-semibold text-slate-200">Payment Summary</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Unit Price</th>
                  <th className="px-6 py-3 text-right">Tax / Disc</th>
                  <th className="px-6 py-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {bill.items?.length > 0 ? (
                  bill.items.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="px-6 py-4 font-medium text-white">{item.description}</td>
                      <td className="px-6 py-4 text-center text-slate-300">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-slate-300">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-xs text-slate-500">
                        <div>Tax: {item.taxPercent}%</div>
                        <div>Disc: {item.discountPercent}%</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-white">₹{item.subTotal?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-8 text-center text-slate-500 italic" colSpan={5}>
                      No billable items listed on this invoice.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- TOTALS FOOTER --- */}
        <div className="flex flex-col md:flex-row justify-end items-start gap-8">
          
          {/* Optional: Notes Section (Placeholder) */}
          <div className="flex-1 text-slate-500 text-sm">
             <p className="mb-1 uppercase text-xs font-bold tracking-wider">Terms & Conditions:</p>
             <p className="italic">Payment is due within 30 days. Please include invoice number on your check.</p>
          </div>

          {/* Calculations */}
          <div className="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal (Before Tax)</span>
                <span>₹{bill.totalBeforeTax?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Total Discount</span>
                <span className="text-red-400">- ₹{bill.totalDiscount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Tax Applied</span>
                <span className="text-amber-400">+ ₹{bill.totalTax?.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="border-t border-slate-700 my-4"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">Grand Total</span>
              <span className="text-2xl font-bold text-green-400">₹{bill.grandTotal?.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}