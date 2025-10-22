export enum FEED_ITEM_TYPE {
  FAILED_UPLOAD = "failed_upload",
  FAILED_SYNC = "failed_sync",
  NOTIFICATION = "notification",
}

export enum RETRY_TYPE {
  PIC_UPLOADER = "pic_uploader",
}

export type PicUploaderRetryPayload = [
  {
    localPreviewUri: string;
  },
  {
    photoFile: string | null;
    label: string;
    dateTaken: string;
    latitude: string;
    longitude: string;
    UserId: string;
  }
];

export interface RetryMetaData<T = any> {
  payloadType: RETRY_TYPE;
  payloads: T;
}

export type FeedItemType = (typeof FEED_ITEM_TYPE)[keyof typeof FEED_ITEM_TYPE];

export interface BaseFeedItem {
  id: string;
  timestamp: number;
  type: FeedItemType;
  title: string;
  message: string;
}

export interface FailedUploadFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.FAILED_UPLOAD;
  imageUri: string;
  retryMetaData: RetryMetaData<PicUploaderRetryPayload>;
}

export interface FailedSyncFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.FAILED_SYNC;
  reason: string;
  retryCallback: () => Promise<void>;
}

export interface NotificationFeedItem extends BaseFeedItem {
  type: typeof FEED_ITEM_TYPE.NOTIFICATION;
  icon?: string;
  action?: () => void;
}

export enum FEED_SCREEN {
  FEED_MESSAGES = "feedMessages",
  NOTIFICATIONS = "notifications",
}

export type FeedItem =
  | FailedUploadFeedItem
  | FailedSyncFeedItem
  | NotificationFeedItem;

// export type NotificationCode =
//   | "photo_comment"
//   | "photo_like"
//   | "photo_upload"
//   | "follow";

// export interface Photo {
//   id: number;
//   label: string | null;
//   photoFile: string | null;
// }

// export interface Sender {
//   user_id: string;
//   username: string;
// }

// export interface NotificationTypes {
//   code: NotificationCode;
// }

// export interface NotificationPhotoLike {
//   photo_id: number;
//   photo: Photo[];
// }

// export interface NotificationPhotoComment {
//   photo_id: number;
//   comment_id: number;
//   photo: Photo[];
//   comment: { id: number; content: string; user_id: string }[];
// }

// export interface NotificationPhotoUpload {
//   photo_id: number;
//   photo: Photo[];
// }

// export interface Notification {
//   id: number;
//   created_at: string;
//   is_seen: boolean;
//   archived_at: string | null;
//   notification_types: NotificationTypes;
//   sender: Sender;
//   notification_photo_like: NotificationPhotoLike[];
//   notification_photo_comment: NotificationPhotoComment[];
//   notification_photo_upload: NotificationPhotoUpload[];
//   notification_follow: { notification_id: number }[];
// }

// export type NotificationCode =
//   | "photo_comment"
//   | "photo_like"
//   | "photo_upload"
//   | "follow";

// export interface Photo {
//   id: number;
//   label: string | null;
//   photoFile: string | null;
// }

// export interface Sender {
//   user_id: string;
//   username: string;
// }

// export interface NotificationTypes {
//   code: NotificationCode;
// }

// export interface NotificationPhotoLike {
//   photo_id: number;
//   photo: Photo | null; // НЕ массив
// }

// export interface NotificationPhotoComment {
//   photo_id: number;
//   comment_id: number;
//   photo: Photo | null;   // НЕ массив
//   comment: { id: number; content: string; user_id: string } | null; // НЕ массив
// }

// export interface NotificationPhotoUpload {
//   photo_id: number;
//   photo: Photo | null; // НЕ массив
// }

// export interface NotificationFollow {
//   notification_id: number;
// }

// // Главное: вложенные сущности — опциональные и могут быть null
// export interface Notification {
//   id: number;
//   created_at: string;
//   is_seen: boolean;
//   archived_at: string | null;

//   notification_types: NotificationTypes | null;
//   sender: Sender | null;

//   notification_photo_like?: NotificationPhotoLike | null;
//   notification_photo_comment?: NotificationPhotoComment | null;
//   notification_photo_upload?: NotificationPhotoUpload | null;
//   notification_follow?: NotificationFollow | null;
// }

export type NotificationCode =
  | "photo_comment"
  | "photo_like"
  | "photo_upload"
  | "follow";

export interface Photo {
  id: number;
  label: string | null;
  photoFile: string | null;
}

export interface Sender {
  user_id: string;
  username: string;
}

export interface NotificationTypes {
  code: NotificationCode;
}

export interface NotificationPhotoLike {
  photo_id: number;
  photo: Photo | null;
}

export interface NotificationPhotoComment {
  photo_id: number;
  comment_id: number;
  photo: Photo | null;
  comment: { id: number; content: string; user_id: string } | null;
}

export interface NotificationPhotoUpload {
  photo_id: number;
  photo: Photo | null;
}

export interface NotificationFollow {
  notification_id: number;
}

export interface Notification {
  id: number;
  created_at: string;
  is_seen: boolean;
  archived_at: string | null;

  notification_types: NotificationTypes | null;
  sender: Sender | null;

  notification_photo_like?: NotificationPhotoLike | null;
  notification_photo_comment?: NotificationPhotoComment | null;
  notification_photo_upload?: NotificationPhotoUpload | null;
  notification_follow?: NotificationFollow | null;
}

type OneOrMany<T> = T | T[] | null | undefined;

export interface RawNotification {
  id: number;
  created_at: string;
  is_seen: boolean;
  archived_at: string | null;

  notification_types: OneOrMany<NotificationTypes>;
  sender: OneOrMany<Sender>;

  notification_photo_like?: OneOrMany<{
    photo_id: number;
    photo: OneOrMany<Photo>;
  }>;

  notification_photo_comment?: OneOrMany<{
    photo_id: number;
    comment_id: number;
    photo: OneOrMany<Photo>;
    comment: OneOrMany<{ id: number; content: string; user_id: string }>;
  }>;

  notification_photo_upload?: OneOrMany<{
    photo_id: number;
    photo: OneOrMany<Photo>;
  }>;

  notification_follow?: OneOrMany<{ notification_id: number }>;
}

const firstOrNull = <T>(v: OneOrMany<T>): T | null => {
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
};

export function normalizeNotification(r: RawNotification): Notification {
  const likeRaw = firstOrNull(r.notification_photo_like);
  const commentRaw = firstOrNull(r.notification_photo_comment);
  const uploadRaw = firstOrNull(r.notification_photo_upload);
  const followRaw = firstOrNull(r.notification_follow);

  return {
    id: r.id,
    created_at: r.created_at,
    is_seen: r.is_seen,
    archived_at: r.archived_at,

    notification_types: firstOrNull(r.notification_types),
    sender: firstOrNull(r.sender),

    notification_photo_like: likeRaw
      ? {
        photo_id: likeRaw.photo_id,
        photo: firstOrNull(likeRaw.photo),
      }
      : null,

    notification_photo_comment: commentRaw
      ? {
        photo_id: commentRaw.photo_id,
        comment_id: commentRaw.comment_id,
        photo: firstOrNull(commentRaw.photo),
        comment: firstOrNull(commentRaw.comment),
      }
      : null,

    notification_photo_upload: uploadRaw
      ? {
        photo_id: uploadRaw.photo_id,
        photo: firstOrNull(uploadRaw.photo),
      }
      : null,

    notification_follow: followRaw
      ? { notification_id: followRaw.notification_id }
      : null,
  };
}
