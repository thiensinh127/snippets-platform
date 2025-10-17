import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import SnippetForm from "@/components/snippets/SnippetForm";
import { getCachedSnippet } from "@/lib/cache";

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    redirect(`/login?callbackUrl=/snippets/${id}/edit`);
  }

  const snippet = await getCachedSnippet(id);

  if (!snippet) {
    notFound();
  }

  // Check if user is the author
  if (snippet.authorId !== session.user.id) {
    redirect(`/snippets/${id}`);
  }

  return (
    <SnippetForm
      mode="edit"
      initial={{
        id: snippet.id,
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        fileName: snippet.fileName,
        isPublic: snippet.isPublic,
        tags: snippet.tags.map((t) => ({ name: t.name, slug: t.slug })),
      }}
    />
  );
}
