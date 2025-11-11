import { useRouter } from 'next/router';

export default function Topbar(){
  const router = useRouter();
  function logout(){
    localStorage.removeItem('token');
    router.push('/login');
  }
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-slate-100">☰</button>
        <div className="text-lg font-semibold">Dashboard</div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
      </div>
    </div>
  );
}
