"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  Lock,
  Globe,
  FileCode,
  Tag as TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import TagMultiSelect, { TagOption } from "./TagMultiSelect";
import SearchableSelect from "../common/SearchableSelect";
import dynamic from "next/dynamic";

const SnippetFileEditor = dynamic(() => import("./SnippetFileEditor"), {
  ssr: false,
});

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

type SnippetFormProps = {
  mode: "create" | "edit";
  onSuccess?: (snippet: { id: string; [key: string]: unknown }) => void;
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

export default function SnippetForm({
  mode,
  onSuccess,
  initial,
}: SnippetFormProps) {
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

  const fileName = watch("fileName");

  React.useEffect(() => {
    if (!fileName) return;

    const ext = fileName.split(".").pop()?.toLowerCase();
    const lang = ext ? LANGUAGES[ext] : undefined;

    if (lang) {
      setValue("language", lang, { shouldValidate: true });
    }
  }, [fileName, setValue]);

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
        const mapped: TagOption[] = data.map(
          (t: {
            name?: string;
            label?: string;
            slug?: string;
            value?: string;
          }) => ({
            label: t.name ?? t.label ?? "",
            value: t.slug ?? t.value ?? t.name?.toLowerCase() ?? "",
          })
        );
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
      router.push(`/snippets/${j.id}`);
      router.refresh();
    } catch (e) {
      const error = e as Error;
      setError(error.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (mode === "edit" && initial?.id) {
      router.push(`/snippets/${initial.id}`);
    } else {
      router.push("/");
    }
  };

  const handleBack = () => {
    if (mode === "edit" && initial?.id) {
      router.push(`/snippets/${initial.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 max-w-6xl pb-32">
        {/* Back Button & Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mb-4 -ml-2 hover:bg-background/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                {mode === "edit" ? "Edit Snippet" : "Create New Snippet"}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {mode === "edit"
                  ? "Update your code snippet details"
                  : "Share your code with the community"}
              </p>
            </div>

            {/* Visibility Badge */}
            <Badge
              variant={watch("isPublic") ? "default" : "secondary"}
              className="flex items-center gap-1.5 px-3 py-1.5"
            >
              {watch("isPublic") ? (
                <>
                  <Globe className="h-3.5 w-3.5" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" />
                  Private
                </>
              )}
            </Badge>
          </div>
        </div>

        {isLoadingEdit ? (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="h-10 w-2/3 bg-muted rounded animate-pulse mb-4" />
              <div className="h-20 w-full bg-muted rounded animate-pulse" />
            </Card>
            <Card>
              <div className="flex items-center gap-3 border-b px-6 py-4">
                <div className="w-64 h-10 bg-muted rounded animate-pulse" />
                <div className="h-10 w-40 bg-muted rounded animate-pulse" />
                <div className="ml-auto h-10 w-56 bg-muted rounded animate-pulse" />
              </div>
              <div className="p-6">
                <div className="h-96 bg-muted rounded animate-pulse" />
              </div>
            </Card>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Basic Info Card */}
            <Card className="overflow-hidden">
              <div className="bg-muted/40 px-6 py-3 border-b">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Basic Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="title"
                    placeholder="Give your snippet a descriptive title..."
                    {...register("title")}
                    className={cn(
                      "text-lg h-11",
                      errors.title &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                    aria-describedby={errors.title ? "title-error" : undefined}
                  />
                  {errors.title && (
                    <p
                      id="title-error"
                      className="text-sm text-red-600 dark:text-red-400"
                    >
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Add a description to help others understand your snippet..."
                    {...register("description")}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional but recommended for better discoverability
                  </p>
                </div>
              </div>
            </Card>

            {/* Code Editor Card */}
            <Card className="overflow-hidden">
              <div className="bg-muted/40 px-6 py-3 border-b">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <FileCode className="h-4 w-4" />
                    Code
                  </h3>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="fileName"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        File:
                      </label>
                      <Input
                        id="fileName"
                        placeholder="example.js"
                        {...register("fileName")}
                        className="h-9 w-48"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="language"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Language:
                      </label>
                      <SearchableSelect
                        value={watch("language")}
                        onChange={(v) =>
                          setValue("language", v, { shouldValidate: true })
                        }
                        options={Object.values(LANGUAGES).map((l) => ({
                          label: l,
                          value: l,
                        }))}
                        placeholder="Select..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <Controller
                        control={control}
                        name="tags"
                        render={({ field }) => (
                          <TagMultiSelect
                            value={field.value ?? []}
                            onChange={field.onChange}
                            options={allTags}
                            placeholder="Add tags..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <SnippetFileEditor
                  value={watch("code")}
                  onChange={(v) =>
                    setValue("code", v, { shouldValidate: true })
                  }
                  invalid={!!errors.code}
                  language={watch("language")}
                />
                {errors.code && (
                  <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.code.message}
                  </p>
                )}
              </div>
            </Card>
          </form>
        )}
      </div>

      {/* Sticky Action Bar */}
      {!isLoadingEdit && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg shadow-lg">
          <div className="container mx-auto px-4 py-3 md:py-4 max-w-6xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              {/* Left: Visibility Toggle */}
              <div className="flex items-center gap-3">
                <Switch
                  id="isPublic"
                  checked={watch("isPublic") ?? true}
                  onCheckedChange={(v) => setValue("isPublic", v)}
                  className="data-[state=checked]:bg-green-600"
                  aria-label="Toggle snippet visibility"
                />
                <div className="flex items-center gap-2">
                  {watch("isPublic") ? (
                    <Globe className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {watch("isPublic") ? "Public" : "Private"}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {watch("isPublic")
                        ? "Anyone can view this snippet"
                        : "Only you can view this snippet"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDiscard}
                  disabled={saving}
                  className="flex-1 sm:flex-none sm:min-w-[100px]"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={saving}
                  aria-label={
                    mode === "edit" ? "Update snippet" : "Create snippet"
                  }
                  className="flex-1 sm:flex-none sm:min-w-[120px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Saving...</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        {mode === "edit" ? "Update" : "Create"} Snippet
                      </span>
                      <span className="sm:hidden">
                        {mode === "edit" ? "Update" : "Create"}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
