import type { ReactNode } from "react"

type SectionProps = {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function Section({ id, title, subtitle, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-16 relative ${className}`}>
      <div className="container mx-auto px-4 max-w-[1200px]">
        <header className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight [text-wrap:balance]">{title}</h3>
          {subtitle ? <p className="text-gray-400 text-lg mt-3">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </section>
  )
}
