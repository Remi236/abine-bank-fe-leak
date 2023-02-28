import * as yup from "yup";
import {Dispatch, SetStateAction} from "react";


export type OtpProp = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
};

export enum OtpTypePost {
  TRANSFER = "TRANSFER",
  PAID_OFF = "PAID_OFF",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export type OtpType = {
  otp: string;
}

export type OtpResponse = {
  success: boolean,
}

export type OtpModalType = {
  otpModal: boolean;
  setOtpModal: Dispatch<SetStateAction<boolean>>;
  handleWithOtp: (otp: string) => void,
}

export type IOtpForm = {
  otp: string;
}

export const otpSchema = yup
  .object()
  .shape({
    otp: yup.string().required(),
  })
  .required();
