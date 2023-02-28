import { Store } from 'react-notifications-component';
import React from 'react';
import {
  iNotification,
  NOTIFICATION_CONTAINER,
  NOTIFICATION_INSERTION,
  NOTIFICATION_TYPE,
} from 'react-notifications-component/dist/src/typings';

import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillInfoCircle,
  AiOutlineWarning,
} from 'react-icons/ai';

export const useNotify = () => {
  const configOptions: iNotification = {
    container: 'bottom-right' as NOTIFICATION_CONTAINER,
    type: 'info' as NOTIFICATION_TYPE,
    insert: 'top' as NOTIFICATION_INSERTION,
    animationIn: ['animate__animated', 'animate__fadeInUp'],
    animationOut: ['animate__animated', 'animate__fadeOutDown'],
    dismiss: {
      duration: 5000,
      onScreen: true,
      pauseOnHover: true,
      showIcon: true,
    },
  };

  const showNotifications = (
    title: string | React.ReactNode | React.FunctionComponent,
    message: string | React.ReactNode | React.FunctionComponent,
    option: Partial<iNotification> = configOptions
  ) => {
    switch (option.type) {
      case 'success':
        option.title = (
          <>
            <AiFillCheckCircle className={'me-1'} /> {title}
          </>
        );
        break;
      case 'danger':
        option.title = (
          <>
            <AiFillCloseCircle className={'me-1'} /> {title}
          </>
        );
        break;
      case 'info':
        option.title = (
          <>
            <AiFillInfoCircle className={'me-1'} /> {title}
          </>
        );
        break;
      case 'warning':
        option.title = (
          <>
            <AiOutlineWarning className={'me-1'} /> {title}
          </>
        );
        break;
      default:
        break;
    }
    Store.addNotification({
      title,
      message,
      ...configOptions,
      ...option,
    });
  };

  return { showNotifications };
};
