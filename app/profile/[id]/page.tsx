import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCachedUserWithSnippets } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Code2, Edit, Eye } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return { title: "User not found" };
  }

  return {
    title: `${user.name || user.username} - CodeShare`,
    description: user.bio || `Code snippets by ${user.username}`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const user = await getCachedUserWithSnippets(params.id);
  console.log(user);

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;
  const totalViews = user.snippets.reduce((sum, s) => sum + s.views, 0);

  // Get language stats
  const languageStats = user.snippets.reduce((acc, snippet) => {
    acc[snippet.language] = (acc[snippet.language] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-4xl">
                  {user.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user.name || user.username}
                    </h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                  {isOwnProfile && (
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {user.bio && <p className="text-lg mb-4">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Code2 className="h-4 w-4" />
                    {user.snippets.length} snippets
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {totalViews} total views
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {topLanguages.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topLanguages.map(([lang, count]) => (
                  <Badge key={lang} variant="secondary">
                    {lang} ({count})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Snippets */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {isOwnProfile ? "Your Snippets" : "Public Snippets"}
          </h2>

          {user.snippets.length === 0 ? (
            <Card className="p-12 text-center">
              <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground mb-4">
                {isOwnProfile
                  ? "You haven't created any snippets yet"
                  : "No snippets yet"}
              </p>
              {isOwnProfile && (
                <Link href="/snippets/new">
                  <Button>Create Your First Snippet</Button>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.snippets.map((snippet) => (
                <Card
                  key={snippet.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{snippet.language}</Badge>
                      {snippet.complexity && (
                        <Badge variant="outline">{snippet.complexity}</Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">
                      <Link
                        href={`/snippets/${snippet.id}`}
                        className="hover:underline"
                      >
                        {snippet.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {snippet.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="bg-slate-900 rounded-md p-3 mb-4 overflow-hidden">
                      <pre className="text-xs text-slate-300 line-clamp-3">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {snippet.views}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(snippet.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
