"use client";

import { useRef, useCallback, useEffect } from "react";
import { usePlayerStore } from "@/stores/player-store";

const RECONNECT_BASE_DELAY = 2000;
const RECONNECT_MAX_DELAY = 30000;

export function useWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const disconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const store = usePlayerStore;

  const send = useCallback((payload: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    store.getState().setSendFn(send);
  }, [send, store]);

  const handleMessage = useCallback(
    (msg: MessageEvent) => {
      try {
        const data = JSON.parse(msg.data);
        const op = data.op;

        switch (op) {
          case "initBot": {
            const bots = store.getState().bots;
            const exists = bots.find((b) => b.id === data.botId);
            if (!exists) {
              store.getState().setBots([
                ...bots,
                { id: data.botId, name: data.botName, avatar: data.botAvatar },
              ]);
            }
            break;
          }
          case "initUser": {
            store.getState().setUserId(data.userId);
            store.getState().setPlaylists(data.data?.playlist || {});
            store.getState().setInboxes(data.data?.inbox || []);
            break;
          }
          case "initPlayer": {
            store.getState().init();
            store.getState().setGuildId(data.guildId);
            store.getState().setDJ(data.isDj);
            store.getState().setPaused(data.isPaused);
            store.getState().setCurrentPosition(data.currentPosition);
            store.getState().setRepeat(data.repeatMode);
            store.getState().setChannelName(data.channelName);
            store.getState().setAutoplay(data.autoplay);
            store.getState().setVolume(data.volume);
            store.getState().setAvailableFilters(data.availableFilters || []);
            store.getState().setFilters(data.filters || []);
            if (data.currentQueuePosition !== undefined) {
              store.getState().setCurrentQueuePosition(
                data.currentQueuePosition - 1
              );
            }
            break;
          }
          case "playerUpdate": {
            store.getState().setCurrentPosition(data.lastPosition);
            store.getState().setConnected(data.isConnected);
            break;
          }
          case "trackUpdate": {
            store.getState().setPaused(data.isPaused);
            break;
          }
          case "updatePause": {
            store.getState().setPaused(data.pause);
            break;
          }
          case "updatePosition": {
            store.getState().setCurrentPosition(data.position);
            break;
          }
          case "updateVolume": {
            store.getState().setVolume(data.volume);
            break;
          }
          case "repeatTrack": {
            store.getState().setRepeat(data.repeatMode);
            break;
          }
          case "toggleAutoplay": {
            store.getState().setAutoplay(data.status);
            break;
          }
          case "playerClose": {
            store.getState().init();
            break;
          }
          case "closeConnection": {
            store.getState().setConnected(false);
            break;
          }
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message", e);
      }
    },
    [store]
  );

  const scheduleReconnectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.hostname}:${window.location.port}/ws_user`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      heartbeatRef.current = setInterval(() => send({ op: "heartbeat" }), 60000);
    };

    ws.onmessage = handleMessage;

    ws.onclose = () => {
      store.getState().init();
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      scheduleReconnectRef.current();
    };

    ws.onerror = () => {
      scheduleReconnectRef.current();
    };
  }, [send, handleMessage, store]);

  const scheduleReconnect = useCallback(() => {
    if (document.visibilityState === "visible") {
      const delay = Math.min(
        RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttempts.current),
        RECONNECT_MAX_DELAY
      );
      reconnectAttempts.current += 1;
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connect();
        }
      }, delay);
    }
  }, [connect]);

  useEffect(() => {
    scheduleReconnectRef.current = scheduleReconnect;
  }, [scheduleReconnect]);

  const disconnect = useCallback(() => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    if (disconnectTimeout.current) clearTimeout(disconnectTimeout.current);
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  useEffect(() => {
    connect();

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        disconnectTimeout.current = setTimeout(disconnect, 30000);
      } else {
        if (disconnectTimeout.current) clearTimeout(disconnectTimeout.current);
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
          connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [connect, disconnect]);

  return { send };
}
