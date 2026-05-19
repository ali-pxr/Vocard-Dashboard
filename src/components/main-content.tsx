"use client";

import { usePlayerStore } from "@/stores/player-store";
import { HomePage, ExplorePage } from "@/components/pages/home-page";
import { SettingsPage } from "@/components/pages/settings-page";

export function MainContent() {
  const activePage = usePlayerStore((s) => s.activePage);

  switch (activePage) {
    case "home":
      return <HomePage />;
    case "explore":
      return <ExplorePage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <HomePage />;
  }
}
