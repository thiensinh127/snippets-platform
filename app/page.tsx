import LazySnippetCard from "@/components/common/LazySnippetCard";
import HeroSection from "@/components/home-page/HeroSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCachedLanguages, getCachedSnippets } from "@/lib/cache";
import { Code2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Use cached queries for better performance
  const [snippets, languages] = await Promise.all([
    getCachedSnippets(),
    getCachedLanguages(),
  ]);

  return (
    <div className=" flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
                <Link href={`/profile/${session.user.id}`}>
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
      <HeroSection session={session} />

      {/* Snippets Grid */}
      <section className="container mx-auto px-4 py-8">
        {snippets.length === 0 ? (
          <Card className="p-12 text-center">
            <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              No snippets yet. Be the first to share!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
            {snippets.map((snippet: any) => (
              <LazySnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-white/50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 CodeShare. Built with Next.js & TailwindCSS</p>
        </div>
      </footer>
    </div>
  );
}
