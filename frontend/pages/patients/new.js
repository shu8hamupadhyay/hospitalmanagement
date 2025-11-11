import Layout from '../../components/Layout';
import { useState } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/router';

export default function NewPatient(){
  const [name,setName]=useState('');
  const [contact,setContact]=useState('');
  const router = useRouter();

  async function submit(e){
    e.preventDefault();
    try{
      await api.post('/api/patients', { name, contact });
      router.push('/patients');
    }catch(err){
      alert('Failed to create');
    }
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">New Patient</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow w-full max-w-md">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-2 mb-3 border rounded" />
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Phone or email" className="w-full p-2 mb-3 border rounded" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>
    </Layout>
  );
}
