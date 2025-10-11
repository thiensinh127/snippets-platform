import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  // Get all public snippets
  const snippets = await prisma.snippet.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  // Get all users with public snippets
  const users = await prisma.user.findMany({
    where: {
      snippets: {
        some: { isPublic: true }
      }
    },
    select: {
      username: true,
      updatedAt: true,
    },
  })

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Snippet pages
  const snippetPages = snippets.map((snippet) => ({
    url: `${baseUrl}/snippets/${snippet.id}`,
    lastModified: snippet.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // User profile pages
  const userPages = users.map((user) => ({
    url: `${baseUrl}/profile/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...snippetPages, ...userPages]
}
