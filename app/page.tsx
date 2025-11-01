import HeroSection from "@/components/common/HeroSection";
import SnippetGridSkeleton from "@/components/common/SnippetGridSkeleton";
import { InitialFeed } from "@/components/home-page/InitialFeed";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, t] = await Promise.all([
    getServerSession(authOptions),
    getTranslations(),
  ]);

  return (
    <div>
      <HeroSection session={session} />

      <section
        className="container mx-auto px-4 py-8"
        aria-labelledby="snippets-heading"
      >
        <h2 id="snippets-heading" className="sr-only">
          {t("common.codSnippet")}
        </h2>

        <Suspense
          fallback={
            <SnippetGridSkeleton columns="grid-cols-1 md:grid-cols-2 xl:grid-cols-3" />
          }
        >
          <InitialFeed page={1} pageSize={12} />
        </Suspense>
      </section>
    </div>
  );
}
