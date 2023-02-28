import { Col, Row } from 'react-bootstrap';
import '~/styles/ForgetPass.scss';
import { useForm } from 'react-hook-form';
import {
  FetchMethod,
  IResetForm,
  OtpResponse,
  OtpTypePost,
  ResetPassResponse,
  resetSchema,
} from '~/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '~/hooks';
import { useState } from 'react';
import { API, PASSWORD_CONFIRM_FIELD, PASSWORD_FIELD } from '~/constants';
import { routes } from '~/Routes';
import { useLocation } from 'react-use';
import { useNotify } from '~/hooks/useNotify';
import { FaKey } from 'react-icons/fa';
import {OtpModal} from "~/components/Otp/OtpModal";

export function ChangePass() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<IResetForm>({
    resolver: yupResolver(resetSchema),
  });
  const navigate = useNavigate();
  const { api } = useFetch();
  const { state } = useLocation();
  const { showNotifications } = useNotify();
  const [otpModal, setOtpModal] = useState(false);

  const onSubmit = async () => {
    const {json, error} = await api<OtpResponse>(FetchMethod.POST, API.otp, {email: state?.email, type: OtpTypePost.FORGOT_PASSWORD});
    setOtpModal(true);
    if (error) {
      showNotifications('Cannot send OTP to your email', error, {type: "danger"});
    }
    else if(json?.success){
      showNotifications('An OTP sent to your email', 'A email message with a 6-digit verification code was just sent to your email', {type: "success"});
    }
  };

  async function resetPass(otp: string) {
    const data = getValues();
    const value = {
      email: state?.email,
      password: data[PASSWORD_FIELD],
      otp,
    };
    const { json, error } = await api<ResetPassResponse>(FetchMethod.POST, API.user.resetPass, value);

    if (error) {
      showNotifications(`Your action is unsuccessfully !`, error, {type: "danger"});
    }
    else if (json?.success) {
      showNotifications(
        'Your password has been reset !',
        `Now you can login in account: ${state?.email} with new password you have changed !`,
        {
          type: 'success',
        },
      );
      navigate(routes.login); // navigate to home page
    }
  }

  return (
    <div className="p-4 content__wrap">
      <div className="forget-pass-page">
        <div className="page-icon text-center">
          <FaKey style={{ fontSize: '40px' }} />
        </div>
        <h2 className="primary-color text-center">Change Password</h2>
        <Row>
          <Col>
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
              <div className="submit_btn d-flex justify-content-end">
                <button type="submit" className="btn btn-primary btn-block w-100 text-uppercase">
                  Submit
                </button>
              </div>
            </form>
          </Col>
        </Row>
        <div className={'modal__wrap'}>
          <OtpModal otpModal={otpModal} setOtpModal={setOtpModal} handleWithOtp={resetPass} />
        </div>
      </div>
    </div>
  );
}
