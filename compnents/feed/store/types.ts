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
  photo: Photo[];
}

export interface NotificationPhotoComment {
  photo_id: number;
  comment_id: number;
  photo: Photo[];
  comment: { id: number; content: string; user_id: string }[];
}

export interface NotificationPhotoUpload {
  photo_id: number;
  photo: Photo[];
}

export interface Notification {
  id: number;
  created_at: string;
  is_seen: boolean;
  archived_at: string | null;
  notification_types: NotificationTypes;
  sender: Sender;
  notification_photo_like: NotificationPhotoLike[];
  notification_photo_comment: NotificationPhotoComment[];
  notification_photo_upload: NotificationPhotoUpload[];
  notification_follow: { notification_id: number }[];
}

