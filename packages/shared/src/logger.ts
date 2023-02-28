import { LOG_STATUS } from './constants';

export const log = {
  info: (...msg: any[]) => console.log(LOG_STATUS.INFO, ...msg),
  error: (...msg: any[]) => console.log(LOG_STATUS.ERROR, ...msg),
  warn: (...msg: any[]) => console.log(LOG_STATUS.WARNING, ...msg),
  success: (...msg: any[]) => console.log(LOG_STATUS.SUCCESS, ...msg),
  emoji: (e: string, ...msg: any[]) => console.log(e, ...msg),
};
