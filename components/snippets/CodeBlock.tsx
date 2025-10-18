"use client";

import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";

// Import themes
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { nord } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ghcolors } from "react-syntax-highlighter/dist/cjs/styles/prism";

const THEME_MAP = {
  vscDarkPlus,
  materialDark,
  oneDark,
  oneLight,
  nightOwl,
  nord,
  okaidia,
  dracula,
  atomDark,
  ghcolors,
} as const;

const CodeBlock = ({
  code,
  language,
  selectedTheme,
}: {
  code: string;
  language: string;
  selectedTheme: string;
}) => {
  const getThemeStyle = () => {
    const themeKey = selectedTheme as keyof typeof THEME_MAP;
    return THEME_MAP[themeKey] || THEME_MAP.vscDarkPlus;
  };

  return (
    <div className="flex-1 overflow-auto">
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={getThemeStyle()}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "transparent",
          fontSize: "0.875rem",
          height: "100%",
        }}
        lineNumberStyle={{
          minWidth: "3em",
          paddingRight: "1em",
          color: "#64748b",
          userSelect: "none",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
