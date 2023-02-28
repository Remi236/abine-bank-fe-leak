export const API = {
  otp: 'auth/otp-no-auth',
  user: {
    get: 'users',
    updateInfo: 'users',
    put: 'users/:id',
    delete: 'users/:id',
    profile: 'users/profile',
    resetPass: 'users/forgot-password',
    addEmployee: 'users/employee',
    editEmployee: 'users/employee/:id',
  },
  auth: {
    refresh: 'auth/refresh',
    logout: 'auth/logout',
    register: 'auth/user/register',
    adminLogin: 'auth/admin/login',
    employeeLogin: 'auth/employee/login',
    customerLogin: 'auth/customer/login',
    otp: 'auth/otp',
  },
  customer:{
    profile: 'customers/profile',
    account: 'customers/account', // + number
    close: 'customers/close',
    get: 'customers',
    post: 'customers',
    topUp: 'customers/topup',
    recipients :{
      transactions: 'recipients/transaction',
      get: 'recipients',
      post: 'recipients',
      put: 'recipients/:id',
      delete: 'recipients/:id',
    }
  },
  bank: 'banks',
  transaction: {
    get: 'transactions',
    post: 'transactions',
    viewById: 'transactions/:id',
    report: 'transactions/report',
  },
  debts: {
    get: 'debts',
    post: 'debts',
    getFull: 'debts/full',
    cancel: 'debts/cancel/:id',
  },
  profile: 'users/profile',
};
