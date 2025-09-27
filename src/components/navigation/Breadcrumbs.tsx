import Link from 'next/link'

interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.href ? (
            <Link href={item.href} className="hover:underline text-foreground">{item.label}</Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="px-2">/</span>}
        </span>
      ))}
    </nav>
  )
}

