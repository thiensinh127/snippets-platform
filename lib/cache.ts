import { SnippetDTO, SnippetListItem } from "@/types/snippet";
import { cache } from "react";

// Cache for database queries
export const getCachedSnippets = cache(async (): Promise<SnippetListItem[]> => {
  const { prisma } = await import("@/lib/prisma");

  const rows = await prisma.snippet.findMany({
    where: { isPublic: true },
    include: {
      author: {
        select: { id: true, name: true, username: true, avatar: true },
      },
      tags: {
        include: {
          tag: { select: { id: true, name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return rows.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description ?? undefined,
    code: s.code,
    language: s.language,
    fileName: s.fileName ?? undefined,
    complexity: s.complexity ?? undefined,
    isPublic: s.isPublic,
    views: s.views,
    slug: s.slug,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    author: {
      id: s.author.id,
      name: s.author.name ?? "",
      username: s.author.username,
      avatar: s.author.avatar ?? "",
    },
    tags: s.tags.map((st) => ({
      id: st.tag.id,
      name: st.tag.name,
      slug: st.tag.slug,
    })),
  }));
});

export const getCachedLanguages = cache(async () => {
  const { prisma } = await import("@/lib/prisma");

  return prisma.snippet.groupBy({
    by: ["language"],
    _count: true,
  });
});

export const getCachedSnippet = cache(
  async (id: string): Promise<SnippetDTO | null> => {
    const { prisma } = await import("@/lib/prisma");

    const s = await prisma.snippet.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    if (!s) return null;

    const flatTags = s.tags.map((st) => ({
      id: st.tag.id,
      name: st.tag.name,
      slug: st.tag.slug,
    }));

    const dto: SnippetDTO = {
      id: s.id,
      title: s.title,
      description: s.description ?? undefined,
      code: s.code,
      language: s.language,
      fileName: s.fileName ?? undefined,
      complexity: s.complexity ?? undefined,
      isPublic: s.isPublic,
      views: s.views,
      slug: s.slug,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      author: {
        id: s.author.id,
        name: s.author.name ?? "",
        username: s.author.username,
        avatarUrl: s.author.avatar ?? "",
      },
      authorId: s.author.id,
      tags: flatTags,
    };

    return dto;
  }
);

export const getCachedUserWithSnippets = cache(async (id: string) => {
  const { prisma } = await import("@/lib/prisma");

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      snippets: {
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
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

  return {
    ...user,
    snippets: user.snippets.map((s) => ({
      ...s,
      tags: s.tags.map((st) => st.tag),
    })),
  };
});
