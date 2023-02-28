import { useAuth } from './useAuth';
import { log } from 'shared';
import { FetchMethod, FetchReturns } from '~/models';
import { DEFAULT_DATA, DEFAULT_OPTIONS, REGEX, STATUS_CODE, API, DEFAULT_HEADERS } from '~/constants';

export const myFetch = <T>(
  method: FetchMethod,
  route: string,
  data = DEFAULT_DATA,
  reqHeaders = DEFAULT_HEADERS,
  options = DEFAULT_OPTIONS,
): Promise<FetchReturns<T>> => {
  const body = method === FetchMethod.GET ? undefined : JSON.stringify(data);

  return window
    .fetch([import.meta.env.VITE_BASE_API.replace(REGEX, ''), route].join('/'), {
      ...options,
      method,
      headers: reqHeaders,
      body,
    })
    .then((res) => res.json())
    .then((json) => {
      const { message, statusCode } = json;
      if (statusCode && (statusCode < STATUS_CODE.OK || statusCode >= STATUS_CODE.REDIRECT)) {
        return { json: null, error: message, statusCode };
      }
      return { json, error: null, statusCode };
    })
    .catch((err) => ({ json: null, error: err.message, statusCode: null }));
};

export const useFetch = () => {
  const { logout, setAccessToken, access_token, refresh_token } = useAuth();

  const api = async <T>(
    method: FetchMethod,
    route: string,
    data = DEFAULT_DATA,
    options = DEFAULT_OPTIONS,
  ): Promise<FetchReturns<T>> => {
    const { json, error, statusCode } = await myFetch(
      method,
      route,
      data,
      { ...DEFAULT_HEADERS, Authorization: `Bearer ${access_token}` },
      options,
    );

    if (!route.includes('login') && statusCode === STATUS_CODE.UNAUTHORIZED) {
      log.error('Unauthorized, retry with refresh token');
      try {
        const { json, statusCode } = await myFetch(FetchMethod.POST, API.auth.refresh, { access_token, refresh_token });

        if (statusCode === undefined) {
          log.success('Refresh token success');
          const { access_token: newAccessToken } = json as Record<string, string>;
          setAccessToken(newAccessToken);
          return myFetch(method, route, data, { ...DEFAULT_HEADERS, Authorization: `Bearer ${newAccessToken}` }, options);
        }

        log.info('Logging out...');
        logout();
      } catch (error) {
        log.error('Refresh token error', error);
      }
    }

    return { json, error, statusCode } as FetchReturns<T>;
  };

  return { api };
};
