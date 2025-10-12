import LazySnippetCard from "@/components/common/LazySnippetCard";
import HeroSection from "@/components/common/HeroSection";
import { Card } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getCachedSnippets } from "@/lib/cache";
import { Code2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations();

  // Use cached queries for better performance
  const [snippets] = await Promise.all([getCachedSnippets()]);

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
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
            {snippets.map((snippet: any) => (
              <LazySnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
