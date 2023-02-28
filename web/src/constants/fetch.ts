export const DEFAULT_DATA = {};
export const DEFAULT_OPTIONS: RequestInit = {};
export const DEFAULT_HEADERS: HeadersInit = { 'Content-Type': 'application/json' };

export const REGEX = /\/*$/;

export enum STATUS_CODE {
  OK = 200,
  REDIRECT = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
