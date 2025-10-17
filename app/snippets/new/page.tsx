import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SnippetForm from "@/components/snippets/SnippetForm";

export default async function NewSnippetPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/snippets/new");
  }

  return <SnippetForm mode="create" />;
}
