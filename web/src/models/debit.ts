import {Get} from "shared";
import React from "react";
import * as yup from "yup";

export type Debt = Partial<Pick<Get['Debt'], keyof (Get['Debt']) > & IDebtForm> & {id?: number};
export type IDebtForm = {
  debtorNumber: string,
  debtorBankId: number,
};

export interface IDebitModalManagement {
  data? : Debt;
  setRows?: React.Dispatch<React.SetStateAction<Debt[]>>;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitModal?: (data: Debt) => void;
  handleSubmitDelModal?: () => void;
}
export const debitSchema = yup
  .object()
  .shape({
    debtorNumber: yup.string().required(),
    debtorBankId: yup.number().required(),
    amount: yup.number().required(),
  })
  .required();
