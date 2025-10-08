import React, { createContext, useState } from "react";
import { Notification } from "../feed/store/types";

// export type NotificationCode =
//   | "photo_comment"
//   | "photo_like"
//   | "photo_upload"
//   | "follow";

// export interface Sender {
//   user_id: string;
//   username: string;
// }

// export interface NotificationFollow {
//   follower_id: string;
//   followed_at: string;
// }

// export interface NotificationPhotoComment {
//   photo_id: number;
//   comment_id: number;
//   text?: string;
//   created_at: string;
// }

// export interface NotificationPhotoLike {
//   photo_id: number;
//   liked_at: string;
// }

// export interface NotificationPhotoUpload {
//   photo_id: number;
//   uploaded_at: string;
//   url?: string;
// }

// export interface Notification {
//   id: number;
//   created_at: string;
//   archived_at: string | null;
//   is_seen: boolean;
//   notification_follow: NotificationFollow[];
//   notification_photo_comment: NotificationPhotoComment[];
//   notification_photo_like: NotificationPhotoLike[];
//   notification_photo_upload: NotificationPhotoUpload[];
//   notification_types: { code: NotificationCode };
//   sender: Sender;
// }

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
