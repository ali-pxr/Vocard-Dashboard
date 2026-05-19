"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { Settings, Circle as HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function UserMenu() {
  const t = useTranslations();
  const setActivePage = usePlayerStore((s) => s.setActivePage);

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="icon" className="rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary/20" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1">
        <button
          onClick={() => setActivePage("settings")}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <Settings className="h-4 w-4" />
          {t("nav.settings")}
        </button>
        <a
          href="https://discord.gg/wRCgB7vBQv"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          {t("nav.help")}
        </a>
        <button
          onClick={() => { window.location.href = "/logout"; }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("nav.logout")}
        </button>
      </PopoverContent>
    </Popover>
  );
}
