'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Generate JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.mycvbuddy.com${item.href}`,
    })),
  }

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className={`py-4 ${className}`}>
        <ol className="flex items-center flex-wrap gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-600 mx-1" />
              {item.current ? (
                <span
                  className="text-gray-300 font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

// Pre-configured breadcrumbs for common pages
export function BlogPostBreadcrumb({ 
  category, 
  title 
}: { 
  category?: string 
  title: string 
}) {
  const items: BreadcrumbItem[] = [
    { name: 'Blog', href: '/blog' },
  ]
  
  if (category) {
    items.push({ name: category, href: `/blog/category/${category.toLowerCase()}` })
  }
  
  items.push({ name: title, href: '#', current: true })
  
  return <Breadcrumb items={items} />
}
