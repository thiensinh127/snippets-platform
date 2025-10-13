"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SnippetUpsertModal from "@/components/snippets/SnippetUpsertModal";

type SnippetResp = {
  id: string;
  title: string;
  description?: string | null;
  code: string;
  language: string;
  fileName?: string | null;
  isPublic: boolean;
  tags: Array<{ name: string; slug: string }>;
};

export default function EditSnippetIntercept({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [initial, setInitial] = useState<SnippetResp | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/snippets/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        router.back();
        return;
      }
      const data: SnippetResp = await res.json();
      setInitial(data);
    })();
  }, [id, router]);

  return (
    <SnippetUpsertModal
      mode="edit"
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) router.back();
      }}
      onSuccess={async () => {
        const res = await fetch(`/api/snippets/${id}`, { cache: "no-store" });
        if (res.ok) {
          const data: SnippetResp = await res.json();
          setInitial(data);
        }
        router.refresh();
      }}
      initial={initial ?? undefined}
    />
  );
}
