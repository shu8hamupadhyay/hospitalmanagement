import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Layout({ children }){
  const router = useRouter();

  useEffect(() => {
    // simple client-side protected route
    const token = localStorage.getItem('token');
    if(!token && router.pathname !== '/login') router.push('/login');
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
