import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import SnippetForm from "@/components/common/SnippetForm"

export default async function EditSnippetPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const snippet = await prisma.snippet.findUnique({
    where: { id: params.id },
  })

  if (!snippet) {
    notFound()
  }

  if (snippet.authorId !== session.user.id) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Edit Snippet</h1>
        <SnippetForm snippet={snippet} />
      </div>
    </div>
  )
}