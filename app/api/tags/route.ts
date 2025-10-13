// app/api/tags/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      _count: { select: { snippets: true } }, // count bảng nối
    },
  });

  return Response.json(
    tags.map((t) => ({ name: t.name, slug: t.slug, count: t._count.snippets }))
  );
}
