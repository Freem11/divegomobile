import { supabase } from "../supabase";

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
