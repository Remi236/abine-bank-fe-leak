import {Get} from "shared";
import React from "react";
import * as yup from "yup";


export interface IDetailTransactionModal {
  data?: Get['Transaction'];
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
}

export enum TransferType {
  TRANSFER = "TRANSFER",
  PAID_OFF = "PAID_OFF",

}
export enum PayerType {
  SENDER = "SENDER",
  RECIPIENT = "RECIPIENT",
}


export interface ITransactionReportDateRange {
  startDate: Date;
  endDate: Date;
}

export const transactionReportDateRangeSchema = yup
  .object()
  .shape({
    startDate: yup.date().default(() => new Date()),
    endDate: yup
      .date()
      .when(
        "startDate",
        (startDate, schema) => startDate && schema.min(startDate)),
  })
  .required();

