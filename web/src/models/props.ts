export type Props = {
  children: React.ReactNode;
};

export type ProtectedRouteProps = {
  authRole?: string;
  navigateTo: string;
  outlet: JSX.Element;
};

export type AuthProp = {
  authRole: 'admin' | 'employee' | 'customer';
}
