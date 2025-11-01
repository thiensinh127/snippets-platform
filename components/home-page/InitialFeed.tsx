import { SnippetDTO } from "@/types/snippet";
import { Code2 } from "lucide-react";
import SnippetFeed from "../snippets/SnippetFeed";
import { Card } from "../ui/card";
type Meta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export async function InitialFeed({
  page = 1,
  pageSize = 12,
}: {
  page?: number;
  pageSize?: number;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  let items: SnippetDTO[] = [];
  let meta: Meta = { page, pageSize, total: 0, totalPages: 0 };

  try {
    const res = await fetch(
      `${baseUrl}/api/snippets?page=${page}&pageSize=${pageSize}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = (await res.json()) as { items: SnippetDTO[]; meta: Meta };
      items = data.items ?? [];
      meta = data.meta ?? meta;
    }
  } catch {}

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-xl text-muted-foreground">No snippets yet</p>
      </Card>
    );
  }

  return <SnippetFeed initialItems={items} initialMeta={meta} />;
}
