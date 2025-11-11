import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <h2 className="text-lg font-semibold mb-6">Hospital Management</h2>

      <nav className="flex flex-col gap-3">
        <Link to="/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link>
        <Link to="/doctors" className="hover:text-blue-600">👨‍⚕️ Doctors</Link>
        <Link to="/patients" className="hover:text-blue-600">🩺 Patients</Link>
        <Link to="/appointments" className="hover:text-blue-600">📅 Appointments</Link>
        <Link to="/billing" className="hover:text-blue-600">💳 Billing</Link>
        <Link to="/departments" className="hover:text-blue-600">🏢 Departments</Link>
        <Link to="/reports" className="hover:text-blue-600">📊 Reports</Link>
      </nav>
    </aside>
  );
}
