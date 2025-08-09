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
  "font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f9c54e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a2e] rounded-xl"

const variants: Record<Variant, string> = {
  // Primary action: use design tokens
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:shadow-none",
  // Secondary action
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-60 disabled:shadow-none",
  // Tertiary action (muted)
  tertiary:
    "bg-muted text-muted-foreground hover:bg-muted/90 disabled:opacity-60 disabled:shadow-none",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

export default function AppButton({ className, variantApp = "primary", sizeApp = "md", ...props }: AppButtonProps) {
  return <Button className={cn(base, variants[variantApp], sizes[sizeApp], className)} {...props} />
}
