import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Code2, Edit } from "lucide-react";
import { SnippetCard } from "@/components/common/SnippetCard";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";
import SnippetGridSkeleton from "@/components/common/SnippetGridSkeleton";
import { Tags } from "@/types/snippet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/common/DeleteButton";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default async function PublicSnippetsSection({
  userId,
  isOwn,
}: {
  userId: string;
  isOwn: boolean;
}) {
  const t = await getTranslations();

  // Fetch heavy list for public
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      snippets: {
        where: { isPublic: true },

        orderBy: { updatedAt: "desc" },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;
  const publicSnippets = user.snippets;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          {isOwn ? t("profile.yourSnippets") : t("profile.publicSnippets")}
        </h2>
        <Badge variant="outline" className="text-sm">
          {publicSnippets.length} snippets
        </Badge>
      </div>

      {publicSnippets.length === 0 ? (
        <Card className="p-12 text-center">
          <Code2
            className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"
            aria-hidden
          />
          <p className="text-muted-foreground">{t("profile.noSnippets")}</p>
        </Card>
      ) : (
        <Suspense
          fallback={
            <SnippetGridSkeleton
              columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              count={6}
            />
          }
        >
          {/* Stream inner mapping if you later split into per-card loaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {publicSnippets.map((s) => (
              <SnippetCard
                key={s.id}
                snippet={{
                  id: s.id,
                  title: s.title,
                  description: s.description ?? undefined,
                  code: s.code,
                  language: s.language,
                  fileName: s.fileName ?? undefined,
                  complexity: s.complexity ?? undefined,
                  isPublic: s.isPublic,
                  views: s.views ?? 0,
                  slug: s.slug,
                  createdAt: new Date(s.createdAt),
                  updatedAt: new Date(s.updatedAt ?? s.createdAt),
                  author: {
                    id: user.id,
                    name: user.name ?? user.username,
                    username: user.username,
                    avatarUrl: undefined,
                  },
                  authorId: user.id,
                  tags: s.tags?.map((t: Tags) => ({
                    id: t.tag.id,
                    name: t.tag.name,
                    slug: t.tag.slug,
                  })),
                }}
                compact
                actions={
                  isOwn ? (
                    <>
                      <DropdownMenuItem
                        asChild
                        className="w-full cursor-pointer"
                      >
                        <Link
                          className="w-full flex items-center justify-center gap-2 hover:bg-gray-100"
                          href={`/snippets/${s.id}/edit`}
                        >
                          <Edit className="text-blue-500 h-4 w-4 mr-3" />

                          <span className="font-medium">
                            {t("common.edit")}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        asChild
                        className="w-full cursor-pointer"
                      >
                        <DeleteButton snippetId={s.id} />
                      </DropdownMenuItem>
                    </>
                  ) : undefined
                }
              />
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
}
