"use client"

import { ShoppingCart, Crown, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppButton from "@/components/app-button"

type Tier = "premium" | "elite" | "legendary"

export type CoinPackage = {
  id: string
  name: string
  amount: number
  amountDisplay: string
  price: number
  originalPrice?: number
  popular?: boolean
  bonus?: number
  savings?: string
  tier: Tier
}

const tierBg: Record<Tier, string> = {
  premium: "bg-[#0f3461]",
  elite: "bg-[#e9445f]",
  legendary: "bg-[#f9c54e]",
}

const tierBorder: Record<Tier, string> = {
  premium: "border-[#0f3461]",
  elite: "border-[#e9445f]",
  legendary: "border-[#f9c54e]",
}

const tierText: Record<Tier, string> = {
  premium: "text-[#0f3461]",
  elite: "text-[#e9445f]",
  legendary: "text-[#f9c54e]",
}

type PackageCardProps = {
  pkg: CoinPackage
  onAddToCart?: (id: string) => void
}

export default function PackageCard({ pkg, onAddToCart = () => {} }: PackageCardProps) {
  return (
    <Card
      className={`group relative bg-[#15203c]/50 backdrop-blur-md border ${tierBorder[pkg.tier]} border-opacity-30 hover:border-opacity-70 transition-transform duration-200 hover:-translate-y-1 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)]`}
    >
      {/* Single emphasis badge only */}
      {pkg.popular ? (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f9c54e] text-black font-semibold shadow">
          <Crown className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      ) : pkg.savings ? (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#e9445f] text-white font-semibold shadow">
          {pkg.savings}
        </Badge>
      ) : null}

      <div
        className={`absolute top-4 left-4 px-2 py-1 rounded-full text-[10px] font-bold ${tierBg[pkg.tier]} text-white`}
      >
        {pkg.tier.toUpperCase()}
      </div>

      <CardHeader className="text-center pb-3 pt-12">
        <CardTitle className="text-white text-lg">{pkg.name}</CardTitle>
        <CardDescription className="text-gray-400">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className={`text-3xl md:text-4xl font-bold ${tierText[pkg.tier]} tabular-nums`}>
              {pkg.amountDisplay}
            </span>
            <span className="text-gray-500">coins</span>
          </div>
          {pkg.bonus ? (
            <div className="flex items-center justify-center gap-1 text-[#f9c54e] font-semibold">
              <Plus className="w-4 h-4" />
              <span className="tabular-nums">{pkg.bonus}M Bonus</span>
            </div>
          ) : null}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-5 p-6 md:p-8">
        <div className="space-y-1">
          <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
            ${pkg.price.toFixed(2)}
          </div>
          {typeof pkg.originalPrice === "number" ? (
            <div className="text-gray-500 line-through text-base tabular-nums">${pkg.originalPrice.toFixed(2)}</div>
          ) : null}
          <div className="text-sm text-gray-500 tabular-nums">${(pkg.price / pkg.amount).toFixed(3)} per million</div>
        </div>
        <AppButton
          variantApp="primary"
          className="w-full"
          onClick={() => onAddToCart(pkg.id)}
          aria-label={`Add ${pkg.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </AppButton>
      </CardContent>
    </Card>
  )
}
