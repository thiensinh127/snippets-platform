export default function SnippetGridSkeleton({
  columns = "grid-cols-1",
  count = 6,
}: {
  columns?: string;
  count?: number;
}) {
  return (
    <div className={`grid ${columns} gap-4 sm:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border p-4">
          <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-3 animate-pulse" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
          <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
