import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ArrowLeft,
  Eye,
  Clock,
  Edit,
  Trash2,
  Share2,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ShareButton from "@/components/common/ShareButton";
import DeleteButton from "@/components/common/DeleteButton";
import { getCachedSnippet } from "@/lib/cache";
import StructuredData from "@/components/seo/StructuredData";
import { Tags } from "@/types/snippet";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const snippet = await getCachedSnippet(params.id);

  if (!snippet) {
    return { title: "Snippet not found" };
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const snippetUrl = `${baseUrl}/snippets/${snippet.id}`;

  return {
    title: `${snippet.title} - CodeShare`,
    description:
      snippet.description ||
      `Code snippet in ${snippet.language} by ${snippet.author.username}`,
    keywords: [
      snippet.language,
      ...snippet.tags,
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
      tags: snippet.tags,
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
    alternates: {
      canonical: snippetUrl,
    },
  };
}

export default async function SnippetPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const snippet = await getCachedSnippet(params.id);

  if (!snippet) {
    notFound();
  }

  const isAuthor = session?.user?.id === snippet.authorId;

  return (
    <>
      <StructuredData type="article" data={snippet} />
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

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Snippet Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {snippet.language}
                  </Badge>
                  {snippet.complexity && (
                    <Badge variant="outline" className="text-sm">
                      {snippet.complexity}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <ShareButton snippetId={snippet.id} title={snippet.title} />
                  {isAuthor && (
                    <>
                      <Link href={`/snippets/${snippet.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <DeleteButton snippetId={snippet.id} />
                    </>
                  )}
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-2">{snippet.title}</h1>

              {snippet.description && (
                <p className="text-lg text-muted-foreground mb-4">
                  {snippet.description}
                </p>
              )}

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map((tap) => (
                    <Badge
                      key={tap.id}
                      variant="outline"
                      className="hover:bg-secondary cursor-pointer"
                    >
                      {tap.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <Link
                  href={`/profile/${snippet.author.username}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {snippet.author.name?.[0] || snippet.author.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{snippet.author.username}</span>
                </Link>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {snippet.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(snippet.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardHeader>
          </Card>

          {/* Code Block */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <SyntaxHighlighter
                  language={snippet.language.toLowerCase()}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                  showLineNumbers
                >
                  {snippet.code}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>

          {/* Author Card */}
          <Card className="mt-6">
            <CardHeader>
              <h2 className="text-xl font-semibold mb-4">About the Author</h2>
              <Link
                href={`/profile/${snippet.author.username}`}
                className="flex items-start gap-4 hover:bg-secondary/50 rounded-lg p-4 transition-colors"
              >
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-2xl">
                    {snippet.author.name?.[0] || snippet.author.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {snippet.author.name || snippet.author.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    @{snippet.author.username}
                  </p>
                  {snippet.author.bio && (
                    <p className="mt-2 text-sm">{snippet.author.bio}</p>
                  )}
                </div>
              </Link>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
