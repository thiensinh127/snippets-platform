"use client";

import * as React from "react";
import LazySnippetCard from "@/components/common/LazySnippetCard";
import type { SnippetDTO } from "@/types/snippet";
import { Button } from "@/components/ui/button";

type Snippet = SnippetDTO;

type Meta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function SnippetFeed({
  initialItems,
  initialMeta,
}: {
  initialItems: Snippet[];
  initialMeta: Meta;
}) {
  const [items, setItems] = React.useState<Snippet[]>(initialItems);
  const [page, setPage] = React.useState<number>(initialMeta.page);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState<boolean>(
    initialMeta.page < initialMeta.totalPages
  );

  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const loadNext = React.useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const res = await fetch(
        `/api/snippets?page=${nextPage}&pageSize=${initialMeta.pageSize}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error(`Failed to load page ${nextPage}`);
      const data = (await res.json()) as { items: Snippet[]; meta: Meta };
      const newItems = Array.isArray(data.items)
        ? (data.items as Snippet[])
        : [];
      setItems((prev) => prev.concat(newItems));
      setPage(data.meta?.page ?? nextPage);
      setHasMore(
        (data.meta?.page ?? nextPage) < (data.meta?.totalPages ?? nextPage)
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load more";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, initialMeta.pageSize]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadNext();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadNext]);

  return (
    <div>
      <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
        {items.map((snippet) => (
          <LazySnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      {hasMore && (
        <div className="mt-6 flex items-center justify-center">
          <Button onClick={loadNext} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
