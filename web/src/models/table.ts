import {Dispatch, FunctionComponent, ReactNode, SetStateAction} from "react";
import {FetchMethod, FetchReturns} from "~/models/fetch";
import {iNotification} from "react-notifications-component/dist/src/typings";

export type TableType <T extends { id?: number }> =
  {
    data: T[];
    setRows:  Dispatch<SetStateAction<T[]>>;
    api: (
      method: FetchMethod,
      route: string,
      data?: T
    ) => Promise<FetchReturns<T>>,
    addRoute: string;
    editRoute: string;
    delRoute: string;
    showNotifications: (
      title: (ReactNode | FunctionComponent),
      message: (ReactNode | FunctionComponent),
      option?: Partial<iNotification>) => void
  }
