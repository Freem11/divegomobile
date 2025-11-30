import { useEffect } from "react";

import { supabase } from "../../../supabase";

import { useNotificationsStore } from "./useNotificationsStore";

export function useNotificationsRealTime(userId?: string | null) {
  const refreshCount = useNotificationsStore((s) => s.refreshCount);
  const reload = useNotificationsStore((s) =>(s.reload));

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ui_notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          refreshCount();
          reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshCount, reload]);
}
