import Layout from '../../components/Layout';
import api from '../../lib/api';
import { useEffect, useState } from 'react';

export default function Appointments(){
  const [appointments, setAppointments] = useState([]);
  useEffect(()=>{ api.get('/api/appointments').then(r=>setAppointments(r.data)).catch(()=>setAppointments([])); },[]);
  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Appointments</h2>
      <div className="bg-white p-4 rounded shadow">
        {appointments.length===0 && <div className="text-slate-500">No appointments yet</div>}
        <ul>
          {appointments.map(a=> <li key={a.id} className="py-2 border-b">{a.patientName} — {a.doctorName} — {a.startTime}</li>)}
        </ul>
      </div>
    </Layout>
  );
}
