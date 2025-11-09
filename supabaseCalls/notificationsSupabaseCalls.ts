import { Pagination } from "../entities/pagination";
import { supabase } from "../supabase";
import { Notification, RawNotification, normalizeNotification } from "../compnents/feed/store/types";

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from("ui_notifications")
    .select(
      `
        id,
        created_at,
        is_seen,
        archived_at,

        notification_types:notification_type_id ( code ),

        sender:sender_id ( user_id, username:"UserName" ),

        notification_photo_like (
          photo_id,
          photo:photo_id ( id, label, photoFile )
        ),

        notification_photo_comment (
          photo_id,
          comment_id,
          photo:photo_id ( id, label, photoFile ),
          comment:comment_id ( id, content, user_id )
        ),

        notification_photo_upload (
          photo_id,
          photo:photo_id ( id, label, photoFile )
        ),
        notification_follow ( notification_id )
      `
    )
    .eq("recipient_id", userId)
    .eq("is_seen", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("something went wrong with notifications", error);
    return [];
  }
  return data;
}

export async function getNotificationsCount(userId: string) {
  const { count, error } = await supabase
    .from("ui_notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_seen", false);

  if (error) {
    console.log("Error fetching notification count:", error);
    return 0;
  }

  return count || 0;
}

export async function fetchNotificationsPageOffset(params: {
  userId: string;
  pagination: Pagination; // page/ipp/sort
}) {
  const { userId, pagination } = params;

  const { data, error } = await supabase
    .from("ui_notifications")
    .select(`
      id,
      created_at,
      is_seen,
      archived_at,

      notification_types:notification_type_id ( code ),
      sender:sender_id ( user_id, username:"UserName" ),

      notification_photo_like (
        photo_id,
        photo:photo_id ( id, label, photoFile )
      ),
      notification_photo_comment (
        photo_id,
        comment_id,
        photo:photo_id ( id, label, photoFile ),
        comment:comment_id ( id, content, user_id )
      ),
      notification_photo_upload (
        photo_id,
        photo:photo_id ( id, label, photoFile )
      ),
      notification_follow ( notification_id )
    `)
    .eq("recipient_id", userId)
    .eq("is_seen", false)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(pagination.from(), pagination.to());

  if (error) throw error;

  const raw = (data ?? []) as RawNotification[];
  const items = raw.map(normalizeNotification);

  const hasMore = items.length === pagination.ipp;
  return { items, hasMore };
}

export async function markAllNotificationsSeen(userId: string) {
  const { error } = await supabase
    .from("ui_notifications")
    .update({ is_seen: true })
    .eq("recipient_id", userId)
    .eq("is_seen", false);

  if (error) throw error;
}

export async function markNotificationSeen(notificationId: number) {
  const { error } = await supabase
    .from("ui_notifications")
    .update({ is_seen: true })
    .eq("id", notificationId)
    .eq("is_seen", false);

  if (error) throw error;
}