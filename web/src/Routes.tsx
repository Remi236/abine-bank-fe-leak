import { Routes, Route } from 'react-router-dom';
import { AuthRoute, GuestRoute } from './components';
import {
  Auth,
  CaptchaAuth,
  Home,
  Profile,
  UserAccount,
  Recipients,
  Transfer,
  DebtReminder,
  ForgetPass,
  ChangePass,
  ResetPass,
  UserTransactions,
  EmployeeDashboard,
  AdminDashboard,
} from './pages';

export const routes = {
  register: '/register',
  login: '/login',
  profile: '/profile',
  home: '/',
  userAccount: '/user-account',
  recipients: '/recipients',
  transfer: '/transfer',
  debtReminder: '/debt-reminder',
  forgetPass: '/forget-pass',
  resetPass: '/reset-pass',
  changePass: '/change-pass',
  transactions: '/transactions',
  employee: {
    home: '/employee',
    login: '/employee/login',
  },
  admin: {
    home: '/admin',
    login: '/admin/login',
  },
} as const;

export const routesMenu = [
  {
    title: 'Account',
    link: routes.userAccount,
  },
  {
    title: 'Recipients',
    link: routes.recipients,
  },
  {
    title: 'Transactions',
    link: routes.transactions,
  },
  {
    title: 'Transfers',
    link: routes.transfer,
  },
  {
    title: 'Debt Reminder',
    link: '/debt-reminder',
  },
] as const;

export const {
  register,
  login,
  profile,
  home,
  userAccount,
  recipients,
  transfer,
  debtReminder,
  forgetPass,
  resetPass,
  transactions,
  changePass,
  employee,
  admin,
} = routes;

export function Router() {
  return (
    <Routes>
      <Route path={home} element={<Home />} />
      <Route
        path={register}
        element={
          <AuthRoute authRole={'customer'} outlet={<Auth authRole="employee" key="register" />} navigateTo={home} />
        }
      />
      <Route
        path={login}
        element={
          <GuestRoute authRole="customer" outlet={<CaptchaAuth authRole="customer" key="login" />} navigateTo={home} />
        }
      />
      <Route path={profile} element={<AuthRoute authRole={'customer'} outlet={<Profile />} navigateTo={login} />} />
      <Route
        path={userAccount}
        element={<AuthRoute authRole={'customer'} outlet={<UserAccount />} navigateTo={login} />}
      />
      <Route
        path={recipients}
        element={<AuthRoute authRole={'customer'} outlet={<Recipients />} navigateTo={login} />}
      />
      <Route path={transfer} element={<AuthRoute authRole={'customer'} outlet={<Transfer />} navigateTo={login} />} />
      <Route
        path={debtReminder}
        element={<AuthRoute authRole={'customer'} outlet={<DebtReminder />} navigateTo={login} />}
      />
      <Route
        path={transactions}
        element={<AuthRoute authRole={'customer'} outlet={<UserTransactions />} navigateTo={login} />}
      />
      <Route
        path={changePass}
        element={<AuthRoute authRole={'customer'} outlet={<ChangePass />} navigateTo={login} />}
      />
      <Route path={forgetPass} element={<ForgetPass />} />
      <Route path={resetPass} element={<ResetPass />} />

      {/* employee */}
      <Route
        path={employee.login}
        element={
          <GuestRoute
            authRole="employee"
            outlet={<CaptchaAuth authRole="employee" key="employeeLogin" />}
            navigateTo={employee.home}
          />
        }
      />
      <Route
        path={employee.home}
        element={<AuthRoute authRole={'employee'} outlet={<EmployeeDashboard />} navigateTo={employee.login} />}
      />

      {/* admin */}
      <Route
        path={admin.login}
        element={
          <GuestRoute authRole="admin" outlet={<Auth authRole="admin" key="adminLogin" />} navigateTo={admin.home} />
        }
      />
      <Route
        path={admin.home}
        element={<AuthRoute authRole={'admin'} outlet={<AdminDashboard />} navigateTo={admin.login} />}
      />
    </Routes>
  );
}

export default Router;
