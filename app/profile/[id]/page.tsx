import DeleteButton from "@/components/common/DeleteButton";
import { SnippetCard } from "@/components/common/SnippetCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";
import { getCachedUserWithSnippets } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import { SnippetDTO } from "@/types/snippet";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Code2,
  Edit,
  Eye,
  Lock,
  TrendingUp,
} from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
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
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations();
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const user = await getCachedUserWithSnippets(id);

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
  const languageStats = user.snippets.reduce(
    (acc, snippet) => {
      acc[snippet.language] = (acc[snippet.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.backHome")}</span>
          </Link>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20">
                <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60">
                  {user.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold truncate">
                      {user.name || user.username}
                    </h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                  {isOwnProfile && (
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Edit className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">
                        {t("common.edit")}
                      </span>
                    </Button>
                  )}
                </div>

                {user.bio && (
                  <p className="text-base sm:text-lg text-muted-foreground mb-4">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Joined{" "}
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Snippets */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Code2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user.snippets.length}</p>
                  <p className="text-xs text-muted-foreground">Snippets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Views */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalViews}</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Public Snippets */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publicSnippets.length}</p>
                  <p className="text-xs text-muted-foreground">Public</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Private Snippets (if own profile) */}
          {isOwnProfile && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {privateSnippets.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Private</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Languages Card */}
        {topLanguages.length > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                Top Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {topLanguages.map(([lang, count]) => (
                  <Badge key={lang} variant="secondary" className="text-sm">
                    {lang}{" "}
                    <span className="ml-1 text-muted-foreground">
                      ({count})
                    </span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Snippets Section */}
        <div className="space-y-8">
          {/* Public Snippets */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">
                {isOwnProfile
                  ? t("profile.yourSnippets")
                  : t("profile.publicSnippets")}
              </h2>
              <Badge variant="outline" className="text-sm">
                {publicSnippets.length} snippets
              </Badge>
            </div>

            {publicSnippets.length === 0 ? (
              <Card className="p-12 text-center">
                <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                  {t("profile.noSnippets")}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Private Snippets (only for owner) */}
          {isOwnProfile && privateSnippets.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    {t("profile.privateSnippets")}
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    {privateSnippets.length} snippets
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
