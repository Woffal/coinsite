"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type React from "react"
import NavSpline from "./nav-spline"

const navItems = [
  { href: "#custom-amount", label: "Custom" },
  { href: "#standard-packages", label: "Standard" },
  { href: "#premium-packages", label: "Premium" },
  { href: "#faq", label: "FAQ" },
  { href: "#support", label: "Support" },
]

export default function Nav() {
  const [active, setActive] = useState<string>("#standard-packages")
  const [open, setOpen] = useState(false)

  // Track active section
  useEffect(() => {
    const ids = ["custom-amount", "standard-packages", "premium-packages", "faq", "support"]
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

  const handleNavigate = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setActive(href)
    }
  }

  // Desktop side nav with CSS "liquid glass" background (no external deps)
  const DesktopNav = (
    <aside className="hidden md:block fixed left-4 top-24 z-40">
      <div className="relative w-56 rounded-2xl border border-white/10 overflow-hidden p-2 shadow-[0_6px_24px_rgba(0,0,0,0.2)]">
        {/* Spline liquid glass background for NAV ONLY (runtime) */}
        <NavSpline sceneUrl="https://prod.spline.design/TI7oZjQKICYUXDQx/scene.splinecode" className="opacity-50" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl pointer-events-none" aria-hidden />
        <nav className="relative z-10 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = active === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-xl text-sm transition-colors duration-200",
                  isActive ? "bg-white/15 text-white" : "text-gray-200 hover:bg-white/10 hover:text-white",
                )}
                onClick={(e) => handleNavigate(e, item.href)}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )

  return (
    <>
      {DesktopNav}

      {/* Mobile drawer trigger + drawer (fixed top-left) */}
      <div className="md:hidden fixed left-4 top-20 z-40">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open navigation"
              className="h-10 w-10 grid place-items-center rounded-lg text-white bg-white/10 border border-white/10 backdrop-blur-md"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#1a1a2e]/95 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-white font-semibold">Menu</span>
              <button
                aria-label="Close navigation"
                className="h-9 w-9 grid place-items-center rounded-lg bg-[#15203c] text-white"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
               {navItems.map((item) => (
                 <a
                   key={item.href}
                   href={item.href}
                   className={cn(
                     "px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                     active === item.href
                       ? "bg-white/15 text-white"
                       : "text-gray-200 hover:bg-white/10 hover:text-white",
                   )}
                   onClick={(e) => {
                     handleNavigate(e as unknown as React.MouseEvent, item.href)
                     setOpen(false)
                   }}
                 >
                   {item.label}
                 </a>
               ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* No extra styles; Spline iframe provides the liquid look */}
    </>
  )
}
