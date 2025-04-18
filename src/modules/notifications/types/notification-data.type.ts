export type NotificationType = 'comment' | 'like' | 'system';

export interface CommentNotificationData {
  articleId: string;
  commentId: string;
  message?: string;
}

export interface LikeNotificationData {
  articleId: string;
  likerId: string;
}

export interface SystemNotificationData {
  title: string;
  content: string;
}

export type NotificationDataMap = {
  comment: CommentNotificationData;
  like: LikeNotificationData;
  system: SystemNotificationData;
};
