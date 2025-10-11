import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface SnippetCardProps {
  snippet: {
    id: string
    title: string
    description: string | null
    language: string
    tags: string[]
    complexity: string | null
    code: string
    views: number
    createdAt: Date
    author: {
      id: string
      name: string | null
      username: string
      avatar: string | null
    }
  }
}

function SnippetCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-4">
          <div className="h-5 w-12 bg-gray-200 rounded"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-gray-200 rounded-md p-3 mb-4 h-20"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LazySnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Suspense fallback={<SnippetCardSkeleton />}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.complexity && (
              <Badge variant="outline">{snippet.complexity}</Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2">
            <Link href={`/snippets/${snippet.id}`} className="hover:underline">
              {snippet.title}
            </Link>
          </CardTitle>
          {snippet.description && (
            <CardDescription className="line-clamp-2">
              {snippet.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* Tags */}
          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {snippet.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Code Preview */}
          <div className="bg-slate-900 rounded-md p-3 mb-4 overflow-hidden">
            <pre className="text-xs text-slate-300 line-clamp-3">
              <code>{snippet.code}</code>
            </pre>
          </div>

          {/* Author & Meta */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Link 
              href={`/profile/${snippet.author.username}`}
              className="flex items-center gap-2 hover:text-foreground"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {snippet.author.name?.[0] || snippet.author.username[0]}
                </AvatarFallback>
              </Avatar>
              <span>{snippet.author.username}</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {snippet.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Suspense>
  )
}
