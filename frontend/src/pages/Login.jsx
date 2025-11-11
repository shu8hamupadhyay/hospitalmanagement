import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'
export default function Login(){
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const nav = useNavigate()
  async function submit(e){
    e.preventDefault()
    try{
      const data = await login({ username, password })
      if(data?.token){ localStorage.setItem('token', data.token); nav('/dashboard') }
      else setError('Login failed')
    }catch(err){ setError(err.response?.data || 'Login failed') }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full p-2 border mb-2 rounded" required/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border mb-4 rounded" required/>
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  )
}
