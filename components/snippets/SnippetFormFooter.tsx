"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

export default function SnippetFormFooter({
  isPublic,
  onPublicChange,
  onDiscard,
  onSave,
  saving,
}: {
  isPublic: boolean;
  onPublicChange: (v: boolean) => void;
  onDiscard: () => void;
  onSave: () => void;
  saving: boolean;
}) {
  return (
    <div className="flex items-center justify-between pt-4 p-6">
      <div className="flex items-center gap-3">
        <Switch checked={isPublic} onCheckedChange={onPublicChange} />
        <span className="text-sm">Public</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onDiscard} disabled={saving}>
          Discard
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
