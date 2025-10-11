import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, analyzeComplexity } from "@/lib/utils"
import { handleApiError, AppError, withErrorHandling } from "@/lib/error-handler"

// GET all snippets
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const language = searchParams.get("language")
    const tag = searchParams.get("tag")
    const authorId = searchParams.get("authorId")

    const where: any = { isPublic: true }

    if (language) where.language = language
    if (tag) where.tags = { has: tag }
    if (authorId) where.authorId = authorId

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(snippets)
  } catch (error) {
    return handleApiError(error)
  }
}

// POST create snippet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      throw new AppError("Unauthorized", 401)
    }

    const body = await req.json()
    const { title, description, code, language, tags } = body

    if (!title || !code || !language) {
      throw new AppError("Missing required fields: title, code, and language are required", 400)
    }

    const slug = generateSlug(title)
    const complexity = analyzeComplexity(code)

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description,
        code,
        language,
        tags: tags || [],
        complexity,
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
      },
    })

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}