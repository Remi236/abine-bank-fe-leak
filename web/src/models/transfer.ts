import * as yup from "yup";
import {PayerType, TransferType} from "~/models/transaction";
import React from "react";

export type TransferFeePayerType =  PayerType.SENDER | PayerType.RECIPIENT;
export type TransferPaymentType =  TransferType.TRANSFER | TransferType.PAID_OFF;

export type TransferResponse = {
  success: boolean,
}

export interface IInternalTransferForm {
  recipientNumber: string;
  amount: number;
  content: string;
  type: TransferPaymentType;
  feePayer: TransferFeePayerType,
}

export const internalTransferSchema = yup
  .object()
  .shape({
    recipientNumber: yup.string().required(),
    amount: yup.number().required(),
    type: yup.string().required(),
    feePayer: yup.string().required(),

  })
  .required();

export interface IExternalTransferForm extends IInternalTransferForm{
  recipientBankId: number;
}

export const externalTransferSchema = yup
  .object()
  .shape({
    recipientNumber: yup.string().required(),
    amount: yup.number().required(),
    type: yup.string().required(),
    feePayer: yup.string().required(),
    recipientBankId: yup.number().required(),
  })
  .required();

export interface SubscribeRecipientModal {
  recipientNo: string;
  openState: boolean,
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>,
  redirectTo: string,
}

export interface ITopUpForm {
  username: string;
  number: string;
  amount: number;
}
export const topUpSchema = yup
  .object()
  .shape({
    username: yup.string().nullable().test("oneOfRequired", "Username or Number is required",  (value, context) => context.parent.username ||  context.parent.number),
    number: yup.string().nullable().test("oneOfRequired", "Username or Number is required",  (value, context) => context.parent.username ||  context.parent.number),
    amount: yup.number().required().min(50000),
  })
  .required();
