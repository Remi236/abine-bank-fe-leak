import { useProxy } from 'valtio/macro';
import { proxyWithComputed } from 'valtio/utils';
import jwt_decode from 'jwt-decode';
import { getItem, removeItem, setItem } from '~/helpers';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '~/constants';
import { AuthState, Tokens } from '~/models';
import { IJwtPayload } from 'shared';

const reqHeaders = new Headers();
reqHeaders.append('Content-Type', 'application/json');

const state = proxyWithComputed<AuthState, { isAuth: boolean; user: IJwtPayload | null }>(
  {
    access_token: getItem(ACCESS_TOKEN),
    refresh_token: getItem(REFRESH_TOKEN),
  },
  {
    isAuth: ({ access_token }) => access_token !== null,
    user: ({ access_token }) => (access_token ? jwt_decode(access_token) : null),
  },
);

const setAccessToken = (access_token: string | null) => {
  state.access_token = access_token;
  access_token != null ? setItem(ACCESS_TOKEN, access_token) : removeItem(ACCESS_TOKEN);
};
const setRefreshToken = (refresh_token: string | null) => {
  state.refresh_token = refresh_token;
  refresh_token != null ? setItem(REFRESH_TOKEN, refresh_token) : removeItem(REFRESH_TOKEN);
};

const actions = {
  login: ({ access_token, refresh_token }: Tokens) => {
    setAccessToken(access_token);
    setRefreshToken(refresh_token);
  },
  logout: () => {
    setAccessToken(null);
    setRefreshToken(null);
  },
  setAccessToken,
  setRefreshToken,
};

export const useAuth = () => {
  useProxy(state);

  return {
    ...state,
    ...actions,
  };
};
