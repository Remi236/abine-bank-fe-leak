import { Get } from 'shared';

export const addRowToTable = <T>(value: T, data: T[]) => [...data, value];

export const editRowOnTable = <T extends { id?: number }>(value: T, data: T[]) =>
  data.map((item) => (item.id === value.id ? value : item));

export const delRowFromTable = <T extends { id?: number }>(value: T, data: T[]) =>
  data.filter((item) => item.id !== value.id);

export const mapTableRowRecipients = (data: Get['Recipient'][]) =>
  data.map((item) => ({ ...item, id: item.recipientId }));

export const mapTableRowDebtors = (data: Get['Debt'][]) =>
  data.map((item) => ({
    ...item,
    id: item.creditorDebtorId,
    debtorNumber: item.DebtorAccount.number,
    debtorBankId: item.DebtorAccount.bankId,
  }));
