"use client";
import React from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Maximize2,
  Minimize2,
  AlignLeft,
  Eye,
  Code,
  Settings,
  Wand2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.Prism),
  { ssr: false }
);

// Import specific themes
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ghcolors } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { hopscotch } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { pojoaque } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { xonokai } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cb } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";

const THEME_MAP = {
  vscDarkPlus,
  materialDark,
  oneDark,
  oneLight,
  nightOwl,
  nord,
  okaidia,
  dracula,
  synthwave84,
  atomDark,
  ghcolors,
  hopscotch,
  pojoaque,
  xonokai,
  cb,
  darcula,
} as const;

const AVAILABLE_THEMES = [
  { value: "vscDarkPlus", label: "VS Code Dark" },
  { value: "materialDark", label: "Material Dark" },
  { value: "oneDark", label: "One Dark" },
  { value: "oneLight", label: "One Light" },
  { value: "nightOwl", label: "Night Owl" },
  { value: "nord", label: "Nord" },
  { value: "okaidia", label: "Monokai" },
  { value: "dracula", label: "Dracula" },
  { value: "synthwave84", label: "Synthwave 84" },
  { value: "atomDark", label: "Atom Dark" },
  { value: "ghcolors", label: "GitHub" },
  { value: "hopscotch", label: "Hopscotch" },
  { value: "pojoaque", label: "Pojoaque" },
  { value: "xonokai", label: "Xonokai" },
  { value: "cb", label: "Code Blocks" },
  { value: "darcula", label: "Darcula" },
] as const;

export default function SnippetFileEditor({
  value,
  onChange,
  invalid,
  language = "javascript",
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  language?: string;
}) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"edit" | "preview">("edit");
  const [selectedTheme, setSelectedTheme] = React.useState("vscDarkPlus");
  const [isFormatting, setIsFormatting] = React.useState(false);
  const [formatError, setFormatError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
  }, [isFullscreen]);

  const lines = React.useMemo(
    () => Math.max(1, value.split("\n").length),
    [value]
  );
  const numbers = Array.from({ length: lines }, (_, i) => i + 1);

  const handleAlignLeft = () => {
    const lines = value.split("\n");
    const minIndent = Math.min(
      ...lines
        .filter((l) => l.trim())
        .map((l) => l.match(/^(\s*)/)?.[0].length || 0)
    );
    const newValue = lines.map((l) => l.slice(minIndent)).join("\n");
    onChange(newValue);
  };

  const handleFormatCode = React.useCallback(async () => {
    if (!value.trim() || isFormatting) return;

    setIsFormatting(true);
    setFormatError(null);

    try {
      // Dynamically import prettier
      const prettier = await import("prettier/standalone");
      const parserBabel = await import("prettier/plugins/babel");
      const parserEstree = await import("prettier/plugins/estree");
      const parserTypescript = await import("prettier/plugins/typescript");
      const parserHtml = await import("prettier/plugins/html");
      const parserCss = await import("prettier/plugins/postcss");
      const parserMarkdown = await import("prettier/plugins/markdown");

      // Map language to prettier parser
      const parserMap: Record<string, string> = {
        javascript: "babel",
        typescript: "typescript",
        jsx: "babel",
        tsx: "typescript",
        json: "json",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        markdown: "markdown",
        yaml: "yaml",
        graphql: "graphql",
      };

      const parser = parserMap[language.toLowerCase()] || "babel";

      // Get available plugins based on parser
      const plugins = [parserBabel.default, parserEstree.default];
      if (["typescript", "tsx"].includes(parser)) {
        plugins.push(parserTypescript.default);
      }
      if (parser === "html") {
        plugins.push(parserHtml.default);
      }
      if (["css", "scss", "less"].includes(parser)) {
        plugins.push(parserCss.default);
      }
      if (parser === "markdown") {
        plugins.push(parserMarkdown.default);
      }

      const formatted = await prettier.format(value, {
        parser,
        plugins,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: "always",
      });

      onChange(formatted);
      setFormatError(null);
    } catch (error) {
      console.error("Format error:", error);

      // Extract error message
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Check if it's a syntax error
      if (
        errorMessage.includes("SyntaxError") ||
        errorMessage.includes("Unexpected token")
      ) {
        setFormatError(
          "Syntax error in code. Please fix the syntax before formatting."
        );
      } else {
        setFormatError(
          "Unable to format code. Try selecting a different language."
        );
      }

      // Try fallback formatting only for JSON
      if (language.toLowerCase() === "json") {
        try {
          const formatted = JSON.stringify(JSON.parse(value), null, 2);
          onChange(formatted);
          setFormatError(null);
        } catch {
          // Keep the error message
        }
      }
    } finally {
      setIsFormatting(false);
      // Auto-hide error after 5 seconds
      if (formatError) {
        setTimeout(() => setFormatError(null), 5000);
      }
    }
  }, [value, language, onChange, isFormatting, formatError]);

  // Keyboard shortcut for formatting (Shift+Alt+F like VSCode)
  React.useEffect(() => {
    if (viewMode !== "edit") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFormatCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleFormatCode]);

  const getThemeStyle = () => {
    const themeKey = selectedTheme as keyof typeof THEME_MAP;
    return THEME_MAP[themeKey] || THEME_MAP.vscDarkPlus;
  };

  const renderEditor = () => {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-background flex flex-col",
          isFullscreen
            ? "h-screen"
            : "border rounded-md" + (invalid ? " border-red-500" : "")
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center gap-2 p-2 border-b bg-muted/40">
            {/* Left side - View Mode Toggles */}
            <div className="flex items-center gap-1 bg-background/50 rounded-md p-1">
              <button
                onClick={() => setViewMode("edit")}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "edit"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                title="Edit mode"
              >
                <Code className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5",
                  viewMode === "preview"
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                title="Preview mode"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Selector - only show in preview mode */}
              {viewMode === "preview" && (
                <div className="flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                  <Select
                    value={selectedTheme}
                    onValueChange={setSelectedTheme}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue placeholder="Select theme" />
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
              )}

              {/* Format Code - only show in edit mode */}
              {viewMode === "edit" && (
                <button
                  onClick={handleFormatCode}
                  disabled={isFormatting || !value.trim()}
                  className={cn(
                    "p-2 hover:bg-muted rounded-md transition-all relative group",
                    isFormatting && "animate-pulse"
                  )}
                  title="Format code (Shift+Alt+F)"
                >
                  <Wand2
                    className={cn(
                      "w-4 h-4",
                      isFormatting && "text-blue-500",
                      !value.trim() && "text-muted-foreground/50"
                    )}
                  />
                  {isFormatting && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded whitespace-nowrap">
                      Formatting...
                    </span>
                  )}
                </button>
              )}

              {/* Align Left - only show in edit mode */}
              {viewMode === "edit" && (
                <button
                  onClick={handleAlignLeft}
                  className="p-2 hover:bg-muted rounded-md"
                  title="Align left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen Toggle */}
              {!isFullscreen ? (
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 hover:bg-muted rounded-md"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 hover:bg-muted rounded-md"
                  title="Exit fullscreen"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Format Error Banner */}
          {formatError && (
            <div className="bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-800 px-4 py-2 flex items-center gap-2 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-300 flex-1">
                {formatError}
              </p>
              <button
                onClick={() => setFormatError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                aria-label="Dismiss"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Editor Content */}
        {viewMode === "edit" ? (
          <div className="relative grid grid-cols-[56px_1fr] flex-1 overflow-hidden">
            {/* Line numbers */}
            <div className="bg-muted/60 text-muted-foreground text-xs select-none p-3 pr-0 leading-5 overflow-y-auto">
              <div className="tabular-nums">
                {numbers.map((n) => (
                  <div key={n} className="h-5">
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste your code here"
              className={cn(
                "border-0 rounded-none font-mono text-sm focus-visible:ring-0 h-full",
                isFullscreen ? "resize-none" : "min-h-[260px] resize-y"
              )}
            />
          </div>
        ) : (
          /* Preview Mode */
          <div className="flex-1 overflow-auto bg-slate-950">
            {mounted && value ? (
              <SyntaxHighlighter
                language={language.toLowerCase()}
                style={getThemeStyle()}
                showLineNumbers
                wrapLongLines
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "transparent",
                  fontSize: "0.875rem",
                  height: "100%",
                }}
                lineNumberStyle={{
                  minWidth: "3em",
                  paddingRight: "1em",
                  color: "#6b7280",
                  userSelect: "none",
                }}
              >
                {value}
              </SyntaxHighlighter>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">No code to preview</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isFullscreen && mounted) {
    return (
      <>
        {/* Placeholder khi fullscreen */}
        <div className="relative border rounded-md overflow-hidden bg-muted/20 min-h-[260px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Editor đang ở chế độ fullscreen
          </p>
        </div>

        {/* Render fullscreen editor qua portal */}
        {createPortal(
          <div className="fixed inset-0 z-[9999] bg-background">
            {renderEditor()}
          </div>,
          document.body
        )}
      </>
    );
  }

  return renderEditor();
}
