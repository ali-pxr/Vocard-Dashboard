"use client";
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect */

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { msToReadableTime } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  FastForward,
  Rewind,
  Volume2,
  SlidersHorizontal,
  ListMusic,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function MusicController() {
  const currentTrack = usePlayerStore((s) => s.currentTrack);
  const isPaused = usePlayerStore((s) => s.isPaused);
  const currentPosition = usePlayerStore((s) => s.currentPosition);
  const volume = usePlayerStore((s) => s.volume);
  const repeat = usePlayerStore((s) => s.repeat);
  const isDJ = usePlayerStore((s) => s.isDJ);
  const [localOffset, setLocalOffset] = useState(0);
  const [effectOpen, setEffectOpen] = useState(false);
  const lastSyncRef = useRef(currentPosition);

  // Reset offset when server position changes
  if (currentPosition !== lastSyncRef.current) {
    lastSyncRef.current = currentPosition;
    setLocalOffset(0);
  }

  useEffect(() => {
    if (isPaused || !currentTrack) return;
    const interval = setInterval(() => {
      setLocalOffset((o) => o + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, currentTrack]);

  const position = currentPosition + localOffset;

  const trackLength = currentTrack?.length ?? 0;
  const progress = trackLength > 0 ? (position / trackLength) * 100 : 0;

  return (
    <div className="col-span-3 grid grid-cols-[1fr_2fr_1fr] items-center gap-4 border-t border-border bg-card px-6 py-3">
      {/* Left - Track Info */}
      <div
        className={cn(
          "flex items-center gap-3 overflow-hidden transition-opacity",
          currentTrack ? "opacity-100" : "opacity-0"
        )}
      >
        {currentTrack?.artworkUrl && (
          <img
            src={currentTrack.artworkUrl}
            alt=""
            className="h-12 w-12 rounded-md object-cover"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{currentTrack?.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {currentTrack?.author}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Rewind className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12"
          >
            {isPaused ? (
              <Play className="h-8 w-8" />
            ) : (
              <Pause className="h-8 w-8" />
            )}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hidden sm:flex", repeat !== "off" && "text-primary")}
          >
            <Repeat className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <FastForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-3 w-full max-w-lg">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {currentTrack?.isStream ? "LIVE" : msToReadableTime(position)}
          </span>
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            disabled={currentTrack?.isStream}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {currentTrack?.isStream
              ? "∞"
              : msToReadableTime(trackLength)}
          </span>
        </div>
      </div>

      {/* Right - Volume & Extras */}
      <div className="flex items-center justify-end gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            disabled={!isDJ}
            className="w-20"
          />
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEffectOpen(!effectOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          {effectOpen && (
            <EffectPanel />
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            usePlayerStore.getState().setQueueOpen(
              !usePlayerStore.getState().queueOpen
            )
          }
        >
          <ListMusic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function EffectPanel() {
  const t = useTranslations();
  const filters = usePlayerStore((s) => s.filters);
  const availableFilters = usePlayerStore((s) => s.availableFilters);

  const EFFECT_ICONS: Record<string, string> = {
    none: "block",
    karaoke: "mic",
    tremolo: "activity",
    vibrato: "vibrate",
    rotation: "rotate-3d",
    distortion: "audio-lines",
    lowpass: "audio-lines",
    nightcore: "moon",
    "8d": "rotate-3d",
    vaporwave: "block",
  };

  return (
    <div className="absolute bottom-12 right-0 z-50 w-72 rounded-lg border border-border bg-popover shadow-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{t("effects.header")}</h4>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {t("effects.description")}
      </p>
      <div className="grid grid-cols-3 gap-2">
        <button
          className={cn(
            "flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
            filters.length === 0
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          )}
        >
          <span className="material-symbols-outlined text-lg">block</span>
          {t("effects.none")}
        </button>
        {availableFilters.map((f) => {
          const isActive = filters.some((af) => af.tag === f.tag);
          return (
            <button
              key={f.tag}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <span className="material-symbols-outlined text-lg">
                {EFFECT_ICONS[f.tag] || "help"}
              </span>
              {t(`effects.${f.tag === "8d" ? "8d" : f.tag}` as Parameters<typeof t>[0])}
            </button>
          );
        })}
      </div>
    </div>
  );
}
