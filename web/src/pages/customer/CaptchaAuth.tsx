import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth, useFetch } from '~/hooks';
import {EMAIL_FIELD, EMAIL_REGEX, HOME_ROUTES, PASSWORD_FIELD, RECAPTCHA, ROLE, ROUTES, SITE_KEY} from '~/constants';
import { log } from 'shared';
import { captchaAuthSchema, FetchMethod, AuthProp, ICaptchaAuthForm, State, Tokens } from '~/models';
import ReCAPTCHA from 'react-google-recaptcha';
import '~/styles/LoginForm.scss';
import { setItem } from '~/helpers';
import { routes } from '~/Routes';

export const CaptchaAuth = ({ authRole }: AuthProp) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICaptchaAuthForm>({
    resolver: yupResolver(captchaAuthSchema),
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const { api } = useFetch();
  const [state, setState] = useState<State>({ error: null });

  const onSubmit = async (dto: ICaptchaAuthForm) => {
    log.info(dto);
    const { json, error } = await api<Tokens>(FetchMethod.POST, ROUTES[authRole], {
      ...dto,
    });

    if (error != null) {
      setState({ ...state, error });
      return;
    }

    login(json);

    setItem(ROLE, authRole);

    navigate(HOME_ROUTES[authRole]);
  };

  // Recaptcha
  function onChange(value: string | null) {
    if (value !== null) {
      setValue(RECAPTCHA, value);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-bg">
        <div className="login-content">
          <div className="text-center">
            <Link to="/">
              <img src="/logo.png" alt="None" className="logo__img" style={{ width: '15%', height: 'auto' }} />
            </Link>
          </div>
          <h3 className="text-center"> Log in</h3>
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
            <div className="google-recaptcha">
              <ReCAPTCHA sitekey={SITE_KEY} onChange={onChange} />
              <input type="hidden" {...register(RECAPTCHA, { required: true })} />
              <p className="text-danger">{errors[RECAPTCHA]?.message}</p>
            </div>
            <div>
              <button className="btn btn-block w-100 text-uppercase btn-signin">Sign In</button>
            </div>
          </form>
          <div className="forgot-pass mt-2">
            <Link to={routes.forgetPass}>Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
