"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  Building, 
  Receipt, 
  DollarSign, 
  FileText, 
  Pill,
  Activity,
  Clock,
  UserPlus,
  AlertCircle,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current date for header
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard Load Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Layout active="dashboard">
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (!stats) {
    return (
      <Layout active="dashboard">
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
           <div className="p-4 bg-slate-800 rounded-full mb-4"><AlertCircle className="text-red-500" size={32} /></div>
           <p>Failed to load dashboard data. Please check server connection.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="dashboard">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-slate-400 mt-1 text-sm">Hospital Administration Overview</p>
          </div>
          <div className="text-right">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Current Date</p>
            <p className="text-slate-200 font-medium">{today}</p>
          </div>
        </div>

        {/* ======================= KEY PERFORMANCE INDICATORS ======================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashCard 
            title="Total Patients" 
            value={stats.patients} 
            link="/patients" 
            icon={Users} 
            trend="+12% vs last month"
            color="text-blue-400" 
            bg="bg-slate-900" 
            border="border-blue-900" 
          />
          <DashCard 
            title="Active Doctors" 
            value={stats.doctors} 
            link="/doctors" 
            icon={Stethoscope} 
            trend="Full Staff"
            color="text-emerald-400" 
            bg="bg-slate-900" 
            border="border-emerald-900" 
          />
          <DashCard 
            title="Appointments" 
            value={stats.appointmentsToday} 
            subtitle="Scheduled Today"
            link="/appointments" 
            icon={Calendar} 
            trend="Busy Day"
            color="text-purple-400" 
            bg="bg-slate-900" 
            border="border-purple-900" 
          />
          <DashCard 
            title="Revenue" 
            value={`₹${stats.totalRevenue?.toLocaleString()}`} 
            link="/bills" 
            icon={DollarSign} 
            trend="+5% this week"
            color="text-amber-400" 
            bg="bg-slate-900" 
            border="border-amber-900" 
          />
        </div>

        {/* ======================= OPERATIONAL METRICS ======================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniCard title="Departments" value={stats.departments} icon={Building} link="/departments" color="text-indigo-400" />
          <MiniCard title="Invoices" value={stats.bills} icon={Receipt} link="/bills" color="text-pink-400" />
          <MiniCard title="Lab Reports" value={stats.labReports} icon={Activity} link="/labreports" color="text-cyan-400" />
          <MiniCard title="Pharmacy" value={stats.medicines} icon={Pill} link="/pharmacy" color="text-orange-400" />
        </div>

        {/* ======================= ANALYTICS SECTION ======================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Activity Feed Widget */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Clock className="text-slate-400" size={20} /> 
                Today's Highlights
              </h2>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">Live Updates</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivityItem 
                icon={Calendar} 
                label="Upcoming Appointments" 
                value={stats.upcomingAppointments} 
                desc="Patients waiting in queue"
                accent="blue"
              />
              <ActivityItem 
                icon={UserPlus} 
                label="Birth Reports" 
                value={stats.birthReports} 
                desc="New registrations in maternity"
                accent="pink"
              />
              <ActivityItem 
                icon={FileText} 
                label="Death Reports" 
                value={stats.deathReports} 
                desc="Mortuary records updated"
                accent="slate"
              />
              <ActivityItem 
                icon={AlertCircle} 
                label="New Inquiries" 
                value={stats.contacts} 
                desc="Pending responses on helpdesk"
                accent="amber"
              />
            </div>
          </div>

          {/* Financial Widget */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-lg overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={100} className="text-emerald-400" />
            </div>
            
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Revenue</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-white">₹{stats.totalRevenue?.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Invoices Generated</span>
                <span className="text-white font-medium">{stats.bills}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]"></div>
              </div>
              <p className="text-xs text-slate-500 pt-2">
                * Revenue data includes all settled and pending invoices for the current fiscal period.
              </p>
            </div>

            <Link href="/bills" className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all">
              View Financial Reports <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </Layout>
  );
}

/* --- Sub-Components --- */

function DashCard({ title, value, subtitle, link, icon: Icon, trend, color, bg, border }) {
  return (
    <Link href={link} className="group">
      <div className={`h-full p-5 rounded-2xl border ${border} ${bg} hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-300`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl bg-slate-800 ${color} shadow-inner`}>
            <Icon size={24} />
          </div>
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800 ${color} border border-current/20`}>
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ title, value, icon: Icon, link, color }) {
  return (
    <Link href={link} className="group">
      <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-xl transition-all hover:translate-y-[-2px]">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-lg bg-slate-800 ${color} group-hover:bg-slate-700 transition-colors`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">{title}</p>
            <p className="text-xl font-bold text-slate-200">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ icon: Icon, label, value, desc, accent }) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    pink: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    slate: "text-slate-400 bg-slate-400/10 border-slate-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20"
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[accent].split(' ')[2]} ${colorMap[accent].split(' ')[1]} flex items-start gap-4 transition-colors hover:bg-opacity-20`}>
      <div className={`mt-1 p-2 rounded-lg bg-slate-900 ${colorMap[accent].split(' ')[0]}`}>
        <Icon size={18} />
      </div>
      <div>
        <h4 className="text-2xl font-bold text-white">{value}</h4>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-400 mt-1 opacity-80">{desc}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-8 bg-slate-800 rounded w-1/3 mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-800 rounded-2xl"></div>)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-800 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-slate-800 rounded-2xl"></div>
        <div className="h-64 bg-slate-800 rounded-2xl"></div>
      </div>
    </div>
  );
}