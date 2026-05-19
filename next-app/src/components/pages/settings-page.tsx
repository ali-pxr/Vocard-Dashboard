"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routing } from "@/i18n/routing";

const COLORS = [
  { id: "purple", class: "bg-[#8957ff]" },
  { id: "pink", class: "bg-[#fa8abb]" },
  { id: "red", class: "bg-[#ff3366]" },
  { id: "yellow", class: "bg-[#ffbb00]" },
  { id: "blue", class: "bg-[#02bbff]" },
  { id: "green", class: "bg-[#00cc88]" },
];

export function SettingsPage() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-6 p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {t("settings.subtitle")}
          </p>
          <h2 className="text-xl font-semibold">{t("settings.title")}</h2>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.language")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.language_desc")}
            </p>
          </div>
          <Select
            value={locale}
            onValueChange={(v) => {
              router.replace(pathname, { locale: v as typeof routing.locales[number] });
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {routing.locales.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {new Intl.DisplayNames([locale], { type: "language" }).of(
                    loc === "zh-Hant" ? "zh-TW" : loc
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dark Mode */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{t("settings.dark_mode")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("settings.dark_mode_desc")}
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            />
          </div>
          <div className="mt-4 flex gap-3">
            {COLORS.map((c) => (
              <button
                key={c.id}
                className={`h-8 w-8 rounded-md ${c.class} transition-transform hover:scale-105`}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Server Settings */}
        <div>
          <p className="text-sm text-muted-foreground">
            {t("settings.server_subtitle")}
          </p>
          <h2 className="text-xl font-semibold">{t("settings.server_title")}</h2>
        </div>

        {/* Prefix */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.prefix")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.prefix_desc")}
            </p>
          </div>
          <Input className="w-24 text-center" placeholder="?" maxLength={3} />
        </div>

        {/* Queue Mode */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.queue_mode")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.queue_mode_desc")}
            </p>
          </div>
          <Select defaultValue="queue">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="queue">Queue</SelectItem>
              <SelectItem value="stack">Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DJ Role */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.dj_role")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.dj_role_desc")}
            </p>
          </div>
          <Select defaultValue="none">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 24/7 Mode */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.mode_247")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.mode_247_desc")}
            </p>
          </div>
          <Switch />
        </div>

        {/* Vote Bypass */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.vote_bypass")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.vote_bypass_desc")}
            </p>
          </div>
          <Switch />
        </div>

        {/* Controller Message */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.controller_msg")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.controller_msg_desc")}
            </p>
          </div>
          <Switch />
        </div>

        {/* Duplicate Track */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.duplicate_track")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.duplicate_track_desc")}
            </p>
          </div>
          <Switch />
        </div>

        {/* Silent Message */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.silent_msg")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.silent_msg_desc")}
            </p>
          </div>
          <Switch />
        </div>

        {/* Voice Status Template */}
        <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <div>
            <h3 className="font-medium">{t("settings.voice_status")}</h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.voice_status_desc")}
            </p>
          </div>
          <Input className="w-full" placeholder="{title} - {author}" />
        </div>
      </div>
    </ScrollArea>
  );
}
