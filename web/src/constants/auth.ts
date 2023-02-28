export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const ROLE = 'role';
export const HEADER_AUTHORIZATION = 'Authorization';
export const HEADER_AUTHORIZATION_TYPE = 'Bearer';
export const SITE_KEY = "6Lfqhv4iAAAAACwYE5KoP2B5cIAStuUGoJwIxbga";
export const ROUTES = {
  admin: 'auth/admin/login',
  employee: 'auth/employee/login',
  customer: 'auth/customer/login',
} as const;
export const HOME_ROUTES = {
  admin: '/admin',
  employee: '/employee',
  customer: '/',
}
