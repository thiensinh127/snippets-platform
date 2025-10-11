import { CardSkeleton } from "@/components/ui/loading"

export default function SnippetsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header Skeleton */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="h-12 w-3/4 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto mb-8 animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </section>

      {/* Stats Skeleton */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border p-6 animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Snippets Grid Skeleton */}
      <section className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

