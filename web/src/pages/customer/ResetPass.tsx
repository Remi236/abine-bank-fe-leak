import {Col, Row} from 'react-bootstrap';
import '~/styles/ForgetPass.scss';
import {useForm} from "react-hook-form";
import {FetchMethod, IResetForm, ResetPassResponse, resetSchema, State} from "~/models";
import {yupResolver} from "@hookform/resolvers/yup";
import {useNavigate} from "react-router-dom";
import {useFetch} from "~/hooks";
import {useState} from "react";
import {API, PASSWORD_CONFIRM_FIELD, PASSWORD_FIELD} from "~/constants";
import {routes} from "~/Routes";
import {useLocation} from "react-use";
import OtpInput from "~/components/Otp/OtpInput";
import {useNotify} from "~/hooks/useNotify";

export function ResetPass() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetForm>({
    resolver: yupResolver(resetSchema),
  });
  const navigate = useNavigate();
  const { api } = useFetch();
  const {state} = useLocation();
  const { showNotifications } = useNotify();
  const {email} = state.usr;
  const [formState, setFormState] = useState<State>({ error: null });
  const [otp, setOtp] = useState('');
  const onChange = (value: string) => {setOtp(value); setValue('otp', otp)};

  const onSubmit = async (dto: IResetForm) => {
    const value = {password: dto[PASSWORD_FIELD], email, otp};
    const { json, error } = await api<ResetPassResponse>(FetchMethod.POST, API.user.resetPass, value);

    if (error != null) {
      setFormState({ ...formState, error });
      return;
    }
    showNotifications('Your password has been reset !', `Now you can login in account: ${email} with new password you have changed !`, {
      type: 'success',
    });
    navigate(routes.login);
  };

  return (
    <div className="p-4 content__wrap">
      <div className="forget-pass-page">
        <h2 className="primary-color text-center">Reset Password</h2>
        <Row>
          <Col>
            {formState.error && (
              <strong>
                <p className="text-danger text-center">Error: {formState.error}</p>
              </strong>
            )}
            <form className="form-forgot-pass" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">
                  Password: <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="on"
                  id={PASSWORD_FIELD}
                  className="form-control outline-none box-shadow-none"
                  {...register(PASSWORD_FIELD, { required: true })}
                />
                <p className="text-danger">{errors[PASSWORD_FIELD]?.message}</p>
              </div>
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">
                  Confirm Password: <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  autoComplete="on"
                  id={PASSWORD_CONFIRM_FIELD}
                  className="form-control outline-none box-shadow-none"
                  {...register(PASSWORD_CONFIRM_FIELD, { required: true })}
                />
                <p className="text-danger">{errors[PASSWORD_CONFIRM_FIELD]?.message}</p>
              </div>
              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="password">
                  Otp: <span className="text-danger">*</span>
                </label>
                <OtpInput value={otp} valueLength={6} onChange={onChange} />
                <input type={'hidden'} {...register('otp', { required: true})}/>
                <p className="text-danger">{errors.otp?.message}</p>
              </div>
              <input type={'hidden'} name={'email'} value={email}/>
              <div className="submit_btn d-flex justify-content-end">
                <button type="submit" className="btn btn-primary btn-block w-100 text-uppercase">
                  Submit
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </div>
  );
}
