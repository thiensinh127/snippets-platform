"use client";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGES } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import SnippetFileEditor from "./SnippetFileEditor";
import SnippetFormFooter from "./SnippetFormFooter";
import TagMultiSelect, { TagOption } from "./TagMultiSelect";
import SearchableSelect from "../common/SearchableSelect";

/** schema: 1 file duy nhất */
const schema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
  fileName: z.string().min(1),
  language: z.string().min(1),
  code: z.string().min(1),
});
type FormValues = z.infer<typeof schema>;

export default function NewSnippetModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      isPublic: true,
      fileName: "",
      language: "Text",
      code: "",
    },
  });

  const [allTags, setAllTags] = React.useState<TagOption[]>([]);

  useEffect(() => {
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
      } catch {}
    })();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          code: data.code,
          language: data.language,
          isPublic: data.isPublic,
          fileName: data.fileName,
          tags: data.tags,
        }),
      });
      if (!res.ok) throw new Error("Failed to create snippet");
      const j = await res.json();
      onOpenChange(false);
      router.push(`/snippets/${j.id}`);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[calc(100%-2rem] p-0 overflow-hidden">
          {/* top bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <DialogHeader>
              <DialogTitle>New Snippet</DialogTitle>
              <DialogDescription>
                Create and organize your code snippet
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* body */}
          <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-300px)] overflow-auto">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Title & Description */}
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

            {/* Files header row (fileName + language like screenshot) */}
            <Card className="border-dashed">
              <div className="px-4 py-3 border-b flex items-center gap-3">
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
                <div className="ml-auto ">
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
                  onChange={(v) =>
                    setValue("code", v, { shouldValidate: true })
                  }
                  invalid={!!errors.code}
                />
                {errors.code && (
                  <p className="text-sm text-red-600 mt-2">
                    {errors.code.message}
                  </p>
                )}
              </div>
            </Card>
          </div>

          <Separator />

          {/* footer */}
          <SnippetFormFooter
            isPublic={watch("isPublic")}
            onPublicChange={(v) => setValue("isPublic", v)}
            onDiscard={() => onOpenChange(false)}
            onSave={handleSubmit(onSubmit)}
            saving={saving}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
