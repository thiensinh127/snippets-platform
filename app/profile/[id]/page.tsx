import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Edit } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import KPISkeleton from "./KPISkeleton";
import KPICards from "./KPICards";
import SectionHeaderWithSkeleton from "./SectionHeaderWithSkeleton";
import PublicSnippetsSection from "./PublicSnippets";
import PrivateSnippets from "./PrivateSnippets";

export const revalidate = 60;

// ---- Metadata ----
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { username: true, name: true, bio: true },
  });
  if (!user) return { title: "User not found" };
  return {
    title: `${user.name || user.username} - CodeShare`,
    description: user.bio || `Code snippets by ${user.username}`,
  };
}

function getInitial(user: { name?: string | null; username: string }) {
  return (user.name?.trim()?.[0] ?? user.username[0] ?? "?").toUpperCase();
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations();
  const session = await getServerSession(authOptions);
  const { id } = await params;

  // Fetch user with light include only for header (fast)
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      createdAt: true,
      // small counts for header KPIs
      _count: {
        select: { snippets: true },
      },
    },
  });

  if (!user) notFound();

  const isOwnProfile = session?.user?.id === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/"
            aria-label={t("common.backHome")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.backHome")}</span>
          </Link>
        </div>

        {/* Header */}
        <Card className="mb-6 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-primary/20">
                <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-primary to-primary/60">
                  {getInitial(user)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold truncate">
                      {user.name || user.username}
                    </h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      asChild
                    >
                      <Link
                        href={`/users/${user.id}/edit`}
                        aria-label={t("common.edit")}
                      >
                        <Edit className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">
                          {t("common.edit")}
                        </span>
                      </Link>
                    </Button>
                  )}
                </div>

                {user.bio && (
                  <p className="text-base sm:text-lg text-muted-foreground mb-4 line-clamp-5">
                    {user.bio}
                  </p>
                )}

                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
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

        <Suspense fallback={<KPISkeleton />}>
          <KPICards userId={user.id} />
        </Suspense>

        {/* Snippets sections (streamed) */}
        <div className="space-y-8">
          <Suspense
            fallback={
              <SectionHeaderWithSkeleton
                title="Public Snippets"
                countSkeleton
              />
            }
          >
            <PublicSnippetsSection userId={user.id} isOwn={isOwnProfile} />
          </Suspense>

          {isOwnProfile && (
            <>
              <Separator />
              <Suspense
                fallback={
                  <SectionHeaderWithSkeleton
                    title="Private Snippets"
                    countSkeleton
                  />
                }
              >
                <PrivateSnippets userId={user.id} isOwn={isOwnProfile} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
