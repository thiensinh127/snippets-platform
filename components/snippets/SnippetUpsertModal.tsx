"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import SnippetFileEditor from "./SnippetFileEditor";
import SnippetFormFooter from "./SnippetFormFooter";
import TagMultiSelect, { TagOption } from "./TagMultiSelect";
import SearchableSelect from "../common/SearchableSelect";

const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean().default(true),
  fileName: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
});

type FormValues = {
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  fileName: string;
  language: string;
  code: string;
};

type SnippetUpsertModalProps = {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSuccess?: (snippet: any) => void;
  initial?: {
    id: string;
    title: string;
    description?: string | null;
    code: string;
    language: string;
    fileName?: string | null;
    isPublic: boolean;
    tags: Array<{ name: string; slug: string }>;
  };
};

export default function SnippetUpsertModal({
  mode,
  open,
  onOpenChange,
  onSuccess,
  initial,
}: SnippetUpsertModalProps) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [allTags, setAllTags] = React.useState<TagOption[]>([]);
  const isLoadingEdit = mode === "edit" && !initial;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      tags: initial?.tags?.map((t) => t.slug) ?? [],
      isPublic: initial?.isPublic ?? true,
      fileName: initial?.fileName ?? "",
      language: initial?.language ?? "Text",
      code: initial?.code ?? "",
    },
  });

  // Refill form when editing
  React.useEffect(() => {
    if (mode === "edit" && initial) {
      reset({
        title: initial.title,
        description: initial.description ?? "",
        tags: initial.tags.map((t) => t.slug),
        isPublic: initial.isPublic,
        fileName: initial.fileName ?? "",
        language: initial.language,
        code: initial.code,
      });
    }
  }, [mode, initial, reset]);

  // Fetch available tags
  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tags");
        if (!res.ok) return;
        const data = await res.json();
        const mapped: TagOption[] = data.map((t: any) => ({
          label: t.name ?? t.label,
          value: t.slug ?? t.value ?? t.name?.toLowerCase(),
        }));
        setAllTags(mapped);
      } catch {
        // ignore error
      }
    })();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        title: data.title,
        description: data.description,
        code: data.code,
        language: data.language,
        isPublic: data.isPublic ?? true,
        fileName: data.fileName,
        tags: data.tags ?? [],
      };

      const endpoint =
        mode === "edit" && initial?.id
          ? `/api/snippets/${initial.id}`
          : `/api/snippets`;
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e?.error || `Failed to ${mode} snippet`);
      }

      const j = await res.json();
      // Inform parent with latest data
      onSuccess?.(j);
      onOpenChange(false);
      if (mode === "create") {
        router.push(`/snippets/${j.id}`);
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Edit Snippet" : "New Snippet"}
            </DialogTitle>
            <DialogDescription>
              {mode === "edit"
                ? "Update your code snippet details"
                : "Create and organize your code snippet"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {isLoadingEdit ? (
          <div className="max-h-[calc(100vh-300px)] space-y-6 overflow-auto px-6 py-5">
            <div className="h-10 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted rounded animate-pulse" />
            <Card className="border-dashed">
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <div className="w-64 h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 w-40 bg-muted rounded animate-pulse" />
                <div className="ml-auto h-10 w-56 bg-muted rounded animate-pulse" />
              </div>
              <div className="p-4">
                <div className="h-64 bg-muted rounded animate-pulse" />
              </div>
            </Card>
          </div>
        ) : (
          <>
            <div className="max-h-[calc(100vh-300px)] space-y-6 overflow-auto px-6 py-5">
              {error && (
                <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              <Input
                placeholder="Snippet title"
                {...register("title")}
                className={cn("text-lg", errors.title && "border-red-500")}
              />
              <Textarea
                rows={3}
                placeholder="Description (optional)"
                {...register("description")}
              />

              <Card className="border-dashed">
                <div className="flex items-center gap-3 border-b px-4 py-3">
                  <div className="w-64">
                    <Input
                      placeholder="fileName (eg: foobar.js)"
                      {...register("fileName")}
                    />
                  </div>

                  <div>
                    <SearchableSelect
                      value={watch("language")}
                      onChange={(v) =>
                        setValue("language", v, { shouldValidate: true })
                      }
                      options={LANGUAGES.map((l) => ({ label: l, value: l }))}
                      placeholder="Text"
                    />
                  </div>

                  <div className="ml-auto">
                    <Controller
                      control={control}
                      name="tags"
                      render={({ field }) => (
                        <TagMultiSelect
                          value={field.value ?? []}
                          onChange={field.onChange}
                          options={allTags}
                          placeholder="Select or create tags"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="p-4">
                  <SnippetFileEditor
                    value={watch("code")}
                    onChange={(v) => setValue("code", v, { shouldValidate: true })}
                    invalid={!!errors.code}
                  />
                  {errors.code && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </Card>
            </div>

            <Separator />

            <SnippetFormFooter
              isPublic={watch("isPublic") ?? true}
              onPublicChange={(v) => setValue("isPublic", v)}
              onDiscard={() => onOpenChange(false)}
              onSave={handleSubmit(onSubmit)}
              saving={saving}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
