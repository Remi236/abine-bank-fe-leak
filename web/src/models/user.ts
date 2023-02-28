import {
  CURRENT_PASSWORD_FIELD,
  EMAIL_FIELD,
  PASSWORD_CONFIRM_FIELD,
  PASSWORD_FIELD,
  PHONE_REGEX
} from "~/constants/input";
// import {Get} from "shared";
import * as yup from "yup";
import {Get} from "shared";
import React from "react";
import {Recipient} from "~/models/customers";

export type ProfileUpdateForm = {
  [CURRENT_PASSWORD_FIELD]: string;
  [PASSWORD_FIELD]: string;
  [PASSWORD_CONFIRM_FIELD]: string;
  name: string;
  [EMAIL_FIELD]: string;
}

export const profileUpdateSchema = yup
  .object()
  .shape({
    [EMAIL_FIELD]: yup.string().email().required(),
    name: yup.string().required(),
    [CURRENT_PASSWORD_FIELD]: yup.string().required(),
    [PASSWORD_FIELD]: yup.string()
      .required("Password is required")
      .min(4, "Password length should be at least 4 characters"),
    [PASSWORD_CONFIRM_FIELD]: yup.string()
      .required("Confirm Password is required")
      .min(4, "Password length should be at least 4 characters")
      .oneOf([yup.ref(PASSWORD_FIELD)], "Password does not match"),
  })
  .required();


export type ICreateUserForm = {
  fullname: string;
  phone: string;
  [EMAIL_FIELD]: string;
  [PASSWORD_FIELD]: string;
  username: string;
}

export const createUserSchema = yup
  .object()
  .shape({
    [EMAIL_FIELD]: yup.string().email().required(),
    fullname: yup.string().required(),
    username: yup.string().required(),
    phone: yup.string().required().matches(PHONE_REGEX, {message: "Phone is invalid"}),
    [PASSWORD_FIELD]: yup.string()
      .required("Password is required")
      .min(4, "Password length should be at least 4 characters"),

  })
  .required();

export type User = Pick<Get['User'] & {[PASSWORD_FIELD]?: string;},
  'id' | 'fullname' | 'email'| 'username' | 'phone' | 'password'>;

export interface IEmployeeModalManagement {
  data?: User;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitModal?: (data: User) => void;
  handleSubmitDelModal?: () => void;
}

export const employeeSchema = yup
  .object()
  .shape({
    id: yup.number(),
    [EMAIL_FIELD]: yup.string().email().required(),
    fullname: yup.string().required(),
    username: yup.string().required(),
    password: yup.string().required().min(4, "Password length should be at least 4 characters"),
    phone: yup.string().required().matches(PHONE_REGEX, {message: "Phone is invalid"}),
  })
  .required();
