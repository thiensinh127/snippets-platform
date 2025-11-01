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

const AVAILABLE_THEMES = [
  { value: "vscDarkPlus", label: "VS Code Dark" },
  { value: "materialDark", label: "Material Dark" },
  { value: "oneDark", label: "One Dark" },
  { value: "oneLight", label: "One Light" },
  { value: "nightOwl", label: "Night Owl" },
  { value: "nord", label: "Nord" },
  { value: "okaidia", label: "Monokai" },
  { value: "dracula", label: "Dracula" },
  { value: "atomDark", label: "Atom Dark" },
  { value: "ghcolors", label: "GitHub" },
] as const;

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
  const [selectedTheme, setSelectedTheme] = React.useState("vscDarkPlus");
  const [themeStyle, setThemeStyle] = React.useState<any | null>(null);
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

  React.useEffect(() => {
    let cancelled = false;
    const loadTheme = async (name: string) => {
      try {
        let mod: any;
        switch (name) {
          case "materialDark":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/material-dark"
            );
            break;
          case "oneDark":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/one-dark"
            );
            break;
          case "oneLight":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/one-light"
            );
            break;
          case "nightOwl":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/night-owl"
            );
            break;
          case "nord":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/nord"
            );
            break;
          case "okaidia":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/okaidia"
            );
            break;
          case "dracula":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/dracula"
            );
            break;
          case "atomDark":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark"
            );
            break;
          case "ghcolors":
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/ghcolors"
            );
            break;
          case "vscDarkPlus":
          default:
            mod = await import(
              "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"
            );
            break;
        }
        if (!cancelled) setThemeStyle(mod.default || mod);
      } catch {
        // Fallback to vsc-dark-plus if anything fails
        const mod = await import(
          "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus"
        );
        if (!cancelled) setThemeStyle(mod.default || mod);
      }
    };
    loadTheme(selectedTheme);
    return () => {
      cancelled = true;
    };
  }, [selectedTheme]);

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
            {/* Theme Selector */}
            <div className="flex items-center gap-2 mr-2">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="h-8 w-[120px] text-xs border-slate-700 bg-slate-800/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_THEMES.map((theme) => (
                    <SelectItem key={theme.value} value={theme.value}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Copy Button */}
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
            style={themeStyle ?? {}}
            showLineNumbers
            wrapLongLines
            // customStyle={{
            //   margin: 0,
            //   padding: "1.5rem",
            //   background: "transparent",
            //   fontSize: "0.875rem",
            //   height: "100%",
            // }}
            // lineNumberStyle={{
            //   minWidth: "3em",
            //   paddingRight: "1em",
            //   color: "#64748b",
            //   userSelect: "none",
            // }}
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
