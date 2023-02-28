import {PayerType, TransferType} from "~/models/transaction";

export const TRANSACTION_HEADER_COLUMNS = [
  "No.",
  "Amount",
  "From",
  "To",
  "FeePayer Type",
  "Type",
  "Created At",
  "View Detail",
];
export const TRANSACTION_REPORT_HEADER_COLUMNS = [
  "No.",
  "Amount",
  "From",
  "To",
  "FeePayer Type",
  "Type",
  "Created At",
];
export const TRANSACTION_SAVED_RECIPIENTS_COLUMNS = [
  "No.",
  "Account Number",
  "Bank",
  "Full Name",
]
export const TRANSACTION_SAVED_DEBTORS_COLUMNS = [
  "No.",
  "Account Number",
  "Bank",
]
export const TRANSFER_TYPES = [TransferType.TRANSFER, TransferType.PAID_OFF];
export const PAYER_TYPES = [PayerType.SENDER, PayerType.RECIPIENT];
export const INTERNAL_BANK = 1;

