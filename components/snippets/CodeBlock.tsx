"use client";

import React from "react";
import { codeToHtml } from "shiki";

// Map theme names to Shiki themes
const getShikiTheme = (themeName: string): string => {
  const themeMap: Record<string, string> = {
    vscDarkPlus: "dark-plus",
    materialDark: "material-theme-darker",
    oneDark: "one-dark-pro",
    oneLight: "one-light",
    nightOwl: "night-owl",
    nord: "nord",
    okaidia: "monokai",
    dracula: "dracula",
    atomDark: "atom-one-dark",
    ghcolors: "github-light",
  };
  return themeMap[themeName] || "dark-plus";
};

// Map language names to Shiki-compatible names
const getShikiLanguage = (language: string): string => {
  const langMap: Record<string, string> = {
    javascript: "javascript",
    js: "javascript",
    typescript: "typescript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    python: "python",
    py: "python",
    java: "java",
    cpp: "cpp",
    "c++": "cpp",
    c: "c",
    csharp: "csharp",
    "c#": "csharp",
    php: "php",
    ruby: "ruby",
    go: "go",
    rust: "rust",
    swift: "swift",
    kotlin: "kotlin",
    sql: "sql",
    html: "html",
    css: "css",
    scss: "scss",
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    markdown: "markdown",
    md: "markdown",
    bash: "bash",
    sh: "bash",
    shell: "bash",
    text: "txt",
  };
  const lang = language.toLowerCase();
  return langMap[lang] || "javascript";
};

const CodeBlock = ({
  code,
  language,
  selectedTheme,
}: {
  code: string;
  language: string;
  selectedTheme: string;
}) => {
  const [highlightedCode, setHighlightedCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    const highlightCode = async () => {
      try {
        setIsLoading(true);
        const shikiTheme = getShikiTheme(selectedTheme);
        const shikiLang = getShikiLanguage(language);

        const html = await codeToHtml(code, {
          lang: shikiLang,
          theme: shikiTheme,
        });

        if (!cancelled) {
          setHighlightedCode(html);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        // Fallback to plain text with pre-wrap
        if (!cancelled) {
          setHighlightedCode(
            `<pre style="padding: 1.5rem; background: transparent; margin: 0; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeHtml(
              code
            )}</code></pre>`
          );
          setIsLoading(false);
        }
      }
    };

    highlightCode();

    return () => {
      cancelled = true;
    };
  }, [code, language, selectedTheme]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-950 p-6">
        <div className="text-slate-400 text-sm">
          Loading syntax highlighting...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div
        className="shiki-code-block"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        style={{
          fontSize: "0.875rem",
          lineHeight: "1.7",
        }}
      />
      <style jsx global>{`
        .shiki-code-block pre {
          margin: 0;
          padding: 1.5rem;
          background: transparent !important;
          overflow-x: auto;
        }
        .shiki-code-block code {
          font-family: "Consolas", "Monaco", "Courier New", monospace;
          font-size: 0.875rem;
          line-height: 1.7;
          counter-reset: line;
        }
        .shiki-code-block code .line {
          counter-increment: line;
          display: block;
        }
        .shiki-code-block code .line:before {
          content: counter(line);
          display: inline-block;
          width: 3em;
          padding-right: 1em;
          color: #64748b;
          user-select: none;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

// Helper function to escape HTML
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export default CodeBlock;
