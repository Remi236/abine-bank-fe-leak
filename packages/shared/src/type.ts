import { Prisma, Role } from '@prisma/client';

export interface IJwtPayload {
  id: number;
  email: string;
  role: Role;
  fullname: string;
  accountId?: number;
  accountNumber?: string;
}

export type GetAccount = Prisma.AccountGetPayload<{ select: { number: true; bankId: true } }> & { bankName: string };
export type GetUser = Prisma.UserGetPayload<{ select: { fullname: true } }>;
export type Transaction = Prisma.TransactionGetPayload<{
  select: {
    id: true;
    recipientId: true;
    senderId: true;
    type: true;
    amount: true;
    content: true;
    feePayer: true;
    SenderAccount: {
      select: {
        Customer: { select: { User: { select: { fullname: true } } } };
        number: true;
        Bank: { select: { id: true; name: true; bankCode: true } };
      };
    };
    RecipientAccount: {
      select: {
        Customer: { select: { User: { select: { fullname: true } } } };
        number: true;
        Bank: { select: { id: true; name: true; bankCode: true } };
      };
    };
    createdAt: true;
  };
}>;

export type Get = {
  Recipient:
  | Prisma.SavedRecipientGetPayload<{ select: { nickname: true; recipientId: true } }> &
  Prisma.BankGetPayload<{ select: { bankCode: true } }> &
  GetAccount &
  GetUser;

  RecipientTransaction: Prisma.TransactionGetPayload<{ select: { recipientId: true } }> & GetAccount & GetUser;

  Transaction: Transaction;
  ReportTransaction: { totalAmount: number; transactions: Transaction[] };

  User: Prisma.UserGetPayload<{ select: { id: true, fullname: true; email: true; phone: true; username: true } }>;

  Customer: Prisma.CustomerGetPayload<{
    select: { Account: { select: { id: true; number: true; paymentNumber: true } } };
  }> & { Account: { balance: number | undefined } };

  Bank: Prisma.BankGetPayload<{ select: { id: true; bankCode: true; name: true } }>;
  Debt: Prisma.CreditorDebtorGetPayload<{
    select: {
      creditorDebtorId: true;
      CreditorAccount: {
        select: { number: true; bankId: true; Customer: { select: { User: { select: { fullname: true } } } } };
      };
      DebtorAccount: {
        select: { number: true; bankId: true; Customer: { select: { User: { select: { fullname: true } } } } };
      };
      amount: true;
      content: true;
      status: true;
      createdAt: true;
      updatedAt: true;
    };
  }>;
};

export type Post = {
  Recipient: Get['Recipient'];
};
