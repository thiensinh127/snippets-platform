import DeleteButton from "@/components/common/DeleteButton";
import ShareButton from "@/components/common/ShareButton";
import StructuredData from "@/components/seo/StructuredData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth";
import { getCachedSnippet } from "@/lib/cache";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, Edit, Eye, Globe, Lock } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

const SnippetCodeViewer = dynamic(
  () => import("@/components/snippets/SnippetCodeViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full border rounded-lg bg-muted/20 animate-pulse" />
    ),
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const snippet = await getCachedSnippet(id);
  if (!snippet) return { title: "Snippet not found" };

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const snippetUrl = `${baseUrl}/snippets/${snippet.id}`;

  return {
    title: `${snippet.title} - CodeShare`,
    description:
      snippet.description ||
      `Code snippet in ${snippet.language} by ${snippet.author.username}`,
    keywords: [
      snippet.language,
      ...snippet.tags.map((t) => t.name),
      "code snippet",
      "programming",
    ],
    authors: [{ name: snippet.author.name || snippet.author.username }],
    openGraph: {
      title: snippet.title,
      description: snippet.description || `Code snippet in ${snippet.language}`,
      type: "article",
      url: snippetUrl,
      siteName: "CodeShare",
      locale: "en_US",
      publishedTime: snippet.createdAt.toISOString(),
      modifiedTime: snippet.updatedAt.toISOString(),
      authors: [snippet.author.name || snippet.author.username],
      tags: snippet.tags.map((t) => t.name),
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(
            snippet.title
          )}&language=${snippet.language}`,
          width: 1200,
          height: 630,
          alt: `${snippet.title} - ${snippet.language} code snippet`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: snippet.title,
      description: snippet.description || `Code snippet in ${snippet.language}`,
      images: [
        `${baseUrl}/api/og?title=${encodeURIComponent(
          snippet.title
        )}&language=${snippet.language}`,
      ],
    },
    alternates: { canonical: snippetUrl },
  };
}

export default async function SnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const snippet = await getCachedSnippet(id);
  if (!snippet) notFound();

  const isAuthor = session?.user?.id === snippet.authorId;

  return (
    <>
      <StructuredData type="article" data={snippet} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="container mx-auto max-w-6xl px-4 py-6 md:py-8">
          {/* Header: Back + Actions */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{t("common.back")}</span>
            </Link>

            <div className="flex items-center gap-2">
              <ShareButton snippetId={snippet.id} title={snippet.title} />
              {isAuthor && (
                <>
                  <Link href={`/snippets/${snippet.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">
                        {t("common.edit")}
                      </span>
                    </Button>
                  </Link>
                  <DeleteButton snippetId={snippet.id} />
                </>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Code Viewer (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Card */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-sm font-medium"
                      >
                        {snippet.language}
                      </Badge>
                      {snippet.complexity && (
                        <Badge variant="outline" className="text-sm">
                          {snippet.complexity}
                        </Badge>
                      )}
                      <Badge
                        variant={snippet.isPublic ? "default" : "secondary"}
                        className="text-sm flex items-center gap-1"
                      >
                        {snippet.isPublic ? (
                          <>
                            <Globe className="h-3 w-3" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3" />
                            Private
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      {snippet.title}
                    </h1>

                    {/* Description */}
                    {snippet.description && (
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {snippet.description}
                      </p>
                    )}

                    {/* Tags */}
                    {snippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {snippet.tags.map((t) => (
                          <Link key={t.slug} href={`/t/${t.slug}`}>
                            <Badge
                              variant="outline"
                              className="cursor-pointer hover:bg-secondary transition-colors"
                            >
                              #{t.name}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Code Viewer */}
              <SnippetCodeViewer
                code={snippet.code}
                language={snippet.language}
                fileName={snippet.fileName || undefined}
                slug={snippet.slug}
              />
            </div>

            {/* Right Column: Metadata & Author (1/3 width on large screens) */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                    Statistics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>Views</span>
                      </div>
                      <span className="font-semibold">{snippet.views}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Created</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatDistanceToNow(new Date(snippet.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Author Card */}
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                    Author
                  </h3>
                  <Link
                    href={`/profile/${snippet.author.username}`}
                    className="flex items-start gap-3 rounded-lg p-3 -m-3 transition-colors hover:bg-muted/50"
                  >
                    <Avatar className="h-12 w-12 border-2">
                      <AvatarFallback className="text-lg font-semibold">
                        {(
                          snippet.author.name?.[0] ||
                          snippet.author.username[0] ||
                          "U"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold truncate">
                        {snippet.author.name || snippet.author.username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @{snippet.author.username}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
