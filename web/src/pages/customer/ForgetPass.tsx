import {Col, Row} from 'react-bootstrap';
import '~/styles/ForgetPass.scss';
import {useForm} from "react-hook-form";
import {FetchMethod, forgetSchema, IForgetForm} from "~/models";
import {yupResolver} from "@hookform/resolvers/yup";
import {useFetch} from "~/hooks";
import {API, EMAIL_FIELD, EMAIL_REGEX} from "~/constants";
import {routes} from "~/Routes";
import {useNotify} from "~/hooks/useNotify";
import {OtpResponse, OtpTypePost} from "~/models/otp";
import {useNavigate} from "react-router-dom";

export function ForgetPass() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgetForm>({
    resolver: yupResolver(forgetSchema),
  });
  const { api } = useFetch();
  const navigate = useNavigate();
  const { showNotifications } = useNotify();

  const onSubmit = async (dto: IForgetForm) => {
    const {json, error} = await api<OtpResponse>(FetchMethod.POST,  API.otp, {email: dto.email, type: OtpTypePost.FORGOT_PASSWORD});
    if(json?.success) {
      showNotifications('OTP has been sent to your email!', `A email message with a 6-digit verification code was just sent to ${dto.email}`, {
        type: 'success',
      });
      navigate(
        routes.resetPass,
        {
          state: {
            email: dto.email,
          }
        }
      )
    }
    else {
      showNotifications('OTP has not been sent to your email!', error,{
        type: 'danger',
      });
    }
  };

  return (
    <div className="p-4 content__wrap">
      <div className="forget-pass-page">
        <h2 className="primary-color text-center">Forgot Password</h2>
        <Row>
          <Col>
            <form className="form-forgot-pass" onSubmit={handleSubmit(onSubmit)}>
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
              <div className="submit_btn d-flex justify-content-end">
                <button type="submit" className="btn btn-primary btn-block w-100 text-uppercase">
                  Send to my email
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </div>
    </div>
  );
}
