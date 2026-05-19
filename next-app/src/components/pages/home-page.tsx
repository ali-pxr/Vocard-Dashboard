"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Track } from "@/types/player";

export function HomePage() {
  const t = useTranslations();
  const queue = usePlayerStore((s) => s.queue);
  const currentQueuePosition = usePlayerStore((s) => s.currentQueuePosition);

  const historyTracks = queue.slice(0, currentQueuePosition).reverse();

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-8 p-6">
        {/* Recently Played */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">
            {t("home.recently_played")}
          </h2>
          {historyTracks.length === 0 ? (
            <EmptyState
              title={t("errors.no_history")}
              description={t("errors.no_history_desc")}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {historyTracks.map((track, i) => (
                <TrackCard key={`${track.trackId}-${i}`} track={track} />
              ))}
            </div>
          )}
        </section>

        {/* Recommendations */}
        <section>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {t("home.recommendation_subtitle")}
            </p>
            <h2 className="text-xl font-semibold">
              {t("home.recommendation_title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-lg bg-muted p-3"
              >
                <div className="aspect-square rounded-md bg-muted-foreground/20" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted-foreground/20" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </ScrollArea>
  );
}

export function ExplorePage() {
  const t = useTranslations();

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-8 p-6">
        <section>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {t("home.trending_subtitle")}
            </p>
            <h2 className="text-xl font-semibold">
              {t("home.trending_title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`trending-skeleton-${i}`}
                className="animate-pulse rounded-lg bg-muted p-3"
              >
                <div className="aspect-square rounded-md bg-muted-foreground/20" />
                <div className="mt-3 h-4 w-3/4 rounded bg-muted-foreground/20" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted-foreground/20" />
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </div>
    </ScrollArea>
  );
}

function TrackCard({ track }: { track: Track }) {
  return (
    <div className="group cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent">
      <div className="relative aspect-square overflow-hidden rounded-md">
        <img
          src={track.artworkUrl}
          alt={track.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
          <Play className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="mt-2">
        <p className="truncate text-sm font-medium">{track.title}</p>
        <p className="truncate text-xs text-muted-foreground">{track.author}</p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Footer() {
  const t = useTranslations();
  return (
    <footer className="border-t border-border pt-6">
      <div className="flex flex-wrap gap-8">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{t("footer.support")}</p>
          <a
            href="https://docs.vocard.xyz"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.document")}
          </a>
          <a
            href="https://discord.com/invite/wRCgB7vBQv"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Discord
          </a>
          <a
            href="https://github.com/ChocoMeow/Vocard"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Github
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{t("footer.donation")}</p>
          <a
            href="https://ko-fi.com/chocoo"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Ko-Fi
          </a>
          <a
            href="https://www.patreon.com/Vocard"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Patreon
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{t("footer.legal")}</p>
          <a
            href="https://www.termsfeed.com/live/4322db80-d6f4-4cd0-9aaf-73080323ff01"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.privacy")}
          </a>
          <a
            href="https://www.termsfeed.com/live/4d3977eb-65b6-4ce2-a446-1cd80e619ab0"
            target="_blank"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {t("footer.terms")}
          </a>
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">
          &copy; {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
