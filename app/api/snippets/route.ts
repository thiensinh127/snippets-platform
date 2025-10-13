import { normalizeTags } from "@/constants";
import { authOptions } from "@/lib/auth";
import { AppError, handleApiError } from "@/lib/error-handler";
import { prisma } from "@/lib/prisma";
import { analyzeComplexity, generateSlug } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET all snippets
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || ""; // text search
  const tag = searchParams.get("tag"); // tag slug
  const language = searchParams.get("language") || undefined;
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Math.min(Number(searchParams.get("pageSize") || "12"), 50);
  const skip = (page - 1) * pageSize;

  const where: any = {
    isPublic: true,
    ...(language ? { language } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { code: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(tag
      ? {
          tags: {
            some: { tag: { slug: tag } },
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.snippet.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        tags: { include: { tag: true } },
      },
      skip,
      take: pageSize,
    }),
    prisma.snippet.count({ where }),
  ]);

  return Response.json({
    items: items.map((s) => ({
      ...s,
      tags: s.tags.map((st) => ({ name: st.tag.name, slug: st.tag.slug })),
    })),
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}

// POST create snippet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new AppError("Unauthorized", 401);
    }

    const body = await req.json();
    const { title, description, code, language, tags, fileName, isPublic } =
      body;

    if (!title || !code || !language) {
      throw new AppError(
        "Missing required fields: title, code, and language are required",
        400
      );
    }

    const slug = generateSlug(title);
    const complexity = analyzeComplexity(code);
    const normTags = normalizeTags(tags);

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description,
        code,
        language,
        tags: {
          create: normTags.map((t) => ({
            tag: {
              connectOrCreate: {
                where: { slug: t.slug },
                create: { name: t.name, slug: t.slug },
              },
            },
          })),
        },
        complexity,
        isPublic,
        fileName,
        slug,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
