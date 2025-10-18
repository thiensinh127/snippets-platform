import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { SnippetCard } from "@/components/common/SnippetCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteButton from "@/components/common/DeleteButton";
import { Suspense } from "react";
import SnippetGridSkeleton from "@/components/common/SnippetGridSkeleton";
import { Tags } from "@/types/snippet";

export default async function PrivateSnippets({
  userId,
  isOwn,
}: {
  userId: string;
  isOwn: boolean;
}) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      snippets: {
        where: { isPublic: false },
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
  const privateSnippets = user.snippets;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          Private Snippets
        </h3>
        <Badge variant="outline" className="text-sm">
          {privateSnippets.length} snippets
        </Badge>
      </div>

      <Suspense
        fallback={
          <SnippetGridSkeleton
            columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            count={6}
          />
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {privateSnippets.map((s) => (
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
                tags: (s.tags ?? []).map((t: Tags) => ({
                  id: t.tag.id,
                  name: t.tag.name,
                  slug: t.tag.slug,
                })),
              }}
              compact
              isPrivate
              actions={
                isOwn ? (
                  <div className="flex items-center gap-2">
                    <Link href={`/snippets/${s.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton isText={false} snippetId={s.id} />
                  </div>
                ) : undefined
              }
            />
          ))}
        </div>
      </Suspense>
    </div>
  );
}
