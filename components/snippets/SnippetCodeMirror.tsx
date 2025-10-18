import ReactCodeMirror from "@uiw/react-codemirror";
import React from "react";
import { cn } from "@/lib/utils";

const SnippetCodeMirror = ({
  value,
  onChange,
  extensions,
  isFullscreen,
  oneDark,
}: {
  value: string;
  onChange: (v: string) => void;
  extensions?: any;
  isFullscreen?: boolean;
  oneDark?: any;
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <ReactCodeMirror
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
  );
};

export default SnippetCodeMirror;
