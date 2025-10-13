import DeleteButton from "@/components/common/DeleteButton";
import { SnippetCard } from "@/components/common/SnippetCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCachedUserWithSnippets } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { SnippetDTO } from "@/types/snippet";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Code2, Edit, Eye } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations();
  const session = await getServerSession(authOptions);

  const user = await getCachedUserWithSnippets(params.id);

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;
  const totalViews = user.snippets.reduce((sum, s) => sum + s.views, 0);
  const publicSnippets = user.snippets.filter((s) => s.isPublic);
  const privateSnippets = user.snippets.filter((s) => !s.isPublic);

  const toDTO = (s: any): SnippetDTO => ({
    id: s.id,
    title: s.title,
    description: s.description ?? undefined,
    code: s.code,
    language: s.language,
    fileName: s.fileName ?? undefined,
    complexity: s.complexity ?? undefined,
    isPublic: s.isPublic,
    views: s.views ?? 0,
    slug: s.slug,
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAt ?? s.createdAt),
    author: {
      id: user.id,
      name: user.name ?? user.username,
      username: user.username,
      avatarUrl: (user as any)?.avatarUrl ?? undefined,
    },
    authorId: user.id,
    tags: (s.tags ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
    })),
  });

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backHome")}
          </Link>
        </div>
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
                      {t("common.edit")}
                    </Button>
                  )}
                </div>

                {user.bio && <p className="text-lg mb-4">{user.bio}</p>}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Code2 className="h-4 w-4" />
                    {user.snippets.length} {t("profile.publicSnippets")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {totalViews} {t("common.views")}
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
              <CardTitle>{t("profile.topLanguages")}</CardTitle>
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
            {isOwnProfile
              ? t("profile.yourSnippets")
              : t("profile.publicSnippets")}
          </h2>

          {/* Public snippets */}
          <div className="mb-6">
            {publicSnippets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  {t("profile.noSnippets")}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicSnippets.map((s) => (
                  <SnippetCard
                    key={s.id}
                    snippet={toDTO(s)}
                    compact
                    actions={
                      isOwnProfile ? (
                        <div className="flex items-center gap-2">
                          <Link href={`/snippets/${s.id}/edit`}>
                            <Button variant="outline" size="sm">
                              {t("common.edit")}
                            </Button>
                          </Link>
                          <DeleteButton isText={false} snippetId={s.id} />
                        </div>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Private snippets (only for owner) */}
          {isOwnProfile && (
            <div>
              <h3 className="text-xl font-semibold mb-3">
                {t("profile.privateSnippets")}
              </h3>
              {privateSnippets.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    {t("profile.noSnippets")}
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {privateSnippets.map((s) => (
                    <SnippetCard
                      key={s.id}
                      snippet={toDTO(s)}
                      compact
                      isPrivate={true}
                      actions={
                        <div className="flex items-center gap-2">
                          <Link href={`/snippets/${s.id}/edit`}>
                            <Button variant="outline" size="sm">
                              {t("common.edit")}
                            </Button>
                          </Link>
                          <DeleteButton isText={false} snippetId={s.id} />
                        </div>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
