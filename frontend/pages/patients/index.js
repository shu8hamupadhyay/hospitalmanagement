import Layout from '../../components/Layout';
import api from '../../lib/api';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Patients(){
  const [patients, setPatients] = useState([]);
  useEffect(()=>{
    api.get('/api/patients').then(r=>setPatients(r.data)).catch(()=>setPatients([]));
  },[]);
  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Patients</h2>
        <Link href="/patients/new"><a className="px-3 py-1 bg-blue-600 text-white rounded">New Patient</a></Link>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full">
          <thead><tr><th className="text-left p-2">ID</th><th className="text-left p-2">Name</th><th className="text-left p-2">Phone</th></tr></thead>
          <tbody>
            {patients.map(p=>(
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.contact}</td>
              </tr>
            ))}
            {patients.length===0 && <tr><td colSpan={3} className="p-4 text-center text-slate-500">No patients yet</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
