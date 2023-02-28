import {EMAIL_FIELD, PASSWORD_CONFIRM_FIELD, PASSWORD_FIELD, RECAPTCHA} from '~/constants';
import * as yup from 'yup';

export type State = {
  error: string | null;
};

export type Tokens = {
  access_token: string | null;
  refresh_token: string | null;
};

// Don't remove this, or we have to refactoring lots of code
export type AuthState = Tokens;

export interface ICaptchaAuthForm {
  [EMAIL_FIELD]: string;
  [PASSWORD_FIELD]: string;
  [RECAPTCHA]: string;
}

export const captchaAuthSchema = yup
  .object()
  .shape({
    [EMAIL_FIELD]: yup.string().email().required(),
    [PASSWORD_FIELD]: yup.string().required(),
    [RECAPTCHA]: yup.string().required(),
  })
  .required();

export interface IAuthForm {
  [EMAIL_FIELD]: string;
  [PASSWORD_FIELD]: string;
}

export const authSchema = yup
  .object()
  .shape({
    [EMAIL_FIELD]: yup.string().email().required(),
    [PASSWORD_FIELD]: yup.string().required(),
  })
  .required();

export interface IForgetForm {
  [EMAIL_FIELD]: string;
}

export const forgetSchema = yup
  .object()
  .shape({
    [EMAIL_FIELD]: yup.string().email().required(),
  })
  .required();

export interface IResetForm {
  [PASSWORD_FIELD]: string;
  [PASSWORD_CONFIRM_FIELD]: string;
  otp: string;
}

export const resetSchema = yup
  .object()
  .shape({
    [PASSWORD_FIELD]: yup.string()
      .required("Password is required")
      .min(4, "Password length should be at least 4 characters"),
    [PASSWORD_CONFIRM_FIELD]: yup.string()
      .required("Confirm Password is required")
      .min(4, "Password length should be at least 4 characters")
      .oneOf([yup.ref(PASSWORD_FIELD)], "Password does not match"),
    otp: yup.string().required(),
  })
  .required();

export type ResetPassResponse = {
  success: boolean,
}
