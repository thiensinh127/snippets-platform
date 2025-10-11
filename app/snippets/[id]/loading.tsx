import { LoadingSpinner } from "@/components/ui/loading"

export default function SnippetLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Snippet Header Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6 mb-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
          <div className="flex flex-wrap gap-1 mb-4">
            <div className="h-5 w-12 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
            <div className="h-5 w-14 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Code Block Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6 mb-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
          <div className="bg-slate-900 rounded-md p-4 h-64">
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-700 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
              ))}
            </div>
          </div>
        </div>

        {/* Author Section Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border p-6 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

