interface StructuredDataProps {
  type: 'website' | 'article' | 'person' | 'organization'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CodeShare",
          "description": "Share code snippets with developers",
          "url": process.env.NEXTAUTH_URL || 'http://localhost:3000',
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }
      
      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Person",
            "name": data.author.name || data.author.username,
            "url": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile/${data.author.username}`
          },
          "publisher": {
            "@type": "Organization",
            "name": "CodeShare",
            "url": process.env.NEXTAUTH_URL || 'http://localhost:3000'
          },
          "datePublished": data.createdAt,
          "dateModified": data.updatedAt,
          "url": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/snippets/${data.id}`,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/snippets/${data.id}`
          }
        }
      
      case 'person':
        return {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": data.name || data.username,
          "url": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile/${data.username}`,
          "description": data.bio,
          "memberOf": {
            "@type": "Organization",
            "name": "CodeShare"
          }
        }
      
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CodeShare",
          "description": "A platform for sharing code snippets with developers",
          "url": process.env.NEXTAUTH_URL || 'http://localhost:3000',
          "logo": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/logo.png`,
          "sameAs": [
            "https://github.com/codeshare",
            "https://twitter.com/codeshare"
          ]
        }
      
      default:
        return {}
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}
