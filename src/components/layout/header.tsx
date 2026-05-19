"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { SearchBar } from "@/components/layout/search-bar";
import { InboxPanel } from "@/components/layout/inbox-panel";
import { UserMenu } from "@/components/layout/user-menu";
import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const t = useTranslations();
  const setSidebarOpen = usePlayerStore((s) => s.setSidebarOpen);
  const activePage = usePlayerStore((s) => s.activePage);
  const [inboxOpen, setInboxOpen] = useState(false);
  const inboxes = usePlayerStore((s) => s.inboxes);

  const showBack = activePage !== "home" && activePage !== "explore";

  return (
    <header className="col-span-3 flex items-center gap-3 border-b border-border px-4 py-2">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => usePlayerStore.getState().setActivePage("home")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <SearchBar />

      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setInboxOpen(!inboxOpen)}
        >
          <span className="material-symbols-outlined">inbox</span>
          {inboxes.length > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
        {inboxOpen && <InboxPanel onClose={() => setInboxOpen(false)} />}
      </div>

      <UserMenu />
    </header>
  );
}
