import React, { createContext, useState } from "react";
import { Notification } from "../feed/store/types";

type NotificationsFeedContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export const NotificationsFeedContext =
  createContext<NotificationsFeedContextType>(
    {} as NotificationsFeedContextType
  );

const NotificationsFeedContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  return (
    <NotificationsFeedContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsFeedContext.Provider>
  );
};

export default NotificationsFeedContextProvider;
