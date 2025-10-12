import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppError, handleApiError } from "@/lib/error-handler";
import { analyzeComplexity, generateSlug } from "@/lib/utils";
import { normalizeTags } from "@/constants";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, username: true, name: true, avatar: true },
        },
        tags: { include: { tag: true } },
      },
    });

    if (!snippet) throw new AppError("Snippet not found", 404);

    return NextResponse.json(
      {
        ...snippet,
        tags: snippet.tags.map((st) => ({
          id: st.tag.id,
          name: st.tag.name,
          slug: st.tag.slug,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/snippets/:id
 * */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new AppError("Unauthorized", 401);

    const existing = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true },
    });
    if (!existing) throw new AppError("Snippet not found", 404);
    if (existing.authorId !== session.user.id)
      throw new AppError("Forbidden", 403);

    const body = await req.json();
    const { title, description, code, language, fileName, isPublic, tags } =
      body ?? {};

    const dataUpdate: any = {};
    if (typeof title === "string" && title.trim()) {
      dataUpdate.title = title.trim();
      dataUpdate.slug = generateSlug(title.trim());
    }
    if (typeof description !== "undefined")
      dataUpdate.description = description ?? null;
    if (typeof code === "string") {
      dataUpdate.code = code;
      dataUpdate.complexity = analyzeComplexity(code);
    }
    if (typeof language === "string") dataUpdate.language = language;
    if (typeof fileName !== "undefined") dataUpdate.fileName = fileName ?? null;
    if (typeof isPublic !== "undefined")
      dataUpdate.isPublic = Boolean(isPublic);

    const include = {
      author: {
        select: { id: true, username: true, name: true, avatar: true },
      },
      tags: { include: { tag: true } },
    } as const;

    if (!Array.isArray(tags)) {
      const updated = await prisma.snippet.update({
        where: { id: params.id },
        data: dataUpdate,
        include,
      });
      return NextResponse.json(
        {
          ...updated,
          tags: updated.tags.map((st) => ({
            id: st.tag.id,
            name: st.tag.name,
            slug: st.tag.slug,
          })),
        },
        { status: 200 }
      );
    }

    const normTags = normalizeTags(tags);
    const result = await prisma.$transaction(async (tx) => {
      await tx.snippet.update({
        where: { id: params.id },
        data: dataUpdate,
      });

      await tx.snippetTag.deleteMany({
        where: { snippetId: params.id },
      });

      for (const t of normTags) {
        const tag = await tx.tag.upsert({
          where: { slug: t.slug },
          update: {},
          create: { name: t.name, slug: t.slug },
          select: { id: true },
        });

        await tx.snippetTag.create({
          data: { snippetId: params.id, tagId: tag.id },
        });
      }

      return tx.snippet.findUnique({
        where: { id: params.id },
        include,
      });
    });

    if (!result) throw new AppError("Snippet not found after update", 404);

    return NextResponse.json(
      {
        ...result,
        tags: result.tags.map((st) => ({
          id: st.tag.id,
          name: st.tag.name,
          slug: st.tag.slug,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/snippets/:id

 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new AppError("Unauthorized", 401);

    const existing = await prisma.snippet.findUnique({
      where: { id: params.id },
      select: { id: true, authorId: true },
    });
    if (!existing) throw new AppError("Snippet not found", 404);
    if (existing.authorId !== session.user.id)
      throw new AppError("Forbidden", 403);

    await prisma.snippet.delete({ where: { id: params.id } });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
