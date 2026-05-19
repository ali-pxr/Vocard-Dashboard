"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { msToReadableTime } from "@/lib/utils";
import { History, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Track } from "@/types/player";

export function QueuePanel() {
  const t = useTranslations();
  const queueOpen = usePlayerStore((s) => s.queueOpen);
  const queue = usePlayerStore((s) => s.queue);
  const currentQueuePosition = usePlayerStore((s) => s.currentQueuePosition);
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const autoplay = usePlayerStore((s) => s.autoplay);
  const historyVisible = usePlayerStore((s) => s.historyVisible);

  const upNext = queue.slice(currentQueuePosition + 1);
  const history = queue.slice(0, currentQueuePosition).reverse();

  return (
    <aside
      className={cn(
        "row-span-2 w-72 border-l border-border bg-card flex flex-col transition-all duration-300",
        "max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:z-50 max-md:w-80 max-md:shadow-xl",
        queueOpen
          ? "max-md:translate-x-0"
          : "max-md:translate-x-full max-md:w-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-semibold">{t("player.queue")}</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              usePlayerStore.getState().setHistoryVisible(!historyVisible)
            }
          >
            <History className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => usePlayerStore.getState().setQueueOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* Now Playing */}
        {currentTrack && (
          <div className="border-b border-border p-4">
            <h4 className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              {t("player.now_playing")}
            </h4>
            <TrackItem track={currentTrack} />
          </div>
        )}

        {/* Up Next */}
        {upNext.length > 0 && (
          <div className="border-b border-border p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                {t("player.next_in_queue")}
              </h4>
              <button
                onClick={() => usePlayerStore.getState().clearQueue()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("player.clear_queue")}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {upNext.map((track, i) => (
                <TrackItem key={`${track.trackId}-${i}`} track={track} />
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {historyVisible && history.length > 0 && (
          <div className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-xs font-medium uppercase text-muted-foreground">
                {t("player.history_queue")}
              </h4>
              <button
                onClick={() => usePlayerStore.getState().clearHistory()}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("player.clear_history")}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {history.map((track, i) => (
                <TrackItem key={`${track.trackId}-h-${i}`} track={track} />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Autoplay */}
      <button
        onClick={() =>
          usePlayerStore.getState().setAutoplay(!autoplay)
        }
        className={cn(
          "flex items-center justify-center gap-2 border-t border-border px-4 py-3 text-sm transition-colors",
          autoplay
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent"
        )}
      >
        {t("player.autoplay")}
      </button>
    </aside>
  );
}

function TrackItem({ track }: { track: Track }) {
  return (
    <div className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent transition-colors cursor-pointer">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
        <img
          src={track.artworkUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        {track.requester && (
          <img
            src={track.requester.avatarUrl}
            alt=""
            className="absolute inset-0 m-auto h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{track.title}</p>
        <p className="truncate text-xs text-muted-foreground">{track.author}</p>
      </div>
      <span className="text-xs text-muted-foreground">
        {track.isStream ? "LIVE" : msToReadableTime(track.length)}
      </span>
    </div>
  );
}
