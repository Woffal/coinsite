"use client"

import { useEffect, useRef } from "react"
import { Application } from "@splinetool/runtime"

type SiteBackgroundProps = {
  sceneUrl?: string
}

export default function SiteBackground({
  sceneUrl = "https://prod.spline.design/7O9kjv5epsGeYONz/scene.splinecode",
}: SiteBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const app = new Application(canvas)

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      const width = rect?.width ?? window.innerWidth
      const height = rect?.height ?? window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resize()
    window.addEventListener("resize", resize)

    let canceled = false
    app.load(sceneUrl).catch(() => {})

    return () => {
      canceled = true
      window.removeEventListener("resize", resize)
      // @ts-expect-error dispose may not be typed in some versions
      if (typeof app.dispose === "function") app.dispose()
    }
  }, [sceneUrl])

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none bg-[#0b0f1d]">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}


