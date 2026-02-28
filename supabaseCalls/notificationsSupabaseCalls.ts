import { Pagination } from "../entities/pagination";
import { supabase } from "../supabase";
import { RawNotification, normalizeNotification } from "../compnents/feed/store/types";

function getThirtyDaysAgoIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString();
}

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
          photo:photo_id ( id, label, photoFile, image_id )
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
    //.eq("is_seen", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("something went wrong with notifications", error);
    return [];
  }
  return data;
}

export async function getNotificationsCount(userId: string) {

  const thirtyDaysAgo = getThirtyDaysAgoIso();

  const { count, error } = await supabase
    .from("ui_notifications")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", userId)
    .eq("is_seen", false)
    .gte("created_at", thirtyDaysAgo);

  if (error) {
    console.log("Error fetching notification count:", error);
    return 0;
  }

  return count || 0;
}

export async function fetchNotificationsPageOffset(params: {
  userId: string;
  pagination: Pagination;
}) {
  const thirtyDaysAgo = getThirtyDaysAgoIso();
  const { userId, pagination } = params;

  const { data, error } = await supabase
    .from("ui_notifications")
    .select(`
      id,
      created_at,
      is_seen,
      archived_at,

      notification_types:notification_type_id ( code ),
      sender:sender_id ( id, user_id, username:"UserName", profilePhoto ),

      notification_photo_like (
        photo_id,
        photo_path,
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
    //.eq("is_seen", false)
    .gte("created_at", thirtyDaysAgo)
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
    .update({ is_seen: true, seen_at: new Date().toISOString() })
    .eq("recipient_id", userId)
    .eq("is_seen", false);

  if (error) throw error;
}

export async function markNotificationSeen(notificationId: number) {
  const { error } = await supabase
    .from("ui_notifications")
    .update({ is_seen: true, seen_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("is_seen", false);

  if (error) throw error;
}

export async function getPhotoOwnerId(photoId: number): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("photos")
      .select("UserID")
      .eq("id", photoId)
      .single();

    if (error || !data) {
      console.warn("⚠️ Photo not found or Supabase error:", error?.message);
      return null;
    }

    return data.UserID;
  } catch (e) {
    console.error("❌ getPhotoOwnerId error:", e);
    return null;
  }
}


export async function createPhotoLikeNotification({
  senderId,
  recipientId,
  photoId,
  photoPath
}: {
  senderId: string;
  recipientId: string;
  photoId: number;
  photoPath?: string;
}) {
  try {
    if (!senderId || !recipientId || senderId === recipientId) {
      console.log("⚠️ Invalid sender or recipient, skipping notification");
      return;
    }
    const { data: existing} = await supabase
      .from("notification_photo_like")
      .select("id")
      .eq("photo_path", photoPath)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("ℹ️ Notification already exists, skip insert");
      return;
    }

    const { data: notif, error: notifErr } = await supabase
      .from("ui_notifications")
      .insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          notification_type_id: 1,
          is_seen: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (notifErr) {
      console.error("❌ createPhotoLikeNotification error:", notifErr.message);
      return;
    }

    const { error: linkErr } = await supabase
      .from("notification_photo_like")
      .insert([
        {
          notification_id: notif.id,
          photo_id: photoId,
          photo_path: photoPath,
        },
      ]);

    if (linkErr) {
      console.error("❌ notification_photo_like insert error:", linkErr.message);
    } else {
      console.log("✅ Notification created for photo", photoId);
    }
  } catch (err) {
    console.error("❌ createPhotoLikeNotification fatal error:", err);
  }
}

export async function deletePhotoLikeNotification({
  senderId,
  recipientId,
  photoId,
}: {
  senderId: string;
  recipientId: string;
  photoId: number;
}) {
  try {
    const { data, error } = await supabase
      .from("notification_photo_like")
      .select("notification_id, ui_notifications!inner(id)")
      .eq("photo_id", photoId);

    if (error) {
      console.error("❌ deletePhotoLikeNotification query error:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No notification found for this photo like");
      return;
    }

    const notifId = data[0].notification_id;

    await supabase.from("notification_photo_like").delete().eq("photo_id", photoId);
    await supabase.from("ui_notifications").delete().eq("id", notifId);

    console.log("🗑️ Notification deleted for photo", photoId);
  } catch (err) {
    console.error("❌ deletePhotoLikeNotification fatal error:", err);
  }
}

export async function createPhotoCommentNotification({
  senderId,
  recipientId,
  photoId,
  commentId,
}: {
  senderId: string;
  recipientId: string;
  photoId: number;
  commentId: number;
}) {
  try {
    if (!senderId || !recipientId || senderId === recipientId) {
      console.log("⚠️ Invalid sender or recipient, skipping comment notification");
      return;
    }

    const { data: existing, error: existingErr } = await supabase
      .from("notification_photo_comment")
      .select("id")
      .eq("comment_id", commentId)
      .limit(1);

    if (existingErr) {
      console.warn("⚠️ check existing comment notification error:", existingErr.message);
    }

    if (existing && existing.length > 0) {
      console.log("ℹ️ Comment notification already exists, skip insert");
      return;
    }

    const { data: notif, error: notifErr } = await supabase
      .from("ui_notifications")
      .insert([
        {
          sender_id: senderId,
          recipient_id: recipientId,
          notification_type_id: 2,
          is_seen: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (notifErr) {
      console.error("❌ createPhotoCommentNotification error:", notifErr.message);
      return;
    }

    const { error: linkErr } = await supabase
      .from("notification_photo_comment")
      .insert([
        {
          notification_id: notif.id,
          photo_id: photoId,
          comment_id: commentId,
        },
      ]);

    if (linkErr) {
      console.error(
        "❌ notification_photo_comment insert error:",
        linkErr.message
      );
    } else {
      console.log("✅ Comment notification created for photo", photoId);
    }
  } catch (err) {
    console.error("❌ createPhotoCommentNotification fatal error:", err);
  }
}

export async function deletePhotoCommentNotification({
  commentId,
}: {
  commentId: number;
}) {
  try {
    const { data, error } = await supabase
      .from("notification_photo_comment")
      .select("notification_id")
      .eq("comment_id", commentId)
      .limit(1);

    if (error) {
      console.error("❌ deletePhotoCommentNotification query error:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log("ℹ️ No comment notification found for this comment");
      return;
    }

    const notifId = data[0].notification_id;

    await supabase
      .from("notification_photo_comment")
      .delete()
      .eq("comment_id", commentId);

    await supabase.from("ui_notifications").delete().eq("id", notifId);

    console.log("🗑️ Comment notification deleted for comment", commentId);
  } catch (err) {
    console.error("❌ deletePhotoCommentNotification fatal error:", err);
  }
}