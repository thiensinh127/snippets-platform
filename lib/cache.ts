import { cache } from 'react'

// Cache for database queries
export const getCachedSnippets = cache(async () => {
  const { prisma } = await import('@/lib/prisma')
  
  return prisma.snippet.findMany({
    where: { isPublic: true },
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
    orderBy: { createdAt: "desc" },
    take: 20,
  })
})

export const getCachedLanguages = cache(async () => {
  const { prisma } = await import('@/lib/prisma')
  
  return prisma.snippet.groupBy({
    by: ["language"],
    _count: true,
  })
})

export const getCachedSnippet = cache(async (id: string) => {
  const { prisma } = await import('@/lib/prisma')
  
  return prisma.snippet.findUnique({
    where: { id },
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
})

export const getCachedUserSnippets = cache(async (username: string) => {
  const { prisma } = await import('@/lib/prisma')
  
  return prisma.snippet.findMany({
    where: {
      isPublic: true,
      author: { username },
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
    orderBy: { createdAt: "desc" },
  })
})
