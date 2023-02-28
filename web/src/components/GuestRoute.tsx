import { Navigate } from 'react-router-dom';
import { ProtectedRouteProps } from '~/models';
import { useAuth } from '~/hooks';

export function GuestRoute({ outlet, navigateTo, authRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  return (!user?.role || user?.role !== authRole) ? outlet : <Navigate to={navigateTo} />;
}
