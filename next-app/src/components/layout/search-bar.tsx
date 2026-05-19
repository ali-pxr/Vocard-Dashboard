"use client";

import { useTranslations } from "next-intl";
import { usePlayerStore } from "@/stores/player-store";
import { Search, Loader as Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { Track } from "@/types/player";

export function SearchBar() {
  const t = useTranslations();
  const send = usePlayerStore((s) => s.send);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setShowResults(true);
    // In real app, this would send via WebSocket
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div ref={ref} className="relative flex-1 max-w-md mx-auto">
      <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 focus-within:border-primary transition-colors">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("common.search")}
          className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-border bg-popover shadow-lg max-h-96 overflow-y-auto">
          {results.length === 0 && !loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {t("messages.results_found")}: 0
            </div>
          )}
        </div>
      )}
    </div>
  );
}
