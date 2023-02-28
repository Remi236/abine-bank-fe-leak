import React from 'react';
import * as yup from 'yup';
import { Get } from 'shared';

// Recipients
export type Recipient = Pick<Get['Recipient']  & {id: number},
  'id' | 'recipientId' | 'nickname' | 'number' | 'bankId' | 'bankCode' | 'fullname' | 'bankName'>;

export enum ActionTypeEnum {
  ADD,
  EDIT,
  DELETE,
}

export type CLoseResponse = {
  isClosed: boolean,
}

export interface IRecipientModalManagement {
  data?:  Recipient;
  openState: boolean;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitModal?: (data: Recipient) => void;
  handleSubmitDelModal?: () => void;
}

export const recipientSchema = yup
  .object()
  .shape({
    number: yup.string().required(),
  })
  .required();


export type CustomerType = {
  accountNumber: string;
  bankId: number;
  bankName: string;
  fullname: string;
}
