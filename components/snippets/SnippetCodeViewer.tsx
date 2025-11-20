"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Download,
  Maximize2,
  Minimize2,
  Settings,
} from "lucide-react";
import React from "react";
import { createPortal } from "react-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";

// const AVAILABLE_THEMES = [
//   { value: "vscDarkPlus", label: "VS Code Dark" },
//   { value: "materialDark", label: "Material Dark" },
//   { value: "oneDark", label: "One Dark" },
//   { value: "oneLight", label: "One Light" },
//   { value: "nightOwl", label: "Night Owl" },
//   { value: "nord", label: "Nord" },
//   { value: "okaidia", label: "Monokai" },
//   { value: "dracula", label: "Dracula" },
//   { value: "atomDark", label: "Atom Dark" },
//   { value: "ghcolors", label: "GitHub" },
// ] as const;

interface SnippetCodeViewerProps {
  code: string;
  language: string;
  fileName?: string;
  slug: string;
}

export default function SnippetCodeViewer({
  code,
  language,
  fileName,
  slug,
}: SnippetCodeViewerProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = language.toLowerCase();
    const filename = fileName || `${slug}.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              {fileName || `${slug}.${language.toLowerCase()}`}
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
            language={language.toLowerCase()}
            style={vscDarkPlus ?? {}}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
            }}
          >
            {code}
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

  return renderViewer();
}
