"use client"; // needed for Next.js App Router

import Layout from "../components/Layout";
import useSWR from "swr";

const API_BASE = "http://localhost:8080"; // ✅ your Spring Boot backend URL
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data: doctors, error: doctorsError, isLoading: doctorsLoading } = useSWR(`${API_BASE}/api/doctors`, fetcher);
  const { data: patients, error: patientsError, isLoading: patientsLoading } = useSWR(`${API_BASE}/api/patients`, fetcher);
  const { data: appointments, error: apptError, isLoading: apptLoading } = useSWR(`${API_BASE}/api/appointments`, fetcher);

  const doctorCount = doctors ? doctors.length : 0;
  const patientCount = patients ? patients.length : 0;

  // Filter today's appointments (if backend includes appointmentDate)
  const today = new Date().toISOString().slice(0, 10);
  const appointmentsToday =
    appointments?.filter((a) => a.appointmentDate?.startsWith(today)).length || 0;

  // Placeholder revenue (you can replace with real billing endpoint later)
  const revenue = appointments ? appointments.length * 500 : 0;

  return (
    <Layout active="dashboard">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Doctors"
            value={doctorsLoading ? "..." : doctorCount}
            icon="👩‍⚕️"
          />
          <StatCard
            title="Patients"
            value={patientsLoading ? "..." : patientCount}
            icon="🧍‍♂️"
          />
          <StatCard
            title="Appointments Today"
            value={apptLoading ? "..." : appointmentsToday}
            icon="📅"
          />
          <StatCard
            title="Revenue"
            value={apptLoading ? "..." : `₹${revenue.toLocaleString()}`}
            icon="💰"
          />
        </div>

        {/* Error State */}
        {(doctorsError || patientsError || apptError) && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-4">
            ⚠️ Failed to load some data. Please check backend connection.
          </div>
        )}

        {/* Recent Appointments */}
        {appointments && appointments.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mt-6">
            <h3 className="font-semibold mb-3 text-lg">Recent Appointments</h3>
            <table className="w-full table-auto">
              <thead className="text-sm text-slate-600 border-b bg-slate-50">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.slice(-5).reverse().map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{a.serialNo || a.id}</td>
                    <td className="p-3">{a.patient?.name || "—"}</td>
                    <td className="p-3">{a.doctor?.name || "—"}</td>
                    <td className="p-3">
                      {a.appointmentDate
                        ? new Date(a.appointmentDate).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          a.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : a.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {a.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!appointments && !apptLoading && (
          <div className="text-slate-500 italic">No appointment data available.</div>
        )}
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">{title}</div>
        <div className="text-xl">{icon}</div>
      </div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
