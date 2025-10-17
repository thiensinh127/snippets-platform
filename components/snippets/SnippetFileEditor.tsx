"use client";
import React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  Maximize2,
  Minimize2,
  AlignLeft,
  Wand2,
  AlertCircle,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { xml } from "@codemirror/lang-xml";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import { rust } from "@codemirror/lang-rust";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";

// Language mapping for CodeMirror
const getLanguageExtension = (language: string) => {
  const lang = language.toLowerCase();
  switch (lang) {
    case "javascript":
    case "js":
      return javascript({ jsx: false });
    case "jsx":
      return javascript({ jsx: true });
    case "typescript":
    case "ts":
      return javascript({ typescript: true, jsx: false });
    case "tsx":
      return javascript({ typescript: true, jsx: true });
    case "html":
      return html();
    case "css":
    case "scss":
    case "less":
      return css();
    case "json":
      return json();
    case "python":
    case "py":
      return python();
    case "php":
      return php();
    case "java":
      return java();
    case "c++":
    case "cpp":
    case "c":
      return cpp();
    case "sql":
      return sql();
    case "xml":
      return xml();
    case "markdown":
    case "md":
      return markdown();
    case "yaml":
    case "yml":
      return yaml();
    case "rust":
    case "rs":
      return rust();
    default:
      return javascript(); // fallback
  }
};

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
  const t = useTranslations("editor");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isFormatting, setIsFormatting] = React.useState(false);
  const [formatError, setFormatError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

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
        js: "babel",
        jsx: "babel",
        typescript: "typescript",
        ts: "typescript",
        tsx: "typescript",
        json: "json",
        html: "html",
        css: "css",
        scss: "scss",
        less: "less",
        markdown: "markdown",
        md: "markdown",
        yaml: "yaml",
        yml: "yaml",
        graphql: "graphql",
      };

      const parser = parserMap[language.toLowerCase()] || "babel";

      // Get available plugins based on parser
      const plugins = [parserBabel.default, parserEstree.default];
      if (["typescript", "tsx", "ts"].includes(parser)) {
        plugins.push(parserTypescript.default);
      }
      if (parser === "html") {
        plugins.push(parserHtml.default);
      }
      if (["css", "scss", "less"].includes(parser)) {
        plugins.push(parserCss.default);
      }
      if (["markdown", "md"].includes(parser)) {
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
        setFormatError(t("syntaxError"));
      } else {
        setFormatError(t("formatError"));
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
  }, [value, language, onChange, isFormatting, formatError, t]);

  // Keyboard shortcut for formatting (Shift+Alt+F like VSCode)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleFormatCode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFormatCode]);

  const languageExtension = React.useMemo(
    () => getLanguageExtension(language),
    [language]
  );

  const extensions = React.useMemo(() => {
    return [languageExtension, EditorView.lineWrapping];
  }, [languageExtension]);

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
            {/* Left side - Title */}
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {t("title")}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
              {/* Format Code */}
              <button
                type="button"
                onClick={handleFormatCode}
                disabled={isFormatting || !value.trim()}
                className={cn(
                  "p-2 hover:bg-muted rounded-md transition-all relative group",
                  isFormatting && "animate-pulse"
                )}
                title={t("formatCodeShortcut")}
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
                    {t("formatting")}
                  </span>
                )}
              </button>

              {/* Align Left */}
              <button
                type="button"
                onClick={handleAlignLeft}
                className="p-2 hover:bg-muted rounded-md"
                title={t("alignLeft")}
              >
                <AlignLeft className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              {!isFullscreen ? (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 hover:bg-muted rounded-md"
                  title={t("fullscreen")}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 hover:bg-muted rounded-md"
                  title={t("exitFullscreen")}
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
                type="button"
                onClick={() => setFormatError(null)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                aria-label={t("dismiss")}
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

        {/* CodeMirror Editor */}
        {mounted ? (
          <div className="flex-1 overflow-auto">
            <CodeMirror
              value={value}
              height={isFullscreen ? "calc(100vh - 49px)" : "400px"}
              theme={oneDark}
              extensions={extensions}
              onChange={(value) => onChange(value)}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                foldGutter: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                closeBracketsKeymap: true,
                defaultKeymap: true,
                searchKeymap: true,
                historyKeymap: true,
                foldKeymap: true,
                completionKeymap: true,
                lintKeymap: true,
              }}
              className={cn("codemirror-wrapper", isFullscreen && "h-full")}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <p className="text-sm text-muted-foreground">{t("loading")}</p>
          </div>
        )}
      </div>
    );
  };

  if (isFullscreen && mounted) {
    return (
      <>
        <div className="relative border rounded-md overflow-hidden bg-muted/20 min-h-[400px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {t("fullscreenPlaceholder")}
          </p>
        </div>

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
