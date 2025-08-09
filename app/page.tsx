"use client"

import { useState } from "react"
import { ShoppingCart, Shield, Zap, TrendingUp, Crown, ArrowDown, Minus, Plus, ListChecks } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import AppButton from "@/components/app-button"
import Section from "@/components/section"
import PackageCard, { type CoinPackage as PackageType } from "@/components/package-card"
import Nav from "@/components/nav"
import SiteBackground from "@/components/site-background"

const standardPackages: PackageType[] = [
  {
    id: "1",
    name: "Billionaire Pack",
    amount: 1000,
    amountDisplay: "1B",
    price: 45.0,
    originalPrice: 50.0,
    bonus: 100,
    savings: "10% OFF",
    tier: "premium",
  },
  {
    id: "2",
    name: "Tycoon Pack",
    amount: 2500,
    amountDisplay: "2.5B",
    price: 106.25,
    originalPrice: 125.0,
    bonus: 300,
    savings: "15% OFF",
    tier: "premium",
  },
  {
    id: "3",
    name: "Mogul Pack",
    amount: 5000,
    amountDisplay: "5B",
    price: 200.0,
    originalPrice: 250.0,
    popular: true,
    bonus: 750,
    savings: "20% OFF",
    tier: "elite",
  },
]

const premiumPackages: PackageType[] = [
  {
    id: "4",
    name: "Empire Pack",
    amount: 10000,
    amountDisplay: "10B",
    price: 380.0,
    originalPrice: 500.0,
    bonus: 2000,
    savings: "24% OFF",
    tier: "elite",
  },
  {
    id: "5",
    name: "Dynasty Pack",
    amount: 25000,
    amountDisplay: "25B",
    price: 900.0,
    originalPrice: 1250.0,
    bonus: 6000,
    savings: "28% OFF",
    tier: "legendary",
  },
  {
    id: "6",
    name: "Infinite Pack",
    amount: 50000,
    amountDisplay: "50B",
    price: 1750.0,
    originalPrice: 2500.0,
    bonus: 15000,
    savings: "30% OFF",
    tier: "legendary",
  },
]

export default function Page() {
  // Cart
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Custom amount
  const [customAmount, setCustomAmount] = useState(500)

  const addToCart = (packageId: string) => {
    setCart((prev) => ({ ...prev, [packageId]: (prev[packageId] || 0) + 1 }))
  }

  const removeFromCart = (packageId: string) => {
    setCart((prev) => {
      const next = { ...prev }
      if (next[packageId] > 1) next[packageId]--
      else delete next[packageId]
      return next
    })
  }

  const getCartTotal = () => {
    const all = [...standardPackages, ...premiumPackages]
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const pkg = all.find((p) => p.id === id)
      return total + (pkg?.price || 0) * qty
    }, 0)
  }

  const getCartItemCount = () => Object.values(cart).reduce((t, q) => t + q, 0)

  const addCustomToCart = () => {
    const customPackage = {
      id: "custom",
      name: "Custom Pack",
      amount: customAmount,
      amountDisplay: `${customAmount}M`,
      price: customAmount * 0.05,
      tier: "premium" as const,
    }
    setCart((prev) => ({ ...prev, custom: (prev.custom || 0) + 1 }))
    if (typeof window !== "undefined") localStorage.setItem("customPackage", JSON.stringify(customPackage))
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen md:pl-56">
      <SiteBackground />

      {/* Header */}
      <header className="border-b border-white/10 bg-transparent sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-[1200px] py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f9c54e] grid place-items-center shadow">
                <Crown className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-none">Wayward Coins</h1>
                <p className="text-xs text-gray-400">Elite Hypixel Store</p>
              </div>
            </div>
            {/* Navigation and Cart (all breakpoints) */}
            <div className="flex items-center gap-3">
              <Nav />
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Open cart"
                    className="h-10 w-10 grid place-items-center rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-white relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#e9445f] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {getCartItemCount()}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="bg-[#1a1a2e] border-[#15203c]">
                  <SheetHeader>
                    <SheetTitle className="text-white">Shopping Cart</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Review your coin packages before checkout
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {Object.entries(cart).length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <>
                        {Object.entries(cart).map(([packageId, quantity]) => {
                          const all = [...standardPackages, ...premiumPackages]
                          let pkg: any = all.find((p) => p.id === packageId) || null
                          if (packageId === "custom" && typeof window !== "undefined") {
                            const customPkg = localStorage.getItem("customPackage")
                            if (customPkg) pkg = JSON.parse(customPkg)
                          }
                          if (!pkg) return null
                          return (
                            <div
                              key={packageId}
                              className="flex items-center justify-between p-4 border border-white/10 rounded-xl bg-[#15203c]/30 hover:bg-[#15203c]/50 transition-colors duration-200"
                            >
                              <div>
                                <h4 className="font-semibold text-white">{pkg.name}</h4>
                                <p className="text-sm text-gray-400">{pkg.amountDisplay} coins</p>
                                <p className="text-sm font-semibold text-[#f9c54e] tabular-nums">
                                  ${pkg.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <AppButton
                                  variantApp="tertiary"
                                  sizeApp="sm"
                                  onClick={() => removeFromCart(packageId)}
                                  className="w-8 h-8 p-0 grid place-items-center"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </AppButton>
                                <span className="w-8 text-center font-semibold text-white tabular-nums">
                                  {quantity}
                                </span>
                                <AppButton
                                  variantApp="tertiary"
                                  sizeApp="sm"
                                  onClick={() => addToCart(packageId)}
                                  className="w-8 h-8 p-0 grid place-items-center"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </AppButton>
                              </div>
                            </div>
                          )
                        })}
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-center font-bold text-lg text-white bg-[#15203c]/30 p-4 rounded-xl">
                          <span>Total:</span>
                          <span className="text-[#f9c54e] tabular-nums">${getCartTotal().toFixed(2)}</span>
                        </div>
                        <AppButton variantApp="primary" sizeApp="lg" className="w-full">
                          Proceed to Checkout
                        </AppButton>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 text-center">
        <div className="container mx-auto px-4 max-w-[1200px] relative z-10">
          <h2
            className="font-bold text-[#f9c54e] mx-auto"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 3.75rem)",
              lineHeight: 1.1,
              textShadow: "0 0 8px rgba(249,197,78,0.35)",
            }}
          >
            Mint SkyBlock Coins
            <span className="block w-20 md:w-24 h-1 bg-[#f9c54e] rounded-full mx-auto mt-4" />
          </h2>
          <p className="text-xl mt-6 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Dominate Hypixel SkyBlock with Standard (1–5B) and Premium (10–50B) packages. Starting at{" "}
            <span className="font-semibold text-white">$0.045 per million</span>.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <AppButton variantApp="secondary" onClick={() => scrollTo("standard-packages")}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Standard Packages
            </AppButton>
            <AppButton variantApp="primary" onClick={() => scrollTo("premium-packages")}>
              <ArrowDown className="w-4 h-4 mr-2" />
              Premium Packages
            </AppButton>
            <AppButton variantApp="tertiary" onClick={() => scrollTo("custom-amount")}>
              <ListChecks className="w-4 h-4 mr-2" />
              Custom Amount
            </AppButton>
          </div>
        </div>
      </section>

      {/* Custom Amount */}
      <Section id="custom-amount" title="Custom Amount" subtitle="Choose your exact coin amount from 100M to 999M">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#15203c]/50 backdrop-blur-sm border-white/10 rounded-xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-[#e9445f] mb-2 tabular-nums">{customAmount}M</div>
                  <div className="text-gray-400 text-lg">SkyBlock Coins</div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="range"
                      min="100"
                      max="999"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number.parseInt(e.target.value))}
                      className="w-full h-3 bg-[#1a1a2e] rounded-lg appearance-none cursor-pointer slider"
                      aria-label="Select custom coin amount"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>100M</span>
                      <span>999M</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    {[250, 500, 750].map((amount) => (
                      <AppButton
                        key={amount}
                        variantApp={customAmount === amount ? "primary" : "tertiary"}
                        sizeApp="sm"
                        onClick={() => setCustomAmount(amount)}
                      >
                        {amount}M
                      </AppButton>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1a1a2e]/60 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rate per million:</span>
                    <span className="text-white font-semibold">$0.05</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-semibold tabular-nums">{customAmount}M coins</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center text-xl">
                    <span className="text-white font-bold">Total Price:</span>
                    <span className="text-[#f9c54e] font-bold tabular-nums">${(customAmount * 0.05).toFixed(2)}</span>
                  </div>
                </div>

                <AppButton variantApp="primary" sizeApp="lg" className="w-full" onClick={addCustomToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add {customAmount}M Coins to Cart - ${(customAmount * 0.05).toFixed(2)}
                </AppButton>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center py-4 bg-[#15203c]/30 rounded-xl border border-[#0f3461]/30">
                    <p className="text-[#0f3461] mb-3 text-sm font-semibold">Need more?</p>
                    <AppButton variantApp="secondary" onClick={() => scrollTo("standard-packages")}>
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Standard Packages
                    </AppButton>
                  </div>
                  <div className="text-center py-4 bg-[#15203c]/30 rounded-xl border border-[#f9c54e]/30">
                    <p className="text-[#f9c54e] mb-3 text-sm font-semibold">Go big?</p>
                    <AppButton variantApp="primary" onClick={() => scrollTo("premium-packages")}>
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Premium Packages
                    </AppButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Standard Packages */}
      <Section id="standard-packages" title="Standard Packages" subtitle="Perfect for getting started (1B – 5B coins)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {standardPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onAddToCart={addToCart} />
          ))}
        </div>
      </Section>

      {/* Premium Packages */}
      <Section
        id="premium-packages"
        title="Premium Packages"
        subtitle="Elite options for serious players (10B – 50B coins)"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {premiumPackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onAddToCart={addToCart} />
          ))}
        </div>
      </Section>

      {/* Features */}
      <section className="py-16 bg-[#15203c]/30">
        <div className="container mx-auto px-4 max-w-[1200px]">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">Why Choose Us?</h3>
          <p className="text-center text-gray-400 mb-12 text-lg">Trusted by elite SkyBlock players worldwide</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "100% Secure",
                description:
                  "Transactions are protected with industry-best practices. Your account safety is our priority.",
                color: "#0f3461",
              },
              {
                icon: Zap,
                title: "Instant Delivery",
                description: "Receive coins within minutes with our optimized delivery workflow and 24/7 operations.",
                color: "#e9445f",
              },
              {
                icon: TrendingUp,
                title: "Best Value",
                description: "Transparent, competitive pricing with better rates at higher tiers. No hidden fees.",
                color: "#f9c54e",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center transition-transform duration-200 hover:-translate-y-0.5">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl grid place-items-center shadow"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-3 text-white">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" title="FAQ" subtitle="Answers to common questions">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border border-white/10 rounded-xl p-6 bg-[#15203c]/30">
            <h5 className="text-white font-semibold mb-2">How fast is delivery?</h5>
            <p className="text-gray-400">Most orders complete within minutes depending on queue and package size.</p>
          </div>
          <div className="border border-white/10 rounded-xl p-6 bg-[#15203c]/30">
            <h5 className="text-white font-semibold mb-2">Is my account safe?</h5>
            <p className="text-gray-400">
              We use best practices and never request sensitive information beyond what’s necessary.
            </p>
          </div>
          <div className="border border-white/10 rounded-xl p-6 bg-[#15203c]/30">
            <h5 className="text-white font-semibold mb-2">What’s your refund policy?</h5>
            <p className="text-gray-400">If we can’t deliver your order, you’ll receive a full refund.</p>
          </div>
        </div>
      </Section>

      {/* Support */}
      <Section id="support" title="Support" subtitle="We’re here to help">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="border border-white/10 rounded-xl p-6 bg-[#15203c]/30">
            <h5 className="text-white font-semibold mb-2">Contact</h5>
            <p className="text-gray-400">Email support: support@waywardcoins.example</p>
          </div>
          <div className="border border-white/10 rounded-xl p-6 bg-[#15203c]/30">
            <h5 className="text-white font-semibold mb-2">Status</h5>
            <p className="text-gray-400">All systems operational. No incidents reported.</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-transparent">
        <div className="container mx-auto px-4 max-w-[1200px] text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#f9c54e] rounded-lg grid place-items-center">
              <Crown className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Wayward Coins</span>
          </div>
          <p className="mb-4 text-gray-400 text-sm">© {new Date().getFullYear()} Wayward Coins. All rights reserved.</p>
          <p className="text-sm text-gray-500">
            Not affiliated with Mojang Studios or Hypixel Network. Minecraft is a trademark of Mojang Studios.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none; height: 22px; width: 22px; border-radius: 50%; background: #e9445f;
          box-shadow: 0 4px 8px rgba(233, 68, 95, 0.3); cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 22px; width: 22px; border-radius: 50%; background: #e9445f; border: none;
          box-shadow: 0 4px 8px rgba(233, 68, 95, 0.3); cursor: pointer;
        }
        .slider::-webkit-slider-track { background: #15203c; border-radius: 6px; }
        .slider::-moz-range-track { background: #15203c; border-radius: 6px; }
      `}</style>
    </div>
  )
}
