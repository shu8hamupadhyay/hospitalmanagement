import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import api from '../lib/api';

const Chart = dynamic(() => import('../components/SmallChart'), { ssr: false });

export default function Dashboard(){
  const [stats, setStats] = useState({ patientsToday: 0, appointments: 0, revenue: 0 });
  useEffect(() => {
    // try fetch summary from backend, fallback to mock
    api.get('/api/dashboard/summary').then(r=>setStats(r.data)).catch(()=>{ setStats({patientsToday:12, appointments:34, revenue:5400}) });
  }, []);
  return (
    <Layout>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Patients Today</div>
          <div className="text-2xl font-bold">{stats.patientsToday}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Appointments</div>
          <div className="text-2xl font-bold">{stats.appointments}</div>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <div className="text-sm text-slate-500">Revenue</div>
          <div className="text-2xl font-bold">₹{stats.revenue}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="font-semibold mb-4">Activity</h3>
        <Chart />
      </div>
    </Layout>
  );
}
