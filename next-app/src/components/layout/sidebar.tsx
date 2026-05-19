"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { Hop as Home, Compass, Server, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
  { id: "home", icon: Home },
  { id: "explore", icon: Compass },
  { id: "settings", icon: Server },
] as const;

export function Sidebar() {
  const t = useTranslations();
  const activePage = usePlayerStore((s) => s.activePage);
  const setActivePage = usePlayerStore((s) => s.setActivePage);
  const playlists = usePlayerStore((s) => s.playlists);
  const bots = usePlayerStore((s) => s.bots);
  const selectedBot = usePlayerStore((s) => s.selectedBot);
  const sidebarOpen = usePlayerStore((s) => s.sidebarOpen);
  const [botDropdown, setBotDropdown] = useState(false);

  return (
    <aside
      className={cn(
        "row-span-2 w-56 border-r border-border bg-card transition-all duration-300",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-72 max-md:shadow-xl",
        sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"
      )}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 p-4">
          {/* Bot Selection */}
          <div className="relative">
            <button
              onClick={() => setBotDropdown(!botDropdown)}
              className="flex w-full items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                {selectedBot && (
                  <img
                    src={selectedBot.avatar}
                    alt=""
                    className="h-5 w-5 rounded-full"
                  />
                )}
                <span className="truncate">
                  {selectedBot?.name || "Select Bot"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {botDropdown && (
              <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
                {bots.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => {
                      usePlayerStore.getState().setSelectedBot(bot);
                      setBotDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    <img
                      src={bot.avatar}
                      alt=""
                      className="h-5 w-5 rounded-full"
                    />
                    <span className="truncate">{bot.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActivePage(id);
                  usePlayerStore.getState().setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  activePage === id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>
                  {id === "home"
                    ? t("nav.home")
                    : id === "explore"
                    ? t("nav.explore")
                    : t("nav.server")}
                </span>
              </button>
            ))}
          </nav>

          <Separator />

          {/* Playlists */}
          <div className="flex flex-col gap-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-full gap-2 rounded-full"
              onClick={() => setActivePage("create-playlist")}
            >
              <Plus className="h-4 w-4" />
              {t("playlist.create")}
            </Button>

            {Object.entries(playlists).map(([id, pl]) => (
              <button
                key={id}
                onClick={() => setActivePage(`playlist-${id}`)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span className="truncate">{pl.name}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
