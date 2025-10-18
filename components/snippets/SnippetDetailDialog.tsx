"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SnippetDTO } from "@/types/snippet";
import { formatDistanceToNow } from "date-fns";
import { Clock, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ShareButton from "../common/ShareButton";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  snippet: SnippetDTO;
};

export default function SnippetDetailDialog({
  open,
  onOpenChange,
  snippet,
}: Props) {
  const createdAt = useMemo(
    () =>
      snippet.createdAt instanceof Date
        ? snippet.createdAt
        : new Date(snippet.createdAt),
    [snippet.createdAt]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl gap-0 p-0"
        aria-describedby="snippet-description"
        onPointerDownOutside={(e) => {
          const el = e.target as HTMLElement;
          if (el.closest("pre")) e.preventDefault();
        }}
      >
        <DialogHeader className="px-6 pb-3 pt-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="line-clamp-2 text-xl leading-snug">
                {snippet.title}
              </DialogTitle>
              {snippet.description && (
                <p
                  id="snippet-description"
                  className="mt-1 line-clamp-2 text-sm text-muted-foreground"
                >
                  {snippet.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="capitalize">
                  {snippet.language}
                </Badge>
                {snippet.complexity && (
                  <Badge variant="outline">{snippet.complexity}</Badge>
                )}
                {snippet.tags?.length > 0 && (
                  <div className="ml-1 flex flex-wrap gap-1">
                    {snippet.tags.slice(0, 5).map((tag, index) => (
                      <Badge
                        key={tag.id + index.toString()}
                        variant="outline"
                        className="text-[11px]"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 pr-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(snippet.code)}
              >
                <Copy className="mr-1 h-4 w-4" />{" "}
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Link
                href={`/snippets/${snippet.id}`}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </Button>
              </Link>
              <ShareButton
                isText={false}
                snippetId={snippet.id}
                title={snippet.title}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground pr-6">
            <Link
              href={`/profile/${snippet.author.username}`}
              className="flex items-center gap-2 hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6">
                {snippet.author.avatarUrl ? (
                  <AvatarImage
                    src={snippet.author.avatarUrl}
                    alt={`${snippet.author.username}'s avatar`}
                  />
                ) : null}
                <AvatarFallback
                  aria-label={`${snippet.author.username}'s avatar`}
                >
                  {(
                    snippet.author.name?.[0] ||
                    snippet.author.username[0] ||
                    "U"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>@{snippet.author.username}</span>
            </Link>

            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="h-[35vh] sm:h-[60vh] md:-[70vh] overflow-auto px-6 pb-5">
          <div className="overflow-hidden rounded-lg border bg-slate-900 w-full h-full">
            <SyntaxHighlighter
              language={snippet.language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: "transparent",
                fontSize: "13px",
                padding: "16px",
              }}
              wrapLongLines
            >
              {snippet.code}
            </SyntaxHighlighter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
