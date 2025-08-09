"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"

type Variant = "primary" | "secondary" | "tertiary"
type Size = "sm" | "md" | "lg"

type AppButtonProps = ComponentProps<typeof Button> & {
  variantApp?: Variant
  sizeApp?: Size
}

const base =
  "font-semibold rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9c54e]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-[0.99]"

const variants: Record<Variant, string> = {
  // Primary action: gold gradient
  primary:
    "bg-gradient-to-tr from-[#f9c54e] to-[#f7b733] text-black hover:from-[#ffd76a] hover:to-[#f9c54e] disabled:opacity-60",
  // Secondary action: deep blue
  secondary:
    "bg-[#0f3461] text-white hover:bg-[#12406f] disabled:opacity-60",
  // Tertiary action: subtle glass
  tertiary:
    "bg-white/10 text-white hover:bg-white/15 border border-white/10 disabled:opacity-60",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

export default function AppButton({ className, variantApp = "primary", sizeApp = "md", ...props }: AppButtonProps) {
  return <Button className={cn(base, variants[variantApp], sizes[sizeApp], className)} {...props} />
}
