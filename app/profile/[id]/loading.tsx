export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-6 animate-pulse" />
      <div className="rounded-xl border p-6 mb-6">
        <div className="flex gap-6">
          <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="flex-1">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
            <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div>
                <div className="h-6 w-14 bg-slate-200 dark:bg-slate-800 rounded mb-1 animate-pulse" />
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-4">
            <div className="h-5 w-2/3 bg-slate-200 dark:bg-slate-800 rounded mb-3 animate-pulse" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
