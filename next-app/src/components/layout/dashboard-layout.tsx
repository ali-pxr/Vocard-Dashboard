"use client";

import { usePlayerStore } from "@/stores/player-store";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { QueuePanel } from "@/components/queue/queue-panel";
import { MusicController } from "@/components/player/music-controller";
import { useWebSocket } from "@/hooks/use-websocket";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useWebSocket();

  const sidebarOpen = usePlayerStore((s) => s.sidebarOpen);
  const queueOpen = usePlayerStore((s) => s.queueOpen);

  return (
    <div className="grid h-screen grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] overflow-hidden bg-background">
      <Header />
      <Sidebar />
      <main className="flex flex-col overflow-hidden border-r border-border">
        {children}
      </main>
      <QueuePanel />
      <MusicController />

      {/* Mobile overlays */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => usePlayerStore.getState().setSidebarOpen(false)}
        />
      )}
      {queueOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => usePlayerStore.getState().setQueueOpen(false)}
        />
      )}
    </div>
  );
}
