import Layout from '../../components/Layout';
import api from '../../lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Doctors(){
  const [doctors, setDoctors] = useState([]);
  useEffect(()=>{ api.get('/api/doctors').then(r=>setDoctors(r.data)).catch(()=>setDoctors([])); },[]);
  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Doctors</h2>
        <Link href="/doctors/new"><a className="px-3 py-1 bg-blue-600 text-white rounded">New Doctor</a></Link>
      </div>
      <div className="bg-white p-4 rounded shadow">
        {doctors.length===0 && <div className="text-slate-500">No doctors yet</div>}
        <ul>
          {doctors.map(d=> <li key={d.id} className="py-2 border-b">{d.name} — {d.specialization}</li>)}
        </ul>
      </div>
    </Layout>
  );
}
