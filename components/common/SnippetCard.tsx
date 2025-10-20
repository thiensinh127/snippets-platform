"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { codeToHtml } from "shiki";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SnippetDTO } from "@/types/snippet";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ShareButton from "./ShareButton";

// const SnippetDetailDialog = dynamic(
//   () => import("../snippets/SnippetDetailDialog"),
//   {
//     ssr: false,
//   }
// );

type Props = {
  snippet: SnippetDTO;
  actions?: React.ReactNode;
  compact?: boolean;
  isPrivate?: boolean;
};

export function SnippetCard({ snippet, actions, compact, isPrivate }: Props) {
  const createdAt = useMemo(
    () =>
      snippet.createdAt instanceof Date
        ? snippet.createdAt
        : new Date(snippet.createdAt),
    [snippet.createdAt]
  );
  // const [open, setOpen] = useState(false);
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const highlightCode = async () => {
      try {
        const html = await codeToHtml(snippet.code, {
          lang: snippet.language.toLowerCase(),
          theme: "dark-plus",
        });
        if (!cancelled) {
          setHighlightedCode(html);
        }
      } catch {
        if (!cancelled) {
          setHighlightedCode(
            `<pre style="padding: 12px; margin: 0;"><code>${snippet.code.replace(
              /[&<>"']/g,
              (m) =>
                ({
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#039;",
                })[m] || m
            )}</code></pre>`
          );
        }
      }
    };
    highlightCode();
    return () => {
      cancelled = true;
    };
  }, [snippet.code, snippet.language]);

  return (
    <>
      <Card
        // onClick={(e) => {
        //   const t = e.target as HTMLElement;
        //   if (t.closest("[data-prevent-card-open]")) return;
        //   setOpen(true);
        // }}
        className="group flex h-full flex-col gap-0 transition-shadow hover:shadow-lg"
        // onKeyDown={(e) => {
        //   if (e.key === "Enter" || e.key === " ") {
        //     e.preventDefault();
        //     setOpen(true);
        //   }
        // }}
        role="button"
        tabIndex={0}
        aria-label={`Open snippet: ${snippet.title}`}
        aria-describedby={`snippet-${snippet.id}-description`}
      >
        {/* Header */}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            {/* left */}
            <div className="min-w-0 flex-1">
              <div className=" flex items-center gap-2 justify-between">
                <CardTitle className="line-clamp-2 leading-snug">
                  {snippet.title}
                </CardTitle>
                <Badge variant="outline" className="capitalize text-xs">
                  {snippet.language}
                </Badge>
              </div>
            </div>

            {(!isPrivate || actions) && (
              <div
                className="shrink-0 pt-1"
                onClick={(e) => e.stopPropagation()}
                data-prevent-card-open
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-16">
                    {!isPrivate && (
                      <DropdownMenuItem
                        asChild
                        className="w-full cursor-pointer"
                      >
                        <ShareButton
                          isText={true}
                          snippetId={snippet.id}
                          title={snippet.title}
                        />
                      </DropdownMenuItem>
                    )}
                    {!isPrivate && actions && <DropdownMenuSeparator />}

                    {actions && actions}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          {snippet.description ? (
            <CardDescription
              id={`snippet-${snippet.id}-description`}
              className="line-clamp-1"
            >
              {snippet.description}
            </CardDescription>
          ) : (
            <CardDescription
              id={`snippet-${snippet.id}-description`}
              className="invisible select-none"
            >
              no-des
            </CardDescription>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent>
          {/* Tags */}
          <div className="mb-3 min-h-[28px] flex flex-wrap gap-1">
            {snippet.tags && snippet.tags.length > 0 ? (
              snippet.tags.slice(0, 3).map((tag, idx) => (
                <Badge
                  key={tag.id + idx.toString()}
                  variant="secondary"
                  className="text-[11px]"
                >
                  {tag.name}
                </Badge>
              ))
            ) : (
              <span className="invisible select-none">no-tags</span>
            )}
          </div>

          {/* Code Preview: fixed height + overflow hidden + hover feedback */}
          <div
            className={`
            relative mb-4 overflow-hidden rounded-md border
            bg-slate-900 ${compact ? "h-40 md:h-56" : "h-48 md:h-80"}
            transition-colors
            focus-within:border-slate-600
            group-hover:border-yellow-500
            `}
          >
            <div className="h-full w-full">
              {highlightedCode ? (
                <div
                  className="shiki-code-preview"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                  style={{ fontSize: "12px" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                  Loading...
                </div>
              )}
            </div>
            <style jsx global>{`
              .shiki-code-preview pre {
                margin: 0;
                padding: 12px;
                background: transparent !important;
              }
              .shiki-code-preview code {
                font-size: 12px;
                line-height: 1.5;
              }
            `}</style>
          </div>
        </CardContent>

        <CardFooter className="mt-auto border-t bg-background/80 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground !w-full">
            <Link
              href={`/profile/${snippet.author.id}`}
              className="flex items-center gap-2 hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <Avatar className="h-6 w-6">
                {snippet.author.avatarUrl ? (
                  <AvatarImage
                    alt={`${snippet.author.username}'s avatar`}
                    src={snippet.author.avatarUrl}
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

            <div className="flex items-center gap-3">
              {/* {typeof snippet.views === "number" && (
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {snippet.views}
              </span>
            )} */}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* {open && (
        <SnippetDetailDialog
          open={open}
          onOpenChange={setOpen}
          snippet={snippet}
        />
      )} */}
    </>
  );
}
