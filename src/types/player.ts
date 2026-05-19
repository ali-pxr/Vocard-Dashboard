export interface Track {
  trackId: string;
  title: string;
  author: string;
  source: string;
  identifier: string;
  artworkUrl: string;
  isStream: boolean;
  length: number;
  uri: string;
  requester?: User;
}

export interface User {
  userId: string;
  name: string;
  avatarUrl: string;
}

export interface Bot {
  id: string;
  name: string;
  avatar: string;
}

export interface Filter {
  tag: string;
  [key: string]: unknown;
}

export interface Playlist {
  id: string;
  name: string;
  tracks?: string[];
  type?: string;
  url?: string;
}

export interface InboxMessage {
  sender: { id: string; avatarUrl: string };
  referId: string;
  title: string;
  description: string;
  time: number;
  type: string;
}

export type RepeatMode = "off" | "track" | "queue";

export interface PlayerState {
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
}
