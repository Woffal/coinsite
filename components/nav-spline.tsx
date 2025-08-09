"use client"

import { useEffect, useRef, useState } from "react"
import { Application } from "@splinetool/runtime"

type NavSplineProps = {
  sceneUrl: string
  className?: string
}

export default function NavSpline({ sceneUrl, className }: NavSplineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const app = new Application(canvas)

    const resizeToContainer = () => {
      const rect = container.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resizeToContainer()

    const ro = new ResizeObserver(resizeToContainer)
    ro.observe(container)

    app
      .load(sceneUrl)
      .then(() => {
        setIsLoaded(true)
        // eslint-disable-next-line no-console
        console.info("NavSpline: scene loaded")
      })
      .catch((err) => {
        setHasError(true)
        // eslint-disable-next-line no-console
        console.warn("NavSpline: failed to load scene", err)
      })

    return () => {
      ro.disconnect()
      // @ts-expect-error dispose may not exist in some versions
      if (typeof app.dispose === "function") app.dispose()
    }
  }, [sceneUrl])

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className || ""}`} aria-hidden>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse-slow" style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.12) 0%, transparent 60%)," +
            "radial-gradient(100% 100% at 100% 20%, rgba(255,255,255,0.08) 0%, transparent 60%)," +
            "radial-gradient(120% 100% at 50% 100%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          filter: "blur(10px) saturate(120%)",
        }} />
      )}
      <canvas ref={canvasRef} className="block w-full h-full" />
      <style jsx>{`
        .animate-pulse-slow { animation: pulseSlow 10s ease-in-out infinite alternate; }
        @keyframes pulseSlow {
          0% { transform: translate3d(-2%, -1%, 0) scale(1.02); }
          50% { transform: translate3d(1%, 2%, 0) scale(1.05); }
          100% { transform: translate3d(-1%, 1%, 0) scale(1.01); }
        }
      `}</style>
    </div>
  )
}


