"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function InboxPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations();
  const inboxes = usePlayerStore((s) => s.inboxes);

  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-popover shadow-lg">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-semibold">{t("nav.inbox")}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="max-h-80">
        {inboxes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("messages.no_inbox")}
            </p>
          </div>
        ) : (
          inboxes.map((mail, i) => (
            <div
              key={`${mail.sender.id}-${mail.referId}-${i}`}
              className="border-b border-border p-4 last:border-0"
            >
              <div className="flex items-start gap-3">
                <img
                  src={mail.sender.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{mail.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(mail.time * 1000).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {mail.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="default">
                      {t("common.accept")}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
