"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  snippetId: string;
  title?: string;
  isText?: boolean;
};

export default function ShareButton({ snippetId, isText = true }: Props) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  };

  const copyLink = useCallback(async (url: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ok = fallbackCopy(url);
        if (!ok) throw new Error("execCommand failed");
      }
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link");
    }
  }, []);

  const handleShare = useCallback(
    async (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      const url = `${window.location.origin}/snippets/${snippetId}`;
      await copyLink(url);
    },
    [snippetId, copyLink]
  );

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      aria-label="Copy snippet link"
      className="transition-all"
      data-prevent-card-open
      onPointerDown={(e) => e.stopPropagation()}
      onClick={handleShare}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          void handleShare(e);
        } else {
          e.stopPropagation();
        }
      }}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2 text-green-600" />
          {isText && "Copied"}
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          {isText && "Share"}
        </>
      )}
    </Button>
  );
}
