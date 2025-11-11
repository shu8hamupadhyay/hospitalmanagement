import React from 'react'
import { Outlet } from 'react-router-dom'
export default function Layout(){
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <div className="text-xl font-bold mb-6">Hospital</div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="font-semibold">Hospital Dashboard</div>
          <div><button onClick={()=>{localStorage.removeItem('token'); window.location='/login'}} className="px-3 py-1 border rounded">Logout</button></div>
        </header>
        <main className="p-6"><Outlet/></main>
      </div>
    </div>
  )
}
