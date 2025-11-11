import Link from 'next/link';

export default function Sidebar(){
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">edata4you</h1>
        <div className="text-sm text-slate-500">Hospital Admin</div>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard"><a className="p-2 rounded hover:bg-slate-100">Dashboard</a></Link>
        <Link href="/patients"><a className="p-2 rounded hover:bg-slate-100">Patients</a></Link>
        <Link href="/doctors"><a className="p-2 rounded hover:bg-slate-100">Doctors</a></Link>
        <Link href="/appointments"><a className="p-2 rounded hover:bg-slate-100">Appointments</a></Link>
        <Link href="/billing"><a className="p-2 rounded hover:bg-slate-100">Billing</a></Link>
      </nav>
    </aside>
  );
}
