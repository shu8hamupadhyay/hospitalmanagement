import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login(){
  const router = useRouter();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, { username, password });
      const token = res.data.token;
      if(!token) throw new Error('No token returned');
      localStorage.setItem('token', token);
      router.push('/dashboard');
    } catch(err){
      setError(err.response?.data || err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4">edata4you — Sign in</h2>
        {error && <div className="text-red-600 mb-3">{String(error)}</div>}
        <form onSubmit={handleSubmit}>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full p-2 mb-3 border rounded" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 mb-4 border rounded" />
          <button className="w-full bg-blue-600 text-white p-2 rounded">Sign in</button>
        </form>
      </div>
    </div>
  );
}
