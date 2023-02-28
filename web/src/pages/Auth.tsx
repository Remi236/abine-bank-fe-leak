import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth, useFetch } from '~/hooks';
import {EMAIL_FIELD, EMAIL_REGEX, HOME_ROUTES, PASSWORD_FIELD, ROLE, ROUTES} from '~/constants';
import { AuthProp, authSchema, FetchMethod, IAuthForm, State, Tokens } from '~/models';
import '~/styles/LoginForm.scss';
import { setItem } from '~/helpers';

export const Auth = ({authRole}: AuthProp) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthForm>({
    resolver: yupResolver(authSchema),
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { api } = useFetch();

  const [state, setState] = useState<State>({ error: null });

  const onSubmit = async (dto: IAuthForm) => {
    const { json, error } = await api<Tokens>(FetchMethod.POST, ROUTES[authRole], {
      ...dto,
    });

    if (error != null) {
      setState({ ...state, error });
      return;
    }

    login(json);
    setItem(ROLE, authRole);
    navigate(HOME_ROUTES[authRole], {
      replace: true,
    });
  };

  return (
    <div className="login-wrap">
      <div className="login-bg">
        <div className="login-content">
          <div className="text-center">
            <Link to="/">
              <img src="/logo.png" alt="None" className="logo__img" style={{ width: '15%', height: 'auto' }} />
            </Link>
          </div>
          <h3 className="text-center"> Log in as {authRole}</h3>
          {state.error && (
            <strong>
              <p className="text-danger text-center">Error: {state.error}</p>
            </strong>
          )}
          <form className="form-login" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="email">
                Email: <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="form-control box-shadow-none"
                {...register(EMAIL_FIELD, { required: true, pattern: { value: EMAIL_REGEX, message: "email must be an valid email" } })}
              />
              <p className="text-danger">{errors[EMAIL_FIELD]?.message}</p>
            </div>
            <div className="form-outline mb-3">
              <label className="form-label" htmlFor="password">
                Password: <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                autoComplete="on"
                id="password"
                className="form-control outline-none box-shadow-none"
                {...register(PASSWORD_FIELD, { required: true })}
              />
              <p className="text-danger">{errors[PASSWORD_FIELD]?.message}</p>
            </div>
            <div>
              <button className="btn btn-block w-100 text-uppercase btn-signin">Sign In</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
