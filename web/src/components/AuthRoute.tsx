import { Navigate } from 'react-router-dom';
import { useAuth } from '~/hooks';
import { ProtectedRouteProps } from '~/models';

export function AuthRoute({ outlet, navigateTo, authRole }: ProtectedRouteProps) {
  const { user } = useAuth();
  return user?.role.toLowerCase() === authRole?.toLowerCase() ? outlet : <Navigate to={navigateTo} replace />;
}
