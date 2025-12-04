"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import SearchableSelect from "../../components/SearchableSelect";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Save,
  FileText,
  User,
  Stethoscope,
  ArrowLeft,
  Calculator,
  Calendar,
  Pill,
  Edit2
} from "lucide-react";

export default function AddBill() {
  const router = useRouter();
  const { id: editId } = router.query;

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);
  const [medicineSearch, setMedicineSearch] = useState({});
  const [bill, setBill] = useState({
    id: null,
    invoiceNumber: "",
    patientId: "",
    doctorId: "",
    billDate: new Date().toISOString().split('T')[0]
  });

  const [totals, setTotals] = useState({
    totalBeforeTax: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
  });

  // --- Styles ---
  const cardClass = "bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-2";
  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder-slate-600";
  const tableInputClass = "w-full bg-slate-950 border border-slate-700 text-white rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm";

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, dRes, mRes] = await Promise.all([
          fetch("http://localhost:8080/api/patients"),
          fetch("http://localhost:8080/api/doctors"),
          fetch("http://localhost:8080/api/pharmacy/medicines")
        ]);
        const pData = await pRes.json();
        const dData = await dRes.json();
        const mData = await mRes.json();
        
        setPatients(Array.isArray(pData) ? pData : []);
        setDoctors(Array.isArray(dData) ? dData : []);
        setMedicines(Array.isArray(mData) ? mData : []);
      } catch (e) {
        console.error("Failed to load dropdowns", e);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // Load bill (edit mode)
  useEffect(() => {
    if (!editId) return;

    async function loadBill() {
      try {
        const res = await fetch(`http://localhost:8080/api/bills/${editId}`);
        if (!res.ok) throw new Error("Bill not found");
        const b = await res.json();

        setBill({
          id: b.id,
          invoiceNumber: b.invoiceNumber,
          patientId: b.patientId,
          doctorId: b.doctorId,
          billDate: b.billDate ? b.billDate.split('T')[0] : new Date().toISOString().split('T')[0]
        });

        setItems(
          b.items?.map((it) => ({
            id: it.id,
            description: it.description,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            taxPercent: it.taxPercent,
            discountPercent: it.discountPercent,
            medicineId: it.medicineId,
            medicineName: it.medicineName,
            usesMedicine: !!it.medicineId
          })) || []
        );
      } catch (err) {
        console.error(err);
      }
    }
    loadBill();
  }, [editId]);

  // Calculations
  useEffect(() => {
    let before = 0, disc = 0, tax = 0;

    items.forEach((it) => {
      const qty = Number(it.quantity) || 0;
      const price = Number(it.unitPrice) || 0;
      const taxP = Number(it.taxPercent) || 0;
      const discP = Number(it.discountPercent) || 0;

      const base = qty * price;
      const discountAmt = base * (discP / 100);
      const afterDisc = base - discountAmt;
      const taxAmt = afterDisc * (taxP / 100);

      before += base;
      disc += discountAmt;
      tax += taxAmt;
    });

    setTotals({
      totalBeforeTax: before,
      totalDiscount: disc,
      totalTax: tax,
      grandTotal: before - disc + tax,
    });
  }, [items]);

  // Handlers
  const addItem = () => {
    setItems([...items, { 
      id: null, 
      description: "", 
      quantity: 1, 
      unitPrice: 0, 
      taxPercent: 0, 
      discountPercent: 0,
      medicineId: null,
      usesMedicine: false
    }]);
  };

  const removeItem = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  // When selecting a medicine
  const selectMedicine = (i, medicineId) => {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
      const updated = [...items];
      updated[i] = {
        ...updated[i],
        medicineId: medicine.id,
        medicineName: medicine.name,
        description: medicine.name,
        unitPrice: medicine.price,
        usesMedicine: true
      };
      setItems(updated);
    }
  };

  // Filter medicines by search query
  const getFilteredMedicines = (searchQuery) => {
    if (!searchQuery.trim()) return medicines;
    const query = searchQuery.toLowerCase();
    return medicines.filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.manufacturer.toLowerCase().includes(query) ||
      m.type.toLowerCase().includes(query)
    );
  };

  // Toggle between manual and medicine selection
  const toggleMedicineMode = (i) => {
    const updated = [...items];
    updated[i].usesMedicine = !updated[i].usesMedicine;
    if (!updated[i].usesMedicine) {
      updated[i].medicineId = null;
      updated[i].medicineName = null;
    }
    setItems(updated);
  };

  const saveBill = async () => {
    if (!bill.patientId || !bill.doctorId) {
      alert("Please select both a patient and a doctor.");
      return;
    }
    setSaving(true);

    const payload = {
      ...bill,
      patientId: Number(bill.patientId),
      doctorId: Number(bill.doctorId),
      items: items.map((it) => ({
        description: it.description,
        quantity: Number(it.quantity),
        unitPrice: Number(it.unitPrice),
        taxPercent: Number(it.taxPercent),
        discountPercent: Number(it.discountPercent),
        medicineId: it.medicineId ? Number(it.medicineId) : null
      })),
    };

    const method = editId ? "PUT" : "POST";
    const url = editId ? `http://localhost:8080/api/bills/${editId}` : "http://localhost:8080/api/bills";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/bills");
    } catch (e) {
      alert("Error saving bill");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData && editId && !bill.id) {
     return <Layout active="bills"><div className="p-10 text-center text-slate-500">Loading Invoice Data...</div></Layout>;
  }

  return (
    <Layout active="bills">
      <div className="max-w-6xl mx-auto p-6 md:p-8 text-white space-y-6">

        {/* --- TOP BAR --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                {editId ? `Edit Invoice #${bill.invoiceNumber}` : "Create New Invoice"}
              </h2>
              <p className="text-slate-400 text-sm">Fill in the details below to generate a bill.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.push("/bills")} className="px-5 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition">
              Cancel
            </button>
            <button
              onClick={saveBill}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-900/20 transition-all ${
                saving ? "bg-blue-800 cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Save size={18} />
              {saving ? "Processing..." : "Save Invoice"}
            </button>
          </div>
        </div>

        {/* --- INVOICE METADATA --- */}
        <div className={cardClass}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="md:col-span-1">
              <label className={labelClass}><FileText size={14} /> Invoice Number</label>
              <input 
                className={inputClass} 
                value={bill.invoiceNumber} 
                onChange={(e) => setBill({...bill, invoiceNumber: e.target.value})}
                placeholder="INV-001"
              />
            </div>

            <div className="md:col-span-1">
               <label className={labelClass}><Calendar size={14} /> Date</label>
               <input 
                 type="date"
                 className={inputClass} 
                 value={bill.billDate} 
                 onChange={(e) => setBill({...bill, billDate: e.target.value})}
               />
            </div>

            <div className="md:col-span-1">
              <SearchableSelect
                label="Patient"
                icon={<User size={14} />}
                value={bill.patientId}
                onChange={(val) => setBill({...bill, patientId: val})}
                options={patients}
                placeholder="Select a patient..."
                required
              />
            </div>

            <div className="md:col-span-1">
              <SearchableSelect
                label="Doctor"
                icon={<Stethoscope size={14} />}
                value={bill.doctorId}
                onChange={(val) => setBill({...bill, doctorId: val})}
                options={doctors}
                placeholder="Select a doctor..."
                getOptionLabel={(d) => `${d.name}`}
                required
              />
            </div>

          </div>
        </div>

        {/* --- LINE ITEMS --- */}
        <div className={`${cardClass} p-0 overflow-hidden`}>
          <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              <Calculator size={18} /> Billable Items
            </h3>
            <button 
              onClick={addItem} 
              className="text-sm flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
            >
              <Plus size={16} /> Add New Line
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3 flex-1">Description / Medicine</th>
                  <th className="px-4 py-3 w-20">Qty</th>
                  <th className="px-4 py-3 w-24">Price (₹)</th>
                  <th className="px-4 py-3 w-16">Tax %</th>
                  <th className="px-4 py-3 w-16">Disc %</th>
                  <th className="px-4 py-3 text-right w-24">Total</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500 italic">
                      No items added yet. Click "Add New Line" to start.
                    </td>
                  </tr>
                )}
                {items.map((item, i) => {
                   const qty = Number(item.quantity) || 0;
                   const price = Number(item.unitPrice) || 0;
                   const taxP = Number(item.taxPercent) || 0;
                   const discP = Number(item.discountPercent) || 0;
                   const base = qty * price;
                   const val = base - (base * (discP/100)) + ((base - (base * (discP/100))) * (taxP/100));

                   return (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-2">
                        <button
                          onClick={() => toggleMedicineMode(i)}
                          className={`p-1.5 rounded text-xs ${
                            item.usesMedicine
                              ? "bg-green-900/30 text-green-400"
                              : "bg-slate-800 text-slate-400"
                          } hover:opacity-80 transition`}
                          title={item.usesMedicine ? "Using pharmacy" : "Manual entry"}
                        >
                          {item.usesMedicine ? <Pill size={14} /> : <Edit2 size={14} />}
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        {item.usesMedicine ? (
                          <div className="relative flex flex-col gap-1 z-50">
                            {item.medicineId ? (
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1">
                                  <div className="font-medium text-slate-200 text-sm">{item.medicineName}</div>
                                  <div className="text-slate-400 text-xs">{medicines.find(m => m.id === item.medicineId)?.manufacturer}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateItem(i, "medicineId", null);
                                    updateItem(i, "medicineName", null);
                                    setMedicineSearch({...medicineSearch, [i]: ""});
                                  }}
                                  className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300"
                                >
                                  Change
                                </button>
                              </div>
                            ) : (
                              <>
                                <input
                                  type="text"
                                  className={tableInputClass}
                                  placeholder="Search medicine..."
                                  value={medicineSearch[i] || ""}
                                  onChange={(e) => setMedicineSearch({...medicineSearch, [i]: e.target.value})}
                                  onFocus={(e) => setMedicineSearch({...medicineSearch, [`${i}_open`]: true})}
                                />
                                {(medicineSearch[`${i}_open`] || medicineSearch[i]) && getFilteredMedicines(medicineSearch[i] || "").length > 0 && (
                                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                                    {getFilteredMedicines(medicineSearch[i] || "").map(m => (
                                      <div
                                        key={m.id}
                                        onClick={() => {
                                          selectMedicine(i, m.id);
                                          setMedicineSearch({...medicineSearch, [i]: "", [`${i}_open`]: false});
                                        }}
                                        className="px-3 py-2 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 last:border-b-0 transition text-xs"
                                      >
                                        <div className="font-medium text-slate-200">{m.name}</div>
                                        <div className="text-slate-400 text-xs">{m.manufacturer} • ₹{m.price}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <input 
                            className={tableInputClass} 
                            placeholder="Item Name" 
                            value={item.description} 
                            onChange={(e) => updateItem(i, "description", e.target.value)} 
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" className={tableInputClass} 
                          value={item.quantity} 
                          onChange={(e) => updateItem(i, "quantity", e.target.value)} 
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" className={tableInputClass} 
                          value={item.unitPrice} 
                          onChange={(e) => updateItem(i, "unitPrice", e.target.value)} 
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" className={tableInputClass} 
                          value={item.taxPercent} 
                          onChange={(e) => updateItem(i, "taxPercent", e.target.value)} 
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" className={tableInputClass} 
                          value={item.discountPercent} 
                          onChange={(e) => updateItem(i, "discountPercent", e.target.value)} 
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-slate-300 w-24">
                        ₹{val.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button 
                          onClick={() => removeItem(i)} 
                          className="text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- TOTALS SUMMARY --- */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-4 border-b border-slate-800 pb-2">
              Payment Summary
            </h4>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal</span>
                <span>₹{totals.totalBeforeTax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-slate-300">
                <span>Discount</span>
                <span className="text-red-400">- ₹{totals.totalDiscount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Tax</span>
                <span className="text-amber-400">+ ₹{totals.totalTax.toFixed(2)}</span>
              </div>

              <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center">
                <span className="text-lg font-bold text-white">Grand Total</span>
                <span className="text-xl font-bold text-green-400">₹{totals.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}