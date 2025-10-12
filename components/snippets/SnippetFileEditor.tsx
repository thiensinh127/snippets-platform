"use client";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function SnippetFileEditor({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
}) {
  const lines = React.useMemo(
    () => Math.max(1, value.split("\n").length),
    [value]
  );
  const numbers = Array.from({ length: lines }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "relative grid grid-cols-[56px_1fr] border rounded-md overflow-hidden",
        invalid && "border-red-500"
      )}
    >
      <div className="bg-muted/60 text-muted-foreground text-xs select-none p-3 pr-0 leading-5">
        <div className="tabular-nums">
          {numbers.map((n) => (
            <div key={n} className="h-5">
              {n}
            </div>
          ))}
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here"
        className="border-0 rounded-none font-mono text-sm min-h-[260px] focus-visible:ring-0 resize-y"
      />
    </div>
  );
}
