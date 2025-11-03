import { create } from "zustand";
import type { Notification } from "./types";
import { PagedCollection } from "../../../entities/pagedCollection";
import { Pagination } from "../../../entities/pagination";
import {
  fetchNotificationsPageOffset,
  getNotificationsCount,
  markAllNotificationsSeen,
  markNotificationSeen,
} from "../../../supabaseCalls/notificationsSupabaseCalls";

interface NotifState {
  userId: string | null;
  count: number;
  list: PagedCollection<Notification>;
  init: (userId: string) => Promise<void>;
  refreshCount: () => Promise<void>;
  loadFirst: () => Promise<void>;
  loadMore: () => Promise<void>;
  markOneSeen: (id: number) => Promise<void>;
  reset: () => void;
}

export const useNotificationsStore = create<NotifState>((set, get) => ({
  userId: null,
  count: 0,
  list: new PagedCollection<Notification>({
    items: [],
    hasMore: true,
    isLoading: false,
    pagination: new Pagination({ page: 1, sort: "desc" }),
  }),

  async init(userId) {
    set({ userId });
    await Promise.all([get().refreshCount(), get().loadFirst()]);
  },

  async refreshCount() {
    const { userId } = get();
    if (!userId) return;
    const count = await getNotificationsCount(userId);
    set({ count });
  },

  async loadFirst() {
    const { userId } = get();
    if (!userId) return;
    const pagination = new Pagination({ page: 1, sort: "desc" });
    set((s) => ({ list: { ...s.list, isLoading: true, pagination } }));

    try {
      const { items, hasMore } = await fetchNotificationsPageOffset({
        userId,
        pagination,
      });
      set((s) => ({
        list: PagedCollection.updateItems(
          { ...s.list, isLoading: false, hasMore },
          items,
          true,
          pagination
        ),
      }));
    } catch {
      set((s) => ({ list: { ...s.list, isLoading: false } }));
    }
  },

 async loadMore() {
    const { userId, list } = get();
    if (!userId || list.isLoading || !list.hasMore) return;
    const pagination = list.pagination.next();
    set((s) => ({ list: { ...s.list, isLoading: true, pagination } }));

    try {
      const { items, hasMore } = await fetchNotificationsPageOffset({
        userId,
        pagination,
      });
      set((s) => ({
        list: PagedCollection.updateItems(
          { ...s.list, isLoading: false, hasMore },
          items,
          false,
          pagination
        ),
      }));
    } catch {
      set((s) => ({ list: { ...s.list, isLoading: false } }));
    }
  },


  reset() {
    set({
      count: 0,
      list: new PagedCollection<Notification>({
        items: [],
        hasMore: true,
        isLoading: false,
        pagination: new Pagination({
          page: 1,
          sort: "desc",
          ipp: Pagination.defaultIpp,
        }),
      }),
    });
  },

  async markAllSeen() {
    const { userId } = get();
    if (!userId) return;
    set((s) => ({
      count: 0,
      list: new PagedCollection<Notification>({
        ...s.list,
        items: (s.list.items ?? []).map((n) =>
          n.is_seen ? n : { ...n, is_seen: true }
        ),
      }),
    }));

    try {
      await markAllNotificationsSeen(userId);
    } catch (e) {
      console.warn("markAllSeen failed", e);
    }
  },

  async reload(reset = true) {
    const { userId, list } = get();
    if (!userId) return;

    const pagination = reset
      ? new Pagination({
        page: 1,
        sort: list.pagination.sort,
        ipp: list.pagination.ipp,
    })
      : list.pagination;

    set({ list: { ...list, isLoading: true, pagination } });
    const { items, hasMore } = await fetchNotificationsPageOffset({
      userId,
      pagination,
    });

    set({
      list: new PagedCollection({
        ...list,
        items,
        hasMore,
        isLoading: false,
        pagination,
      }),
    });
  },

  async markOneSeen(id) {
    const { list, count } = get();

    set({
      count: Math.max(0, count - 1),
      list: new PagedCollection({
        ...list,
        items:
          list.items?.map((n) =>
            n.id === id ? { ...n, is_seen: true } : n
          ) ?? [],
      }),
    });

    try {
      await markNotificationSeen(id);
    } catch (e) {
      console.warn("markOneSeen error", e);
    }
  },
}));
