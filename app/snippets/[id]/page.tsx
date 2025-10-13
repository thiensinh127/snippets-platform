import CopyButton from "@/components/common/CopyButton";
import DeleteButton from "@/components/common/DeleteButton";
import ShareButton from "@/components/common/ShareButton";
import StructuredData from "@/components/seo/StructuredData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCachedSnippet } from "@/lib/cache";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Clock, Edit, Eye } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
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
  params: { id: string };
}) {
  const t = await getTranslations();
  const { id } = params;
  const session = await getServerSession(authOptions);
  const snippet = await getCachedSnippet(id);
  if (!snippet) notFound();

  const isAuthor = session?.user?.id === snippet.authorId;

  return (
    <>
      <StructuredData type="article" data={snippet} />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <main className="container mx-auto max-w-5xl px-4 py-8">
          {/* Top actions */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Link>
            <div className="flex items-center gap-2">
              <ShareButton snippetId={snippet.id} title={snippet.title} />
              {isAuthor && (
                <>
                  <Link href={`/snippets/${snippet.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      {t("common.edit")}
                    </Button>
                  </Link>
                  <DeleteButton snippetId={snippet.id} />
                </>
              )}
            </div>
          </div>
          {/* Title + meta */}
          <div className="mb-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {snippet.language}
              </Badge>
              {snippet.complexity && (
                <Badge variant="outline" className="text-sm">
                  {snippet.complexity}
                </Badge>
              )}
            </div>

            <h1 className="mb-2 text-3xl font-bold leading-tight md:text-4xl">
              {snippet.title}
            </h1>

            {snippet.description && (
              <p className="mb-4 max-w-3xl text-base text-muted-foreground">
                {snippet.description}
              </p>
            )}

            {/* Tags */}
            {snippet.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {snippet.tags.map((t) => (
                  <Link key={t.slug} href={`/t/${t.slug}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                    >
                      {t.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/profile/${snippet.author.username}`}
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {(
                      snippet.author.name?.[0] ||
                      snippet.author.username[0] ||
                      "U"
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">@{snippet.author.username}</span>
              </Link>

              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {snippet.views} {t("common.views")}
              </span>

              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDistanceToNow(new Date(snippet.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Code block */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-3 border-b py-3">
              <div className="truncate text-sm text-muted-foreground">
                {snippet.fileName ||
                  `${snippet.slug}.${snippet.language.toLowerCase()}`}
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={snippet.code} />
                <ShareButton snippetId={snippet.id} title={snippet.title} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <SyntaxHighlighter
                language={snippet.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.9rem",
                }}
                showLineNumbers
                wrapLongLines
              >
                {snippet.code}
              </SyntaxHighlighter>
            </CardContent>
          </Card>

          {/* Author card */}
          <Card className="mt-6">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-semibold">
                {t("common.aboutAuthor")}
              </h2>
            </CardHeader>
            <CardContent>
              <Link
                href={`/profile/${snippet.author.username}`}
                className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-xl">
                    {(
                      snippet.author.name?.[0] ||
                      snippet.author.username[0] ||
                      "U"
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold">
                    {snippet.author.name || snippet.author.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{snippet.author.username}
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
