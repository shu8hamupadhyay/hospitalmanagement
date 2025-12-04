import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function withAuth(WrappedComponent, requiredRoles = []) {
  return function ProtectedPage(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      if (requiredRoles.length > 0) {
        const user = JSON.parse(userStr);
        const hasRequiredRole = requiredRoles.some((role) =>
          user.roles && user.roles.includes(role)
        );

        if (!hasRequiredRole) {
          router.push('/unauthorized');
        }
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}
