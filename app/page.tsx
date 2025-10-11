import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Plus } from "lucide-react"
import { getCachedSnippets, getCachedLanguages } from "@/lib/cache"
import LazySnippetCard from "@/components/common/LazySnippetCard"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  // Use cached queries for better performance
  const [snippets, languages] = await Promise.all([
    getCachedSnippets(),
    getCachedLanguages()
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">CodeShare</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {session ? (
              <>
                <Link href="/snippets/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Snippet
                  </Button>
                </Link>
                <Link href={`/profile/${session.user.username}`}>
                  <Button variant="outline">Profile</Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="ghost">Sign Out</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-5xl font-bold mb-4">
          Share Code Snippets with Developers
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover, share, and learn from code snippets across multiple languages
        </p>
        {!session && (
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
        )}
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-4xl">{snippets.length}</CardTitle>
              <CardDescription>Total Snippets</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-4xl">{languages.length}</CardTitle>
              <CardDescription>Languages</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Snippets Grid */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Latest Snippets</h2>
        
        {snippets.length === 0 ? (
          <Card className="p-12 text-center">
            <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No snippets yet. Be the first to share!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
              <LazySnippetCard 
                key={snippet.id} 
                snippet={{
                  ...snippet,
                  description: snippet.description,
                  complexity: snippet.complexity,
                  author: {
                    ...snippet.author,
                    name: snippet.author.name,
                    avatar: snippet.author.avatar
                  }
                }} 
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 CodeShare. Built with Next.js & TailwindCSS</p>
        </div>
      </footer>
    </div>
  )
}