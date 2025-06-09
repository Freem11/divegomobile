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
