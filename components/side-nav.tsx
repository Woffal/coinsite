"use client"

import { useEffect, useState, type CSSProperties } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Frosted glass (css.glass)
const glassStyles: CSSProperties = {
  background: "rgba(255, 255, 255, 0.14)",
  borderRadius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(7.1px)",
  WebkitBackdropFilter: "blur(7.1px)",
  border: "1px solid rgba(255, 255, 255, 0.76)",
}

const items = [
  { href: "#standard-packages", label: "Standard", src: "/logos/coins.png" },
  { href: "#premium-packages", label: "Premium", src: "/logos/premium.png" },
  { href: "#custom-amount", label: "Custom", src: "/logos/custom.png" },
  { href: "#faq", label: "FAQ", src: "/logos/faq.png" },
  { href: "#support", label: "Support", src: "/logos/support.png" },
]

export default function SideNav() {
  const [active, setActive] = useState<string>("#standard-packages")

  useEffect(() => {
    const ids = ["standard-packages", "premium-packages", "custom-amount", "faq", "support"]
    const observers: IntersectionObserver[] = []
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(`#${id}`)
          })
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <aside className="hidden lg:block fixed left-4 top-24 z-50 p-2" style={glassStyles} aria-label="Section navigation">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = active === item.href
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors",
                isActive ? "bg-white/15" : "hover:bg-white/10",
              )}
              onClick={() => setActive(item.href)}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="shrink-0 rounded-lg overflow-hidden ring-1 ring-white/40">
                <Image
                  src={item.src ?? "/placeholder.svg?height=28&width=28&query=nav%20icon%20fallback"}
                  alt={`${item.label} logo`}
                  width={28}
                  height={28}
                  className="block"
                  priority
                />
              </div>
              <span className="text-sm text-white pr-2">{item.label}</span>
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
