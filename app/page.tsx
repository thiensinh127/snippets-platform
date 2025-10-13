import SnippetFeed from "@/components/snippets/SnippetFeed";
import HeroSection from "@/components/common/HeroSection";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { Code2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import type { SnippetDTO } from "@/types/snippet";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();

  // Server-side fetch first page for SnippetFeed (pagination + infinite scroll)
  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = process.env.VERCEL ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/snippets?page=1&pageSize=12`, {
    cache: "no-store",
  });
  type Meta = {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  const data: { items: SnippetDTO[]; meta: Meta } = res.ok
    ? await res.json()
    : { items: [], meta: { page: 1, pageSize: 12, total: 0, totalPages: 0 } };
  const { items: snippets, meta } = data;

  return (
    <div>
      {/* Hero Section */}
      <HeroSection session={session} />

      {/* Snippets Grid */}
      <section className="container mx-auto px-4 py-8">
        {snippets.length === 0 ? (
          <Card className="p-12 text-center">
            <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">{t("home.empty")}</p>
          </Card>
        ) : (
          <SnippetFeed initialItems={snippets} initialMeta={meta} />
        )}
      </section>
    </div>
  );
}
