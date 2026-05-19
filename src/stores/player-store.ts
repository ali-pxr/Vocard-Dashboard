"use client";

import { create } from "zustand";
import type {
  Track,
  User,
  Bot,
  Filter,
  Playlist,
  InboxMessage,
  RepeatMode,
} from "@/types/player";

/* eslint-disable @typescript-eslint/no-unused-vars */
interface PlayerStore {
  isConnected: boolean;
  isPaused: boolean;
  isDJ: boolean;
  currentTrack: Track | null;
  currentQueuePosition: number;
  currentPosition: number;
  volume: number;
  repeat: RepeatMode;
  autoplay: boolean;
  channelName: string;
  queue: Track[];
  users: Record<string, User>;
  filters: Filter[];
  availableFilters: Filter[];
  playlists: Record<string, Playlist>;
  inboxes: InboxMessage[];
  bots: Bot[];
  selectedBot: Bot | null;
  guildId: string | null;
  userId: string | null;
  sidebarOpen: boolean;
  queueOpen: boolean;
  activePage: string;
  historyVisible: boolean;

  init: () => void;
  setConnected: (v: boolean) => void;
  setPaused: (v: boolean) => void;
  setDJ: (v: boolean) => void;
  setCurrentTrack: (t: Track | null) => void;
  setCurrentQueuePosition: (p: number) => void;
  setCurrentPosition: (p: number) => void;
  setVolume: (v: number) => void;
  setRepeat: (r: RepeatMode) => void;
  setAutoplay: (v: boolean) => void;
  setChannelName: (n: string) => void;
  setQueue: (q: Track[]) => void;
  addUser: (u: User) => void;
  removeUser: (id: string) => void;
  setFilters: (f: Filter[]) => void;
  setAvailableFilters: (f: Filter[]) => void;
  setPlaylists: (p: Record<string, Playlist>) => void;
  setInboxes: (i: InboxMessage[]) => void;
  setBots: (b: Bot[]) => void;
  setSelectedBot: (b: Bot | null) => void;
  setGuildId: (g: string | null) => void;
  setUserId: (u: string | null) => void;
  setSidebarOpen: (v: boolean) => void;
  setQueueOpen: (v: boolean) => void;
  setActivePage: (p: string) => void;
  setHistoryVisible: (v: boolean) => void;
  addTrackToQueue: (t: Track, position?: number) => void;
  removeTrackFromQueue: (index: number) => void;
  clearQueue: () => void;
  clearHistory: () => void;
  send: (payload: Record<string, unknown>) => void;
  _sendFn: ((payload: Record<string, unknown>) => void) | null;
  setSendFn: (fn: (payload: Record<string, unknown>) => void) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  isConnected: false,
  isPaused: true,
  isDJ: false,
  currentTrack: null,
  currentQueuePosition: 0,
  currentPosition: 0,
  volume: 100,
  repeat: "off",
  autoplay: false,
  channelName: "",
  queue: [],
  users: {},
  filters: [],
  availableFilters: [],
  playlists: {},
  inboxes: [],
  bots: [],
  selectedBot: null,
  guildId: null,
  userId: null,
  sidebarOpen: false,
  queueOpen: true,
  activePage: "home",
  historyVisible: false,

  init: () =>
    set({
      isDJ: false,
      queue: [],
      guildId: null,
      users: {},
      repeat: "off",
      currentTrack: null,
      currentQueuePosition: 0,
      currentPosition: 0,
      isPaused: true,
      volume: 100,
      isConnected: true,
      autoplay: false,
      channelName: "",
      filters: [],
    }),

  setConnected: (v) => set({ isConnected: v }),
  setPaused: (v) => set({ isPaused: v }),
  setDJ: (v) => set({ isDJ: v }),
  setCurrentTrack: (t) => set({ currentTrack: t }),
  setCurrentQueuePosition: (p) => set({ currentQueuePosition: p }),
  setCurrentPosition: (p) => set({ currentPosition: p }),
  setVolume: (v) => set({ volume: v }),
  setRepeat: (r) => set({ repeat: r }),
  setAutoplay: (v) => set({ autoplay: v }),
  setChannelName: (n) => set({ channelName: n }),
  setQueue: (q) => set({ queue: q }),
  addUser: (u) => set((s) => ({ users: { ...s.users, [u.userId]: u } })),
  removeUser: (id) =>
    set((s) => {
      const { [id]: _, ...rest } = s.users;
      return { users: rest };
    }),
  setFilters: (f) => set({ filters: f }),
  setAvailableFilters: (f) => set({ availableFilters: f }),
  setPlaylists: (p) => set({ playlists: p }),
  setInboxes: (i) => set({ inboxes: i }),
  setBots: (b) => set({ bots: b }),
  setSelectedBot: (b) => set({ selectedBot: b }),
  setGuildId: (g) => set({ guildId: g }),
  setUserId: (u) => set({ userId: u }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setQueueOpen: (v) => set({ queueOpen: v }),
  setActivePage: (p) => set({ activePage: p }),
  setHistoryVisible: (v) => set({ historyVisible: v }),

  addTrackToQueue: (t, position) =>
    set((s) => {
      const q = [...s.queue];
      if (position !== undefined) {
        q.splice(s.currentQueuePosition + position, 0, t);
      } else {
        q.push(t);
      }
      return { queue: q };
    }),

  removeTrackFromQueue: (index) =>
    set((s) => {
      const q = [...s.queue];
      q.splice(index, 1);
      return { queue: q };
    }),

  clearQueue: () =>
    set((s) => ({
      queue: s.queue.slice(0, s.currentQueuePosition + 1),
    })),

  clearHistory: () =>
    set((s) => {
      if (s.currentQueuePosition > 0) {
        const q = s.queue.slice(s.currentQueuePosition);
        return { queue: q, currentQueuePosition: 0 };
      }
      return {};
    }),

  _sendFn: null,
  setSendFn: (fn) => set({ _sendFn: fn }),
  send: (payload) => {
    const fn = usePlayerStore.getState()._sendFn;
    if (fn) fn(payload);
  },
}));
