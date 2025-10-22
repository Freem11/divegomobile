import { create } from "zustand";
import type { Notification } from "./types";
//import { Pagination, PagedCollection } from "../../utils/pagination";
//import { fetchNotificationsPageOffset, fetchNotificationsCount } from "../../";
import { PagedCollection } from "../../../entities/pagedCollection";
import { Pagination } from "../../../entities/pagination";
import {
  fetchNotificationsPageOffset,
  getNotificationsCount,
} from "../../../supabaseCalls/notificationsSupabaseCalls";

interface NotifState {
  userId: string | null;
  count: number;
  list: PagedCollection<Notification>;

  init: (userId: string) => Promise<void>;
  loadFirst: () => Promise<void>;
  loadMore: () => Promise<void>;
  refreshCount: () => Promise<void>;
  markAllSeen: () => Promise<void>; // добавишь при необходимости
  reset: () => void;
}

export const useNotificationsStore = create<NotifState>((set, get) => ({
  userId: null,
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

  //   async loadFirst() {
  //     const { userId, list } = get();
  //     if (!userId) return;

  //     const pagination = new Pagination({ page: 1, sort: list.pagination.sort, ipp: list.pagination.ipp });

  //     set({ list: { ...list, isLoading: true, pagination } });

  //     const { items, hasMore } = await fetchNotificationsPageOffset({ userId, pagination });

  //     set((state) => PagedCollection.updateItems(
  //       { ...state.list, isLoading: false, hasMore },
  //       items,
  //       /* reset */ true,
  //       pagination
  //     ));
  //   },

  async loadFirst() {
    const { userId, list } = get();
    if (!userId) return;

    const pagination = new Pagination({
      page: 1,
      sort: list.pagination.sort,
      ipp: list.pagination.ipp,
    });

    // флаг загрузки
    set((state) => ({ list: { ...state.list, isLoading: true, pagination } }));

    const { items } = await fetchNotificationsPageOffset({
      userId,
      pagination,
    });

    // ВАЖНО: вернуть partial state — { list: ... }
    set((state) => ({
      list: PagedCollection.updateItems(
        { ...state.list, isLoading: false }, // prev: PagedCollection<T>
        items, // items: T[]
        /* reset */ true, // после первой страницы — reset
        pagination
      ),
    }));
  },

  //   async loadMore() {
  //     const { userId, list } = get();
  //     if (!userId || list.isLoading || !list.hasMore) return;

  //     const pagination = list.pagination.next();

  //     set({ list: { ...list, isLoading: true, pagination } });

  //     const { items, hasMore } = await fetchNotificationsPageOffset({
  //       userId,
  //       pagination,
  //     });

  //     set((state) =>
  //       PagedCollection.updateItems(
  //         { ...state.list, isLoading: false, hasMore },
  //         items,
  //         /* reset */ false,
  //         pagination
  //       )
  //     );
  //   },

  async loadMore() {
    const { userId, list } = get();
    if (!userId || list.isLoading || !list.hasMore) return;

    const pagination = list.pagination.next();

    set((state) => ({ list: { ...state.list, isLoading: true, pagination } }));

    const { items } = await fetchNotificationsPageOffset({
      userId,
      pagination,
    });

    set((state) => ({
      list: PagedCollection.updateItems(
        { ...state.list, isLoading: false }, // prev
        items,
        /* reset */ false, // при догрузке аппендим
        pagination
      ),
    }));
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
    // опционально: реализуй как в прошлом ответе, если нужно
  },
}));
