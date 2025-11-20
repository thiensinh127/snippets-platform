"use client";

import { formatDistanceToNow } from "date-fns";
import {
  Check,
  Clock,
  Copy,
  Download,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SnippetDTO } from "@/types/snippet";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ShareButton from "./ShareButton";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";
import { TAG_COLORS } from "@/constants";

type Props = {
  snippet: SnippetDTO;
  actions?: React.ReactNode;
  compact?: boolean;
  isPrivate?: boolean;
};

export function SnippetCard({ snippet, actions, compact, isPrivate }: Props) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = snippet.language.toLowerCase();
    const filename = snippet.fileName || `${snippet.slug}.${extension}`;
    const blob = new Blob([snippet.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const createdAt = useMemo(
    () =>
      snippet.createdAt instanceof Date
        ? snippet.createdAt
        : new Date(snippet.createdAt),
    [snippet.createdAt]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const renderViewer = () => {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-slate-950 flex flex-col",
          isFullscreen ? "h-screen w-screen" : "border rounded-lg"
        )}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-4 py-2 backdrop-blur-sm">
          {/* Left: Filename */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-slate-400 truncate">
              {snippet.fileName ||
                `${snippet.slug}.${snippet.language.toLowerCase()}`}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>

            {/* Download Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDownload}
              className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800"
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </Button>

            {/* Fullscreen Toggle */}
            {!isFullscreen ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(true)}
                className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(false)}
                className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800"
                title="Exit fullscreen"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto">
          <SyntaxHighlighter
            language={snippet.language.toLowerCase()}
            style={vscDarkPlus ?? {}}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  if (isFullscreen && mounted) {
    return (
      <>
        {/* Placeholder */}
        <div className="relative border rounded-lg overflow-hidden bg-slate-950/20 min-h-[400px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Viewer is in fullscreen mode
          </p>
        </div>

        {/* Fullscreen Portal */}
        {createPortal(
          <div className="fixed inset-0 z-[9999] bg-slate-950">
            {renderViewer()}
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <>
      <Card
        className="group flex h-full flex-col gap-0 transition-shadow hover:shadow-lg"
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
                <CardTitle className="line-clamp-2 leading-snug  ">
                  <Link
                    href={`/snippets/${snippet.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="line-clamp-2 leading-snug transition-all duration-300  hover:underline "
                  >
                    {snippet.title}
                  </Link>
                </CardTitle>
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 px-2"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>

              {/* Download Button */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDownload}
                className="h-8 px-2"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsFullscreen(true)}
                className="h-8 px-2"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              {actions ? <div data-prevent-card-open>{actions}</div> : null}
            </div>
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
          <div className="flex gap-2 items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div>{snippet?.fileName}</div>
              <Badge variant="outline" className="capitalize text-xs">
                {snippet.language}
              </Badge>
            </div>

            <div className="min-h-[28px] flex flex-wrap gap-1">
              {snippet.tags && snippet.tags.length > 0 ? (
                snippet.tags.slice(0, 3).map((tag, idx) => {
                  const color = TAG_COLORS[idx % TAG_COLORS.length];

                  return (
                    <Badge
                      key={tag.id + idx}
                      className={cn(
                        "text-[11px] border",
                        color.bg,
                        color.text,
                        color.border
                      )}
                    >
                      {tag.name}
                    </Badge>
                  );
                })
              ) : (
                <span className="invisible select-none">no-tags</span>
              )}
            </div>
          </div>

          {/* Tags */}

          {/* Code Preview: fixed height + overflow hidden + hover feedback */}
          <div
            className={cn(
              "relative overflow-auto rounded-md border bg-slate-900",
              "hide-scrollbar",
              compact ? "h-40 md:h-56" : "h-48 md:h-80"
            )}
            title="Click and drag to select code"
          >
            <div
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              className="h-full w-full"
            >
              <SyntaxHighlighter
                language={snippet.language.toLowerCase()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 0,
                  background: "transparent",
                  fontSize: "12px",
                  padding: "12px",
                }}
                wrapLongLines
              >
                {snippet.code}
              </SyntaxHighlighter>
            </div>
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

              {!isPrivate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ShareButton
                        isText={false}
                        snippetId={snippet.id}
                        title={snippet.title}
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      title="Share"
                      side="top"
                      className="text-xs"
                    >
                      Share
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
