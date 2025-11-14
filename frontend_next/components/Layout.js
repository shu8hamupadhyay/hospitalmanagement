"use client";

import Link from "next/link";
import { useState } from "react";

export default function Layout({ children, active = "dashboard" }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* ==== Sidebar ==== */}
      <aside className="w-full md:w-64 bg-slate-800 text-white md:min-h-screen">

        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-semibold">Hospital Management</h1>
        </div>

        {/* ==== Navigation ==== */}
        <nav className="p-3 md:p-4 space-y-1">

          {/* Dashboard */}
          <NavItem
            href="/dashboard"
            label="Dashboard"
            active={active === "dashboard"}
          />

          {/* Patients (NOW DROPDOWN LIKE DEPARTMENTS + DOCTORS) */}
          <NavGroup
            label="Patients"
            icon="🧍‍♂️"
            isActiveGroup={active.startsWith("patients")}
            items={[
              { href: "/patients", label: "All Patients" },
              { href: "/patients/add", label: "Add Patient" },
            ]}
          />

          {/* Departments */}
          <NavGroup
            label="Departments"
            icon="🏥"
            isActiveGroup={active.startsWith("departments")}
            items={[
              { href: "/departments", label: "All Departments" },
              { href: "/departments/add", label: "Add Department" },
            ]}
          />

          {/* Doctors */}
          <NavGroup
            label="Doctors"
            icon="👨‍⚕️"
            isActiveGroup={active.startsWith("doctors")}
            items={[
              { href: "/doctors", label: "All Doctors" },
              { href: "/doctors/add", label: "Add Doctor" },
            ]}
          />

          {/* Death Reports */}
          <NavGroup
            label="Death Reports"
            icon="📄"
            isActiveGroup={active.startsWith("deathreports")}
            items={[
              { href: "/deathreports", label: "All Reports" },
              { href: "/deathreports/add", label: "Add New Report" },
            ]}
          />

        </nav>
      </aside>

      {/* ==== Main Content ==== */}
      <div className="flex-1">
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

/* ========================= Sidebar Item ========================= */
function NavItem({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded transition ${
        active
          ? "bg-slate-700 text-white"
          : "text-slate-200 hover:bg-slate-700/40"
      }`}
    >
      {label}
    </Link>
  );
}

/* ========================= Dropdown Group ========================= */
function NavGroup({ label, items, icon, isActiveGroup }) {
  const [open, setOpen] = useState(isActiveGroup);

  return (
    <div>
      {/* Group Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded transition
          ${open ? "bg-slate-700" : "text-slate-200 hover:bg-slate-700/40"}
        `}
      >
        <span>{icon} {label}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown Items */}
      {open && (
        <div className="ml-3 mt-1 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm rounded text-slate-300 hover:bg-slate-700/30"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
