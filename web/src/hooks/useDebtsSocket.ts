import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';
import { REGEX } from '~/constants';
import { useEffect, useRef } from 'react';
import { DEBTS_ACTION, Get, log } from 'shared';

const BASE_API = import.meta.env.VITE_BASE_API.replace(REGEX, '');
const BASE_SOCKET = BASE_API.substring(0, BASE_API.lastIndexOf('/'));

export const useDebtsSocket = ({
  onNew,
  onCancel,
  onPaidOff,
}: {
  onNew?: (creditorDebtor: Get['Debt']) => void;
  onCancel?: (creditorDebtorId: number) => void;
  onPaidOff?: (creditorDebtorId: number) => void;
} = {}) => {
  const { access_token, user } = useAuth();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(BASE_SOCKET + '/debts');
    return () => {
      socketRef.current?.disconnect();
      log.info('Socket disconnected');
    };
  }, []);

  // TODO(kendu): Call refresh token to renew access_token
  useEffect(() => {
    const { current } = socketRef;
    if (current == null) return;

    current.auth = { access_token };
    current.on('connect', () => {
      log.info('Socket connected');
    });

    current.on(DEBTS_ACTION.NEW, (creditorDebtor: Get['Debt']) => {
      onNew?.(creditorDebtor);
      log.info('New debt', creditorDebtor);
    });

    current.on(DEBTS_ACTION.CANCEL, (creditorDebtorId: number) => {
      onCancel?.(creditorDebtorId);
      log.info('Cancel debt', creditorDebtorId);
    });

    current.on(DEBTS_ACTION.PAID_OFF, (creditorDebtorId: number) => {
      onPaidOff?.(creditorDebtorId);
      log.info('Paid off debt', creditorDebtorId);
    });
  }, [access_token, onNew, onCancel, onPaidOff]);

  if (access_token == null || user?.role !== 'CUSTOMER') {
    return null;
  }

  return { socket: socketRef.current };
};
